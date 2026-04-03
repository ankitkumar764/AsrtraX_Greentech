const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Routes
const recommendationRoute = require('./routes/recommendations');
const soilLabsRoute = require('./routes/soilLabs');
const schemesRoute = require('./routes/schemes');

// Use routes
app.use('/api/recommendations', recommendationRoute);
app.use('/api/soil-labs', soilLabsRoute);
app.use('/api/schemes', schemesRoute);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running', timestamp: new Date().toISOString() });
});

// Base endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'KrishiSaarthi AI - Smart Farming Advisor API',
    version: '1.0.0',
    endpoints: {
      health: '/api/health',
      recommendations: '/api/recommendations/get',
      soilLabs: '/api/soil-labs/:state',
      schemes: '/api/schemes/list'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🚀 KrishiSaarthi AI Server running on http://localhost:${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}`);
});

module.exports = app;
