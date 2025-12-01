# Portfolio Management System - Product Requirements Document

## 1. Executive Summary

### 1.1 Purpose
Build a simple Portfolio Management System for demo purposes that showcases wealth management workflows for MuleSoft and Salesforce Financial Services Cloud integrations.

### 1.2 Scope
- **Asset Types:** Stocks, Bonds, Mutual Funds, ETFs, Cash
- **Core Entities:** Clients, Accounts, Portfolios, Holdings, Transactions
- **Tech Stack:** React frontend, Node.js/Express backend, In-memory datastore
- **Deployment:** Heroku (use existing dyno or infrastructure)
- **Future:** MCP integration will be added later

### 1.3 Key Features
- Full CRUD operations for all entities
- Admin portal for wealth management advisors
- RESTful APIs (open/unsecured - no auth required)
- Pre-loaded with 50 customers from bankingcoredemo
- Portfolio metrics: total value, gain/loss, allocation percentages
- Mock market data with realistic pricing

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
| Frontend | React 18, Tailwind CSS |
| Backend | Node.js 18+, Express.js |
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

**Risk Tolerance Distribution (for seed data):**
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
  "accountType": "BROKERAGE",      // BROKERAGE, IRA, ROTH_IRA, 401K, TRUST
  "accountNumber": "BRK-78945612",
  "accountName": "John Smith Brokerage",
  "accountStatus": "ACTIVE",       // ACTIVE, INACTIVE, CLOSED
  "openDate": "2020-06-15",
  "cashBalance": 15000.00,         // Available cash in account
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

**Account Type Distribution (seed ~100 accounts across 50 clients):**
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
  "securityType": "STOCK",         // STOCK, BOND, MUTUAL_FUND, ETF, CASH
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

### 4.1 Base URL
```
http://localhost:3001/api/v1
```

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
        "ETF": 3.5,
        "CASH": 1.0
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
| GET | `/clients/:clientId/accounts` | Get accounts for client |
| POST | `/accounts` | Create new account |
| PUT | `/accounts/:accountId` | Update account |
| DELETE | `/accounts/:accountId` | Delete account |

### 4.5 Portfolio APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/portfolios` | List all portfolios |
| GET | `/portfolios/:portfolioId` | Get portfolio by ID |
| GET | `/portfolios/:portfolioId/performance` | Get portfolio with performance metrics |
| GET | `/accounts/:accountId/portfolios` | Get portfolios for account |
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
        "ETF": 10.0,
        "CASH": 5.0
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
| GET | `/portfolios/:portfolioId/holdings` | Get holdings for portfolio |
| POST | `/holdings` | Create new holding |
| PUT | `/holdings/:holdingId` | Update holding |
| DELETE | `/holdings/:holdingId` | Delete holding |

### 4.7 Transaction APIs

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/transactions` | List all transactions |
| GET | `/transactions/:transactionId` | Get transaction by ID |
| GET | `/portfolios/:portfolioId/transactions` | Get transactions for portfolio |
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
| GET | `/dashboard/allocation` | Get aggregate asset allocation |

**GET /dashboard/overview Response:**
```json
{
  "success": true,
  "data": {
    "totalClients": 50,
    "totalAccounts": 100,
    "totalPortfolios": 120,
    "totalAUM": 48500000.00,
    "totalUnrealizedGain": 5250000.00,
    "averagePortfolioSize": 404166.67,
    "clientsByRiskTolerance": {
      "CONSERVATIVE": 15,
      "MODERATE": 25,
      "AGGRESSIVE": 10
    },
    "assetAllocation": {
      "STOCK": 62.5,
      "BOND": 22.0,
      "MUTUAL_FUND": 8.5,
      "ETF": 5.0,
      "CASH": 2.0
    }
  }
}
```

---

## 5. Frontend Requirements

### 5.1 Advisor Portal Pages

**1. Dashboard (Home)**
- Total AUM display with trend indicator
- Client count and portfolio count
- Asset allocation pie chart
- Top 5 performers/losers today
- Recent transactions list

**2. Clients List**
- Searchable/sortable table of all clients
- Columns: Name, Risk Tolerance, Total Value, Gain/Loss, # Accounts
- Click to view client detail
- Add new client button

**3. Client Detail**
- Client info card (name, contact, risk tolerance, objective)
- List of accounts with balances
- Aggregate portfolio value and performance
- Asset allocation chart
- Edit/Delete client

**4. Accounts List**
- All accounts across all clients
- Filter by account type
- Columns: Account #, Client, Type, Balance, Market Value

**5. Account Detail**
- Account info
- List of portfolios in account
- Cash balance
- Edit/Delete account

**6. Portfolios List**
- All portfolios
- Columns: Name, Client, Account, Market Value, Gain/Loss %
- Filter by portfolio type

**7. Portfolio Detail**
- Portfolio summary card
- Holdings table with:
  - Symbol, Name, Quantity, Cost Basis, Market Value, Gain/Loss, Weight %
- Asset allocation pie chart
- Sector allocation pie chart
- Transaction history for this portfolio
- Add holding, Record transaction buttons
- Edit/Delete portfolio

**8. Holdings Management**
- Add/Edit holding modal
- Select security from dropdown
- Enter quantity and cost basis

**9. Transactions**
- Transaction history table
- Filter by date range, type, symbol
- Record new transaction modal

**10. Securities (Market Data)**
- View all securities with current prices
- Edit price for demo purposes
- Filter by security type

### 5.2 UI Components

- Use Tailwind CSS for styling
- Consistent color scheme (professional/financial)
- Responsive design (desktop-first, but mobile-friendly)
- Loading states for all data fetches
- Error handling with user-friendly messages
- Confirmation dialogs for delete operations

### 5.3 Charts

Use a charting library (Chart.js or Recharts):
- Pie charts for asset/sector allocation
- Bar charts for portfolio comparison
- Simple line indicator for day change

---

## 6. Seed Data Requirements

### 6.1 Clients
- Load exact 50 customers from bankingcoredemo
- Assign risk tolerance and investment objective randomly per distribution above

### 6.2 Accounts
- Create ~100 accounts across 50 clients
- Every client gets at least 1 BROKERAGE account
- Randomly assign additional IRA/ROTH_IRA/401K accounts

### 6.3 Securities
- Pre-load 30 securities with realistic pricing
- Include mix of stocks (15), bonds (5), mutual funds (5), ETFs (5)

### 6.4 Portfolios
- Create 1-3 portfolios per account (~150 total)
- Assign realistic names based on account type

### 6.5 Holdings
- Distribute holdings across portfolios
- Each portfolio has 5-15 holdings
- Vary cost basis vs current price for realistic gain/loss display

### 6.6 Transactions
- Generate historical transactions for each holding
- Include mix of BUY, SELL, DIVIDEND transactions
- Date range: past 2 years

---

## 7. Project Structure

```
portfolio-management-system/
├── package.json
├── Dockerfile
├── .gitignore
├── README.md
├── server/
│   ├── index.js              # Express server entry
│   ├── datastore.js          # In-memory data store
│   ├── seed.js               # Seed data loader
│   ├── routes/
│   │   ├── clients.js
│   │   ├── accounts.js
│   │   ├── portfolios.js
│   │   ├── holdings.js
│   │   ├── transactions.js
│   │   ├── securities.js
│   │   └── dashboard.js
│   ├── services/
│   │   ├── portfolioService.js   # Portfolio calculations
│   │   └── marketDataService.js  # Price updates
│   └── data/
│       ├── customers.json        # 50 customers from bankingcoredemo
│       └── securities.json       # Mock market data
├── client/
│   ├── package.json
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── components/
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ClientList.jsx
│   │   │   ├── ClientDetail.jsx
│   │   │   ├── AccountList.jsx
│   │   │   ├── AccountDetail.jsx
│   │   │   ├── PortfolioList.jsx
│   │   │   ├── PortfolioDetail.jsx
│   │   │   ├── HoldingForm.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   ├── TransactionForm.jsx
│   │   │   ├── SecurityList.jsx
│   │   │   ├── AllocationChart.jsx
│   │   │   └── common/
│   │   │       ├── Header.jsx
│   │   │       ├── Sidebar.jsx
│   │   │       ├── Table.jsx
│   │   │       ├── Modal.jsx
│   │   │       └── Card.jsx
│   │   └── services/
│   │       └── api.js
│   └── tailwind.config.js
└── docs/
    └── API.md
```

---

## 8. Build Instructions for Cursor

### 8.1 Prerequisites
- Node.js 18+
- npm or yarn

### 8.2 Git Workflow

**CRITICAL: Do NOT commit directly to main branch**

```bash
# Clone the repo (or create new)
git clone <repo-url>
cd portfolio-management-system

# Pull latest main
git checkout main
git pull origin main

# Create feature branch
git checkout -b feature/initial-build

# ... do all work on feature branch ...

# When complete, push for review
git push origin feature/initial-build

# Create Pull Request for review
# Only merge to main after review and approval
```

### 8.3 Implementation Order

**Phase 1: Backend Foundation**
1. Initialize Node.js project with Express
2. Create datastore.js with in-memory structure
3. Create seed.js with all seed data
4. Implement security routes (market data)
5. Test with Postman/curl

**Phase 2: Core Entity APIs**
1. Implement client routes with CRUD
2. Implement account routes with CRUD
3. Implement portfolio routes with CRUD
4. Implement holding routes with CRUD
5. Implement transaction routes with CRUD
6. Test all endpoints

**Phase 3: Business Logic**
1. Create portfolioService.js for calculations
2. Implement portfolio performance endpoint
3. Implement client summary endpoint
4. Implement dashboard endpoints
5. Test calculated values

**Phase 4: Frontend Setup**
1. Create React app with Vite
2. Setup Tailwind CSS
3. Create common components (Header, Sidebar, Table, etc.)
4. Setup React Router

**Phase 5: Frontend Pages**
1. Build Dashboard page
2. Build Clients list and detail pages
3. Build Accounts list and detail pages
4. Build Portfolios list and detail pages
5. Build Holdings management
6. Build Transactions page
7. Build Securities page
8. Add charts (allocation, performance)

**Phase 6: Polish**
1. Add loading states
2. Add error handling
3. Add confirmation dialogs
4. Test all CRUD operations from UI
5. Responsive design fixes

### 8.4 Running Locally

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

### 8.5 Dockerfile

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

After implementation is complete and reviewed:

1. Create Heroku app (or use existing infrastructure)
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
1. Login to advisor portal
2. Navigate to Clients
3. Search for "John Smith"
4. View client summary (total value, allocation, performance)
5. Drill into portfolio details
6. Review holdings and recent transactions

**Scenario 2: Portfolio Rebalancing**
1. View portfolio with drift from target allocation
2. Identify overweight positions
3. Record SELL transaction
4. Record BUY transaction for underweight asset class
5. View updated allocation

**Scenario 3: New Client Onboarding**
1. Create new client with risk profile
2. Create brokerage account
3. Create portfolio
4. Add initial holdings
5. Record BUY transactions

**Scenario 4: Market Data Update**
1. Update security prices (simulating market movement)
2. View dashboard for portfolio impact
3. Identify top gainers/losers
4. Review client portfolios affected

### 10.2 MuleSoft Integration Demo Points

When integrated with MuleSoft later:
- **Experience API**: Mobile app / Customer portal access
- **Process API**: Trade execution orchestration, Compliance checks
- **System API**: Connect to Portfolio System, Market Data providers, Custodian systems

---

## 11. Future Enhancements (Out of Scope for MVP)

- MCP integration for AI agent interactions
- Real-time market data feeds
- Trade execution simulation
- Performance benchmarking vs indices
- Tax lot tracking
- Compliance and suitability checks
- Document generation (statements, reports)
- Multi-advisor support with permissions

---

## 12. Acceptance Criteria

### 12.1 Backend
- [ ] All CRUD endpoints working for all entities
- [ ] Portfolio performance calculations accurate
- [ ] Client summary calculations accurate
- [ ] Dashboard aggregations working
- [ ] Seed data loads correctly on startup
- [ ] No authentication required (open APIs)

### 12.2 Frontend
- [ ] Dashboard displays all metrics and charts
- [ ] All list pages render with data
- [ ] All detail pages show related data
- [ ] CRUD operations work from UI
- [ ] Charts render correctly
- [ ] Responsive on desktop
- [ ] No console errors

### 12.3 Deployment
- [ ] Docker build succeeds
- [ ] Heroku deployment works
- [ ] Data resets cleanly on restart

---

## 13. Reference: 50 Customers from BankingCoreDemo

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

**END OF PRD**

Ready for Cursor implementation!
