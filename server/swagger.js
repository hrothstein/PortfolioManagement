const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Portfolio Management System API',
      version: '1.0.0',
      description: 'RESTful API for wealth management advisors to manage client portfolios, holdings, and transactions',
      contact: {
        name: 'API Support',
        email: 'support@portfoliomgmt.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:3001/api/v1',
        description: 'Development server'
      },
      {
        url: 'https://your-production-url.herokuapp.com/api/v1',
        description: 'Production server'
      }
    ],
    tags: [
      {
        name: 'Clients',
        description: 'Client management endpoints'
      },
      {
        name: 'Accounts',
        description: 'Account management endpoints'
      },
      {
        name: 'Portfolios',
        description: 'Portfolio management endpoints'
      },
      {
        name: 'Holdings',
        description: 'Holdings management endpoints'
      },
      {
        name: 'Transactions',
        description: 'Transaction management endpoints'
      },
      {
        name: 'Securities',
        description: 'Securities and market data endpoints'
      },
      {
        name: 'Dashboard',
        description: 'Dashboard and analytics endpoints'
      }
    ],
    components: {
      schemas: {
        Client: {
          type: 'object',
          properties: {
            clientId: { type: 'string', example: 'CLI-001' },
            customerId: { type: 'string', example: 'CUST-001' },
            firstName: { type: 'string', example: 'John' },
            lastName: { type: 'string', example: 'Smith' },
            email: { type: 'string', example: 'john.smith@email.com' },
            phone: { type: 'string', example: '555-0101' },
            dateOfBirth: { type: 'string', format: 'date', example: '1975-03-15' },
            riskTolerance: { 
              type: 'string', 
              enum: ['CONSERVATIVE', 'MODERATE', 'AGGRESSIVE'],
              example: 'MODERATE'
            },
            investmentObjective: { 
              type: 'string', 
              enum: ['INCOME', 'GROWTH', 'BALANCED', 'PRESERVATION'],
              example: 'GROWTH'
            },
            advisorId: { type: 'string', example: 'ADV-001' }
          }
        },
        Account: {
          type: 'object',
          properties: {
            accountId: { type: 'string', example: 'ACC-001' },
            clientId: { type: 'string', example: 'CLI-001' },
            accountType: { 
              type: 'string', 
              enum: ['BROKERAGE', 'IRA', 'ROTH_IRA', '401K'],
              example: 'BROKERAGE'
            },
            accountNumber: { type: 'string', example: 'BRK-78945612' },
            accountName: { type: 'string', example: 'John Smith Brokerage' },
            accountStatus: { 
              type: 'string', 
              enum: ['ACTIVE', 'INACTIVE', 'CLOSED'],
              example: 'ACTIVE'
            },
            cashBalance: { type: 'number', example: 15000.00 }
          }
        },
        Portfolio: {
          type: 'object',
          properties: {
            portfolioId: { type: 'string', example: 'PRT-001' },
            accountId: { type: 'string', example: 'ACC-001' },
            clientId: { type: 'string', example: 'CLI-001' },
            portfolioName: { type: 'string', example: 'Growth Portfolio' },
            portfolioType: { 
              type: 'string', 
              enum: ['MANAGED', 'SELF_DIRECTED'],
              example: 'MANAGED'
            },
            modelPortfolio: { type: 'string', example: 'GROWTH_60_40' },
            benchmarkIndex: { type: 'string', example: 'SPY' }
          }
        },
        Holding: {
          type: 'object',
          properties: {
            holdingId: { type: 'string', example: 'HLD-001' },
            portfolioId: { type: 'string', example: 'PRT-001' },
            securityId: { type: 'string', example: 'SEC-001' },
            symbol: { type: 'string', example: 'AAPL' },
            quantity: { type: 'number', example: 100 },
            averageCostBasis: { type: 'number', example: 145.00 },
            totalCostBasis: { type: 'number', example: 14500.00 },
            currentPrice: { type: 'number', example: 178.50 },
            marketValue: { type: 'number', example: 17850.00 },
            unrealizedGain: { type: 'number', example: 3350.00 },
            unrealizedGainPercent: { type: 'number', example: 23.10 },
            weight: { type: 'number', example: 15.5 }
          }
        },
        Transaction: {
          type: 'object',
          properties: {
            transactionId: { type: 'string', example: 'TXN-001' },
            portfolioId: { type: 'string', example: 'PRT-001' },
            securityId: { type: 'string', example: 'SEC-001' },
            symbol: { type: 'string', example: 'AAPL' },
            transactionType: { 
              type: 'string', 
              enum: ['BUY', 'SELL', 'DIVIDEND', 'TRANSFER_IN', 'TRANSFER_OUT', 'FEE'],
              example: 'BUY'
            },
            quantity: { type: 'number', example: 50 },
            pricePerUnit: { type: 'number', example: 145.00 },
            totalAmount: { type: 'number', example: 7250.00 },
            fees: { type: 'number', example: 0.00 },
            status: { 
              type: 'string', 
              enum: ['PENDING', 'SETTLED', 'CANCELLED'],
              example: 'SETTLED'
            }
          }
        },
        Security: {
          type: 'object',
          properties: {
            securityId: { type: 'string', example: 'SEC-001' },
            symbol: { type: 'string', example: 'AAPL' },
            securityName: { type: 'string', example: 'Apple Inc.' },
            securityType: { 
              type: 'string', 
              enum: ['STOCK', 'BOND', 'MUTUAL_FUND', 'ETF'],
              example: 'STOCK'
            },
            currentPrice: { type: 'number', example: 178.50 },
            previousClose: { type: 'number', example: 177.25 },
            dayChange: { type: 'number', example: 1.25 },
            dayChangePercent: { type: 'number', example: 0.71 }
          }
        },
        SuccessResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: true },
            data: { type: 'object' },
            timestamp: { type: 'string', format: 'date-time' }
          }
        },
        ErrorResponse: {
          type: 'object',
          properties: {
            success: { type: 'boolean', example: false },
            error: {
              type: 'object',
              properties: {
                code: { type: 'string', example: 'NOT_FOUND' },
                message: { type: 'string', example: 'Resource not found' }
              }
            },
            timestamp: { type: 'string', format: 'date-time' }
          }
        }
      }
    }
  },
  apis: ['./routes/*.js', './index.js']
};

const swaggerSpec = swaggerJsdoc(options);

module.exports = swaggerSpec;

