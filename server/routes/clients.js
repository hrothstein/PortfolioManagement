const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');
const { calculateClientSummary } = require('../services/portfolioService');

/**
 * @swagger
 * /clients:
 *   get:
 *     summary: List all clients
 *     tags: [Clients]
 *     description: Retrieve a list of all clients in the system
 *     responses:
 *       200:
 *         description: List of clients
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.clients,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /clients/{clientId}:
 *   get:
 *     summary: Get client by ID
 *     tags: [Clients]
 *     description: Retrieve detailed information about a specific client
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *         example: CLI-001
 *     responses:
 *       200:
 *         description: Client details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SuccessResponse'
 *       404:
 *         description: Client not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.get('/:clientId', (req, res) => {
  const client = datastore.clients.find(c => c.clientId === req.params.clientId);
  
  if (!client) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Client not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: client,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /clients/{clientId}/summary:
 *   get:
 *     summary: Get client portfolio summary
 *     tags: [Clients]
 *     description: Retrieve comprehensive portfolio summary for a client including total value, gain/loss, and asset allocation
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *         example: CLI-001
 *     responses:
 *       200:
 *         description: Client portfolio summary
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
 *                     client:
 *                       $ref: '#/components/schemas/Client'
 *                     summary:
 *                       type: object
 *                       properties:
 *                         totalAccounts:
 *                           type: integer
 *                         totalPortfolios:
 *                           type: integer
 *                         totalMarketValue:
 *                           type: number
 *                         totalUnrealizedGain:
 *                           type: number
 *                         assetAllocation:
 *                           type: object
 *       404:
 *         description: Client not found
 */
router.get('/:clientId/summary', (req, res) => {
  const summary = calculateClientSummary(req.params.clientId);
  
  if (!summary) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Client not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: summary,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/clients - Create new client
router.post('/', (req, res) => {
  const newClient = {
    clientId: generateId('client'),
    ...req.body,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  datastore.clients.push(newClient);
  
  res.status(201).json({
    success: true,
    data: newClient,
    timestamp: new Date().toISOString()
  });
});

// PUT /api/v1/clients/:clientId - Update client
router.put('/:clientId', (req, res) => {
  const index = datastore.clients.findIndex(c => c.clientId === req.params.clientId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Client not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  datastore.clients[index] = {
    ...datastore.clients[index],
    ...req.body,
    clientId: req.params.clientId,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: datastore.clients[index],
    timestamp: new Date().toISOString()
  });
});

// DELETE /api/v1/clients/:clientId - Delete client
router.delete('/:clientId', (req, res) => {
  const index = datastore.clients.findIndex(c => c.clientId === req.params.clientId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Client not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const deleted = datastore.clients.splice(index, 1)[0];
  
  // Also delete related accounts, portfolios, holdings, and transactions
  const accountIds = datastore.accounts
    .filter(a => a.clientId === req.params.clientId)
    .map(a => a.accountId);
  
  const portfolioIds = datastore.portfolios
    .filter(p => accountIds.includes(p.accountId))
    .map(p => p.portfolioId);
  
  datastore.transactions = datastore.transactions.filter(t => !portfolioIds.includes(t.portfolioId));
  datastore.holdings = datastore.holdings.filter(h => !portfolioIds.includes(h.portfolioId));
  datastore.portfolios = datastore.portfolios.filter(p => !accountIds.includes(p.accountId));
  datastore.accounts = datastore.accounts.filter(a => a.clientId !== req.params.clientId);
  
  res.json({
    success: true,
    data: deleted,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;

