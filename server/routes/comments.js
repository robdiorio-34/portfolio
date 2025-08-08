import express from 'express';
import { supabase } from '../services/database.js';
import { sanitizeInput, validateCommentInput } from '../middleware/validation.js';

const router = express.Router();

// GET /api/comments - Get all comments
router.get('/', async (req, res) => {
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

// POST /api/comments - Create a new comment
router.post('/', sanitizeInput, validateCommentInput, async (req, res) => {
  try {
    const commentData = req.validatedData;
    
    const { data, error } = await supabase
      .from('comments')
      .insert([{
        text: commentData.message.trim(),
        sentiment_score: null, // Will be calculated by trigger
        user_id: commentData.name,
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

// POST /api/comments/clear - Clear all comments
router.post('/clear', async (req, res) => {
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

export default router; 