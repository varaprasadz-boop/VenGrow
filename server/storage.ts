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
  type FaqItem, type StaticPage, type Banner, type PlatformSetting,
  type PopularCity, type NavigationLink, type PropertyTypeManaged, type SiteSetting,
  type EmailTemplate,
  type PropertyCategory, type PropertySubcategory,
  type VerifiedBuilder, type InsertVerifiedBuilder,
  type Project, type InsertProject,
  type Appointment, type InsertAppointment,
  type ContactMessage, type InsertContactMessage,
  type Testimonial, type InsertTestimonial,
  type TeamMember, type InsertTeamMember,
  type CompanyValue, type InsertCompanyValue,
  type HeroSlide, type InsertHeroSlide,
  users, sellerProfiles, packages, properties, propertyImages, propertyDocuments,
  inquiries, favorites, savedSearches, propertyViews, appointments,
  chatThreads, chatMessages, notifications, payments, reviews,
  contactMessages,
  adminApprovals, auditLogs, systemSettings, sellerSubscriptions, propertyAlerts,
  propertyApprovalRequests, faqItems, staticPages, banners, platformSettings,
  popularCities, navigationLinks, propertyTypesManaged, siteSettings, emailTemplates,
  propertyCategories, propertySubcategories, verifiedBuilders, projects,
  testimonials, teamMembers, companyValues, heroSlides, invoices
} from "@shared/schema";
import { db, pool } from "./db";
import { eq, desc, and, like, or, sql, gte, lte, inArray } from "drizzle-orm";

export interface CreateUserWithPassword {
  email: string;
  passwordHash: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  intent?: string;
  role?: string;
  authProvider?: string;
}

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  createUserWithPassword(data: CreateUserWithPassword): Promise<User>;
  updateUser(id: string, data: Partial<InsertUser>): Promise<User | undefined>;
  updateUserLastLogin(id: string): Promise<void>;
  upsertUser(user: UpsertUser): Promise<User>;
  addRole(userId: string, role: "buyer" | "seller"): Promise<User | undefined>;
  getAllUsers(filters?: { role?: string; isActive?: boolean }): Promise<User[]>;
  
  getSellerProfile(id: string): Promise<SellerProfile | undefined>;
  getSellerProfileByUserId(userId: string): Promise<SellerProfile | undefined>;
  createSellerProfile(profile: InsertSellerProfile): Promise<SellerProfile>;
  updateSellerProfile(id: string, data: Partial<InsertSellerProfile>): Promise<SellerProfile | undefined>;
  getAllSellerProfiles(filters?: { verificationStatus?: string; sellerType?: string }): Promise<SellerProfile[]>;
  
  getPackages(sellerType?: string): Promise<Package[]>;
  getPackage(id: string): Promise<Package | undefined>;
  createPackage(pkg: InsertPackage): Promise<Package>;
  updatePackage(id: string, data: Partial<InsertPackage>): Promise<Package | undefined>;
  deletePackage(id: string): Promise<boolean>;
  
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
  updateSavedSearch(id: string, data: { alertEnabled?: boolean; name?: string }): Promise<SavedSearch | undefined>;
  
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
  deleteNotification(id: string): Promise<boolean>;
  
  getAppointment(id: string): Promise<Appointment | undefined>;
  getAppointmentsByBuyer(buyerId: string): Promise<Appointment[]>;
  getAppointmentsBySeller(sellerId: string): Promise<Appointment[]>;
  getAppointmentsBySellerUserId(userId: string): Promise<Appointment[]>;
  getAppointmentsByProperty(propertyId: string): Promise<Appointment[]>;
  getAppointmentsByPropertyIds(propertyIds: string[]): Promise<Appointment[]>;
  createAppointment(appointment: InsertAppointment): Promise<Appointment>;
  updateAppointment(id: string, data: Partial<InsertAppointment>): Promise<Appointment | undefined>;
  cancelAppointment(id: string, reason?: string): Promise<Appointment | undefined>;
  confirmAppointment(id: string): Promise<Appointment | undefined>;
  completeAppointment(id: string): Promise<Appointment | undefined>;
  
  createContactMessage(message: InsertContactMessage): Promise<ContactMessage>;
  getContactMessages(filters?: { userId?: string; status?: string }): Promise<ContactMessage[]>;
  getContactMessage(id: string): Promise<ContactMessage | undefined>;
  updateContactMessage(id: string, data: Partial<InsertContactMessage>): Promise<ContactMessage | undefined>;
  
  getPayments(userId: string): Promise<Payment[]>;
  getAllPayments(): Promise<Payment[]>;
  getPayment(id: string): Promise<Payment | undefined>;
  getPaymentByRazorpayOrderId(orderId: string): Promise<Payment | undefined>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: string, data: Partial<InsertPayment>): Promise<Payment | undefined>;
  
  getReviewsBySeller(sellerId: string): Promise<Review[]>;
  getReviewsByUserId(userId: string): Promise<Review[]>;
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
  
  getAllInvoices(): Promise<any[]>;
  getInvoice(id: string): Promise<any | undefined>;
  
  getEmailTemplates(): Promise<any[]>;
  getEmailTemplate(id: string): Promise<any | undefined>;
  createEmailTemplate(data: any): Promise<any>;
  updateEmailTemplate(id: string, data: any): Promise<any | undefined>;
  deleteEmailTemplate(id: string): Promise<boolean>;
  
  getAllInquiries(filters?: { source?: string; status?: string }): Promise<Inquiry[]>;
  
  // Content Management
  getFaqItems(): Promise<FaqItem[]>;
  getFaqItemsByCategory(category: string): Promise<FaqItem[]>;
  getAllFaqItems(): Promise<FaqItem[]>;
  createFaqItem(data: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FaqItem>;
  updateFaqItem(id: string, data: Partial<FaqItem>): Promise<FaqItem | undefined>;
  deleteFaqItem(id: string): Promise<boolean>;
  
  getStaticPageBySlug(slug: string): Promise<StaticPage | undefined>;
  getStaticPages(): Promise<StaticPage[]>;
  getAllStaticPages(): Promise<StaticPage[]>;
  createStaticPage(data: Omit<StaticPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaticPage>;
  updateStaticPage(id: string, data: Partial<StaticPage>): Promise<StaticPage | undefined>;
  deleteStaticPage(id: string): Promise<boolean>;
  
  getBanners(position?: string): Promise<Banner[]>;
  getAllBanners(): Promise<Banner[]>;
  createBanner(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner>;
  updateBanner(id: string, data: Partial<Banner>): Promise<Banner | undefined>;
  deleteBanner(id: string): Promise<boolean>;
  
  getAllTestimonials(): Promise<Testimonial[]>;
  createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial>;
  updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | undefined>;
  deleteTestimonial(id: string): Promise<boolean>;
  
  getAllTeamMembers(): Promise<TeamMember[]>;
  createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember>;
  updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | undefined>;
  deleteTeamMember(id: string): Promise<boolean>;
  
  getAllCompanyValues(): Promise<CompanyValue[]>;
  createCompanyValue(data: Omit<CompanyValue, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyValue>;
  updateCompanyValue(id: string, data: Partial<CompanyValue>): Promise<CompanyValue | undefined>;
  deleteCompanyValue(id: string): Promise<boolean>;
  
  getAllHeroSlides(): Promise<HeroSlide[]>;
  createHeroSlide(data: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeroSlide>;
  updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<HeroSlide | undefined>;
  deleteHeroSlide(id: string): Promise<boolean>;
  
  getPlatformSettings(category?: string): Promise<PlatformSetting[]>;
  
  // Dynamic Content Management
  getPopularCities(): Promise<PopularCity[]>;
  getPopularCityBySlug(slug: string): Promise<PopularCity | undefined>;
  getAllPopularCities(): Promise<PopularCity[]>;
  createPopularCity(data: Omit<PopularCity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PopularCity>;
  updatePopularCity(id: string, data: Partial<PopularCity>): Promise<PopularCity | undefined>;
  deletePopularCity(id: string): Promise<boolean>;
  
  getNavigationLinks(position?: string, section?: string): Promise<NavigationLink[]>;
  getAllNavigationLinks(): Promise<NavigationLink[]>;
  createNavigationLink(data: Omit<NavigationLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<NavigationLink>;
  updateNavigationLink(id: string, data: Partial<NavigationLink>): Promise<NavigationLink | undefined>;
  deleteNavigationLink(id: string): Promise<boolean>;
  
  getPropertyTypes(): Promise<PropertyTypeManaged[]>;
  getAllPropertyTypes(): Promise<PropertyTypeManaged[]>;
  createPropertyType(data: Omit<PropertyTypeManaged, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyTypeManaged>;
  updatePropertyType(id: string, data: Partial<PropertyTypeManaged>): Promise<PropertyTypeManaged | undefined>;
  deletePropertyType(id: string): Promise<boolean>;
  
  getSiteSettings(category?: string): Promise<SiteSetting[]>;
  getSiteSetting(key: string): Promise<SiteSetting | undefined>;
  createSiteSetting(data: Omit<SiteSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<SiteSetting>;
  updateSiteSetting(id: string, data: Partial<SiteSetting>): Promise<SiteSetting | undefined>;
  deleteSiteSetting(id: string): Promise<boolean>;
  
  // Property Categories
  getPropertyCategories(): Promise<PropertyCategory[]>;
  getPropertyCategory(id: string): Promise<PropertyCategory | undefined>;
  getPropertyCategoryBySlug(slug: string): Promise<PropertyCategory | undefined>;
  createPropertyCategory(data: Omit<PropertyCategory, 'id' | 'createdAt' | 'updatedAt' | 'propertyCount'>): Promise<PropertyCategory>;
  updatePropertyCategory(id: string, data: Partial<PropertyCategory>): Promise<PropertyCategory | undefined>;
  deletePropertyCategory(id: string): Promise<boolean>;
  
  // Property Subcategories
  getPropertySubcategories(categoryId?: string): Promise<PropertySubcategory[]>;
  getPropertySubcategory(id: string): Promise<PropertySubcategory | undefined>;
  createPropertySubcategory(data: Omit<PropertySubcategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertySubcategory>;
  updatePropertySubcategory(id: string, data: Partial<PropertySubcategory>): Promise<PropertySubcategory | undefined>;
  deletePropertySubcategory(id: string): Promise<boolean>;
  
  // Verified Builders (Builder/Corporate landing pages)
  getVerifiedBuilders(filters?: { showOnHomepage?: boolean; isActive?: boolean }): Promise<VerifiedBuilder[]>;
  getVerifiedBuilder(id: string): Promise<VerifiedBuilder | undefined>;
  getVerifiedBuilderBySlug(slug: string): Promise<VerifiedBuilder | undefined>;
  getVerifiedBuilderBySellerId(sellerId: string): Promise<VerifiedBuilder | undefined>;
  createVerifiedBuilder(data: InsertVerifiedBuilder): Promise<VerifiedBuilder>;
  updateVerifiedBuilder(id: string, data: Partial<InsertVerifiedBuilder>): Promise<VerifiedBuilder | undefined>;
  deleteVerifiedBuilder(id: string): Promise<boolean>;
  
  // Projects (for Broker/Builder/Corporate)
  getProjects(filters?: ProjectFilters): Promise<Project[]>;
  getProject(id: string): Promise<Project | undefined>;
  getProjectBySlug(slug: string): Promise<Project | undefined>;
  getProjectsBySeller(sellerId: string): Promise<Project[]>;
  createProject(data: InsertProject): Promise<Project>;
  updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined>;
  deleteProject(id: string): Promise<boolean>;
  getPropertiesByProject(projectId: string): Promise<Property[]>;
}

export interface ProjectFilters {
  city?: string;
  state?: string;
  projectStage?: string;
  minPrice?: number;
  maxPrice?: number;
  status?: string;
  sellerId?: string;
  isFeatured?: boolean;
  search?: string;
  limit?: number;
  offset?: number;
}

export interface PropertyFilters {
  city?: string;
  state?: string;
  propertyType?: string;
  transactionType?: string;
  categoryId?: string;
  subcategoryId?: string;
  projectStage?: string;
  minPrice?: number;
  maxPrice?: number;
  minArea?: number;
  maxArea?: number;
  bedrooms?: number;
  status?: string;
  isVerified?: boolean;
  isFeatured?: boolean;
  sellerId?: string;
  sellerType?: string;
  verifiedSeller?: boolean;
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
    // Check if user exists by email first (for OIDC logins where email can collide)
    if (userData.email) {
      const existingUser = await this.getUserByEmail(userData.email);
      if (existingUser) {
        // Update existing user by their ID
        const [user] = await db
          .update(users)
          .set({
            firstName: userData.firstName || existingUser.firstName,
            lastName: userData.lastName || existingUser.lastName,
            profileImageUrl: userData.profileImageUrl || existingUser.profileImageUrl,
            updatedAt: new Date(),
          })
          .where(eq(users.id, existingUser.id))
          .returning();
        return user;
      }
    }
    
    // If user doesn't exist by email, try to insert or update by ID
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

  async createUserWithPassword(data: CreateUserWithPassword): Promise<User> {
    const role = (data.role || "buyer") as "buyer" | "seller";
    const [user] = await db.insert(users).values({
      email: data.email,
      passwordHash: data.passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      intent: data.intent as any,
      role,
      roles: [role],
      authProvider: (data.authProvider || "local") as any,
    }).returning();
    return user;
  }

  async addRole(userId: string, role: "buyer" | "seller"): Promise<User | undefined> {
    const existing = await this.getUser(userId);
    if (!existing) return undefined;
    const currentRoles: string[] = Array.isArray(existing.roles) && existing.roles.length > 0
      ? existing.roles
      : [existing.role];
    if (currentRoles.includes(role)) return existing;
    const newRoles = [...currentRoles, role];
    const [updated] = await db.update(users).set({ roles: newRoles, updatedAt: new Date() }).where(eq(users.id, userId)).returning();
    return updated;
  }

  async updateUserLastLogin(id: string): Promise<void> {
    await db.update(users).set({ lastLoginAt: new Date() }).where(eq(users.id, id));
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

  async getPackages(sellerType?: string): Promise<Package[]> {
    let query = db.select().from(packages);
    
    // If sellerType is provided, filter by it and only show active packages
    // If sellerType is not provided (admin view), return all packages (including inactive)
    if (sellerType) {
      query = query.where(and(eq(packages.sellerType, sellerType as any), eq(packages.isActive, true))) as any;
    }
    
    return query.orderBy(packages.price) as any;
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

  async deletePackage(id: string): Promise<boolean> {
    // First, find all subscriptions that reference this package
    const subscriptions = await db
      .select({ id: sellerSubscriptions.id })
      .from(sellerSubscriptions)
      .where(eq(sellerSubscriptions.packageId, id));

    const subscriptionIds = subscriptions.map((s) => s.id);

    if (subscriptionIds.length > 0) {
      // Clear subscription references in payments table (set to NULL)
      await db
        .update(payments)
        .set({ subscriptionId: null as any })
        .where(inArray(payments.subscriptionId, subscriptionIds));

      // Clear subscription references in invoices table (set to NULL)
      await db
        .update(invoices)
        .set({ subscriptionId: null as any })
        .where(inArray(invoices.subscriptionId, subscriptionIds));

      // Now delete the subscriptions
      await db.delete(sellerSubscriptions).where(eq(sellerSubscriptions.packageId, id));
    }

    // Clear packageId references in payments table (set to NULL)
    await db
      .update(payments)
      .set({ packageId: null as any })
      .where(eq(payments.packageId, id));

    // Clear packageId references in invoices table (set to NULL)
    await db
      .update(invoices)
      .set({ packageId: null as any })
      .where(eq(invoices.packageId, id));

    // Finally delete the package
    const [deleted] = await db.delete(packages).where(eq(packages.id, id)).returning();
    return !!deleted;
  }

  async getProperty(idOrSlug: string): Promise<Property | undefined> {
    try {
      // Try to find by ID first (UUID format)
      const isUUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(idOrSlug);
      
      if (isUUID) {
        try {
          const [property] = await db.select().from(properties).where(eq(properties.id, idOrSlug));
          return property;
        } catch (error: any) {
          // If error is due to missing slug column, use raw SQL
          if (error?.code === '42703' || error?.message?.includes('column "slug" does not exist')) {
            console.warn("Slug column doesn't exist, using raw SQL query");
            const result = await pool.query('SELECT * FROM properties WHERE id = $1 LIMIT 1', [idOrSlug]);
            return result.rows[0] as Property | undefined;
          }
          throw error;
        }
      }
      
      // If not UUID, try to find by slug (only if slug column exists)
      try {
        const [property] = await db.select().from(properties).where(eq(properties.slug, idOrSlug));
        if (property) {
          return property;
        }
      } catch (slugQueryError: any) {
        // If slug column doesn't exist, we'll try ID extraction below
        if (slugQueryError?.code !== '42703' && !slugQueryError?.message?.includes('column "slug" does not exist')) {
          throw slugQueryError;
        }
      }
      
      // If not found by slug, try to extract ID from slug format: title-city-id
      // Slug format is: title-city-id (where id is UUID without hyphens, 32 chars)
      const slugParts = idOrSlug.split('-');
      if (slugParts.length >= 1) {
        // Last part should be the ID (32 chars for UUID without hyphens)
        const lastPart = slugParts[slugParts.length - 1];
        
        // Try to reconstruct UUID from last part if it's 32 hex chars
        if (lastPart.length === 32 && /^[0-9a-f]{32}$/i.test(lastPart)) {
          // Reconstruct UUID format: 8-4-4-4-12
          const possibleId = `${lastPart.slice(0, 8)}-${lastPart.slice(8, 12)}-${lastPart.slice(12, 16)}-${lastPart.slice(16, 20)}-${lastPart.slice(20, 32)}`;
          
          // Verify it's a valid UUID format
          if (/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(possibleId)) {
            try {
              const [propertyById] = await db.select().from(properties).where(eq(properties.id, possibleId));
              if (propertyById) {
                return propertyById;
              }
            } catch (idError: any) {
              // If error is due to missing slug column, use raw SQL
              if (idError?.code === '42703' || idError?.message?.includes('column "slug" does not exist')) {
                const result = await pool.query('SELECT * FROM properties WHERE id = $1 LIMIT 1', [possibleId]);
                if (result.rows[0]) {
                  return result.rows[0] as Property | undefined;
                }
              }
            }
          }
        }
      }
      
      return undefined;
    } catch (error) {
      console.error("Error in getProperty:", error);
      return undefined;
    }
  }
  
  async getPropertyBySlug(slug: string): Promise<Property | undefined> {
    try {
      const [property] = await db.select().from(properties).where(eq(properties.slug, slug));
      return property || undefined;
    } catch (error: any) {
      // If slug column doesn't exist yet (error code 42703), return undefined
      if (error?.code === '42703' || error?.message?.includes('column "slug" does not exist')) {
        // Slug column doesn't exist, so we can't query by slug
        return undefined;
      }
      // For other errors, log and return undefined
      console.warn("getPropertyBySlug failed:", error);
      return undefined;
    }
  }

  // Helper to execute property queries with fallback to raw SQL if slug column doesn't exist
  private async executePropertyQuery<T>(queryFn: () => Promise<T>, rawSqlFn: () => Promise<T>): Promise<T> {
    try {
      return await queryFn();
    } catch (error: any) {
      if (error?.code === '42703' || error?.message?.includes('column "slug" does not exist')) {
        console.warn("Slug column doesn't exist, using raw SQL fallback");
        return await rawSqlFn();
      }
      throw error;
    }
  }

  async getPropertiesBySeller(sellerId: string): Promise<Property[]> {
    return this.executePropertyQuery(
      () => db.select().from(properties).where(eq(properties.sellerId, sellerId)).orderBy(desc(properties.createdAt)),
      async () => {
        const result = await pool.query(
          'SELECT * FROM properties WHERE seller_id = $1 ORDER BY created_at DESC',
          [sellerId]
        );
        return result.rows as Property[];
      }
    );
  }

  async getProperties(filters?: PropertyFilters): Promise<Property[]> {
    return this.executePropertyQuery(
      async () => {
        let query = db.select().from(properties);
        const conditions: any[] = [];
        
        if (filters?.city) conditions.push(eq(properties.city, filters.city));
        if (filters?.state) conditions.push(eq(properties.state, filters.state));
        if (filters?.propertyType) conditions.push(eq(properties.propertyType, filters.propertyType as any));
        if (filters?.transactionType) conditions.push(eq(properties.transactionType, filters.transactionType as any));
        if (filters?.categoryId) conditions.push(eq(properties.categoryId, filters.categoryId));
        if (filters?.subcategoryId) conditions.push(eq(properties.subcategoryId, filters.subcategoryId));
        if (filters?.projectStage) conditions.push(eq(properties.projectStage, filters.projectStage as any));
        if (filters?.minPrice) conditions.push(gte(properties.price, filters.minPrice));
        if (filters?.maxPrice) conditions.push(lte(properties.price, filters.maxPrice));
        if (filters?.minArea) conditions.push(gte(properties.area, filters.minArea));
        if (filters?.maxArea) conditions.push(lte(properties.area, filters.maxArea));
        if (filters?.bedrooms) conditions.push(eq(properties.bedrooms, filters.bedrooms));
        if (filters?.status) conditions.push(eq(properties.status, filters.status as any));
        if (filters?.isVerified !== undefined) conditions.push(eq(properties.isVerified, filters.isVerified));
        if (filters?.isFeatured !== undefined) conditions.push(eq(properties.isFeatured, filters.isFeatured));
        if (filters?.sellerId) conditions.push(eq(properties.sellerId, filters.sellerId));
        if (filters?.sellerType) {
          const sellerConditions: any[] = [eq(sellerProfiles.sellerType, filters.sellerType as any)];
          if (filters.verifiedSeller) {
            sellerConditions.push(eq(sellerProfiles.verificationStatus, "verified"));
          }
          const sellerSubquery = db.select({ id: sellerProfiles.id })
            .from(sellerProfiles)
            .where(and(...sellerConditions));
          conditions.push(inArray(properties.sellerId, sellerSubquery));
        }
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
      },
      async () => {
        // Build raw SQL query
        const whereConditions: string[] = [];
        const params: any[] = [];
        let paramIndex = 1;
        
        if (filters?.city) {
          whereConditions.push(`city = $${paramIndex++}`);
          params.push(filters.city);
        }
        if (filters?.state) {
          whereConditions.push(`state = $${paramIndex++}`);
          params.push(filters.state);
        }
        if (filters?.propertyType) {
          whereConditions.push(`property_type = $${paramIndex++}`);
          params.push(filters.propertyType);
        }
        if (filters?.transactionType) {
          whereConditions.push(`transaction_type = $${paramIndex++}`);
          params.push(filters.transactionType);
        }
        if (filters?.categoryId) {
          whereConditions.push(`category_id = $${paramIndex++}`);
          params.push(filters.categoryId);
        }
        if (filters?.subcategoryId) {
          whereConditions.push(`subcategory_id = $${paramIndex++}`);
          params.push(filters.subcategoryId);
        }
        if (filters?.projectStage) {
          whereConditions.push(`project_stage = $${paramIndex++}`);
          params.push(filters.projectStage);
        }
        if (filters?.sellerType) {
          const verifiedClause = filters.verifiedSeller
            ? ` AND verification_status = 'verified'`
            : "";
          whereConditions.push(`seller_id IN (SELECT id FROM seller_profiles WHERE seller_type = $${paramIndex++}${verifiedClause})`);
          params.push(filters.sellerType);
        }
        if (filters?.minPrice) {
          whereConditions.push(`price >= $${paramIndex++}`);
          params.push(filters.minPrice);
        }
        if (filters?.maxPrice) {
          whereConditions.push(`price <= $${paramIndex++}`);
          params.push(filters.maxPrice);
        }
        if (filters?.minArea) {
          whereConditions.push(`area >= $${paramIndex++}`);
          params.push(filters.minArea);
        }
        if (filters?.maxArea) {
          whereConditions.push(`area <= $${paramIndex++}`);
          params.push(filters.maxArea);
        }
        if (filters?.bedrooms) {
          whereConditions.push(`bedrooms = $${paramIndex++}`);
          params.push(filters.bedrooms);
        }
        if (filters?.status) {
          whereConditions.push(`status = $${paramIndex++}`);
          params.push(filters.status);
        }
        if (filters?.isVerified !== undefined) {
          whereConditions.push(`is_verified = $${paramIndex++}`);
          params.push(filters.isVerified);
        }
        if (filters?.isFeatured !== undefined) {
          whereConditions.push(`is_featured = $${paramIndex++}`);
          params.push(filters.isFeatured);
        }
        if (filters?.sellerId) {
          whereConditions.push(`seller_id = $${paramIndex++}`);
          params.push(filters.sellerId);
        }
        if (filters?.search) {
          whereConditions.push(`(title ILIKE $${paramIndex} OR city ILIKE $${paramIndex + 1} OR locality ILIKE $${paramIndex + 2})`);
          const searchTerm = `%${filters.search}%`;
          params.push(searchTerm, searchTerm, searchTerm);
          paramIndex += 3;
        }
        
        let sqlQuery = `SELECT * FROM properties`;
        if (whereConditions.length > 0) {
          sqlQuery += ` WHERE ${whereConditions.join(' AND ')}`;
        }
        sqlQuery += ` ORDER BY created_at DESC`;
        
        if (filters?.limit) {
          sqlQuery += ` LIMIT $${paramIndex++}`;
          params.push(filters.limit);
        }
        if (filters?.offset) {
          sqlQuery += ` OFFSET $${paramIndex++}`;
          params.push(filters.offset);
        }
        
        // Use pool.query with proper parameterization
        const result = await pool.query(sqlQuery, params);
        return result.rows as Property[];
      }
    );
  }

  async getFeaturedProperties(limit: number = 10): Promise<Property[]> {
    return this.executePropertyQuery(
      () => db.select().from(properties)
        .where(and(eq(properties.isFeatured, true), eq(properties.status, 'active')))
        .orderBy(desc(properties.createdAt))
        .limit(limit),
      async () => {
        const result = await pool.query(
          "SELECT * FROM properties WHERE is_featured = true AND status = 'active' ORDER BY created_at DESC LIMIT $1",
          [limit]
        );
        return result.rows as Property[];
      }
    );
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [created] = await db.insert(properties).values(property as any).returning();
    return created;
  }

  async updateProperty(id: string, data: Partial<InsertProperty>): Promise<Property | undefined> {
    try {
      const [updated] = await db.update(properties).set({ ...data, updatedAt: new Date() } as any).where(eq(properties.id, id)).returning();
      return updated;
    } catch (error: any) {
      // If error is due to missing slug column, use raw SQL
      if (error?.code === '42703' || error?.message?.includes('column "slug" does not exist')) {
        console.warn("Slug column doesn't exist, using raw SQL for update");
        // Use raw SQL to update, excluding slug if column doesn't exist
        const updateFields: string[] = [];
        const values: any[] = [];
        let paramIndex = 1;
        
        // Map of camelCase to snake_case for known fields
        const fieldMap: Record<string, string> = {
          title: 'title',
          description: 'description',
          city: 'city',
          state: 'state',
          price: 'price',
          area: 'area',
          bedrooms: 'bedrooms',
          bathrooms: 'bathrooms',
          slug: 'slug', // Include slug in case column exists
        };
        
        Object.entries(data).forEach(([key, value]) => {
          if (value !== undefined) {
            const dbKey = fieldMap[key] || key.replace(/([A-Z])/g, '_$1').toLowerCase();
            updateFields.push(`${dbKey} = $${paramIndex++}`);
            values.push(value);
          }
        });
        
        if (updateFields.length > 0) {
          updateFields.push(`updated_at = NOW()`);
          values.push(id);
          const query = `UPDATE properties SET ${updateFields.join(', ')} WHERE id = $${paramIndex} RETURNING *`;
          try {
            const result = await pool.query(query, values);
            return result.rows[0] as Property | undefined;
          } catch (sqlError: any) {
            // If slug column doesn't exist, remove it and try again
            if (sqlError?.message?.includes('column "slug" does not exist')) {
              const fieldsWithoutSlug = updateFields.filter(f => !f.includes('slug'));
              if (fieldsWithoutSlug.length > 0) {
                const cleanValues = values.slice(0, -1); // Remove id, we'll add it back
                const cleanQuery = `UPDATE properties SET ${fieldsWithoutSlug.join(', ')} WHERE id = $${cleanValues.length + 1} RETURNING *`;
                const result = await pool.query(cleanQuery, [...cleanValues, id]);
                return result.rows[0] as Property | undefined;
              }
            }
            throw sqlError;
          }
        }
        return undefined;
      }
      throw error;
    }
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

  async updateSavedSearch(id: string, data: { alertEnabled?: boolean; name?: string }): Promise<SavedSearch | undefined> {
    const [updated] = await db.update(savedSearches).set(data).where(eq(savedSearches.id, id)).returning();
    return updated;
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

  async deleteNotification(id: string): Promise<boolean> {
    const result = await db.delete(notifications).where(eq(notifications.id, id));
    return true;
  }

  async getAppointment(id: string): Promise<Appointment | undefined> {
    const [appointment] = await db.select().from(appointments).where(eq(appointments.id, id));
    return appointment;
  }

  async getAppointmentsByBuyer(buyerId: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.buyerId, buyerId)).orderBy(desc(appointments.scheduledDate));
  }

  async getAppointmentsBySeller(sellerId: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.sellerId, sellerId)).orderBy(desc(appointments.scheduledDate));
  }

  async getAppointmentsBySellerUserId(userId: string): Promise<Appointment[]> {
    const profiles = await db.select({ id: sellerProfiles.id }).from(sellerProfiles).where(eq(sellerProfiles.userId, userId));
    const profileIds = profiles.map((p) => p.id);
    if (profileIds.length === 0) return [];
    return db.select().from(appointments).where(inArray(appointments.sellerId, profileIds)).orderBy(desc(appointments.scheduledDate));
  }

  async getAppointmentsByProperty(propertyId: string): Promise<Appointment[]> {
    return db.select().from(appointments).where(eq(appointments.propertyId, propertyId)).orderBy(desc(appointments.scheduledDate));
  }

  async getAppointmentsByPropertyIds(propertyIds: string[]): Promise<Appointment[]> {
    if (propertyIds.length === 0) return [];
    return db.select().from(appointments).where(inArray(appointments.propertyId, propertyIds)).orderBy(desc(appointments.scheduledDate));
  }

  async createAppointment(appointment: InsertAppointment): Promise<Appointment> {
    const [created] = await db.insert(appointments).values(appointment).returning();
    return created;
  }

  async updateAppointment(id: string, data: Partial<InsertAppointment>): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments).set({ ...data, updatedAt: new Date() }).where(eq(appointments.id, id)).returning();
    return updated;
  }

  async cancelAppointment(id: string, reason?: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments)
      .set({ status: 'cancelled', cancelReason: reason, cancelledAt: new Date(), updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async confirmAppointment(id: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments)
      .set({ status: 'confirmed', confirmedAt: new Date(), updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
  }

  async completeAppointment(id: string): Promise<Appointment | undefined> {
    const [updated] = await db.update(appointments)
      .set({ status: 'completed', completedAt: new Date(), updatedAt: new Date() })
      .where(eq(appointments.id, id))
      .returning();
    return updated;
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

  async getPaymentByRazorpayOrderId(orderId: string): Promise<Payment | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.razorpayOrderId, orderId));
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

  async getReviewsByUserId(userId: string): Promise<Review[]> {
    return db.select().from(reviews).where(eq(reviews.userId, userId)).orderBy(desc(reviews.createdAt));
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

  // Property Approval Request Methods
  async createPropertyApprovalRequest(data: {
    propertyId: string;
    sellerId: string;
    submittedBy: string;
    requestType: string;
    status: string;
    changesSnapshot?: Record<string, unknown>;
  }): Promise<any> {
    const [created] = await db.insert(propertyApprovalRequests).values({
      propertyId: data.propertyId,
      sellerId: data.sellerId,
      submittedBy: data.submittedBy,
      requestType: data.requestType,
      status: data.status as any,
      changesSnapshot: data.changesSnapshot,
    }).returning();
    return created;
  }

  async getPropertyApprovalRequest(id: string): Promise<any | undefined> {
    const [request] = await db.select().from(propertyApprovalRequests).where(eq(propertyApprovalRequests.id, id));
    return request;
  }

  async getPropertyApprovalRequests(filters: {
    status?: string;
    requestType?: string;
    limit?: number;
    offset?: number;
  }): Promise<any[]> {
    const conditions: any[] = [];
    
    if (filters.status) {
      conditions.push(eq(propertyApprovalRequests.status, filters.status as any));
    }
    if (filters.requestType) {
      conditions.push(eq(propertyApprovalRequests.requestType, filters.requestType));
    }
    
    let query = db.select().from(propertyApprovalRequests);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return query
      .orderBy(desc(propertyApprovalRequests.submittedAt))
      .limit(filters.limit || 50)
      .offset(filters.offset || 0);
  }

  async updatePropertyApprovalRequest(id: string, data: {
    status?: string;
    approverId?: string;
    decisionReason?: string;
    decidedAt?: Date;
  }): Promise<any | undefined> {
    const updateData: any = {};
    if (data.status) updateData.status = data.status;
    if (data.approverId) updateData.approverId = data.approverId;
    if (data.decisionReason) updateData.decisionReason = data.decisionReason;
    if (data.decidedAt) updateData.decidedAt = data.decidedAt;
    
    const [updated] = await db.update(propertyApprovalRequests)
      .set(updateData)
      .where(eq(propertyApprovalRequests.id, id))
      .returning();
    return updated;
  }

  async getPropertyApprovalHistory(propertyId: string): Promise<any[]> {
    return db.select()
      .from(propertyApprovalRequests)
      .where(eq(propertyApprovalRequests.propertyId, propertyId))
      .orderBy(desc(propertyApprovalRequests.submittedAt));
  }

  // Subscription Management Methods
  async getActiveSubscriptionWithPackage(sellerId: string): Promise<{ subscription: SellerSubscription; package: Package } | undefined> {
    const sub = await this.getActiveSubscription(sellerId);
    if (!sub) return undefined;
    
    const pkg = await this.getPackage(sub.packageId);
    if (!pkg) return undefined;
    
    return { subscription: sub, package: pkg };
  }

  async updateSubscription(id: string, data: Partial<{ listingsUsed: number; featuredUsed: number; isActive: boolean }>): Promise<SellerSubscription | undefined> {
    const [updated] = await db.update(sellerSubscriptions)
      .set(data)
      .where(eq(sellerSubscriptions.id, id))
      .returning();
    return updated;
  }

  async incrementSubscriptionListingUsage(subscriptionId: string): Promise<void> {
    await db.update(sellerSubscriptions)
      .set({ listingsUsed: sql`${sellerSubscriptions.listingsUsed} + 1` })
      .where(eq(sellerSubscriptions.id, subscriptionId));
  }

  async decrementSubscriptionListingUsage(subscriptionId: string): Promise<void> {
    await db.update(sellerSubscriptions)
      .set({ listingsUsed: sql`GREATEST(${sellerSubscriptions.listingsUsed} - 1, 0)` })
      .where(eq(sellerSubscriptions.id, subscriptionId));
  }

  async canSellerCreateListing(sellerId: string): Promise<{ canCreate: boolean; reason?: string; remainingListings?: number }> {
    const subWithPkg = await this.getActiveSubscriptionWithPackage(sellerId);
    
    if (!subWithPkg) {
      return { canCreate: false, reason: "No active subscription. Please purchase a package to list properties." };
    }
    
    const { subscription, package: pkg } = subWithPkg;
    
    // Check if subscription has expired
    if (new Date() > new Date(subscription.endDate)) {
      return { canCreate: false, reason: "Your subscription has expired. Please renew to continue listing properties." };
    }
    
    // Calculate actual listingsUsed from active properties instead of using database field
    const properties = await this.getPropertiesBySeller(sellerId);
    const activeListings = properties.filter(p => 
      p.status === "active" && (p.workflowStatus === "live" || p.workflowStatus === "approved")
    ).length;
    
    const listingsUsed = activeListings;
    
    // Check listing limit
    const remaining = pkg.listingLimit - listingsUsed;
    if (remaining <= 0) {
      return { canCreate: false, reason: "You have reached your listing limit. Please upgrade your package for more listings." };
    }
    
    return { canCreate: true, remainingListings: remaining };
  }

  async getSellerSubscriptions(sellerId: string): Promise<SellerSubscription[]> {
    return db.select().from(sellerSubscriptions)
      .where(eq(sellerSubscriptions.sellerId, sellerId))
      .orderBy(desc(sellerSubscriptions.createdAt));
  }

  async deactivateSubscription(id: string): Promise<void> {
    await db.update(sellerSubscriptions)
      .set({ isActive: false })
      .where(eq(sellerSubscriptions.id, id));
  }

  // Invoice Methods
  async getAllInvoices(): Promise<any[]> {
    const allPayments = await db.select().from(payments).orderBy(desc(payments.createdAt));
    return allPayments.map((payment) => ({
      id: payment.id,
      invoiceNumber: `VG-INV-${payment.id.slice(0, 8).toUpperCase()}`,
      sellerId: payment.userId,
      packageId: payment.packageId,
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.razorpayPaymentId,
      createdAt: payment.createdAt,
    }));
  }

  async getInvoice(id: string): Promise<any | undefined> {
    const [payment] = await db.select().from(payments).where(eq(payments.id, id));
    if (!payment) return undefined;
    
    const user = await this.getUser(payment.userId);
    const pkg = payment.packageId ? await this.getPackage(payment.packageId) : null;
    
    return {
      id: payment.id,
      invoiceNumber: `VG-INV-${payment.id.slice(0, 8).toUpperCase()}`,
      sellerId: payment.userId,
      seller: user,
      packageId: payment.packageId,
      package: pkg,
      amount: payment.amount,
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.razorpayPaymentId,
      createdAt: payment.createdAt,
    };
  }

  // Email Template Methods (using emailTemplates database table)
  async getEmailTemplates(): Promise<EmailTemplate[]> {
    return db.select().from(emailTemplates).orderBy(emailTemplates.triggerEvent);
  }

  async getEmailTemplate(id: string): Promise<EmailTemplate | undefined> {
    const [template] = await db.select().from(emailTemplates).where(eq(emailTemplates.id, id));
    return template;
  }

  async getEmailTemplateByTrigger(triggerEvent: string): Promise<EmailTemplate | undefined> {
    const [template] = await db.select().from(emailTemplates)
      .where(eq(emailTemplates.triggerEvent, triggerEvent as any));
    return template;
  }

  async createEmailTemplate(data: Omit<EmailTemplate, 'id' | 'createdAt' | 'updatedAt'>): Promise<EmailTemplate> {
    const [template] = await db.insert(emailTemplates).values(data).returning();
    return template;
  }

  async updateEmailTemplate(id: string, data: Partial<EmailTemplate>): Promise<EmailTemplate | undefined> {
    const [template] = await db.update(emailTemplates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(emailTemplates.id, id))
      .returning();
    return template;
  }

  async deleteEmailTemplate(id: string): Promise<boolean> {
    await db.delete(emailTemplates).where(eq(emailTemplates.id, id));
    return true;
  }

  // Get All Inquiries with filters
  async getAllInquiries(filters?: { source?: string; status?: string }): Promise<Inquiry[]> {
    const conditions: any[] = [];
    
    if (filters?.source) {
      conditions.push(eq(inquiries.sourceType, filters.source as any));
    }
    if (filters?.status) {
      conditions.push(eq(inquiries.status, filters.status as any));
    }
    
    let query = db.select().from(inquiries);
    
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    return query.orderBy(desc(inquiries.createdAt));
  }

  // Content Management Methods
  async getFaqItems(): Promise<FaqItem[]> {
    return db.select().from(faqItems)
      .where(eq(faqItems.isActive, true))
      .orderBy(faqItems.category, faqItems.sortOrder);
  }

  async getFaqItemsByCategory(category: string): Promise<FaqItem[]> {
    return db.select().from(faqItems)
      .where(and(
        eq(faqItems.category, category),
        eq(faqItems.isActive, true)
      ))
      .orderBy(faqItems.sortOrder);
  }

  async getStaticPageBySlug(slug: string): Promise<StaticPage | undefined> {
    const [page] = await db.select().from(staticPages)
      .where(and(
        eq(staticPages.slug, slug),
        eq(staticPages.isPublished, true)
      ));
    return page;
  }

  async getStaticPages(): Promise<StaticPage[]> {
    return db.select().from(staticPages)
      .where(eq(staticPages.isPublished, true))
      .orderBy(staticPages.title);
  }

  async getBanners(position?: string): Promise<Banner[]> {
    const conditions = [eq(banners.isActive, true)];
    if (position) {
      conditions.push(eq(banners.position, position));
    }
    return db.select().from(banners)
      .where(and(...conditions))
      .orderBy(banners.sortOrder);
  }

  async getPlatformSettings(category?: string): Promise<PlatformSetting[]> {
    if (category) {
      return db.select().from(platformSettings)
        .where(eq(platformSettings.category, category as any));
    }
    return db.select().from(platformSettings);
  }

  // Dynamic Content Management implementations
  async getPopularCities(): Promise<PopularCity[]> {
    return db.select().from(popularCities)
      .where(eq(popularCities.isActive, true))
      .orderBy(popularCities.sortOrder);
  }

  async getPopularCityBySlug(slug: string): Promise<PopularCity | undefined> {
    const [city] = await db.select().from(popularCities)
      .where(and(
        eq(popularCities.slug, slug),
        eq(popularCities.isActive, true)
      ));
    return city;
  }

  async getNavigationLinks(position?: string, section?: string): Promise<NavigationLink[]> {
    const conditions = [eq(navigationLinks.isActive, true)];
    if (position) {
      conditions.push(eq(navigationLinks.position, position as any));
    }
    if (section) {
      conditions.push(eq(navigationLinks.section, section as any));
    }
    return db.select().from(navigationLinks)
      .where(and(...conditions))
      .orderBy(navigationLinks.sortOrder);
  }

  async getPropertyTypes(): Promise<PropertyTypeManaged[]> {
    return db.select().from(propertyTypesManaged)
      .where(eq(propertyTypesManaged.isActive, true))
      .orderBy(propertyTypesManaged.sortOrder);
  }

  async getSiteSettings(category?: string): Promise<SiteSetting[]> {
    if (category) {
      return db.select().from(siteSettings)
        .where(eq(siteSettings.category, category));
    }
    return db.select().from(siteSettings);
  }

  async getSiteSetting(key: string): Promise<SiteSetting | undefined> {
    const [setting] = await db.select().from(siteSettings)
      .where(eq(siteSettings.key, key));
    return setting;
  }

  // Admin CRUD for FAQ Items
  async getAllFaqItems(): Promise<FaqItem[]> {
    return db.select().from(faqItems).orderBy(faqItems.category, faqItems.sortOrder);
  }

  async createFaqItem(data: Omit<FaqItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<FaqItem> {
    const [item] = await db.insert(faqItems).values(data).returning();
    return item;
  }

  async updateFaqItem(id: string, data: Partial<FaqItem>): Promise<FaqItem | undefined> {
    const [item] = await db.update(faqItems)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(faqItems.id, id))
      .returning();
    return item;
  }

  async deleteFaqItem(id: string): Promise<boolean> {
    const result = await db.delete(faqItems).where(eq(faqItems.id, id));
    return true;
  }

  // Admin CRUD for Static Pages
  async getAllStaticPages(): Promise<StaticPage[]> {
    return db.select().from(staticPages).orderBy(staticPages.title);
  }

  async createStaticPage(data: Omit<StaticPage, 'id' | 'createdAt' | 'updatedAt'>): Promise<StaticPage> {
    const [page] = await db.insert(staticPages).values(data).returning();
    return page;
  }

  async updateStaticPage(id: string, data: Partial<StaticPage>): Promise<StaticPage | undefined> {
    const [page] = await db.update(staticPages)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(staticPages.id, id))
      .returning();
    return page;
  }

  async deleteStaticPage(id: string): Promise<boolean> {
    await db.delete(staticPages).where(eq(staticPages.id, id));
    return true;
  }

  // Admin CRUD for Banners
  async getAllBanners(): Promise<Banner[]> {
    return db.select().from(banners).orderBy(banners.sortOrder);
  }

  async createBanner(data: Omit<Banner, 'id' | 'createdAt' | 'updatedAt'>): Promise<Banner> {
    const [banner] = await db.insert(banners).values(data).returning();
    return banner;
  }

  async updateBanner(id: string, data: Partial<Banner>): Promise<Banner | undefined> {
    const [banner] = await db.update(banners)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(banners.id, id))
      .returning();
    return banner;
  }

  async deleteBanner(id: string): Promise<boolean> {
    await db.delete(banners).where(eq(banners.id, id));
    return true;
  }

  // Testimonials CRUD
  async getAllTestimonials(): Promise<Testimonial[]> {
    return db.select().from(testimonials).orderBy(testimonials.sortOrder);
  }

  async createTestimonial(data: Omit<Testimonial, 'id' | 'createdAt' | 'updatedAt'>): Promise<Testimonial> {
    const [testimonial] = await db.insert(testimonials).values(data).returning();
    return testimonial;
  }

  async updateTestimonial(id: string, data: Partial<Testimonial>): Promise<Testimonial | undefined> {
    const [testimonial] = await db.update(testimonials)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(testimonials.id, id))
      .returning();
    return testimonial;
  }

  async deleteTestimonial(id: string): Promise<boolean> {
    await db.delete(testimonials).where(eq(testimonials.id, id));
    return true;
  }

  // Team Members CRUD
  async getAllTeamMembers(): Promise<TeamMember[]> {
    return db.select().from(teamMembers).orderBy(teamMembers.sortOrder);
  }

  async createTeamMember(data: Omit<TeamMember, 'id' | 'createdAt' | 'updatedAt'>): Promise<TeamMember> {
    const [member] = await db.insert(teamMembers).values(data).returning();
    return member;
  }

  async updateTeamMember(id: string, data: Partial<TeamMember>): Promise<TeamMember | undefined> {
    const [member] = await db.update(teamMembers)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(teamMembers.id, id))
      .returning();
    return member;
  }

  async deleteTeamMember(id: string): Promise<boolean> {
    await db.delete(teamMembers).where(eq(teamMembers.id, id));
    return true;
  }

  // Company Values CRUD
  async getAllCompanyValues(): Promise<CompanyValue[]> {
    return db.select().from(companyValues).orderBy(companyValues.sortOrder);
  }

  async createCompanyValue(data: Omit<CompanyValue, 'id' | 'createdAt' | 'updatedAt'>): Promise<CompanyValue> {
    const [value] = await db.insert(companyValues).values(data).returning();
    return value;
  }

  async updateCompanyValue(id: string, data: Partial<CompanyValue>): Promise<CompanyValue | undefined> {
    const [value] = await db.update(companyValues)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(companyValues.id, id))
      .returning();
    return value;
  }

  async deleteCompanyValue(id: string): Promise<boolean> {
    await db.delete(companyValues).where(eq(companyValues.id, id));
    return true;
  }

  // Hero Slides CRUD
  async getAllHeroSlides(): Promise<HeroSlide[]> {
    return db.select().from(heroSlides).orderBy(heroSlides.sortOrder);
  }

  async createHeroSlide(data: Omit<HeroSlide, 'id' | 'createdAt' | 'updatedAt'>): Promise<HeroSlide> {
    const [slide] = await db.insert(heroSlides).values(data).returning();
    return slide;
  }

  async updateHeroSlide(id: string, data: Partial<HeroSlide>): Promise<HeroSlide | undefined> {
    const [slide] = await db.update(heroSlides)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(heroSlides.id, id))
      .returning();
    return slide;
  }

  async deleteHeroSlide(id: string): Promise<boolean> {
    await db.delete(heroSlides).where(eq(heroSlides.id, id));
    return true;
  }

  // Admin CRUD for Popular Cities
  async getAllPopularCities(): Promise<PopularCity[]> {
    return db.select().from(popularCities).orderBy(popularCities.sortOrder);
  }

  async createPopularCity(data: Omit<PopularCity, 'id' | 'createdAt' | 'updatedAt'>): Promise<PopularCity> {
    const [city] = await db.insert(popularCities).values(data).returning();
    return city;
  }

  async updatePopularCity(id: string, data: Partial<PopularCity>): Promise<PopularCity | undefined> {
    const [city] = await db.update(popularCities)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(popularCities.id, id))
      .returning();
    return city;
  }

  async deletePopularCity(id: string): Promise<boolean> {
    await db.delete(popularCities).where(eq(popularCities.id, id));
    return true;
  }

  // Admin CRUD for Navigation Links
  async getAllNavigationLinks(): Promise<NavigationLink[]> {
    return db.select().from(navigationLinks).orderBy(navigationLinks.section, navigationLinks.sortOrder);
  }

  async createNavigationLink(data: Omit<NavigationLink, 'id' | 'createdAt' | 'updatedAt'>): Promise<NavigationLink> {
    const [link] = await db.insert(navigationLinks).values(data).returning();
    return link;
  }

  async updateNavigationLink(id: string, data: Partial<NavigationLink>): Promise<NavigationLink | undefined> {
    const [link] = await db.update(navigationLinks)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(navigationLinks.id, id))
      .returning();
    return link;
  }

  async deleteNavigationLink(id: string): Promise<boolean> {
    await db.delete(navigationLinks).where(eq(navigationLinks.id, id));
    return true;
  }

  // Admin CRUD for Property Types
  async getAllPropertyTypes(): Promise<PropertyTypeManaged[]> {
    return db.select().from(propertyTypesManaged).orderBy(propertyTypesManaged.sortOrder);
  }

  async createPropertyType(data: Omit<PropertyTypeManaged, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertyTypeManaged> {
    const [type] = await db.insert(propertyTypesManaged).values(data).returning();
    return type;
  }

  async updatePropertyType(id: string, data: Partial<PropertyTypeManaged>): Promise<PropertyTypeManaged | undefined> {
    const [type] = await db.update(propertyTypesManaged)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(propertyTypesManaged.id, id))
      .returning();
    return type;
  }

  async deletePropertyType(id: string): Promise<boolean> {
    await db.delete(propertyTypesManaged).where(eq(propertyTypesManaged.id, id));
    return true;
  }

  // Admin CRUD for Site Settings
  async createSiteSetting(data: Omit<SiteSetting, 'id' | 'createdAt' | 'updatedAt'>): Promise<SiteSetting> {
    const [setting] = await db.insert(siteSettings).values(data).returning();
    return setting;
  }

  async updateSiteSetting(id: string, data: Partial<SiteSetting>): Promise<SiteSetting | undefined> {
    const [setting] = await db.update(siteSettings)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(siteSettings.id, id))
      .returning();
    return setting;
  }

  async deleteSiteSetting(id: string): Promise<boolean> {
    await db.delete(siteSettings).where(eq(siteSettings.id, id));
    return true;
  }

  // Property Categories
  async getPropertyCategories(): Promise<PropertyCategory[]> {
    return db.select().from(propertyCategories).where(eq(propertyCategories.isActive, true)).orderBy(propertyCategories.sortOrder);
  }

  async getPropertyCategory(id: string): Promise<PropertyCategory | undefined> {
    const [category] = await db.select().from(propertyCategories).where(eq(propertyCategories.id, id));
    return category;
  }

  async getPropertyCategoryBySlug(slug: string): Promise<PropertyCategory | undefined> {
    const [category] = await db.select().from(propertyCategories).where(eq(propertyCategories.slug, slug));
    return category;
  }

  async createPropertyCategory(data: Omit<PropertyCategory, 'id' | 'createdAt' | 'updatedAt' | 'propertyCount'>): Promise<PropertyCategory> {
    const [category] = await db.insert(propertyCategories).values(data).returning();
    return category;
  }

  async updatePropertyCategory(id: string, data: Partial<PropertyCategory>): Promise<PropertyCategory | undefined> {
    const [category] = await db.update(propertyCategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(propertyCategories.id, id))
      .returning();
    return category;
  }

  async deletePropertyCategory(id: string): Promise<boolean> {
    await db.delete(propertyCategories).where(eq(propertyCategories.id, id));
    return true;
  }

  // Property Subcategories
  async getPropertySubcategories(categoryId?: string): Promise<PropertySubcategory[]> {
    if (categoryId) {
      return db.select().from(propertySubcategories)
        .where(and(eq(propertySubcategories.categoryId, categoryId), eq(propertySubcategories.isActive, true)))
        .orderBy(propertySubcategories.sortOrder);
    }
    return db.select().from(propertySubcategories)
      .where(eq(propertySubcategories.isActive, true))
      .orderBy(propertySubcategories.sortOrder);
  }

  async getPropertySubcategory(id: string): Promise<PropertySubcategory | undefined> {
    const [subcategory] = await db.select().from(propertySubcategories).where(eq(propertySubcategories.id, id));
    return subcategory;
  }

  async createPropertySubcategory(data: Omit<PropertySubcategory, 'id' | 'createdAt' | 'updatedAt'>): Promise<PropertySubcategory> {
    const [subcategory] = await db.insert(propertySubcategories).values(data).returning();
    return subcategory;
  }

  async updatePropertySubcategory(id: string, data: Partial<PropertySubcategory>): Promise<PropertySubcategory | undefined> {
    const [subcategory] = await db.update(propertySubcategories)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(propertySubcategories.id, id))
      .returning();
    return subcategory;
  }

  async deletePropertySubcategory(id: string): Promise<boolean> {
    await db.delete(propertySubcategories).where(eq(propertySubcategories.id, id));
    return true;
  }

  // Verified Builders
  async getVerifiedBuilders(filters?: { showOnHomepage?: boolean; isActive?: boolean }): Promise<VerifiedBuilder[]> {
    let conditions = [];
    if (filters?.isActive !== undefined) {
      conditions.push(eq(verifiedBuilders.isActive, filters.isActive));
    }
    if (filters?.showOnHomepage !== undefined) {
      conditions.push(eq(verifiedBuilders.showOnHomepage, filters.showOnHomepage));
    }
    if (conditions.length > 0) {
      return db.select().from(verifiedBuilders).where(and(...conditions)).orderBy(verifiedBuilders.sortOrder);
    }
    return db.select().from(verifiedBuilders).orderBy(verifiedBuilders.sortOrder);
  }

  async getVerifiedBuilder(id: string): Promise<VerifiedBuilder | undefined> {
    const [builder] = await db.select().from(verifiedBuilders).where(eq(verifiedBuilders.id, id));
    return builder;
  }

  async getVerifiedBuilderBySlug(slug: string): Promise<VerifiedBuilder | undefined> {
    const [builder] = await db.select().from(verifiedBuilders).where(eq(verifiedBuilders.slug, slug));
    return builder;
  }

  async getVerifiedBuilderBySellerId(sellerId: string): Promise<VerifiedBuilder | undefined> {
    const [builder] = await db.select().from(verifiedBuilders).where(eq(verifiedBuilders.sellerId, sellerId));
    return builder;
  }

  async createVerifiedBuilder(data: InsertVerifiedBuilder): Promise<VerifiedBuilder> {
    const [builder] = await db.insert(verifiedBuilders).values(data).returning();
    return builder;
  }

  async updateVerifiedBuilder(id: string, data: Partial<InsertVerifiedBuilder>): Promise<VerifiedBuilder | undefined> {
    const [builder] = await db.update(verifiedBuilders)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(verifiedBuilders.id, id))
      .returning();
    return builder;
  }

  async deleteVerifiedBuilder(id: string): Promise<boolean> {
    await db.delete(verifiedBuilders).where(eq(verifiedBuilders.id, id));
    return true;
  }

  // Projects
  async getProjects(filters?: ProjectFilters): Promise<Project[]> {
    let conditions = [];
    
    if (filters?.city) {
      conditions.push(eq(projects.city, filters.city));
    }
    if (filters?.state) {
      conditions.push(eq(projects.state, filters.state));
    }
    if (filters?.projectStage) {
      conditions.push(eq(projects.projectStage, filters.projectStage as any));
    }
    if (filters?.status) {
      conditions.push(eq(projects.status, filters.status as any));
    }
    if (filters?.sellerId) {
      conditions.push(eq(projects.sellerId, filters.sellerId));
    }
    if (filters?.isFeatured !== undefined) {
      conditions.push(eq(projects.isFeatured, filters.isFeatured));
    }
    if (filters?.minPrice) {
      conditions.push(gte(projects.priceRangeMin, filters.minPrice));
    }
    if (filters?.maxPrice) {
      conditions.push(lte(projects.priceRangeMax, filters.maxPrice));
    }
    if (filters?.search) {
      conditions.push(or(
        like(projects.name, `%${filters.search}%`),
        like(projects.city, `%${filters.search}%`),
        like(projects.locality, `%${filters.search}%`)
      ));
    }
    
    let query = db.select().from(projects);
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    
    query = query.orderBy(desc(projects.createdAt)) as any;
    
    if (filters?.limit) {
      query = query.limit(filters.limit) as any;
    }
    if (filters?.offset) {
      query = query.offset(filters.offset) as any;
    }
    
    return query;
  }

  async getProject(id: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.id, id));
    return project;
  }

  async getProjectBySlug(slug: string): Promise<Project | undefined> {
    const [project] = await db.select().from(projects).where(eq(projects.slug, slug));
    return project;
  }

  async getProjectsBySeller(sellerId: string): Promise<Project[]> {
    return db.select().from(projects).where(eq(projects.sellerId, sellerId)).orderBy(desc(projects.createdAt));
  }

  async createProject(data: InsertProject): Promise<Project> {
    const [project] = await db.insert(projects).values(data).returning();
    return project;
  }

  async updateProject(id: string, data: Partial<InsertProject>): Promise<Project | undefined> {
    const [project] = await db.update(projects)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(projects.id, id))
      .returning();
    return project;
  }

  async deleteProject(id: string): Promise<boolean> {
    await db.delete(projects).where(eq(projects.id, id));
    return true;
  }

  async getPropertiesByProject(projectId: string): Promise<Property[]> {
    return this.executePropertyQuery(
      () => db.select().from(properties).where(eq(properties.projectId, projectId)).orderBy(desc(properties.createdAt)),
      async () => {
        const result = await pool.query(
          'SELECT * FROM properties WHERE project_id = $1 ORDER BY created_at DESC',
          [projectId]
        );
        return result.rows as Property[];
      }
    );
  }

  async createContactMessage(message: InsertContactMessage): Promise<ContactMessage> {
    const [created] = await db.insert(contactMessages).values(message).returning();
    return created;
  }

  async getContactMessages(filters?: { userId?: string; status?: string }): Promise<ContactMessage[]> {
    let query = db.select().from(contactMessages);
    const conditions = [];
    if (filters?.userId) {
      conditions.push(eq(contactMessages.userId, filters.userId));
    }
    if (filters?.status) {
      conditions.push(eq(contactMessages.status, filters.status));
    }
    if (conditions.length > 0) {
      query = query.where(and(...conditions)) as any;
    }
    return query.orderBy(desc(contactMessages.createdAt));
  }

  async getContactMessage(id: string): Promise<ContactMessage | undefined> {
    const [message] = await db.select().from(contactMessages).where(eq(contactMessages.id, id));
    return message;
  }

  async updateContactMessage(id: string, data: Partial<InsertContactMessage>): Promise<ContactMessage | undefined> {
    const [updated] = await db.update(contactMessages).set(data).where(eq(contactMessages.id, id)).returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
