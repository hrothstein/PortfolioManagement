const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');
const { calculatePortfolioPerformance } = require('../services/portfolioService');

/**
 * @swagger
 * components:
 *   schemas:
 *     Portfolio:
 *       type: object
 *       properties:
 *         portfolioId:
 *           type: string
 *           example: PRT-001
 *         accountId:
 *           type: string
 *           example: ACC-001
 *         clientId:
 *           type: string
 *           example: CLI-001
 *         portfolioName:
 *           type: string
 *           example: Growth Portfolio
 *         portfolioType:
 *           type: string
 *           enum: [MANAGED, SELF_DIRECTED]
 *           example: MANAGED
 *         modelPortfolio:
 *           type: string
 *           example: GROWTH_60_40
 *         inceptionDate:
 *           type: string
 *           format: date
 *           example: 2020-06-20
 *         benchmarkIndex:
 *           type: string
 *           example: SPY
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /portfolios:
 *   get:
 *     summary: List all portfolios
 *     tags: [Portfolios]
 *     description: Retrieve a list of all portfolios across all accounts
 *     responses:
 *       200:
 *         description: List of portfolios
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Portfolio'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.portfolios,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /portfolios/{portfolioId}:
 *   get:
 *     summary: Get portfolio by ID
 *     tags: [Portfolios]
 *     description: Retrieve detailed information about a specific portfolio
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
 *         description: Portfolio details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: false
 *                 error:
 *                   type: object
 *                   properties:
 *                     code:
 *                       type: string
 *                       example: NOT_FOUND
 *                     message:
 *                       type: string
 *                       example: Portfolio not found
 */
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
 *                           example: 115000.00
 *                         totalCostBasis:
 *                           type: number
 *                           example: 100000.00
 *                         totalUnrealizedGain:
 *                           type: number
 *                           example: 15000.00
 *                         totalUnrealizedGainPercent:
 *                           type: number
 *                           example: 15.00
 *                         dayChange:
 *                           type: number
 *                           example: 450.00
 *                         dayChangePercent:
 *                           type: number
 *                           example: 0.39
 *                         holdings:
 *                           type: array
 *                           items:
 *                             $ref: '#/components/schemas/Holding'
 *                         assetAllocation:
 *                           type: object
 *                           example:
 *                             STOCK: 70.0
 *                             BOND: 15.0
 *                             ETF: 15.0
 *                         sectorAllocation:
 *                           type: object
 *                           example:
 *                             TECHNOLOGY: 35.0
 *                             HEALTHCARE: 15.0
 *                             FINANCIAL: 12.0
 *                         topHoldings:
 *                           type: array
 *                           items:
 *                             type: object
 *                             properties:
 *                               symbol:
 *                                 type: string
 *                               weight:
 *                                 type: number
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

/**
 * @swagger
 * /portfolios/account/{accountId}:
 *   get:
 *     summary: Get portfolios for an account
 *     tags: [Portfolios]
 *     description: Retrieve all portfolios within a specific account
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID
 *         example: ACC-001
 *     responses:
 *       200:
 *         description: List of portfolios in the account
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Portfolio'
 */
router.get('/account/:accountId', (req, res) => {
  const portfolios = datastore.portfolios.filter(p => p.accountId === req.params.accountId);
  
  res.json({
    success: true,
    data: portfolios,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /portfolios:
 *   post:
 *     summary: Create a new portfolio
 *     tags: [Portfolios]
 *     description: Create a new portfolio within an account
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - accountId
 *               - clientId
 *               - portfolioName
 *             properties:
 *               accountId:
 *                 type: string
 *                 example: ACC-001
 *               clientId:
 *                 type: string
 *                 example: CLI-001
 *               portfolioName:
 *                 type: string
 *                 example: New Growth Portfolio
 *               portfolioType:
 *                 type: string
 *                 enum: [MANAGED, SELF_DIRECTED]
 *                 example: MANAGED
 *               modelPortfolio:
 *                 type: string
 *                 example: GROWTH_60_40
 *               inceptionDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               benchmarkIndex:
 *                 type: string
 *                 example: SPY
 *     responses:
 *       201:
 *         description: Portfolio created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 */
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

/**
 * @swagger
 * /portfolios/{portfolioId}:
 *   put:
 *     summary: Update a portfolio
 *     tags: [Portfolios]
 *     description: Update an existing portfolio's details
 *     parameters:
 *       - in: path
 *         name: portfolioId
 *         required: true
 *         schema:
 *           type: string
 *         description: The portfolio ID
 *         example: PRT-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               portfolioName:
 *                 type: string
 *                 example: Updated Portfolio Name
 *               portfolioType:
 *                 type: string
 *                 enum: [MANAGED, SELF_DIRECTED]
 *               modelPortfolio:
 *                 type: string
 *               benchmarkIndex:
 *                 type: string
 *     responses:
 *       200:
 *         description: Portfolio updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 */
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

/**
 * @swagger
 * /portfolios/{portfolioId}:
 *   delete:
 *     summary: Delete a portfolio
 *     tags: [Portfolios]
 *     description: Remove a portfolio and all related holdings and transactions
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
 *         description: Portfolio deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Portfolio'
 *       404:
 *         description: Portfolio not found
 */
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
