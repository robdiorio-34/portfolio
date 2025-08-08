import express from 'express';
import { supabase } from '../services/database.js';
import { requireAdmin, logAdminAction } from '../middleware/auth.js';

const router = express.Router();

// GET /api/books - Get all books (public access)
router.get('/', async (req, res) => {
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

// POST /api/books - Create a new book (admin only)
router.post('/', requireAdmin, logAdminAction, async (req, res) => {
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

// PUT /api/books - Update a book (admin only)
router.put('/', requireAdmin, logAdminAction, async (req, res) => {
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

// DELETE /api/books - Delete a book (admin only)
router.delete('/', requireAdmin, logAdminAction, async (req, res) => {
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

export default router; 