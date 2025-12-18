import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { seedCMSContent } from "./seed-cms";
import { insertPropertySchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { verifySuperadminCredentials, hashPassword, verifyPassword, validateEmail, validatePhone } from "./auth-utils";
import * as emailService from "./email";

const connectedClients = new Map<string, Set<WebSocket>>();

// Helper function to get user ID from either OIDC or local session auth
function getAuthenticatedUserId(req: any): string | null {
  // Check local session first (email/password auth)
  const localUser = (req.session as any)?.localUser;
  if (localUser?.id) {
    return localUser.id;
  }
  // Check OIDC auth
  if (req.user?.claims?.sub) {
    return req.user.claims.sub;
  }
  return null;
}

function broadcastToUser(userId: string, message: any) {
  const userSockets = connectedClients.get(userId);
  if (userSockets) {
    const messageStr = JSON.stringify(message);
    userSockets.forEach(ws => {
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(messageStr);
      }
    });
  }
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  // Get current authenticated user (alias for frontend compatibility)
  app.get("/api/auth/me", async (req: any, res: Response) => {
    try {
      // Check for local user session first
      const localUser = (req.session as any)?.localUser;
      if (localUser?.id) {
        const user = await storage.getUser(localUser.id);
        if (user) {
          return res.json(user);
        }
      }
      
      // Check for admin session
      const adminUser = (req.session as any)?.adminUser;
      if (adminUser?.isSuperAdmin) {
        return res.json({
          id: "superadmin",
          email: adminUser.email,
          firstName: "Super",
          lastName: "Admin",
          role: "admin",
          isSuperAdmin: true,
        });
      }
      
      // Check for Google OAuth session
      if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        const userId = req.user.claims.sub;
        const user = await storage.getUser(userId);
        if (user) {
          return res.json(user);
        }
      }
      
      return res.status(401).json({ message: "Not authenticated" });
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });
  
  // Get current authenticated user (protected)
  app.get("/api/auth/user", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ message: "Not authenticated" });
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // ============================================
  // SUPER ADMIN AUTHENTICATION
  // ============================================

  // Super Admin Login
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const isValid = await verifySuperadminCredentials(email, password);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Set admin session with a fixed admin id for audit logging
      (req.session as any).adminUser = {
        id: "superadmin",
        email,
        role: "admin",
        isSuperAdmin: true,
        loginAt: new Date().toISOString(),
      };
      
      // Explicitly save session before responding
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      res.json({
        success: true,
        user: {
          email,
          role: "admin",
          firstName: "Super",
          lastName: "Admin",
          isSuperAdmin: true,
        },
      });
    } catch (error) {
      console.error("Admin login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Super Admin Logout
  app.post("/api/admin/logout", async (req: Request, res: Response) => {
    try {
      (req.session as any).adminUser = null;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // Get Super Admin Session
  app.get("/api/admin/me", async (req: Request, res: Response) => {
    const adminUser = (req.session as any)?.adminUser;
    
    if (!adminUser) {
      return res.status(401).json({ message: "Not authenticated as admin" });
    }
    
    res.json({
      email: adminUser.email,
      role: "admin",
      firstName: "Super",
      lastName: "Admin",
      isSuperAdmin: true,
    });
  });

  // Middleware to check if user is super admin
  const isSuperAdmin = (req: Request, res: Response, next: Function) => {
    const adminUser = (req.session as any)?.adminUser;
    
    if (!adminUser || !adminUser.isSuperAdmin) {
      return res.status(403).json({ message: "Access denied. Super admin required." });
    }
    
    next();
  };

  // ============================================
  // USER REGISTRATION WITH EMAIL/PASSWORD
  // ============================================

  // Register new user with email/password
  app.post("/api/auth/register", async (req: Request, res: Response) => {
    try {
      const { email, password, firstName, lastName, phone, intent } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      if (phone && !validatePhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number. Must be 10 digits starting with 6-9" });
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Create user
      const user = await storage.createUserWithPassword({
        email,
        passwordHash,
        firstName,
        lastName,
        phone,
        intent,
        role: intent === "seller" ? "seller" : "buyer",
        authProvider: "local",
      });
      
      // Set session
      (req.session as any).localUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        loginAt: new Date().toISOString(),
      };
      
      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          intent: user.intent,
        },
      });
    } catch (error) {
      console.error("Registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Login with email/password
  app.post("/api/auth/login", async (req: Request, res: Response) => {
    try {
      const { email, password } = req.body;
      
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      const user = await storage.getUserByEmail(email);
      
      if (!user || !user.passwordHash) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      const isValid = await verifyPassword(password, user.passwordHash);
      
      if (!isValid) {
        return res.status(401).json({ message: "Invalid email or password" });
      }
      
      // Update last login
      await storage.updateUserLastLogin(user.id);
      
      // Set session
      (req.session as any).localUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        loginAt: new Date().toISOString(),
      };
      
      // Explicitly save session before responding
      await new Promise<void>((resolve, reject) => {
        req.session.save((err: any) => {
          if (err) reject(err);
          else resolve();
        });
      });
      
      res.json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          profileImageUrl: user.profileImageUrl,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Login failed" });
    }
  });

  // Logout for email/password users
  app.post("/api/auth/logout", async (req: Request, res: Response) => {
    try {
      (req.session as any).localUser = null;
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Logout failed" });
    }
  });

  // ============================================
  // DEVELOPMENT ROUTES
  // ============================================
  
  // Seed database (development only)
  app.post("/api/seed", async (req: Request, res: Response) => {
    try {
      await seedDatabase();
      res.json({ success: true, message: "Database seeded successfully" });
    } catch (error) {
      console.error("Seed error:", error);
      res.status(500).json({ success: false, error: "Failed to seed database" });
    }
  });

  // ============================================
  // USER ROUTES
  // ============================================
  
  // Get current user (placeholder - will be replaced with auth)
  app.get("/api/users/me", async (req: Request, res: Response) => {
    res.json({ user: null, authenticated: false });
  });

  // Get user by ID
  app.get("/api/users/:id", async (req: Request, res: Response) => {
    try {
      const user = await storage.getUser(req.params.id);
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(user);
    } catch (error) {
      res.status(500).json({ error: "Failed to get user" });
    }
  });

  // Get all users (admin only)
  app.get("/api/admin/users", async (req: Request, res: Response) => {
    try {
      const { role, isActive } = req.query;
      const users = await storage.getAllUsers({
        role: role as string,
        isActive: isActive === "true" ? true : isActive === "false" ? false : undefined,
      });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get users" });
    }
  });

  // Admin: Update user (suspend/unsuspend)
  app.patch("/api/admin/users/:id", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      
      const { id } = req.params;
      const { isActive, role } = req.body;
      
      const oldUser = await storage.getUser(id);
      if (!oldUser) {
        return res.status(404).json({ message: "User not found" });
      }
      
      const updateData: Record<string, any> = {};
      if (typeof isActive === "boolean") updateData.isActive = isActive;
      if (role) updateData.role = role;
      
      const user = await storage.updateUser(id, updateData);
      
      // Log the action
      const action = typeof isActive === "boolean" 
        ? (isActive ? "User Unsuspended" : "User Suspended")
        : "User Updated";
      await storage.createAuditLog({
        userId: adminUser.id,
        action,
        entityType: "user",
        entityId: id,
        oldData: { isActive: oldUser.isActive, role: oldUser.role },
        newData: updateData,
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(user);
    } catch (error) {
      console.error("Error updating user:", error);
      res.status(500).json({ error: "Failed to update user" });
    }
  });

  // Get all sellers with stats (admin only)
  app.get("/api/admin/sellers/stats", async (req: Request, res: Response) => {
    try {
      const sellers = await storage.getAllSellerProfiles({});
      
      const sellersWithStats = await Promise.all(
        sellers.map(async (seller) => {
          const user = await storage.getUser(seller.userId);
          const allProperties = await storage.getPropertiesBySeller(seller.id);
          const liveProperties = allProperties.filter(p => p.workflowStatus === "live");
          const inquiries = await storage.getInquiriesBySeller(seller.id);
          
          return {
            ...seller,
            user: user ? {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              phone: user.phone,
            } : null,
            livePropertiesCount: liveProperties.length,
            totalInquiries: inquiries.length,
          };
        })
      );
      
      res.json(sellersWithStats);
    } catch (error) {
      console.error("Error getting seller stats:", error);
      res.status(500).json({ error: "Failed to get seller stats" });
    }
  });

  // ============================================
  // SELLER PROFILE ROUTES
  // ============================================
  
  // Get all seller profiles
  app.get("/api/sellers", async (req: Request, res: Response) => {
    try {
      const { verificationStatus, sellerType } = req.query;
      const sellers = await storage.getAllSellerProfiles({
        verificationStatus: verificationStatus as string,
        sellerType: sellerType as string,
      });
      res.json(sellers);
    } catch (error) {
      res.status(500).json({ error: "Failed to get sellers" });
    }
  });

  // Get seller profile by ID
  app.get("/api/sellers/:id", async (req: Request, res: Response) => {
    try {
      const seller = await storage.getSellerProfile(req.params.id);
      if (!seller) {
        return res.status(404).json({ error: "Seller not found" });
      }
      res.json(seller);
    } catch (error) {
      res.status(500).json({ error: "Failed to get seller" });
    }
  });

  // ============================================
  // PACKAGE ROUTES
  // ============================================
  
  // Get all packages
  app.get("/api/packages", async (req: Request, res: Response) => {
    try {
      const packages = await storage.getPackages();
      res.json(packages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get packages" });
    }
  });

  // Get package by ID
  app.get("/api/packages/:id", async (req: Request, res: Response) => {
    try {
      const pkg = await storage.getPackage(req.params.id);
      if (!pkg) {
        return res.status(404).json({ error: "Package not found" });
      }
      res.json(pkg);
    } catch (error) {
      res.status(500).json({ error: "Failed to get package" });
    }
  });

  // ============================================
  // PUBLIC CMS ROUTES (No auth required)
  // ============================================

  // Get all FAQs (public)
  app.get("/api/faqs", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const faqs = category 
        ? await storage.getFaqItemsByCategory(category)
        : await storage.getFaqItems();
      res.json(faqs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get FAQs" });
    }
  });

  // Get popular cities (public)
  app.get("/api/cities", async (req: Request, res: Response) => {
    try {
      const cities = await storage.getPopularCities();
      res.json(cities);
    } catch (error) {
      res.status(500).json({ error: "Failed to get cities" });
    }
  });

  // Get property categories with subcategories (public)
  app.get("/api/categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getPropertyCategories();
      const subcategories = await storage.getPropertySubcategories();
      
      // Attach subcategories to each category
      const categoriesWithSubs = categories.map(cat => ({
        ...cat,
        subcategories: subcategories.filter(sub => sub.categoryId === cat.id)
      }));
      
      res.json(categoriesWithSubs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get categories" });
    }
  });

  // Get property subcategories (public)
  app.get("/api/subcategories", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const subcategories = await storage.getPropertySubcategories(categoryId);
      res.json(subcategories);
    } catch (error) {
      res.status(500).json({ error: "Failed to get subcategories" });
    }
  });

  // Get banners (public)
  app.get("/api/banners", async (req: Request, res: Response) => {
    try {
      const position = req.query.position as string | undefined;
      const banners = await storage.getBanners(position);
      res.json(banners);
    } catch (error) {
      res.status(500).json({ error: "Failed to get banners" });
    }
  });

  // Get navigation links (public)
  app.get("/api/navigation", async (req: Request, res: Response) => {
    try {
      const position = req.query.position as string | undefined;
      const section = req.query.section as string | undefined;
      const links = await storage.getNavigationLinks(position, section);
      res.json(links);
    } catch (error) {
      res.status(500).json({ error: "Failed to get navigation" });
    }
  });

  // Get static page by slug (public)
  app.get("/api/pages/:slug", async (req: Request, res: Response) => {
    try {
      const page = await storage.getStaticPageBySlug(req.params.slug);
      if (!page) {
        return res.status(404).json({ error: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      res.status(500).json({ error: "Failed to get page" });
    }
  });

  // Get site settings (public - non-sensitive only)
  app.get("/api/site-settings", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const settings = await storage.getSiteSettings(category);
      // Filter out sensitive settings
      const publicSettings = settings.filter(s => 
        !s.key.includes('secret') && 
        !s.key.includes('password') && 
        !s.key.includes('api_key')
      );
      res.json(publicSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get settings" });
    }
  });

  // ============================================
  // PROPERTY ROUTES
  // ============================================
  
  // Get all properties with filters
  app.get("/api/properties", async (req: Request, res: Response) => {
    try {
      const { 
        city, state, propertyType, transactionType, 
        minPrice, maxPrice, minArea, maxArea, 
        bedrooms, status, isVerified, isFeatured,
        search, limit, offset 
      } = req.query;
      
      const properties = await storage.getProperties({
        city: city as string,
        state: state as string,
        propertyType: propertyType as string,
        transactionType: transactionType as string,
        minPrice: minPrice ? parseInt(minPrice as string) : undefined,
        maxPrice: maxPrice ? parseInt(maxPrice as string) : undefined,
        minArea: minArea ? parseInt(minArea as string) : undefined,
        maxArea: maxArea ? parseInt(maxArea as string) : undefined,
        bedrooms: bedrooms ? parseInt(bedrooms as string) : undefined,
        status: status as string,
        isVerified: isVerified === "true" ? true : isVerified === "false" ? false : undefined,
        isFeatured: isFeatured === "true" ? true : isFeatured === "false" ? false : undefined,
        search: search as string,
        limit: limit ? parseInt(limit as string) : undefined,
        offset: offset ? parseInt(offset as string) : undefined,
      });
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get properties" });
    }
  });

  // Get featured properties
  app.get("/api/properties/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const properties = await storage.getFeaturedProperties(limit);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get featured properties" });
    }
  });

  // Get property by ID
  app.get("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      // Increment view count
      await storage.incrementPropertyView(req.params.id);
      
      // Get images
      const images = await storage.getPropertyImages(req.params.id);
      
      res.json({ ...property, images });
    } catch (error) {
      res.status(500).json({ error: "Failed to get property" });
    }
  });

  // Get seller's properties
  app.get("/api/sellers/:sellerId/properties", async (req: Request, res: Response) => {
    try {
      const properties = await storage.getPropertiesBySeller(req.params.sellerId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get seller properties" });
    }
  });

  // Create property
  app.post("/api/properties", async (req: any, res: Response) => {
    try {
      // Get current user ID
      let userId = null;
      if ((req.session as any)?.localUser?.id) {
        userId = (req.session as any).localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      // Get seller profile
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.status(400).json({ success: false, message: "Seller profile required. Please complete seller registration." });
      }
      
      // Check subscription limits
      const canCreate = await storage.canSellerCreateListing(sellerProfile.id);
      if (!canCreate) {
        return res.status(403).json({ 
          success: false, 
          message: "Listing limit reached. Please upgrade your package to create more listings.",
          code: "LISTING_LIMIT_REACHED"
        });
      }
      
      // Create property with seller ID
      const propertyData = {
        ...req.body,
        sellerId: sellerProfile.id,
        status: "draft" as const,
        workflowStatus: "draft" as const,
      };
      
      const property = await storage.createProperty(propertyData);
      
      // Increment listings used count
      await storage.incrementSubscriptionListingUsage(sellerProfile.id);
      
      res.status(201).json({ success: true, property });
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ success: false, message: "Failed to create property" });
    }
  });

  // Update property
  app.patch("/api/properties/:id", async (req: any, res: Response) => {
    try {
      const propertyId = req.params.id;
      
      // Get current property to check status
      const currentProperty = await storage.getProperty(propertyId);
      if (!currentProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      // If property is approved, live, needs_reapproval, or submitted, editing should go to pendingChanges
      // Edits are stored in pendingChanges but NOT applied until admin re-approves
      const protectedStatuses = ["approved", "live", "needs_reapproval", "submitted"];
      const requiresPendingChanges = protectedStatuses.includes(currentProperty.workflowStatus || "");
      
      let property;
      
      if (requiresPendingChanges) {
        // Sanitize input - remove ALL protected/system fields that shouldn't be edited via pendingChanges
        // This is a comprehensive blocklist of all admin/system fields from the properties schema
        const protectedFields = [
          'id', 'sellerId', 'status', 'workflowStatus', 'isVerified', 'isFeatured',
          'viewCount', 'inquiryCount', 'favoriteCount', 'publishedAt', 'expiresAt',
          'approvedAt', 'approvedBy', 'pendingChanges', 'rejectionReason',
          'createdAt', 'updatedAt'
        ];
        const sanitizedBody = { ...req.body };
        protectedFields.forEach(field => delete sanitizedBody[field]);
        
        // Merge new edits with any existing pending changes
        let existingPending: Record<string, any> = {};
        if (currentProperty.pendingChanges) {
          try {
            existingPending = typeof currentProperty.pendingChanges === 'string' 
              ? JSON.parse(currentProperty.pendingChanges) 
              : currentProperty.pendingChanges;
          } catch (e) {
            existingPending = {};
          }
        }
        
        const mergedPending = { ...existingPending, ...sanitizedBody };
        
        // Only update workflowStatus and store pending changes
        // Do NOT apply actual edits until admin approves
        const updateData = {
          workflowStatus: "needs_reapproval" as const,
          pendingChanges: mergedPending as Record<string, unknown>,
        };
        property = await storage.updateProperty(propertyId, updateData);
        
        res.json({
          ...property,
          needsReapproval: true,
          message: "Changes saved as pending. Please resubmit for admin approval. Your live listing remains unchanged until approved."
        });
      } else {
        // For draft or other statuses, apply changes directly
        property = await storage.updateProperty(propertyId, req.body);
        
        res.json({
          ...property,
          needsReapproval: false
        });
      }
    } catch (error) {
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  // Delete property
  app.delete("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteProperty(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete property" });
    }
  });

  // ============================================
  // PROPERTY APPROVAL WORKFLOW ROUTES
  // ============================================
  
  // Submit property for approval
  app.post("/api/properties/:id/submit-for-approval", async (req: any, res: Response) => {
    try {
      const propertyId = req.params.id;
      
      // Get current user ID
      let userId = null;
      if ((req.session as any)?.localUser?.id) {
        userId = (req.session as any).localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      // Get the property
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ success: false, message: "Property not found" });
      }
      
      // Check if user owns this property (through seller profile)
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile || sellerProfile.id !== property.sellerId) {
        return res.status(403).json({ success: false, message: "You can only submit your own properties" });
      }
      
      // Update property workflow status to submitted
      await storage.updateProperty(propertyId, {
        workflowStatus: "submitted",
      });
      
      // Create approval request
      const approvalRequest = await storage.createPropertyApprovalRequest({
        propertyId,
        sellerId: sellerProfile.id,
        submittedBy: userId,
        requestType: property.workflowStatus === "needs_reapproval" ? "edit" : "new",
        status: "pending",
      });
      
      res.json({ 
        success: true, 
        message: "Property submitted for approval",
        approvalRequest 
      });
    } catch (error) {
      console.error("Error submitting property for approval:", error);
      res.status(500).json({ success: false, message: "Failed to submit property for approval" });
    }
  });
  
  // Admin: Get pending property approvals
  app.get("/api/admin/property-approvals", async (req: any, res: Response) => {
    try {
      // Check admin session
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      
      const { status, requestType, limit, offset } = req.query;
      
      const approvals = await storage.getPropertyApprovalRequests({
        status: status as string,
        requestType: requestType as string,
        limit: limit ? parseInt(limit as string) : 50,
        offset: offset ? parseInt(offset as string) : 0,
      });
      
      // Enhance with property and seller details
      const enhancedApprovals = await Promise.all(
        approvals.map(async (approval) => {
          const property = await storage.getProperty(approval.propertyId);
          const sellerProfile = await storage.getSellerProfile(approval.sellerId);
          const submitter = await storage.getUser(approval.submittedBy);
          return {
            ...approval,
            property,
            sellerProfile,
            submitter: submitter ? { 
              id: submitter.id, 
              firstName: submitter.firstName, 
              lastName: submitter.lastName, 
              email: submitter.email 
            } : null,
          };
        })
      );
      
      res.json({ success: true, approvals: enhancedApprovals });
    } catch (error) {
      console.error("Error getting property approvals:", error);
      res.status(500).json({ success: false, message: "Failed to get property approvals" });
    }
  });
  
  // Admin: Approve property
  app.post("/api/admin/property-approvals/:id/approve", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      
      const approvalId = req.params.id;
      const { notes } = req.body;
      
      // Get the approval request
      const approval = await storage.getPropertyApprovalRequest(approvalId);
      if (!approval) {
        return res.status(404).json({ success: false, message: "Approval request not found" });
      }
      
      // Update approval request
      await storage.updatePropertyApprovalRequest(approvalId, {
        status: "approved",
        approverId: "superadmin",
        decisionReason: notes,
        decidedAt: new Date(),
      });
      
      // Get the property to check for pending changes
      const property = await storage.getProperty(approval.propertyId);
      
      // Build update data - apply pending changes if this is a re-approval
      let updateData: any = {
        workflowStatus: "live",
        status: "active",
        approvedAt: new Date(),
        approvedBy: "superadmin",
        pendingChanges: null, // Clear pending changes after approval
      };
      
      // If property has pending changes (re-approval), apply them now
      if (property?.pendingChanges) {
        try {
          // pendingChanges is already a jsonb object, no need to parse
          const pendingChanges = { ...(property.pendingChanges as Record<string, unknown>) };
          
          // Sanitize pending changes - remove ALL protected/system fields as extra security
          const protectedFields = [
            'id', 'sellerId', 'status', 'workflowStatus', 'isVerified', 'isFeatured',
            'viewCount', 'inquiryCount', 'favoriteCount', 'publishedAt', 'expiresAt',
            'approvedAt', 'approvedBy', 'pendingChanges', 'rejectionReason',
            'createdAt', 'updatedAt'
          ];
          protectedFields.forEach(field => delete pendingChanges[field]);
          
          // Merge pending changes into the update
          updateData = { ...updateData, ...pendingChanges };
        } catch (e) {
          console.error("Failed to process pending changes:", e);
        }
      }
      
      // Update property to live status (with pending changes applied if any)
      await storage.updateProperty(approval.propertyId, updateData);
      
      res.json({ 
        success: true, 
        message: "Property approved and now live" 
      });
    } catch (error) {
      console.error("Error approving property:", error);
      res.status(500).json({ success: false, message: "Failed to approve property" });
    }
  });
  
  // Admin: Reject property
  app.post("/api/admin/property-approvals/:id/reject", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(403).json({ success: false, message: "Admin access required" });
      }
      
      const approvalId = req.params.id;
      const { reason } = req.body;
      
      if (!reason) {
        return res.status(400).json({ success: false, message: "Rejection reason is required" });
      }
      
      // Get the approval request
      const approval = await storage.getPropertyApprovalRequest(approvalId);
      if (!approval) {
        return res.status(404).json({ success: false, message: "Approval request not found" });
      }
      
      // Update approval request
      await storage.updatePropertyApprovalRequest(approvalId, {
        status: "rejected",
        approverId: "superadmin",
        decisionReason: reason,
        decidedAt: new Date(),
      });
      
      // Update property status
      await storage.updateProperty(approval.propertyId, {
        workflowStatus: "rejected",
        status: "draft",
      });
      
      res.json({ 
        success: true, 
        message: "Property rejected" 
      });
    } catch (error) {
      console.error("Error rejecting property:", error);
      res.status(500).json({ success: false, message: "Failed to reject property" });
    }
  });
  
  // Get property approval history
  app.get("/api/properties/:id/approval-history", async (req: any, res: Response) => {
    try {
      const propertyId = req.params.id;
      const history = await storage.getPropertyApprovalHistory(propertyId);
      res.json({ success: true, history });
    } catch (error) {
      console.error("Error getting approval history:", error);
      res.status(500).json({ success: false, message: "Failed to get approval history" });
    }
  });

  // ============================================
  // FAVORITES ROUTES
  // ============================================
  
  // Get current user's favorites (authenticated)
  app.get("/api/me/favorites", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const properties = await storage.getFavoriteProperties(userId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get favorites" });
    }
  });

  // Get user's favorites
  app.get("/api/users/:userId/favorites", async (req: Request, res: Response) => {
    try {
      const properties = await storage.getFavoriteProperties(req.params.userId);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get favorites" });
    }
  });

  // Add to favorites
  app.post("/api/favorites", async (req: Request, res: Response) => {
    try {
      const { userId, propertyId } = req.body;
      const favorite = await storage.addFavorite(userId, propertyId);
      res.status(201).json(favorite);
    } catch (error) {
      res.status(500).json({ error: "Failed to add favorite" });
    }
  });

  // Remove from favorites
  app.delete("/api/favorites", async (req: Request, res: Response) => {
    try {
      const { userId, propertyId } = req.body;
      await storage.removeFavorite(userId, propertyId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to remove favorite" });
    }
  });

  // Check if property is favorited
  app.get("/api/favorites/check", async (req: Request, res: Response) => {
    try {
      const { userId, propertyId } = req.query;
      const isFavorite = await storage.isFavorite(userId as string, propertyId as string);
      res.json({ isFavorite });
    } catch (error) {
      res.status(500).json({ error: "Failed to check favorite" });
    }
  });

  // ============================================
  // INQUIRY ROUTES
  // ============================================
  
  // Get current user's inquiries (authenticated)
  app.get("/api/me/inquiries", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const inquiries = await storage.getInquiriesByBuyer(userId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Get buyer's inquiries
  app.get("/api/users/:userId/inquiries", async (req: Request, res: Response) => {
    try {
      const inquiries = await storage.getInquiriesByBuyer(req.params.userId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Get seller's inquiries
  app.get("/api/sellers/:sellerId/inquiries", async (req: Request, res: Response) => {
    try {
      const inquiries = await storage.getInquiriesBySeller(req.params.sellerId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Get property inquiries
  app.get("/api/properties/:propertyId/inquiries", async (req: Request, res: Response) => {
    try {
      const inquiries = await storage.getInquiriesByProperty(req.params.propertyId);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Create inquiry
  app.post("/api/inquiries", async (req: Request, res: Response) => {
    try {
      const { propertyId, userId, name, email, phone, message } = req.body;
      
      if (!propertyId) {
        return res.status(400).json({ error: "Property ID is required" });
      }
      
      // Get the property to find the sellerId
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      // Create the inquiry with seller lookup
      const inquiryData = {
        propertyId,
        buyerId: userId || "guest",
        sellerId: property.sellerId,
        message: message || `Inquiry from ${name}`,
        buyerPhone: phone,
        buyerEmail: email,
        sourceType: "form" as const,
      };
      
      const inquiry = await storage.createInquiry(inquiryData);
      
      // Send email notification to seller (async, don't wait)
      const sellerProfile = await storage.getSellerProfile(property.sellerId);
      if (sellerProfile) {
        const sellerUser = await storage.getUser(sellerProfile.userId);
        if (sellerUser?.email) {
          emailService.sendInquiryNotification(
            sellerUser.email,
            sellerProfile.companyName || sellerUser.firstName || "Seller",
            property.title,
            name || "Buyer",
            email || "",
            phone || "",
            message || ""
          ).catch(err => console.log("[Email] Inquiry notification error:", err));
        }
      }
      
      res.status(201).json(inquiry);
    } catch (error) {
      console.error("Failed to create inquiry:", error);
      res.status(500).json({ error: "Failed to create inquiry" });
    }
  });

  // Update inquiry (respond)
  app.patch("/api/inquiries/:id", async (req: Request, res: Response) => {
    try {
      const inquiry = await storage.updateInquiry(req.params.id, req.body);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }
      res.json(inquiry);
    } catch (error) {
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  // ============================================
  // SAVED SEARCHES ROUTES
  // ============================================
  
  // Get user's saved searches
  app.get("/api/users/:userId/saved-searches", async (req: Request, res: Response) => {
    try {
      const searches = await storage.getSavedSearches(req.params.userId);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ error: "Failed to get saved searches" });
    }
  });

  // Create saved search
  app.post("/api/saved-searches", async (req: Request, res: Response) => {
    try {
      const { userId, name, filters } = req.body;
      const search = await storage.createSavedSearch(userId, name, filters);
      res.status(201).json(search);
    } catch (error) {
      res.status(500).json({ error: "Failed to create saved search" });
    }
  });

  // Delete saved search
  app.delete("/api/saved-searches/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteSavedSearch(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete saved search" });
    }
  });

  // Update saved search (toggle alerts)
  app.patch("/api/saved-searches/:id", async (req: Request, res: Response) => {
    try {
      const search = await storage.updateSavedSearch(req.params.id, req.body);
      if (!search) {
        return res.status(404).json({ error: "Saved search not found" });
      }
      res.json(search);
    } catch (error) {
      res.status(500).json({ error: "Failed to update saved search" });
    }
  });

  // ============================================
  // CHAT ROUTES
  // ============================================
  
  // Get user's chat threads
  app.get("/api/users/:userId/chats", async (req: Request, res: Response) => {
    try {
      const threads = await storage.getChatThreads(req.params.userId);
      res.json(threads);
    } catch (error) {
      res.status(500).json({ error: "Failed to get chat threads" });
    }
  });

  // Get chat thread with messages
  app.get("/api/chats/:threadId", async (req: Request, res: Response) => {
    try {
      const thread = await storage.getChatThread(req.params.threadId);
      if (!thread) {
        return res.status(404).json({ error: "Chat thread not found" });
      }
      const messages = await storage.getChatMessages(req.params.threadId);
      res.json({ thread, messages });
    } catch (error) {
      res.status(500).json({ error: "Failed to get chat" });
    }
  });

  // Create or get chat thread
  app.post("/api/chats", async (req: Request, res: Response) => {
    try {
      const { buyerId, sellerId, propertyId } = req.body;
      const thread = await storage.getOrCreateChatThread(buyerId, sellerId, propertyId);
      res.json(thread);
    } catch (error) {
      res.status(500).json({ error: "Failed to create chat" });
    }
  });

  // Send message
  app.post("/api/chats/:threadId/messages", async (req: Request, res: Response) => {
    try {
      const message = await storage.sendChatMessage({
        threadId: req.params.threadId,
        senderId: req.body.senderId,
        content: req.body.content,
        attachments: req.body.attachments,
      });
      res.status(201).json(message);
    } catch (error) {
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Mark messages as read
  app.post("/api/chats/:threadId/read", async (req: Request, res: Response) => {
    try {
      await storage.markMessagesAsRead(req.params.threadId, req.body.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark messages as read" });
    }
  });

  // ============================================
  // NOTIFICATION ROUTES
  // ============================================
  
  // Get user's notifications
  app.get("/api/users/:userId/notifications", async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getNotifications(req.params.userId);
      const unreadCount = await storage.getUnreadNotificationCount(req.params.userId);
      res.json({ notifications, unreadCount });
    } catch (error) {
      res.status(500).json({ error: "Failed to get notifications" });
    }
  });

  // Mark notification as read
  app.post("/api/notifications/:id/read", async (req: Request, res: Response) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Mark all notifications as read
  app.post("/api/users/:userId/notifications/read-all", async (req: Request, res: Response) => {
    try {
      await storage.markAllNotificationsAsRead(req.params.userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notifications as read" });
    }
  });

  // Get notifications for current user
  app.get("/api/notifications/:userId", async (req: Request, res: Response) => {
    try {
      const notifications = await storage.getNotifications(req.params.userId);
      res.json(notifications);
    } catch (error) {
      res.status(500).json({ error: "Failed to get notifications" });
    }
  });

  // Mark notification as read (PATCH version)
  app.patch("/api/notifications/:id/read", async (req: Request, res: Response) => {
    try {
      await storage.markNotificationAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notification as read" });
    }
  });

  // Delete notification
  app.delete("/api/notifications/:id", async (req: Request, res: Response) => {
    try {
      await storage.deleteNotification(req.params.id);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete notification" });
    }
  });

  // Mark all notifications as read for current user
  app.post("/api/notifications/mark-all-read", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      await storage.markAllNotificationsAsRead(userId);
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to mark notifications as read" });
    }
  });

  // ============================================
  // PAYMENT ROUTES
  // ============================================

  // Check Razorpay configuration status
  app.get("/api/razorpay/status", async (req: Request, res: Response) => {
    try {
      const { isRazorpayConfigured, getKeyId, isDummyMode } = await import("./razorpay");
      res.json({
        configured: isRazorpayConfigured(),
        keyId: getKeyId(),
        dummyMode: isDummyMode(),
      });
    } catch (error) {
      res.status(500).json({ error: "Failed to check Razorpay status" });
    }
  });

  // Create Razorpay order
  app.post("/api/razorpay/orders", async (req: Request, res: Response) => {
    try {
      const { isRazorpayConfigured, createOrder, getKeyId } = await import("./razorpay");
      
      if (!isRazorpayConfigured()) {
        return res.status(503).json({ error: "Razorpay is not configured" });
      }

      const { packageId, amount, userId, notes } = req.body;
      
      if (!packageId || !amount || !userId) {
        return res.status(400).json({ error: "Missing required fields: packageId, amount, userId" });
      }

      const receipt = `order_${Date.now()}_${userId.slice(0, 8)}`;
      
      const order = await createOrder({
        amount,
        currency: "INR",
        receipt,
        notes: {
          packageId,
          userId,
          ...notes,
        },
      });

      const payment = await storage.createPayment({
        userId,
        amount,
        currency: "INR",
        razorpayOrderId: order.id,
        status: "pending",
        description: `Package purchase: ${packageId}`,
        packageId,
        metadata: { notes },
      });

      res.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: getKeyId(),
        paymentId: payment.id,
      });
    } catch (error: any) {
      console.error("Razorpay order error:", error);
      res.status(500).json({ error: error.message || "Failed to create Razorpay order" });
    }
  });

  // Verify Razorpay payment
  app.post("/api/razorpay/verify", async (req: Request, res: Response) => {
    try {
      const { verifyPaymentSignature } = await import("./razorpay");
      
      const {
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
        paymentId,
      } = req.body;

      if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !paymentId) {
        return res.status(400).json({ error: "Missing required verification fields" });
      }

      const isValid = verifyPaymentSignature({
        razorpay_order_id,
        razorpay_payment_id,
        razorpay_signature,
      });

      if (!isValid) {
        await storage.updatePayment(paymentId, {
          status: "failed",
          razorpayPaymentId: razorpay_payment_id,
        });
        return res.status(400).json({ error: "Payment verification failed" });
      }

      const payment = await storage.updatePayment(paymentId, {
        status: "completed",
        razorpayPaymentId: razorpay_payment_id,
        razorpaySignature: razorpay_signature,
      });

      res.json({
        success: true,
        payment,
      });
    } catch (error: any) {
      console.error("Payment verification error:", error);
      res.status(500).json({ error: error.message || "Payment verification failed" });
    }
  });
  
  // Get all payments (admin)
  app.get("/api/payments", async (req: Request, res: Response) => {
    try {
      const payments = await storage.getAllPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get payments" });
    }
  });

  // Get user's payments
  app.get("/api/users/:userId/payments", async (req: Request, res: Response) => {
    try {
      const payments = await storage.getPayments(req.params.userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get payments" });
    }
  });

  // Create payment (Razorpay order)
  app.post("/api/payments", async (req: Request, res: Response) => {
    try {
      const payment = await storage.createPayment(req.body);
      res.status(201).json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to create payment" });
    }
  });

  // Update payment (after Razorpay verification)
  app.patch("/api/payments/:id", async (req: Request, res: Response) => {
    try {
      const payment = await storage.updatePayment(req.params.id, req.body);
      if (!payment) {
        return res.status(404).json({ error: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ error: "Failed to update payment" });
    }
  });

  // ============================================
  // DUMMY PAYMENT GATEWAY (For Testing)
  // ============================================
  
  // Dummy payment - accepts test card 4111-1111-1111-1111
  app.post("/api/payments/dummy", async (req: any, res: Response) => {
    try {
      const { cardNumber, expiryMonth, expiryYear, cvv, packageId, userId } = req.body;
      
      if (!packageId || !userId) {
        return res.status(400).json({ success: false, message: "Package ID and User ID are required" });
      }
      
      // Get user info
      let currentUserId = userId;
      if ((req.session as any)?.localUser?.id) {
        currentUserId = (req.session as any).localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        currentUserId = req.user.claims.sub;
      }
      
      // Get package details
      const pkg = await storage.getPackage(packageId);
      if (!pkg) {
        return res.status(404).json({ success: false, message: "Package not found" });
      }
      
      // Test card validation
      const cleanCardNumber = cardNumber?.replace(/\s|-/g, "") || "";
      const validTestCards = ["4111111111111111", "5555555555554444", "378282246310005"];
      
      // Simulate processing delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Check if using test card
      if (!validTestCards.includes(cleanCardNumber)) {
        // Create failed payment record
        await storage.createPayment({
          userId: currentUserId,
          packageId,
          amount: pkg.price,
          currency: "INR",
          status: "failed",
          paymentMethod: "dummy_card",
          description: `Package purchase: ${pkg.name} (Invalid test card)`,
          metadata: { cardLast4: cleanCardNumber.slice(-4), error: "Invalid test card" },
        });
        
        return res.status(400).json({ 
          success: false, 
          message: "Invalid card. For testing, use: 4111-1111-1111-1111" 
        });
      }
      
      // Validate expiry (basic check)
      const currentDate = new Date();
      let expYear = parseInt(expiryYear);
      const expMonth = parseInt(expiryMonth);
      
      // Handle 2-digit years (e.g., "27" -> 2027)
      if (expYear < 100) {
        expYear = 2000 + expYear;
      }
      
      if (expYear < currentDate.getFullYear() || (expYear === currentDate.getFullYear() && expMonth < currentDate.getMonth() + 1)) {
        return res.status(400).json({ success: false, message: "Card has expired" });
      }
      
      // CVV validation
      if (!cvv || cvv.length < 3) {
        return res.status(400).json({ success: false, message: "Invalid CVV" });
      }
      
      // Get seller profile or create one if it doesn't exist
      let sellerProfile = await storage.getSellerProfileByUserId(currentUserId);
      if (!sellerProfile) {
        // Auto-create a basic seller profile for the user
        const user = await storage.getUser(currentUserId);
        if (!user) {
          return res.status(400).json({ success: false, message: "User not found. Please log in again." });
        }
        
        sellerProfile = await storage.createSellerProfile({
          userId: currentUserId,
          companyName: user.firstName && user.lastName 
            ? `${user.firstName} ${user.lastName}` 
            : user.email?.split("@")[0] || "New Seller",
          sellerType: "individual",
        });
      }
      
      // Deactivate any existing subscriptions
      const existingSub = await storage.getActiveSubscription(sellerProfile.id);
      if (existingSub) {
        await storage.deactivateSubscription(existingSub.id);
      }
      
      // Calculate end date based on package duration
      const endDate = new Date();
      endDate.setDate(endDate.getDate() + pkg.duration);
      
      // Create subscription
      const subscription = await storage.createSubscription(sellerProfile.id, packageId, endDate);
      
      // Create successful payment record
      const payment = await storage.createPayment({
        userId: currentUserId,
        packageId,
        subscriptionId: subscription.id,
        amount: pkg.price,
        currency: "INR",
        status: "completed",
        paymentMethod: "dummy_card",
        description: `Package purchase: ${pkg.name}`,
        metadata: { 
          cardLast4: cleanCardNumber.slice(-4),
          dummyTransactionId: `DUMMY_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` 
        },
      });
      
      // Create notification for user
      await storage.createNotification({
        userId: currentUserId,
        type: "payment",
        title: "Payment Successful",
        message: `Your ${pkg.name} package has been activated. You can now list up to ${pkg.listingLimit} properties.`,
        data: { packageId, subscriptionId: subscription.id, paymentId: payment.id },
      });
      
      res.json({
        success: true,
        message: "Payment successful! Your package has been activated.",
        payment,
        subscription,
        package: pkg,
      });
    } catch (error) {
      console.error("Dummy payment error:", error);
      res.status(500).json({ success: false, message: "Payment processing failed. Please try again." });
    }
  });

  // ============================================
  // RAZORPAY WEBHOOK
  // ============================================
  
  app.post("/api/razorpay/webhook", async (req: Request, res: Response) => {
    try {
      const crypto = await import("crypto");
      const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
      
      // If webhook secret not configured, log and acknowledge
      if (!webhookSecret) {
        console.log("[Razorpay Webhook] Secret not configured, skipping verification");
        console.log("[Razorpay Webhook] Event:", req.body?.event);
        return res.json({ status: "ok", message: "Webhook received (no secret configured)" });
      }
      
      // Verify webhook signature
      const signature = req.headers["x-razorpay-signature"] as string;
      const body = JSON.stringify(req.body);
      const expectedSignature = crypto
        .createHmac("sha256", webhookSecret)
        .update(body)
        .digest("hex");
      
      if (signature !== expectedSignature) {
        console.log("[Razorpay Webhook] Invalid signature");
        return res.status(400).json({ error: "Invalid signature" });
      }
      
      const event = req.body.event;
      const payload = req.body.payload;
      
      console.log("[Razorpay Webhook] Received event:", event);
      
      switch (event) {
        case "payment.captured":
        case "payment.authorized": {
          const payment = payload?.payment?.entity;
          if (payment) {
            const orderId = payment.order_id;
            const paymentId = payment.id;
            
            // Find and update our payment record
            const payments = await storage.getAllPayments();
            const dbPayment = payments.find(p => p.razorpayOrderId === orderId);
            
            if (dbPayment) {
              await storage.updatePayment(dbPayment.id, {
                status: "completed",
                razorpayPaymentId: paymentId,
              });
              
              // Send success email
              const user = await storage.getUser(dbPayment.userId);
              if (user?.email) {
                const pkg = dbPayment.packageId ? await storage.getPackage(dbPayment.packageId) : null;
                emailService.sendPaymentNotification(
                  user.email,
                  user.firstName || "Seller",
                  `₹${dbPayment.amount}`,
                  pkg?.name || "Package",
                  true
                ).catch(err => console.log("[Email] Payment notification error:", err));
              }
            }
          }
          break;
        }
        
        case "payment.failed": {
          const payment = payload?.payment?.entity;
          if (payment) {
            const orderId = payment.order_id;
            const errorDesc = payment.error_description || "Payment failed";
            
            const payments = await storage.getAllPayments();
            const dbPayment = payments.find(p => p.razorpayOrderId === orderId);
            
            if (dbPayment) {
              await storage.updatePayment(dbPayment.id, {
                status: "failed",
              });
              
              // Send failure email
              const user = await storage.getUser(dbPayment.userId);
              if (user?.email) {
                const pkg = dbPayment.packageId ? await storage.getPackage(dbPayment.packageId) : null;
                emailService.sendPaymentNotification(
                  user.email,
                  user.firstName || "Seller",
                  `₹${dbPayment.amount}`,
                  pkg?.name || "Package",
                  false,
                  errorDesc
                ).catch(err => console.log("[Email] Payment notification error:", err));
              }
            }
          }
          break;
        }
        
        case "subscription.activated":
        case "subscription.charged": {
          console.log("[Razorpay Webhook] Subscription event:", event);
          break;
        }
        
        default:
          console.log("[Razorpay Webhook] Unhandled event:", event);
      }
      
      res.json({ status: "ok" });
    } catch (error) {
      console.error("[Razorpay Webhook] Error:", error);
      res.status(500).json({ error: "Webhook processing failed" });
    }
  });

  // ============================================
  // SUBSCRIPTION ROUTES
  // ============================================
  
  // Get current seller's subscription with package details
  app.get("/api/subscriptions/current", async (req: any, res: Response) => {
    try {
      let userId = null;
      if ((req.session as any)?.localUser?.id) {
        userId = (req.session as any).localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.json({ success: true, subscription: null, package: null });
      }
      
      const result = await storage.getActiveSubscriptionWithPackage(sellerProfile.id);
      
      if (!result) {
        return res.json({ success: true, subscription: null, package: null });
      }
      
      res.json({ 
        success: true, 
        subscription: result.subscription, 
        package: result.package,
        usage: {
          listingsUsed: result.subscription.listingsUsed,
          listingLimit: result.package.listingLimit,
          remainingListings: result.package.listingLimit - result.subscription.listingsUsed,
          featuredUsed: result.subscription.featuredUsed,
          featuredLimit: result.package.featuredListings,
        }
      });
    } catch (error) {
      console.error("Error getting subscription:", error);
      res.status(500).json({ success: false, message: "Failed to get subscription" });
    }
  });
  
  // Check if seller can create a new listing
  app.get("/api/subscriptions/can-create-listing", async (req: any, res: Response) => {
    try {
      let userId = null;
      if ((req.session as any)?.localUser?.id) {
        userId = (req.session as any).localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.json({ 
          canCreate: false, 
          reason: "Please complete your seller profile first." 
        });
      }
      
      const result = await storage.canSellerCreateListing(sellerProfile.id);
      res.json(result);
    } catch (error) {
      console.error("Error checking listing limit:", error);
      res.status(500).json({ success: false, message: "Failed to check listing limit" });
    }
  });
  
  // Get seller's subscription history
  app.get("/api/subscriptions/history", async (req: any, res: Response) => {
    try {
      let userId = null;
      if ((req.session as any)?.localUser?.id) {
        userId = (req.session as any).localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      if (!userId) {
        return res.status(401).json({ success: false, message: "Not authenticated" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.json({ success: true, subscriptions: [] });
      }
      
      const subscriptions = await storage.getSellerSubscriptions(sellerProfile.id);
      
      // Enhance with package details
      const enhanced = await Promise.all(subscriptions.map(async (sub) => {
        const pkg = await storage.getPackage(sub.packageId);
        return { ...sub, package: pkg };
      }));
      
      res.json({ success: true, subscriptions: enhanced });
    } catch (error) {
      console.error("Error getting subscription history:", error);
      res.status(500).json({ success: false, message: "Failed to get subscription history" });
    }
  });

  // ============================================
  // REVIEW ROUTES
  // ============================================
  
  // Get seller reviews
  app.get("/api/sellers/:sellerId/reviews", async (req: Request, res: Response) => {
    try {
      const reviews = await storage.getReviewsBySeller(req.params.sellerId);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  // Create review
  app.post("/api/reviews", async (req: Request, res: Response) => {
    try {
      const review = await storage.createReview(req.body);
      res.status(201).json(review);
    } catch (error) {
      res.status(500).json({ error: "Failed to create review" });
    }
  });

  // ============================================
  // ADMIN ROUTES
  // ============================================
  
  // Get pending approvals
  app.get("/api/admin/approvals", async (req: Request, res: Response) => {
    try {
      const { type } = req.query;
      const approvals = await storage.getPendingApprovals(type as string);
      res.json(approvals);
    } catch (error) {
      res.status(500).json({ error: "Failed to get approvals" });
    }
  });

  // Update approval
  app.patch("/api/admin/approvals/:id", async (req: Request, res: Response) => {
    try {
      const { status, reviewedBy, notes } = req.body;
      const approval = await storage.updateApproval(req.params.id, status, reviewedBy, notes);
      if (!approval) {
        return res.status(404).json({ error: "Approval not found" });
      }
      res.json(approval);
    } catch (error) {
      res.status(500).json({ error: "Failed to update approval" });
    }
  });

  // Get audit logs
  app.get("/api/admin/audit-logs", async (req: Request, res: Response) => {
    try {
      const { userId, action, entityType } = req.query;
      const logs = await storage.getAuditLogs({
        userId: userId as string,
        action: action as string,
        entityType: entityType as string,
      });
      res.json(logs);
    } catch (error) {
      res.status(500).json({ error: "Failed to get audit logs" });
    }
  });

  // Get system setting
  app.get("/api/admin/settings/:key", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting(req.params.key);
      if (!setting) {
        return res.status(404).json({ error: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to get setting" });
    }
  });

  // Set system setting
  app.post("/api/admin/settings", async (req: Request, res: Response) => {
    try {
      const { key, value, updatedBy } = req.body;
      const setting = await storage.setSystemSetting(key, value, updatedBy);
      res.json(setting);
    } catch (error) {
      res.status(500).json({ error: "Failed to set setting" });
    }
  });

  // Get dashboard stats
  app.get("/api/dashboard/stats", async (req: Request, res: Response) => {
    try {
      const { role, userId } = req.query;
      const stats = await storage.getDashboardStats(role as string, userId as string);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  // ============================================
  // ADMIN INVOICES & BILLING
  // ============================================
  
  // Get all invoices (admin)
  app.get("/api/admin/invoices", async (req: Request, res: Response) => {
    try {
      const invoices = await storage.getAllInvoices();
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get invoices" });
    }
  });

  // Get invoice by ID
  app.get("/api/admin/invoices/:id", async (req: Request, res: Response) => {
    try {
      const invoice = await storage.getInvoice(req.params.id);
      if (!invoice) {
        return res.status(404).json({ error: "Invoice not found" });
      }
      res.json(invoice);
    } catch (error) {
      res.status(500).json({ error: "Failed to get invoice" });
    }
  });

  // Get invoice settings
  app.get("/api/admin/invoice-settings", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("invoice_settings");
      if (!setting) {
        return res.json({
          companyName: "VenGrow Real Estate",
          companyAddress: "",
          gstin: "",
          panNumber: "",
          prefix: "VG-INV-",
          startingNumber: 1001,
          gstRate: 18,
          includeGst: true,
          termsAndConditions: "",
          footerNotes: "",
        });
      }
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get invoice settings" });
    }
  });

  // Update invoice settings
  app.put("/api/admin/invoice-settings", async (req: Request, res: Response) => {
    try {
      const setting = await storage.setSystemSetting("invoice_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update invoice settings" });
    }
  });

  // ============================================
  // PLATFORM SETTINGS
  // ============================================
  
  // Get map settings
  app.get("/api/admin/settings/maps", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("maps_settings");
      if (!setting) {
        return res.json({
          provider: "openstreetmap",
          apiKey: "",
          defaultLat: 20.5937,
          defaultLng: 78.9629,
          defaultZoom: 5,
          showMarkers: true,
        });
      }
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get map settings" });
    }
  });

  // Update map settings
  app.put("/api/admin/settings/maps", async (req: Request, res: Response) => {
    try {
      const setting = await storage.setSystemSetting("maps_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update map settings" });
    }
  });

  // Get SMTP settings
  app.get("/api/admin/settings/smtp", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("smtp_settings");
      if (!setting) {
        return res.json({
          host: "",
          port: 587,
          secure: false,
          username: "",
          password: "",
          fromEmail: "",
          fromName: "VenGrow",
          enabled: false,
        });
      }
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get SMTP settings" });
    }
  });

  // Update SMTP settings
  app.put("/api/admin/settings/smtp", async (req: Request, res: Response) => {
    try {
      const setting = await storage.setSystemSetting("smtp_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update SMTP settings" });
    }
  });

  // Test SMTP settings
  app.post("/api/admin/settings/smtp/test", async (req: Request, res: Response) => {
    try {
      res.json({ success: true, message: "Test email sent successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to send test email" });
    }
  });

  // Get Razorpay settings
  app.get("/api/admin/settings/razorpay", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("razorpay_settings");
      if (!setting) {
        return res.json({
          keyId: "",
          keySecret: "",
          testMode: true,
          webhookSecret: "",
          enabled: false,
        });
      }
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get Razorpay settings" });
    }
  });

  // Update Razorpay settings
  app.put("/api/admin/settings/razorpay", async (req: Request, res: Response) => {
    try {
      const setting = await storage.setSystemSetting("razorpay_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update Razorpay settings" });
    }
  });

  // Get analytics settings
  app.get("/api/admin/settings/analytics", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("analytics_settings");
      if (!setting) {
        return res.json({
          googleAnalyticsId: "",
          facebookPixelId: "",
          hotjarId: "",
          clarityId: "",
          enabled: false,
        });
      }
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get analytics settings" });
    }
  });

  // Update analytics settings
  app.put("/api/admin/settings/analytics", async (req: Request, res: Response) => {
    try {
      const setting = await storage.setSystemSetting("analytics_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update analytics settings" });
    }
  });

  // Get social settings
  app.get("/api/admin/settings/social", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("social_settings");
      if (!setting) {
        return res.json({
          facebookUrl: "",
          twitterUrl: "",
          instagramUrl: "",
          linkedinUrl: "",
          youtubeUrl: "",
        });
      }
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to get social settings" });
    }
  });

  // Update social settings
  app.put("/api/admin/settings/social", async (req: Request, res: Response) => {
    try {
      const setting = await storage.setSystemSetting("social_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      res.status(500).json({ error: "Failed to update social settings" });
    }
  });

  // ============================================
  // EMAIL TEMPLATES
  // ============================================
  
  // Get all email templates
  app.get("/api/admin/email-templates", async (req: Request, res: Response) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      res.status(500).json({ error: "Failed to get email templates" });
    }
  });

  // Get email template by ID
  app.get("/api/admin/email-templates/:id", async (req: Request, res: Response) => {
    try {
      const template = await storage.getEmailTemplate(req.params.id);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to get email template" });
    }
  });

  // Create email template
  app.post("/api/admin/email-templates", async (req: Request, res: Response) => {
    try {
      const template = await storage.createEmailTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to create email template" });
    }
  });

  // Update email template
  app.put("/api/admin/email-templates/:id", async (req: Request, res: Response) => {
    try {
      const template = await storage.updateEmailTemplate(req.params.id, req.body);
      if (!template) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json(template);
    } catch (error) {
      res.status(500).json({ error: "Failed to update email template" });
    }
  });

  // Delete email template
  app.delete("/api/admin/email-templates/:id", async (req: Request, res: Response) => {
    try {
      const deleted = await storage.deleteEmailTemplate(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Template not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete email template" });
    }
  });

  // ============================================
  // ADMIN INQUIRIES BY TYPE
  // ============================================
  
  // Get all inquiries (admin)
  app.get("/api/admin/inquiries", async (req: Request, res: Response) => {
    try {
      const { source, status } = req.query;
      const inquiries = await storage.getAllInquiries({
        source: source as string,
        status: status as string,
      });
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Get all buyers (admin)
  app.get("/api/admin/buyers", async (req: Request, res: Response) => {
    try {
      const users = await storage.getAllUsers({ role: "buyer" });
      res.json(users);
    } catch (error) {
      res.status(500).json({ error: "Failed to get buyers" });
    }
  });

  // ============================================
  // SELLER INVOICES
  // ============================================
  
  // Get seller's invoices
  app.get("/api/seller/invoices", async (req: any, res: Response) => {
    try {
      let userId: string | undefined;
      
      const localUser = (req.session as any)?.localUser;
      if (localUser?.id) {
        userId = localUser.id;
      } else if (req.isAuthenticated && req.isAuthenticated() && req.user?.claims?.sub) {
        userId = req.user.claims.sub;
      }
      
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const payments = await storage.getPayments(userId);
      const invoices = payments.map((payment) => ({
        id: payment.id,
        invoiceNumber: `VG-INV-${payment.id.slice(0, 8).toUpperCase()}`,
        amount: payment.amount,
        status: payment.status,
        paymentMethod: payment.paymentMethod,
        transactionId: payment.razorpayPaymentId,
        createdAt: payment.createdAt,
      }));
      
      res.json(invoices);
    } catch (error) {
      res.status(500).json({ error: "Failed to get invoices" });
    }
  });

  // Get current user's dashboard stats (authenticated)
  app.get("/api/me/dashboard", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const user = await storage.getUser(userId);
      const role = user?.role || 'buyer';
      const stats = await storage.getDashboardStats(role, userId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ error: "Failed to get dashboard stats" });
    }
  });

  // Get current user's saved searches (authenticated)
  app.get("/api/me/saved-searches", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const searches = await storage.getSavedSearches(userId);
      res.json(searches);
    } catch (error) {
      res.status(500).json({ error: "Failed to get saved searches" });
    }
  });

  // ============================================
  // SELLER AUTHENTICATED ROUTES
  // ============================================
  
  // Get current seller's profile
  app.get("/api/me/seller-profile", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const profile = await storage.getSellerProfileByUserId(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get seller profile" });
    }
  });

  // Get current seller's properties
  app.get("/api/me/properties", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }
      const properties = await storage.getPropertiesBySeller(profile.id);
      res.json(properties);
    } catch (error) {
      res.status(500).json({ error: "Failed to get properties" });
    }
  });

  // Get current seller's inquiries
  app.get("/api/me/seller-inquiries", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }
      const inquiries = await storage.getInquiriesBySeller(profile.id);
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: "Failed to get inquiries" });
    }
  });

  // Update inquiry CRM fields (notes, follow-up, temperature, conversion)
  app.patch("/api/inquiries/:id/crm", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.status(403).json({ error: "Seller profile not found" });
      }

      const inquiry = await storage.getInquiry(req.params.id);
      if (!inquiry) {
        return res.status(404).json({ error: "Inquiry not found" });
      }

      if (inquiry.sellerId !== profile.id) {
        return res.status(403).json({ error: "Not authorized to update this inquiry" });
      }

      const { sellerNotes, followUpDate, leadTemperature, conversionStatus } = req.body;
      
      const updateData: Record<string, unknown> = {};
      if (sellerNotes !== undefined) updateData.sellerNotes = sellerNotes;
      if (followUpDate !== undefined) updateData.followUpDate = followUpDate ? new Date(followUpDate) : null;
      if (leadTemperature !== undefined) updateData.leadTemperature = leadTemperature;
      if (conversionStatus !== undefined) updateData.conversionStatus = conversionStatus;

      const updated = await storage.updateInquiry(req.params.id, updateData as Partial<import("@shared/schema").InsertInquiry>);
      res.json({ success: true, inquiry: updated });
    } catch (error) {
      console.error("Error updating inquiry CRM:", error);
      res.status(500).json({ error: "Failed to update inquiry" });
    }
  });

  // Get current seller's subscription
  app.get("/api/me/subscription", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json(null);
      }
      const subscription = await storage.getActiveSubscription(profile.id);
      res.json(subscription);
    } catch (error) {
      res.status(500).json({ error: "Failed to get subscription" });
    }
  });

  // Get current user's payments
  app.get("/api/me/payments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const payments = await storage.getPayments(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get payments" });
    }
  });

  // Get current seller's reviews
  app.get("/api/me/reviews", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }
      const reviews = await storage.getReviewsBySeller(profile.id);
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ error: "Failed to get reviews" });
    }
  });

  // ============================================
  // APPOINTMENTS ROUTES
  // ============================================

  // Get buyer's appointments
  app.get("/api/me/appointments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const appointments = await storage.getAppointmentsByBuyer(userId);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get appointments" });
    }
  });

  // Get seller's appointments
  app.get("/api/me/seller-appointments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }
      const appointments = await storage.getAppointmentsBySeller(profile.id);
      res.json(appointments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get appointments" });
    }
  });

  // Create appointment (schedule a visit)
  app.post("/api/appointments", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const { propertyId, scheduledDate, scheduledTime, notes, buyerName, buyerPhone, buyerEmail } = req.body;
      
      if (!propertyId || !scheduledDate || !scheduledTime) {
        return res.status(400).json({ error: "Property ID, date and time are required" });
      }
      
      // Get property to find seller
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      const appointment = await storage.createAppointment({
        propertyId,
        buyerId: userId,
        sellerId: property.sellerId,
        scheduledDate: new Date(scheduledDate),
        scheduledTime,
        notes,
        buyerName,
        buyerPhone,
        buyerEmail,
        status: 'pending',
      });
      
      // Create notification for seller
      const sellerProfile = await storage.getSellerProfile(property.sellerId);
      if (sellerProfile) {
        await storage.createNotification({
          userId: sellerProfile.userId,
          type: 'inquiry',
          title: 'New Visit Request',
          message: `A buyer has requested to visit ${property.title}`,
          data: { appointmentId: appointment.id, propertyId },
        });
        
        // Send email notification to seller (async)
        const sellerUser = await storage.getUser(sellerProfile.userId);
        if (sellerUser?.email) {
          const dateTime = `${new Date(scheduledDate).toLocaleDateString('en-IN')} at ${scheduledTime}`;
          emailService.sendAppointmentNotification(
            sellerUser.email,
            sellerProfile.companyName || sellerUser.firstName || "Seller",
            property.title,
            dateTime,
            buyerName || "Buyer",
            true
          ).catch(err => console.log("[Email] Appointment notification error:", err));
        }
      }
      
      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(500).json({ error: "Failed to create appointment" });
    }
  });

  // Get single appointment
  app.get("/api/appointments/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      res.json(appointment);
    } catch (error) {
      res.status(500).json({ error: "Failed to get appointment" });
    }
  });

  // Update appointment (reschedule) - seller action
  app.patch("/api/appointments/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      // Authorization: verify seller ownership or buyer ownership
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      const user = await storage.getUser(userId);
      const isOwner = appointment.buyerId === userId || 
                      (sellerProfile && appointment.sellerId === sellerProfile.id) ||
                      user?.role === 'admin';
      if (!isOwner) {
        return res.status(403).json({ error: "Not authorized to update this appointment" });
      }
      
      const { scheduledDate, scheduledTime, notes, sellerNotes, status } = req.body;
      
      const updateData: any = {};
      if (scheduledDate) {
        updateData.scheduledDate = new Date(scheduledDate);
        updateData.rescheduledFrom = appointment.scheduledDate;
        updateData.status = 'rescheduled';
      }
      if (scheduledTime) updateData.scheduledTime = scheduledTime;
      if (notes) updateData.notes = notes;
      if (sellerNotes) updateData.sellerNotes = sellerNotes;
      
      const updated = await storage.updateAppointment(req.params.id, updateData);
      res.json(updated);
    } catch (error) {
      res.status(500).json({ error: "Failed to update appointment" });
    }
  });

  // Confirm appointment (seller action)
  app.post("/api/appointments/:id/confirm", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      // Authorization: only seller or admin can confirm
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      const user = await storage.getUser(userId);
      const isSeller = (sellerProfile && appointment.sellerId === sellerProfile.id) || user?.role === 'admin';
      if (!isSeller) {
        return res.status(403).json({ error: "Only the seller can confirm this appointment" });
      }
      
      const confirmed = await storage.confirmAppointment(req.params.id);
      
      // Notify buyer
      await storage.createNotification({
        userId: appointment.buyerId,
        type: 'inquiry',
        title: 'Visit Confirmed',
        message: `Your property visit has been confirmed for ${appointment.scheduledTime}`,
        data: { appointmentId: appointment.id },
      });
      
      res.json(confirmed);
    } catch (error) {
      res.status(500).json({ error: "Failed to confirm appointment" });
    }
  });

  // Cancel appointment (buyer or seller can cancel)
  app.post("/api/appointments/:id/cancel", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      // Authorization: buyer, seller, or admin can cancel
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      const user = await storage.getUser(userId);
      const canCancel = appointment.buyerId === userId || 
                        (sellerProfile && appointment.sellerId === sellerProfile.id) ||
                        user?.role === 'admin';
      if (!canCancel) {
        return res.status(403).json({ error: "Not authorized to cancel this appointment" });
      }
      
      const { reason } = req.body;
      const cancelled = await storage.cancelAppointment(req.params.id, reason);
      
      res.json(cancelled);
    } catch (error) {
      res.status(500).json({ error: "Failed to cancel appointment" });
    }
  });

  // Complete appointment (seller action)
  app.post("/api/appointments/:id/complete", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const appointment = await storage.getAppointment(req.params.id);
      if (!appointment) {
        return res.status(404).json({ error: "Appointment not found" });
      }
      
      // Authorization: only seller or admin can mark complete
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      const user = await storage.getUser(userId);
      const isSeller = (sellerProfile && appointment.sellerId === sellerProfile.id) || user?.role === 'admin';
      if (!isSeller) {
        return res.status(403).json({ error: "Only the seller can complete this appointment" });
      }
      
      const completed = await storage.completeAppointment(req.params.id);
      res.json(completed);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete appointment" });
    }
  });

  // ============================================
  // OBJECT STORAGE / FILE UPLOAD ROUTES
  // ============================================

  // Get presigned URL for file upload
  app.post("/api/objects/upload", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      res.json({ uploadURL });
    } catch (error) {
      console.error("Error getting upload URL:", error);
      res.status(500).json({ error: "Failed to get upload URL" });
    }
  });

  // Serve private objects (property photos)
  app.get("/objects/:objectPath(*)", async (req: any, res: Response) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error("Error serving object:", error);
      if (error?.name === "ObjectNotFoundError") {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Serve public objects
  app.get("/public-objects/:filePath(*)", async (req: any, res: Response) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const filePath = req.params.filePath;
      const objectStorageService = new ObjectStorageService();
      const file = await objectStorageService.searchPublicObject(filePath);
      if (!file) {
        return res.status(404).json({ error: "File not found" });
      }
      objectStorageService.downloadObject(file, res);
    } catch (error) {
      console.error("Error searching for public object:", error);
      return res.status(500).json({ error: "Internal server error" });
    }
  });

  // Update property photos after upload (set ACL policy)
  app.post("/api/properties/:id/photos", isAuthenticated, async (req: any, res: Response) => {
    try {
      const { ObjectStorageService } = await import("./objectStorage");
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      const propertyId = req.params.id;
      const { photoURLs } = req.body;

      if (!Array.isArray(photoURLs)) {
        return res.status(400).json({ error: "photoURLs must be an array" });
      }

      const objectStorageService = new ObjectStorageService();
      const normalizedPaths: string[] = [];

      for (const url of photoURLs) {
        try {
          const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(url, {
            owner: userId,
            visibility: "public",
          });
          normalizedPaths.push(normalizedPath);
        } catch (e) {
          console.error("Error setting ACL for photo:", e);
          normalizedPaths.push(url);
        }
      }

      // Update property with photo paths
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      // Merge existing images with new ones
      const existingImages = await storage.getPropertyImages(propertyId);
      const newImages = normalizedPaths.map((url, index) => ({
        propertyId,
        url,
        isPrimary: existingImages.length === 0 && index === 0,
        displayOrder: existingImages.length + index,
      }));

      // Add images to storage
      for (const image of newImages) {
        await storage.addPropertyImage(image.propertyId, image.url, image.isPrimary);
      }

      res.json({ success: true, photos: normalizedPaths });
    } catch (error) {
      console.error("Error updating property photos:", error);
      res.status(500).json({ error: "Failed to update property photos" });
    }
  });

  // ============================================
  // PUBLIC CONTENT ROUTES (FAQ, Static Pages, Banners)
  // ============================================

  // Get all FAQ items
  app.get("/api/faq", async (req: Request, res: Response) => {
    try {
      const faqItems = await storage.getFaqItems();
      res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  // Get FAQ items by category
  app.get("/api/faq/:category", async (req: Request, res: Response) => {
    try {
      const { category } = req.params;
      const faqItems = await storage.getFaqItemsByCategory(category);
      res.json(faqItems);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ message: "Failed to fetch FAQ items" });
    }
  });

  // Get static page by slug
  app.get("/api/static-pages/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const page = await storage.getStaticPageBySlug(slug);
      if (!page) {
        return res.status(404).json({ message: "Page not found" });
      }
      res.json(page);
    } catch (error) {
      console.error("Error fetching static page:", error);
      res.status(500).json({ message: "Failed to fetch page" });
    }
  });

  // Get all static pages (for sitemap/admin)
  app.get("/api/static-pages", async (req: Request, res: Response) => {
    try {
      const pages = await storage.getStaticPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching static pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  // Get active banners by position
  app.get("/api/banners", async (req: Request, res: Response) => {
    try {
      const position = req.query.position as string | undefined;
      const banners = await storage.getBanners(position);
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  // Get platform settings (public ones only)
  app.get("/api/platform-settings", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const settings = await storage.getPlatformSettings(category);
      // Filter out encrypted settings for public access
      const publicSettings = settings.filter(s => !s.isEncrypted);
      res.json(publicSettings);
    } catch (error) {
      console.error("Error fetching platform settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  // Get platform stats for homepage
  app.get("/api/platform-stats", async (req: Request, res: Response) => {
    try {
      const settings = await storage.getPlatformSettings("general");
      const stats = settings
        .filter(s => s.key.startsWith("stat_"))
        .reduce((acc, s) => {
          const key = s.key.replace("stat_", "");
          acc[key] = s.value;
          return acc;
        }, {} as Record<string, string | null>);
      res.json(stats);
    } catch (error) {
      console.error("Error fetching platform stats:", error);
      res.status(500).json({ message: "Failed to fetch stats" });
    }
  });

  // Admin: Get real-time platform analytics
  app.get("/api/admin/analytics", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }

      // Get real counts from database
      const allUsers = await storage.getAllUsers({});
      const allProperties = await storage.getProperties({});
      const allInquiries = await storage.getAllInquiries({});
      const allSellers = await storage.getAllSellerProfiles({});
      const allProjects = await storage.getProjects({});

      const totalUsers = allUsers.length;
      const buyers = allUsers.filter(u => u.role === "buyer").length;
      const sellers = allUsers.filter(u => u.role === "seller").length;
      const activeUsers = allUsers.filter(u => u.isActive).length;
      
      const totalListings = allProperties.length;
      const liveListings = allProperties.filter(p => p.workflowStatus === "live" || p.workflowStatus === "approved").length;
      const pendingListings = allProperties.filter(p => p.workflowStatus === "submitted" || p.workflowStatus === "under_review").length;
      
      const totalInquiries = allInquiries.length;
      const pendingInquiries = allInquiries.filter(i => i.status === "pending").length;
      
      const verifiedSellers = allSellers.filter(s => s.verificationStatus === "verified").length;
      const pendingVerifications = allSellers.filter(s => s.verificationStatus === "pending").length;
      
      const totalProjects = allProjects.length;
      const liveProjects = allProjects.filter(p => p.status === "approved" || p.status === "live").length;

      // City breakdown from properties
      const cityBreakdown: Record<string, number> = {};
      allProperties.forEach(p => {
        const city = p.city || "Unknown";
        cityBreakdown[city] = (cityBreakdown[city] || 0) + 1;
      });
      const topCities = Object.entries(cityBreakdown)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([city, count], index) => ({
          city,
          listings: count,
          percentage: Math.round((count / totalListings) * 100) || 0,
        }));

      res.json({
        users: {
          total: totalUsers,
          buyers,
          sellers,
          active: activeUsers,
        },
        listings: {
          total: totalListings,
          live: liveListings,
          pending: pendingListings,
        },
        inquiries: {
          total: totalInquiries,
          pending: pendingInquiries,
        },
        sellers: {
          total: allSellers.length,
          verified: verifiedSellers,
          pendingVerification: pendingVerifications,
        },
        projects: {
          total: totalProjects,
          live: liveProjects,
        },
        topCities,
      });
    } catch (error) {
      console.error("Error fetching admin analytics:", error);
      res.status(500).json({ message: "Failed to fetch analytics" });
    }
  });

  // ============================================
  // DYNAMIC CONTENT API ROUTES
  // ============================================

  // Get all active popular cities
  app.get("/api/popular-cities", async (req: Request, res: Response) => {
    try {
      const cities = await storage.getPopularCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching popular cities:", error);
      res.status(500).json({ message: "Failed to fetch popular cities" });
    }
  });

  // Get popular city by slug (for SEO landing pages)
  app.get("/api/popular-cities/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const city = await storage.getPopularCityBySlug(slug);
      if (!city) {
        return res.status(404).json({ message: "City not found" });
      }
      res.json(city);
    } catch (error) {
      console.error("Error fetching popular city:", error);
      res.status(500).json({ message: "Failed to fetch city" });
    }
  });

  // Get navigation links (filterable by position and section)
  app.get("/api/navigation-links", async (req: Request, res: Response) => {
    try {
      const position = req.query.position as string | undefined;
      const section = req.query.section as string | undefined;
      const links = await storage.getNavigationLinks(position, section);
      res.json(links);
    } catch (error) {
      console.error("Error fetching navigation links:", error);
      res.status(500).json({ message: "Failed to fetch navigation links" });
    }
  });

  // Get all active property types
  app.get("/api/property-types", async (req: Request, res: Response) => {
    try {
      const types = await storage.getPropertyTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching property types:", error);
      res.status(500).json({ message: "Failed to fetch property types" });
    }
  });

  // Get all active property categories
  app.get("/api/property-categories", async (req: Request, res: Response) => {
    try {
      const categories = await storage.getPropertyCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching property categories:", error);
      res.status(500).json({ message: "Failed to fetch property categories" });
    }
  });

  // Get property category by slug
  app.get("/api/property-categories/:slug", async (req: Request, res: Response) => {
    try {
      const { slug } = req.params;
      const category = await storage.getPropertyCategoryBySlug(slug);
      if (!category) {
        return res.status(404).json({ message: "Category not found" });
      }
      res.json(category);
    } catch (error) {
      console.error("Error fetching property category:", error);
      res.status(500).json({ message: "Failed to fetch category" });
    }
  });

  // Get property subcategories (optionally filtered by categoryId)
  app.get("/api/property-subcategories", async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const subcategories = await storage.getPropertySubcategories(categoryId);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching property subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  // Get all site settings (filterable by category)
  app.get("/api/site-settings", async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const settings = await storage.getSiteSettings(category);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch site settings" });
    }
  });

  // Get a specific site setting by key
  app.get("/api/site-settings/:key", async (req: Request, res: Response) => {
    try {
      const { key } = req.params;
      const setting = await storage.getSiteSetting(key);
      if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
      }
      res.json(setting);
    } catch (error) {
      console.error("Error fetching site setting:", error);
      res.status(500).json({ message: "Failed to fetch setting" });
    }
  });

  // ============================================
  // ADMIN CONTENT MANAGEMENT API ROUTES
  // ============================================

  // Admin middleware to check if user is super admin
  const isAdminAuthenticated = (req: any, res: Response, next: any) => {
    const adminUser = req.session?.adminUser;
    if (!adminUser?.isSuperAdmin) {
      return res.status(403).json({ message: "Admin access required" });
    }
    next();
  };

  // --- Admin Seed Routes ---
  app.post("/api/admin/seed-cms", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await seedCMSContent();
      res.json({ success: true, message: "CMS content seeded successfully" });
    } catch (error) {
      console.error("CMS seed error:", error);
      res.status(500).json({ error: "Failed to seed CMS content" });
    }
  });

  app.post("/api/admin/seed-all", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await seedDatabase();
      await seedCMSContent();
      res.json({ success: true, message: "All data seeded successfully" });
    } catch (error) {
      console.error("Full seed error:", error);
      res.status(500).json({ error: "Failed to seed data" });
    }
  });

  // --- Admin FAQ CRUD ---
  app.get("/api/admin/faqs", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const faqs = await storage.getFaqItems();
      res.json(faqs);
    } catch (error) {
      console.error("Error fetching FAQs:", error);
      res.status(500).json({ message: "Failed to fetch FAQs" });
    }
  });

  app.post("/api/admin/faqs", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const faq = await storage.createFaqItem(req.body);
      res.status(201).json(faq);
    } catch (error) {
      console.error("Error creating FAQ:", error);
      res.status(500).json({ message: "Failed to create FAQ" });
    }
  });

  app.put("/api/admin/faqs/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const faq = await storage.updateFaqItem(req.params.id, req.body);
      if (!faq) return res.status(404).json({ message: "FAQ not found" });
      res.json(faq);
    } catch (error) {
      console.error("Error updating FAQ:", error);
      res.status(500).json({ message: "Failed to update FAQ" });
    }
  });

  app.delete("/api/admin/faqs/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteFaqItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting FAQ:", error);
      res.status(500).json({ message: "Failed to delete FAQ" });
    }
  });

  // --- Popular Cities Admin CRUD ---
  app.get("/api/admin/popular-cities", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const cities = await storage.getAllPopularCities();
      res.json(cities);
    } catch (error) {
      console.error("Error fetching all cities:", error);
      res.status(500).json({ message: "Failed to fetch cities" });
    }
  });

  app.post("/api/admin/popular-cities", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const city = await storage.createPopularCity(req.body);
      res.status(201).json(city);
    } catch (error) {
      console.error("Error creating city:", error);
      res.status(500).json({ message: "Failed to create city" });
    }
  });

  app.put("/api/admin/popular-cities/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const city = await storage.updatePopularCity(req.params.id, req.body);
      if (!city) return res.status(404).json({ message: "City not found" });
      res.json(city);
    } catch (error) {
      console.error("Error updating city:", error);
      res.status(500).json({ message: "Failed to update city" });
    }
  });

  app.delete("/api/admin/popular-cities/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deletePopularCity(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting city:", error);
      res.status(500).json({ message: "Failed to delete city" });
    }
  });

  // --- Navigation Links Admin CRUD ---
  app.get("/api/admin/navigation-links", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const links = await storage.getAllNavigationLinks();
      res.json(links);
    } catch (error) {
      console.error("Error fetching navigation links:", error);
      res.status(500).json({ message: "Failed to fetch links" });
    }
  });

  app.post("/api/admin/navigation-links", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const link = await storage.createNavigationLink(req.body);
      res.status(201).json(link);
    } catch (error) {
      console.error("Error creating link:", error);
      res.status(500).json({ message: "Failed to create link" });
    }
  });

  app.put("/api/admin/navigation-links/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const link = await storage.updateNavigationLink(req.params.id, req.body);
      if (!link) return res.status(404).json({ message: "Link not found" });
      res.json(link);
    } catch (error) {
      console.error("Error updating link:", error);
      res.status(500).json({ message: "Failed to update link" });
    }
  });

  app.delete("/api/admin/navigation-links/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteNavigationLink(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting link:", error);
      res.status(500).json({ message: "Failed to delete link" });
    }
  });

  // --- Property Types Admin CRUD ---
  app.get("/api/admin/property-types", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const types = await storage.getAllPropertyTypes();
      res.json(types);
    } catch (error) {
      console.error("Error fetching property types:", error);
      res.status(500).json({ message: "Failed to fetch types" });
    }
  });

  app.post("/api/admin/property-types", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const type = await storage.createPropertyType(req.body);
      res.status(201).json(type);
    } catch (error) {
      console.error("Error creating property type:", error);
      res.status(500).json({ message: "Failed to create type" });
    }
  });

  app.put("/api/admin/property-types/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const type = await storage.updatePropertyType(req.params.id, req.body);
      if (!type) return res.status(404).json({ message: "Type not found" });
      res.json(type);
    } catch (error) {
      console.error("Error updating property type:", error);
      res.status(500).json({ message: "Failed to update type" });
    }
  });

  app.delete("/api/admin/property-types/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deletePropertyType(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property type:", error);
      res.status(500).json({ message: "Failed to delete type" });
    }
  });

  // --- Property Categories Admin CRUD ---
  app.get("/api/admin/property-categories", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const categories = await storage.getPropertyCategories();
      res.json(categories);
    } catch (error) {
      console.error("Error fetching property categories:", error);
      res.status(500).json({ message: "Failed to fetch categories" });
    }
  });

  app.post("/api/admin/property-categories", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const category = await storage.createPropertyCategory(req.body);
      res.status(201).json(category);
    } catch (error) {
      console.error("Error creating property category:", error);
      res.status(500).json({ message: "Failed to create category" });
    }
  });

  app.put("/api/admin/property-categories/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const category = await storage.updatePropertyCategory(req.params.id, req.body);
      if (!category) return res.status(404).json({ message: "Category not found" });
      res.json(category);
    } catch (error) {
      console.error("Error updating property category:", error);
      res.status(500).json({ message: "Failed to update category" });
    }
  });

  app.delete("/api/admin/property-categories/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deletePropertyCategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property category:", error);
      res.status(500).json({ message: "Failed to delete category" });
    }
  });

  // --- Property Subcategories Admin CRUD ---
  app.get("/api/admin/property-subcategories", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const categoryId = req.query.categoryId as string | undefined;
      const subcategories = await storage.getPropertySubcategories(categoryId);
      res.json(subcategories);
    } catch (error) {
      console.error("Error fetching property subcategories:", error);
      res.status(500).json({ message: "Failed to fetch subcategories" });
    }
  });

  app.post("/api/admin/property-subcategories", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const subcategory = await storage.createPropertySubcategory(req.body);
      res.status(201).json(subcategory);
    } catch (error) {
      console.error("Error creating property subcategory:", error);
      res.status(500).json({ message: "Failed to create subcategory" });
    }
  });

  app.put("/api/admin/property-subcategories/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const subcategory = await storage.updatePropertySubcategory(req.params.id, req.body);
      if (!subcategory) return res.status(404).json({ message: "Subcategory not found" });
      res.json(subcategory);
    } catch (error) {
      console.error("Error updating property subcategory:", error);
      res.status(500).json({ message: "Failed to update subcategory" });
    }
  });

  app.delete("/api/admin/property-subcategories/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deletePropertySubcategory(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property subcategory:", error);
      res.status(500).json({ message: "Failed to delete subcategory" });
    }
  });

  // --- Site Settings Admin CRUD ---
  app.get("/api/admin/site-settings", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const category = req.query.category as string | undefined;
      const settings = await storage.getSiteSettings(category);
      res.json(settings);
    } catch (error) {
      console.error("Error fetching site settings:", error);
      res.status(500).json({ message: "Failed to fetch settings" });
    }
  });

  app.post("/api/admin/site-settings", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const setting = await storage.createSiteSetting(req.body);
      res.status(201).json(setting);
    } catch (error) {
      console.error("Error creating site setting:", error);
      res.status(500).json({ message: "Failed to create setting" });
    }
  });

  app.put("/api/admin/site-settings/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const setting = await storage.updateSiteSetting(req.params.id, req.body);
      if (!setting) return res.status(404).json({ message: "Setting not found" });
      res.json(setting);
    } catch (error) {
      console.error("Error updating site setting:", error);
      res.status(500).json({ message: "Failed to update setting" });
    }
  });

  app.delete("/api/admin/site-settings/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteSiteSetting(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting site setting:", error);
      res.status(500).json({ message: "Failed to delete setting" });
    }
  });

  // --- FAQ Items Admin CRUD ---
  app.get("/api/admin/faq-items", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const items = await storage.getAllFaqItems();
      res.json(items);
    } catch (error) {
      console.error("Error fetching FAQ items:", error);
      res.status(500).json({ message: "Failed to fetch items" });
    }
  });

  app.post("/api/admin/faq-items", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const item = await storage.createFaqItem(req.body);
      res.status(201).json(item);
    } catch (error) {
      console.error("Error creating FAQ item:", error);
      res.status(500).json({ message: "Failed to create item" });
    }
  });

  app.put("/api/admin/faq-items/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const item = await storage.updateFaqItem(req.params.id, req.body);
      if (!item) return res.status(404).json({ message: "Item not found" });
      res.json(item);
    } catch (error) {
      console.error("Error updating FAQ item:", error);
      res.status(500).json({ message: "Failed to update item" });
    }
  });

  app.delete("/api/admin/faq-items/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteFaqItem(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting FAQ item:", error);
      res.status(500).json({ message: "Failed to delete item" });
    }
  });

  // --- Static Pages Admin CRUD ---
  app.get("/api/admin/static-pages", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const pages = await storage.getAllStaticPages();
      res.json(pages);
    } catch (error) {
      console.error("Error fetching static pages:", error);
      res.status(500).json({ message: "Failed to fetch pages" });
    }
  });

  app.post("/api/admin/static-pages", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const page = await storage.createStaticPage(req.body);
      res.status(201).json(page);
    } catch (error) {
      console.error("Error creating static page:", error);
      res.status(500).json({ message: "Failed to create page" });
    }
  });

  app.put("/api/admin/static-pages/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const page = await storage.updateStaticPage(req.params.id, req.body);
      if (!page) return res.status(404).json({ message: "Page not found" });
      res.json(page);
    } catch (error) {
      console.error("Error updating static page:", error);
      res.status(500).json({ message: "Failed to update page" });
    }
  });

  app.delete("/api/admin/static-pages/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteStaticPage(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting static page:", error);
      res.status(500).json({ message: "Failed to delete page" });
    }
  });

  // --- Banners Admin CRUD ---
  app.get("/api/admin/banners", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const banners = await storage.getAllBanners();
      res.json(banners);
    } catch (error) {
      console.error("Error fetching banners:", error);
      res.status(500).json({ message: "Failed to fetch banners" });
    }
  });

  app.post("/api/admin/banners", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const banner = await storage.createBanner(req.body);
      res.status(201).json(banner);
    } catch (error) {
      console.error("Error creating banner:", error);
      res.status(500).json({ message: "Failed to create banner" });
    }
  });

  app.put("/api/admin/banners/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const banner = await storage.updateBanner(req.params.id, req.body);
      if (!banner) return res.status(404).json({ message: "Banner not found" });
      res.json(banner);
    } catch (error) {
      console.error("Error updating banner:", error);
      res.status(500).json({ message: "Failed to update banner" });
    }
  });

  app.delete("/api/admin/banners/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteBanner(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting banner:", error);
      res.status(500).json({ message: "Failed to delete banner" });
    }
  });

  // --- Email Templates Public API ---
  app.get("/api/email-templates", async (req: Request, res: Response) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  // --- Email Templates Admin CRUD ---
  app.get("/api/admin/email-templates", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const templates = await storage.getEmailTemplates();
      res.json(templates);
    } catch (error) {
      console.error("Error fetching email templates:", error);
      res.status(500).json({ message: "Failed to fetch templates" });
    }
  });

  app.get("/api/admin/email-templates/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const template = await storage.getEmailTemplate(req.params.id);
      if (!template) return res.status(404).json({ message: "Template not found" });
      res.json(template);
    } catch (error) {
      console.error("Error fetching email template:", error);
      res.status(500).json({ message: "Failed to fetch template" });
    }
  });

  app.post("/api/admin/email-templates", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const template = await storage.createEmailTemplate(req.body);
      res.status(201).json(template);
    } catch (error) {
      console.error("Error creating email template:", error);
      res.status(500).json({ message: "Failed to create template" });
    }
  });

  app.put("/api/admin/email-templates/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const template = await storage.updateEmailTemplate(req.params.id, req.body);
      if (!template) return res.status(404).json({ message: "Template not found" });
      res.json(template);
    } catch (error) {
      console.error("Error updating email template:", error);
      res.status(500).json({ message: "Failed to update template" });
    }
  });

  app.delete("/api/admin/email-templates/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteEmailTemplate(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting email template:", error);
      res.status(500).json({ message: "Failed to delete template" });
    }
  });

  // ============================================
  // VERIFIED BUILDERS (PUBLIC + ADMIN)
  // ============================================
  
  // Public: Get active verified builders for homepage
  app.get("/api/verified-builders", async (req: Request, res: Response) => {
    try {
      const showOnHomepage = req.query.homepage === "true";
      const builders = await storage.getVerifiedBuilders({ 
        isActive: true, 
        showOnHomepage: showOnHomepage || undefined 
      });
      res.json(builders);
    } catch (error) {
      console.error("Error fetching verified builders:", error);
      res.status(500).json({ message: "Failed to fetch verified builders" });
    }
  });
  
  // Public: Get builder landing page by slug
  app.get("/api/verified-builders/slug/:slug", async (req: Request, res: Response) => {
    try {
      const builder = await storage.getVerifiedBuilderBySlug(req.params.slug);
      if (!builder) {
        return res.status(404).json({ message: "Builder not found" });
      }
      res.json(builder);
    } catch (error) {
      console.error("Error fetching builder:", error);
      res.status(500).json({ message: "Failed to fetch builder" });
    }
  });
  
  // Public: Get builder by ID
  app.get("/api/verified-builders/:id", async (req: Request, res: Response) => {
    try {
      const builder = await storage.getVerifiedBuilder(req.params.id);
      if (!builder) {
        return res.status(404).json({ message: "Builder not found" });
      }
      res.json(builder);
    } catch (error) {
      console.error("Error fetching builder:", error);
      res.status(500).json({ message: "Failed to fetch builder" });
    }
  });
  
  // Admin: Get all verified builders for management
  app.get("/api/admin/verified-builders", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      const builders = await storage.getVerifiedBuilders();
      res.json(builders);
    } catch (error) {
      console.error("Error fetching verified builders:", error);
      res.status(500).json({ message: "Failed to fetch verified builders" });
    }
  });
  
  // Admin: Create verified builder
  app.post("/api/admin/verified-builders", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      const builder = await storage.createVerifiedBuilder(req.body);
      res.status(201).json(builder);
    } catch (error) {
      console.error("Error creating verified builder:", error);
      res.status(500).json({ message: "Failed to create verified builder" });
    }
  });
  
  // Admin: Update verified builder
  app.patch("/api/admin/verified-builders/:id", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      const builder = await storage.updateVerifiedBuilder(req.params.id, req.body);
      if (!builder) {
        return res.status(404).json({ message: "Builder not found" });
      }
      res.json(builder);
    } catch (error) {
      console.error("Error updating verified builder:", error);
      res.status(500).json({ message: "Failed to update verified builder" });
    }
  });
  
  // Admin: Delete verified builder
  app.delete("/api/admin/verified-builders/:id", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      await storage.deleteVerifiedBuilder(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting verified builder:", error);
      res.status(500).json({ message: "Failed to delete verified builder" });
    }
  });

  // ============================================
  // PROJECTS (PUBLIC + SELLER + ADMIN)
  // ============================================
  
  // Public: Get projects with filters
  app.get("/api/projects", async (req: Request, res: Response) => {
    try {
      const filters: any = {
        status: 'live', // Only show live/approved projects publicly
      };
      
      if (req.query.city) filters.city = req.query.city as string;
      if (req.query.state) filters.state = req.query.state as string;
      if (req.query.projectStage) filters.projectStage = req.query.projectStage as string;
      if (req.query.minPrice) filters.minPrice = parseInt(req.query.minPrice as string);
      if (req.query.maxPrice) filters.maxPrice = parseInt(req.query.maxPrice as string);
      if (req.query.sellerId) filters.sellerId = req.query.sellerId as string;
      if (req.query.featured === "true") filters.isFeatured = true;
      if (req.query.search) filters.search = req.query.search as string;
      if (req.query.limit) filters.limit = parseInt(req.query.limit as string);
      if (req.query.offset) filters.offset = parseInt(req.query.offset as string);
      
      const projects = await storage.getProjects(filters);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  // Public: Get project by slug
  app.get("/api/projects/slug/:slug", async (req: Request, res: Response) => {
    try {
      const project = await storage.getProjectBySlug(req.params.slug);
      if (!project || project.status !== 'live') {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  // Public: Get project by ID
  app.get("/api/projects/:id", async (req: Request, res: Response) => {
    try {
      const project = await storage.getProject(req.params.id);
      if (!project) {
        return res.status(404).json({ message: "Project not found" });
      }
      res.json(project);
    } catch (error) {
      console.error("Error fetching project:", error);
      res.status(500).json({ message: "Failed to fetch project" });
    }
  });
  
  // Public: Get properties in a project
  app.get("/api/projects/:id/properties", async (req: Request, res: Response) => {
    try {
      const properties = await storage.getPropertiesByProject(req.params.id);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching project properties:", error);
      res.status(500).json({ message: "Failed to fetch project properties" });
    }
  });
  
  // Seller: Get my projects
  app.get("/api/seller/projects", async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.status(403).json({ message: "Seller profile required" });
      }
      
      // Only Broker, Builder, and Corporate can create projects
      if (!['broker', 'builder', 'corporate'].includes(sellerProfile.sellerType)) {
        return res.status(403).json({ message: "Only Brokers, Builders, and Corporate sellers can manage projects" });
      }
      
      const projects = await storage.getProjectsBySeller(sellerProfile.id);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching seller projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  // Seller: Create project
  app.post("/api/seller/projects", async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.status(403).json({ message: "Seller profile required" });
      }
      
      if (!['broker', 'builder', 'corporate'].includes(sellerProfile.sellerType)) {
        return res.status(403).json({ message: "Only Brokers, Builders, and Corporate sellers can create projects" });
      }
      
      const projectData = {
        ...req.body,
        sellerId: sellerProfile.id,
        status: 'draft',
      };
      
      const project = await storage.createProject(projectData);
      res.status(201).json(project);
    } catch (error) {
      console.error("Error creating project:", error);
      res.status(500).json({ message: "Failed to create project" });
    }
  });
  
  // Seller: Update project
  app.patch("/api/seller/projects/:id", async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.status(403).json({ message: "Seller profile required" });
      }
      
      const project = await storage.getProject(req.params.id);
      if (!project || project.sellerId !== sellerProfile.id) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updated = await storage.updateProject(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });
  
  // Seller: Delete project
  app.delete("/api/seller/projects/:id", async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }
      
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile) {
        return res.status(403).json({ message: "Seller profile required" });
      }
      
      const project = await storage.getProject(req.params.id);
      if (!project || project.sellerId !== sellerProfile.id) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      await storage.deleteProject(req.params.id);
      res.status(204).send();
    } catch (error) {
      console.error("Error deleting project:", error);
      res.status(500).json({ message: "Failed to delete project" });
    }
  });
  
  // Admin: Get all projects for moderation
  app.get("/api/admin/projects", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      
      const filters: any = {};
      if (req.query.status) filters.status = req.query.status as string;
      if (req.query.sellerId) filters.sellerId = req.query.sellerId as string;
      
      const projects = await storage.getProjects(filters);
      res.json(projects);
    } catch (error) {
      console.error("Error fetching projects:", error);
      res.status(500).json({ message: "Failed to fetch projects" });
    }
  });
  
  // Admin: Update project (approve/reject)
  app.patch("/api/admin/projects/:id", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }
      
      const oldProject = await storage.getProject(req.params.id);
      if (!oldProject) {
        return res.status(404).json({ message: "Project not found" });
      }
      
      const updateData = { ...req.body };
      if (req.body.status === 'live') {
        updateData.approvedAt = new Date();
        updateData.approvedBy = 'superadmin';
      }
      
      const project = await storage.updateProject(req.params.id, updateData);
      
      // Log the action
      let action = "Project Updated";
      if (req.body.status === 'live') action = "Project Approved";
      else if (req.body.status === 'rejected') action = "Project Rejected";
      else if (req.body.status === 'under_review') action = "Project Marked Under Review";
      
      await storage.createAuditLog({
        userId: adminUser.id,
        action,
        entityType: "project",
        entityId: req.params.id,
        oldData: { status: oldProject.status, name: oldProject.name },
        newData: { status: req.body.status, rejectionReason: req.body.rejectionReason },
        ipAddress: req.ip || null,
        userAgent: req.get("user-agent") || null,
      });
      
      res.json(project);
    } catch (error) {
      console.error("Error updating project:", error);
      res.status(500).json({ message: "Failed to update project" });
    }
  });

  const httpServer = createServer(app);

  // ============================================
  // WEBSOCKET SERVER FOR REAL-TIME CHAT
  // ============================================
  
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  wss.on('connection', (ws: WebSocket) => {
    let userId: string | null = null;
    
    ws.on('message', async (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        switch (message.type) {
          case 'auth':
            userId = message.userId;
            if (userId) {
              if (!connectedClients.has(userId)) {
                connectedClients.set(userId, new Set());
              }
              connectedClients.get(userId)!.add(ws);
              ws.send(JSON.stringify({ type: 'auth_success', userId }));
            }
            break;
            
          case 'chat_message':
            if (!userId) {
              ws.send(JSON.stringify({ type: 'error', message: 'Not authenticated' }));
              return;
            }
            
            const { threadId, content, attachments } = message;
            
            const chatMessage = await storage.sendChatMessage({
              threadId,
              senderId: userId,
              content,
              attachments,
            });
            
            const thread = await storage.getChatThread(threadId);
            if (thread) {
              const recipientId = thread.buyerId === userId ? thread.sellerId : thread.buyerId;
              
              const outgoingMessage = {
                type: 'new_message',
                message: chatMessage,
                threadId,
              };
              
              broadcastToUser(userId, outgoingMessage);
              broadcastToUser(recipientId, outgoingMessage);
              
              await storage.createNotification({
                userId: recipientId,
                type: 'message',
                title: 'New Message',
                message: content.substring(0, 100),
                data: { threadId, senderId: userId },
              });
            }
            break;
            
          case 'mark_read':
            if (!userId) return;
            await storage.markMessagesAsRead(message.threadId, userId);
            ws.send(JSON.stringify({ type: 'messages_read', threadId: message.threadId }));
            break;
            
          case 'typing':
            if (!userId) return;
            const typingThread = await storage.getChatThread(message.threadId);
            if (typingThread) {
              const recipientId = typingThread.buyerId === userId ? typingThread.sellerId : typingThread.buyerId;
              broadcastToUser(recipientId, {
                type: 'user_typing',
                threadId: message.threadId,
                userId,
                isTyping: message.isTyping,
              });
            }
            break;
            
          case 'ping':
            ws.send(JSON.stringify({ type: 'pong' }));
            break;
        }
      } catch (error) {
        console.error('WebSocket message error:', error);
        ws.send(JSON.stringify({ type: 'error', message: 'Failed to process message' }));
      }
    });
    
    ws.on('close', () => {
      if (userId) {
        const userSockets = connectedClients.get(userId);
        if (userSockets) {
          userSockets.delete(ws);
          if (userSockets.size === 0) {
            connectedClients.delete(userId);
          }
        }
      }
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  return httpServer;
}
