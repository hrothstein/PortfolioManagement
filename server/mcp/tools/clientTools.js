const { callAPI } = require("../utils/responseFormatter");

const clientTools = [
  {
    name: "portfolio_get_clients",
    description: "List all clients in the system with their contact information, risk tolerance, and investment objectives",
    inputSchema: {
      type: "object",
      properties: {},
      required: []
    },
    handler: async (args, baseUrl) => {
      return callAPI("get", `${baseUrl}/clients`);
    }
  },
  {
    name: "portfolio_get_client",
    description: "Get a specific client by their ID, including contact information, risk tolerance, and investment objective",
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
      return callAPI("get", `${baseUrl}/clients/${args.clientId}`);
    }
  },
  {
    name: "portfolio_get_client_summary",
    description: "Get a client with their complete portfolio summary including total market value, cost basis, unrealized gains, account count, and asset allocation breakdown",
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
      return callAPI("get", `${baseUrl}/clients/${args.clientId}/summary`);
    }
  },
  {
    name: "portfolio_create_client",
    description: "Create a new client in the system",
    inputSchema: {
      type: "object",
      properties: {
        firstName: {
          type: "string",
          description: "Client's first name"
        },
        lastName: {
          type: "string",
          description: "Client's last name"
        },
        email: {
          type: "string",
          description: "Client's email address"
        },
        phone: {
          type: "string",
          description: "Client's phone number"
        },
        dateOfBirth: {
          type: "string",
          description: "Client's date of birth (YYYY-MM-DD format)"
        },
        riskTolerance: {
          type: "string",
          enum: ["CONSERVATIVE", "MODERATE", "AGGRESSIVE"],
          description: "Client's risk tolerance level"
        },
        investmentObjective: {
          type: "string",
          enum: ["INCOME", "GROWTH", "BALANCED", "PRESERVATION"],
          description: "Client's investment objective"
        }
      },
      required: ["firstName", "lastName", "email", "riskTolerance", "investmentObjective"]
    },
    handler: async (args, baseUrl) => {
      return callAPI("post", `${baseUrl}/clients`, args);
    }
  },
  {
    name: "portfolio_update_client",
    description: "Update an existing client's information",
    inputSchema: {
      type: "object",
      properties: {
        clientId: {
          type: "string",
          description: "The unique client identifier (e.g., CLI-001)"
        },
        firstName: {
          type: "string",
          description: "Client's first name"
        },
        lastName: {
          type: "string",
          description: "Client's last name"
        },
        email: {
          type: "string",
          description: "Client's email address"
        },
        phone: {
          type: "string",
          description: "Client's phone number"
        },
        riskTolerance: {
          type: "string",
          enum: ["CONSERVATIVE", "MODERATE", "AGGRESSIVE"],
          description: "Client's risk tolerance level"
        },
        investmentObjective: {
          type: "string",
          enum: ["INCOME", "GROWTH", "BALANCED", "PRESERVATION"],
          description: "Client's investment objective"
        }
      },
      required: ["clientId"]
    },
    handler: async (args, baseUrl) => {
      const { clientId, ...updateData } = args;
      return callAPI("put", `${baseUrl}/clients/${clientId}`, updateData);
    }
  },
  {
    name: "portfolio_delete_client",
    description: "Delete a client from the system. Warning: This will also delete all associated accounts, portfolios, holdings, and transactions.",
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
      return callAPI("delete", `${baseUrl}/clients/${args.clientId}`);
    }
  }
];

module.exports = { clientTools };


