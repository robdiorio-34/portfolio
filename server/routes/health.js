import express from 'express';

const router = express.Router();

// GET /api/health - Health check endpoint
router.get('/', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    message: 'API is running successfully'
  });
});

export default router; 