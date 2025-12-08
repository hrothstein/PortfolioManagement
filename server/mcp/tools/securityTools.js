const { callAPI } = require("../utils/responseFormatter");

const securityTools = [
  {
    name: "portfolio_get_securities",
    description: "List all securities (stocks, bonds, mutual funds, ETFs) with current market data including prices, day changes, and key metrics",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/securities`);
    }
  },
  {
    name: "portfolio_get_security",
    description: "Get detailed information about a specific security by ID, including price, day change, 52-week range, and type-specific metrics",
    inputSchema: {
      type: "object",
      properties: {
        securityId: {
          type: "string",
          description: "The unique security identifier (e.g., SEC-001)"
        }
      },
      required: ["securityId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/securities/${args.securityId}`);
    }
  },
  {
    name: "portfolio_get_security_by_symbol",
    description: "Get security information by ticker symbol (e.g., AAPL, MSFT, SPY)",
    inputSchema: {
      type: "object",
      properties: {
        symbol: {
          type: "string",
          description: "The ticker symbol (e.g., AAPL, MSFT, GOOGL, SPY)"
        }
      },
      required: ["symbol"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/securities/symbol/${args.symbol}`);
    }
  },
  {
    name: "portfolio_get_securities_by_type",
    description: "Get all securities of a specific type",
    inputSchema: {
      type: "object",
      properties: {
        type: {
          type: "string",
          enum: ["STOCK", "BOND", "MUTUAL_FUND", "ETF"],
          description: "The security type to filter by"
        }
      },
      required: ["type"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/securities/type/${args.type}`);
    }
  },
  {
    name: "portfolio_update_security",
    description: "Update a security's price information (for demo purposes to simulate market movement)",
    inputSchema: {
      type: "object",
      properties: {
        securityId: {
          type: "string",
          description: "The unique security identifier (e.g., SEC-001)"
        },
        currentPrice: {
          type: "number",
          description: "New current price"
        },
        previousClose: {
          type: "number",
          description: "Previous closing price"
        },
        dayChange: {
          type: "number",
          description: "Dollar change from previous close"
        },
        dayChangePercent: {
          type: "number",
          description: "Percentage change from previous close"
        }
      },
      required: ["securityId"]
    },
    handler: async (args, baseUrl) => {
      const { securityId, ...updateData } = args;
      return callAPI("put", `${baseUrl}/securities/${securityId}`, updateData);
    }
  }
];

module.exports = { securityTools };


