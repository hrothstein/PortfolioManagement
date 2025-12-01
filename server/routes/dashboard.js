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
 *                       example: 120
 *                     totalAUM:
 *                       type: number
 *                       example: 48500000.00
 *                     totalUnrealizedGain:
 *                       type: number
 *                       example: 5250000.00
 *                     assetAllocation:
 *                       type: object
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
 *     responses:
 *       200:
 *         description: List of top performing holdings
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

// GET /api/v1/dashboard/top-losers - Get worst performing holdings
router.get('/top-losers', (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const topLosers = getTopLosers(limit);
  
  res.json({
    success: true,
    data: topLosers,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/dashboard/recent-transactions - Get recent transactions
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

// GET /api/v1/dashboard/allocation - Get aggregate asset allocation
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

