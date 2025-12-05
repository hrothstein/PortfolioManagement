const { callAPI } = require("../utils/responseFormatter");

const portfolioTools = [
  {
    name: "portfolio_get_portfolios",
    description: "List all portfolios in the system with their type, account association, and benchmark information",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/portfolios`);
    }
  },
  {
    name: "portfolio_get_portfolio",
    description: "Get a specific portfolio by ID, including portfolio type, model portfolio reference, and benchmark index",
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
      return callAPI("get", `${baseUrl}/portfolios/${args.portfolioId}`);
    }
  },
  {
    name: "portfolio_get_portfolio_performance",
    description: "Get detailed portfolio performance metrics including total market value, cost basis, unrealized gains, day change, holdings breakdown, asset allocation, sector allocation, and top holdings",
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
      return callAPI("get", `${baseUrl}/portfolios/${args.portfolioId}/performance`);
    }
  },
  {
    name: "portfolio_get_portfolios_by_account",
    description: "Get all portfolios belonging to a specific account",
    inputSchema: {
      type: "object",
      properties: {
        accountId: {
          type: "string",
          description: "The unique account identifier (e.g., ACC-001)"
        }
      },
      required: ["accountId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/portfolios/account/${args.accountId}`);
    }
  },
  {
    name: "portfolio_create_portfolio",
    description: "Create a new portfolio within an account",
    inputSchema: {
      type: "object",
      properties: {
        accountId: {
          type: "string",
          description: "The account ID this portfolio belongs to (e.g., ACC-001)"
        },
        clientId: {
          type: "string",
          description: "The client ID who owns this portfolio (e.g., CLI-001)"
        },
        portfolioName: {
          type: "string",
          description: "Display name for the portfolio (e.g., 'Growth Portfolio')"
        },
        portfolioType: {
          type: "string",
          enum: ["MANAGED", "SELF_DIRECTED"],
          description: "Type of portfolio management"
        },
        modelPortfolio: {
          type: "string",
          description: "Optional model portfolio reference (e.g., GROWTH_60_40)"
        },
        benchmarkIndex: {
          type: "string",
          description: "Benchmark index for performance comparison (e.g., SPY)"
        }
      },
      required: ["accountId", "clientId", "portfolioName", "portfolioType"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("post", `${baseUrl}/portfolios`, args);
    }
  },
  {
    name: "portfolio_update_portfolio",
    description: "Update an existing portfolio's information",
    inputSchema: {
      type: "object",
      properties: {
        portfolioId: {
          type: "string",
          description: "The unique portfolio identifier (e.g., PRT-001)"
        },
        portfolioName: {
          type: "string",
          description: "Display name for the portfolio"
        },
        portfolioType: {
          type: "string",
          enum: ["MANAGED", "SELF_DIRECTED"],
          description: "Type of portfolio management"
        },
        modelPortfolio: {
          type: "string",
          description: "Model portfolio reference"
        },
        benchmarkIndex: {
          type: "string",
          description: "Benchmark index for performance comparison"
        }
      },
      required: ["portfolioId"]
    },
    handler: async (args, baseUrl) => {
      const { portfolioId, ...updateData } = args;
      return callAPI("put", `${baseUrl}/portfolios/${portfolioId}`, updateData);
    }
  },
  {
    name: "portfolio_delete_portfolio",
    description: "Delete a portfolio from the system. Warning: This will also delete all associated holdings and transactions.",
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
      return callAPI("delete", `${baseUrl}/portfolios/${args.portfolioId}`);
    }
  }
];

module.exports = { portfolioTools };

