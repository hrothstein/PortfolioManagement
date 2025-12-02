const express = require('express');
const router = express.Router();
const { datastore } = require('../datastore');

/**
 * @swagger
 * components:
 *   schemas:
 *     Security:
 *       type: object
 *       properties:
 *         securityId:
 *           type: string
 *           example: SEC-001
 *         symbol:
 *           type: string
 *           example: AAPL
 *         securityName:
 *           type: string
 *           example: Apple Inc.
 *         securityType:
 *           type: string
 *           enum: [STOCK, BOND, MUTUAL_FUND, ETF]
 *           example: STOCK
 *         sector:
 *           type: string
 *           example: TECHNOLOGY
 *         currentPrice:
 *           type: number
 *           example: 178.50
 *         previousClose:
 *           type: number
 *           example: 177.25
 *         dayChange:
 *           type: number
 *           example: 1.25
 *         dayChangePercent:
 *           type: number
 *           example: 0.71
 *         fiftyTwoWeekHigh:
 *           type: number
 *           example: 199.62
 *         fiftyTwoWeekLow:
 *           type: number
 *           example: 124.17
 *         dividendYield:
 *           type: number
 *           example: 0.55
 *         peRatio:
 *           type: number
 *           example: 28.5
 *         marketCap:
 *           type: number
 *           example: 2850000000000
 *         bondRating:
 *           type: string
 *           nullable: true
 *           example: null
 *         maturityDate:
 *           type: string
 *           format: date
 *           nullable: true
 *         couponRate:
 *           type: number
 *           nullable: true
 *         expenseRatio:
 *           type: number
 *           nullable: true
 *         lastUpdated:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /securities:
 *   get:
 *     summary: List all securities
 *     tags: [Securities]
 *     description: Retrieve a list of all securities with current market data
 *     responses:
 *       200:
 *         description: List of securities
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
 *                     $ref: '#/components/schemas/Security'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.securities,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /securities/{securityId}:
 *   get:
 *     summary: Get security by ID
 *     tags: [Securities]
 *     description: Retrieve detailed information about a specific security
 *     parameters:
 *       - in: path
 *         name: securityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The security ID
 *         example: SEC-001
 *     responses:
 *       200:
 *         description: Security details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Security'
 *       404:
 *         description: Security not found
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
 *                       example: Security not found
 */
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

/**
 * @swagger
 * /securities/symbol/{symbol}:
 *   get:
 *     summary: Get security by symbol
 *     tags: [Securities]
 *     description: Retrieve security information by ticker symbol
 *     parameters:
 *       - in: path
 *         name: symbol
 *         required: true
 *         schema:
 *           type: string
 *         description: The ticker symbol
 *         example: AAPL
 *     responses:
 *       200:
 *         description: Security details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Security'
 *       404:
 *         description: Security not found
 */
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

/**
 * @swagger
 * /securities/type/{type}:
 *   get:
 *     summary: Get securities by type
 *     tags: [Securities]
 *     description: Retrieve all securities of a specific type
 *     parameters:
 *       - in: path
 *         name: type
 *         required: true
 *         schema:
 *           type: string
 *           enum: [STOCK, BOND, MUTUAL_FUND, ETF]
 *         description: The security type
 *         example: STOCK
 *     responses:
 *       200:
 *         description: List of securities of the specified type
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
 *                     $ref: '#/components/schemas/Security'
 */
router.get('/type/:type', (req, res) => {
  const securities = datastore.securities.filter(s => s.securityType === req.params.type.toUpperCase());
  
  res.json({
    success: true,
    data: securities,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /securities/{securityId}:
 *   put:
 *     summary: Update security price
 *     tags: [Securities]
 *     description: Update a security's price (for demo purposes). This also updates all holdings with this security.
 *     parameters:
 *       - in: path
 *         name: securityId
 *         required: true
 *         schema:
 *           type: string
 *         description: The security ID
 *         example: SEC-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               currentPrice:
 *                 type: number
 *                 description: New current price
 *                 example: 185.00
 *           example:
 *             currentPrice: 185.00
 *     responses:
 *       200:
 *         description: Security updated successfully (holdings are also recalculated)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Security'
 *       404:
 *         description: Security not found
 */
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
