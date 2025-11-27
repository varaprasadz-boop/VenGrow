import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { seedDatabase } from "./seed";
import { insertPropertySchema, insertInquirySchema } from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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

  const httpServer = createServer(app);

  return httpServer;
}
