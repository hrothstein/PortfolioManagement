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

// Store active sessions: sessionId -> { server, transport }
const sessions = new Map();

// Create Express router for MCP endpoints
function createMCPRouter(express) {
  const router = express.Router();

  // Streamable HTTP endpoint (POST) - for MCP Inspector and newer clients
  router.post("/sse", async (req, res) => {
    try {
      const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
      const { StreamableHTTPServerTransport } = await import("@modelcontextprotocol/sdk/server/streamableHttp.js");
      const { ListToolsRequestSchema, CallToolRequestSchema } = await import("@modelcontextprotocol/sdk/types.js");
      
      console.log("🔌 MCP Streamable HTTP connection request");

      // Create server for this request
      const server = new Server(
        { name: "portfolio-management-system", version: "1.0.0" },
        { capabilities: { tools: {} } }
      );

      // Register tool list handler
      server.setRequestHandler(ListToolsRequestSchema, async () => {
        console.log(`📋 Tools list requested`);
        return {
          tools: allTools.map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema
          }))
        };
      });

      // Register tool call handler
      server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const toolName = request.params.name;
        console.log(`🔧 Tool called: ${toolName}`);
        
        const tool = allTools.find(t => t.name === toolName);
        if (!tool) {
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify({ 
                error: true, 
                code: "UNKNOWN_TOOL",
                message: `Unknown tool: ${toolName}` 
              }, null, 2) 
            }],
            isError: true
          };
        }
        return await tool.handler(request.params.arguments, API_BASE_URL);
      });

      // Create Streamable HTTP transport
      const transport = new StreamableHTTPServerTransport({
        sessionIdGenerator: undefined, // stateless
      });

      // Connect and handle the request
      await server.connect(transport);
      await transport.handleRequest(req, res);
      
    } catch (error) {
      console.error("❌ MCP Streamable HTTP error:", error);
      if (!res.headersSent) {
        res.status(500).json({ 
          jsonrpc: "2.0",
          error: { code: -32603, message: error.message },
          id: null
        });
      }
    }
  });

  // SSE endpoint for MCP connection (GET) - for SSE-based clients
  router.get("/sse", async (req, res) => {
    try {
      // Dynamic import ESM modules
      const { Server } = await import("@modelcontextprotocol/sdk/server/index.js");
      const { SSEServerTransport } = await import("@modelcontextprotocol/sdk/server/sse.js");
      const { ListToolsRequestSchema, CallToolRequestSchema } = await import("@modelcontextprotocol/sdk/types.js");
      
      console.log("🔌 MCP SSE connection request");

      // Create transport - it will handle SSE headers
      const transport = new SSEServerTransport("/mcp/messages", res);
      const sessionId = transport.sessionId;
      
      console.log(`📡 MCP Session created: ${sessionId}`);

      // Create a new server instance for this session
      const server = new Server(
        { name: "portfolio-management-system", version: "1.0.0" },
        { capabilities: { tools: {} } }
      );

      // Register tool list handler
      server.setRequestHandler(ListToolsRequestSchema, async () => {
        console.log(`📋 Tools list requested (session: ${sessionId})`);
        return {
          tools: allTools.map(t => ({
            name: t.name,
            description: t.description,
            inputSchema: t.inputSchema
          }))
        };
      });

      // Register tool call handler
      server.setRequestHandler(CallToolRequestSchema, async (request) => {
        const toolName = request.params.name;
        console.log(`🔧 Tool called: ${toolName} (session: ${sessionId})`);
        
        const tool = allTools.find(t => t.name === toolName);
        if (!tool) {
          return {
            content: [{ 
              type: "text", 
              text: JSON.stringify({ 
                error: true, 
                code: "UNKNOWN_TOOL",
                message: `Unknown tool: ${toolName}` 
              }, null, 2) 
            }],
            isError: true
          };
        }
        return await tool.handler(request.params.arguments, API_BASE_URL);
      });

      // Store session
      sessions.set(sessionId, { server, transport });

      // Handle connection close
      res.on("close", () => {
        console.log(`🔌 MCP Session closed: ${sessionId}`);
        sessions.delete(sessionId);
      });

      // Connect server to transport (this calls transport.start() internally)
      await server.connect(transport);
      
      console.log(`✅ MCP Server connected (session: ${sessionId})`);
      
    } catch (error) {
      console.error("❌ MCP SSE error:", error);
      if (!res.headersSent) {
        res.status(500).json({ error: true, message: error.message });
      }
    }
  });

  // Message endpoint for MCP protocol messages
  // NOTE: Do NOT use express.json() here - handlePostMessage needs raw stream
  router.post("/messages", async (req, res) => {
    try {
      // Get session ID from query parameter (set by SSEServerTransport)
      const sessionId = req.query.sessionId;
      
      if (!sessionId) {
        return res.status(400).json({ 
          error: true, 
          message: "Missing sessionId query parameter" 
        });
      }

      const session = sessions.get(sessionId);
      if (!session) {
        return res.status(404).json({ 
          error: true, 
          message: `Session not found: ${sessionId}. Connect to /mcp/sse first.` 
        });
      }

      console.log(`📨 MCP Message received (session: ${sessionId})`);
      await session.transport.handlePostMessage(req, res);
      
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
      activeSessions: sessions.size
    });
  });

  // List all available tools (JSON, no MCP protocol needed)
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
      console.log(`🔧 Direct execution: ${toolName}`);
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
  allTools,
  API_BASE_URL
};
