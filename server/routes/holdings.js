const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');

// GET /api/v1/holdings - List all holdings
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.holdings,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/holdings/:holdingId - Get holding by ID
router.get('/:holdingId', (req, res) => {
  const holding = datastore.holdings.find(h => h.holdingId === req.params.holdingId);
  
  if (!holding) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Holding not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: holding,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/portfolios/:portfolioId/holdings - Get holdings for portfolio
router.get('/portfolio/:portfolioId', (req, res) => {
  const holdings = datastore.holdings.filter(h => h.portfolioId === req.params.portfolioId);
  
  res.json({
    success: true,
    data: holdings,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/holdings - Create new holding
router.post('/', (req, res) => {
  // Get security to fetch current price
  const security = datastore.securities.find(s => s.securityId === req.body.securityId);
  
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
  
  const quantity = req.body.quantity;
  const averageCostBasis = req.body.averageCostBasis;
  const totalCostBasis = quantity * averageCostBasis;
  const marketValue = quantity * security.currentPrice;
  const unrealizedGain = marketValue - totalCostBasis;
  const unrealizedGainPercent = (unrealizedGain / totalCostBasis) * 100;
  
  const newHolding = {
    holdingId: generateId('holding'),
    portfolioId: req.body.portfolioId,
    securityId: req.body.securityId,
    symbol: security.symbol,
    quantity: quantity,
    averageCostBasis: parseFloat(averageCostBasis.toFixed(2)),
    totalCostBasis: parseFloat(totalCostBasis.toFixed(2)),
    currentPrice: security.currentPrice,
    marketValue: parseFloat(marketValue.toFixed(2)),
    unrealizedGain: parseFloat(unrealizedGain.toFixed(2)),
    unrealizedGainPercent: parseFloat(unrealizedGainPercent.toFixed(2)),
    weight: 0, // Will be recalculated
    acquiredDate: req.body.acquiredDate || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  datastore.holdings.push(newHolding);
  
  // Recalculate weights for all holdings in the portfolio
  const portfolioHoldings = datastore.holdings.filter(h => h.portfolioId === req.body.portfolioId);
  const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  portfolioHoldings.forEach(holding => {
    holding.weight = parseFloat(((holding.marketValue / totalValue) * 100).toFixed(2));
  });
  
  res.status(201).json({
    success: true,
    data: newHolding,
    timestamp: new Date().toISOString()
  });
});

// PUT /api/v1/holdings/:holdingId - Update holding
router.put('/:holdingId', (req, res) => {
  const index = datastore.holdings.findIndex(h => h.holdingId === req.params.holdingId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Holding not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const holding = datastore.holdings[index];
  const security = datastore.securities.find(s => s.securityId === holding.securityId);
  
  // Update values if quantity or cost basis changed
  const quantity = req.body.quantity !== undefined ? req.body.quantity : holding.quantity;
  const averageCostBasis = req.body.averageCostBasis !== undefined ? req.body.averageCostBasis : holding.averageCostBasis;
  const totalCostBasis = quantity * averageCostBasis;
  const marketValue = quantity * (security ? security.currentPrice : holding.currentPrice);
  const unrealizedGain = marketValue - totalCostBasis;
  const unrealizedGainPercent = totalCostBasis > 0 ? (unrealizedGain / totalCostBasis) * 100 : 0;
  
  datastore.holdings[index] = {
    ...holding,
    ...req.body,
    holdingId: req.params.holdingId,
    quantity: quantity,
    averageCostBasis: parseFloat(averageCostBasis.toFixed(2)),
    totalCostBasis: parseFloat(totalCostBasis.toFixed(2)),
    marketValue: parseFloat(marketValue.toFixed(2)),
    unrealizedGain: parseFloat(unrealizedGain.toFixed(2)),
    unrealizedGainPercent: parseFloat(unrealizedGainPercent.toFixed(2)),
    updatedAt: new Date().toISOString()
  };
  
  // Recalculate weights
  const portfolioHoldings = datastore.holdings.filter(h => h.portfolioId === holding.portfolioId);
  const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  portfolioHoldings.forEach(h => {
    h.weight = parseFloat(((h.marketValue / totalValue) * 100).toFixed(2));
  });
  
  res.json({
    success: true,
    data: datastore.holdings[index],
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/v1/holdings/:holdingId - Delete holding
router.delete('/:holdingId', (req, res) => {
  const index = datastore.holdings.findIndex(h => h.holdingId === req.params.holdingId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Holding not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const deleted = datastore.holdings.splice(index, 1)[0];
  
  // Delete related transactions
  datastore.transactions = datastore.transactions.filter(t => t.holdingId !== req.params.holdingId);
  
  // Recalculate weights for remaining holdings
  const portfolioHoldings = datastore.holdings.filter(h => h.portfolioId === deleted.portfolioId);
  const totalValue = portfolioHoldings.reduce((sum, h) => sum + h.marketValue, 0);
  if (totalValue > 0) {
    portfolioHoldings.forEach(h => {
      h.weight = parseFloat(((h.marketValue / totalValue) * 100).toFixed(2));
    });
  }
  
  res.json({
    success: true,
    data: deleted,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

