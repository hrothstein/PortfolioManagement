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

The Model Context Protocol (MCP) server exposes all Portfolio Management System APIs as tools that AI agents can use via HTTP. This enables conversational interfaces for wealth management operations.

**Architecture:**
```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   AI Agent      │     │   MCP Server    │     │  Portfolio API  │
│ (HTTP Client)   │────▶│   (HTTP/SSE)    │────▶│  (Express.js)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                      │                        │
        │                      │                        ▼
        │                      │                 ┌─────────────┐
        │                      │                 │  Datastore  │
        │                      │                 │ (In-Memory) │
        │                      │                 └─────────────┘
        │                      │
        │               41 MCP Tools
        │            (HTTP calls to REST API)
        │
   HTTP Transport
   (NOT stdio - this is server-based)
```

### 16.2 Critical Architecture Decisions

#### Q: Why HTTP transport instead of stdio?
**A:** This MCP server runs as a web service, not a local CLI tool. HTTP/SSE transport allows:
- Remote AI agents to connect over the network
- Multiple concurrent clients
- Integration with web-based AI applications
- Deployment alongside the existing Express server on Heroku

#### Q: How does MCP server relate to REST API?
**A:** The MCP server is a **wrapper** around the existing REST API. It does NOT access the datastore directly.

```
AI Agent → MCP Server (port 3002) → REST API (port 3001) → Datastore
```

**Why this design:**
- Reuses existing API logic (no duplication)
- REST API handles all business logic and validation
- MCP server only handles protocol translation
- Both can be deployed together or separately

#### Q: Why no Create/Delete for Securities?
**A:** **Intentional.** Securities represent market reference data (stocks, bonds, ETFs), not user-created entities. The only mutation allowed is `portfolio_update_security` to simulate price changes for demos. This matches the REST API design.

### 16.3 Tool Naming Convention

All tools use the `portfolio_` prefix followed by the operation:

```
portfolio_{operation}_{entity}
```

Examples:
- `portfolio_get_clients` → GET /clients
- `portfolio_get_client` → GET /clients/:clientId
- `portfolio_create_holding` → POST /holdings
- `portfolio_get_dashboard_overview` → GET /dashboard/overview

### 16.4 Complete Tool Reference

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

**Note:** No create/delete for securities - these are reference market data, not user-created entities.

#### Dashboard Tools (5 tools)

| Tool Name | HTTP Method | Endpoint | Description |
|-----------|-------------|----------|-------------|
| `portfolio_get_dashboard_overview` | GET | `/dashboard/overview` | Get system-wide overview |
| `portfolio_get_top_performers` | GET | `/dashboard/top-performers` | Get top performing holdings |
| `portfolio_get_top_losers` | GET | `/dashboard/top-losers` | Get worst performing holdings |
| `portfolio_get_recent_transactions` | GET | `/dashboard/recent-transactions` | Get recent transactions |
| `portfolio_get_allocation` | GET | `/dashboard/allocation` | Get aggregate allocation |

**Total: 41 MCP Tools**

### 16.5 Tool Schema Examples

Each tool follows the MCP tool schema format:

**Simple GET (no params):**
```javascript
{
  name: "portfolio_get_clients",
  description: "List all clients in the system with their contact information, risk tolerance, and investment objectives",
  inputSchema: {
    type: "object",
    properties: {},
    required: []
  }
}
```

**GET with required param:**
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

**POST (create):**
```javascript
{
  name: "portfolio_create_holding",
  description: "Create a new holding (position) in a portfolio",
  inputSchema: {
    type: "object",
    properties: {
      portfolioId: {
        type: "string",
        description: "The portfolio ID to add the holding to (e.g., PRT-001)"
      },
      securityId: {
        type: "string",
        description: "The security ID for the position (e.g., SEC-001)"
      },
      quantity: {
        type: "number",
        description: "Number of shares/units to hold"
      },
      averageCostBasis: {
        type: "number",
        description: "Average cost per share/unit in USD"
      }
    },
    required: ["portfolioId", "securityId", "quantity", "averageCostBasis"]
  }
}
```

**PUT (update):**
```javascript
{
  name: "portfolio_update_client",
  description: "Update an existing client's information",
  inputSchema: {
    type: "object",
    properties: {
      clientId: {
        type: "string",
        description: "The unique client identifier (e.g., CLI-001)"
      },
      firstName: {
        type: "string",
        description: "Client's first name"
      },
      lastName: {
        type: "string",
        description: "Client's last name"
      },
      email: {
        type: "string",
        description: "Client's email address"
      },
      phone: {
        type: "string",
        description: "Client's phone number"
      },
      riskTolerance: {
        type: "string",
        enum: ["CONSERVATIVE", "MODERATE", "AGGRESSIVE"],
        description: "Client's risk tolerance level"
      },
      investmentObjective: {
        type: "string",
        enum: ["INCOME", "GROWTH", "BALANCED", "PRESERVATION"],
        description: "Client's investment objective"
      }
    },
    required: ["clientId"]
  }
}
```

### 16.6 MCP Server Implementation

#### Server Entry Point

**File:** `server/mcp/index.js`

```javascript
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import express from "express";

// Import tool definitions and handlers
import { clientTools } from "./tools/clientTools.js";
import { accountTools } from "./tools/accountTools.js";
import { portfolioTools } from "./tools/portfolioTools.js";
import { holdingTools } from "./tools/holdingTools.js";
import { transactionTools } from "./tools/transactionTools.js";
import { securityTools } from "./tools/securityTools.js";
import { dashboardTools } from "./tools/dashboardTools.js";

const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api/v1";
const MCP_PORT = process.env.MCP_PORT || 3002;

// Combine all tools
const allTools = [
  ...clientTools,
  ...accountTools,
  ...portfolioTools,
  ...holdingTools,
  ...transactionTools,
  ...securityTools,
  ...dashboardTools
];

// Create MCP server
const mcpServer = new Server(
  { name: "portfolio-management-system", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

// Register tool list handler
mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: allTools.map(t => ({
    name: t.name,
    description: t.description,
    inputSchema: t.inputSchema
  }))
}));

// Register tool call handler
mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
  const tool = allTools.find(t => t.name === request.params.name);
  if (!tool) {
    return {
      content: [{ type: "text", text: JSON.stringify({ error: true, message: `Unknown tool: ${request.params.name}` }) }],
      isError: true
    };
  }
  return await tool.handler(request.params.arguments, API_BASE_URL);
});

// Create Express app for HTTP transport
const app = express();

// SSE endpoint for MCP
app.get("/mcp/sse", async (req, res) => {
  const transport = new SSEServerTransport("/mcp/messages", res);
  await mcpServer.connect(transport);
});

// Message endpoint for MCP
app.post("/mcp/messages", express.json(), async (req, res) => {
  // Handle incoming MCP messages
  await transport.handlePostMessage(req, res);
});

// Health check
app.get("/mcp/health", (req, res) => {
  res.json({ status: "ok", tools: allTools.length });
});

app.listen(MCP_PORT, () => {
  console.log(`MCP Server running on port ${MCP_PORT}`);
  console.log(`API Base URL: ${API_BASE_URL}`);
  console.log(`Tools registered: ${allTools.length}`);
});
```

#### Response Formatter Utility

**File:** `server/mcp/utils/responseFormatter.js`

```javascript
/**
 * Format successful API response for MCP
 */
export function formatSuccess(data) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}

/**
 * Format error response for MCP
 */
export function formatError(error) {
  const message = error.response?.data?.error?.message 
    || error.message 
    || "Unknown error occurred";
  
  const code = error.response?.data?.error?.code 
    || error.response?.status 
    || "ERROR";

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        error: true,
        code: code,
        message: message
      }, null, 2)
    }],
    isError: true
  };
}

/**
 * Make API call and return formatted MCP response
 */
export async function callAPI(axios, method, url, data = null) {
  try {
    const config = { method, url };
    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }
    const response = await axios(config);
    return formatSuccess(response.data);
  } catch (error) {
    return formatError(error);
  }
}
```

#### Example Tool Implementation

**File:** `server/mcp/tools/clientTools.js`

```javascript
import axios from "axios";
import { callAPI, formatSuccess, formatError } from "../utils/responseFormatter.js";

export const clientTools = [
  {
    name: "portfolio_get_clients",
    description: "List all clients in the system with their contact information, risk tolerance, and investment objectives",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI(axios, "get", `${baseUrl}/clients`);
    }
  },
  {
    name: "portfolio_get_client",
    description: "Get a specific client by their ID",
    inputSchema: {
      type: "object",
      properties: {
        clientId: {
          type: "string",
          description: "The unique client identifier (e.g., CLI-001)"
        }
      },
      required: ["clientId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI(axios, "get", `${baseUrl}/clients/${args.clientId}`);
    }
  },
  {
    name: "portfolio_get_client_summary",
    description: "Get a client with their complete portfolio summary including total value, accounts, and asset allocation",
    inputSchema: {
      type: "object",
      properties: {
        clientId: {
          type: "string",
          description: "The unique client identifier (e.g., CLI-001)"
        }
      },
      required: ["clientId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI(axios, "get", `${baseUrl}/clients/${args.clientId}/summary`);
    }
  },
  {
    name: "portfolio_create_client",
    description: "Create a new client in the system",
    inputSchema: {
      type: "object",
      properties: {
        firstName: { type: "string", description: "Client's first name" },
        lastName: { type: "string", description: "Client's last name" },
        email: { type: "string", description: "Client's email address" },
        phone: { type: "string", description: "Client's phone number" },
        dateOfBirth: { type: "string", description: "Client's date of birth (YYYY-MM-DD)" },
        riskTolerance: { 
          type: "string", 
          enum: ["CONSERVATIVE", "MODERATE", "AGGRESSIVE"],
          description: "Client's risk tolerance level" 
        },
        investmentObjective: { 
          type: "string", 
          enum: ["INCOME", "GROWTH", "BALANCED", "PRESERVATION"],
          description: "Client's investment objective" 
        }
      },
      required: ["firstName", "lastName", "email", "riskTolerance", "investmentObjective"]
    },
    handler: async (args, baseUrl) => {
      return callAPI(axios, "post", `${baseUrl}/clients`, args);
    }
  },
  {
    name: "portfolio_update_client",
    description: "Update an existing client's information",
    inputSchema: {
      type: "object",
      properties: {
        clientId: { type: "string", description: "The unique client identifier" },
        firstName: { type: "string", description: "Client's first name" },
        lastName: { type: "string", description: "Client's last name" },
        email: { type: "string", description: "Client's email address" },
        phone: { type: "string", description: "Client's phone number" },
        riskTolerance: { 
          type: "string", 
          enum: ["CONSERVATIVE", "MODERATE", "AGGRESSIVE"],
          description: "Client's risk tolerance level" 
        },
        investmentObjective: { 
          type: "string", 
          enum: ["INCOME", "GROWTH", "BALANCED", "PRESERVATION"],
          description: "Client's investment objective" 
        }
      },
      required: ["clientId"]
    },
    handler: async (args, baseUrl) => {
      const { clientId, ...updateData } = args;
      return callAPI(axios, "put", `${baseUrl}/clients/${clientId}`, updateData);
    }
  },
  {
    name: "portfolio_delete_client",
    description: "Delete a client from the system. Warning: This will also delete all associated accounts, portfolios, holdings, and transactions.",
    inputSchema: {
      type: "object",
      properties: {
        clientId: {
          type: "string",
          description: "The unique client identifier (e.g., CLI-001)"
        }
      },
      required: ["clientId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI(axios, "delete", `${baseUrl}/clients/${args.clientId}`);
    }
  }
];
```

### 16.7 Deployment Architecture

#### Option A: Same Dyno (Recommended for Demo)

Run MCP server alongside the main Express app in a single process:

**File:** `server/index.js` (modified)

```javascript
import express from "express";
import { startMCPServer } from "./mcp/index.js";

const app = express();
const PORT = process.env.PORT || 3001;
const MCP_PORT = process.env.MCP_PORT || 3002;

// ... existing Express routes ...

app.listen(PORT, () => {
  console.log(`REST API running on port ${PORT}`);
});

// Start MCP server on separate port
startMCPServer(MCP_PORT);
```

**Heroku Procfile:**
```
web: cd server && node index.js
```

**Note:** On Heroku free/basic dynos, you may need to expose MCP on the same port with different paths, or use a single port with path-based routing.

#### Option B: Single Port with Path Routing (Heroku-friendly)

Mount MCP endpoints on the main Express app:

```javascript
// In server/index.js
import { mcpRouter } from "./mcp/router.js";

app.use("/mcp", mcpRouter);

// MCP endpoints become:
// GET  /mcp/sse
// POST /mcp/messages  
// GET  /mcp/health
```

### 16.8 Environment Variables

```bash
# REST API (existing)
NODE_ENV=production
PORT=3001

# MCP Server
MCP_PORT=3002
API_BASE_URL=http://localhost:3001/api/v1  # Local
# API_BASE_URL=https://portfolio-mgmt-system-997b2c07833c.herokuapp.com/api/v1  # Production
```

### 16.9 Dependencies

Add to `server/package.json`:

```json
{
  "type": "module",
  "dependencies": {
    "@modelcontextprotocol/sdk": "latest",
    "axios": "^1.6.0",
    "express": "^4.18.0"
  }
}
```

**Note:** Use `"latest"` for MCP SDK during development, then pin to specific version before production.

### 16.10 Project Structure (Updated)

```
server/
├── index.js                      # Express server + MCP startup
├── datastore.js
├── seed.js
├── swagger.js
├── routes/                       # REST API routes
│   ├── clients.js
│   ├── accounts.js
│   ├── portfolios.js
│   ├── holdings.js
│   ├── transactions.js
│   ├── securities.js
│   └── dashboard.js
├── services/
│   └── portfolioService.js
├── mcp/                          # MCP Server
│   ├── index.js                  # MCP server entry + HTTP transport
│   ├── router.js                 # Express router (if using single port)
│   ├── tools/
│   │   ├── clientTools.js        # 6 tools
│   │   ├── accountTools.js       # 6 tools
│   │   ├── portfolioTools.js     # 7 tools
│   │   ├── holdingTools.js       # 6 tools
│   │   ├── transactionTools.js   # 6 tools
│   │   ├── securityTools.js      # 5 tools
│   │   └── dashboardTools.js     # 5 tools
│   └── utils/
│       └── responseFormatter.js  # Success/error formatting
└── data/
    ├── customers.json
    └── securities.json
```

### 16.11 Git Workflow for MCP Implementation

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
# Howie will manually merge via PR when satisfied
```

### 16.12 Implementation Order for Cursor

**Phase 1: Setup**
1. Add dependencies to package.json (`@modelcontextprotocol/sdk`, verify `axios` present)
2. Create `server/mcp/` directory structure
3. Create `server/mcp/utils/responseFormatter.js`
4. Create `server/mcp/index.js` with HTTP/SSE transport (NOT stdio)
5. Test MCP server starts without errors on port 3002

**Phase 2: Tool Implementation (in order)**
1. `dashboardTools.js` (5 tools) - simplest, good for testing
2. `securityTools.js` (5 tools) - read-heavy, simple
3. `clientTools.js` (6 tools) - full CRUD example
4. `accountTools.js` (6 tools)
5. `portfolioTools.js` (7 tools)
6. `holdingTools.js` (6 tools)
7. `transactionTools.js` (6 tools)

**Phase 3: Integration**
1. Integrate MCP server startup into main `index.js`
2. Test all 41 tools against running REST API
3. Test error handling (invalid IDs, missing params)

**Phase 4: Documentation**
1. Update README with MCP section
2. Add connection examples
3. Document environment variables

### 16.13 Testing the MCP Server

**Manual test with curl:**

```bash
# Health check
curl http://localhost:3002/mcp/health

# Expected response:
# {"status":"ok","tools":41}
```

**Test with MCP Inspector (if available):**
```bash
npx @modelcontextprotocol/inspector http://localhost:3002/mcp/sse
```

### 16.14 Demo Scenarios with MCP

**Scenario 1: Portfolio Review via AI Agent**
```
User: "Show me John Smith's portfolio summary"
Agent: [calls portfolio_get_clients to search for John Smith]
Agent: [calls portfolio_get_client_summary with CLI-001]
Agent: "John Smith has $485,000 in total assets across 2 accounts. 
        His risk tolerance is MODERATE with a GROWTH objective.
        Asset allocation: 65% stocks, 20% bonds, 10% mutual funds, 5% ETFs."
```

**Scenario 2: Market Analysis**
```
User: "What are the top performing holdings today?"
Agent: [calls portfolio_get_top_performers]
Agent: "The top 5 performers today are:
        1. NVDA +3.2% 
        2. AAPL +1.8%
        3. MSFT +1.5%
        4. GOOGL +1.2%
        5. META +0.9%"
```

**Scenario 3: Transaction Recording**
```
User: "Buy 50 shares of Apple at $178.50 for portfolio PRT-001"
Agent: [calls portfolio_get_security_by_symbol for AAPL to get securityId]
Agent: [calls portfolio_create_transaction with type=BUY, quantity=50, pricePerUnit=178.50]
Agent: "Transaction recorded: Bought 50 shares of AAPL at $178.50 
        Total: $8,925.00 in portfolio PRT-001"
```

**Scenario 4: Client Onboarding**
```
User: "Create a new client named Jane Doe, moderate risk, growth objective"
Agent: [calls portfolio_create_client with provided info]
Agent: "Created new client Jane Doe (CLI-051) with MODERATE risk tolerance 
        and GROWTH investment objective. Ready to create accounts."
```

### 16.15 Error Handling

All tools return structured MCP responses:

**Success Response:**
```javascript
{
  content: [{
    type: "text",
    text: JSON.stringify({
      success: true,
      data: { /* API response data */ },
      timestamp: "2024-12-01T10:00:00Z"
    }, null, 2)
  }]
}
```

**Error Response:**
```javascript
{
  content: [{
    type: "text",
    text: JSON.stringify({
      error: true,
      code: "NOT_FOUND",
      message: "Client CLI-999 not found"
    }, null, 2)
  }],
  isError: true
}
```

**Common Error Codes:**
| Code | HTTP Status | Meaning |
|------|-------------|---------|
| NOT_FOUND | 404 | Resource doesn't exist |
| BAD_REQUEST | 400 | Invalid parameters |
| VALIDATION_ERROR | 400 | Missing required fields |
| SERVER_ERROR | 500 | Unexpected error |
| API_UNAVAILABLE | 503 | REST API not reachable |

### 16.16 Acceptance Criteria for MCP

**Setup:**
- [ ] MCP server starts without errors
- [ ] HTTP/SSE transport working (NOT stdio)
- [ ] Health endpoint returns tool count
- [ ] Can connect from external client

**Tools (41 total):**
- [ ] Client tools (6) work correctly
- [ ] Account tools (6) work correctly
- [ ] Portfolio tools (7) work correctly
- [ ] Holding tools (6) work correctly
- [ ] Transaction tools (6) work correctly
- [ ] Security tools (5) work correctly - note: no create/delete
- [ ] Dashboard tools (5) work correctly

**Error Handling:**
- [ ] Invalid tool name returns error
- [ ] Missing required params returns error
- [ ] Not found resources return error
- [ ] API unavailable handled gracefully

**Integration:**
- [ ] MCP server calls REST API (not datastore)
- [ ] Works with REST API on same host
- [ ] Works with REST API on different host (production URL)

**Documentation:**
- [ ] README updated with MCP section
- [ ] Environment variables documented
- [ ] Connection examples provided

**Git:**
- [ ] All changes on `feature/add-mcp-server` branch
- [ ] Branch pushed for review
- [ ] NOT merged to main (Howie will merge via PR)

---

**END OF PRD v1.2**

✅ REST API Implemented & Deployed - December 2024  
🔄 MCP Server - In Development
