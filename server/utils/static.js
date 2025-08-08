import express from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Static file serving middleware (only in development)
export const setupStaticServing = (app) => {
  if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    // Handle specific HTML page routes FIRST (before static middleware)
    app.get('*.html', (req, res, next) => {
      const requestedPath = req.path;
      const possiblePageFile = path.join(__dirname, '../../public', 'pages', requestedPath);
      
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
      res.sendFile(path.join(__dirname, '../../public', 'index.html'));
    });
  }
}; 