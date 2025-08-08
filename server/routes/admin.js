import express from 'express';
import { adminLoginLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

// POST /api/admin/login - Admin login (with rate limiting)
router.post('/login', adminLoginLimiter, async (req, res) => {
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

export default router; 