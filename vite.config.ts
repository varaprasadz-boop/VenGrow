import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import runtimeErrorOverlay from "@replit/vite-plugin-runtime-error-modal";

export default defineConfig(async ({ mode }) => {
  // Load env file from project root (where vite.config.ts is located)
  // Vite automatically loads .env files, but we need to ensure it looks in the right place
  // The third parameter 'VITE_' means only load variables prefixed with VITE_
  const env = loadEnv(mode, import.meta.dirname, 'VITE_');
  
  // Log in development to help debug
  if (mode === 'production' && !env.VITE_GOOGLE_MAPS_API_KEY) {
    console.warn('⚠️  WARNING: VITE_GOOGLE_MAPS_API_KEY is not set in .env file!');
    console.warn('   Google Maps will not work. Make sure to set it before building.');
  }
  
  return {
  plugins: [
    react(),
    runtimeErrorOverlay(),
    ...(process.env.NODE_ENV !== "production" &&
    process.env.REPL_ID !== undefined
      ? [
          await import("@replit/vite-plugin-cartographer").then((m) =>
            m.cartographer(),
          ),
          await import("@replit/vite-plugin-dev-banner").then((m) =>
            m.devBanner(),
          ),
        ]
      : []),
  ],
  resolve: {
    alias: {
      "@": path.resolve(import.meta.dirname, "client", "src"),
      "@shared": path.resolve(import.meta.dirname, "shared"),
      "@assets": path.resolve(import.meta.dirname, "attached_assets"),
    },
  },
  root: path.resolve(import.meta.dirname, "client"),
  build: {
    outDir: path.resolve(import.meta.dirname, "dist/public"),
    emptyOutDir: true,
  },
  server: {
    fs: {
      strict: true,
      deny: ["**/.*"],
    },
  },
  };
});
