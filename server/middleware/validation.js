import Joi from 'joi';

// Validation schemas
const bookSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  author: Joi.string().trim().min(1).max(100).required()
    .messages({
      'string.empty': 'Author cannot be empty',
      'string.min': 'Author must be at least 1 character long',
      'string.max': 'Author cannot exceed 100 characters'
    }),
  genre: Joi.string().trim().max(50).optional()
    .messages({
      'string.max': 'Genre cannot exceed 50 characters'
    }),
  cover_url: Joi.string().uri().max(500).optional()
    .messages({
      'string.uri': 'Cover URL must be a valid URL',
      'string.max': 'Cover URL cannot exceed 500 characters'
    }),
  rating: Joi.number().min(1).max(5).integer().optional()
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'number.base': 'Rating must be a number'
    }),
  notes: Joi.string().trim().max(2000).optional()
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters'
    }),
  status: Joi.string().valid('currently_reading', 'want_to_read', 'have_read').required()
    .messages({
      'any.only': 'Status must be exactly one of: "currently_reading", "want_to_read", or "have_read" (use underscores, not spaces)'
    })
});

// Schema for book updates (more flexible for partial updates)
const bookUpdateSchema = Joi.object({
  id: Joi.string().uuid().required()
    .messages({
      'string.guid': 'Book ID must be a valid UUID',
      'any.required': 'Book ID is required for updates'
    }),
  title: Joi.string().trim().min(1).max(200).optional()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  author: Joi.string().trim().min(1).max(100).optional()
    .messages({
      'string.empty': 'Author cannot be empty',
      'string.min': 'Author must be at least 1 character long',
      'string.max': 'Author cannot exceed 100 characters'
    }),
  genre: Joi.string().trim().max(50).optional().allow('', null)
    .messages({
      'string.max': 'Genre cannot exceed 50 characters'
    }),
  cover_url: Joi.string().uri().max(500).optional().allow('', null)
    .messages({
      'string.uri': 'Cover URL must be a valid URL',
      'string.max': 'Cover URL cannot exceed 500 characters'
    }),
  rating: Joi.number().min(1).max(5).integer().optional().allow(null)
    .messages({
      'number.min': 'Rating must be between 1 and 5',
      'number.max': 'Rating must be between 1 and 5',
      'number.base': 'Rating must be a number'
    }),
  notes: Joi.string().trim().max(2000).optional().allow('', null)
    .messages({
      'string.max': 'Notes cannot exceed 2000 characters'
    }),
  status: Joi.string().valid('currently_reading', 'want_to_read', 'have_read').optional()
    .messages({
      'any.only': 'Status must be exactly one of: "currently_reading", "want_to_read", or "have_read" (use underscores, not spaces)'
    }),
  completion_date: Joi.date().optional().allow(null, '')
});

const commentSchema = Joi.object({
  name: Joi.string().trim().min(1).max(50).required()
    .messages({
      'string.empty': 'Name cannot be empty',
      'string.min': 'Name must be at least 1 character long',
      'string.max': 'Name cannot exceed 50 characters'
    }),
  message: Joi.string().trim().min(1).max(1000).required()
    .messages({
      'string.empty': 'Message cannot be empty',
      'string.min': 'Message must be at least 1 character long',
      'string.max': 'Message cannot exceed 1000 characters'
    }),
  timestamp: Joi.date().default(() => new Date())
});

const projectSchema = Joi.object({
  title: Joi.string().trim().min(1).max(200).required()
    .messages({
      'string.empty': 'Title cannot be empty',
      'string.min': 'Title must be at least 1 character long',
      'string.max': 'Title cannot exceed 200 characters'
    }),
  description: Joi.string().trim().min(1).max(1000).required()
    .messages({
      'string.empty': 'Description cannot be empty',
      'string.min': 'Description must be at least 1 character long',
      'string.max': 'Description cannot exceed 1000 characters'
    }),
  technologies: Joi.array().items(Joi.string().trim().max(50)).max(20).optional()
    .messages({
      'array.max': 'Cannot have more than 20 technologies'
    }),
  github_url: Joi.string().uri().max(500).optional()
    .messages({
      'string.uri': 'GitHub URL must be a valid URL',
      'string.max': 'GitHub URL cannot exceed 500 characters'
    }),
  live_url: Joi.string().uri().max(500).optional()
    .messages({
      'string.uri': 'Live URL must be a valid URL',
      'string.max': 'Live URL cannot exceed 500 characters'
    }),
  featured: Joi.boolean().default(false),
  image_url: Joi.string().uri().max(500).optional()
    .messages({
      'string.uri': 'Image URL must be a valid URL',
      'string.max': 'Image URL cannot exceed 500 characters'
    })
});

// Sanitization function - Remove HTML tags and scripts
export const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        // Remove HTML tags and scripts
        req.body[key] = req.body[key]
          .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
          .replace(/<[^>]*>/g, '') // Remove all HTML tags
          .replace(/javascript:/gi, '') // Remove javascript: protocol
          .replace(/on\w+\s*=/gi, '') // Remove event handlers
          .trim();
      }
    });
  }
  next();
};

// Enhanced validation middleware with better error messages
export const validateBookInput = (req, res, next) => {
  const { error, value } = bookSchema.validate(req.body);
  if (error) {
    // Create more helpful error messages
    const errorMessages = error.details.map(detail => {
      const field = detail.path.join('.');
      const message = detail.message;
      
      // Add specific help for common issues
      if (field === 'status' && detail.type === 'any.only') {
        // Check if user used spaces instead of underscores
        const providedStatus = req.body.status;
        let additionalHelp = '';
        
        if (providedStatus) {
          if (providedStatus.includes(' ')) {
            const correctedStatus = providedStatus.replace(/\s+/g, '_');
            additionalHelp = ` (Did you mean "${correctedStatus}"? Use underscores, not spaces)`;
          } else if (providedStatus === 'currently reading') {
            additionalHelp = ' (Did you mean "currently_reading"?)';
          } else if (providedStatus === 'want to read') {
            additionalHelp = ' (Did you mean "want_to_read"?)';
          } else if (providedStatus === 'have read') {
            additionalHelp = ' (Did you mean "have_read"?)';
          } else if (providedStatus === 'reading') {
            additionalHelp = ' (Did you mean "currently_reading"?)';
          } else if (providedStatus === 'completed') {
            additionalHelp = ' (Did you mean "have_read"?)';
          }
        }
        
        return `${message}${additionalHelp}`;
      }
      
      return `${field}: ${message}`;
    });
    
    return res.status(400).json({ 
      error: 'Book validation failed', 
      details: errorMessages,
      help: {
        status: 'Valid status values: "currently_reading", "want_to_read", "have_read" (use underscores, not spaces)',
        status_examples: {
          'currently_reading': 'for books you are currently reading',
          'want_to_read': 'for books you want to read in the future',
          'have_read': 'for books you have finished reading'
        },
        required_fields: 'Title and author are required',
        rating: 'Rating must be a number between 1 and 5'
      }
    });
  }
  req.validatedData = value;
  next();
};

// Validation for book updates (more flexible)
export const validateBookUpdate = (req, res, next) => {
  const { error, value } = bookUpdateSchema.validate(req.body);
  if (error) {
    // Create more helpful error messages
    const errorMessages = error.details.map(detail => {
      const field = detail.path.join('.');
      const message = detail.message;
      
      // Add specific help for common issues
      if (field === 'status' && detail.type === 'any.only') {
        // Check if user used spaces instead of underscores
        const providedStatus = req.body.status;
        let additionalHelp = '';
        
        if (providedStatus) {
          if (providedStatus.includes(' ')) {
            const correctedStatus = providedStatus.replace(/\s+/g, '_');
            additionalHelp = ` (Did you mean "${correctedStatus}"? Use underscores, not spaces)`;
          } else if (providedStatus === 'currently reading') {
            additionalHelp = ' (Did you mean "currently_reading"?)';
          } else if (providedStatus === 'want to read') {
            additionalHelp = ' (Did you mean "want_to_read"?)';
          } else if (providedStatus === 'have read') {
            additionalHelp = ' (Did you mean "have_read"?)';
          } else if (providedStatus === 'reading') {
            additionalHelp = ' (Did you mean "currently_reading"?)';
          } else if (providedStatus === 'completed') {
            additionalHelp = ' (Did you mean "have_read"?)';
          }
        }
        
        return `${message}${additionalHelp}`;
      }
      
      return `${field}: ${message}`;
    });
    
    return res.status(400).json({ 
      error: 'Book update validation failed', 
      details: errorMessages,
      help: {
        status: 'Valid status values: "currently_reading", "want_to_read", "have_read" (use underscores, not spaces)',
        status_examples: {
          'currently_reading': 'for books you are currently reading',
          'want_to_read': 'for books you want to read in the future',
          'have_read': 'for books you have finished reading'
        },
        rating: 'Rating must be a number between 1 and 5 (or leave empty)',
        optional_fields: 'All fields except ID are optional for updates'
      }
    });
  }
  
  // Clean up empty strings and convert to null for optional fields
  const cleanedData = { ...value };
  ['genre', 'cover_url', 'notes', 'completion_date'].forEach(field => {
    if (cleanedData[field] === '') {
      cleanedData[field] = null;
    }
  });
  
  req.validatedData = cleanedData;
  next();
};

export const validateCommentInput = (req, res, next) => {
  const { error, value } = commentSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details.map(detail => {
      const field = detail.path.join('.');
      const message = detail.message;
      return `${field}: ${message}`;
    });
    
    return res.status(400).json({ 
      error: 'Comment validation failed', 
      details: errorMessages,
      help: {
        required_fields: 'Name and message are required',
        message_length: 'Message must be between 1 and 1000 characters'
      }
    });
  }
  req.validatedData = value;
  next();
};

export const validateProjectInput = (req, res, next) => {
  const { error, value } = projectSchema.validate(req.body);
  if (error) {
    const errorMessages = error.details.map(detail => {
      const field = detail.path.join('.');
      const message = detail.message;
      return `${field}: ${message}`;
    });
    
    return res.status(400).json({ 
      error: 'Project validation failed', 
      details: errorMessages,
      help: {
        required_fields: 'Title and description are required',
        technologies: 'Technologies should be an array of strings (max 20 items)',
        urls: 'GitHub and live URLs must be valid URLs'
      }
    });
  }
  req.validatedData = value;
  next();
};

// Generic request validation (content length, content type)
export const validateRequest = (req, res, next) => {
  // Check content length
  const contentLength = parseInt(req.headers['content-length'], 10);
  if (contentLength && contentLength > 10 * 1024 * 1024) { // 10MB limit
    return res.status(413).json({ error: 'Request too large' });
  }

  // Check content type for POST/PUT requests
  if ((req.method === 'POST' || req.method === 'PUT') && req.headers['content-type']) {
    if (!req.headers['content-type'].includes('application/json')) {
      return res.status(400).json({ error: 'Content-Type must be application/json' });
    }
  }

  next();
}; 