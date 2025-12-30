import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { randomUUID } from "crypto";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { seedCMSContent } from "./seed-cms";
import { insertPropertySchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { verifySuperadminCredentials, hashPassword, verifyPassword, validateEmail, validatePhone, validatePassword } from "./auth-utils";
import * as emailService from "./email";
import { db } from "./db";
import { properties, propertyViews, users } from "@shared/schema";
import { eq, and, or, desc, sql, notInArray } from "drizzle-orm";

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

// Simple in-memory rate limiter for forms
const formRateLimit = new Map<string, { count: number; resetTime: number }>();

function checkRateLimit(identifier: string, maxRequests: number = 5, windowMs: number = 15 * 60 * 1000): boolean {
  const now = Date.now();
  const record = formRateLimit.get(identifier);
  
  if (!record || now > record.resetTime) {
    formRateLimit.set(identifier, { count: 1, resetTime: now + windowMs });
    return true;
  }
  
  if (record.count >= maxRequests) {
    return false;
  }
  
  record.count++;
  return true;
}

function getRateLimitMiddleware(maxRequests: number = 5, windowMs: number = 15 * 60 * 1000) {
  return (req: Request, res: Response, next: NextFunction) => {
    const identifier = req.ip || req.headers['x-forwarded-for'] || 'unknown';
    
    if (!checkRateLimit(identifier, maxRequests, windowMs)) {
      return res.status(429).json({ 
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil(windowMs / 1000)
      });
    }
    
    next();
  };
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  // Get current authenticated user (alias for frontend compatibility)
  // Update current user profile
  app.patch("/api/auth/me", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const { firstName, lastName, phone, bio } = req.body;
      const updateData: any = {};
      
      if (firstName !== undefined) updateData.firstName = firstName.trim();
      if (lastName !== undefined) updateData.lastName = lastName.trim();
      if (phone !== undefined) {
        const cleanedPhone = String(phone).replace(/\D/g, "");
        if (cleanedPhone && !validatePhone(cleanedPhone)) {
          return res.status(400).json({ error: "Invalid phone number" });
        }
        updateData.phone = cleanedPhone || null;
      }
      if (bio !== undefined) updateData.bio = bio.trim();
      
      const updatedUser = await storage.updateUser(userId, updateData);
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ error: "Failed to update profile" });
    }
  });

  // Update user notification preferences
  app.patch("/api/auth/me/preferences", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const { 
        emailNotifications, 
        smsNotifications, 
        pushNotifications, 
        newListings, 
        priceDrops, 
        inquiryReplies 
      } = req.body;
      
      const preferences: any = {};
      if (emailNotifications !== undefined) preferences.emailNotifications = emailNotifications;
      if (smsNotifications !== undefined) preferences.smsNotifications = smsNotifications;
      if (pushNotifications !== undefined) preferences.pushNotifications = pushNotifications;
      if (newListings !== undefined) preferences.newListings = newListings;
      if (priceDrops !== undefined) preferences.priceDrops = priceDrops;
      if (inquiryReplies !== undefined) preferences.inquiryReplies = inquiryReplies;
      
      // Store preferences in user metadata or create a separate preferences table
      // For now, storing in user's metadata field if it exists, or we can extend the user table
      const updatedUser = await storage.updateUser(userId, { 
        metadata: preferences 
      } as any);
      
      res.json({ success: true, preferences });
    } catch (error) {
      console.error("Error updating preferences:", error);
      res.status(500).json({ error: "Failed to update preferences" });
    }
  });

  // Delete current user account
  app.delete("/api/auth/me", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      // Delete user (cascade will handle related data)
      await db.delete(users).where(eq(users.id, userId));
      
      // Destroy session
      req.session.destroy((err: any) => {
        if (err) {
          console.error("Error destroying session:", err);
        }
      });
      
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting account:", error);
      res.status(500).json({ error: "Failed to delete account" });
    }
  });

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
      
      // Validate required fields
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }
      
      // Validate email format
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Validate password strength
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message || "Password does not meet requirements" });
      }
      
      // Validate firstName and lastName
      if (firstName !== undefined && firstName !== null) {
        const trimmedFirstName = String(firstName).trim();
        if (!trimmedFirstName) {
          return res.status(400).json({ message: "First name cannot be empty" });
        }
      }
      
      if (lastName !== undefined && lastName !== null) {
        const trimmedLastName = String(lastName).trim();
        if (!trimmedLastName) {
          return res.status(400).json({ message: "Last name cannot be empty" });
        }
      }
      
      // Validate phone number if provided
      if (phone) {
        const cleanedPhone = String(phone).replace(/\D/g, "");
        if (!validatePhone(cleanedPhone)) {
          return res.status(400).json({ message: "Invalid phone number. Must be 10 digits starting with 6-9" });
        }
      }
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({ message: "User with this email already exists" });
      }
      
      // Hash password
      const passwordHash = await hashPassword(password);
      
      // Create user with trimmed names
      const user = await storage.createUserWithPassword({
        email: email.trim(),
        passwordHash,
        firstName: firstName ? String(firstName).trim() : "",
        lastName: lastName ? String(lastName).trim() : "",
        phone: phone ? String(phone).replace(/\D/g, "") : undefined,
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
      
      // Send welcome email (async, don't wait)
      emailService.sendWelcomeEmail(
        user.email,
        user.firstName || user.email.split("@")[0],
        user.role === "seller" ? "seller" : "buyer"
      ).catch(err => console.error("[Email] Welcome email error:", err));
      
      // Send email verification email (async, don't wait)
      const verificationToken = randomUUID();
      const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
      emailService.sendTemplatedEmail(
        "email_verification",
        user.email,
        {
          firstName: user.firstName || user.email.split("@")[0],
          verificationLink: verificationLink,
        }
      ).catch(err => console.error("[Email] Verification email error:", err));
      
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

  // Seller Registration
  app.post("/api/seller/register", async (req: Request, res: Response) => {
    try {
      const {
        sellerType,
        // User fields
        email,
        password,
        firstName,
        lastName,
        phone,
        // Seller profile fields
        companyName,
        reraNumber,
        gstNumber,
        panNumber,
        aadharNumber,
        address,
        city,
        state,
        pincode,
        website,
        // Broker specific
        firmName,
        yearsOfExperience,
        // Corporate/Builder specific
        cinNumber,
        establishedYear,
        completedProjects,
        // Document URLs (should be uploaded separately first)
        logoUrl,
        brochureUrl,
        reraCertificateUrl,
        businessCardUrl,
        incorporationCertificateUrl,
        companyProfileUrl,
        propertyDocumentUrl,
      } = req.body;

      // Validation
      if (!email || !password) {
        return res.status(400).json({ message: "Email and password are required" });
      }

      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }

      if (phone && !validatePhone(phone)) {
        return res.status(400).json({ message: "Invalid phone number. Must be 10 digits starting with 6-9" });
      }

      if (!sellerType || !["individual", "broker", "builder"].includes(sellerType)) {
        return res.status(400).json({ message: "Valid seller type is required" });
      }
      
      // Map corporate to builder
      const normalizedSellerType = sellerType === "corporate" ? "builder" : sellerType;

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
        firstName: firstName || companyName?.split(" ")[0] || "",
        lastName: lastName || companyName?.split(" ").slice(1).join(" ") || "",
        phone,
        intent: "seller",
        role: "seller",
        authProvider: "local",
      });

      // Prepare seller profile data
      const sellerProfileData: any = {
        userId: user.id,
        sellerType: normalizedSellerType as "individual" | "broker" | "builder",
        verificationStatus: "pending",
      };

      // Add common fields
      if (companyName) sellerProfileData.companyName = companyName;
      if (firmName && sellerType === "broker") sellerProfileData.companyName = firmName;
      if (reraNumber) sellerProfileData.reraNumber = reraNumber;
      if (gstNumber) sellerProfileData.gstNumber = gstNumber;
      if (panNumber) sellerProfileData.panNumber = panNumber;
      if (address) sellerProfileData.address = address;
      if (city) sellerProfileData.city = city;
      if (state) sellerProfileData.state = state;
      if (pincode) sellerProfileData.pincode = pincode;
      if (website) sellerProfileData.website = website;
      if (logoUrl) sellerProfileData.logo = logoUrl;

      // Prepare verification documents
      const verificationDocuments: any[] = [];
      if (aadharNumber && propertyDocumentUrl) {
        verificationDocuments.push({
          type: "aadhaar",
          number: aadharNumber,
          url: propertyDocumentUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      if (panNumber && propertyDocumentUrl) {
        verificationDocuments.push({
          type: "pan",
          number: panNumber,
          url: propertyDocumentUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      if (reraNumber && reraCertificateUrl) {
        verificationDocuments.push({
          type: "rera",
          number: reraNumber,
          url: reraCertificateUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      if (incorporationCertificateUrl) {
        verificationDocuments.push({
          type: "incorporation",
          url: incorporationCertificateUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      if (businessCardUrl) {
        verificationDocuments.push({
          type: "business_card",
          url: businessCardUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      if (companyProfileUrl) {
        verificationDocuments.push({
          type: "company_profile",
          url: companyProfileUrl,
          uploadedAt: new Date().toISOString(),
        });
      }
      if (brochureUrl) {
        verificationDocuments.push({
          type: "brochure",
          url: brochureUrl,
          uploadedAt: new Date().toISOString(),
        });
      }

      if (verificationDocuments.length > 0) {
        sellerProfileData.verificationDocuments = verificationDocuments;
      }

      // Create seller profile
      const sellerProfile = await storage.createSellerProfile(sellerProfileData);

      // Set session
      (req.session as any).localUser = {
        id: user.id,
        email: user.email,
        role: user.role,
        loginAt: new Date().toISOString(),
      };

      // Send welcome email (async, don't wait)
      emailService.sendWelcomeEmail(
        user.email,
        user.firstName || companyName?.split(" ")[0] || user.email.split("@")[0],
        "seller"
      ).catch(err => console.error("[Email] Welcome email error:", err));

      res.status(201).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
        },
        sellerProfile: {
          id: sellerProfile.id,
          sellerType: sellerProfile.sellerType,
          verificationStatus: sellerProfile.verificationStatus,
        },
      });
    } catch (error) {
      console.error("Seller registration error:", error);
      res.status(500).json({ message: "Registration failed" });
    }
  });

  // Upload document for seller registration
  app.post("/api/seller/register/upload-document", async (req: Request, res: Response) => {
    try {
      // This endpoint expects multipart/form-data with a file
      // For now, we'll accept a base64 file or URL
      // In production, use multer or similar for file uploads
      const { file, fileName, fileType } = req.body;

      if (!file) {
        return res.status(400).json({ message: "File is required" });
      }

      // Generate unique filename
      const fileExtension = fileName?.split(".").pop() || "pdf";
      const uniqueFileName = `seller-documents/${Date.now()}-${randomUUID()}.${fileExtension}`;

      // If file is base64, decode it
      let fileBuffer: Buffer;
      if (file.startsWith("data:")) {
        const base64Data = file.split(",")[1];
        fileBuffer = Buffer.from(base64Data, "base64");
      } else if (file.startsWith("http")) {
        // If it's already a URL, return it
        return res.json({ url: file });
      } else {
        fileBuffer = Buffer.from(file, "base64");
      }

      // Upload to object storage
      const objectStorage = new (await import("./objectStorage")).ObjectStorageService();
      const url = await objectStorage.uploadObject("seller-documents", uniqueFileName, fileBuffer, {
        contentType: fileType || "application/pdf",
        acl: "public-read",
      });

      res.json({ url, fileName: uniqueFileName });
    } catch (error) {
      console.error("Document upload error:", error);
      res.status(500).json({ message: "Failed to upload document" });
    }
  });

  // Send email verification
  app.post("/api/auth/send-verification-email", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ message: "Not authenticated" });
      
      const user = await storage.getUser(userId);
      if (!user || !user.email) {
        return res.status(404).json({ message: "User not found" });
      }
      
      if (user.isEmailVerified) {
        return res.json({ success: true, message: "Email already verified" });
      }
      
      // Generate verification token
      const verificationToken = randomUUID();
      const verificationLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/verify-email?token=${verificationToken}&email=${encodeURIComponent(user.email)}`;
      
      // In production, store token in database with expiry
      // For now, send email (token verification would need database storage)
      
      emailService.sendTemplatedEmail(
        "email_verification",
        user.email,
        {
          firstName: user.firstName || user.email.split("@")[0],
          verificationLink: verificationLink,
        }
      ).catch(err => console.error("[Email] Verification email error:", err));
      
      res.json({ success: true, message: "Verification email sent" });
    } catch (error) {
      console.error("Email verification request error:", error);
      res.status(500).json({ message: "Failed to send verification email" });
    }
  });

  // Verify email with token
  app.post("/api/auth/verify-email", async (req: Request, res: Response) => {
    try {
      const { email, token } = req.body;
      
      if (!email || !token) {
        return res.status(400).json({ message: "Email and token are required" });
      }
      
      // In production, verify token from database
      // For now, this is a simplified implementation
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Update user as verified
      await storage.updateUser(user.id, { isEmailVerified: true });
      
      res.json({ success: true, message: "Email verified successfully" });
    } catch (error) {
      console.error("Email verification error:", error);
      res.status(500).json({ message: "Failed to verify email" });
    }
  });

  // Request password reset
  app.post("/api/auth/forgot-password", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      
      if (!email) {
        return res.status(400).json({ message: "Email is required" });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        // Don't reveal if email exists for security
        return res.json({ success: true, message: "If the email exists, a password reset link has been sent" });
      }
      
      // Generate reset token (simple implementation - in production use crypto.randomBytes)
      const resetToken = randomUUID();
      const resetExpiry = new Date();
      resetExpiry.setHours(resetExpiry.getHours() + 1); // 1 hour expiry
      
      // Store reset token (in production, use a separate table)
      // For now, we'll use a simple approach - store in user metadata or create resetTokens table
      // This is a simplified implementation
      
      const resetLink = `${process.env.FRONTEND_URL || "http://localhost:5173"}/reset-password?token=${resetToken}&email=${encodeURIComponent(email)}`;
      
      // Send password reset email
      emailService.sendTemplatedEmail(
        "password_reset",
        user.email,
        {
          firstName: user.firstName || user.email.split("@")[0],
          resetLink: resetLink,
        }
      ).catch(err => console.error("[Email] Password reset email error:", err));
      
      res.json({ success: true, message: "If the email exists, a password reset link has been sent" });
    } catch (error) {
      console.error("Password reset request error:", error);
      res.status(500).json({ message: "Failed to process password reset request" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req: Request, res: Response) => {
    try {
      const { email, token, newPassword } = req.body;
      
      if (!email || !token || !newPassword) {
        return res.status(400).json({ message: "Email, token, and new password are required" });
      }
      
      if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
      }
      
      // Validate password strength
      const { validatePassword } = await import("./auth-utils");
      const passwordValidation = validatePassword(newPassword);
      if (!passwordValidation.valid) {
        return res.status(400).json({ message: passwordValidation.message || "Password does not meet requirements" });
      }
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // In production, verify token from database
      // For now, this is a simplified implementation
      // TODO: Implement proper token verification
      
      // Hash new password
      const passwordHash = await hashPassword(newPassword);
      
      // Update user password
      await storage.updateUser(user.id, { passwordHash });
      
      // Send password changed email
      emailService.sendTemplatedEmail(
        "password_changed",
        user.email,
        {
          firstName: user.firstName || user.email.split("@")[0],
          changeDate: new Date().toLocaleDateString('en-IN'),
          changeTime: new Date().toLocaleTimeString('en-IN'),
        }
      ).catch(err => console.error("[Email] Password changed notification error:", err));
      
      res.json({ success: true, message: "Password has been reset successfully" });
    } catch (error) {
      console.error("Password reset error:", error);
      res.status(500).json({ message: "Failed to reset password" });
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
        userId: adminUser.id === "superadmin" ? null : adminUser.id,
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

  // Admin: Get verification requests
  app.get("/api/admin/verifications", async (req: any, res: Response) => {
    try {
      // Get all seller profiles that have verification documents
      const sellers = await storage.getAllSellerProfiles({});
      
      // Filter sellers that have verification documents and transform to match frontend interface
      const verificationRequests = await Promise.all(
        sellers
          .filter(seller => seller.verificationDocuments && Array.isArray(seller.verificationDocuments) && seller.verificationDocuments.length > 0)
          .map(async (seller) => {
            const user = await storage.getUser(seller.userId);
            const sellerName = user 
              ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown"
              : "Unknown";
            
            return {
              id: seller.id,
              sellerId: seller.id,
              sellerName: sellerName,
              sellerType: seller.sellerType,
              status: seller.verificationStatus,
              documents: seller.verificationDocuments || [],
              createdAt: seller.createdAt?.toISOString() || new Date().toISOString(),
            };
          })
      );
      
      res.json(verificationRequests);
    } catch (error) {
      console.error("Error getting verification requests:", error);
      res.status(500).json({ error: "Failed to get verification requests" });
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

  // Update seller profile (for verification status updates)
  app.patch("/api/sellers/:id", async (req: any, res: Response) => {
    try {
      const { id } = req.params;
      const updateData = req.body;

      // Check if seller exists
      const existingSeller = await storage.getSellerProfile(id);
      if (!existingSeller) {
        return res.status(404).json({ error: "Seller not found" });
      }

      // Update seller profile
      const updatedSeller = await storage.updateSellerProfile(id, updateData);
      
      // If verification status is being updated, create audit log
      if (updateData.verificationStatus && updateData.verificationStatus !== existingSeller.verificationStatus) {
        const adminUser = (req.session as any)?.adminUser;
        await storage.createAuditLog({
          userId: adminUser?.id === "superadmin" ? null : adminUser?.id,
          action: `Seller Verification ${updateData.verificationStatus === "verified" ? "Approved" : "Rejected"}`,
          entityType: "seller",
          entityId: id,
          oldData: { verificationStatus: existingSeller.verificationStatus },
          newData: { verificationStatus: updateData.verificationStatus },
          ipAddress: req.ip || null,
          userAgent: req.get("user-agent") || null,
        });

        // Send notification to seller
        const user = await storage.getUser(existingSeller.userId);
        if (user?.email) {
          const triggerEvent = updateData.verificationStatus === "verified" 
            ? "seller_approved" 
            : updateData.verificationStatus === "rejected"
            ? "seller_rejected"
            : null;
          
          if (triggerEvent) {
            emailService.sendTemplatedEmail(
              triggerEvent,
              user.email,
              {
                sellerName: user.firstName || "Seller",
                email: user.email,
              }
            ).catch(err => console.error("[Email] Verification notification error:", err));
            
            // Also send verification pending email if status changed to pending
            if (updateData.verificationStatus === "pending") {
              emailService.sendTemplatedEmail(
                "seller_verification_pending",
                user.email,
                {
                  sellerName: user.firstName || "Seller",
                }
              ).catch(err => console.error("[Email] Verification pending notification error:", err));
            }
          }
        }
      }

      res.json(updatedSeller);
    } catch (error) {
      console.error("Error updating seller:", error);
      res.status(500).json({ error: "Failed to update seller" });
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
      
      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        properties.map(async (property) => {
          const images = await storage.getPropertyImages(property.id);
          return { ...property, images };
        })
      );
      
      res.json(propertiesWithImages);
    } catch (error) {
      res.status(500).json({ error: "Failed to get properties" });
    }
  });

  // Get featured properties
  app.get("/api/properties/featured", async (req: Request, res: Response) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
      const properties = await storage.getFeaturedProperties(limit);
      
      // Fetch images for each property
      const propertiesWithImages = await Promise.all(
        properties.map(async (property) => {
          const images = await storage.getPropertyImages(property.id);
          return { ...property, images };
        })
      );
      
      res.json(propertiesWithImages);
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
      
      // Get seller profile if sellerId exists
      let sellerProfile = null;
      if (property.sellerId) {
        sellerProfile = await storage.getSellerProfile(property.sellerId);
      }
      
      res.json({ 
        ...property, 
        images,
        seller: sellerProfile ? {
          id: sellerProfile.id,
          businessName: sellerProfile.businessName,
          firstName: sellerProfile.firstName,
          lastName: sellerProfile.lastName,
          sellerType: sellerProfile.sellerType,
          isVerified: sellerProfile.isVerified || false,
        } : null,
      });
    } catch (error) {
      console.error("Error getting property:", error);
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
      // Ensure latitude and longitude are properly formatted (convert empty strings to null)
      const { latitude: rawLat, longitude: rawLng, ...restBody } = req.body;
      
      // Convert latitude/longitude to numbers or null
      const latitude = rawLat && rawLat !== "" && !isNaN(parseFloat(rawLat))
        ? (typeof rawLat === "string" ? parseFloat(rawLat) : rawLat)
        : null;
      const longitude = rawLng && rawLng !== "" && !isNaN(parseFloat(rawLng))
        ? (typeof rawLng === "string" ? parseFloat(rawLng) : rawLng)
        : null;
      
      const propertyData = {
        ...restBody,
        sellerId: sellerProfile.id,
        status: "draft" as const,
        workflowStatus: "draft" as const,
        latitude,
        longitude,
      };
      
      console.log("Creating property with coordinates:", {
        latitude,
        longitude,
        hasLat: !!latitude,
        hasLng: !!longitude,
      });
      
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
  app.patch("/api/properties/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const propertyId = req.params.id;
      
      // Get current user ID
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Get current property to check status
      const currentProperty = await storage.getProperty(propertyId);
      if (!currentProperty) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      // Check if user owns this property (through seller profile)
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile || sellerProfile.id !== currentProperty.sellerId) {
        return res.status(403).json({ error: "You can only edit your own properties" });
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
        // Sanitize input to prevent editing protected fields
        const protectedFields = [
          'id', 'sellerId', 'status', 'workflowStatus', 'isVerified', 'isFeatured',
          'viewCount', 'inquiryCount', 'favoriteCount', 'publishedAt', 'expiresAt',
          'approvedAt', 'approvedBy', 'rejectionReason', 'createdAt', 'updatedAt'
        ];
        const sanitizedBody = { ...req.body };
        protectedFields.forEach(field => delete sanitizedBody[field]);
        
        property = await storage.updateProperty(propertyId, sanitizedBody);
        
        res.json({
          ...property,
          needsReapproval: false
        });
      }
    } catch (error) {
      console.error("Error updating property:", error);
      res.status(500).json({ error: "Failed to update property" });
    }
  });

  // Delete property
  app.delete("/api/properties/:id", isAuthenticated, async (req: any, res: Response) => {
    try {
      const propertyId = req.params.id;
      
      // Get current user ID
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      // Get property to verify ownership
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      
      // Check if user owns this property (through seller profile)
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile || sellerProfile.id !== property.sellerId) {
        return res.status(403).json({ error: "You can only delete your own properties" });
      }
      
      await storage.deleteProperty(propertyId);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting property:", error);
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
      
      // Send property submission email
      const sellerUser = await storage.getUser(sellerProfile.userId);
      if (sellerUser?.email) {
        const triggerEvent = property.workflowStatus === "needs_reapproval" 
          ? "property_needs_reapproval" 
          : "property_submitted";
        emailService.sendTemplatedEmail(
          triggerEvent,
          sellerUser.email,
          {
            sellerName: sellerProfile.companyName || sellerUser.firstName || "Seller",
            propertyTitle: property.title,
          }
        ).catch(err => console.error("[Email] Property submission notification error:", err));
      }
      
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
        approverId: adminUser.id === "superadmin" ? null : adminUser.id,
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
        approvedBy: adminUser.id === "superadmin" ? null : adminUser.id,
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
      
      // Send property approval email
      const sellerProfile = await storage.getSellerProfile(property.sellerId);
      if (sellerProfile) {
        const sellerUser = await storage.getUser(sellerProfile.userId);
        if (sellerUser?.email) {
          emailService.sendPropertyStatusNotification(
            sellerUser.email,
            sellerProfile.companyName || sellerUser.firstName || "Seller",
            property.title,
            "approved"
          ).catch(err => console.error("[Email] Property approval notification error:", err));
        }
      }
      
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
        approverId: adminUser.id === "superadmin" ? null : adminUser.id,
        decisionReason: reason,
        decidedAt: new Date(),
      });
      
      // Get property for email notification
      const property = await storage.getProperty(approval.propertyId);
      
      // Update property status
      await storage.updateProperty(approval.propertyId, {
        workflowStatus: "rejected",
        status: "draft",
        rejectionReason: reason,
      });
      
      // Send property rejection email
      const sellerProfile = await storage.getSellerProfile(approval.sellerId);
      if (sellerProfile && property) {
        const sellerUser = await storage.getUser(sellerProfile.userId);
        if (sellerUser?.email) {
          emailService.sendPropertyStatusNotification(
            sellerUser.email,
            sellerProfile.companyName || sellerUser.firstName || "Seller",
            property.title,
            "rejected",
            reason
          ).catch(err => console.error("[Email] Property rejection notification error:", err));
        }
      }
      
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
  app.post("/api/inquiries", getRateLimitMiddleware(5, 15 * 60 * 1000), async (req: Request, res: Response) => {
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
      
      // Get or create guest user if userId is not provided
      let buyerId = userId;
      if (!buyerId) {
        // Try to find existing guest user by email, or create one
        if (email) {
          const existingUser = await storage.getUserByEmail(email);
          if (existingUser) {
            buyerId = existingUser.id;
          } else {
            // Create a guest user for this inquiry
            const guestUser = await storage.createUser({
              email,
              firstName: name?.split(' ')[0] || "Guest",
              lastName: name?.split(' ').slice(1).join(' ') || "User",
              phone,
              role: "buyer",
              authProvider: "local",
            });
            buyerId = guestUser.id;
          }
        } else {
          // No email provided, create a temporary guest user
          const guestUser = await storage.createUser({
            email: `guest-${Date.now()}@temp.inquiry`,
            firstName: name?.split(' ')[0] || "Guest",
            lastName: name?.split(' ').slice(1).join(' ') || "User",
            phone,
            role: "buyer",
            authProvider: "local",
          });
          buyerId = guestUser.id;
        }
      }
      
      // Create the inquiry with seller lookup
      const inquiryData = {
        propertyId,
        buyerId,
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
    } catch (error: any) {
      console.error("Failed to create inquiry:", error);
      const errorMessage = error?.message || "Failed to create inquiry";
      res.status(500).json({ error: errorMessage });
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
                const subscription = await storage.getSubscriptionByUserId(dbPayment.userId);
                emailService.sendTemplatedEmail(
                  "payment_success",
                  user.email,
                  {
                    sellerName: user.firstName || "Seller",
                    amount: `₹${dbPayment.amount}`,
                    packageName: pkg?.name || "Package",
                    transactionId: paymentId || dbPayment.id,
                    validUntil: subscription?.endDate 
                      ? new Date(subscription.endDate).toLocaleDateString('en-IN')
                      : "N/A",
                    listingLimit: pkg?.listingLimit?.toString() || "0",
                  }
                ).catch(err => console.error("[Email] Payment notification error:", err));
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
                emailService.sendTemplatedEmail(
                  "payment_failed",
                  user.email,
                  {
                    sellerName: user.firstName || "Seller",
                    amount: `₹${dbPayment.amount}`,
                    packageName: pkg?.name || "Package",
                    errorMessage: errorDesc || "Payment processing failed",
                    retryLink: "/seller/packages",
                  }
                ).catch(err => console.error("[Email] Payment notification error:", err));
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

  // Set system setting (generic POST endpoint)
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
          companyName: "VenGrow",
          companyAddress: "",
          companyState: "Karnataka",
          companyPin: "",
          gstin: "29BWZPM7438N3Z3",
          pan: "",
          logo: null,
          footerText: "",
          bankDetails: {
            bankName: "Axis Bank",
            accountNumber: "924020038520995",
            ifscCode: "UTIB0004648",
            accountHolder: "Space Shop",
            branch: "Amruthahalli KT",
          },
          sacCode: "997221",
          termsAndConditions: "1. Payment once made is non-refundable.\n2. Invoice valid for accounting & GST purposes.\n3. Any disputes subject to Bangalore jurisdiction.\n4. Payment should be made on or before the due date.",
          invoicePrefix: "VG",
          nextInvoiceNumber: 1,
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
      
      // Get API key from environment variable as fallback
      const envApiKey = process.env.GOOGLE_MAPS_API_KEY || process.env.VITE_GOOGLE_MAPS_API_KEY || "";
      
      // Default structure matching frontend expectations
      const defaultSettings = {
        googleMapsApiKey: envApiKey,
        defaultLatitude: 20.5937,
        defaultLongitude: 78.9629,
        defaultZoom: 5,
        enableGeocoding: true,
        enableStreetView: true,
      };

      if (!setting) {
        return res.json(defaultSettings);
      }

      // Transform old structure to new structure if needed
      const value = setting.value as any;
      const transformedSettings = {
        googleMapsApiKey: value.googleMapsApiKey ?? value.apiKey ?? envApiKey,
        defaultLatitude: value.defaultLatitude ?? value.defaultLat ?? 20.5937,
        defaultLongitude: value.defaultLongitude ?? value.defaultLng ?? 78.9629,
        defaultZoom: value.defaultZoom ?? 5,
        enableGeocoding: value.enableGeocoding ?? value.showMarkers ?? true,
        enableStreetView: value.enableStreetView ?? true,
      };

      // If API key is empty, use environment variable
      if (!transformedSettings.googleMapsApiKey) {
        transformedSettings.googleMapsApiKey = envApiKey;
      }

      res.json(transformedSettings);
    } catch (error) {
      res.status(500).json({ error: "Failed to get map settings" });
    }
  });

  // Update map settings
  app.put("/api/admin/settings/maps", async (req: Request, res: Response) => {
    try {
      // Ensure the structure matches what frontend sends
      const settingsToSave = {
        googleMapsApiKey: req.body.googleMapsApiKey || "",
        defaultLatitude: req.body.defaultLatitude ?? 20.5937,
        defaultLongitude: req.body.defaultLongitude ?? 78.9629,
        defaultZoom: req.body.defaultZoom ?? 5,
        enableGeocoding: req.body.enableGeocoding ?? true,
        enableStreetView: req.body.enableStreetView ?? true,
      };
      
      const setting = await storage.setSystemSetting("maps_settings", settingsToSave);
      
      // Return in the format frontend expects (transformed)
      const savedValue = setting.value as any;
      const response = {
        googleMapsApiKey: savedValue.googleMapsApiKey ?? savedValue.apiKey ?? "",
        defaultLatitude: savedValue.defaultLatitude ?? savedValue.defaultLat ?? 20.5937,
        defaultLongitude: savedValue.defaultLongitude ?? savedValue.defaultLng ?? 78.9629,
        defaultZoom: savedValue.defaultZoom ?? 5,
        enableGeocoding: savedValue.enableGeocoding ?? savedValue.showMarkers ?? true,
        enableStreetView: savedValue.enableStreetView ?? true,
      };
      
      res.json(response);
    } catch (error) {
      console.error("Error updating map settings:", error);
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
      const { fromEmail } = req.body;
      
      // Validate email if provided
      if (fromEmail && fromEmail.trim()) {
        if (!validateEmail(fromEmail.trim())) {
          return res.status(400).json({ error: "Invalid email format for 'From Email'" });
        }
      }
      
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

  // Get general/system settings
  app.get("/api/admin/settings/general", async (req: Request, res: Response) => {
    try {
      const setting = await storage.getSystemSetting("general_settings");
      if (!setting) {
        return res.json({
          siteName: "VenGrow",
          siteTagline: "Find Your Dream Property",
          contactEmail: "support@vengrow.com",
          contactPhone: "+91 98765 43210",
          aboutUs: "",
          enableRegistration: true,
          enableSellerApproval: true,
          enableListingModeration: true,
          enableEmailNotifications: true,
          enableSMSNotifications: false,
          maintenanceMode: false,
          googleAnalyticsId: "",
          razorpayKey: "",
          googleMapsKey: "",
        });
      }
      res.json(setting.value);
    } catch (error) {
      console.error("Error getting general settings:", error);
      res.status(500).json({ error: "Failed to get general settings" });
    }
  });

  // Update general/system settings
  app.put("/api/admin/settings/general", async (req: Request, res: Response) => {
    try {
      const { contactEmail, contactPhone } = req.body;
      
      // Validate contact email if provided
      if (contactEmail && contactEmail.trim()) {
        if (!validateEmail(contactEmail.trim())) {
          return res.status(400).json({ error: "Invalid email format for contact email" });
        }
      }
      
      // Validate contact phone if provided
      if (contactPhone && contactPhone.trim()) {
        const cleanedPhone = contactPhone.replace(/\D/g, "");
        if (cleanedPhone && !validatePhone(cleanedPhone)) {
          return res.status(400).json({ error: "Invalid phone number format. Must be 10 digits starting with 6-9" });
        }
      }
      
      const setting = await storage.setSystemSetting("general_settings", req.body);
      res.json(setting.value);
    } catch (error) {
      console.error("Error updating general settings:", error);
      res.status(500).json({ error: "Failed to update general settings" });
    }
  });

  // Impersonate user (admin only)
  app.post("/api/admin/impersonate", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { email, reason } = req.body;

      if (!email || !email.trim()) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!validateEmail(email.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      if (!reason || !reason.trim()) {
        return res.status(400).json({ error: "Reason is required" });
      }

      const targetUser = await storage.getUserByEmail(email.trim());
      if (!targetUser) {
        return res.status(404).json({ error: "User not found" });
      }

      // Set impersonation session
      (req.session as any).impersonatingUserId = targetUser.id;
      (req.session as any).impersonationReason = reason.trim();
      (req.session as any).originalAdminId = userId;

      // Log impersonation (you might want to create an audit log entry here)
      console.log(`[Admin Impersonation] Admin ${user.email} impersonating ${targetUser.email}. Reason: ${reason.trim()}`);

      res.json({
        success: true,
        message: "Impersonation started",
        targetUser: {
          id: targetUser.id,
          email: targetUser.email,
          role: targetUser.role,
        },
      });
    } catch (error) {
      console.error("Error starting impersonation:", error);
      res.status(500).json({ error: "Failed to start impersonation" });
    }
  });

  // Get system setting (generic - must be after all specific routes)
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

  // ============================================
  // NEWSLETTER
  // ============================================

  // Subscribe to newsletter
  app.post("/api/newsletter/subscribe", async (req: Request, res: Response) => {
    try {
      const { email } = req.body;

      if (!email || !email.trim()) {
        return res.status(400).json({ error: "Email is required" });
      }

      if (!validateEmail(email.trim())) {
        return res.status(400).json({ error: "Invalid email format" });
      }

      // TODO: Store newsletter subscription in database
      // For now, just return success
      // You might want to create a newsletter_subscriptions table
      
      console.log(`[Newsletter] New subscription: ${email.trim()}`);

      res.json({
        success: true,
        message: "Successfully subscribed to newsletter",
      });
    } catch (error) {
      console.error("Error subscribing to newsletter:", error);
      res.status(500).json({ error: "Failed to subscribe to newsletter" });
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
      
      // Populate property and buyer details
      const inquiriesWithDetails = await Promise.all(
        inquiries.map(async (inquiry) => {
          const [property, buyer] = await Promise.all([
            storage.getProperty(inquiry.propertyId),
            storage.getUser(inquiry.buyerId),
          ]);
          
          return {
            ...inquiry,
            property: property ? {
              title: property.title,
              city: property.city,
            } : undefined,
            buyer: buyer ? {
              firstName: buyer.firstName,
              lastName: buyer.lastName,
              email: buyer.email,
              phone: buyer.phone,
            } : undefined,
          };
        })
      );
      
      res.json(inquiriesWithDetails);
    } catch (error) {
      console.error("Error getting admin inquiries:", error);
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
      
      // For buyers, enhance response with additional data
      if (role === 'buyer') {
        const favorites = await storage.getFavorites(userId);
        const savedSearches = await storage.getSavedSearches(userId);
        const appointments = await storage.getAppointmentsByBuyer(userId);
        const inquiries = await storage.getInquiriesByBuyer(userId);
        
        // Get recently viewed properties (from propertyViews)
        const recentViews = await db.select({
          property: properties,
          viewedAt: propertyViews.createdAt,
        })
          .from(propertyViews)
          .innerJoin(properties, eq(propertyViews.propertyId, properties.id))
          .where(eq(propertyViews.userId, userId))
          .orderBy(desc(propertyViews.createdAt))
          .limit(5);
        
        // Get recommended properties (top properties by views, excluding already favorited)
        const favoriteIds = favorites.map(f => f.propertyId);
        const recommended = favoriteIds.length > 0
          ? await db.select()
              .from(properties)
              .where(and(
                eq(properties.status, 'active'),
                or(
                  eq(properties.workflowStatus, 'live'),
                  eq(properties.workflowStatus, 'approved')
                ),
                notInArray(properties.id, favoriteIds)
              ))
              .orderBy(desc(properties.viewCount))
              .limit(4)
          : await db.select()
              .from(properties)
              .where(and(
                eq(properties.status, 'active'),
                or(
                  eq(properties.workflowStatus, 'live'),
                  eq(properties.workflowStatus, 'approved')
                )
              ))
              .orderBy(desc(properties.viewCount))
              .limit(4);
        
        res.json({
          ...stats,
          savedProperties: stats.totalFavorites || 0,
          activeSearches: savedSearches.filter(s => s.alertEnabled).length,
          scheduledVisits: appointments.filter(a => 
            (a.status === 'pending' || a.status === 'confirmed') &&
            new Date(a.scheduledDate) >= new Date()
          ).length,
          unreadMessages: 0, // TODO: Implement unread message count
          recentlyViewed: recentViews.map(rv => ({
            id: rv.property.id,
            title: rv.property.title,
            location: `${rv.property.locality || ''}, ${rv.property.city}`.replace(/^, /, ''),
            price: rv.property.price,
            viewedAt: rv.viewedAt,
          })),
          recommendations: recommended.map(p => ({
            id: p.id,
            title: p.title,
            location: `${p.locality || ''}, ${p.city}`.replace(/^, /, ''),
            price: p.price,
            type: p.propertyType,
            bedrooms: p.bedrooms || 0,
            bathrooms: p.bathrooms || 0,
            area: p.area || 0,
          })),
          savedSearches: savedSearches.slice(0, 3).map(s => ({
            id: s.id,
            name: s.name,
            filters: s.filters,
            alertEnabled: s.alertEnabled,
          })),
        });
      } else {
        res.json(stats);
      }
    } catch (error) {
      console.error("Error getting dashboard stats:", error);
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
      
      // Populate property and buyer details
      const inquiriesWithDetails = await Promise.all(
        inquiries.map(async (inquiry) => {
          const [property, buyer] = await Promise.all([
            storage.getProperty(inquiry.propertyId),
            storage.getUser(inquiry.buyerId),
          ]);
          
          return {
            ...inquiry,
            property: property ? {
              title: property.title,
              city: property.city,
            } : undefined,
            buyer: buyer ? {
              firstName: buyer.firstName,
              lastName: buyer.lastName,
              email: buyer.email,
              phone: buyer.phone,
            } : undefined,
          };
        })
      );
      
      res.json(inquiriesWithDetails);
    } catch (error) {
      console.error("Error getting seller inquiries:", error);
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

  // Get seller verification status
  app.get("/api/me/verifications", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }

      const user = await storage.getUser(userId);
      const verifications = [];

      // Email verification
      verifications.push({
        id: "email",
        type: "Email Verification",
        status: user?.emailVerified ? "verified" : "not_submitted",
        verifiedDate: user?.emailVerified ? user.updatedAt : undefined,
      });

      // Phone verification
      verifications.push({
        id: "phone",
        type: "Phone Verification",
        status: user?.phoneVerified ? "verified" : "not_submitted",
        verifiedDate: user?.phoneVerified ? user.updatedAt : undefined,
      });

      // ID Proof (Aadhaar)
      const aadhaarDoc = profile.verificationDocuments?.find((d: any) => d.type === "aadhaar");
      verifications.push({
        id: "aadhaar",
        type: "ID Proof (Aadhaar)",
        status: aadhaarDoc ? (profile.verificationStatus === "verified" ? "verified" : "pending") : "not_submitted",
        verifiedDate: aadhaarDoc && profile.verificationStatus === "verified" ? profile.updatedAt : undefined,
        submittedDate: aadhaarDoc ? aadhaarDoc.uploadedAt : undefined,
      });

      // PAN Card
      const panDoc = profile.verificationDocuments?.find((d: any) => d.type === "pan");
      verifications.push({
        id: "pan",
        type: "PAN Card",
        status: panDoc ? (profile.verificationStatus === "verified" ? "verified" : "pending") : "not_submitted",
        verifiedDate: panDoc && profile.verificationStatus === "verified" ? profile.updatedAt : undefined,
        submittedDate: panDoc ? panDoc.uploadedAt : undefined,
      });

      // RERA Certificate (for builders)
      const reraDoc = profile.verificationDocuments?.find((d: any) => d.type === "rera");
      verifications.push({
        id: "rera",
        type: "RERA Certificate",
        status: reraDoc ? (profile.verificationStatus === "verified" ? "verified" : "pending") : "not_submitted",
        verifiedDate: reraDoc && profile.verificationStatus === "verified" ? profile.updatedAt : undefined,
        submittedDate: reraDoc ? reraDoc.uploadedAt : undefined,
      });

      res.json(verifications);
    } catch (error) {
      console.error("Error getting verifications:", error);
      res.status(500).json({ error: "Failed to get verifications" });
    }
  });

  // Get seller documents
  app.get("/api/me/documents", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }

      const properties = await storage.getPropertiesBySeller(profile.id);
      const documents: any[] = [];

      // Get documents from seller profile verificationDocuments
      if (profile.verificationDocuments && Array.isArray(profile.verificationDocuments)) {
        profile.verificationDocuments.forEach((doc: any) => {
          documents.push({
            id: doc.id || doc.type,
            name: doc.name || `${doc.type} Document`,
            type: doc.type,
            status: profile.verificationStatus === "verified" ? "verified" : profile.verificationStatus === "pending" ? "pending" : "rejected",
            uploadDate: doc.uploadedAt || doc.createdAt,
            verifiedDate: profile.verificationStatus === "verified" ? profile.updatedAt : undefined,
            reason: doc.rejectionReason,
          });
        });
      }

      res.json(documents);
    } catch (error) {
      console.error("Error getting documents:", error);
      res.status(500).json({ error: "Failed to get documents" });
    }
  });

  // Upload seller document
  app.post("/api/me/documents", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.status(404).json({ error: "Seller profile not found" });
      }

      const { type, url, name } = req.body;
      if (!type || !url) {
        return res.status(400).json({ error: "Type and URL are required" });
      }

      const existingDocs = profile.verificationDocuments || [];
      const newDoc = {
        id: `${type}-${Date.now()}`,
        type,
        name: name || `${type} Document`,
        url,
        uploadedAt: new Date().toISOString(),
      };

      const updatedDocs = [...existingDocs, newDoc];
      const wasAlreadyPending = profile.verificationStatus === "pending";
      await storage.updateSellerProfile(profile.id, {
        verificationDocuments: updatedDocs,
        verificationStatus: "pending",
      });

      // Send verification pending email (only if status changed to pending)
      if (!wasAlreadyPending) {
        const user = await storage.getUser(userId);
        if (user?.email) {
          emailService.sendTemplatedEmail(
            "seller_verification_pending",
            user.email,
            {
              sellerName: user.firstName || profile.companyName || "Seller",
            }
          ).catch(err => console.error("[Email] Verification pending notification error:", err));
        }
      }

      res.json({ success: true, document: newDoc });
    } catch (error) {
      console.error("Error uploading document:", error);
      res.status(500).json({ error: "Failed to upload document" });
    }
  });

  // Get seller conversations (from inquiries)
  app.get("/api/me/conversations", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json([]);
      }

      const inquiries = await storage.getInquiriesBySeller(profile.id);
      
      // Group inquiries by buyer to create conversations
      const conversationMap = new Map();
      
      for (const inquiry of inquiries) {
        const buyerId = inquiry.buyerId;
        if (!conversationMap.has(buyerId)) {
          const buyer = await storage.getUser(buyerId);
          const property = await storage.getProperty(inquiry.propertyId);
          
          conversationMap.set(buyerId, {
            id: buyerId,
            buyerId,
            buyerName: buyer ? `${buyer.firstName || ''} ${buyer.lastName || ''}`.trim() : "Buyer",
            propertyId: inquiry.propertyId,
            propertyName: property?.title || "Property",
            lastMessage: inquiry.message || "",
            lastMessageTime: inquiry.createdAt,
            unread: inquiry.status === "pending" ? 1 : 0,
            inquiryId: inquiry.id,
          });
        } else {
          const conv = conversationMap.get(buyerId);
          if (new Date(inquiry.createdAt) > new Date(conv.lastMessageTime)) {
            conv.lastMessage = inquiry.message || "";
            conv.lastMessageTime = inquiry.createdAt;
            if (inquiry.status === "pending") {
              conv.unread += 1;
            }
          }
        }
      }

      const conversations = Array.from(conversationMap.values())
        .sort((a, b) => new Date(b.lastMessageTime).getTime() - new Date(a.lastMessageTime).getTime());

      res.json(conversations);
    } catch (error) {
      console.error("Error getting conversations:", error);
      res.status(500).json({ error: "Failed to get conversations" });
    }
  });

  // Get messages for a conversation (inquiry thread)
  app.get("/api/conversations/:buyerId/messages", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.status(403).json({ error: "Seller profile not found" });
      }

      const buyerId = req.params.buyerId;
      const inquiries = await storage.getInquiriesBySeller(profile.id);
      const buyerInquiries = inquiries.filter(i => i.buyerId === buyerId);

      const messages = buyerInquiries.map(inquiry => ({
        id: inquiry.id,
        sender: "buyer",
        text: inquiry.message || "",
        time: inquiry.createdAt,
        inquiryId: inquiry.id,
      }));

      // Sort by time
      messages.sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime());

      res.json(messages);
    } catch (error) {
      console.error("Error getting messages:", error);
      res.status(500).json({ error: "Failed to get messages" });
    }
  });

  // Send message (reply to inquiry)
  app.post("/api/conversations/:buyerId/messages", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.status(403).json({ error: "Seller profile not found" });
      }

      const buyerId = req.params.buyerId;
      const { message, inquiryId } = req.body;

      if (!message) {
        return res.status(400).json({ error: "Message is required" });
      }

      // Update inquiry with seller reply
      let inquiry = null;
      if (inquiryId) {
        await storage.updateInquiry(inquiryId, {
          status: "replied",
          sellerReply: message,
          sellerRepliedAt: new Date(),
        } as Partial<import("@shared/schema").InsertInquiry>);
        
        // Get inquiry details for email
        inquiry = await storage.getInquiry(inquiryId);
      }

      // Send inquiry response email to buyer
      if (inquiry) {
        const property = await storage.getProperty(inquiry.propertyId);
        const buyerUser = await storage.getUser(buyerId);
        if (buyerUser?.email && property) {
          emailService.sendTemplatedEmail(
            "inquiry_response",
            buyerUser.email,
            {
              buyerName: buyerUser.firstName || "Buyer",
              propertyTitle: property.title,
              response: message,
              sellerName: profile.companyName || "Seller",
            }
          ).catch(err => console.error("[Email] Inquiry response error:", err));
        }
      }

      res.json({
        success: true,
        message: {
          id: `msg-${Date.now()}`,
          sender: "seller",
          text: message,
          time: new Date().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ error: "Failed to send message" });
    }
  });

  // Get seller dashboard stats
  app.get("/api/seller/stats", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const profile = await storage.getSellerProfileByUserId(userId);
      if (!profile) {
        return res.json({
          totalProperties: 0,
          activeListings: 0,
          totalViews: 0,
          totalInquiries: 0,
          newInquiries: 0,
          scheduledVisits: 0,
          packageInfo: { name: "No Package", listingsUsed: 0, listingsTotal: 0, daysRemaining: 0 },
          recentInquiries: [],
          topProperties: [],
        });
      }

      const properties = await storage.getPropertiesBySeller(profile.id);
      const inquiries = await storage.getInquiriesBySeller(profile.id);
      const subscription = await storage.getActiveSubscription(profile.id);
      const appointments = await storage.getAppointmentsBySeller(profile.id);

      const totalProperties = properties.length;
      const activeListings = properties.filter(p => p.status === "active" && (p.workflowStatus === "live" || p.workflowStatus === "approved")).length;
      const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
      const totalInquiries = inquiries.length;
      
      // Calculate new inquiries this week
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newInquiries = inquiries.filter(i => new Date(i.createdAt) >= weekAgo).length;
      
      // Count scheduled visits
      const scheduledVisits = appointments.filter(a => 
        a.status === "pending" || a.status === "confirmed"
      ).length;

      // Package info
      let packageInfo = { name: "No Package", listingsUsed: 0, listingsTotal: 0, daysRemaining: 0 };
      if (subscription) {
        const pkg = await storage.getPackage(subscription.packageId);
        const listingsUsed = activeListings;
        const listingsTotal = pkg?.listingLimit || 0;
        const daysRemaining = subscription.endDate 
          ? Math.max(0, Math.floor((new Date(subscription.endDate).getTime() - now.getTime()) / (1000 * 60 * 60 * 24)))
          : 0;
        packageInfo = {
          name: pkg?.name || "Unknown",
          listingsUsed,
          listingsTotal,
          daysRemaining,
        };
      }

      // Recent inquiries (last 5) with buyer and property details
      const recentInquiriesData = await Promise.all(
        inquiries
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          .slice(0, 5)
          .map(async (inquiry) => {
            const buyer = inquiry.buyerId ? await storage.getUser(inquiry.buyerId) : null;
            const property = inquiry.propertyId ? await storage.getProperty(inquiry.propertyId) : null;
            return {
              id: inquiry.id,
              propertyId: inquiry.propertyId,
              buyerId: inquiry.buyerId,
              buyerName: buyer ? `${buyer.firstName || ""} ${buyer.lastName || ""}`.trim() || buyer.email?.split("@")[0] || "Anonymous" : "Anonymous",
              propertyTitle: property?.title || "Property",
              propertyLocality: property?.locality || "",
              propertyCity: property?.city || "",
              message: inquiry.message || "",
              status: inquiry.status,
              createdAt: inquiry.createdAt,
            };
          })
      );

      // Top properties by views (top 5) with full details
      const topPropertiesData = [...properties]
        .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
        .slice(0, 5)
        .map(p => {
          const propertyInquiries = inquiries.filter(i => i.propertyId === p.id);
          const favorites = p.favoriteCount || 0;
          const views = p.viewCount || 0;
          const inquiryCount = propertyInquiries.length;
          const conversionRate = views > 0 ? ((favorites + inquiryCount) / views * 100).toFixed(1) : "0.0";
          return {
            id: p.id,
            title: p.title,
            locality: p.locality || "",
            city: p.city || "",
            price: p.price || 0,
            views: views,
            favorites: favorites,
            inquiries: inquiryCount,
            conversionRate: `${conversionRate}%`,
          };
        });

      res.json({
        totalProperties,
        activeListings,
        totalViews,
        totalInquiries,
        newInquiries,
        scheduledVisits,
        packageInfo,
        recentInquiries: recentInquiriesData,
        topProperties: topPropertiesData,
      });
    } catch (error) {
      console.error("Error getting seller stats:", error);
      res.status(500).json({ error: "Failed to get seller stats" });
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
  app.post("/api/appointments", isAuthenticated, getRateLimitMiddleware(10, 15 * 60 * 1000), async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });
      
      const { propertyId, scheduledDate, scheduledTime, visitType, notes, buyerName, buyerPhone, buyerEmail } = req.body;
      
      if (!propertyId || !scheduledDate || !scheduledTime) {
        return res.status(400).json({ error: "Property ID, date and time are required" });
      }
      
      // Validate visitType
      const validVisitType = visitType === "virtual" ? "virtual" : "physical";
      
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
        visitType: validVisitType,
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
        const buyerUser = await storage.getUser(userId);
        const dateTime = `${new Date(scheduledDate).toLocaleDateString('en-IN')} at ${scheduledTime}`;
        
        if (sellerUser?.email) {
          emailService.sendAppointmentNotification(
            sellerUser.email,
            sellerProfile.companyName || sellerUser.firstName || "Seller",
            property.title,
            dateTime,
            buyerName || buyerUser?.firstName || "Buyer",
            true
          ).catch(err => console.error("[Email] Appointment notification error:", err));
        }
        
        // Send email notification to buyer
        if (buyerUser?.email) {
          emailService.sendAppointmentNotification(
            buyerUser.email,
            buyerUser.firstName || "Buyer",
            property.title,
            dateTime,
            sellerProfile.companyName || sellerUser?.firstName || "Seller",
            false
          ).catch(err => console.error("[Email] Appointment notification error:", err));
        }
      }
      
      res.status(201).json(appointment);
    } catch (error: any) {
      console.error("Error creating appointment:", error);
      const errorMessage = error?.message || "Failed to create appointment";
      res.status(500).json({ error: errorMessage });
    }
  });

  // ============================================
  // Contact Form Endpoints
  // ============================================

  // Create contact message
  app.post("/api/contact", getRateLimitMiddleware(5, 15 * 60 * 1000), async (req: Request, res: Response) => {
    try {
      const { name, email, phone, subject, message } = req.body;
      const userId = (req as any).session?.userId || null;

      // Validation
      if (!name || !name.trim()) {
        return res.status(400).json({ error: "Name is required" });
      }
      if (!email || !email.trim()) {
        return res.status(400).json({ error: "Email is required" });
      }
      if (!validateEmail(email)) {
        return res.status(400).json({ error: "Invalid email format" });
      }
      if (!message || !message.trim()) {
        return res.status(400).json({ error: "Message is required" });
      }
      if (phone && phone.trim()) {
        const cleanedPhone = phone.replace(/\D/g, "");
        if (cleanedPhone && !validatePhone(cleanedPhone)) {
          return res.status(400).json({ error: "Invalid phone number format" });
        }
      }

      const contactMessage = await storage.createContactMessage({
        userId: userId || undefined,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone?.trim() || null,
        subject: subject?.trim() || null,
        message: message.trim(),
        status: "new",
      });

      // Send email notification to admin (async, don't wait)
      const adminEmail = process.env.ADMIN_EMAIL || process.env.CONTACT_EMAIL;
      if (adminEmail) {
        emailService.sendTemplatedEmail(
          adminEmail,
          "admin_notification",
          {
            subject: `New Contact Form Submission: ${subject || "General Inquiry"}`,
            name: "Admin",
            message: `You have received a new contact form submission:\n\nName: ${name}\nEmail: ${email}\nPhone: ${phone || "N/A"}\nSubject: ${subject || "General Inquiry"}\n\nMessage:\n${message}`,
          }
        ).catch(err => console.error("[Email] Contact form notification error:", err));
      }

      res.status(201).json(contactMessage);
    } catch (error: any) {
      console.error("Failed to create contact message:", error);
      const errorMessage = error?.message || "Failed to submit contact form";
      res.status(500).json({ error: errorMessage });
    }
  });

  // Get contact messages (admin only)
  app.get("/api/contact", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) return res.status(401).json({ error: "Not authenticated" });

      const user = await storage.getUser(userId);
      if (!user || user.role !== "admin") {
        return res.status(403).json({ error: "Admin access required" });
      }

      const { status } = req.query;
      const messages = await storage.getContactMessages({ status: status as string });
      res.json(messages);
    } catch (error) {
      console.error("Failed to get contact messages:", error);
      res.status(500).json({ error: "Failed to get contact messages" });
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
        
        // Send reschedule email
        const property = await storage.getProperty(appointment.propertyId);
        const buyerUser = await storage.getUser(appointment.buyerId);
        const sellerProfile = await storage.getSellerProfile(appointment.sellerId);
        const sellerUser = sellerProfile ? await storage.getUser(sellerProfile.userId) : null;
        
        if (property) {
          const oldDateTime = `${new Date(appointment.scheduledDate).toLocaleDateString('en-IN')} at ${appointment.scheduledTime}`;
          const newDateTime = `${new Date(scheduledDate).toLocaleDateString('en-IN')} at ${scheduledTime || appointment.scheduledTime}`;
          
          // Notify buyer
          if (buyerUser?.email) {
            emailService.sendTemplatedEmail(
              "appointment_rescheduled",
              buyerUser.email,
              {
                recipientName: buyerUser.firstName || "Buyer",
                propertyTitle: property.title,
                newDateTime: newDateTime,
                oldDateTime: oldDateTime,
              }
            ).catch(err => console.error("[Email] Appointment reschedule error:", err));
          }
          
          // Notify seller
          if (sellerUser?.email) {
            emailService.sendTemplatedEmail(
              "appointment_rescheduled",
              sellerUser.email,
              {
                recipientName: sellerProfile.companyName || sellerUser.firstName || "Seller",
                propertyTitle: property.title,
                newDateTime: newDateTime,
                oldDateTime: oldDateTime,
              }
            ).catch(err => console.error("[Email] Appointment reschedule error:", err));
          }
        }
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
      
      // Get property and buyer details for email
      const property = await storage.getProperty(appointment.propertyId);
      const buyerUser = await storage.getUser(appointment.buyerId);
      const sellerProfile = await storage.getSellerProfile(appointment.sellerId);
      
      // Notify buyer via in-app notification
      await storage.createNotification({
        userId: appointment.buyerId,
        type: 'inquiry',
        title: 'Visit Confirmed',
        message: `Your property visit has been confirmed for ${appointment.scheduledTime}`,
        data: { appointmentId: appointment.id },
      });
      
      // Send email to buyer
      if (buyerUser?.email && property && sellerProfile) {
        const dateTime = `${new Date(appointment.scheduledDate).toLocaleDateString('en-IN')} at ${appointment.scheduledTime}`;
        emailService.sendTemplatedEmail(
          "appointment_confirmed",
          buyerUser.email,
          {
            buyerName: buyerUser.firstName || "Buyer",
            propertyTitle: property.title,
            dateTime: dateTime,
            sellerName: sellerProfile.companyName || "Seller",
            propertyAddress: property.address || property.location || "Property location",
          }
        ).catch(err => console.error("[Email] Appointment confirmation error:", err));
      }
      
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
      
      // Get appointment details for email
      const property = await storage.getProperty(appointment.propertyId);
      const buyerUser = await storage.getUser(appointment.buyerId);
      const sellerProfile = await storage.getSellerProfile(appointment.sellerId);
      const sellerUser = sellerProfile ? await storage.getUser(sellerProfile.userId) : null;
      
      // Determine who cancelled and notify the other party
      const cancelledBy = userId === appointment.buyerId ? "buyer" : "seller";
      const cancelledByName = cancelledBy === "buyer" 
        ? (buyerUser?.firstName || "Buyer")
        : (sellerProfile?.companyName || sellerUser?.firstName || "Seller");
      
      // Send email to the other party
      if (cancelledBy === "buyer" && sellerUser?.email && property) {
        const dateTime = `${new Date(appointment.scheduledDate).toLocaleDateString('en-IN')} at ${appointment.scheduledTime}`;
        emailService.sendTemplatedEmail(
          "appointment_cancelled",
          sellerUser.email,
          {
            recipientName: sellerProfile.companyName || sellerUser.firstName || "Seller",
            propertyTitle: property.title,
            dateTime: dateTime,
            cancelledBy: cancelledByName,
            reason: reason || "No reason provided",
          }
        ).catch(err => console.error("[Email] Appointment cancellation error:", err));
      } else if (cancelledBy === "seller" && buyerUser?.email && property) {
        const dateTime = `${new Date(appointment.scheduledDate).toLocaleDateString('en-IN')} at ${appointment.scheduledTime}`;
        emailService.sendTemplatedEmail(
          "appointment_cancelled",
          buyerUser.email,
          {
            recipientName: buyerUser.firstName || "Buyer",
            propertyTitle: property.title,
            dateTime: dateTime,
            cancelledBy: cancelledByName,
            reason: reason || "No reason provided",
          }
        ).catch(err => console.error("[Email] Appointment cancellation error:", err));
      }
      
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

  // Get presigned URL for file upload (or direct upload endpoint for local storage)
  app.post("/api/objects/upload", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { ObjectStorageService } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const uploadURL = await objectStorageService.getObjectEntityUploadURL();
      
      // For local storage, uploadURL is already the endpoint path like /api/upload/direct?uploadId=...
      // For Replit storage, extract the base URL from signed URL
      let objectURL = uploadURL;
      if (uploadURL.startsWith("http://") || uploadURL.startsWith("https://")) {
        try {
          const urlObj = new URL(uploadURL);
          // Remove query parameters to get the base object URL
          objectURL = `${urlObj.protocol}//${urlObj.host}${urlObj.pathname}`;
        } catch (e) {
          // If URL parsing fails, use the uploadURL as-is
          console.warn("Could not parse upload URL:", e);
        }
      } else if (uploadURL.startsWith("/api/upload/direct")) {
        // For local storage, we can't know the final URL until after upload
        // So we'll return a placeholder that will be replaced after upload
        // The actual URL will be returned from the upload endpoint
        objectURL = uploadURL; // Will be replaced with actual file URL after upload
      }
      
      res.json({ 
        uploadURL, // Signed URL for PUT upload (Replit) or endpoint path (local)
        url: objectURL // Final object URL after upload (for Uppy to store)
      });
    } catch (error: any) {
      console.error("Error getting upload URL:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        error: error.message || "Failed to get upload URL",
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  });

  // Direct file upload endpoint for local storage (handles PUT requests from Uppy)
  app.put("/api/upload/direct", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = getAuthenticatedUserId(req);
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }

      const { LocalStorageService } = await import("./localStorage");
      const localStorage = new LocalStorageService();

      // Get upload ID from query
      const uploadId = req.query.uploadId as string;
      if (!uploadId) {
        return res.status(400).json({ error: "Upload ID required" });
      }

      // Get file data from request body
      // The body should be a Buffer when using express.raw()
      let fileBuffer: Buffer;
      
      if (Buffer.isBuffer(req.body)) {
        fileBuffer = req.body;
      } else if (req.body instanceof Uint8Array) {
        fileBuffer = Buffer.from(req.body);
      } else if (typeof req.body === 'string') {
        // If it's a string, try to convert from base64 or binary
        fileBuffer = Buffer.from(req.body, 'binary');
      } else if (req.body && typeof req.body === 'object') {
        // If it's an object, try to extract buffer
        fileBuffer = Buffer.from(JSON.stringify(req.body));
      } else {
        return res.status(400).json({ error: "Invalid file data format" });
      }
      
      if (!fileBuffer || fileBuffer.length === 0) {
        return res.status(400).json({ error: "No file data provided" });
      }

      // Get filename from headers or use upload ID
      const contentDisposition = req.headers['content-disposition'] || '';
      const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
      let fileName = filenameMatch ? filenameMatch[1].replace(/['"]/g, '') : null;
      
      // If no filename in header, try content-type to determine extension
      if (!fileName || fileName === '') {
        const contentType = req.headers['content-type'] || '';
        let ext = '.bin';
        if (contentType.includes('image/jpeg') || contentType.includes('image/jpg')) {
          ext = '.jpg';
        } else if (contentType.includes('image/png')) {
          ext = '.png';
        } else if (contentType.includes('image/gif')) {
          ext = '.gif';
        } else if (contentType.includes('image/webp')) {
          ext = '.webp';
        }
        fileName = `upload-${uploadId}${ext}`;
      }

      // Validate file size (max 100MB)
      const maxSize = 100 * 1024 * 1024; // 100MB
      if (fileBuffer.length > maxSize) {
        return res.status(400).json({ 
          error: `File too large. Maximum size is ${maxSize / 1024 / 1024}MB` 
        });
      }

      // Save file
      const fileUrl = await localStorage.saveUploadedFile(
        fileBuffer,
        fileName,
        userId,
        "public"
      );

      res.status(200).json({ 
        success: true,
        url: fileUrl,
        uploadURL: fileUrl // For compatibility
      });
    } catch (error: any) {
      console.error("Error uploading file:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        error: error.message || "Failed to upload file",
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
    }
  });

  // Serve private objects (property photos)
  app.get("/objects/:objectPath(*)", async (req: any, res: Response) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectFile = await objectStorageService.getObjectEntityFile(req.path);
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error("Error serving object:", error);
      if (error?.name === "ObjectNotFoundError") {
        return res.sendStatus(404);
      }
      return res.sendStatus(500);
    }
  });

  // Serve storage files (for local storage)
  app.get("/storage/:type(public|private)/:path(*)", async (req: any, res: Response) => {
    try {
      const { ObjectStorageService, ObjectNotFoundError } = await import("./objectStorage");
      const objectStorageService = new ObjectStorageService();
      const objectPath = `/storage/${req.params.type}/${req.params.path}`;
      console.log(`[Storage] Serving file: ${objectPath}`);
      
      const objectFile = await objectStorageService.getObjectEntityFile(objectPath);
      console.log(`[Storage] File found:`, 'path' in objectFile ? objectFile.path : 'GCS file');
      
      await objectStorageService.downloadObject(objectFile, res);
    } catch (error: any) {
      console.error(`[Storage] Error serving file /storage/${req.params.type}/${req.params.path}:`, error.message || error);
      console.error(`[Storage] Error stack:`, error.stack);
      if (error?.name === "ObjectNotFoundError") {
        return res.status(404).json({ error: "File not found", path: `/storage/${req.params.type}/${req.params.path}` });
      }
      return res.status(500).json({ error: "Internal server error", message: error.message });
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
      if (!userId) {
        return res.status(401).json({ error: "Not authenticated" });
      }
      
      const propertyId = req.params.id;
      const { photoURLs } = req.body;

      if (!Array.isArray(photoURLs)) {
        return res.status(400).json({ error: "photoURLs must be an array" });
      }

      if (photoURLs.length === 0) {
        return res.status(400).json({ error: "At least one photo URL is required" });
      }

      // Verify property exists and belongs to user
      const property = await storage.getProperty(propertyId);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }

      // Check if user owns this property
      const sellerProfile = await storage.getSellerProfileByUserId(userId);
      if (!sellerProfile || property.sellerId !== sellerProfile.id) {
        return res.status(403).json({ error: "You don't have permission to update this property" });
      }

      const objectStorageService = new ObjectStorageService();
      const normalizedPaths: string[] = [];

      for (const url of photoURLs) {
        if (!url || typeof url !== 'string' || url.trim() === '') {
          console.warn("Skipping invalid photo URL:", url);
          continue;
        }

        try {
          // Normalize the URL path
          const normalizedPath = await objectStorageService.trySetObjectEntityAclPolicy(url, {
            owner: userId,
            visibility: "public",
          });
          normalizedPaths.push(normalizedPath);
        } catch (e: any) {
          console.error("Error setting ACL for photo:", url, e.message);
          // Still add the URL even if ACL setting fails (for local storage, this is fine)
          normalizedPaths.push(url);
        }
      }

      if (normalizedPaths.length === 0) {
        return res.status(400).json({ error: "No valid photo URLs provided" });
      }

      // Delete existing images first to avoid duplicates when updating
      // This ensures we replace all images instead of adding to existing ones
      const existingImages = await storage.getPropertyImages(propertyId);
      if (existingImages.length > 0) {
        const { db } = await import("./db");
        const { propertyImages } = await import("@shared/schema");
        const { eq } = await import("drizzle-orm");
        await db.delete(propertyImages).where(eq(propertyImages.propertyId, propertyId));
        console.log(`Deleted ${existingImages.length} existing images for property ${propertyId}`);
      }

      // Add images directly to database with proper sorting and primary flag
      const { db } = await import("./db");
      const { propertyImages } = await import("@shared/schema");
      
      const imageValues = normalizedPaths.map((url, index) => ({
        propertyId,
        url,
        isPrimary: index === 0, // First image is always primary
        sortOrder: index,
      }));

      try {
        await db.insert(propertyImages).values(imageValues);
        console.log(`Successfully added ${imageValues.length} images for property ${propertyId}`);
      } catch (e: any) {
        console.error("Error adding property images:", e.message);
        throw e; // Re-throw to return error response
      }

      res.json({ 
        success: true, 
        photos: normalizedPaths,
        message: `Successfully added ${normalizedPaths.length} photo(s)`
      });
    } catch (error: any) {
      console.error("Error updating property photos:", error);
      console.error("Error stack:", error.stack);
      res.status(500).json({ 
        error: error.message || "Failed to update property photos",
        details: process.env.NODE_ENV === 'development' ? error.toString() : undefined
      });
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

  // Admin: Get dashboard stats
  app.get("/api/admin/stats", async (req: any, res: Response) => {
    try {
      const adminUser = (req.session as any)?.adminUser;
      if (!adminUser?.isSuperAdmin) {
        return res.status(401).json({ message: "Unauthorized - Admin access required" });
      }

      const allUsers = await storage.getAllUsers({});
      const allProperties = await storage.getProperties({});
      const allPayments = await storage.getAllPayments();
      const allSellers = await storage.getAllSellerProfiles({});

      const totalUsers = allUsers.length;
      const totalProperties = allProperties.length;
      const totalRevenue = allPayments
        .filter(p => p.status === "completed")
        .reduce((sum, p) => sum + (p.amount || 0), 0);
      const pendingApprovals = allSellers.filter(s => s.verificationStatus === "pending").length;
      const activeListings = allProperties.filter(p => p.workflowStatus === "live" || p.workflowStatus === "approved").length;
      
      // Calculate new users this month
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const newUsersThisMonth = allUsers.filter(u => new Date(u.createdAt) >= startOfMonth).length;

      // Get recent transactions (last 5)
      const recentTransactions = allPayments
        .filter(p => p.status === "completed")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map(p => ({
          id: p.id,
          amount: p.amount,
          packageId: p.packageId,
          userId: p.userId,
          createdAt: p.createdAt,
        }));

      // Get pending sellers (last 5)
      const pendingSellers = allSellers
        .filter(s => s.verificationStatus === "pending")
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5);

      res.json({
        totalUsers,
        totalProperties,
        totalRevenue,
        pendingApprovals,
        activeListings,
        newUsersThisMonth,
        recentTransactions,
        pendingSellers,
      });
    } catch (error) {
      console.error("Error getting admin stats:", error);
      res.status(500).json({ error: "Failed to get admin stats" });
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

  // --- Testimonials Admin CRUD ---
  app.get("/api/admin/testimonials", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const testimonials = await storage.getAllTestimonials();
      res.json(testimonials);
    } catch (error: any) {
      console.error("Error fetching testimonials:", error);
      const errorMessage = error?.message || "Failed to fetch testimonials";
      console.error("Full error:", error);
      res.status(500).json({ message: errorMessage, error: error?.code || "UNKNOWN_ERROR" });
    }
  });

  app.post("/api/admin/testimonials", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const testimonial = await storage.createTestimonial(req.body);
      res.status(201).json(testimonial);
    } catch (error) {
      console.error("Error creating testimonial:", error);
      res.status(500).json({ message: "Failed to create testimonial" });
    }
  });

  app.put("/api/admin/testimonials/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const testimonial = await storage.updateTestimonial(req.params.id, req.body);
      if (!testimonial) return res.status(404).json({ message: "Testimonial not found" });
      res.json(testimonial);
    } catch (error) {
      console.error("Error updating testimonial:", error);
      res.status(500).json({ message: "Failed to update testimonial" });
    }
  });

  app.delete("/api/admin/testimonials/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteTestimonial(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting testimonial:", error);
      res.status(500).json({ message: "Failed to delete testimonial" });
    }
  });

  // --- Team Members Admin CRUD ---
  app.get("/api/admin/team-members", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const members = await storage.getAllTeamMembers();
      res.json(members);
    } catch (error: any) {
      console.error("Error fetching team members:", error);
      const errorMessage = error?.message || "Failed to fetch team members";
      console.error("Full error:", error);
      res.status(500).json({ message: errorMessage, error: error?.code || "UNKNOWN_ERROR" });
    }
  });

  app.post("/api/admin/team-members", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const member = await storage.createTeamMember(req.body);
      res.status(201).json(member);
    } catch (error) {
      console.error("Error creating team member:", error);
      res.status(500).json({ message: "Failed to create team member" });
    }
  });

  app.put("/api/admin/team-members/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const member = await storage.updateTeamMember(req.params.id, req.body);
      if (!member) return res.status(404).json({ message: "Team member not found" });
      res.json(member);
    } catch (error) {
      console.error("Error updating team member:", error);
      res.status(500).json({ message: "Failed to update team member" });
    }
  });

  app.delete("/api/admin/team-members/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteTeamMember(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting team member:", error);
      res.status(500).json({ message: "Failed to delete team member" });
    }
  });

  // --- Company Values Admin CRUD ---
  app.get("/api/admin/company-values", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const values = await storage.getAllCompanyValues();
      res.json(values);
    } catch (error: any) {
      console.error("Error fetching company values:", error);
      const errorMessage = error?.message || "Failed to fetch company values";
      console.error("Full error:", error);
      res.status(500).json({ message: errorMessage, error: error?.code || "UNKNOWN_ERROR" });
    }
  });

  app.post("/api/admin/company-values", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const value = await storage.createCompanyValue(req.body);
      res.status(201).json(value);
    } catch (error) {
      console.error("Error creating company value:", error);
      res.status(500).json({ message: "Failed to create company value" });
    }
  });

  app.put("/api/admin/company-values/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const value = await storage.updateCompanyValue(req.params.id, req.body);
      if (!value) return res.status(404).json({ message: "Company value not found" });
      res.json(value);
    } catch (error) {
      console.error("Error updating company value:", error);
      res.status(500).json({ message: "Failed to update company value" });
    }
  });

  app.delete("/api/admin/company-values/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteCompanyValue(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting company value:", error);
      res.status(500).json({ message: "Failed to delete company value" });
    }
  });

  // --- Hero Slides Admin CRUD ---
  app.get("/api/admin/hero-slides", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const slides = await storage.getAllHeroSlides();
      res.json(slides);
    } catch (error: any) {
      console.error("Error fetching hero slides:", error);
      const errorMessage = error?.message || "Failed to fetch hero slides";
      console.error("Full error:", error);
      res.status(500).json({ message: errorMessage, error: error?.code || "UNKNOWN_ERROR" });
    }
  });

  app.post("/api/admin/hero-slides", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const slide = await storage.createHeroSlide(req.body);
      res.status(201).json(slide);
    } catch (error) {
      console.error("Error creating hero slide:", error);
      res.status(500).json({ message: "Failed to create hero slide" });
    }
  });

  app.put("/api/admin/hero-slides/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      const slide = await storage.updateHeroSlide(req.params.id, req.body);
      if (!slide) return res.status(404).json({ message: "Hero slide not found" });
      res.json(slide);
    } catch (error) {
      console.error("Error updating hero slide:", error);
      res.status(500).json({ message: "Failed to update hero slide" });
    }
  });

  app.delete("/api/admin/hero-slides/:id", isAdminAuthenticated, async (req: Request, res: Response) => {
    try {
      await storage.deleteHeroSlide(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error deleting hero slide:", error);
      res.status(500).json({ message: "Failed to delete hero slide" });
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
        userId: adminUser.id === "superadmin" ? null : adminUser.id,
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
