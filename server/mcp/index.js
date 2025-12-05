const { Server } = require("@modelcontextprotocol/sdk/server/index.js");
const { SSEServerTransport } = require("@modelcontextprotocol/sdk/server/sse.js");
const {
  ListToolsRequestSchema,
  CallToolRequestSchema
} = require("@modelcontextprotocol/sdk/types.js");

// Import tool definitions
const { clientTools } = require("./tools/clientTools");
const { accountTools } = require("./tools/accountTools");
const { portfolioTools } = require("./tools/portfolioTools");
const { holdingTools } = require("./tools/holdingTools");
const { transactionTools } = require("./tools/transactionTools");
const { securityTools } = require("./tools/securityTools");
const { dashboardTools } = require("./tools/dashboardTools");

// Get API base URL from environment or default to local
const API_BASE_URL = process.env.API_BASE_URL || "http://localhost:3001/api/v1";

// Combine all tools
const allTools = [
  ...clientTools,
  ...accountTools,
  ...portfolioTools,
  ...holdingTools,
  ...transactionTools,
  ...securityTools,
  ...dashboardTools
];

// Create MCP server instance
function createMCPServer() {
  const server = new Server(
    { name: "portfolio-management-system", version: "1.0.0" },
    { capabilities: { tools: {} } }
  );

  // Register tool list handler
  server.setRequestHandler(ListToolsRequestSchema, async () => ({
    tools: allTools.map(t => ({
      name: t.name,
      description: t.description,
      inputSchema: t.inputSchema
    }))
  }));

  // Register tool call handler
  server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const tool = allTools.find(t => t.name === request.params.name);
    if (!tool) {
      return {
        content: [{ 
          type: "text", 
          text: JSON.stringify({ 
            error: true, 
            code: "UNKNOWN_TOOL",
            message: `Unknown tool: ${request.params.name}` 
          }, null, 2) 
        }],
        isError: true
      };
    }
    return await tool.handler(request.params.arguments, API_BASE_URL);
  });

  return server;
}

// Create Express router for MCP endpoints
function createMCPRouter(express) {
  const router = express.Router();
  const server = createMCPServer();
  
  // Store transports by session
  const transports = new Map();

  // SSE endpoint for MCP connection
  router.get("/sse", async (req, res) => {
    console.log("🔌 MCP SSE connection established");
    
    const transport = new SSEServerTransport("/mcp/messages", res);
    const sessionId = Date.now().toString();
    transports.set(sessionId, transport);
    
    res.on("close", () => {
      console.log("🔌 MCP SSE connection closed");
      transports.delete(sessionId);
    });

    await server.connect(transport);
  });

  // Message endpoint for MCP
  router.post("/messages", express.json(), async (req, res) => {
    // Find the transport for this session
    // For simplicity, we'll use the most recent transport
    const transport = Array.from(transports.values()).pop();
    
    if (!transport) {
      return res.status(400).json({ 
        error: true, 
        message: "No active SSE connection" 
      });
    }

    try {
      await transport.handlePostMessage(req, res);
    } catch (error) {
      console.error("MCP message error:", error);
      res.status(500).json({ 
        error: true, 
        message: error.message 
      });
    }
  });

  // Health check endpoint
  router.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      tools: allTools.length,
      apiBaseUrl: API_BASE_URL
    });
  });

  // List all available tools
  router.get("/tools", (req, res) => {
    res.json({
      success: true,
      count: allTools.length,
      tools: allTools.map(t => ({
        name: t.name,
        description: t.description
      }))
    });
  });

  return router;
}

module.exports = {
  createMCPRouter,
  createMCPServer,
  allTools,
  API_BASE_URL
};

