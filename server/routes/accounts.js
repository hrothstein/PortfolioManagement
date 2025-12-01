const express = require('express');
const router = express.Router();
const { datastore, generateId } = require('../datastore');

// GET /api/v1/accounts - List all accounts
router.get('/', (req, res) => {
  res.json({
    success: true,
    data: datastore.accounts,
    timestamp: new Date().toISOString()
  });
});

// GET /api/v1/accounts/:accountId - Get account by ID
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

// GET /api/v1/clients/:clientId/accounts - Get accounts for client
router.get('/client/:clientId', (req, res) => {
  const accounts = datastore.accounts.filter(a => a.clientId === req.params.clientId);
  
  res.json({
    success: true,
    data: accounts,
    timestamp: new Date().toISOString()
  });
});

// POST /api/v1/accounts - Create new account
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

// PUT /api/v1/accounts/:accountId - Update account
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

// DELETE /api/v1/accounts/:accountId - Delete account
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

