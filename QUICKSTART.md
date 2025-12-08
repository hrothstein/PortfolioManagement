# Quick Start Guide

Get the Portfolio Management System running in under 5 minutes!

## Prerequisites

- Node.js 18+ installed
- Terminal/Command Line access

## Option 1: Quick Local Development (Recommended)

### Step 1: Install Dependencies

```bash
# From the project root
npm run install-all
```

This installs dependencies for both frontend and backend.

### Step 2: Start Backend

```bash
cd server
npm run dev
```

The backend will start on **http://localhost:3001** with seed data loaded.

### Step 3: Start Frontend (New Terminal)

```bash
cd client
npm run dev
```

The frontend will start on **http://localhost:3000**.

### Step 4: Open Your Browser

Visit **http://localhost:3000** to see the Portfolio Management System!

## Option 2: Production Build

### Build and Run

```bash
# Build the frontend
cd client
npm install
npm run build

# Start the backend (serves the built frontend)
cd ../server
npm install
npm start
```

Visit **http://localhost:3001**

## Option 3: Docker

### Build and Run

```bash
docker build -t portfolio-system .
docker run -p 3001:3001 portfolio-system
```

Visit **http://localhost:3001**

## What You'll See

### Dashboard
- Total AUM: ~$48M across 50 clients
- Asset allocation pie charts
- Top 5 performers
- Recent transactions

### Clients (50 total)
- Complete client profiles
- Risk tolerance indicators
- Investment objectives
- Portfolio summaries

### Portfolios (150+ total)
- Detailed holdings
- Performance metrics
- Asset & sector allocation charts
- Transaction history

### Securities (30 total)
- 15 Stocks (AAPL, MSFT, GOOGL, etc.)
- 5 Bonds (Treasury, Corporate, Municipal)
- 5 Mutual Funds
- 5 ETFs (SPY, QQQ, BND, etc.)

## Troubleshooting

### Port Already in Use

If port 3001 or 3000 is already in use:

**Backend**: Edit `server/index.js` and change `PORT`
**Frontend**: Edit `client/vite.config.js` and change `server.port`

### Dependencies Not Installing

Try:
```bash
# Clear npm cache
npm cache clean --force

# Remove node_modules and reinstall
rm -rf node_modules server/node_modules client/node_modules
npm run install-all
```

### Data Not Loading

The system uses in-memory storage. Data will reset to initial seed state on every restart.

## Next Steps

1. Explore the **Dashboard** to see overall metrics
2. Browse **Clients** and click on one to see detailed portfolio summary
3. Navigate to **Portfolios** and select one to see holdings and performance
4. Check **Securities** to see current market prices
5. View **Transactions** to see historical activity

## Demo Scenarios

### Wealth Advisor Workflow

1. **Morning Review**: Check Dashboard for overnight changes
2. **Client Meeting**: Navigate to specific client, review performance
3. **Portfolio Analysis**: Click through to portfolio details, review holdings
4. **Market Check**: View Securities to see current prices and changes

### API Testing

Use the API endpoints directly:

```bash
# Get dashboard overview
curl http://localhost:3001/api/v1/dashboard/overview

# Get all clients
curl http://localhost:3001/api/v1/clients

# Get client summary
curl http://localhost:3001/api/v1/clients/CLI-001/summary

# Get portfolio performance
curl http://localhost:3001/api/v1/portfolios/PRT-001/performance
```

## Need Help?

- Check the main **README.md** for detailed documentation
- Review **docs/API.md** for API reference
- Refer to the **Portfolio_Management_System_PRD.md** for requirements

---

**Enjoy exploring the Portfolio Management System! 🚀**





