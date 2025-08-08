import rateLimit from 'express-rate-limit';

// Rate limiter for admin login - 5 attempts per 5 minutes
export const adminLoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // 5 attempts per window
  message: { 
    error: 'Too many login attempts. Please try again in 5 minutes.' 
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  // Use a more reliable key generator
  keyGenerator: (req) => {
    // Use IP address or a combination of IP and user agent
    return req.ip || req.connection.remoteAddress || 'unknown';
  },
  // Skip successful requests (don't count successful logins)
  skipSuccessfulRequests: true,
  // Skip failed requests that are not 401 (don't count other errors)
  skipFailedRequests: false,
  handler: (req, res) => {
    console.log('Rate limit exceeded for admin login:', req.ip);
    res.status(429).json({
      error: 'Too many login attempts. Please try again in 5 minutes.',
      retryAfter: Math.ceil(5 * 60 / 1000) // 5 minutes in seconds
    });
  },
  // Add some debugging
  onLimitReached: (req, res, options) => {
    console.log('Rate limit reached for admin login from IP:', req.ip);
  }
}); 