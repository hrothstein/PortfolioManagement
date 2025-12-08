const axios = require('axios');

/**
 * Format successful API response for MCP
 */
function formatSuccess(data) {
  return {
    content: [{
      type: "text",
      text: JSON.stringify(data, null, 2)
    }]
  };
}

/**
 * Format error response for MCP
 */
function formatError(error) {
  const message = error.response?.data?.error?.message 
    || error.message 
    || "Unknown error occurred";
  
  const code = error.response?.data?.error?.code 
    || error.response?.status 
    || "ERROR";

  return {
    content: [{
      type: "text",
      text: JSON.stringify({
        error: true,
        code: code,
        message: message
      }, null, 2)
    }],
    isError: true
  };
}

/**
 * Make API call and return formatted MCP response
 */
async function callAPI(method, url, data = null) {
  try {
    const config = { method, url };
    if (data && (method === 'post' || method === 'put')) {
      config.data = data;
    }
    const response = await axios(config);
    return formatSuccess(response.data);
  } catch (error) {
    return formatError(error);
  }
}

module.exports = {
  formatSuccess,
  formatError,
  callAPI
};



