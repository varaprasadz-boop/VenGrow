import dotenv from 'dotenv';
import fs from "node:fs";
import path from "node:path";
import { type Server } from "node:http";

import express, { type Express } from "express";
import runApp from "./app";

// Load .env file - check multiple locations
const possibleEnvPaths = [
  path.resolve(import.meta.dirname, '.env'),           // Same directory as the script (dist/.env)
  path.resolve(import.meta.dirname, '..', '.env'),     // Parent directory (project root)
  path.resolve(process.cwd(), '.env'),                 // Current working directory
];

let envLoaded = false;
for (const envPath of possibleEnvPaths) {
  if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
    console.log(`Loaded environment from: ${envPath}`);
    envLoaded = true;
    break;
  }
}

if (!envLoaded) {
  console.log('No .env file found, using system environment variables');
}

export async function serveStatic(app: Express, _server: Server) {
  const distPath = path.resolve(import.meta.dirname, "public");

  if (!fs.existsSync(distPath)) {
    throw new Error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`,
    );
  }

  // Serve storage files statically (more efficient than route handler)
  // Note: The route handler in routes.ts should also work, but this provides direct static serving
  // which is faster and works even if there are routing issues
  const storageDir = process.env.LOCAL_STORAGE_DIR || (process.env.NODE_ENV === 'production' ? '/var/www/storage' : path.join(process.cwd(), "storage"));
  const publicStorageDir = process.env.PUBLIC_STORAGE_DIR || path.join(storageDir, "public");
  const privateStorageDir = path.join(storageDir, "private");
  
  if (fs.existsSync(publicStorageDir)) {
    console.log(`[Static] Serving public storage files from: ${publicStorageDir}`);
    // Serve public files directly - this will handle /storage/public/* requests
    app.use("/storage/public", express.static(publicStorageDir, {
      maxAge: '1y', // Cache for 1 year
      etag: true,
      lastModified: true,
      setHeaders: (res, filePath) => {
        // Set CORS headers to allow cross-origin requests
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
        
        // Set proper content type based on file extension
        const ext = path.extname(filePath).toLowerCase();
        if (ext === '.png') res.setHeader('Content-Type', 'image/png');
        else if (ext === '.jpg' || ext === '.jpeg') res.setHeader('Content-Type', 'image/jpeg');
        else if (ext === '.gif') res.setHeader('Content-Type', 'image/gif');
        else if (ext === '.webp') res.setHeader('Content-Type', 'image/webp');
      }
    }));
  } else {
    console.warn(`[Static] Public storage directory not found: ${publicStorageDir}`);
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

(async () => {
  await runApp(serveStatic);
})();
