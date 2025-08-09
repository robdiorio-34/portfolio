import express from 'express';
import { supabase } from '../services/database.js';
import { requireAdmin, logAdminAction } from '../middleware/auth.js';
import { sanitizeInput, validateBookInput, validateBookUpdate } from '../middleware/validation.js';

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
router.post('/', sanitizeInput, validateBookInput, requireAdmin, logAdminAction, async (req, res) => {
  try {
    const bookData = req.validatedData;
    
    const { data, error } = await supabase
      .from('books')
      .insert([{
        ...bookData,
        status: bookData.status || 'want_to_read' // Default to want_to_read if not provided
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
router.put('/', sanitizeInput, validateBookUpdate, requireAdmin, logAdminAction, async (req, res) => {
  try {
    const { id, ...bookData } = req.validatedData;
    
    // Remove null values to avoid overwriting with null
    const updateData = {};
    Object.keys(bookData).forEach(key => {
      if (bookData[key] !== null && bookData[key] !== undefined) {
        updateData[key] = bookData[key];
      }
    });

    const { data, error } = await supabase
      .from('books')
      .update(updateData)
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