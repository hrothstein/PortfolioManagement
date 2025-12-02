const express = require('express');
const router = express.Router();
const { 
  calculateDashboardOverview, 
  getTopPerformers, 
  getTopLosers 
} = require('../services/portfolioService');
const { datastore } = require('../datastore');

/**
 * @swagger
 * /dashboard/overview:
 *   get:
 *     summary: Get system-wide dashboard overview
 *     tags: [Dashboard]
 *     description: Retrieve comprehensive system metrics including total AUM, client counts, and asset allocation
 *     responses:
 *       200:
 *         description: Dashboard overview data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     totalClients:
 *                       type: integer
 *                       example: 50
 *                     totalAccounts:
 *                       type: integer
 *                       example: 100
 *                     totalPortfolios:
 *                       type: integer
 *                       example: 165
 *                     totalAUM:
 *                       type: number
 *                       example: 18000000.00
 *                     totalUnrealizedGain:
 *                       type: number
 *                       example: 800000.00
 *                     averagePortfolioSize:
 *                       type: number
 *                       example: 109090.91
 *                     clientsByRiskTolerance:
 *                       type: object
 *                       properties:
 *                         CONSERVATIVE:
 *                           type: integer
 *                           example: 15
 *                         MODERATE:
 *                           type: integer
 *                           example: 25
 *                         AGGRESSIVE:
 *                           type: integer
 *                           example: 10
 *                     assetAllocation:
 *                       type: object
 *                       example:
 *                         STOCK: 62.5
 *                         BOND: 22.0
 *                         MUTUAL_FUND: 8.5
 *                         ETF: 7.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/overview', (req, res) => {
  const overview = calculateDashboardOverview();
  
  res.json({
    success: true,
    data: overview,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /dashboard/top-performers:
 *   get:
 *     summary: Get top performing holdings
 *     tags: [Dashboard]
 *     description: Retrieve holdings with the highest unrealized gain percentage
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top performers to return
 *         example: 5
 *     responses:
 *       200:
 *         description: List of top performing holdings
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
 *                     type: object
 *                     properties:
 *                       holdingId:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       securityName:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       marketValue:
 *                         type: number
 *                       unrealizedGain:
 *                         type: number
 *                       unrealizedGainPercent:
 *                         type: number
 *                       clientName:
 *                         type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/top-performers', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topPerformers = getTopPerformers(limit);
  
  res.json({
    success: true,
    data: topPerformers,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /dashboard/top-losers:
 *   get:
 *     summary: Get worst performing holdings
 *     tags: [Dashboard]
 *     description: Retrieve holdings with the lowest (most negative) unrealized gain percentage
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Number of top losers to return
 *         example: 5
 *     responses:
 *       200:
 *         description: List of worst performing holdings
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
 *                     type: object
 *                     properties:
 *                       holdingId:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       securityName:
 *                         type: string
 *                       quantity:
 *                         type: number
 *                       marketValue:
 *                         type: number
 *                       unrealizedGain:
 *                         type: number
 *                       unrealizedGainPercent:
 *                         type: number
 *                       clientName:
 *                         type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/top-losers', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topLosers = getTopLosers(limit);
  
  res.json({
    success: true,
    data: topLosers,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /dashboard/recent-transactions:
 *   get:
 *     summary: Get recent transactions
 *     tags: [Dashboard]
 *     description: Retrieve the most recent transactions across all portfolios, enriched with security and client names
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 20
 *         description: Number of recent transactions to return
 *         example: 10
 *     responses:
 *       200:
 *         description: List of recent transactions
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
 *                     type: object
 *                     properties:
 *                       transactionId:
 *                         type: string
 *                       portfolioId:
 *                         type: string
 *                       symbol:
 *                         type: string
 *                       securityName:
 *                         type: string
 *                       transactionType:
 *                         type: string
 *                         enum: [BUY, SELL, DIVIDEND]
 *                       quantity:
 *                         type: number
 *                       totalAmount:
 *                         type: number
 *                       transactionDate:
 *                         type: string
 *                         format: date-time
 *                       clientName:
 *                         type: string
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/recent-transactions', (req, res) => {
  const limit = parseInt(req.query.limit) || 20;
  
  const recentTransactions = datastore.transactions
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate))
    .slice(0, limit)
    .map(t => {
      const security = datastore.securities.find(s => s.securityId === t.securityId);
      const portfolio = datastore.portfolios.find(p => p.portfolioId === t.portfolioId);
      const client = portfolio ? datastore.clients.find(c => c.clientId === portfolio.clientId) : null;
      
      return {
        ...t,
        securityName: security ? security.securityName : 'Unknown',
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown'
      };
    });
  
  res.json({
    success: true,
    data: recentTransactions,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /dashboard/allocation:
 *   get:
 *     summary: Get aggregate asset allocation
 *     tags: [Dashboard]
 *     description: Retrieve the overall asset allocation across all portfolios
 *     responses:
 *       200:
 *         description: Aggregate asset allocation percentages
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
 *                     assetAllocation:
 *                       type: object
 *                       example:
 *                         STOCK: 62.5
 *                         BOND: 22.0
 *                         MUTUAL_FUND: 8.5
 *                         ETF: 7.0
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/allocation', (req, res) => {
  const overview = calculateDashboardOverview();
  
  res.json({
    success: true,
    data: {
      assetAllocation: overview.assetAllocation
    },
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
