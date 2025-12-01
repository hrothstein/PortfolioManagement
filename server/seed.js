// Seed data generator for Portfolio Management System

const { datastore, generateId, clearDatastore } = require('./datastore');
const customers = require('./data/customers.json');
const securitiesData = require('./data/securities.json');

// Helper to generate random date in the past
function randomDate(daysAgo) {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysAgo));
  return date.toISOString();
}

// Helper to get random item from array
function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Risk tolerance distribution
const riskTolerances = [
  ...Array(15).fill('CONSERVATIVE'),
  ...Array(25).fill('MODERATE'),
  ...Array(10).fill('AGGRESSIVE')
];

// Investment objective distribution
const investmentObjectives = [
  ...Array(10).fill('INCOME'),
  ...Array(20).fill('GROWTH'),
  ...Array(15).fill('BALANCED'),
  ...Array(5).fill('PRESERVATION')
];

// Shuffle array
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function seedData() {
  console.log('🌱 Seeding data...');
  
  clearDatastore();
  
  // 1. Seed Securities
  console.log('  📊 Seeding securities...');
  securitiesData.forEach(secData => {
    const security = {
      securityId: generateId('security'),
      symbol: secData.symbol,
      securityName: secData.securityName,
      securityType: secData.securityType,
      sector: secData.sector || null,
      currentPrice: secData.currentPrice,
      previousClose: secData.previousClose,
      dayChange: secData.currentPrice - secData.previousClose,
      dayChangePercent: ((secData.currentPrice - secData.previousClose) / secData.previousClose * 100).toFixed(2),
      fiftyTwoWeekHigh: secData.fiftyTwoWeekHigh,
      fiftyTwoWeekLow: secData.fiftyTwoWeekLow,
      dividendYield: secData.dividendYield || null,
      peRatio: secData.peRatio || null,
      marketCap: secData.marketCap || null,
      bondRating: secData.bondRating || null,
      maturityDate: secData.maturityDate || null,
      couponRate: secData.couponRate || null,
      expenseRatio: secData.expenseRatio || null,
      lastUpdated: new Date().toISOString()
    };
    datastore.securities.push(security);
  });
  console.log(`    ✓ Created ${datastore.securities.length} securities`);
  
  // 2. Seed Clients
  console.log('  👥 Seeding clients...');
  const shuffledRisk = shuffle(riskTolerances);
  const shuffledObjective = shuffle(investmentObjectives);
  
  customers.forEach((customer, idx) => {
    const client = {
      clientId: generateId('client'),
      customerId: customer.customerId,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone,
      dateOfBirth: customer.dateOfBirth,
      address: customer.address,
      riskTolerance: shuffledRisk[idx],
      investmentObjective: shuffledObjective[idx],
      advisorId: 'ADV-001',
      createdAt: randomDate(730),
      updatedAt: randomDate(30)
    };
    datastore.clients.push(client);
  });
  console.log(`    ✓ Created ${datastore.clients.length} clients`);
  
  // 3. Seed Accounts (100 accounts)
  console.log('  🏦 Seeding accounts...');
  const accountTypes = ['BROKERAGE', 'IRA', 'ROTH_IRA', '401K'];
  
  datastore.clients.forEach((client, idx) => {
    // Every client gets a BROKERAGE account
    const brokerageAccount = {
      accountId: generateId('account'),
      clientId: client.clientId,
      accountType: 'BROKERAGE',
      accountNumber: `BRK-${String(10000000 + idx).substring(1)}`,
      accountName: `${client.firstName} ${client.lastName} Brokerage`,
      accountStatus: 'ACTIVE',
      openDate: randomDate(730).split('T')[0],
      cashBalance: Math.floor(Math.random() * 50000) + 5000,
      createdAt: randomDate(730),
      updatedAt: randomDate(30)
    };
    datastore.accounts.push(brokerageAccount);
    
    // 25 clients get IRA (idx 0-24)
    if (idx < 25) {
      const iraAccount = {
        accountId: generateId('account'),
        clientId: client.clientId,
        accountType: 'IRA',
        accountNumber: `IRA-${String(20000000 + idx).substring(1)}`,
        accountName: `${client.firstName} ${client.lastName} IRA`,
        accountStatus: 'ACTIVE',
        openDate: randomDate(730).split('T')[0],
        cashBalance: Math.floor(Math.random() * 30000) + 2000,
        createdAt: randomDate(730),
        updatedAt: randomDate(30)
      };
      datastore.accounts.push(iraAccount);
    }
    
    // 15 clients get ROTH_IRA (idx 25-39)
    if (idx >= 25 && idx < 40) {
      const rothAccount = {
        accountId: generateId('account'),
        clientId: client.clientId,
        accountType: 'ROTH_IRA',
        accountNumber: `ROTH-${String(30000000 + idx).substring(1)}`,
        accountName: `${client.firstName} ${client.lastName} Roth IRA`,
        accountStatus: 'ACTIVE',
        openDate: randomDate(730).split('T')[0],
        cashBalance: Math.floor(Math.random() * 25000) + 1000,
        createdAt: randomDate(730),
        updatedAt: randomDate(30)
      };
      datastore.accounts.push(rothAccount);
    }
    
    // 10 clients get 401K (idx 40-49)
    if (idx >= 40) {
      const k401Account = {
        accountId: generateId('account'),
        clientId: client.clientId,
        accountType: '401K',
        accountNumber: `401K-${String(40000000 + idx).substring(1)}`,
        accountName: `${client.firstName} ${client.lastName} 401(k)`,
        accountStatus: 'ACTIVE',
        openDate: randomDate(730).split('T')[0],
        cashBalance: Math.floor(Math.random() * 20000) + 1000,
        createdAt: randomDate(730),
        updatedAt: randomDate(30)
      };
      datastore.accounts.push(k401Account);
    }
  });
  console.log(`    ✓ Created ${datastore.accounts.length} accounts`);
  
  // 4. Seed Portfolios (1-2 per account, ~150 total)
  console.log('  📁 Seeding portfolios...');
  datastore.accounts.forEach(account => {
    const client = datastore.clients.find(c => c.clientId === account.clientId);
    const numPortfolios = Math.random() > 0.3 ? 2 : 1; // 70% get 2 portfolios, 30% get 1
    
    for (let i = 0; i < numPortfolios; i++) {
      const portfolioNames = {
        'BROKERAGE': ['Growth Portfolio', 'Balanced Portfolio'],
        'IRA': ['Retirement Growth', 'Income Portfolio'],
        'ROTH_IRA': ['Tax-Free Growth', 'Long-Term Growth'],
        '401K': ['Target Retirement 2050', 'Aggressive Growth']
      };
      
      const portfolio = {
        portfolioId: generateId('portfolio'),
        accountId: account.accountId,
        clientId: client.clientId,
        portfolioName: portfolioNames[account.accountType][i] || 'Investment Portfolio',
        portfolioType: Math.random() > 0.2 ? 'MANAGED' : 'SELF_DIRECTED',
        modelPortfolio: client.riskTolerance === 'AGGRESSIVE' ? 'GROWTH_80_20' : 
                        client.riskTolerance === 'MODERATE' ? 'GROWTH_60_40' : 'CONSERVATIVE_40_60',
        inceptionDate: account.openDate,
        benchmarkIndex: 'SPY',
        createdAt: randomDate(730),
        updatedAt: randomDate(30)
      };
      datastore.portfolios.push(portfolio);
    }
  });
  console.log(`    ✓ Created ${datastore.portfolios.length} portfolios`);
  
  // 5. Seed Holdings (5-15 per portfolio)
  console.log('  💼 Seeding holdings...');
  datastore.portfolios.forEach(portfolio => {
    const client = datastore.clients.find(c => c.clientId === portfolio.clientId);
    const numHoldings = Math.floor(Math.random() * 11) + 5; // 5-15 holdings
    
    // Select securities based on risk tolerance
    let selectedSecurities = [];
    if (client.riskTolerance === 'AGGRESSIVE') {
      const stocks = datastore.securities.filter(s => s.securityType === 'STOCK');
      const etfs = datastore.securities.filter(s => s.securityType === 'ETF' && s.symbol !== 'BND');
      selectedSecurities = shuffle([...stocks, ...etfs]).slice(0, numHoldings);
    } else if (client.riskTolerance === 'MODERATE') {
      const stocks = datastore.securities.filter(s => s.securityType === 'STOCK').slice(0, 8);
      const bonds = datastore.securities.filter(s => s.securityType === 'BOND');
      const mutualFunds = datastore.securities.filter(s => s.securityType === 'MUTUAL_FUND');
      selectedSecurities = shuffle([...stocks, ...bonds, ...mutualFunds]).slice(0, numHoldings);
    } else {
      const stocks = datastore.securities.filter(s => s.securityType === 'STOCK' && s.dividendYield > 2);
      const bonds = datastore.securities.filter(s => s.securityType === 'BOND');
      const mutualFunds = datastore.securities.filter(s => s.securityType === 'MUTUAL_FUND');
      selectedSecurities = shuffle([...bonds, ...mutualFunds, ...stocks]).slice(0, numHoldings);
    }
    
    selectedSecurities.forEach(security => {
      const quantity = Math.floor(Math.random() * 100) + 10;
      const costBasisMultiplier = 0.7 + Math.random() * 0.5; // 0.7 to 1.2
      const averageCostBasis = security.currentPrice * costBasisMultiplier;
      const totalCostBasis = quantity * averageCostBasis;
      const marketValue = quantity * security.currentPrice;
      const unrealizedGain = marketValue - totalCostBasis;
      const unrealizedGainPercent = (unrealizedGain / totalCostBasis) * 100;
      
      const holding = {
        holdingId: generateId('holding'),
        portfolioId: portfolio.portfolioId,
        securityId: security.securityId,
        symbol: security.symbol,
        quantity: quantity,
        averageCostBasis: parseFloat(averageCostBasis.toFixed(2)),
        totalCostBasis: parseFloat(totalCostBasis.toFixed(2)),
        currentPrice: security.currentPrice,
        marketValue: parseFloat(marketValue.toFixed(2)),
        unrealizedGain: parseFloat(unrealizedGain.toFixed(2)),
        unrealizedGainPercent: parseFloat(unrealizedGainPercent.toFixed(2)),
        weight: 0, // Will be calculated later
        acquiredDate: randomDate(730).split('T')[0],
        createdAt: randomDate(730),
        updatedAt: new Date().toISOString()
      };
      datastore.holdings.push(holding);
    });
  });
  console.log(`    ✓ Created ${datastore.holdings.length} holdings`);
  
  // Calculate weights for holdings
  datastore.portfolios.forEach(portfolio => {
    const holdings = datastore.holdings.filter(h => h.portfolioId === portfolio.portfolioId);
    const totalValue = holdings.reduce((sum, h) => sum + h.marketValue, 0);
    holdings.forEach(holding => {
      holding.weight = parseFloat(((holding.marketValue / totalValue) * 100).toFixed(2));
    });
  });
  
  // 6. Seed Transactions (historical transactions for each holding)
  console.log('  💰 Seeding transactions...');
  datastore.holdings.forEach(holding => {
    // Create initial BUY transaction
    const buyTransaction = {
      transactionId: generateId('transaction'),
      portfolioId: holding.portfolioId,
      holdingId: holding.holdingId,
      securityId: holding.securityId,
      symbol: holding.symbol,
      transactionType: 'BUY',
      quantity: holding.quantity,
      pricePerUnit: holding.averageCostBasis,
      totalAmount: holding.totalCostBasis,
      fees: 0.00,
      netAmount: holding.totalCostBasis,
      transactionDate: holding.acquiredDate + 'T10:30:00Z',
      settlementDate: new Date(new Date(holding.acquiredDate).getTime() + 3 * 24 * 60 * 60 * 1000).toISOString().split('T')[0] + 'T00:00:00Z',
      status: 'SETTLED',
      notes: 'Initial position',
      createdAt: holding.acquiredDate + 'T10:30:00Z'
    };
    datastore.transactions.push(buyTransaction);
    
    // Add some dividend transactions for stocks with dividends
    const security = datastore.securities.find(s => s.securityId === holding.securityId);
    if (security && security.dividendYield > 0) {
      const numDividends = Math.floor(Math.random() * 4) + 1;
      for (let i = 0; i < numDividends; i++) {
        const divAmount = (holding.quantity * security.currentPrice * security.dividendYield / 100 / 4).toFixed(2);
        const divTransaction = {
          transactionId: generateId('transaction'),
          portfolioId: holding.portfolioId,
          holdingId: holding.holdingId,
          securityId: holding.securityId,
          symbol: holding.symbol,
          transactionType: 'DIVIDEND',
          quantity: 0,
          pricePerUnit: 0,
          totalAmount: parseFloat(divAmount),
          fees: 0.00,
          netAmount: parseFloat(divAmount),
          transactionDate: randomDate(365),
          settlementDate: randomDate(365),
          status: 'SETTLED',
          notes: 'Quarterly dividend',
          createdAt: randomDate(365)
        };
        datastore.transactions.push(divTransaction);
      }
    }
  });
  console.log(`    ✓ Created ${datastore.transactions.length} transactions`);
  
  console.log('✅ Seed data complete!');
  console.log(`
    Summary:
    - ${datastore.clients.length} clients
    - ${datastore.accounts.length} accounts
    - ${datastore.portfolios.length} portfolios
    - ${datastore.holdings.length} holdings
    - ${datastore.transactions.length} transactions
    - ${datastore.securities.length} securities
  `);
}

module.exports = { seedData };

