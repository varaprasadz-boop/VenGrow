import { 
  type User, type InsertUser, type UpsertUser,
  type SellerProfile, type InsertSellerProfile,
  type Package, type InsertPackage,
  type Property, type InsertProperty,
  type PropertyImage, type PropertyDocument,
  type Inquiry, type InsertInquiry,
  type Favorite, type InsertFavorite,
  type SavedSearch, type PropertyView,
  type ChatThread, type ChatMessage, type InsertChatMessage,
  type Notification, type InsertNotification,
  type Payment, type InsertPayment,
  type Review, type InsertReview,
  type AdminApproval, type AuditLog, type SystemSetting,
  type SellerSubscription, type PropertyAlert,
  users, sellerProfiles, packages, properties, propertyImages, propertyDocuments,
  inquiries, favorites, savedSearches, propertyViews,
  chatThreads, chatMessages, notifications, payments, reviews,
  adminApprovals, auditLogs, systemSettings, sellerSubscriptions, propertyAlerts
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, like, or, sql, gte, lte, inArray } from "drizzle-orm";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  getAllUsers(filters?: { role?: string; isActive?: boolean }): Promise<User[]>;
  
  getSellerProfile(id: string): Promise<SellerProfile | undefined>;
  getSellerProfileByUserId(userId: string): Promise<SellerProfile | undefined>;
  createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile>;
  updateSellerProfile(id: string, data: Partial<InsertSellerProfile>): Promise<SellerProfile | undefined>;
  getAllSellerProfiles(filters?: { verificationStatus?: string; sellerType?: string }): Promise<SellerProfile[]>;
  
  getPackages(): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined>;
  
  getProperty(id: string): Promise<Property | undefined>;
  getPropertiesBySeller(sellerId: string): Promise<Property[]>;
  getProperties(filters?: PropertyFilters): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, data: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: string): Promise<boolean>;
  incrementPropertyView(id: string): Promise<void>;
  
  getPropertyImages(propertyId: string): Promise<PropertyImage[]>;
  addPropertyImage(propertyId: string, url: string, isPrimary?: boolean): Promise<PropertyImage>;
  deletePropertyImage(id: string): Promise<boolean>;
  
  getInquiry(id: string): Promise<Inquiry | undefined>;
  getInquiriesByBuyer(buyerId: string): Promise<Inquiry[]>;
  getInquiriesBySeller(sellerId: string): Promise<Inquiry[]>;
  getInquiriesByProperty(propertyId: string): Promise<Inquiry[]>;
  createInquiry(inquiry: InsertInquiry): Promise<Inquiry>;
  updateInquiry(id: string, data: Partial<InsertInquiry>): Promise<Inquiry | undefined>;
  
  getFavorites(userId: string): Promise<Favorite[]>;
  getFavoriteProperties(userId: string): Promise<Property[]>;
  addFavorite(userId: string, propertyId: string): Promise<Favorite>;
  removeFavorite(userId: string, propertyId: string): Promise<boolean>;
  isFavorite(userId: string, propertyId: string): Promise<boolean>;
  
  getSavedSearches(userId: string): Promise<SavedSearch[]>;
  createSavedSearch(userId: string, name: string, filters: Record<string, unknown>): Promise<SavedSearch>;
  deleteSavedSearch(id: string): Promise<boolean>;
  
  getChatThreads(userId: string): Promise<ChatThread[]>;
  getChatThread(id: string): Promise<ChatThread | undefined>;
  getOrCreateChatThread(buyerId: string, sellerId: string, propertyId?: string): Promise<ChatThread>;
  getChatMessages(threadId: string): Promise<ChatMessage[]>;
  sendChatMessage(message: InsertChatMessage): Promise<ChatMessage>;
  markMessagesAsRead(threadId: string, userId: string): Promise<void>;
  
  getNotifications(userId: string): Promise<Notification[]>;
  getUnreadNotificationCount(userId: string): Promise<number>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<void>;
  markAllNotificationsAsRead(userId: string): Promise<void>;
  
  getPayments(userId: string): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined>;
  
  getReviewsBySeller(sellerId: string): Promise<Review[]>;
  createReview(review: InsertReview): Promise<Review>;
  
  getPendingApprovals(type?: string): Promise<AdminApproval[]>;
  updateApproval(id: string, status: string, reviewedBy: string, notes?: string): Promise<AdminApproval | undefined>;
  
  getAuditLogs(filters?: { userId?: string; action?: string; entityType?: string }): Promise<AuditLog[]>;
  createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog>;
  
  getSystemSetting(key: string): Promise<SystemSetting | undefined>;
  setSystemSetting(key: string, value: unknown, updatedBy?: string): Promise<SystemSetting>;
  
  getActiveSubscription(sellerId: string): Promise<SellerSubscription | undefined>;
  createSubscription(sellerId: string, packageId: string, endDate: Date): Promise<SellerSubscription>;
  
  getDashboardStats(role: string, userId?: string): Promise<Record<string, number>>;
}

export interface PropertyFilters {
  city?: string;
  state?: string;
  propertyType?: string;
  transactionType?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  status?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  sellerId?: string;
  search?: string;
  limit?: number;
  offset?: number;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set({ ...data, updatedAt: new Date() }).where(eq(users.id, id)).returning();
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async getAllUsers(filters?: { role?: string; isActive?: boolean }): Promise<User[]> {
    let query = db.select().from(users);
    if (filters?.role) {
      query = query.where(eq(users.role, filters.role as any)) as any;
    }
    if (filters?.isActive !== undefined) {
      query = query.where(eq(users.isActive, filters.isActive)) as any;
    }
    return query.orderBy(desc(users.createdAt));
  }

  async getSellerProfile(id: string): Promise<SellerProfile | undefined> {
    const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.id, id));
    return profile;
  }

  async getSellerProfileByUserId(userId: string): Promise<SellerProfile | undefined> {
    const [profile] = await db.select().from(sellerProfiles).where(eq(sellerProfiles.userId, userId));
    return profile;
  }

  async createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile> {
    const [created] = await db.insert(sellerProfiles).values(profile as any).returning();
    return created;
  }

  async updateSellerProfile(id: string, data: Partial<InsertSellerProfile>): Promise<SellerProfile | undefined> {
    const [updated] = await db.update(sellerProfiles).set({ ...data, updatedAt: new Date() } as any).where(eq(sellerProfiles.id, id)).returning();
    return updated;
  }

  async getAllSellerProfiles(filters?: { verificationStatus?: string; sellerType?: string }): Promise<SellerProfile[]> {
    let query = db.select().from(sellerProfiles);
    if (filters?.verificationStatus) {
      query = query.where(eq(sellerProfiles.verificationStatus, filters.verificationStatus as any)) as any;
    }
    if (filters?.sellerType) {
      query = query.where(eq(sellerProfiles.sellerType, filters.sellerType as any)) as any;
    }
    return query.orderBy(desc(sellerProfiles.createdAt));
  }

  async getPackages(): Promise<Package[]> {
    return db.select().from(packages).where(eq(packages.isActive, true)).orderBy(packages.price);
  }

  async getPackage(id: string): Promise<Package | undefined> {
    const [pkg] = await db.select().from(packages).where(eq(packages.id, id));
    return pkg;
  }

  async createPackage(pkg: InsertPackage): Promise<Package> {
    const [created] = await db.insert(packages).values(pkg as any).returning();
    return created;
  }

  async updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined> {
    const [updated] = await db.update(packages).set(data as any).where(eq(packages.id, id)).returning();
    return updated;
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async getPropertiesBySeller(sellerId: string): Promise<Property[]> {
    return db.select().from(properties).where(eq(properties.sellerId, sellerId)).orderBy(desc(properties.createdAt));
  }

  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    let query = db.select().from(properties);
    const conditions: any[] = [];
    
    if (filters?.city) conditions.push(eq(properties.city, filters.city));
    if (filters?.state) conditions.push(eq(properties.state, filters.state));
    if (filters?.propertyType) conditions.push(eq(properties.propertyType, filters.propertyType as any));
    if (filters?.transactionType) conditions.push(eq(properties.transactionType, filters.transactionType as any));
    if (filters?.minPrice) conditions.push(gte(properties.price, filters.minPrice));
    if (filters?.maxPrice) conditions.push(lte(properties.price, filters.maxPrice));
    if (filters?.minArea) conditions.push(gte(properties.area, filters.minArea));
    if (filters?.maxArea) conditions.push(lte(properties.area, filters.maxArea));
    if (filters?.bedrooms) conditions.push(eq(properties.bedrooms, filters.bedrooms));
    if (filters?.status) conditions.push(eq(properties.status, filters.status as any));
    if (filters?.isVerified !== undefined) conditions.push(eq(properties.isVerified, filters.isVerified));
    if (filters?.isFeatured !== undefined) conditions.push(eq(properties.isFeatured, filters.isFeatured));
    if (filters?.sellerId) conditions.push(eq(properties.sellerId, filters.sellerId));
    if (filters?.search) {
      conditions.push(or(
        like(properties.title, `%${filters.search}%`),
        like(properties.city, `%${filters.search}%`),
        like(properties.locality, `%${filters.search}%`)
      ));
    }
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    let result = query.orderBy(desc(properties.createdAt));
    
    if (filters?.limit) {
      result = result.limit(filters.limit) as any;
    }
    if (filters?.offset) {
      result = result.offset(filters.offset) as any;
    }
    
    return result;
  }

  async getFeaturedProperties(limit: number = 10): Promise<Property[]> {
    return db.select().from(properties)
      .where(and(eq(properties.isFeatured, true), eq(properties.status, 'active')))
      .orderBy(desc(properties.createdAt))
      .limit(limit);
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property as any).returning();
    return created;
  }

  async updateProperty(id: string, data: Partial<InsertProperty>): Promise<Property | undefined> {
    const [updated] = await db.update(properties).set({ ...data, updatedAt: new Date() } as any).where(eq(properties.id, id)).returning();
    return updated;
  }

  async deleteProperty(id: string): Promise<boolean> {
    const result = await db.delete(properties).where(eq(properties.id, id));
    return true;
  }

  async incrementPropertyView(id: string): Promise<void> {
    await db.update(properties).set({ viewCount: sql`${properties.viewCount} + 1` }).where(eq(properties.id, id));
  }

  async getPropertyImages(propertyId: string): Promise<PropertyImage[]> {
    return db.select().from(propertyImages).where(eq(propertyImages.propertyId, propertyId)).orderBy(propertyImages.sortOrder);
  }

  async addPropertyImage(propertyId: string, url: string, isPrimary: boolean = false): Promise<PropertyImage> {
    const [image] = await db.insert(propertyImages).values({ propertyId, url, isPrimary }).returning();
    return image;
  }

  async deletePropertyImage(id: string): Promise<boolean> {
    await db.delete(propertyImages).where(eq(propertyImages.id, id));
    return true;
  }

  async getInquiry(id: string): Promise<Inquiry | undefined> {
    const [inquiry] = await db.select().from(inquiries).where(eq(inquiries.id, id));
    return inquiry;
  }

  async getInquiriesByBuyer(buyerId: string): Promise<Inquiry[]> {
    return db.select().from(inquiries).where(eq(inquiries.buyerId, buyerId)).orderBy(desc(inquiries.createdAt));
  }

  async getInquiriesBySeller(sellerId: string): Promise<Inquiry[]> {
    return db.select().from(inquiries).where(eq(inquiries.sellerId, sellerId)).orderBy(desc(inquiries.createdAt));
  }

  async getInquiriesByProperty(propertyId: string): Promise<Inquiry[]> {
    return db.select().from(inquiries).where(eq(inquiries.propertyId, propertyId)).orderBy(desc(inquiries.createdAt));
  }

  async createInquiry(inquiry: InsertInquiry): Promise<Inquiry> {
    const [created] = await db.insert(inquiries).values(inquiry).returning();
    await db.update(properties).set({ inquiryCount: sql`${properties.inquiryCount} + 1` }).where(eq(properties.id, inquiry.propertyId));
    return created;
  }

  async updateInquiry(id: string, data: Partial<InsertInquiry>): Promise<Inquiry | undefined> {
    const [updated] = await db.update(inquiries).set({ ...data, updatedAt: new Date() }).where(eq(inquiries.id, id)).returning();
    return updated;
  }

  async getFavorites(userId: string): Promise<Favorite[]> {
    return db.select().from(favorites).where(eq(favorites.userId, userId)).orderBy(desc(favorites.createdAt));
  }

  async getFavoriteProperties(userId: string): Promise<Property[]> {
    const favs = await this.getFavorites(userId);
    if (favs.length === 0) return [];
    const propertyIds = favs.map(f => f.propertyId);
    return db.select().from(properties).where(inArray(properties.id, propertyIds));
  }

  async addFavorite(userId: string, propertyId: string): Promise<Favorite> {
    const [fav] = await db.insert(favorites).values({ userId, propertyId }).returning();
    await db.update(properties).set({ favoriteCount: sql`${properties.favoriteCount} + 1` }).where(eq(properties.id, propertyId));
    return fav;
  }

  async removeFavorite(userId: string, propertyId: string): Promise<boolean> {
    await db.delete(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
    await db.update(properties).set({ favoriteCount: sql`${properties.favoriteCount} - 1` }).where(eq(properties.id, propertyId));
    return true;
  }

  async isFavorite(userId: string, propertyId: string): Promise<boolean> {
    const [fav] = await db.select().from(favorites).where(and(eq(favorites.userId, userId), eq(favorites.propertyId, propertyId)));
    return !!fav;
  }

  async getSavedSearches(userId: string): Promise<SavedSearch[]> {
    return db.select().from(savedSearches).where(eq(savedSearches.userId, userId)).orderBy(desc(savedSearches.createdAt));
  }

  async createSavedSearch(userId: string, name: string, filters: Record<string, unknown>): Promise<SavedSearch> {
    const [search] = await db.insert(savedSearches).values({ userId, name, filters }).returning();
    return search;
  }

  async deleteSavedSearch(id: string): Promise<boolean> {
    await db.delete(savedSearches).where(eq(savedSearches.id, id));
    return true;
  }

  async getChatThreads(userId: string): Promise<ChatThread[]> {
    return db.select().from(chatThreads)
      .where(or(eq(chatThreads.buyerId, userId), eq(chatThreads.sellerId, userId)))
      .orderBy(desc(chatThreads.lastMessageAt));
  }

  async getChatThread(id: string): Promise<ChatThread | undefined> {
    const [thread] = await db.select().from(chatThreads).where(eq(chatThreads.id, id));
    return thread;
  }

  async getOrCreateChatThread(buyerId: string, sellerId: string, propertyId?: string): Promise<ChatThread> {
    const conditions = [eq(chatThreads.buyerId, buyerId), eq(chatThreads.sellerId, sellerId)];
    if (propertyId) conditions.push(eq(chatThreads.propertyId, propertyId));
    
    const [existing] = await db.select().from(chatThreads).where(and(...conditions));
    if (existing) return existing;
    
    const [thread] = await db.insert(chatThreads).values({ buyerId, sellerId, propertyId }).returning();
    return thread;
  }

  async getChatMessages(threadId: string): Promise<ChatMessage[]> {
    return db.select().from(chatMessages).where(eq(chatMessages.threadId, threadId)).orderBy(chatMessages.createdAt);
  }

  async sendChatMessage(message: InsertChatMessage): Promise<ChatMessage> {
    const [created] = await db.insert(chatMessages).values(message as any).returning();
    await db.update(chatThreads).set({ lastMessageAt: new Date() }).where(eq(chatThreads.id, message.threadId));
    return created;
  }

  async markMessagesAsRead(threadId: string, userId: string): Promise<void> {
    await db.update(chatMessages)
      .set({ isRead: true })
      .where(and(eq(chatMessages.threadId, threadId), eq(chatMessages.senderId, userId)));
  }

  async getNotifications(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt)).limit(50);
  }

  async getUnreadNotificationCount(userId: string): Promise<number> {
    const result = await db.select({ count: sql<number>`count(*)` }).from(notifications)
      .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
    return result[0]?.count ?? 0;
  }

  async createNotification(notification: InsertNotification): Promise<Notification> {
    const [created] = await db.insert(notifications).values(notification).returning();
    return created;
  }

  async markNotificationAsRead(id: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.id, id));
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ isRead: true }).where(eq(notifications.userId, userId));
  }

  async getPayments(userId: string): Promise<Payment[]> {
    return db.select().from(payments).where(eq(payments.userId, userId)).orderBy(desc(payments.createdAt));
  }

  async getAllPayments(): Promise<Payment[]> {
    return db.select().from(payments).orderBy(desc(payments.createdAt));
  }

  async getPayment(id: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    return payment;
  }

  async createPayment(payment: InsertPayment): Promise<Payment> {
    const [created] = await db.insert(payments).values(payment).returning();
    return created;
  }

  async updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined> {
    const [updated] = await db.update(payments).set({ ...data, updatedAt: new Date() }).where(eq(payments.id, id)).returning();
    return updated;
  }

  async getReviewsBySeller(sellerId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.sellerId, sellerId)).orderBy(desc(reviews.createdAt));
  }

  async createReview(review: InsertReview): Promise<Review> {
    const [created] = await db.insert(reviews).values(review).returning();
    return created;
  }

  async getPendingApprovals(type?: string): Promise<AdminApproval[]> {
    const conditions: any[] = [eq(adminApprovals.status, 'pending')];
    if (type) {
      conditions.push(eq(adminApprovals.type, type));
    }
    return db.select().from(adminApprovals).where(and(...conditions)).orderBy(desc(adminApprovals.createdAt));
  }

  async updateApproval(id: string, status: string, reviewedBy: string, notes?: string): Promise<AdminApproval | undefined> {
    const [updated] = await db.update(adminApprovals)
      .set({ status: status as any, reviewedBy, reviewNotes: notes, reviewedAt: new Date() })
      .where(eq(adminApprovals.id, id))
      .returning();
    return updated;
  }

  async getAuditLogs(filters?: { userId?: string; action?: string; entityType?: string }): Promise<AuditLog[]> {
    let query = db.select().from(auditLogs);
    const conditions: any[] = [];
    
    if (filters?.userId) conditions.push(eq(auditLogs.userId, filters.userId));
    if (filters?.action) conditions.push(eq(auditLogs.action, filters.action));
    if (filters?.entityType) conditions.push(eq(auditLogs.entityType, filters.entityType));
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return query.orderBy(desc(auditLogs.createdAt)).limit(100);
  }

  async createAuditLog(log: Omit<AuditLog, 'id' | 'createdAt'>): Promise<AuditLog> {
    const [created] = await db.insert(auditLogs).values(log).returning();
    return created;
  }

  async getSystemSetting(key: string): Promise<SystemSetting | undefined> {
    const [setting] = await db.select().from(systemSettings).where(eq(systemSettings.key, key));
    return setting;
  }

  async setSystemSetting(key: string, value: unknown, updatedBy?: string): Promise<SystemSetting> {
    const existing = await this.getSystemSetting(key);
    if (existing) {
      const [updated] = await db.update(systemSettings)
        .set({ value, updatedBy, updatedAt: new Date() })
        .where(eq(systemSettings.key, key))
        .returning();
      return updated;
    }
    const [created] = await db.insert(systemSettings).values({ key, value, updatedBy }).returning();
    return created;
  }

  async getActiveSubscription(sellerId: string): Promise<SellerSubscription | undefined> {
    const [sub] = await db.select().from(sellerSubscriptions)
      .where(and(eq(sellerSubscriptions.sellerId, sellerId), eq(sellerSubscriptions.isActive, true)))
      .orderBy(desc(sellerSubscriptions.endDate))
      .limit(1);
    return sub;
  }

  async createSubscription(sellerId: string, packageId: string, endDate: Date): Promise<SellerSubscription> {
    const [sub] = await db.insert(sellerSubscriptions).values({ sellerId, packageId, endDate }).returning();
    return sub;
  }

  async getDashboardStats(role: string, userId?: string): Promise<Record<string, number>> {
    const stats: Record<string, number> = {};
    
    if (role === 'admin') {
      const [usersCount] = await db.select({ count: sql<number>`count(*)` }).from(users);
      const [sellersCount] = await db.select({ count: sql<number>`count(*)` }).from(sellerProfiles);
      const [propertiesCount] = await db.select({ count: sql<number>`count(*)` }).from(properties);
      const [pendingCount] = await db.select({ count: sql<number>`count(*)` }).from(adminApprovals).where(eq(adminApprovals.status, 'pending'));
      
      stats.totalUsers = usersCount?.count ?? 0;
      stats.totalSellers = sellersCount?.count ?? 0;
      stats.totalProperties = propertiesCount?.count ?? 0;
      stats.pendingApprovals = pendingCount?.count ?? 0;
    } else if (role === 'seller' && userId) {
      const profile = await this.getSellerProfileByUserId(userId);
      if (profile) {
        const [listingsCount] = await db.select({ count: sql<number>`count(*)` }).from(properties).where(eq(properties.sellerId, profile.id));
        const [inquiriesCount] = await db.select({ count: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.sellerId, profile.id));
        const [viewsSum] = await db.select({ sum: sql<number>`sum(view_count)` }).from(properties).where(eq(properties.sellerId, profile.id));
        
        stats.totalListings = listingsCount?.count ?? 0;
        stats.totalInquiries = inquiriesCount?.count ?? 0;
        stats.totalViews = viewsSum?.sum ?? 0;
      }
    } else if (role === 'buyer' && userId) {
      const [favsCount] = await db.select({ count: sql<number>`count(*)` }).from(favorites).where(eq(favorites.userId, userId));
      const [inquiriesCount] = await db.select({ count: sql<number>`count(*)` }).from(inquiries).where(eq(inquiries.buyerId, userId));
      
      stats.totalFavorites = favsCount?.count ?? 0;
      stats.totalInquiries = inquiriesCount?.count ?? 0;
    }
    
    return stats;
  }
}

export const storage = new DatabaseStorage();
