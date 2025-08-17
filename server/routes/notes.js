import express from 'express';
import { supabase } from '../services/database.js';
import { requireAdmin, logAdminAction } from '../middleware/auth.js';
import { sanitizeInput, validateNoteInput, validateNoteUpdate } from '../middleware/validation.js';

const router = express.Router();

// GET /api/notes - Get all notes (public access)
router.get('/', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .order('published_date', { ascending: false });

    if (error) throw error;
    res.json(data);
  } catch (error) {
    console.error('Notes API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// GET /api/notes/:id - Get a specific note (public access)
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    const { data, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Note not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Notes API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// POST /api/notes - Create a new note (admin only)
router.post('/', sanitizeInput, validateNoteInput, requireAdmin, logAdminAction, async (req, res) => {
  try {
    const noteData = req.validatedData;
    
    const { data, error } = await supabase
      .from('notes')
      .insert([{
        ...noteData,
        published_date: noteData.published_date || new Date().toISOString().split('T')[0]
      }])
      .select()
      .single();

    if (error) throw error;
    res.status(201).json(data);
  } catch (error) {
    console.error('Notes API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/notes/:id - Update a note (admin only)
router.put('/:id', sanitizeInput, validateNoteUpdate, requireAdmin, logAdminAction, async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.validatedData;
    
    // Remove id from update data since it's in the URL
    delete updateData.id;
    
    const { data, error } = await supabase
      .from('notes')
      .update(updateData)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Note not found' });
      }
      throw error;
    }

    res.json(data);
  } catch (error) {
    console.error('Notes API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/notes/:id - Delete a note (admin only)
router.delete('/:id', requireAdmin, logAdminAction, async (req, res) => {
  try {
    const { id } = req.params;
    
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      if (error.code === 'PGRST116') {
        return res.status(404).json({ error: 'Note not found' });
      }
      throw error;
    }

    res.status(204).send();
  } catch (error) {
    console.error('Notes API Error:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router; 