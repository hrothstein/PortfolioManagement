# Swagger API Documentation Guide

## 🎉 Swagger UI is Now Available!

Interactive API documentation has been added to the Portfolio Management System.

## 📍 Access Swagger UI

**Swagger Documentation URL:**
# **http://localhost:3001/api-docs**

## ✨ Features

### Interactive API Explorer
- 🔍 **Browse all endpoints** - See all available API routes organized by category
- 📝 **View schemas** - See request/response data structures
- ▶️ **Try it out** - Execute API calls directly from the browser
- 📊 **See responses** - View actual API responses in real-time
- 📋 **Copy code** - Get curl commands for any endpoint

### Available API Categories

1. **Clients** - Client management endpoints
   - List all clients
   - Get client by ID
   - Get client portfolio summary
   - Create, update, delete clients

2. **Accounts** - Account management
   - List all accounts
   - Get account details
   - Get accounts by client
   - CRUD operations

3. **Portfolios** - Portfolio management
   - List all portfolios
   - Get portfolio performance metrics
   - Asset and sector allocation
   - CRUD operations

4. **Holdings** - Holdings management
   - List holdings
   - Get holdings by portfolio
   - Track positions and performance
   - CRUD operations

5. **Transactions** - Transaction history
   - List all transactions
   - Filter by type, date, symbol
   - Get portfolio transactions
   - CRUD operations

6. **Securities** - Market data
   - List all securities
   - Get security by symbol
   - Filter by type
   - Update prices

7. **Dashboard** - Analytics
   - System-wide overview
   - Top performers
   - Asset allocation
   - Recent transactions

## 🚀 How to Use

### 1. Open Swagger UI
Visit: http://localhost:3001/api-docs

### 2. Explore Endpoints
- Click on any endpoint category to expand
- Click on an individual endpoint to see details

### 3. Try an Endpoint
1. Click on an endpoint (e.g., `GET /clients`)
2. Click the **"Try it out"** button
3. Fill in any required parameters
4. Click **"Execute"**
5. See the response below

### 4. Example: Get Dashboard Overview

```bash
# In Swagger UI:
1. Expand "Dashboard" category
2. Click on "GET /dashboard/overview"
3. Click "Try it out"
4. Click "Execute"
5. See the full system metrics!
```

### 5. Example: Get Client Summary

```bash
# In Swagger UI:
1. Expand "Clients" category
2. Click on "GET /clients/{clientId}/summary"
3. Click "Try it out"
4. Enter clientId: CLI-001
5. Click "Execute"
6. See portfolio summary with allocations!
```

## 📖 API Documentation Features

### Request Parameters
- Path parameters (e.g., clientId, portfolioId)
- Query parameters (e.g., limit, startDate)
- Request body schemas

### Response Schemas
- Success response format
- Error response format
- Data models for all entities

### Status Codes
- 200: Success
- 201: Created
- 404: Not Found
- 500: Internal Server Error

## 🎯 Quick Links

| Feature | URL |
|---------|-----|
| Swagger UI | http://localhost:3001/api-docs |
| API Base URL | http://localhost:3001/api/v1 |
| Health Check | http://localhost:3001/health |
| Frontend | http://localhost:3000 |

## 💡 Tips

### Testing with Real Data
The system comes pre-loaded with seed data:
- 50 clients (CLI-001 to CLI-050)
- 100+ accounts (ACC-001, etc.)
- 171 portfolios (PRT-001, etc.)
- 30 securities (AAPL, MSFT, etc.)

### Example Client IDs
- CLI-001 (John Smith)
- CLI-002 (Sarah Johnson)
- CLI-003 (Michael Williams)

### Example Portfolio IDs
- PRT-001, PRT-002, PRT-003, etc.

### Example Security Symbols
- AAPL (Apple)
- MSFT (Microsoft)
- GOOGL (Google)
- SPY (S&P 500 ETF)

## 🔧 Technical Details

### Technologies Used
- **swagger-ui-express**: Swagger UI middleware
- **swagger-jsdoc**: JSDoc to OpenAPI spec generation
- **OpenAPI 3.0**: API specification standard

### Swagger Configuration
Located in: `server/swagger.js`

### API Documentation Comments
Added to route files:
- `server/routes/clients.js`
- `server/routes/dashboard.js`
- `server/routes/portfolios.js`
- Additional routes use base schemas

## 📚 Additional Documentation

- **README.md** - Complete setup guide
- **QUICKSTART.md** - Fast start instructions
- **docs/API.md** - Detailed API reference
- **SWAGGER_GUIDE.md** - This file

## 🎨 Customization

The Swagger UI has been customized with:
- Custom site title
- Hidden top bar
- Portfolio Management System branding

## ⚡ Performance

Swagger documentation is:
- Loaded on demand
- Cached for performance
- No impact on API speed

## 🐛 Troubleshooting

### Swagger UI Not Loading?
1. Check server is running: `curl http://localhost:3001/health`
2. Verify port 3001 is accessible
3. Check browser console for errors

### Can't Execute Requests?
1. Ensure backend server is running
2. Check CORS is enabled (it is by default)
3. Verify the endpoint exists in the API

### Need More Endpoints Documented?
Additional JSDoc comments can be added to any route file following the pattern in `routes/clients.js`.

---

**Enjoy your interactive API documentation! 🚀**

Test it now: http://localhost:3001/api-docs





