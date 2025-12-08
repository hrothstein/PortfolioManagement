const { callAPI } = require("../utils/responseFormatter");

const holdingTools = [
  {
    name: "portfolio_get_holdings",
    description: "List all holdings (positions) across all portfolios with current market values and unrealized gains",
    inputSchema: {
      type: "object",
      properties: {},
      required: [],
      additionalProperties: false
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/holdings`);
    }
  },
  {
    name: "portfolio_get_holding",
    description: "Get a specific holding by ID, including quantity, cost basis, current value, and unrealized gain/loss",
    inputSchema: {
      type: "object",
      properties: {
        holdingId: {
          type: "string",
          description: "The unique holding identifier (e.g., HLD-001)"
        }
      },
      required: ["holdingId"],
      additionalProperties: false
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/holdings/${args.holdingId}`);
    }
  },
  {
    name: "portfolio_get_holdings_by_portfolio",
    description: "Get all holdings within a specific portfolio",
    inputSchema: {
      type: "object",
      properties: {
        portfolioId: {
          type: "string",
          description: "The unique portfolio identifier (e.g., PRT-001)"
        }
      },
      required: ["portfolioId"],
      additionalProperties: false
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/holdings/portfolio/${args.portfolioId}`);
    }
  },
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
        },
        acquiredDate: {
          type: "string",
          description: "Date the position was acquired (YYYY-MM-DD format)"
        }
      },
      required: ["portfolioId", "securityId", "quantity", "averageCostBasis"],
      additionalProperties: false
    },
    handler: async (args, baseUrl) => {
      return callAPI("post", `${baseUrl}/holdings`, args);
    }
  },
  {
    name: "portfolio_update_holding",
    description: "Update an existing holding's information",
    inputSchema: {
      type: "object",
      properties: {
        holdingId: {
          type: "string",
          description: "The unique holding identifier (e.g., HLD-001)"
        },
        quantity: {
          type: "number",
          description: "Number of shares/units"
        },
        averageCostBasis: {
          type: "number",
          description: "Average cost per share/unit in USD"
        }
      },
      required: ["holdingId"],
      additionalProperties: false
    },
    handler: async (args, baseUrl) => {
      const { holdingId, ...updateData } = args;
      return callAPI("put", `${baseUrl}/holdings/${holdingId}`, updateData);
    }
  },
  {
    name: "portfolio_delete_holding",
    description: "Delete a holding from a portfolio. Use this when a position is fully sold.",
    inputSchema: {
      type: "object",
      properties: {
        holdingId: {
          type: "string",
          description: "The unique holding identifier (e.g., HLD-001)"
        }
      },
      required: ["holdingId"],
      additionalProperties: false
    },
    handler: async (args, baseUrl) => {
      return callAPI("delete", `${baseUrl}/holdings/${args.holdingId}`);
    }
  }
];

module.exports = { holdingTools };



