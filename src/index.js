import express from 'express';
import config from './config/config.js';
import { initializeDatabase } from './config/database.js';
import logMiddleware from './middleware/logger.js';
import { validateApiKey } from './middleware/apiKey.js';
import userRoutes from './routes/userRoutes.js';

const app = express();

// Initialize DB before starting routes
await initializeDatabase();

// Global middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(logMiddleware);

// Serve static files from public directory
app.use(express.static('public'));

// Public routes
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the API',
    version: '1.0.0',
    environment: config.nodeEnv,
    endpoints: { users: '/users' }
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// Protected routes
app.use('/users', validateApiKey, userRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: `Route ${req.method} ${req.path} not found`
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal Server Error',
    ...(config.isDevelopment() && { stack: err.stack })
  });
});

// Start server
app.listen(config.port, () => {
  console.log(`Server running on http://localhost:${config.port}`);
  console.log(`Environment: ${config.nodeEnv}`);
  console.log(`API Key protection: ${config.apiKey ? 'ENABLED' : 'DISABLED'}`);
  console.log('\nAPI Endpoints:');
  console.log('  GET    /              - Welcome (public)');
  console.log('  GET    /health        - Health (public)');
  console.log('  GET    /users         - List users (protected)');
  console.log('  GET    /users/:id     - Get user (protected)');
  console.log('  POST   /users         - Create user (protected)');
  console.log('  PUT    /users/:id     - Update user (protected)');
  console.log('  DELETE /users/:id     - Delete user (protected)');
});

export default app;
