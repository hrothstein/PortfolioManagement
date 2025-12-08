# Portfolio Management System - API Documentation

## Base URL

```
http://localhost:3001/api/v1
```

## Response Format

### Success Response

```json
{
  "success": true,
  "data": { ... },
  "timestamp": "2024-10-15T10:00:00Z"
}
```

### Error Response

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

## Endpoints

### Clients

#### List All Clients
```
GET /clients
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "clientId": "CLI-001",
      "customerId": "CUST-001",
      "firstName": "John",
      "lastName": "Smith",
      "email": "john.smith@email.com",
      "phone": "555-0101",
      "riskTolerance": "MODERATE",
      "investmentObjective": "GROWTH",
      ...
    }
  ]
}
```

#### Get Client Summary
```
GET /clients/:clientId/summary
```

**Response includes:**
- Client details
- Total market value across all portfolios
- Total unrealized gain/loss
- Asset allocation breakdown
- Account and portfolio counts

### Portfolios

#### Get Portfolio Performance
```
GET /portfolios/:portfolioId/performance
```

**Response includes:**
- Portfolio details
- Total market value and cost basis
- Unrealized gain/loss ($ and %)
- Day change
- Holdings list with performance
- Asset allocation pie chart data
- Sector allocation pie chart data
- Top 5 holdings by weight

### Dashboard

#### Get System Overview
```
GET /dashboard/overview
```

**Response:**
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

#### Get Top Performers
```
GET /dashboard/top-performers?limit=10
```

Returns holdings sorted by unrealized gain percentage.

### Transactions

#### List Transactions with Filters
```
GET /transactions?startDate=2024-01-01&endDate=2024-12-31&type=BUY&symbol=AAPL
```

**Query Parameters:**
- `startDate` - Filter by start date (ISO format)
- `endDate` - Filter by end date (ISO format)
- `type` - Filter by transaction type (BUY, SELL, DIVIDEND)
- `symbol` - Filter by security symbol

### Securities

#### Update Security Price (Demo)
```
PUT /securities/:securityId
```

**Request Body:**
```json
{
  "currentPrice": 185.50
}
```

This updates the security price and automatically recalculates all holdings' market values.

## Data Models

### Client
```javascript
{
  "clientId": "CLI-001",
  "customerId": "CUST-001",
  "firstName": "John",
  "lastName": "Smith",
  "email": "john.smith@email.com",
  "phone": "555-0101",
  "dateOfBirth": "1975-03-15",
  "address": {
    "street": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "riskTolerance": "MODERATE",      // CONSERVATIVE, MODERATE, AGGRESSIVE
  "investmentObjective": "GROWTH",  // INCOME, GROWTH, BALANCED, PRESERVATION
  "advisorId": "ADV-001",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-15T10:00:00Z"
}
```

### Account
```javascript
{
  "accountId": "ACC-001",
  "clientId": "CLI-001",
  "accountType": "BROKERAGE",  // BROKERAGE, IRA, ROTH_IRA, 401K
  "accountNumber": "BRK-78945612",
  "accountName": "John Smith Brokerage",
  "accountStatus": "ACTIVE",
  "openDate": "2020-06-15",
  "cashBalance": 15000.00
}
```

### Portfolio
```javascript
{
  "portfolioId": "PRT-001",
  "accountId": "ACC-001",
  "clientId": "CLI-001",
  "portfolioName": "Growth Portfolio",
  "portfolioType": "MANAGED",  // MANAGED, SELF_DIRECTED
  "modelPortfolio": "GROWTH_60_40",
  "inceptionDate": "2020-06-20",
  "benchmarkIndex": "SPY"
}
```

### Holding
```javascript
{
  "holdingId": "HLD-001",
  "portfolioId": "PRT-001",
  "securityId": "SEC-001",
  "symbol": "AAPL",
  "quantity": 100,
  "averageCostBasis": 145.00,
  "totalCostBasis": 14500.00,
  "currentPrice": 178.50,
  "marketValue": 17850.00,
  "unrealizedGain": 3350.00,
  "unrealizedGainPercent": 23.10,
  "weight": 15.5
}
```

### Security
```javascript
{
  "securityId": "SEC-001",
  "symbol": "AAPL",
  "securityName": "Apple Inc.",
  "securityType": "STOCK",  // STOCK, BOND, MUTUAL_FUND, ETF
  "sector": "TECHNOLOGY",
  "currentPrice": 178.50,
  "previousClose": 177.25,
  "dayChange": 1.25,
  "dayChangePercent": 0.71,
  "fiftyTwoWeekHigh": 199.62,
  "fiftyTwoWeekLow": 124.17
}
```

## Error Codes

- `NOT_FOUND` - Resource not found
- `INVALID_REQUEST` - Invalid request parameters
- `INTERNAL_ERROR` - Server error

## Rate Limiting

No rate limiting for demo purposes.

## Authentication

No authentication required for demo purposes.






