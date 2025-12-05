const { callAPI } = require("../utils/responseFormatter");

const dashboardTools = [
  {
    name: "portfolio_get_dashboard_overview",
    description: "Get system-wide overview including total clients, accounts, portfolios, AUM (Assets Under Management), unrealized gains, and asset allocation breakdown",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/dashboard/overview`);
    }
  },
  {
    name: "portfolio_get_top_performers",
    description: "Get the top performing holdings across all portfolios, ranked by unrealized gain percentage",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)"
        }
      },
      required: []
    },
    handler: async (args, baseUrl) => {
      const limit = args.limit ? `?limit=${args.limit}` : "";
      return callAPI("get", `${baseUrl}/dashboard/top-performers${limit}`);
    }
  },
  {
    name: "portfolio_get_top_losers",
    description: "Get the worst performing holdings across all portfolios, ranked by unrealized loss percentage",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)"
        }
      },
      required: []
    },
    handler: async (args, baseUrl) => {
      const limit = args.limit ? `?limit=${args.limit}` : "";
      return callAPI("get", `${baseUrl}/dashboard/top-losers${limit}`);
    }
  },
  {
    name: "portfolio_get_recent_transactions",
    description: "Get the most recent transactions across all portfolios",
    inputSchema: {
      type: "object",
      properties: {
        limit: {
          type: "number",
          description: "Maximum number of results to return (default: 10)"
        }
      },
      required: []
    },
    handler: async (args, baseUrl) => {
      const limit = args.limit ? `?limit=${args.limit}` : "";
      return callAPI("get", `${baseUrl}/dashboard/recent-transactions${limit}`);
    }
  },
  {
    name: "portfolio_get_allocation",
    description: "Get aggregate asset allocation across all portfolios, showing percentage breakdown by asset type (STOCK, BOND, MUTUAL_FUND, ETF)",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/dashboard/allocation`);
    }
  }
];

module.exports = { dashboardTools };

