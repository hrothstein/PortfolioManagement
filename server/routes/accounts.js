const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');

/**
 * @swagger
 * components:
 *   schemas:
 *     Account:
 *       type: object
 *       properties:
 *         accountId:
 *           type: string
 *           example: ACC-001
 *         clientId:
 *           type: string
 *           example: CLI-001
 *         accountType:
 *           type: string
 *           enum: [BROKERAGE, IRA, ROTH_IRA, 401K]
 *           example: BROKERAGE
 *         accountNumber:
 *           type: string
 *           example: BRK-78945612
 *         accountName:
 *           type: string
 *           example: John Smith Brokerage
 *         accountStatus:
 *           type: string
 *           enum: [ACTIVE, INACTIVE, CLOSED]
 *           example: ACTIVE
 *         openDate:
 *           type: string
 *           format: date
 *           example: 2020-06-15
 *         cashBalance:
 *           type: number
 *           example: 15000.00
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: List all accounts
 *     tags: [Accounts]
 *     description: Retrieve a list of all accounts across all clients
 *     responses:
 *       200:
 *         description: List of accounts
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
 *                     $ref: '#/components/schemas/Account'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.accounts,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /accounts/{accountId}:
 *   get:
 *     summary: Get account by ID
 *     tags: [Accounts]
 *     description: Retrieve detailed information about a specific account
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
 *         description: Account details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
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
 *                       example: Account not found
 */
router.get('/:accountId', (req, res) => {
  const account = datastore.accounts.find(a => a.accountId === req.params.accountId);
  
  if (!account) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Account not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: account,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /accounts/client/{clientId}:
 *   get:
 *     summary: Get accounts for a client
 *     tags: [Accounts]
 *     description: Retrieve all accounts belonging to a specific client
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
 *         description: List of client accounts
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
 *                     $ref: '#/components/schemas/Account'
 */
router.get('/client/:clientId', (req, res) => {
  const accounts = datastore.accounts.filter(a => a.clientId === req.params.clientId);
  
  res.json({
    success: true,
    data: accounts,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     description: Create a new account for a client
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - clientId
 *               - accountType
 *               - accountNumber
 *               - accountName
 *             properties:
 *               clientId:
 *                 type: string
 *                 example: CLI-001
 *               accountType:
 *                 type: string
 *                 enum: [BROKERAGE, IRA, ROTH_IRA, 401K]
 *                 example: BROKERAGE
 *               accountNumber:
 *                 type: string
 *                 example: BRK-12345678
 *               accountName:
 *                 type: string
 *                 example: My Brokerage Account
 *               accountStatus:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, CLOSED]
 *                 example: ACTIVE
 *               openDate:
 *                 type: string
 *                 format: date
 *                 example: 2024-01-15
 *               cashBalance:
 *                 type: number
 *                 example: 10000.00
 *     responses:
 *       201:
 *         description: Account created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 */
router.post('/', (req, res) => {
  const newAccount = {
    accountId: generateId('account'),
    ...req.body,
    accountStatus: req.body.accountStatus || 'ACTIVE',
    cashBalance: req.body.cashBalance || 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  datastore.accounts.push(newAccount);
  
  res.status(201).json({
    success: true,
    data: newAccount,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /accounts/{accountId}:
 *   put:
 *     summary: Update an account
 *     tags: [Accounts]
 *     description: Update an existing account's details
 *     parameters:
 *       - in: path
 *         name: accountId
 *         required: true
 *         schema:
 *           type: string
 *         description: The account ID
 *         example: ACC-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               accountName:
 *                 type: string
 *                 example: Updated Account Name
 *               accountStatus:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE, CLOSED]
 *               cashBalance:
 *                 type: number
 *                 example: 25000.00
 *     responses:
 *       200:
 *         description: Account updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 */
router.put('/:accountId', (req, res) => {
  const index = datastore.accounts.findIndex(a => a.accountId === req.params.accountId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Account not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  datastore.accounts[index] = {
    ...datastore.accounts[index],
    ...req.body,
    accountId: req.params.accountId,
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    data: datastore.accounts[index],
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /accounts/{accountId}:
 *   delete:
 *     summary: Delete an account
 *     tags: [Accounts]
 *     description: Delete an account and all related portfolios, holdings, and transactions
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
 *         description: Account deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Account'
 *       404:
 *         description: Account not found
 */
router.delete('/:accountId', (req, res) => {
  const index = datastore.accounts.findIndex(a => a.accountId === req.params.accountId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Account not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const deleted = datastore.accounts.splice(index, 1)[0];
  
  // Also delete related portfolios, holdings, and transactions
  const portfolioIds = datastore.portfolios
    .filter(p => p.accountId === req.params.accountId)
    .map(p => p.portfolioId);
  
  datastore.transactions = datastore.transactions.filter(t => !portfolioIds.includes(t.portfolioId));
  datastore.holdings = datastore.holdings.filter(h => !portfolioIds.includes(h.portfolioId));
  datastore.portfolios = datastore.portfolios.filter(p => p.accountId !== req.params.accountId);
  
  res.json({
    success: true,
    data: deleted,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
