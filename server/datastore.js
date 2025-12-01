// In-memory datastore for the Portfolio Management System
// Data resets on server restart

const datastore = {
  clients: [],
  accounts: [],
  portfolios: [],
  holdings: [],
  transactions: [],
  securities: []
};

// Helper function to generate IDs
let counters = {
  client: 1,
  account: 1,
  portfolio: 1,
  holding: 1,
  transaction: 1,
  security: 1
};

function generateId(type) {
  const prefixes = {
    client: 'CLI',
    account: 'ACC',
    portfolio: 'PRT',
    holding: 'HLD',
    transaction: 'TXN',
    security: 'SEC'
  };
  const id = `${prefixes[type]}-${String(counters[type]).padStart(3, '0')}`;
  counters[type]++;
  return id;
}

function resetCounters() {
  counters = {
    client: 1,
    account: 1,
    portfolio: 1,
    holding: 1,
    transaction: 1,
    security: 1
  };
}

function clearDatastore() {
  datastore.clients = [];
  datastore.accounts = [];
  datastore.portfolios = [];
  datastore.holdings = [];
  datastore.transactions = [];
  datastore.securities = [];
  resetCounters();
}

module.exports = {
  datastore,
  generateId,
  resetCounters,
  clearDatastore
};

