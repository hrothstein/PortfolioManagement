const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');

// GET /api/v1/transactions - List all transactions with optional filters
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

// GET /api/v1/transactions/:transactionId - Get transaction by ID
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

// GET /api/v1/portfolios/:portfolioId/transactions - Get transactions for portfolio
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

// POST /api/v1/transactions - Create new transaction
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

// PUT /api/v1/transactions/:transactionId - Update transaction
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

// DELETE /api/v1/transactions/:transactionId - Delete transaction
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

