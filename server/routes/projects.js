import express from 'express';
import { supabase } from '../services/database.js';
import { requireAdmin, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// GET /api/projects - Get all projects (public access)
router.get('/', async (req, res) => {
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

// POST /api/projects - Create a new project (admin only)
router.post('/', requireAdmin, logAdminAction, async (req, res) => {
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

export default router; 