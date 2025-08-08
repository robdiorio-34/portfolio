# Server Architecture

This directory contains the modular server implementation, breaking down the original 444-line `server.js` monolith into focused, maintainable modules.

## Directory Structure

```
server/
├── index.js              # Main server entry point
├── middleware/           # Express middleware
│   ├── security.js      # Helmet and CORS configuration
│   ├── validation.js    # Request validation
│   └── monitoring.js    # API monitoring and logging
├── routes/              # API route handlers
│   ├── books.js         # Books CRUD operations
│   ├── comments.js      # Comments CRUD operations
│   ├── projects.js      # Projects CRUD operations
│   ├── admin.js         # Admin authentication
│   └── health.js        # Health check endpoint
├── services/            # Business logic and external services
│   └── database.js      # Supabase client initialization
├── utils/               # Utility functions
│   └── static.js        # Static file serving for development
└── README.md           # This file
```

## Module Responsibilities

### `index.js`

- Express app initialization
- Middleware registration
- Route registration
- Error handling
- Server startup (local development)

### `middleware/`

- **`security.js`**: Helmet CSP configuration and CORS setup
- **`validation.js`**: Request size and content-type validation
- **`monitoring.js`**: API request logging and performance monitoring

### `routes/`

- **`books.js`**: GET, POST, PUT, DELETE operations for books
- **`comments.js`**: GET, POST operations for comments + clear endpoint
- **`projects.js`**: GET, POST operations for projects
- **`admin.js`**: POST login endpoint for admin authentication
- **`health.js`**: GET health check endpoint

### `services/`

- **`database.js`**: Supabase client initialization and configuration

### `utils/`

- **`static.js`**: Static file serving and SPA routing for development

## Benefits

1. **Separation of Concerns**: Each module has a single responsibility
2. **Maintainability**: Easier to find and modify specific functionality
3. **Testability**: Individual modules can be tested in isolation
4. **Scalability**: New routes and middleware can be added without cluttering main file
5. **Readability**: Much easier to understand the codebase structure

## Deployment

- **Local Development**: `npm start` runs `server/index.js`
- **Vercel**: `vercel.json` points to `server/index.js` for serverless functions
- **Static Files**: Served from `/public` directory via Vercel's static hosting

## Migration Notes

- All original functionality preserved
- API endpoints remain unchanged
- Environment variables work the same
- Vercel deployment configuration updated
- Backup of original `server.js` saved as `server.js.backup`
