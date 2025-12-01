const express = require('express');
const router = express.Router();
const { datastore } = require('../datastore');

// GET /api/v1/securities - List all securities
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.securities,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/securities/:securityId - Get security by ID
router.get('/:securityId', (req, res) => {
  const security = datastore.securities.find(s => s.securityId === req.params.securityId);
  
  if (!security) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Security not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: security,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/securities/symbol/:symbol - Get security by symbol
router.get('/symbol/:symbol', (req, res) => {
  const security = datastore.securities.find(s => s.symbol === req.params.symbol.toUpperCase());
  
  if (!security) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Security not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: security,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/securities/type/:type - Get securities by type
router.get('/type/:type', (req, res) => {
  const securities = datastore.securities.filter(s => s.securityType === req.params.type.toUpperCase());
  
  res.json({
    success: true,
    data: securities,
    timestamp: new Date().toISOString()
  });
});

// PUT /api/v1/securities/:securityId - Update security (for demo price updates)
router.put('/:securityId', (req, res) => {
  const index = datastore.securities.findIndex(s => s.securityId === req.params.securityId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Security not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const security = datastore.securities[index];
  
  // If price is being updated, recalculate day change
  if (req.body.currentPrice !== undefined) {
    security.previousClose = security.currentPrice;
    security.currentPrice = req.body.currentPrice;
    security.dayChange = security.currentPrice - security.previousClose;
    security.dayChangePercent = parseFloat(((security.dayChange / security.previousClose) * 100).toFixed(2));
  }
  
  datastore.securities[index] = {
    ...security,
    ...req.body,
    securityId: req.params.securityId,
    lastUpdated: new Date().toISOString()
  };
  
  // Update all holdings with this security
  datastore.holdings.forEach(holding => {
    if (holding.securityId === req.params.securityId) {
      holding.currentPrice = datastore.securities[index].currentPrice;
      holding.marketValue = holding.quantity * holding.currentPrice;
      holding.unrealizedGain = holding.marketValue - holding.totalCostBasis;
      holding.unrealizedGainPercent = parseFloat(((holding.unrealizedGain / holding.totalCostBasis) * 100).toFixed(2));
      holding.updatedAt = new Date().toISOString();
    }
  });
  
  res.json({
    success: true,
    data: datastore.securities[index],
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

