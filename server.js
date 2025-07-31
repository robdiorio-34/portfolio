import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

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

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

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

// Comments API
app.get('/api/comments', async (req, res) => {
  try {
    const { limit = 50 } = req.query;
    const { data, error } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(parseInt(limit));
    
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

    const { data, error } = await supabase
      .from('comments')
      .insert([{
        text: text.trim(),
        sentiment_score: sentiment_score || null,
        user_id
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

// Catch-all route for static files and SPA routing
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
  console.log(`🌐 Static files served from /public directory`);
}); 