# Portfolio Management System - Product Requirements Document

**Version:** 1.2 (MCP Integration)  
**Last Updated:** December 2024  
**Status:** ✅ Implemented & Deployed (MCP in development)  
**Production URL:** https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/  
**GitHub Repository:** https://github.com/hrothstein/PortfolioManagement

---

## Version History

| Version | Date | Description |
|---------|------|-------------|
| v1.2 | December 2024 | Added MCP Server integration specification |
| v1.1 | December 2024 | Post-implementation update reflecting actual build |
| v1.0 | October 2024 | Original specification |

### v1.2 Changes
- Added Section 16: MCP Server Integration
- Defined 41 MCP tools mapping 1:1 to REST APIs
- Added MCP implementation instructions for Cursor
- Added Claude Desktop configuration
- Updated project structure with MCP files

### v1.1 Changes
- Added Swagger API documentation
- Updated project structure to pages/components pattern
- Clarified MVP scope vs Phase 2 features
- Added production deployment URL
- Updated API endpoint paths for nested resources
- Added additional dashboard endpoints
- Updated seed data specifications
- Added Vite, Axios, Chart.js to tech stack

---

## 1. Executive Summary

### 1.1 Purpose
A Portfolio Management System for demo purposes that showcases wealth management workflows for MuleSoft and Salesforce Financial Services Cloud integrations.

### 1.2 Scope
- **Asset Types:** Stocks, Bonds, Mutual Funds, ETFs
- **Core Entities:** Clients, Accounts, Portfolios, Holdings, Transactions, Securities
- **Tech Stack:** React frontend, Node.js/Express backend, In-memory datastore
- **Deployment:** Heroku (heroku-dta-demos team)
- **MCP:** Model Context Protocol integration (see Section 16)

### 1.3 Key Features (MVP - Implemented)
- Full CRUD API operations for all entities
- Advisor portal with view capabilities
- RESTful APIs (open/unsecured - no auth required)
- Pre-loaded with 50 customers from bankingcoredemo
- Portfolio metrics: total value, gain/loss, allocation percentages
- Mock market data with realistic pricing
- Interactive Swagger API documentation
- MCP Server with 41 tools for AI agent integration (in development)

---

## 2. Technical Architecture

### 2.1 System Overview

```
┌─────────────────────────────────────────────────────────────┐
│                Portfolio Management System                   │
│                                                              │
│  ┌──────────────────┐         ┌──────────────────────────┐  │
│  │   React Frontend │         │   Node.js/Express API    │  │
│  │  (Advisor Portal)│ ──────▶ │   /api/v1/*              │  │
│  │   Port: 3000     │         │   Port: 3001             │  │
│  └──────────────────┘         └──────────────────────────┘  │
│                                         │                    │
│                                         ▼                    │
│                               ┌──────────────────────────┐  │
│                               │   In-Memory Datastore    │  │
│                               │   (Resets on Restart)    │  │
│                               └──────────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
```

### 2.2 Technology Stack

| Component | Technology |
|-----------|------------|
| Frontend | React 18.2, Tailwind CSS 3.3.6, Vite, Axios |
| Backend | Node.js 18, Express.js 4.18, Swagger UI |
| MCP Server | @modelcontextprotocol/sdk |
| Charting | Chart.js |
| Datastore | In-memory JavaScript objects |
| Authentication | None (open APIs for demo) |
| Deployment | Heroku |

### 2.3 In-Memory Datastore Structure

```javascript
const datastore = {
  clients: [],        // 50 customers from bankingcoredemo
  accounts: [],       // Brokerage, IRA, 401k accounts
  portfolios: [],     // Container for holdings
  holdings: [],       // Individual positions
  transactions: [],   // Buy/sell/dividend history
  securities: []      // Mock market data (stocks, bonds, etc.)
};
```

---

## 3. Data Models

### 3.1 Clients

Use the **exact 50 customers from bankingcoredemo** as clients.

```javascript
{
  "clientId": "CLI-001",
  "customerId": "CUST-001",        // Reference to bankingcoredemo
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@email.com",
  "phone": "555-0101",
  "dateOfBirth": "1975-03-15",
  "riskTolerance": "MODERATE",     // CONSERVATIVE, MODERATE, AGGRESSIVE
  "investmentObjective": "GROWTH", // INCOME, GROWTH, BALANCED, PRESERVATION
  "advisorId": "ADV-001",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Risk Tolerance Distribution (seed data):**
- CONSERVATIVE: 15 clients
- MODERATE: 25 clients
- AGGRESSIVE: 10 clients

**Investment Objective Distribution:**
- INCOME: 10 clients
- GROWTH: 20 clients
- BALANCED: 15 clients
- PRESERVATION: 5 clients

### 3.2 Accounts

```javascript
{
  "accountId": "ACC-001",
  "clientId": "CLI-001",
  "accountType": "BROKERAGE",      // BROKERAGE, IRA, ROTH_IRA, 401K
  "accountNumber": "BRK-78945612",
  "accountName": "John Smith Brokerage",
  "accountStatus": "ACTIVE",       // ACTIVE, INACTIVE, CLOSED
  "openDate": "2020-06-15",
  "cashBalance": 15000.00,         // Available cash in account
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Account Type Distribution (100 accounts across 50 clients):**
- BROKERAGE: 50 (one per client)
- IRA: 25
- ROTH_IRA: 15
- 401K: 10

### 3.3 Portfolios

```javascript
{
  "portfolioId": "PRT-001",
  "accountId": "ACC-001",
  "clientId": "CLI-001",
  "portfolioName": "Growth Portfolio",
  "portfolioType": "MANAGED",      // MANAGED, SELF_DIRECTED
  "modelPortfolio": "GROWTH_60_40", // Optional model reference
  "inceptionDate": "2020-06-20",
  "benchmarkIndex": "SPY",         // For performance comparison
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 3.4 Securities (Mock Market Data)

```javascript
{
  "securityId": "SEC-001",
  "symbol": "AAPL",
  "securityName": "Apple Inc.",
  "securityType": "STOCK",         // STOCK, BOND, MUTUAL_FUND, ETF
  "sector": "TECHNOLOGY",          // For stocks
  "currentPrice": 178.50,
  "previousClose": 177.25,
  "dayChange": 1.25,
  "dayChangePercent": 0.71,
  "fiftyTwoWeekHigh": 199.62,
  "fiftyTwoWeekLow": 124.17,
  "dividendYield": 0.55,           // Percentage
  "peRatio": 28.5,                 // For stocks
  "marketCap": 2850000000000,      // For stocks
  "bondRating": null,              // For bonds: AAA, AA, A, BBB, etc.
  "maturityDate": null,            // For bonds
  "couponRate": null,              // For bonds
  "expenseRatio": null,            // For mutual funds/ETFs
  "lastUpdated": "2024-10-15T16:00:00Z"
}
```

**Seed Securities (30 total):**

| Type | Count | Examples |
|------|-------|----------|
| STOCK | 15 | AAPL, MSFT, GOOGL, AMZN, NVDA, JPM, V, JNJ, PG, XOM, META, TSLA, UNH, HD, BAC |
| BOND | 5 | US Treasury 10Y, Corporate AAA, Municipal, High Yield, TIPS |
| MUTUAL_FUND | 5 | Vanguard 500, Fidelity Growth, T. Rowe Price Blue Chip, PIMCO Total Return, American Funds Growth |
| ETF | 5 | SPY, QQQ, BND, VTI, ARKK |

### 3.5 Holdings

```javascript
{
  "holdingId": "HLD-001",
  "portfolioId": "PRT-001",
  "securityId": "SEC-001",
  "symbol": "AAPL",
  "quantity": 100,
  "averageCostBasis": 145.00,      // Per share
  "totalCostBasis": 14500.00,
  "currentPrice": 178.50,          // From securities
  "marketValue": 17850.00,         // quantity * currentPrice
  "unrealizedGain": 3350.00,       // marketValue - totalCostBasis
  "unrealizedGainPercent": 23.10,  // (unrealizedGain / totalCostBasis) * 100
  "weight": 15.5,                  // Percentage of portfolio
  "acquiredDate": "2023-01-15",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### 3.6 Transactions

```javascript
{
  "transactionId": "TXN-001",
  "portfolioId": "PRT-001",
  "holdingId": "HLD-001",          // Null for new buys
  "securityId": "SEC-001",
  "symbol": "AAPL",
  "transactionType": "BUY",        // BUY, SELL, DIVIDEND, TRANSFER_IN, TRANSFER_OUT, FEE
  "quantity": 50,
  "pricePerUnit": 145.00,
  "totalAmount": 7250.00,
  "fees": 0.00,
  "netAmount": 7250.00,
  "transactionDate": "2023-01-15T10:30:00Z",
  "settlementDate": "2023-01-18T00:00:00Z",
  "status": "SETTLED",             // PENDING, SETTLED, CANCELLED
  "notes": "Initial position",
  "createdAt": "2024-01-15T10:00:00Z"
}
```

---

## 4. API Specifications

### 4.1 Base URLs

| Environment | URL |
|-------------|-----|
| Local | `http://localhost:3001/api/v1` |
| Production | `https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/api/v1` |
| Swagger Docs | `https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/api-docs` |

### 4.2 Common Response Format

**Success:**
```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-10-15T10:00:00Z"
}
```

**Error:**
```json
{
  "success": false,
  "error": {
    "code": "NOT_FOUND",
    "message": "Client not found"
  },
  "timestamp": "2024-10-15T10:00:00Z"
}
```

### 4.3 Client APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/clients` | List all clients |
| GET | `/clients/:clientId` | Get client by ID |
| GET | `/clients/:clientId/summary` | Get client with portfolio summary |
| POST | `/clients` | Create new client |
| PUT | `/clients/:clientId` | Update client |
| DELETE | `/clients/:clientId` | Delete client |

**GET /clients/:clientId/summary Response:**
```json
{
  "success": true,
  "data": {
    "client": { ... },
    "summary": {
      "totalAccounts": 2,
      "totalPortfolios": 3,
      "totalMarketValue": 485000.00,
      "totalCostBasis": 425000.00,
      "totalUnrealizedGain": 60000.00,
      "totalUnrealizedGainPercent": 14.12,
      "assetAllocation": {
        "STOCK": 65.5,
        "BOND": 20.0,
        "MUTUAL_FUND": 10.0,
        "ETF": 4.5
      }
    }
  }
}
```

### 4.4 Account APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/accounts` | List all accounts |
| GET | `/accounts/:accountId` | Get account by ID |
| GET | `/accounts/client/:clientId` | Get accounts for client |
| POST | `/accounts` | Create new account |
| PUT | `/accounts/:accountId` | Update account |
| DELETE | `/accounts/:accountId` | Delete account |

### 4.5 Portfolio APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolios` | List all portfolios |
| GET | `/portfolios/:portfolioId` | Get portfolio by ID |
| GET | `/portfolios/:portfolioId/performance` | Get portfolio with performance metrics |
| GET | `/portfolios/account/:accountId` | Get portfolios for account |
| POST | `/portfolios` | Create new portfolio |
| PUT | `/portfolios/:portfolioId` | Update portfolio |
| DELETE | `/portfolios/:portfolioId` | Delete portfolio |

**GET /portfolios/:portfolioId/performance Response:**
```json
{
  "success": true,
  "data": {
    "portfolio": { ... },
    "performance": {
      "totalMarketValue": 115000.00,
      "totalCostBasis": 100000.00,
      "totalUnrealizedGain": 15000.00,
      "totalUnrealizedGainPercent": 15.00,
      "dayChange": 450.00,
      "dayChangePercent": 0.39,
      "holdings": [ ... ],
      "assetAllocation": {
        "STOCK": 70.0,
        "BOND": 15.0,
        "ETF": 15.0
      },
      "sectorAllocation": {
        "TECHNOLOGY": 35.0,
        "HEALTHCARE": 15.0,
        "FINANCIAL": 12.0,
        "CONSUMER": 8.0,
        "OTHER": 30.0
      },
      "topHoldings": [
        { "symbol": "AAPL", "weight": 18.5 },
        { "symbol": "MSFT", "weight": 15.2 },
        { "symbol": "GOOGL", "weight": 12.8 }
      ]
    }
  }
}
```

### 4.6 Holding APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/holdings` | List all holdings |
| GET | `/holdings/:holdingId` | Get holding by ID |
| GET | `/holdings/portfolio/:portfolioId` | Get holdings for portfolio |
| POST | `/holdings` | Create new holding |
| PUT | `/holdings/:holdingId` | Update holding |
| DELETE | `/holdings/:holdingId` | Delete holding |

### 4.7 Transaction APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | List all transactions |
| GET | `/transactions/:transactionId` | Get transaction by ID |
| GET | `/transactions/portfolio/:portfolioId` | Get transactions for portfolio |
| POST | `/transactions` | Create new transaction |
| PUT | `/transactions/:transactionId` | Update transaction |
| DELETE | `/transactions/:transactionId` | Delete transaction |

**Query Parameters for GET /transactions:**
- `startDate`: Filter by date range start
- `endDate`: Filter by date range end
- `type`: Filter by transaction type
- `symbol`: Filter by security symbol

### 4.8 Security APIs (Market Data)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/securities` | List all securities |
| GET | `/securities/:securityId` | Get security by ID |
| GET | `/securities/symbol/:symbol` | Get security by symbol |
| GET | `/securities/type/:type` | Get securities by type |
| PUT | `/securities/:securityId` | Update security price (for demo) |

### 4.9 Dashboard/Summary APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard/overview` | Get system-wide overview |
| GET | `/dashboard/top-performers` | Get top performing holdings |
| GET | `/dashboard/top-losers` | Get worst performing holdings |
| GET | `/dashboard/recent-transactions` | Get recent transactions |
| GET | `/dashboard/allocation` | Get aggregate asset allocation |

**GET /dashboard/overview Response:**
```json
{
  "success": true,
  "data": {
    "totalClients": 50,
    "totalAccounts": 100,
    "totalPortfolios": 165,
    "totalAUM": 18000000.00,
    "totalUnrealizedGain": 800000.00,
    "averagePortfolioSize": 109090.91,
    "clientsByRiskTolerance": {
      "CONSERVATIVE": 15,
      "MODERATE": 25,
      "AGGRESSIVE": 10
    },
    "assetAllocation": {
      "STOCK": 62.5,
      "BOND": 22.0,
      "MUTUAL_FUND": 8.5,
      "ETF": 7.0
    }
  }
}
```

### 4.10 System APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/health` | Health check endpoint |
| GET | `/api-docs` | Swagger API documentation UI |

---

## 5. Frontend Requirements

### 5.1 Advisor Portal Pages - MVP Scope

**Implemented in MVP:**

| Page | Features |
|------|----------|
| **Dashboard** | Total AUM, client/portfolio counts, asset allocation pie chart, top performers list, recent transactions |
| **Clients List** | View all clients with name, risk tolerance, email, phone, objective, city |
| **Client Detail** | Client info card, accounts list, portfolio summary, asset allocation chart |
| **Accounts List** | All accounts with filter by type |
| **Portfolios List** | All portfolios with filter by type, shows value and gain/loss |
| **Portfolio Detail** | Holdings table, asset allocation pie chart, sector allocation, transaction history |
| **Transactions** | Transaction history with filters by type and symbol |
| **Securities** | Market data list with filter by security type, current prices |

### 5.2 Phase 2 Features (Deferred)

| Feature | Description |
|---------|-------------|
| Account Detail Page | Dedicated account detail view |
| Add/Edit Modals | Modal forms for creating/editing all entities |
| Delete Confirmations | Confirmation dialogs before deletions |
| CRUD from UI | Full create/update/delete operations from frontend |
| Sortable Columns | Click-to-sort table columns |
| Top Losers Widget | Dashboard widget for worst performers |
| Day Change Trend | Trend arrows on AUM display |

### 5.3 UI Components

- Tailwind CSS for styling
- Professional financial color scheme
- Responsive design (desktop-optimized)
- Loading states for all data fetches
- Error handling with user-friendly messages
- Chart.js for pie charts (asset allocation, sector allocation)

---

## 6. Seed Data Requirements

### 6.1 Clients
- 50 customers from bankingcoredemo (exact match)
- Risk tolerance and investment objective assigned per distribution

### 6.2 Accounts
- 100 accounts across 50 clients
- Every client gets 1 BROKERAGE account
- Additional IRA/ROTH_IRA/401K accounts distributed

### 6.3 Securities
- 30 securities with realistic pricing
- 15 stocks, 5 bonds, 5 mutual funds, 5 ETFs

### 6.4 Portfolios
- 160-175 portfolios total (~1-2 per account)
- 70% of accounts get 2 portfolios, 30% get 1 portfolio
- Realistic names based on account type

### 6.5 Holdings
- 5-15 holdings per portfolio (~1,700 total)
- Varied cost basis vs current price for realistic gain/loss

### 6.6 Transactions
- ~4,500+ historical transactions
- BUY transactions for each holding
- DIVIDEND transactions for dividend-paying securities
- Date range: past 2 years

---

## 7. Project Structure

```
portfolio-management-system/
├── package.json
├── Dockerfile
├── Procfile                      # Heroku process declaration
├── .gitignore
├── .dockerignore
├── README.md
├── QUICKSTART.md
├── SWAGGER_GUIDE.md
├── server/
│   ├── index.js                  # Express server entry
│   ├── datastore.js              # In-memory data store
│   ├── seed.js                   # Seed data loader
│   ├── swagger.js                # Swagger/OpenAPI configuration
│   ├── routes/
│   │   ├── clients.js
│   │   ├── accounts.js
│   │   ├── portfolios.js
│   │   ├── holdings.js
│   │   ├── transactions.js
│   │   ├── securities.js
│   │   └── dashboard.js
│   ├── services/
│   │   └── portfolioService.js   # Portfolio and dashboard calculations
│   ├── mcp/                      # MCP Server (Section 16)
│   │   ├── index.js              # MCP server entry point
│   │   ├── tools/
│   │   │   ├── clientTools.js
│   │   │   ├── accountTools.js
│   │   │   ├── portfolioTools.js
│   │   │   ├── holdingTools.js
│   │   │   ├── transactionTools.js
│   │   │   ├── securityTools.js
│   │   │   └── dashboardTools.js
│   │   └── utils/
│   │       └── responseFormatter.js
│   └── data/
│       ├── customers.json        # 50 customers from bankingcoredemo
│       └── securities.json       # Mock market data
├── client/
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── index.css
│   │   ├── pages/                # Page-level components
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ClientList.jsx
│   │   │   ├── ClientDetail.jsx
│   │   │   ├── AccountList.jsx
│   │   │   ├── PortfolioList.jsx
│   │   │   ├── PortfolioDetail.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   └── SecurityList.jsx
│   │   ├── components/
│   │   │   ├── common/
│   │   │   │   ├── Header.jsx
│   │   │   │   ├── Sidebar.jsx
│   │   │   │   ├── Card.jsx
│   │   │   │   ├── Modal.jsx
│   │   │   │   ├── Loading.jsx
│   │   │   │   ├── ErrorMessage.jsx
│   │   │   │   └── StatCard.jsx
│   │   │   └── charts/
│   │   │       └── AllocationChart.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── formatters.js
└── docs/
    └── API.md
```

---

## 8. Build Instructions

### 8.1 Prerequisites
- Node.js 18+
- npm or yarn

### 8.2 Git Workflow

```bash
# Clone the repo
git clone https://github.com/hrothstein/PortfolioManagement.git
cd PortfolioManagement

# For new features after MVP, use feature branches:
git checkout -b feature/new-feature
# ... make changes ...
git push origin feature/new-feature
# Create PR for review
```

**Note:** Initial MVP build was done on main for rapid prototyping. Post-MVP development should use feature branches.

### 8.3 Running Locally

```bash
# Terminal 1 - Backend
cd server
npm install
npm run dev    # Runs on port 3001

# Terminal 2 - Frontend
cd client
npm install
npm run dev    # Runs on port 3000
```

### 8.4 Dockerfile

```dockerfile
FROM node:18-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install dependencies
RUN npm install
RUN cd server && npm install
RUN cd client && npm install

# Copy source code
COPY . .

# Build frontend
RUN cd client && npm run build

# Move build to server's public folder
RUN mkdir -p server/public && cp -r client/dist/* server/public/

WORKDIR /app/server

EXPOSE 3001

CMD ["node", "index.js"]
```

---

## 9. Deployment

### 9.1 Heroku Deployment

**Production URL:** https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/

**Required files:**
- `Procfile` with: `web: cd server && node index.js`
- `heroku-postbuild` script in root package.json

**Deployment steps:**
1. App deployed to heroku-dta-demos team
2. Set environment variables
3. Deploy from main branch

Note: No database addon needed - data is in-memory and resets on dyno restart.

### 9.2 Environment Variables

```
NODE_ENV=production
PORT=3001
```

---

## 10. Demo Scenarios

### 10.1 Wealth Management Advisor Walkthrough

**Scenario 1: Client Review**
1. Open advisor portal
2. Navigate to Clients
3. Click on a client (e.g., "John Smith")
4. View client summary (total value, allocation, performance)
5. Drill into portfolio details
6. Review holdings and recent transactions

**Scenario 2: Portfolio Analysis**
1. Navigate to Portfolios
2. Select a portfolio
3. View holdings breakdown with gain/loss
4. Examine asset allocation pie chart
5. Review sector allocation
6. Check transaction history

**Scenario 3: Market Data View**
1. Navigate to Securities
2. Filter by security type (STOCK, BOND, etc.)
3. View current prices and day changes
4. Update a price (demo market movement)
5. Return to dashboard to see impact

**Scenario 4: API Demo (Swagger)**
1. Navigate to `/api-docs`
2. Demonstrate interactive API documentation
3. Execute sample API calls
4. Show response formats

### 10.2 MuleSoft Integration Demo Points

When integrated with MuleSoft later:
- **Experience API**: Mobile app / Customer portal access
- **Process API**: Trade execution orchestration, Compliance checks
- **System API**: Connect to Portfolio System, Market Data providers, Custodian systems

---

## 11. Future Enhancements (Out of Scope for MVP)

### Phase 2 (Near-term)
- Add/Edit/Delete modals for all entities
- Account detail page
- Confirmation dialogs
- Sortable table columns
- Top losers dashboard widget

### Phase 3 (Future)
- Real-time market data feeds
- Trade execution simulation
- Performance benchmarking vs indices
- Tax lot tracking
- Compliance and suitability checks
- Document generation (statements, reports)
- Multi-advisor support with permissions

---

## 12. Acceptance Criteria

### 12.1 Backend ✅ Complete
- [x] All CRUD endpoints working for all entities
- [x] Portfolio performance calculations accurate
- [x] Client summary calculations accurate
- [x] Dashboard aggregations working
- [x] Seed data loads correctly on startup
- [x] No authentication required (open APIs)
- [x] Swagger documentation available

### 12.2 Frontend ✅ MVP Complete
- [x] Dashboard displays metrics and charts
- [x] All list pages render with data
- [x] Client and Portfolio detail pages show data
- [x] Charts render correctly (pie charts)
- [x] Responsive on desktop
- [x] No console errors
- [ ] CRUD operations from UI (Phase 2)
- [ ] Account detail page (Phase 2)

### 12.3 Deployment ✅ Complete
- [x] Docker build succeeds
- [x] Heroku deployment works
- [x] Data resets cleanly on restart

---

## 13. Production Metrics

Current production metrics (as of deployment):

| Metric | Value |
|--------|-------|
| Total Clients | 50 |
| Total Accounts | 100 |
| Total Portfolios | ~165 |
| Total Holdings | ~1,700 |
| Total Transactions | ~4,500 |
| Total AUM | ~$18M |
| Unrealized Gain | ~$800K |

---

## 14. Reference URLs

| Resource | URL |
|----------|-----|
| Production App | https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/ |
| Swagger Docs | https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/api-docs |
| API Base | https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/api/v1 |
| GitHub Repo | https://github.com/hrothstein/PortfolioManagement |

---

## 15. Reference: 50 Customers from BankingCoreDemo

Use the same customer data structure. Here are the first 5 as reference:

```json
[
  {
    "customerId": "CUST-001",
    "firstName": "John",
    "lastName": "Smith",
    "email": "john.smith@email.com",
    "phone": "555-0101",
    "dateOfBirth": "1975-03-15",
    "ssn": "***-**-1234",
    "address": {
      "street": "123 Main St",
      "city": "New York",
      "state": "NY",
      "zipCode": "10001"
    }
  },
  {
    "customerId": "CUST-002",
    "firstName": "Sarah",
    "lastName": "Johnson",
    "email": "sarah.johnson@email.com",
    "phone": "555-0102",
    "dateOfBirth": "1982-07-22",
    "ssn": "***-**-5678",
    "address": {
      "street": "456 Oak Ave",
      "city": "Los Angeles",
      "state": "CA",
      "zipCode": "90001"
    }
  },
  {
    "customerId": "CUST-003",
    "firstName": "Michael",
    "lastName": "Williams",
    "email": "michael.williams@email.com",
    "phone": "555-0103",
    "dateOfBirth": "1968-11-30",
    "ssn": "***-**-9012",
    "address": {
      "street": "789 Pine Rd",
      "city": "Chicago",
      "state": "IL",
      "zipCode": "60601"
    }
  },
  {
    "customerId": "CUST-004",
    "firstName": "Emily",
    "lastName": "Brown",
    "email": "emily.brown@email.com",
    "phone": "555-0104",
    "dateOfBirth": "1990-04-18",
    "ssn": "***-**-3456",
    "address": {
      "street": "321 Elm St",
      "city": "Houston",
      "state": "TX",
      "zipCode": "77001"
    }
  },
  {
    "customerId": "CUST-005",
    "firstName": "David",
    "lastName": "Jones",
    "email": "david.jones@email.com",
    "phone": "555-0105",
    "dateOfBirth": "1978-09-05",
    "ssn": "***-**-7890",
    "address": {
      "street": "654 Maple Dr",
      "city": "Phoenix",
      "state": "AZ",
      "zipCode": "85001"
    }
  }
]
```

**Note:** Pull the complete 50 customers from bankingcoredemo's seed data file.

---

## 16. MCP Server Integration

### 16.1 Overview

The Model Context Protocol (MCP) server exposes all Portfolio Management System APIs as tools that AI agents (like Claude Desktop) can use. This enables conversational interfaces for wealth management operations.

**Architecture:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Claude Desktop │     │   MCP Server    │     │  Portfolio API  │
│  (or other AI)  │────▶│  (stdio/HTTP)   │────▶│  (Express.js)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                              │
                              ▼
                        41 MCP Tools
                        (1:1 with REST APIs)
```

### 16.2 Tool Naming Convention

All tools use the `portfolio_` prefix followed by the operation:

```
portfolio_{operation}_{entity}
```

Examples:
- `portfolio_get_clients` → GET /clients
- `portfolio_get_client` → GET /clients/:clientId
- `portfolio_create_holding` → POST /holdings
- `portfolio_get_dashboard_overview` → GET /dashboard/overview

### 16.3 Complete Tool Reference

All 41 MCP tools map 1:1 to the REST API endpoints defined in Section 4.

#### Client Tools (6 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_clients` | GET | `/clients` | List all clients |
| `portfolio_get_client` | GET | `/clients/:clientId` | Get client by ID |
| `portfolio_get_client_summary` | GET | `/clients/:clientId/summary` | Get client with portfolio summary |
| `portfolio_create_client` | POST | `/clients` | Create new client |
| `portfolio_update_client` | PUT | `/clients/:clientId` | Update client |
| `portfolio_delete_client` | DELETE | `/clients/:clientId` | Delete client |

#### Account Tools (6 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_accounts` | GET | `/accounts` | List all accounts |
| `portfolio_get_account` | GET | `/accounts/:accountId` | Get account by ID |
| `portfolio_get_accounts_by_client` | GET | `/accounts/client/:clientId` | Get accounts for client |
| `portfolio_create_account` | POST | `/accounts` | Create new account |
| `portfolio_update_account` | PUT | `/accounts/:accountId` | Update account |
| `portfolio_delete_account` | DELETE | `/accounts/:accountId` | Delete account |

#### Portfolio Tools (7 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_portfolios` | GET | `/portfolios` | List all portfolios |
| `portfolio_get_portfolio` | GET | `/portfolios/:portfolioId` | Get portfolio by ID |
| `portfolio_get_portfolio_performance` | GET | `/portfolios/:portfolioId/performance` | Get portfolio with metrics |
| `portfolio_get_portfolios_by_account` | GET | `/portfolios/account/:accountId` | Get portfolios for account |
| `portfolio_create_portfolio` | POST | `/portfolios` | Create new portfolio |
| `portfolio_update_portfolio` | PUT | `/portfolios/:portfolioId` | Update portfolio |
| `portfolio_delete_portfolio` | DELETE | `/portfolios/:portfolioId` | Delete portfolio |

#### Holding Tools (6 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_holdings` | GET | `/holdings` | List all holdings |
| `portfolio_get_holding` | GET | `/holdings/:holdingId` | Get holding by ID |
| `portfolio_get_holdings_by_portfolio` | GET | `/holdings/portfolio/:portfolioId` | Get holdings for portfolio |
| `portfolio_create_holding` | POST | `/holdings` | Create new holding |
| `portfolio_update_holding` | PUT | `/holdings/:holdingId` | Update holding |
| `portfolio_delete_holding` | DELETE | `/holdings/:holdingId` | Delete holding |

#### Transaction Tools (6 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_transactions` | GET | `/transactions` | List all transactions |
| `portfolio_get_transaction` | GET | `/transactions/:transactionId` | Get transaction by ID |
| `portfolio_get_transactions_by_portfolio` | GET | `/transactions/portfolio/:portfolioId` | Get transactions for portfolio |
| `portfolio_create_transaction` | POST | `/transactions` | Create new transaction |
| `portfolio_update_transaction` | PUT | `/transactions/:transactionId` | Update transaction |
| `portfolio_delete_transaction` | DELETE | `/transactions/:transactionId` | Delete transaction |

#### Security Tools (5 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_securities` | GET | `/securities` | List all securities |
| `portfolio_get_security` | GET | `/securities/:securityId` | Get security by ID |
| `portfolio_get_security_by_symbol` | GET | `/securities/symbol/:symbol` | Get security by symbol |
| `portfolio_get_securities_by_type` | GET | `/securities/type/:type` | Get securities by type |
| `portfolio_update_security` | PUT | `/securities/:securityId` | Update security price |

#### Dashboard Tools (5 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_dashboard_overview` | GET | `/dashboard/overview` | Get system-wide overview |
| `portfolio_get_top_performers` | GET | `/dashboard/top-performers` | Get top performing holdings |
| `portfolio_get_top_losers` | GET | `/dashboard/top-losers` | Get worst performing holdings |
| `portfolio_get_recent_transactions` | GET | `/dashboard/recent-transactions` | Get recent transactions |
| `portfolio_get_allocation` | GET | `/dashboard/allocation` | Get aggregate allocation |

**Total: 41 MCP Tools**

### 16.4 Tool Schema Example

Each tool follows the MCP tool schema format:

```javascript
{
  name: "portfolio_get_client",
  description: "Get a specific client by their ID, including contact information, risk tolerance, and investment objective",
  inputSchema: {
    type: "object",
    properties: {
      clientId: {
        type: "string",
        description: "The unique client identifier (e.g., CLI-001)"
      }
    },
    required: ["clientId"]
  }
}
```

```javascript
{
  name: "portfolio_create_holding",
  description: "Create a new holding (position) in a portfolio",
  inputSchema: {
    type: "object",
    properties: {
      portfolioId: {
        type: "string",
        description: "The portfolio ID to add the holding to"
      },
      securityId: {
        type: "string",
        description: "The security ID for the position"
      },
      quantity: {
        type: "number",
        description: "Number of shares/units"
      },
      averageCostBasis: {
        type: "number",
        description: "Average cost per share/unit"
      }
    },
    required: ["portfolioId", "securityId", "quantity", "averageCostBasis"]
  }
}
```

### 16.5 MCP Server Implementation

**File:** `server/mcp/index.js`

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

// Import tool handlers
import { clientTools } from "./tools/clientTools.js";
import { accountTools } from "./tools/accountTools.js";
import { portfolioTools } from "./tools/portfolioTools.js";
import { holdingTools } from "./tools/holdingTools.js";
import { transactionTools } from "./tools/transactionTools.js";
import { securityTools } from "./tools/securityTools.js";
import { dashboardTools } from "./tools/dashboardTools.js";

const server = new Server(
  { name: "portfolio-management-system", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register all tools
const allTools = [
  ...clientTools,
  ...accountTools,
  ...portfolioTools,
  ...holdingTools,
  ...transactionTools,
  ...securityTools,
  ...dashboardTools
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema
  }))
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find(t => t.name === request.params.name);
  if (!tool) throw new Error(`Unknown tool: ${request.params.name}`);
  return await tool.handler(request.params.arguments);
});

// Start server
const transport = new StdioServerTransport();
await server.connect(transport);
```

### 16.6 Claude Desktop Configuration

Add to Claude Desktop's `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "portfolio-management": {
      "command": "node",
      "args": ["/path/to/PortfolioManagement/server/mcp/index.js"],
      "env": {
        "API_BASE_URL": "http://localhost:3001/api/v1"
      }
    }
  }
}
```

**For production:**
```json
{
  "mcpServers": {
    "portfolio-management": {
      "command": "node",
      "args": ["/path/to/PortfolioManagement/server/mcp/index.js"],
      "env": {
        "API_BASE_URL": "https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/api/v1"
      }
    }
  }
}
```

### 16.7 Dependencies

Add to `server/package.json`:

```json
{
  "dependencies": {
    "@modelcontextprotocol/sdk": "^0.5.0",
    "axios": "^1.6.0"
  }
}
```

### 16.8 Git Workflow for MCP Implementation

**CRITICAL: Do NOT commit directly to main**

```bash
# Start from latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/add-mcp-server

# ... implement MCP server ...

# Commit changes
git add .
git commit -m "feat: Add MCP Server with 41 tools for AI agent integration"

# Push for review
git push origin feature/add-mcp-server

# Create Pull Request - DO NOT MERGE until fully tested
```

### 16.9 Implementation Order for Cursor

**Phase 1: Setup**
1. Install MCP SDK dependency
2. Create `server/mcp/` directory structure
3. Create `server/mcp/index.js` with basic server setup
4. Test MCP server starts without errors

**Phase 2: Tool Implementation**
1. Implement `dashboardTools.js` (5 tools) - test first
2. Implement `clientTools.js` (6 tools)
3. Implement `accountTools.js` (6 tools)
4. Implement `portfolioTools.js` (7 tools)
5. Implement `holdingTools.js` (6 tools)
6. Implement `transactionTools.js` (6 tools)
7. Implement `securityTools.js` (5 tools)

**Phase 3: Testing**
1. Test each tool individually with Claude Desktop
2. Verify all 41 tools work
3. Test error handling

**Phase 4: Documentation**
1. Update README with MCP section
2. Add MCP configuration examples

### 16.10 Demo Scenarios with MCP

**Scenario 1: Portfolio Review via Chat**
```
User: "Show me John Smith's portfolio summary"
Agent: [calls portfolio_get_clients to find John Smith]
Agent: [calls portfolio_get_client_summary with clientId]
Agent: "John Smith has $485,000 in assets across 2 accounts..."
```

**Scenario 2: Market Analysis**
```
User: "What are the top performing holdings today?"
Agent: [calls portfolio_get_top_performers]
Agent: "The top 5 performers are: NVDA (+3.2%), AAPL (+1.8%)..."
```

**Scenario 3: Transaction Recording**
```
User: "Record a purchase of 50 shares of AAPL at $178.50 for portfolio PRT-001"
Agent: [calls portfolio_get_security_by_symbol for AAPL]
Agent: [calls portfolio_create_transaction with details]
Agent: "Transaction recorded: Bought 50 shares of AAPL..."
```

### 16.11 Error Handling

All tools return structured responses:

**Success:**
```javascript
{
  content: [{
    type: "text",
    text: JSON.stringify(data, null, 2)
  }]
}
```

**Error:**
```javascript
{
  content: [{
    type: "text",
    text: JSON.stringify({
      error: true,
      code: "NOT_FOUND",
      message: "Client CLI-999 not found"
    })
  }],
  isError: true
}
```

### 16.12 Acceptance Criteria for MCP

- [ ] MCP server starts without errors
- [ ] All 41 tools registered and visible in Claude Desktop
- [ ] Client tools (6) work correctly
- [ ] Account tools (6) work correctly
- [ ] Portfolio tools (7) work correctly
- [ ] Holding tools (6) work correctly
- [ ] Transaction tools (6) work correctly
- [ ] Security tools (5) work correctly
- [ ] Dashboard tools (5) work correctly
- [ ] Error handling returns structured errors
- [ ] README updated with MCP documentation
- [ ] Feature branch pushed for review

---

**END OF PRD v1.2**

✅ REST API Implemented & Deployed - December 2024  
🔄 MCP Server - In Development
