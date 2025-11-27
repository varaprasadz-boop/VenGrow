import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { insertPropertySchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";
import { setupAuth, isAuthenticated } from "./replitAuth";

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  await setupAuth(app);

  // ============================================
  // AUTHENTICATION ROUTES
  // ============================================
  
  // Get current authenticated user
  app.get("/api/auth/user", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
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
  app.post("/api/properties", async (req: Request, res: Response) => {
    try {
      const property = await storage.createProperty(req.body);
      res.status(201).json(property);
    } catch (error) {
      res.status(500).json({ error: "Failed to create property" });
    }
  });

  // Update property
  app.patch("/api/properties/:id", async (req: Request, res: Response) => {
    try {
      const property = await storage.updateProperty(req.params.id, req.body);
      if (!property) {
        return res.status(404).json({ error: "Property not found" });
      }
      res.json(property);
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
  // FAVORITES ROUTES
  // ============================================
  
  // Get current user's favorites (authenticated)
  app.get("/api/me/favorites", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const inquiry = await storage.createInquiry(req.body);
      res.status(201).json(inquiry);
    } catch (error) {
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

  // ============================================
  // PAYMENT ROUTES
  // ============================================

  // Check Razorpay configuration status
  app.get("/api/razorpay/status", async (req: Request, res: Response) => {
    try {
      const { isRazorpayConfigured, getKeyId } = await import("./razorpay");
      res.json({
        configured: isRazorpayConfigured(),
        keyId: isRazorpayConfigured() ? getKeyId() : null,
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

  // Get current user's dashboard stats (authenticated)
  app.get("/api/me/dashboard", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const profile = await storage.getSellerProfileByUserId(userId);
      res.json(profile);
    } catch (error) {
      res.status(500).json({ error: "Failed to get seller profile" });
    }
  });

  // Get current seller's properties
  app.get("/api/me/properties", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
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

  // Get current seller's subscription
  app.get("/api/me/subscription", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
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
      const userId = req.user.claims.sub;
      const payments = await storage.getPayments(userId);
      res.json(payments);
    } catch (error) {
      res.status(500).json({ error: "Failed to get payments" });
    }
  });

  // Get current seller's reviews
  app.get("/api/me/reviews", isAuthenticated, async (req: any, res: Response) => {
    try {
      const userId = req.user.claims.sub;
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

  const httpServer = createServer(app);

  return httpServer;
}
