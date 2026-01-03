import * as client from "openid-client";
import { Strategy, type VerifyFunction } from "openid-client/passport";

import passport from "passport";
import session from "express-session";
import type { Express, RequestHandler } from "express";
import memoize from "memoizee";
import connectPg from "connect-pg-simple";
import { storage } from "./storage";

// Check if we're running on Replit (REPL_ID is set) - evaluated at runtime
function isRunningOnReplit(): boolean {
  return !!process.env.REPL_ID;
}

const getOidcConfig = memoize(
  async () => {
    if (!isRunningOnReplit()) {
      return null;
    }
    return await client.discovery(
      new URL(process.env.ISSUER_URL ?? "https://replit.com/oidc"),
      process.env.REPL_ID!
    );
  },
  { maxAge: 3600 * 1000 }
);

export function getSession() {
  const sessionTtl = 7 * 24 * 60 * 60 * 1000;

  const pgStore = connectPg(session);

  const sessionStore = new pgStore({
    conString: process.env.DATABASE_URL,
    createTableIfMissing: false,
    ttl: sessionTtl / 1000,
    tableName: "sessions",
  });

  const isProd = process.env.NODE_ENV === "production";

  return session({
    name: "sid",
    secret: process.env.SESSION_SECRET!,
    store: sessionStore,
    resave: false,
    saveUninitialized: false,
    proxy: true,
    cookie: {
      httpOnly: true,
      secure: isProd,
      sameSite: isProd ? "none" : "lax",
      maxAge: sessionTtl,
      domain: isProd ? `.${process.env.COOKIE_DOMAIN}` : undefined,
      path: "/",
    },
  });
}


function updateUserSession(
  user: any,
  tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers
) {
  user.claims = tokens.claims();
  user.access_token = tokens.access_token;
  user.refresh_token = tokens.refresh_token;
  user.expires_at = user.claims?.exp;
}

async function upsertUser(claims: any) {
  await storage.upsertUser({
    id: claims["sub"],
    email: claims["email"],
    firstName: claims["first_name"],
    lastName: claims["last_name"],
    profileImageUrl: claims["profile_image_url"],
  });
}

export async function setupAuth(app: Express) {
  app.set("trust proxy", 1);
  app.use(getSession());
  app.use(passport.initialize());
  app.use(passport.session());

  // Skip Replit OAuth setup if not running on Replit
  if (!isRunningOnReplit()) {
    console.log("Not running on Replit - Replit OAuth disabled. Using local auth only.");
    
    passport.serializeUser((user: Express.User, cb) => cb(null, user));
    passport.deserializeUser((user: Express.User, cb) => cb(null, user));
    
    // Provide fallback routes that inform the user
    app.get("/api/login", (req, res) => {
      res.status(503).json({ message: "Replit OAuth is not available. Please use email/password login." });
    });

    app.get("/api/callback", (req, res) => {
      res.status(503).json({ message: "Replit OAuth is not available." });
    });

    // Handle both GET and POST for logout
    app.get("/api/logout", (req, res) => {
      req.logout(() => {
        // Destroy session
        req.session.destroy((err: any) => {
          if (err) {
            console.error("Session destroy error:", err);
          }
          res.redirect("/");
        });
      });
    });
    
    app.post("/api/logout", (req, res) => {
      req.logout(() => {
        // Destroy session
        req.session.destroy((err: any) => {
          if (err) {
            console.error("Session destroy error:", err);
            return res.status(500).json({ message: "Logout failed" });
          }
          res.json({ success: true });
        });
      });
    });
    
    return;
  }

  const config = await getOidcConfig();
  
  if (!config) {
    console.log("Failed to initialize OIDC config");
    return;
  }

  const verify: VerifyFunction = async (
    tokens: client.TokenEndpointResponse & client.TokenEndpointResponseHelpers,
    verified: passport.AuthenticateCallback
  ) => {
    const user = {};
    updateUserSession(user, tokens);
    await upsertUser(tokens.claims());
    verified(null, user);
  };

  const registeredStrategies = new Set<string>();

  const ensureStrategy = (domain: string) => {
    const strategyName = `replitauth:${domain}`;
    if (!registeredStrategies.has(strategyName)) {
      const strategy = new Strategy(
        {
          name: strategyName,
          config,
          scope: "openid email profile offline_access",
          callbackURL: `https://${domain}/api/callback`,
        },
        verify,
      );
      passport.use(strategy);
      registeredStrategies.add(strategyName);
    }
  };

  passport.serializeUser((user: Express.User, cb) => cb(null, user));
  passport.deserializeUser((user: Express.User, cb) => cb(null, user));

  app.get("/api/login", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      prompt: "login consent",
      scope: ["openid", "email", "profile", "offline_access"],
    })(req, res, next);
  });

  app.get("/api/callback", (req, res, next) => {
    ensureStrategy(req.hostname);
    passport.authenticate(`replitauth:${req.hostname}`, {
      successReturnToOrRedirect: "/",
      failureRedirect: "/api/login",
    })(req, res, next);
  });

  app.get("/api/logout", (req, res) => {
    req.logout(() => {
      // Destroy session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Session destroy error:", err);
        }
        res.redirect(
          client.buildEndSessionUrl(config, {
            client_id: process.env.REPL_ID!,
            post_logout_redirect_uri: `${req.protocol}://${req.hostname}`,
          }).href
        );
      });
    });
  });
  
  app.post("/api/logout", (req, res) => {
    req.logout(() => {
      // Destroy session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Session destroy error:", err);
          return res.status(500).json({ message: "Logout failed" });
        }
        res.json({ success: true });
      });
    });
  });
}

export const isAuthenticated: RequestHandler = async (req, res, next) => {
  // First, check local session auth (email/password login)
  // This works both on and off Replit
  const localUser = (req.session as any)?.localUser;
  if (localUser?.id) {
    return next();
  }

  // If not on Replit, and no local session, reject
  if (!isRunningOnReplit()) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  // On Replit, check OIDC/Passport auth
  const user = req.user as any;

  if (!req.isAuthenticated() || !user?.expires_at) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const now = Math.floor(Date.now() / 1000);
  if (now <= user.expires_at) {
    return next();
  }

  const refreshToken = user.refresh_token;
  if (!refreshToken) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }

  try {
    const config = await getOidcConfig();
    if (!config) {
      res.status(401).json({ message: "Unauthorized" });
      return;
    }
    const tokenResponse = await client.refreshTokenGrant(config, refreshToken);
    updateUserSession(user, tokenResponse);
    return next();
  } catch (error) {
    res.status(401).json({ message: "Unauthorized" });
    return;
  }
};
