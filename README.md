# Portfolio Management System

A comprehensive portfolio management system built for wealth management advisors to manage client portfolios, holdings, and transactions.

## 🚀 Features

- **Dashboard** - Real-time overview of all managed assets and performance metrics
- **Client Management** - Complete client profiles with risk tolerance and investment objectives
- **Account Management** - Support for multiple account types (Brokerage, IRA, Roth IRA, 401k)
- **Portfolio Tracking** - Detailed portfolio performance with gain/loss calculations
- **Holdings Management** - Track individual security positions and performance
- **Transaction History** - Complete audit trail of all buy/sell/dividend transactions
- **Market Data** - Real-time security pricing and performance metrics
- **Asset Allocation** - Visual charts showing portfolio composition

## 🏗️ Architecture

- **Frontend**: React 18 with Tailwind CSS
- **Backend**: Node.js/Express.js
- **MCP Server**: Model Context Protocol for AI agent integration
- **Data Store**: In-memory (resets on server restart)
- **Charts**: Chart.js with React integration

## 📋 Prerequisites

- Node.js 18 or higher
- npm or yarn

## 🛠️ Installation

### Clone and Install

```bash
# Install all dependencies
npm run install-all
```

### Running Locally

**Option 1: Run both frontend and backend separately**

```bash
# Terminal 1 - Backend (runs on port 3001)
cd server
npm install
npm run dev

# Terminal 2 - Frontend (runs on port 3000)
cd client
npm install
npm run dev
```

**Option 2: Run backend only (serves built frontend)**

```bash
cd server
npm install
npm start
# Visit http://localhost:3001
```

## 🐳 Docker Deployment

### Build Docker Image

```bash
docker build -t portfolio-management-system .
```

### Run Docker Container

```bash
docker run -p 3001:3001 portfolio-management-system
```

Visit `http://localhost:3001` in your browser.

## 📊 Seed Data

The system comes pre-loaded with:
- **50 clients** from bankingcoredemo dataset
- **100+ accounts** across different account types
- **150+ portfolios** with various investment strategies
- **500+ holdings** across stocks, bonds, mutual funds, and ETFs
- **30 securities** with realistic market data
- **1000+ transactions** with complete history

Data resets to initial seed state on server restart.

## 🌐 API Endpoints

### Swagger Documentation
**Interactive API docs available at:** http://localhost:3001/api-docs

Browse, test, and explore all API endpoints with the interactive Swagger UI interface!

### Base URL
```
http://localhost:3001/api/v1
```

### Main Endpoints

#### Clients
- `GET /clients` - List all clients
- `GET /clients/:clientId` - Get client details
- `GET /clients/:clientId/summary` - Get client with portfolio summary
- `POST /clients` - Create new client
- `PUT /clients/:clientId` - Update client
- `DELETE /clients/:clientId` - Delete client

#### Accounts
- `GET /accounts` - List all accounts
- `GET /accounts/:accountId` - Get account details
- `GET /accounts/client/:clientId` - Get accounts for a client

#### Portfolios
- `GET /portfolios` - List all portfolios
- `GET /portfolios/:portfolioId` - Get portfolio details
- `GET /portfolios/:portfolioId/performance` - Get portfolio performance metrics

#### Holdings
- `GET /holdings` - List all holdings
- `GET /holdings/portfolio/:portfolioId` - Get holdings for a portfolio

#### Transactions
- `GET /transactions` - List all transactions (with filters)
- `GET /transactions/portfolio/:portfolioId` - Get transactions for a portfolio

#### Securities
- `GET /securities` - List all securities
- `GET /securities/:securityId` - Get security details
- `GET /securities/symbol/:symbol` - Get security by symbol

#### Dashboard
- `GET /dashboard/overview` - Get system-wide overview
- `GET /dashboard/top-performers` - Get top performing holdings
- `GET /dashboard/recent-transactions` - Get recent transactions

## 🤖 MCP Server (Model Context Protocol)

The Portfolio Management System includes an MCP server that exposes all 41 REST API endpoints as tools for AI agent integration.

### MCP Endpoints

```
GET  /mcp/health   - Check MCP server status and tool count
GET  /mcp/tools    - List all available MCP tools
GET  /mcp/sse      - SSE connection for MCP clients
POST /mcp/messages - Handle MCP protocol messages
```

### Available Tools (41 total)

| Category | Tools | Description |
|----------|-------|-------------|
| **Client** | 6 | get_clients, get_client, get_client_summary, create_client, update_client, delete_client |
| **Account** | 6 | get_accounts, get_account, get_accounts_by_client, create_account, update_account, delete_account |
| **Portfolio** | 7 | get_portfolios, get_portfolio, get_portfolio_performance, get_portfolios_by_account, create_portfolio, update_portfolio, delete_portfolio |
| **Holding** | 6 | get_holdings, get_holding, get_holdings_by_portfolio, create_holding, update_holding, delete_holding |
| **Transaction** | 6 | get_transactions, get_transaction, get_transactions_by_portfolio, create_transaction, update_transaction, delete_transaction |
| **Security** | 5 | get_securities, get_security, get_security_by_symbol, get_securities_by_type, update_security |
| **Dashboard** | 5 | get_dashboard_overview, get_top_performers, get_top_losers, get_recent_transactions, get_allocation |

All tools follow the naming convention: `portfolio_{operation}_{entity}`

### Testing MCP

```bash
# Check health and tool count
curl http://localhost:3001/mcp/health

# List all tools
curl http://localhost:3001/mcp/tools
```

### Environment Variables

```bash
API_BASE_URL=http://localhost:3001/api/v1  # URL for MCP to call REST API
```

## 📁 Project Structure

```
portfolio-management-system/
├── server/
│   ├── index.js              # Express server entry
│   ├── datastore.js          # In-memory data store
│   ├── seed.js               # Seed data loader
│   ├── routes/               # API routes
│   │   ├── clients.js
│   │   ├── accounts.js
│   │   ├── portfolios.js
│   │   ├── holdings.js
│   │   ├── transactions.js
│   │   ├── securities.js
│   │   └── dashboard.js
│   ├── mcp/                  # MCP Server
│   │   ├── index.js          # MCP server entry
│   │   ├── tools/            # 41 MCP tools
│   │   │   ├── clientTools.js
│   │   │   ├── accountTools.js
│   │   │   ├── portfolioTools.js
│   │   │   ├── holdingTools.js
│   │   │   ├── transactionTools.js
│   │   │   ├── securityTools.js
│   │   │   └── dashboardTools.js
│   │   └── utils/
│   │       └── responseFormatter.js
│   ├── services/
│   │   └── portfolioService.js
│   └── data/
│       ├── customers.json
│       └── securities.json
├── client/
│   ├── src/
│   │   ├── App.jsx
│   │   ├── index.jsx
│   │   ├── pages/            # Main pages
│   │   │   ├── Dashboard.jsx
│   │   │   ├── ClientList.jsx
│   │   │   ├── ClientDetail.jsx
│   │   │   ├── AccountList.jsx
│   │   │   ├── PortfolioList.jsx
│   │   │   ├── PortfolioDetail.jsx
│   │   │   ├── TransactionList.jsx
│   │   │   └── SecurityList.jsx
│   │   ├── components/       # Reusable components
│   │   │   ├── common/
│   │   │   └── charts/
│   │   ├── services/
│   │   │   └── api.js
│   │   └── utils/
│   │       └── formatters.js
│   └── tailwind.config.js
├── Dockerfile
├── package.json
└── README.md
```

## 🎯 Demo Scenarios

### Scenario 1: Client Review
1. Navigate to Dashboard to see overall portfolio performance
2. Go to Clients and search for a specific client
3. Click on client to view detailed summary
4. Review asset allocation and account details

### Scenario 2: Portfolio Analysis
1. Navigate to Portfolios
2. Click on a portfolio to view detailed performance
3. Review holdings, allocation charts, and recent transactions
4. Analyze gain/loss and sector distribution

### Scenario 3: Market Data
1. Navigate to Securities
2. Filter by security type (Stocks, Bonds, ETFs, etc.)
3. View current prices and day changes
4. Review 52-week high/low ranges

## 🔧 Configuration

### Environment Variables

```bash
# Server
NODE_ENV=production
PORT=3001

# Client (for production build)
VITE_API_URL=http://localhost:3001/api/v1
```

## 🚨 Important Notes

- **No Authentication**: APIs are open for demo purposes
- **In-Memory Storage**: All data resets on server restart
- **Demo Only**: Not production-ready, designed for demonstration

## 🔄 Future Enhancements

- ✅ MCP (Model Context Protocol) integration - **Implemented!**
- Real-time market data feeds
- Trade execution simulation
- Performance benchmarking
- Tax lot tracking
- Document generation
- Multi-advisor support with authentication

## 📝 License

MIT License - Built for demonstration purposes

## 🤝 Support

For issues or questions, please refer to the PRD document or contact the development team.

---

**Built with ❤️ for wealth management advisors**

