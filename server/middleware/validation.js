// Request validation middleware
export const validateRequest = (req, res, next) => {
  // Check content length
  if (req.headers['content-length'] && parseInt(req.headers['content-length']) > 10 * 1024 * 1024) {
    return res.status(413).json({ error: 'Request too large' });
  }
  
  // Validate JSON for POST requests
  if (req.method === 'POST' && req.headers['content-type'] !== 'application/json') {
    return res.status(400).json({ error: 'Content-Type must be application/json' });
  }
  
  next();
}; 