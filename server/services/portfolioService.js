// Portfolio calculation services

const { datastore } = require('../datastore');

/**
 * Calculate portfolio performance metrics
 */
function calculatePortfolioPerformance(portfolioId) {
  const portfolio = datastore.portfolios.find(p => p.portfolioId === portfolioId);
  if (!portfolio) return null;
  
  const holdings = datastore.holdings.filter(h => h.portfolioId === portfolioId);
  
  const totalMarketValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.totalCostBasis, 0);
  const totalUnrealizedGain = totalMarketValue - totalCostBasis;
  const totalUnrealizedGainPercent = totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : 0;
  
  // Calculate day change
  let dayChange = 0;
  holdings.forEach(holding => {
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    if (security) {
      const prevValue = holding.quantity * security.previousClose;
      const currValue = holding.quantity * security.currentPrice;
      dayChange += (currValue - prevValue);
    }
  });
  const dayChangePercent = totalMarketValue > 0 ? (dayChange / (totalMarketValue - dayChange)) * 100 : 0;
  
  // Calculate asset allocation
  const assetAllocation = {};
  holdings.forEach(holding => {
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    if (security) {
      const type = security.securityType;
      assetAllocation[type] = (assetAllocation[type] || 0) + holding.marketValue;
    }
  });
  
  // Convert to percentages
  Object.keys(assetAllocation).forEach(type => {
    assetAllocation[type] = parseFloat(((assetAllocation[type] / totalMarketValue) * 100).toFixed(2));
  });
  
  // Calculate sector allocation (for stocks)
  const sectorAllocation = {};
  holdings.forEach(holding => {
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    if (security && security.sector) {
      sectorAllocation[security.sector] = (sectorAllocation[security.sector] || 0) + holding.marketValue;
    }
  });
  
  // Convert to percentages
  Object.keys(sectorAllocation).forEach(sector => {
    sectorAllocation[sector] = parseFloat(((sectorAllocation[sector] / totalMarketValue) * 100).toFixed(2));
  });
  
  // Get top holdings (sorted by weight)
  const topHoldings = holdings
    .sort((a, b) => b.weight - a.weight)
    .slice(0, 5)
    .map(h => ({
      symbol: h.symbol,
      weight: h.weight,
      marketValue: h.marketValue
    }));
  
  // Enrich holdings with security names
  const enrichedHoldings = holdings.map(holding => {
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    return {
      ...holding,
      securityName: security ? security.securityName : 'Unknown'
    };
  });
  
  return {
    portfolio,
    performance: {
      totalMarketValue: parseFloat(totalMarketValue.toFixed(2)),
      totalCostBasis: parseFloat(totalCostBasis.toFixed(2)),
      totalUnrealizedGain: parseFloat(totalUnrealizedGain.toFixed(2)),
      totalUnrealizedGainPercent: parseFloat(totalUnrealizedGainPercent.toFixed(2)),
      dayChange: parseFloat(dayChange.toFixed(2)),
      dayChangePercent: parseFloat(dayChangePercent.toFixed(2)),
      holdings: enrichedHoldings,
      assetAllocation,
      sectorAllocation,
      topHoldings
    }
  };
}

/**
 * Calculate client summary
 */
function calculateClientSummary(clientId) {
  const client = datastore.clients.find(c => c.clientId === clientId);
  if (!client) return null;
  
  const accounts = datastore.accounts.filter(a => a.clientId === clientId);
  const accountIds = accounts.map(a => a.accountId);
  const portfolios = datastore.portfolios.filter(p => accountIds.includes(p.accountId));
  const portfolioIds = portfolios.map(p => p.portfolioId);
  const holdings = datastore.holdings.filter(h => portfolioIds.includes(h.portfolioId));
  
  const totalMarketValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = holdings.reduce((sum, h) => sum + h.totalCostBasis, 0);
  const totalUnrealizedGain = totalMarketValue - totalCostBasis;
  const totalUnrealizedGainPercent = totalCostBasis > 0 ? (totalUnrealizedGain / totalCostBasis) * 100 : 0;
  
  // Calculate asset allocation across all portfolios
  const assetAllocation = {};
  holdings.forEach(holding => {
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    if (security) {
      const type = security.securityType;
      assetAllocation[type] = (assetAllocation[type] || 0) + holding.marketValue;
    }
  });
  
  // Convert to percentages
  Object.keys(assetAllocation).forEach(type => {
    assetAllocation[type] = parseFloat(((assetAllocation[type] / totalMarketValue) * 100).toFixed(2));
  });
  
  return {
    client,
    summary: {
      totalAccounts: accounts.length,
      totalPortfolios: portfolios.length,
      totalMarketValue: parseFloat(totalMarketValue.toFixed(2)),
      totalCostBasis: parseFloat(totalCostBasis.toFixed(2)),
      totalUnrealizedGain: parseFloat(totalUnrealizedGain.toFixed(2)),
      totalUnrealizedGainPercent: parseFloat(totalUnrealizedGainPercent.toFixed(2)),
      assetAllocation
    }
  };
}

/**
 * Calculate dashboard overview
 */
function calculateDashboardOverview() {
  const totalClients = datastore.clients.length;
  const totalAccounts = datastore.accounts.length;
  const totalPortfolios = datastore.portfolios.length;
  
  const totalAUM = datastore.holdings.reduce((sum, h) => sum + h.marketValue, 0);
  const totalCostBasis = datastore.holdings.reduce((sum, h) => sum + h.totalCostBasis, 0);
  const totalUnrealizedGain = totalAUM - totalCostBasis;
  
  const averagePortfolioSize = totalPortfolios > 0 ? totalAUM / totalPortfolios : 0;
  
  // Client distribution by risk tolerance
  const clientsByRiskTolerance = {
    CONSERVATIVE: 0,
    MODERATE: 0,
    AGGRESSIVE: 0
  };
  datastore.clients.forEach(client => {
    clientsByRiskTolerance[client.riskTolerance]++;
  });
  
  // Calculate aggregate asset allocation
  const assetAllocation = {};
  datastore.holdings.forEach(holding => {
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    if (security) {
      const type = security.securityType;
      assetAllocation[type] = (assetAllocation[type] || 0) + holding.marketValue;
    }
  });
  
  // Convert to percentages
  Object.keys(assetAllocation).forEach(type => {
    assetAllocation[type] = parseFloat(((assetAllocation[type] / totalAUM) * 100).toFixed(2));
  });
  
  return {
    totalClients,
    totalAccounts,
    totalPortfolios,
    totalAUM: parseFloat(totalAUM.toFixed(2)),
    totalUnrealizedGain: parseFloat(totalUnrealizedGain.toFixed(2)),
    averagePortfolioSize: parseFloat(averagePortfolioSize.toFixed(2)),
    clientsByRiskTolerance,
    assetAllocation
  };
}

/**
 * Get top performers
 */
function getTopPerformers(limit = 10) {
  const holdingsWithPerformance = datastore.holdings
    .map(holding => {
      const security = datastore.securities.find(s => s.securityId === holding.securityId);
      const portfolio = datastore.portfolios.find(p => p.portfolioId === holding.portfolioId);
      const client = portfolio ? datastore.clients.find(c => c.clientId === portfolio.clientId) : null;
      
      return {
        ...holding,
        securityName: security ? security.securityName : 'Unknown',
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
        dayChangePercent: security ? parseFloat(security.dayChangePercent) : 0
      };
    })
    .sort((a, b) => b.unrealizedGainPercent - a.unrealizedGainPercent)
    .slice(0, limit);
  
  return holdingsWithPerformance;
}

/**
 * Get top losers
 */
function getTopLosers(limit = 10) {
  const holdingsWithPerformance = datastore.holdings
    .map(holding => {
      const security = datastore.securities.find(s => s.securityId === holding.securityId);
      const portfolio = datastore.portfolios.find(p => p.portfolioId === holding.portfolioId);
      const client = portfolio ? datastore.clients.find(c => c.clientId === portfolio.clientId) : null;
      
      return {
        ...holding,
        securityName: security ? security.securityName : 'Unknown',
        clientName: client ? `${client.firstName} ${client.lastName}` : 'Unknown',
        dayChangePercent: security ? parseFloat(security.dayChangePercent) : 0
      };
    })
    .sort((a, b) => a.unrealizedGainPercent - b.unrealizedGainPercent)
    .slice(0, limit);
  
  return holdingsWithPerformance;
}

module.exports = {
  calculatePortfolioPerformance,
  calculateClientSummary,
  calculateDashboardOverview,
  getTopPerformers,
  getTopLosers
};





