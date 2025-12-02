const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');
const { calculateClientSummary } = require('../services/portfolioService');

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         clientId:
 *           type: string
 *           example: CLI-001
 *         customerId:
 *           type: string
 *           example: CUST-001
 *         firstName:
 *           type: string
 *           example: John
 *         lastName:
 *           type: string
 *           example: Smith
 *         email:
 *           type: string
 *           example: john.smith@email.com
 *         phone:
 *           type: string
 *           example: 555-0101
 *         dateOfBirth:
 *           type: string
 *           format: date
 *           example: 1975-03-15
 *         riskTolerance:
 *           type: string
 *           enum: [CONSERVATIVE, MODERATE, AGGRESSIVE]
 *           example: MODERATE
 *         investmentObjective:
 *           type: string
 *           enum: [INCOME, GROWTH, BALANCED, PRESERVATION]
 *           example: GROWTH
 *         advisorId:
 *           type: string
 *           example: ADV-001
 *         address:
 *           type: object
 *           properties:
 *             street:
 *               type: string
 *             city:
 *               type: string
 *             state:
 *               type: string
 *             zipCode:
 *               type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Client'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
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
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
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
 *                       example: Client not found
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
 *                           example: 2
 *                         totalPortfolios:
 *                           type: integer
 *                           example: 3
 *                         totalMarketValue:
 *                           type: number
 *                           example: 485000.00
 *                         totalCostBasis:
 *                           type: number
 *                           example: 425000.00
 *                         totalUnrealizedGain:
 *                           type: number
 *                           example: 60000.00
 *                         totalUnrealizedGainPercent:
 *                           type: number
 *                           example: 14.12
 *                         assetAllocation:
 *                           type: object
 *                           example:
 *                             STOCK: 65.5
 *                             BOND: 20.0
 *                             MUTUAL_FUND: 10.0
 *                             ETF: 4.5
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

/**
 * @swagger
 * /clients:
 *   post:
 *     summary: Create a new client
 *     tags: [Clients]
 *     description: Add a new client to the system
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - firstName
 *               - lastName
 *               - email
 *             properties:
 *               firstName:
 *                 type: string
 *                 example: Jane
 *               lastName:
 *                 type: string
 *                 example: Doe
 *               email:
 *                 type: string
 *                 example: jane.doe@email.com
 *               phone:
 *                 type: string
 *                 example: 555-0199
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: 1985-06-20
 *               riskTolerance:
 *                 type: string
 *                 enum: [CONSERVATIVE, MODERATE, AGGRESSIVE]
 *                 example: MODERATE
 *               investmentObjective:
 *                 type: string
 *                 enum: [INCOME, GROWTH, BALANCED, PRESERVATION]
 *                 example: GROWTH
 *               advisorId:
 *                 type: string
 *                 example: ADV-001
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                   city:
 *                     type: string
 *                   state:
 *                     type: string
 *                   zipCode:
 *                     type: string
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 */
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

/**
 * @swagger
 * /clients/{clientId}:
 *   put:
 *     summary: Update a client
 *     tags: [Clients]
 *     description: Update an existing client's information
 *     parameters:
 *       - in: path
 *         name: clientId
 *         required: true
 *         schema:
 *           type: string
 *         description: The client ID
 *         example: CLI-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *               phone:
 *                 type: string
 *               riskTolerance:
 *                 type: string
 *                 enum: [CONSERVATIVE, MODERATE, AGGRESSIVE]
 *               investmentObjective:
 *                 type: string
 *                 enum: [INCOME, GROWTH, BALANCED, PRESERVATION]
 *     responses:
 *       200:
 *         description: Client updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 */
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

/**
 * @swagger
 * /clients/{clientId}:
 *   delete:
 *     summary: Delete a client
 *     tags: [Clients]
 *     description: Remove a client and all related accounts, portfolios, holdings, and transactions
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
 *         description: Client deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Client'
 *       404:
 *         description: Client not found
 */
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
