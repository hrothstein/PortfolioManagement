const { callAPI } = require("../utils/responseFormatter");

const accountTools = [
  {
    name: "portfolio_get_accounts",
    description: "List all accounts in the system including brokerage, IRA, Roth IRA, and 401K accounts",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/accounts`);
    }
  },
  {
    name: "portfolio_get_account",
    description: "Get a specific account by ID, including account type, status, and cash balance",
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
      return callAPI("get", `${baseUrl}/accounts/${args.accountId}`);
    }
  },
  {
    name: "portfolio_get_accounts_by_client",
    description: "Get all accounts belonging to a specific client",
    inputSchema: {
      type: "object",
      properties: {
        clientId: {
          type: "string",
          description: "The unique client identifier (e.g., CLI-001)"
        }
      },
      required: ["clientId"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/accounts/client/${args.clientId}`);
    }
  },
  {
    name: "portfolio_create_account",
    description: "Create a new account for a client",
    inputSchema: {
      type: "object",
      properties: {
        clientId: {
          type: "string",
          description: "The client ID this account belongs to (e.g., CLI-001)"
        },
        accountType: {
          type: "string",
          enum: ["BROKERAGE", "IRA", "ROTH_IRA", "401K"],
          description: "Type of account"
        },
        accountName: {
          type: "string",
          description: "Display name for the account"
        },
        cashBalance: {
          type: "number",
          description: "Initial cash balance in USD (default: 0)"
        }
      },
      required: ["clientId", "accountType", "accountName"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("post", `${baseUrl}/accounts`, args);
    }
  },
  {
    name: "portfolio_update_account",
    description: "Update an existing account's information",
    inputSchema: {
      type: "object",
      properties: {
        accountId: {
          type: "string",
          description: "The unique account identifier (e.g., ACC-001)"
        },
        accountName: {
          type: "string",
          description: "Display name for the account"
        },
        accountStatus: {
          type: "string",
          enum: ["ACTIVE", "INACTIVE", "CLOSED"],
          description: "Account status"
        },
        cashBalance: {
          type: "number",
          description: "Cash balance in USD"
        }
      },
      required: ["accountId"]
    },
    handler: async (args, baseUrl) => {
      const { accountId, ...updateData } = args;
      return callAPI("put", `${baseUrl}/accounts/${accountId}`, updateData);
    }
  },
  {
    name: "portfolio_delete_account",
    description: "Delete an account from the system. Warning: This will also delete all associated portfolios, holdings, and transactions.",
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
      return callAPI("delete", `${baseUrl}/accounts/${args.accountId}`);
    }
  }
];

module.exports = { accountTools };

