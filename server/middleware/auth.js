import jwt from 'jsonwebtoken';

// Admin authentication middleware using JWT
export const requireAdmin = (req, res, next) => {
  // Check for JWT token in headers or cookies
  const token = req.headers['x-admin-token'] || 
                req.cookies?.adminToken || 
                req.headers['authorization']?.replace('Bearer ', '');
  
  if (!token) {
    return res.status(401).json({ 
      error: 'Admin authentication required',
      message: 'Please log in as admin to perform this action'
    });
  }
  
  try {
    // Verify JWT token
    const secret = process.env.JWT_SECRET || 'fallback-secret-key';
    const decoded = jwt.verify(token, secret);
    
    // Check if token has admin role
    if (decoded.role === 'admin') {
      // Add admin info to request for logging
      req.isAdmin = true;
      req.adminIP = req.ip || req.headers['x-forwarded-for']?.split(',')[0];
      req.adminUser = decoded.userId || 'admin';
      next();
    } else {
      return res.status(401).json({ 
        error: 'Insufficient permissions',
        message: 'Admin role required'
      });
    }
  } catch (error) {
    console.error('JWT verification error:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        error: 'Token expired',
        message: 'Please log in again'
      });
    } else if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        error: 'Invalid token',
        message: 'Please log in again'
      });
    } else {
      return res.status(401).json({ 
        error: 'Authentication failed',
        message: 'Please log in again'
      });
    }
  }
};

// Optional: Add logging for admin actions
export const logAdminAction = (req, res, next) => {
  if (req.isAdmin) {
    console.log(`🔐 Admin action: ${req.method} ${req.path} by user: ${req.adminUser} from IP: ${req.adminIP}`);
  }
  next();
}; 