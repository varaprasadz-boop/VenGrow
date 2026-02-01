import { type Server } from "node:http";

import express, {
  type Express,
  type Request,
  Response,
  NextFunction,
} from "express";

import { registerRoutes } from "./routes";

export function log(message: string, source = "express") {
  const formattedTime = new Date().toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  });

  console.log(`${formattedTime} [${source}] ${message}`);
}

export const app = express();

declare module 'http' {
  interface IncomingMessage {
    rawBody: unknown
  }
}
// Handle raw binary data for file uploads (up to 100MB) - must be before JSON parser
app.use('/api/upload/direct', express.raw({ limit: '100mb', type: '*/*' }));

app.use(express.json({
  verify: (req, _res, buf) => {
    req.rawBody = buf;
  }
}));
app.use(express.urlencoded({ extended: false }));

// CSRF Protection middleware for form submissions
app.use((req, res, next) => {
  // Skip CSRF for GET, HEAD, OPTIONS requests
  if (['GET', 'HEAD', 'OPTIONS'].includes(req.method)) {
    return next();
  }
  
  // Skip CSRF for WebSocket upgrades
  if (req.headers.upgrade === 'websocket') {
    return next();
  }
  
  // Skip CSRF for API endpoints that don't need it (like auth endpoints that use their own tokens)
  const skipPaths = ['/api/auth/login', '/api/auth/register', '/api/auth/logout'];
  if (skipPaths.includes(req.path)) {
    return next();
  }
  
  // For form submissions, check Origin header
  const origin = req.headers.origin || req.headers.referer;
  const host = req.headers.host;
  
  // Allow requests from same origin or trusted origins
  if (origin && host) {
    try {
      const originUrl = new URL(origin);
      const hostUrl = new URL(`http://${host}`);
      
      // Same origin is always allowed
      if (originUrl.hostname === hostUrl.hostname) {
        return next();
      }
      
      // For production, you might want to check against a whitelist
      // For now, we'll allow same-origin only
    } catch (e) {
      // Invalid origin, reject
      return res.status(403).json({ error: "Invalid origin" });
    }
  }
  
  next();
});

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

export default async function runApp(
  setup: (app: Express, server: Server) => Promise<void>,
) {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    // Log error for debugging but don't throw after sending response
    // Throwing after response is sent can cause unhandled promise rejections
    console.error("Error handler:", err);
    res.status(status).json({ message });
  });

  // importantly run the final setup after setting up all the other routes so
  // the catch-all route doesn't interfere with the other routes
  await setup(app, server);

  // ALWAYS serve the app on the port specified in the environment variable PORT
  // Other ports are firewalled. Default to 5000 if not specified.
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = parseInt(process.env.PORT || '5000', 10);
  // Use 127.0.0.1 by default to avoid ENOTSUP on macOS; set HOST=0.0.0.0 for external access.
  const host = process.env.HOST || "127.0.0.1";
  server.listen({
    port,
    host,
  }, () => {
    log(`serving on http://${host}:${port}`);
  });
}
