const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const { seedData } = require('./seed');

// Create Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(morgan('dev'));

// Swagger API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Portfolio Management System API',
  customfavIcon: '/favicon.ico'
}));

// Import routes
const clientsRouter = require('./routes/clients');
const accountsRouter = require('./routes/accounts');
const portfoliosRouter = require('./routes/portfolios');
const holdingsRouter = require('./routes/holdings');
const transactionsRouter = require('./routes/transactions');
const securitiesRouter = require('./routes/securities');
const dashboardRouter = require('./routes/dashboard');

// API Routes
app.use('/api/v1/clients', clientsRouter);
app.use('/api/v1/accounts', accountsRouter);
app.use('/api/v1/portfolios', portfoliosRouter);
app.use('/api/v1/holdings', holdingsRouter);
app.use('/api/v1/transactions', transactionsRouter);
app.use('/api/v1/securities', securitiesRouter);
app.use('/api/v1/dashboard', dashboardRouter);

// Serve static files from React app in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'public')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
  });
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// 404 handler for API routes
app.use('/api/*', (req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'NOT_FOUND',
      message: 'API endpoint not found'
    },
    timestamp: new Date().toISOString()
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    success: false,
    error: {
      code: 'INTERNAL_ERROR',
      message: err.message || 'Internal server error'
    },
    timestamp: new Date().toISOString()
  });
});

// Initialize data and start server
console.log('🚀 Starting Portfolio Management System...');
seedData();

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📊 API available at http://localhost:${PORT}/api/v1`);
  console.log(`📚 Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`❤️  Health check: http://localhost:${PORT}/health`);
});

