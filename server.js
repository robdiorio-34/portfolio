import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import helmet from 'helmet';
import fs from 'fs';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
      fontSrc: ["'self'", "https://fonts.gstatic.com", "https://fonts.googleapis.com"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));

// Middleware
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true
}));
app.use(express.json({ limit: '10mb' })); // Limit request body size

// Request validation middleware
const validateRequest = (req, res, next) => {
  // Check content length
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 10 * 1024 * 1024) {
    return res.status(413).json({ error: 'Request too large' });
  }
  
  // Validate JSON for POST requests
  if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  
  next();
};

// API monitoring
const apiMonitor = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`📊 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
};

app.use('/api', apiMonitor);
app.use('/api', validateRequest);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'API is running successfully'
  });
});

// API Routes

// Books API
app.get('/api/books', async (req, res) => {
  try {
    const { status } = req.query;
    let query = supabase.from('books').select('*').order('created_at', { ascending: false });
    
    if (status) {
      query = query.eq('status', status);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Books API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/books', async (req, res) => {
  try {
    const { title, author, genre, cover_url, rating, notes, status, completion_date } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Validate input
    if (title.length > 500 || (author && author.length > 200) || (notes && notes.length > 2000)) {
      return res.status(400).json({ error: 'Input too long' });
    }

    const { data, error } = await supabase
      .from('books')
      .insert([{
        title,
        author,
        genre,
        cover_url,
        rating,
        notes,
        status: status || 'want_to_read',
        completion_date
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Books API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.put('/api/books', async (req, res) => {
  try {
    const { id, title, author, genre, cover_url, rating, notes, status, completion_date } = req.body;
    
    if (!id) {
      return res.status(400).json({ error: 'Book ID is required' });
    }
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Validate input
    if (title.length > 500 || (author && author.length > 200) || (notes && notes.length > 2000)) {
      return res.status(400).json({ error: 'Input too long' });
    }

    const { data, error } = await supabase
      .from('books')
      .update({
        title,
        author,
        genre,
        cover_url,
        rating,
        notes,
        status: status || 'want_to_read',
        completion_date
      })
      .eq('id', id)
      .select();

    if (error) throw error;
    
    if (!data || data.length === 0) {
      return res.status(404).json({ error: 'Book not found' });
    }
    
    res.json(data[0]);
  } catch (error) {
    console.error('Books API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/books', async (req, res) => {
  try {
    const { id } = req.query;
    
    if (!id) {
      return res.status(400).json({ error: 'Book ID is required' });
    }

    const { error } = await supabase
      .from('books')
      .delete()
      .eq('id', id);

    if (error) throw error;
    res.status(204).send();
  } catch (error) {
    console.error('Books API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Comments API
app.get('/api/comments', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    
    // Validate limit
    const limitNum = parseInt(limit);
    if (isNaN(limitNum) || limitNum < 1 || limitNum > 100) {
      return res.status(400).json({ error: 'Invalid limit parameter' });
    }
    
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .eq('active', true) // Only return active comments
      .order('created_at', { ascending: false })
      .limit(limitNum);
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Comments API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/comments', async (req, res) => {
  try {
    const { text, sentiment_score, user_id = 'anonymous' } = req.body;
    
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: 'Comment text is required' });
    }

    // Validate input
    if (text.length > 1000) {
      return res.status(400).json({ error: 'Comment too long' });
    }

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        text: text.trim(),
        sentiment_score: sentiment_score || null,
        user_id,
        active: true // Set new comments as active by default
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Comments API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// New endpoint to deactivate all comments (clear comments)
app.post('/api/comments/clear', async (req, res) => {
  try {
    // Get count of active comments before clearing
    const { count: activeCount, error: countError } = await supabase
      .from('comments')
      .select('*', { count: 'exact', head: true })
      .eq('active', true);
    
    if (countError) {
      console.error('Error counting active comments:', countError);
      return res.status(500).json({ error: countError.message });
    }
    
    // Perform the bulk update
    const { error } = await supabase
      .from('comments')
      .update({ active: false })
      .eq('active', true);

    if (error) {
      console.error('Error updating comments:', error);
      return res.status(500).json({ error: error.message });
    }
    
    console.log(`Bulk clear: Deactivated ${activeCount} comments`);
    res.json({ 
      message: 'All comments deactivated successfully', 
      count: activeCount,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Clear Comments API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Projects API
app.get('/api/projects', async (req, res) => {
  try {
    const { featured } = req.query;
    let query = supabase.from('projects').select('*').order('created_at', { ascending: false });
    
    if (featured !== undefined) {
      query = query.eq('featured', featured === 'true');
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Projects API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/projects', async (req, res) => {
  try {
    const { title, description, github_url, live_url, technologies, featured = false } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }

    // Validate input
    if (title.length > 200 || (description && description.length > 2000)) {
      return res.status(400).json({ error: 'Input too long' });
    }

    const { data, error } = await supabase
      .from('projects')
      .insert([{
        title,
        description,
        github_url,
        live_url,
        technologies: technologies || [],
        featured
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Projects API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Admin API
app.post('/api/admin/login', async (req, res) => {
  try {
    const { password } = req.body;
    
    if (!password) {
      return res.status(400).json({ error: 'Password is required' });
    }

    // Check against environment variable
    const adminPassword = process.env.ADMIN_PASSWORD;
    
    if (!adminPassword) {
      console.error('ADMIN_PASSWORD environment variable not set');
      return res.status(500).json({ error: 'Admin configuration error' });
    }

    if (password === adminPassword) {
      res.json({ 
        success: true, 
        message: 'Login successful',
        timestamp: new Date().toISOString()
      });
    } else {
      res.status(401).json({ error: 'Invalid password' });
    }
  } catch (error) {
    console.error('Admin Login Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// Serve static files and handle SPA routing (only in development)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  // Handle specific HTML page routes FIRST (before static middleware)
  app.get('*.html', (req, res, next) => {
    const requestedPath = req.path;
    const possiblePageFile = path.join(__dirname, 'public', 'pages', requestedPath);
    
    if (fs.existsSync(possiblePageFile)) {
      return res.sendFile(possiblePageFile);
    }
    
    // If not found in pages, let static middleware handle it
    next();
  });
  
  // Serve static files from public directory (for assets, scripts, styles, components, etc.)
  app.use(express.static('public'));
  
  // Handle all other routes for SPA (Single Page Application)
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server locally (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Static files served from /public directory`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
export default app; 