const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');

/**
 * @swagger
 * components:
 *   schemas:
 *     Holding:
 *       type: object
 *       properties:
 *         holdingId:
 *           type: string
 *           example: HLD-001
 *         portfolioId:
 *           type: string
 *           example: PRT-001
 *         securityId:
 *           type: string
 *           example: SEC-001
 *         symbol:
 *           type: string
 *           example: AAPL
 *         quantity:
 *           type: number
 *           example: 100
 *         averageCostBasis:
 *           type: number
 *           example: 145.00
 *         totalCostBasis:
 *           type: number
 *           example: 14500.00
 *         currentPrice:
 *           type: number
 *           example: 178.50
 *         marketValue:
 *           type: number
 *           example: 17850.00
 *         unrealizedGain:
 *           type: number
 *           example: 3350.00
 *         unrealizedGainPercent:
 *           type: number
 *           example: 23.10
 *         weight:
 *           type: number
 *           example: 15.5
 *         acquiredDate:
 *           type: string
 *           format: date
 *           example: 2023-01-15
 */

/**
 * @swagger
 * /holdings:
 *   get:
 *     summary: List all holdings
 *     tags: [Holdings]
 *     description: Retrieve a list of all holdings across all portfolios
 *     responses:
 *       200:
 *         description: List of holdings
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
 *                     $ref: '#/components/schemas/Holding'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.holdings,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /holdings/{holdingId}:
 *   get:
 *     summary: Get holding by ID
 *     tags: [Holdings]
 *     description: Retrieve detailed information about a specific holding
 *     parameters:
 *       - in: path
 *         name: holdingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The holding ID
 *         example: HLD-001
 *     responses:
 *       200:
 *         description: Holding details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Holding'
 *       404:
 *         description: Holding not found
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
 *                       example: Holding not found
 */
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

/**
 * @swagger
 * /holdings/portfolio/{portfolioId}:
 *   get:
 *     summary: Get holdings for a portfolio
 *     tags: [Holdings]
 *     description: Retrieve all holdings within a specific portfolio
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
 *         description: List of holdings in the portfolio
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
 *                     $ref: '#/components/schemas/Holding'
 */
router.get('/portfolio/:portfolioId', (req, res) => {
  const holdings = datastore.holdings.filter(h => h.portfolioId === req.params.portfolioId);
  
  res.json({
    success: true,
    data: holdings,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /holdings:
 *   post:
 *     summary: Create a new holding
 *     tags: [Holdings]
 *     description: Add a new holding to a portfolio
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - portfolioId
 *               - securityId
 *               - quantity
 *               - averageCostBasis
 *             properties:
 *               portfolioId:
 *                 type: string
 *                 example: PRT-001
 *               securityId:
 *                 type: string
 *                 example: SEC-001
 *               quantity:
 *                 type: number
 *                 example: 100
 *               averageCostBasis:
 *                 type: number
 *                 example: 145.00
 *               acquiredDate:
 *                 type: string
 *                 format: date
 *                 example: 2023-01-15
 *     responses:
 *       201:
 *         description: Holding created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Holding'
 *       404:
 *         description: Security not found
 */
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

/**
 * @swagger
 * /holdings/{holdingId}:
 *   put:
 *     summary: Update a holding
 *     tags: [Holdings]
 *     description: Update an existing holding's quantity or cost basis
 *     parameters:
 *       - in: path
 *         name: holdingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The holding ID
 *         example: HLD-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: number
 *                 example: 150
 *               averageCostBasis:
 *                 type: number
 *                 example: 150.00
 *     responses:
 *       200:
 *         description: Holding updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Holding'
 *       404:
 *         description: Holding not found
 */
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

/**
 * @swagger
 * /holdings/{holdingId}:
 *   delete:
 *     summary: Delete a holding
 *     tags: [Holdings]
 *     description: Remove a holding from a portfolio (also deletes related transactions)
 *     parameters:
 *       - in: path
 *         name: holdingId
 *         required: true
 *         schema:
 *           type: string
 *         description: The holding ID
 *         example: HLD-001
 *     responses:
 *       200:
 *         description: Holding deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Holding'
 *       404:
 *         description: Holding not found
 */
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
