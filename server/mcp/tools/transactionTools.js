const { callAPI } = require("../utils/responseFormatter");

const transactionTools = [
  {
    name: "portfolio_get_transactions",
    description: "List all transactions across all portfolios. Supports filtering by date range, type, and symbol.",
    inputSchema: {
      type: "object",
      properties: {
        startDate: {
          type: "string",
          description: "Filter by start date (YYYY-MM-DD format)"
        },
        endDate: {
          type: "string",
          description: "Filter by end date (YYYY-MM-DD format)"
        },
        type: {
          type: "string",
          enum: ["BUY", "SELL", "DIVIDEND", "TRANSFER_IN", "TRANSFER_OUT", "FEE"],
          description: "Filter by transaction type"
        },
        symbol: {
          type: "string",
          description: "Filter by security symbol (e.g., AAPL)"
        }
      },
      required: []
    },
    handler: async (args, baseUrl) => {
      const params = new URLSearchParams();
      if (args.startDate) params.append("startDate", args.startDate);
      if (args.endDate) params.append("endDate", args.endDate);
      if (args.type) params.append("type", args.type);
      if (args.symbol) params.append("symbol", args.symbol);
      const queryString = params.toString();
      const url = queryString ? `${baseUrl}/transactions?${queryString}` : `${baseUrl}/transactions`;
      return callAPI("get", url);
    }
  },
  {
    name: "portfolio_get_transaction",
    description: "Get a specific transaction by ID, including full details like quantity, price, fees, and settlement status",
    inputSchema: {
      type: "object",
      properties: {
        transactionId: {
          type: "string",
          description: "The unique transaction identifier (e.g., TXN-001)"
        }
      },
      required: ["transactionId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/transactions/${args.transactionId}`);
    }
  },
  {
    name: "portfolio_get_transactions_by_portfolio",
    description: "Get all transactions for a specific portfolio",
    inputSchema: {
      type: "object",
      properties: {
        portfolioId: {
          type: "string",
          description: "The unique portfolio identifier (e.g., PRT-001)"
        }
      },
      required: ["portfolioId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/transactions/portfolio/${args.portfolioId}`);
    }
  },
  {
    name: "portfolio_create_transaction",
    description: "Create a new transaction (buy, sell, dividend, transfer, or fee)",
    inputSchema: {
      type: "object",
      properties: {
        portfolioId: {
          type: "string",
          description: "The portfolio ID for this transaction (e.g., PRT-001)"
        },
        securityId: {
          type: "string",
          description: "The security ID being transacted (e.g., SEC-001)"
        },
        holdingId: {
          type: "string",
          description: "The holding ID (required for SELL, optional for others)"
        },
        transactionType: {
          type: "string",
          enum: ["BUY", "SELL", "DIVIDEND", "TRANSFER_IN", "TRANSFER_OUT", "FEE"],
          description: "Type of transaction"
        },
        quantity: {
          type: "number",
          description: "Number of shares/units"
        },
        pricePerUnit: {
          type: "number",
          description: "Price per share/unit in USD"
        },
        fees: {
          type: "number",
          description: "Transaction fees in USD (default: 0)"
        },
        transactionDate: {
          type: "string",
          description: "Date of transaction (ISO 8601 format)"
        },
        notes: {
          type: "string",
          description: "Optional notes about the transaction"
        }
      },
      required: ["portfolioId", "securityId", "transactionType", "quantity", "pricePerUnit"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("post", `${baseUrl}/transactions`, args);
    }
  },
  {
    name: "portfolio_update_transaction",
    description: "Update an existing transaction's information",
    inputSchema: {
      type: "object",
      properties: {
        transactionId: {
          type: "string",
          description: "The unique transaction identifier (e.g., TXN-001)"
        },
        status: {
          type: "string",
          enum: ["PENDING", "SETTLED", "CANCELLED"],
          description: "Transaction status"
        },
        notes: {
          type: "string",
          description: "Notes about the transaction"
        },
        settlementDate: {
          type: "string",
          description: "Settlement date (ISO 8601 format)"
        }
      },
      required: ["transactionId"]
    },
    handler: async (args, baseUrl) => {
      const { transactionId, ...updateData } = args;
      return callAPI("put", `${baseUrl}/transactions/${transactionId}`, updateData);
    }
  },
  {
    name: "portfolio_delete_transaction",
    description: "Delete a transaction from the system. Use with caution as this affects historical records.",
    inputSchema: {
      type: "object",
      properties: {
        transactionId: {
          type: "string",
          description: "The unique transaction identifier (e.g., TXN-001)"
        }
      },
      required: ["transactionId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("delete", `${baseUrl}/transactions/${args.transactionId}`);
    }
  }
];

module.exports = { transactionTools };


