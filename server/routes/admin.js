import express from 'express';
import jwt from 'jsonwebtoken';
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
      // Generate JWT token for admin
      const secret = process.env.JWT_SECRET || 'fallback-secret-key';
      const token = jwt.sign(
        { 
          role: 'admin', 
          userId: 'rob-diorio',
          loginTime: new Date().toISOString()
        },
        secret,
        { expiresIn: '24h' } // Token expires in 24 hours
      );
      
      res.json({ 
        success: true, 
        message: 'Login successful',
        adminToken: token, // JWT token
        expiresIn: '24h',
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