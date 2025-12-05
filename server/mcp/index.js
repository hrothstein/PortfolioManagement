const { callAPI } = require("./utils/responseFormatter");

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

// MCP Server state
let mcpServer = null;
let mcpTransport = null;

// Initialize MCP Server (lazy load ESM module)
async function initMCPServer() {
  if (mcpServer) return mcpServer;
  
  try {
    const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
    const { ListToolsRequestSchema, CallToolRequestSchema } = await import("@modelcontextprotocol/sdk/types.js");
    
    mcpServer = new Server(
      { name: "portfolio-management-system", version: "1.0.0" },
      { capabilities: { tools: {} } }
    );

    // Register tool list handler
    mcpServer.setRequestHandler(ListToolsRequestSchema, async () => ({
      tools: allTools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }))
    }));

    // Register tool call handler
    mcpServer.setRequestHandler(CallToolRequestSchema, async (request) => {
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

    console.log("✅ MCP Server initialized with", allTools.length, "tools");
    return mcpServer;
  } catch (error) {
    console.error("❌ Failed to initialize MCP Server:", error.message);
    throw error;
  }
}

// Create Express router for MCP endpoints
function createMCPRouter(express) {
  const router = express.Router();
  
  // Store active transports
  const transports = new Map();

  // SSE endpoint for MCP connection
  router.get("/sse", async (req, res) => {
    try {
      const server = await initMCPServer();
      const { SSEServerTransport } = await import("@modelcontextprotocol/sdk/server/sse.js");
      
      console.log("🔌 MCP SSE connection request received");
      
      // Set SSE headers
      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.flushHeaders();
      
      const sessionId = `session_${Date.now()}`;
      const transport = new SSEServerTransport(`/mcp/messages`, res);
      transports.set(sessionId, transport);
      
      // Send session ID to client
      res.write(`data: ${JSON.stringify({ sessionId })}\n\n`);
      
      req.on("close", () => {
        console.log("🔌 MCP SSE connection closed:", sessionId);
        transports.delete(sessionId);
      });

      await server.connect(transport);
      console.log("✅ MCP SSE transport connected:", sessionId);
      
    } catch (error) {
      console.error("❌ MCP SSE error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: true, message: error.message });
      }
    }
  });

  // Message endpoint for MCP
  router.post("/messages", express.json(), async (req, res) => {
    try {
      // Get session ID from query or header
      const sessionId = req.query.sessionId || req.headers['x-session-id'];
      
      let transport;
      if (sessionId && transports.has(sessionId)) {
        transport = transports.get(sessionId);
      } else {
        // Use most recent transport if no session specified
        transport = Array.from(transports.values()).pop();
      }
      
      if (!transport) {
        return res.status(400).json({ 
          error: true, 
          message: "No active SSE connection. Connect to /mcp/sse first." 
        });
      }

      await transport.handlePostMessage(req, res);
    } catch (error) {
      console.error("❌ MCP message error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: true, message: error.message });
      }
    }
  });

  // Health check endpoint
  router.get("/health", (req, res) => {
    res.json({ 
      status: "ok", 
      tools: allTools.length,
      apiBaseUrl: API_BASE_URL,
      mcpInitialized: mcpServer !== null
    });
  });

  // List all available tools (works without MCP protocol)
  router.get("/tools", (req, res) => {
    res.json({
      success: true,
      count: allTools.length,
      tools: allTools.map(t => ({
        name: t.name,
        description: t.description,
        inputSchema: t.inputSchema
      }))
    });
  });

  // Direct tool execution endpoint (bypasses MCP protocol for testing)
  router.post("/execute/:toolName", express.json(), async (req, res) => {
    const { toolName } = req.params;
    const tool = allTools.find(t => t.name === toolName);
    
    if (!tool) {
      return res.status(404).json({
        error: true,
        message: `Tool not found: ${toolName}`
      });
    }

    try {
      const result = await tool.handler(req.body, API_BASE_URL);
      res.json(result);
    } catch (error) {
      res.status(500).json({
        error: true,
        message: error.message
      });
    }
  });

  return router;
}

module.exports = {
  createMCPRouter,
  initMCPServer,
  allTools,
  API_BASE_URL
};
