// API monitoring middleware
export const apiMonitor = (req, res, next) => {
  const start = Date.now();
  const originalSend = res.send;
  
  res.send = function(data) {
    const duration = Date.now() - start;
    console.log(`📊 ${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
    
    // Log slow requests
    if (duration > 1000) {
      console.warn(`⚠️  Slow request: ${req.method} ${req.path} took ${duration}ms`);
    }
    
    originalSend.call(this, data);
  };
  
  next();
}; 