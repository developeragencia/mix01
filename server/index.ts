// CRITICAL: Set UV_THREADPOOL_SIZE before ANY imports to fix DNS issues
process.env.UV_THREADPOOL_SIZE = '128';

// Setup DNS caching and Google DNS to fix EAI_AGAIN errors
import dns from 'dns';
dns.setServers([
  '8.8.8.8',  // Google DNS Primary
  '8.8.4.4',  // Google DNS Secondary
  '1.1.1.1'   // Cloudflare DNS
]);

import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { migrateProduction } from "./migrate-production";
import path from "path";
import dotenv from "dotenv";
import cors from "cors";
console.log('🔧 DNS configuration applied - Using Google DNS (8.8.8.8, 8.8.4.4) + Cloudflare (1.1.1.1)');
console.log('🔧 UV_THREADPOOL_SIZE set to 128 for improved DNS performance');

// Load environment variables with error handling
if (process.env.NODE_ENV !== 'production') {
  try {
    dotenv.config({ path: '.env.local' });
  } catch (error) {
    console.warn('Warning: Could not load .env.local file');
  }
}

const app = express();

// CORS configuration - MUST be before session/auth setup
const allowedOrigins = [
  'http://localhost:5000',
  'http://127.0.0.1:5000',
  'https://mixapp.digital',        // Production custom domain
  /https:\/\/.*\.replit\.dev$/,    // All Replit dev domains
  /https:\/\/.*\.repl\.co$/         // All Repl.co domains
];

app.use(cors({
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl)
    if (!origin) return callback(null, true);
    
    // Check if origin is allowed
    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });
    
    if (isAllowed) {
      callback(null, true);
    } else {
      callback(null, true); // Allow all in development
    }
  },
  credentials: true, // CRITICAL: Allow cookies to be sent
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// FORÇA NO-CACHE - SEMPRE CONTEÚDO ATUALIZADO
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0');
  res.setHeader('Pragma', 'no-cache');
  res.setHeader('Expires', '0');
  res.setHeader('Surrogate-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  next();
});

// Increase payload limit to support base64 image uploads (up to 50MB)
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: false, limit: '50mb' }));

// Serve attached assets statically
app.use('/attached_assets', express.static(path.join(process.cwd(), 'attached_assets')));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

// Health check endpoint for Replit deployment (must be before other routes)
app.get('/_health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

(async () => {
  // Run production migration BEFORE registering routes
  await migrateProduction();
  
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // Configure port and host for Replit deployment
  // In production, MUST use PORT from environment (Replit autoscale requirement)
  const isProduction = app.get("env") === "production";
  const portEnv = process.env.PORT;
  
  if (isProduction && !portEnv) {
    console.error('❌ CRITICAL: PORT environment variable is required in production');
    process.exit(1);
  }
  
  const port = parseInt(portEnv || "5000");
  const host = "0.0.0.0"; // Always bind to 0.0.0.0 for Replit compatibility
  
  // Simplified port handling for ESM compatibility
  
  // Enhanced logging for deployment debugging
  console.log('🔧 Starting Mix App Digital...');
  console.log(`📡 Port: ${port}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🏠 Host: ${host}`);
  console.log(`📂 Working Directory: ${process.cwd()}`);
  
  // Start server with graceful error handling
  server.listen(port, host, () => {
    console.log(`✅ Mix App Digital Server successfully started!`);
    console.log(`🚀 Server running on ${host}:${port}`);
    log(`serving on port ${port}`);
  });
  
  server.on('error', (err: any) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`⚠️  Port ${port} is in use, retrying with port ${port + 1}...`);
      // Retry with next port
      server.listen(port + 1, host, () => {
        console.log(`✅ Mix App Digital Server successfully started!`);
        console.log(`🚀 Server running on ${host}:${port + 1}`);
        log(`serving on port ${port + 1}`);
      });
    } else {
      console.error('❌ Server failed to start:', err);
      process.exit(1);
    }
  });
})();
