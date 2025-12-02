const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');

/**
 * @swagger
 * components:
 *   schemas:
 *     Transaction:
 *       type: object
 *       properties:
 *         transactionId:
 *           type: string
 *           example: TXN-001
 *         portfolioId:
 *           type: string
 *           example: PRT-001
 *         holdingId:
 *           type: string
 *           example: HLD-001
 *         securityId:
 *           type: string
 *           example: SEC-001
 *         symbol:
 *           type: string
 *           example: AAPL
 *         transactionType:
 *           type: string
 *           enum: [BUY, SELL, DIVIDEND, TRANSFER_IN, TRANSFER_OUT, FEE]
 *           example: BUY
 *         quantity:
 *           type: number
 *           example: 50
 *         pricePerUnit:
 *           type: number
 *           example: 145.00
 *         totalAmount:
 *           type: number
 *           example: 7250.00
 *         fees:
 *           type: number
 *           example: 0.00
 *         netAmount:
 *           type: number
 *           example: 7250.00
 *         transactionDate:
 *           type: string
 *           format: date-time
 *           example: 2023-01-15T10:30:00Z
 *         settlementDate:
 *           type: string
 *           format: date-time
 *           example: 2023-01-18T00:00:00Z
 *         status:
 *           type: string
 *           enum: [PENDING, SETTLED, CANCELLED]
 *           example: SETTLED
 *         notes:
 *           type: string
 *           example: Initial position
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: List all transactions
 *     tags: [Transactions]
 *     description: Retrieve a list of all transactions with optional filters
 *     parameters:
 *       - in: query
 *         name: startDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by start date
 *         example: 2023-01-01
 *       - in: query
 *         name: endDate
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter by end date
 *         example: 2024-12-31
 *       - in: query
 *         name: type
 *         schema:
 *           type: string
 *           enum: [BUY, SELL, DIVIDEND, TRANSFER_IN, TRANSFER_OUT, FEE]
 *         description: Filter by transaction type
 *       - in: query
 *         name: symbol
 *         schema:
 *           type: string
 *         description: Filter by security symbol
 *         example: AAPL
 *     responses:
 *       200:
 *         description: List of transactions (sorted by date descending)
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
 *                     $ref: '#/components/schemas/Transaction'
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 */
router.get('/', (req, res) => {
  let transactions = [...datastore.transactions];
  
  // Filter by date range
  if (req.query.startDate) {
    transactions = transactions.filter(t => new Date(t.transactionDate) >= new Date(req.query.startDate));
  }
  if (req.query.endDate) {
    transactions = transactions.filter(t => new Date(t.transactionDate) <= new Date(req.query.endDate));
  }
  
  // Filter by transaction type
  if (req.query.type) {
    transactions = transactions.filter(t => t.transactionType === req.query.type);
  }
  
  // Filter by symbol
  if (req.query.symbol) {
    transactions = transactions.filter(t => t.symbol === req.query.symbol.toUpperCase());
  }
  
  // Sort by date descending (most recent first)
  transactions.sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
  
  res.json({
    success: true,
    data: transactions,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /transactions/{transactionId}:
 *   get:
 *     summary: Get transaction by ID
 *     tags: [Transactions]
 *     description: Retrieve detailed information about a specific transaction
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *         example: TXN-001
 *     responses:
 *       200:
 *         description: Transaction details
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
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
 *                       example: Transaction not found
 */
router.get('/:transactionId', (req, res) => {
  const transaction = datastore.transactions.find(t => t.transactionId === req.params.transactionId);
  
  if (!transaction) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Transaction not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    success: true,
    data: transaction,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /transactions/portfolio/{portfolioId}:
 *   get:
 *     summary: Get transactions for a portfolio
 *     tags: [Transactions]
 *     description: Retrieve all transactions within a specific portfolio (sorted by date descending)
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
 *         description: List of transactions in the portfolio
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
 *                     $ref: '#/components/schemas/Transaction'
 */
router.get('/portfolio/:portfolioId', (req, res) => {
  const transactions = datastore.transactions
    .filter(t => t.portfolioId === req.params.portfolioId)
    .sort((a, b) => new Date(b.transactionDate) - new Date(a.transactionDate));
  
  res.json({
    success: true,
    data: transactions,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Create a new transaction
 *     tags: [Transactions]
 *     description: Record a new transaction (BUY, SELL, DIVIDEND, etc.)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - portfolioId
 *               - securityId
 *               - symbol
 *               - transactionType
 *               - totalAmount
 *             properties:
 *               portfolioId:
 *                 type: string
 *                 example: PRT-001
 *               holdingId:
 *                 type: string
 *                 example: HLD-001
 *               securityId:
 *                 type: string
 *                 example: SEC-001
 *               symbol:
 *                 type: string
 *                 example: AAPL
 *               transactionType:
 *                 type: string
 *                 enum: [BUY, SELL, DIVIDEND, TRANSFER_IN, TRANSFER_OUT, FEE]
 *                 example: BUY
 *               quantity:
 *                 type: number
 *                 example: 50
 *               pricePerUnit:
 *                 type: number
 *                 example: 145.00
 *               totalAmount:
 *                 type: number
 *                 example: 7250.00
 *               fees:
 *                 type: number
 *                 example: 0.00
 *               transactionDate:
 *                 type: string
 *                 format: date-time
 *                 example: 2024-01-15T10:30:00Z
 *               notes:
 *                 type: string
 *                 example: Adding to position
 *     responses:
 *       201:
 *         description: Transaction created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 */
router.post('/', (req, res) => {
  const settlementDate = req.body.settlementDate || 
    new Date(new Date(req.body.transactionDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString();
  
  const newTransaction = {
    transactionId: generateId('transaction'),
    portfolioId: req.body.portfolioId,
    holdingId: req.body.holdingId || null,
    securityId: req.body.securityId,
    symbol: req.body.symbol,
    transactionType: req.body.transactionType,
    quantity: req.body.quantity || 0,
    pricePerUnit: req.body.pricePerUnit || 0,
    totalAmount: req.body.totalAmount,
    fees: req.body.fees || 0,
    netAmount: req.body.netAmount || req.body.totalAmount,
    transactionDate: req.body.transactionDate || new Date().toISOString(),
    settlementDate: settlementDate,
    status: req.body.status || 'SETTLED',
    notes: req.body.notes || '',
    createdAt: new Date().toISOString()
  };
  
  datastore.transactions.push(newTransaction);
  
  res.status(201).json({
    success: true,
    data: newTransaction,
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /transactions/{transactionId}:
 *   put:
 *     summary: Update a transaction
 *     tags: [Transactions]
 *     description: Update an existing transaction's details
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *         example: TXN-001
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [PENDING, SETTLED, CANCELLED]
 *               notes:
 *                 type: string
 *     responses:
 *       200:
 *         description: Transaction updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.put('/:transactionId', (req, res) => {
  const index = datastore.transactions.findIndex(t => t.transactionId === req.params.transactionId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Transaction not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  datastore.transactions[index] = {
    ...datastore.transactions[index],
    ...req.body,
    transactionId: req.params.transactionId
  };
  
  res.json({
    success: true,
    data: datastore.transactions[index],
    timestamp: new Date().toISOString()
  });
});

/**
 * @swagger
 * /transactions/{transactionId}:
 *   delete:
 *     summary: Delete a transaction
 *     tags: [Transactions]
 *     description: Remove a transaction from the system
 *     parameters:
 *       - in: path
 *         name: transactionId
 *         required: true
 *         schema:
 *           type: string
 *         description: The transaction ID
 *         example: TXN-001
 *     responses:
 *       200:
 *         description: Transaction deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   $ref: '#/components/schemas/Transaction'
 *       404:
 *         description: Transaction not found
 */
router.delete('/:transactionId', (req, res) => {
  const index = datastore.transactions.findIndex(t => t.transactionId === req.params.transactionId);
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: {
        code: 'NOT_FOUND',
        message: 'Transaction not found'
      },
      timestamp: new Date().toISOString()
    });
  }
  
  const deleted = datastore.transactions.splice(index, 1)[0];
  
  res.json({
    success: true,
    data: deleted,
    timestamp: new Date().toISOString()
  });
});

module.exports = router;
