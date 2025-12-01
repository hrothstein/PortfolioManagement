import axios from 'axios';

// Use relative URL in production (Heroku), localhost in development
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (window.location.hostname === 'localhost' ? 'http://localhost:3001/api/v1' : '/api/v1');

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Clients
export const getClients = () => api.get('/clients');
export const getClient = (clientId) => api.get(`/clients/${clientId}`);
export const getClientSummary = (clientId) => api.get(`/clients/${clientId}/summary`);
export const createClient = (data) => api.post('/clients', data);
export const updateClient = (clientId, data) => api.put(`/clients/${clientId}`, data);
export const deleteClient = (clientId) => api.delete(`/clients/${clientId}`);

// Accounts
export const getAccounts = () => api.get('/accounts');
export const getAccount = (accountId) => api.get(`/accounts/${accountId}`);
export const getClientAccounts = (clientId) => api.get(`/accounts/client/${clientId}`);
export const createAccount = (data) => api.post('/accounts', data);
export const updateAccount = (accountId, data) => api.put(`/accounts/${accountId}`, data);
export const deleteAccount = (accountId) => api.delete(`/accounts/${accountId}`);

// Portfolios
export const getPortfolios = () => api.get('/portfolios');
export const getPortfolio = (portfolioId) => api.get(`/portfolios/${portfolioId}`);
export const getPortfolioPerformance = (portfolioId) => api.get(`/portfolios/${portfolioId}/performance`);
export const getAccountPortfolios = (accountId) => api.get(`/portfolios/account/${accountId}`);
export const createPortfolio = (data) => api.post('/portfolios', data);
export const updatePortfolio = (portfolioId, data) => api.put(`/portfolios/${portfolioId}`, data);
export const deletePortfolio = (portfolioId) => api.delete(`/portfolios/${portfolioId}`);

// Holdings
export const getHoldings = () => api.get('/holdings');
export const getHolding = (holdingId) => api.get(`/holdings/${holdingId}`);
export const getPortfolioHoldings = (portfolioId) => api.get(`/holdings/portfolio/${portfolioId}`);
export const createHolding = (data) => api.post('/holdings', data);
export const updateHolding = (holdingId, data) => api.put(`/holdings/${holdingId}`, data);
export const deleteHolding = (holdingId) => api.delete(`/holdings/${holdingId}`);

// Transactions
export const getTransactions = (params) => api.get('/transactions', { params });
export const getTransaction = (transactionId) => api.get(`/transactions/${transactionId}`);
export const getPortfolioTransactions = (portfolioId) => api.get(`/transactions/portfolio/${portfolioId}`);
export const createTransaction = (data) => api.post('/transactions', data);
export const updateTransaction = (transactionId, data) => api.put(`/transactions/${transactionId}`, data);
export const deleteTransaction = (transactionId) => api.delete(`/transactions/${transactionId}`);

// Securities
export const getSecurities = () => api.get('/securities');
export const getSecurity = (securityId) => api.get(`/securities/${securityId}`);
export const getSecurityBySymbol = (symbol) => api.get(`/securities/symbol/${symbol}`);
export const getSecuritiesByType = (type) => api.get(`/securities/type/${type}`);
export const updateSecurity = (securityId, data) => api.put(`/securities/${securityId}`, data);

// Dashboard
export const getDashboardOverview = () => api.get('/dashboard/overview');
export const getTopPerformers = (limit = 10) => api.get(`/dashboard/top-performers?limit=${limit}`);
export const getTopLosers = (limit = 10) => api.get(`/dashboard/top-losers?limit=${limit}`);
export const getRecentTransactions = (limit = 20) => api.get(`/dashboard/recent-transactions?limit=${limit}`);
export const getAssetAllocation = () => api.get('/dashboard/allocation');

export default api;

