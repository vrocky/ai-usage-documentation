import express from 'express';
import { createProxyMiddleware } from 'http-proxy-middleware';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// Create proxy for Docker Registry
const registryProxy = createProxyMiddleware({
  target: process.env.REGISTRY_URL || 'http://localhost:5000', // Use environment variable or default
  changeOrigin: true,
  pathRewrite: (path, req) => {
    // The proxy is mounted on /v2, so we don't need to rewrite the path itself,
    // but we can log it.
    console.log(`Proxying path: ${path}`);
    return path;
  },
  // You can set the target dynamically if needed, e.g., from an environment variable
  // router: (req) => {
  //   return process.env.REGISTRY_URL || 'http://localhost:5000';
  // },
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} ${req.originalUrl} to ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
  },
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'application/json',
    });
    res.end(JSON.stringify({ error: 'Proxy error', message: err.message }));
  }
});

// Apply proxy middleware to /v2 path for the Docker Registry API
app.use('/v2', registryProxy);

// Status endpoint to check if the proxy is running
app.get('/status', (req, res) => {
  res.json({ status: 'Proxy server is running' });
});

// Start the server
const PORT = 3030;
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Docker Registry API is proxied from /v2 to ${process.env.REGISTRY_URL || 'http://localhost:5000'}/v2`);
});
