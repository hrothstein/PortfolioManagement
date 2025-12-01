const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');
const { calculatePortfolioPerformance } = require('../services/portfolioService');

// GET /api/v1/portfolios - List all portfolios
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.portfolios,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/portfolios/:portfolioId - Get portfolio by ID
router.get('/:portfolioId', (req, res) => {
  const portfolio = datastore.portfolios.find(p => p.portfolioId === req.params.portfolioId);
  
  if (!portfolio) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Portfolio not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: portfolio,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /portfolios/{portfolioId}/performance:
 *   get:
 *     summary: Get portfolio performance metrics
 *     tags: [Portfolios]
 *     description: Retrieve comprehensive performance data including holdings, allocations, and gain/loss
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The portfolio ID
 *         example: PRT-001
 *     responses:
 *       200:
 *         description: Portfolio performance data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     portfolio:
 *                       $ref: '#/components/schemas/Portfolio'
 *                     performance:
 *                       type: object
 *                       properties:
 *                         totalMarketValue:
 *                           type: number
 *                         totalCostBasis:
 *                           type: number
 *                         totalUnrealizedGain:
 *                           type: number
 *                         holdings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Holding'
 *                         assetAllocation:
 *                           type: object
 *                         sectorAllocation:
 *                           type: object
 *       404:
 *         description: Portfolio not found
 */
router.get('/:portfolioId/performance', (req, res) => {
  const performance = calculatePortfolioPerformance(req.params.portfolioId);
  
  if (!performance) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Portfolio not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: performance,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/accounts/:accountId/portfolios - Get portfolios for account
router.get('/account/:accountId', (req, res) => {
  const portfolios = datastore.portfolios.filter(p => p.accountId === req.params.accountId);
  
  res.json({
    success: true,
    data: portfolios,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/portfolios - Create new portfolio
router.post('/', (req, res) => {
  const newPortfolio = {
    portfolioId: generateId('portfolio'),
    ...req.body,
    portfolioType: req.body.portfolioType || 'MANAGED',
    benchmarkIndex: req.body.benchmarkIndex || 'SPY',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  datastore.portfolios.push(newPortfolio);
  
  res.status(201).json({
    success: true,
    data: newPortfolio,
    timestamp: new Date().toISOString()
  });
});

// PUT /api/v1/portfolios/:portfolioId - Update portfolio
router.put('/:portfolioId', (req, res) => {
  const index = datastore.portfolios.findIndex(p => p.portfolioId === req.params.portfolioId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Portfolio not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  datastore.portfolios[index] = {
    ...datastore.portfolios[index],
    ...req.body,
    portfolioId: req.params.portfolioId,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: datastore.portfolios[index],
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/v1/portfolios/:portfolioId - Delete portfolio
router.delete('/:portfolioId', (req, res) => {
  const index = datastore.portfolios.findIndex(p => p.portfolioId === req.params.portfolioId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Portfolio not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const deleted = datastore.portfolios.splice(index, 1)[0];
  
  // Also delete related holdings and transactions
  datastore.transactions = datastore.transactions.filter(t => t.portfolioId !== req.params.portfolioId);
  datastore.holdings = datastore.holdings.filter(h => h.portfolioId !== req.params.portfolioId);
  
  res.json({
    success: true,
    data: deleted,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

