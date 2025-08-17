import express from 'express';
import dotenv from 'dotenv';

// Import middleware
import { securityMiddleware, corsMiddleware } from './middleware/security.js';
import { validateRequest } from './middleware/validation.js';
import { apiMonitor } from './middleware/monitoring.js';

// Import routes
import booksRouter from './routes/books.js';
import commentsRouter from './routes/comments.js';
import projectsRouter from './routes/projects.js';
import notesRouter from './routes/notes.js';
import adminRouter from './routes/admin.js';
import healthRouter from './routes/health.js';

// Import utilities
import { setupStaticServing } from './utils/static.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Apply middleware
app.use(securityMiddleware);
app.use(corsMiddleware);
app.use(express.json({ limit: '10mb' })); // Limit request body size

// Apply API middleware
app.use('/api', apiMonitor);
app.use('/api', validateRequest);

// API Routes
app.use('/api/books', booksRouter);
app.use('/api/comments', commentsRouter);
app.use('/api/projects', projectsRouter);
app.use('/api/notes', notesRouter);
app.use('/api/admin', adminRouter);
app.use('/api/health', healthRouter);

// Setup static file serving
setupStaticServing(app);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server locally (only if not in Vercel environment)
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📚 API endpoints available at http://localhost:${PORT}/api`);
    console.log(`🌐 Static files served from /public directory`);
    console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
  });
}

// Export for Vercel
export default app; 