import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, boolean, timestamp, decimal, jsonb, pgEnum, index } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

export const userRoleEnum = pgEnum("user_role", ["buyer", "seller", "admin"]);
export const sellerTypeEnum = pgEnum("seller_type", ["individual", "broker", "builder"]);
export const propertyTypeEnum = pgEnum("property_type", ["apartment", "villa", "plot", "commercial", "farmhouse", "penthouse"]);
export const transactionTypeEnum = pgEnum("transaction_type", ["sale", "rent", "lease"]);
export const projectStageEnum = pgEnum("project_stage", ["pre_launch", "launch", "under_construction", "ready_to_move"]);
export const listingStatusEnum = pgEnum("listing_status", ["draft", "pending", "active", "sold", "rented", "expired", "rejected"]);
export const inquiryStatusEnum = pgEnum("inquiry_status", ["pending", "replied", "closed"]);
export const inquirySourceEnum = pgEnum("inquiry_source", ["form", "chat", "call"]);
export const appointmentStatusEnum = pgEnum("appointment_status", ["pending", "confirmed", "completed", "cancelled", "rescheduled"]);
export const paymentStatusEnum = pgEnum("payment_status", ["pending", "completed", "failed", "refunded"]);
export const verificationStatusEnum = pgEnum("verification_status", ["pending", "verified", "rejected"]);
export const notificationTypeEnum = pgEnum("notification_type", ["inquiry", "message", "payment", "listing", "system", "alert"]);
export const authProviderEnum = pgEnum("auth_provider", ["google", "local", "admin"]);
export const userIntentEnum = pgEnum("user_intent", ["buyer", "seller"]);
export const workflowStatusEnum = pgEnum("workflow_status", ["draft", "submitted", "under_review", "approved", "live", "needs_reapproval", "rejected"]);
export const approvalStatusEnum = pgEnum("approval_status", ["pending", "approved", "rejected"]);
export const settingsCategoryEnum = pgEnum("settings_category", ["maps", "smtp", "razorpay", "analytics", "social", "general"]);
export const emailTriggerEnum = pgEnum("email_trigger", [
  "welcome_buyer", "welcome_seller", "email_verification", "password_reset", "password_changed",
  "inquiry_received", "inquiry_response", "new_message", 
  "property_submitted", "property_approved", "property_rejected", "property_needs_reapproval", "property_live",
  "property_expired", "property_renewed", "property_boosted", "property_featured",
  "seller_approved", "seller_rejected", "seller_verification_pending",
  "payment_success", "payment_failed", "subscription_activated", "subscription_expiring", "subscription_expired", "subscription_renewed",
  "appointment_requested", "appointment_confirmed", "appointment_cancelled", "appointment_rescheduled",
  "account_deactivated", "account_reactivated", "admin_notification"
]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: text("email").unique(),
  firstName: text("first_name"),
  lastName: text("last_name"),
  profileImageUrl: text("profile_image_url"),
  phone: text("phone"),
  passwordHash: text("password_hash"),
  authProvider: authProviderEnum("auth_provider").default("google"),
  intent: userIntentEnum("intent"),
  role: userRoleEnum("role").notNull().default("buyer"),
  isActive: boolean("is_active").notNull().default(true),
  isEmailVerified: boolean("is_email_verified").notNull().default(false),
  isPhoneVerified: boolean("is_phone_verified").notNull().default(false),
  lastLoginAt: timestamp("last_login_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const sellerProfiles = pgTable("seller_profiles", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  sellerType: sellerTypeEnum("seller_type").notNull(),
  companyName: text("company_name"),
  reraNumber: text("rera_number"),
  gstNumber: text("gst_number"),
  panNumber: text("pan_number"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  pincode: text("pincode"),
  description: text("description"),
  website: text("website"),
  logo: text("logo"),
  verificationStatus: verificationStatusEnum("verification_status").notNull().default("pending"),
  verificationDocuments: jsonb("verification_documents").$type<string[]>(),
  totalListings: integer("total_listings").notNull().default(0),
  totalSold: integer("total_sold").notNull().default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  liveAt: timestamp("live_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const packages = pgTable("packages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  description: text("description"),
  price: integer("price").notNull(),
  duration: integer("duration").notNull(),
  listingLimit: integer("listing_limit").notNull(),
  featuredListings: integer("featured_listings").notNull().default(0),
  features: jsonb("features").$type<string[]>(),
  isPopular: boolean("is_popular").notNull().default(false),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const sellerSubscriptions = pgTable("seller_subscriptions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  packageId: varchar("package_id").notNull().references(() => packages.id),
  startDate: timestamp("start_date").notNull().defaultNow(),
  endDate: timestamp("end_date").notNull(),
  listingsUsed: integer("listings_used").notNull().default(0),
  featuredUsed: integer("featured_used").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  projectId: varchar("project_id"),
  title: text("title").notNull(),
  slug: text("slug").unique(),
  description: text("description"),
  propertyType: propertyTypeEnum("property_type").notNull(),
  transactionType: transactionTypeEnum("transaction_type").notNull(),
  categoryId: varchar("category_id"),
  subcategoryId: varchar("subcategory_id"),
  projectStage: projectStageEnum("project_stage"),
  youtubeVideoUrl: text("youtube_video_url"),
  price: integer("price").notNull(),
  pricePerSqft: integer("price_per_sqft"),
  area: integer("area").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  balconies: integer("balconies"),
  floor: integer("floor"),
  totalFloors: integer("total_floors"),
  facing: text("facing"),
  furnishing: text("furnishing"),
  ageOfProperty: integer("age_of_property"),
  possessionStatus: text("possession_status"),
  address: text("address").notNull(),
  locality: text("locality"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  amenities: jsonb("amenities").$type<string[]>(),
  highlights: jsonb("highlights").$type<string[]>(),
  nearbyPlaces: jsonb("nearby_places").$type<{ type: string; name: string; distance: string }[]>(),
  status: listingStatusEnum("status").notNull().default("draft"),
  workflowStatus: workflowStatusEnum("workflow_status").notNull().default("draft"),
  isVerified: boolean("is_verified").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  inquiryCount: integer("inquiry_count").notNull().default(0),
  favoriteCount: integer("favorite_count").notNull().default(0),
  publishedAt: timestamp("published_at"),
  expiresAt: timestamp("expires_at"),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
  pendingChanges: jsonb("pending_changes").$type<Record<string, unknown>>(),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyImages = pgTable("property_images", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  url: text("url").notNull(),
  caption: text("caption"),
  isPrimary: boolean("is_primary").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const propertyDocuments = pgTable("property_documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  name: text("name").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const inquiries = pgTable("inquiries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  message: text("message"),
  status: inquiryStatusEnum("status").notNull().default("pending"),
  sourceType: inquirySourceEnum("source_type").notNull().default("form"),
  buyerPhone: text("buyer_phone"),
  buyerEmail: text("buyer_email"),
  preferredContactTime: text("preferred_contact_time"),
  sellerResponse: text("seller_response"),
  respondedAt: timestamp("responded_at"),
  sellerNotes: text("seller_notes"),
  followUpDate: timestamp("follow_up_date"),
  leadTemperature: text("lead_temperature"),
  conversionStatus: text("conversion_status"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const favorites = pgTable("favorites", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const savedSearches = pgTable("saved_searches", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  name: text("name").notNull(),
  filters: jsonb("filters").$type<Record<string, unknown>>().notNull(),
  alertEnabled: boolean("alert_enabled").notNull().default(true),
  lastNotifiedAt: timestamp("last_notified_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const propertyViews = pgTable("property_views", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  userId: varchar("user_id").references(() => users.id),
  sessionId: text("session_id"),
  source: text("source"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatThreads = pgTable("chat_threads", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").references(() => properties.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => users.id),
  lastMessageAt: timestamp("last_message_at"),
  buyerUnreadCount: integer("buyer_unread_count").notNull().default(0),
  sellerUnreadCount: integer("seller_unread_count").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const chatMessages = pgTable("chat_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threadId: varchar("thread_id").notNull().references(() => chatThreads.id),
  senderId: varchar("sender_id").notNull().references(() => users.id),
  content: text("content").notNull(),
  attachments: jsonb("attachments").$type<string[]>(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  data: jsonb("data").$type<Record<string, unknown>>(),
  isRead: boolean("is_read").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const appointments = pgTable("appointments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  buyerId: varchar("buyer_id").notNull().references(() => users.id),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  scheduledDate: timestamp("scheduled_date").notNull(),
  scheduledTime: text("scheduled_time").notNull(),
  visitType: text("visit_type").default("physical"), // physical or virtual
  status: appointmentStatusEnum("status").notNull().default("pending"),
  buyerName: text("buyer_name"),
  buyerPhone: text("buyer_phone"),
  buyerEmail: text("buyer_email"),
  notes: text("notes"),
  sellerNotes: text("seller_notes"),
  cancelReason: text("cancel_reason"),
  rescheduledFrom: timestamp("rescheduled_from"),
  confirmedAt: timestamp("confirmed_at"),
  completedAt: timestamp("completed_at"),
  cancelledAt: timestamp("cancelled_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const contactMessages = pgTable("contact_messages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  name: text("name").notNull(),
  email: text("email").notNull(),
  phone: text("phone"),
  subject: text("subject"),
  message: text("message").notNull(),
  status: text("status").notNull().default("new"), // new, read, replied, archived
  repliedAt: timestamp("replied_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const payments = pgTable("payments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  subscriptionId: varchar("subscription_id").references(() => sellerSubscriptions.id),
  packageId: varchar("package_id").references(() => packages.id),
  amount: integer("amount").notNull(),
  currency: text("currency").notNull().default("INR"),
  razorpayOrderId: text("razorpay_order_id"),
  razorpayPaymentId: text("razorpay_payment_id"),
  razorpaySignature: text("razorpay_signature"),
  paymentMethod: text("payment_method"),
  status: paymentStatusEnum("status").notNull().default("pending"),
  description: text("description"),
  metadata: jsonb("metadata").$type<Record<string, unknown>>(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const reviews = pgTable("reviews", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").references(() => properties.id),
  rating: integer("rating").notNull(),
  comment: text("comment"),
  isVerified: boolean("is_verified").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const adminApprovals = pgTable("admin_approvals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: text("type").notNull(),
  entityId: varchar("entity_id").notNull(),
  entityType: text("entity_type").notNull(),
  status: verificationStatusEnum("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by").references(() => users.id),
  reviewNotes: text("review_notes"),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const auditLogs = pgTable("audit_logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  action: text("action").notNull(),
  entityType: text("entity_type").notNull(),
  entityId: varchar("entity_id"),
  oldData: jsonb("old_data").$type<Record<string, unknown>>(),
  newData: jsonb("new_data").$type<Record<string, unknown>>(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const systemSettings = pgTable("system_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: jsonb("value").$type<unknown>(),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyAlerts = pgTable("property_alerts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  alertType: text("alert_type").notNull(),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const propertyApprovalRequests = pgTable("property_approval_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  propertyId: varchar("property_id").notNull().references(() => properties.id),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  submittedBy: varchar("submitted_by").notNull().references(() => users.id),
  approverId: varchar("approver_id").references(() => users.id),
  status: approvalStatusEnum("status").notNull().default("pending"),
  requestType: text("request_type").notNull().default("new"),
  decisionReason: text("decision_reason"),
  changesSnapshot: jsonb("changes_snapshot").$type<Record<string, unknown>>(),
  submittedAt: timestamp("submitted_at").notNull().defaultNow(),
  decidedAt: timestamp("decided_at"),
});

export const invoiceSettings = pgTable("invoice_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  companyAddress: text("company_address"),
  companyState: text("company_state"),
  companyPin: text("company_pin"),
  gstin: text("gstin"),
  pan: text("pan"),
  logo: text("logo"),
  footerText: text("footer_text"),
  bankDetails: jsonb("bank_details").$type<{
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolder?: string;
    branch?: string;
  }>(),
  sacCode: text("sac_code").default("997221"),
  termsAndConditions: text("terms_and_conditions").default("1. Payment once made is non-refundable.\n2. Invoice valid for accounting & GST purposes.\n3. Any disputes subject to Bangalore jurisdiction.\n4. Payment should be made on or before the due date."),
  invoicePrefix: text("invoice_prefix").notNull().default("VG"),
  nextInvoiceNumber: integer("next_invoice_number").notNull().default(1),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const invoices = pgTable("invoices", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  invoiceNumber: text("invoice_number").notNull().unique(),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  userId: varchar("user_id").notNull().references(() => users.id),
  subscriptionId: varchar("subscription_id").references(() => sellerSubscriptions.id),
  paymentId: varchar("payment_id").references(() => payments.id),
  packageId: varchar("package_id").references(() => packages.id),
  subtotal: integer("subtotal").notNull(),
  gstRate: decimal("gst_rate", { precision: 5, scale: 2 }).notNull().default("18"),
  gstAmount: integer("gst_amount").notNull(),
  cgstAmount: integer("cgst_amount"),
  sgstAmount: integer("sgst_amount"),
  totalAmount: integer("total_amount").notNull(),
  placeOfSupply: text("place_of_supply"),
  sacCode: text("sac_code").default("997221"),
  paymentMode: text("payment_mode"),
  companyDetails: jsonb("company_details").$type<{
    name: string;
    address?: string;
    state?: string;
    pin?: string;
    gstin?: string;
    pan?: string;
  }>(),
  sellerDetails: jsonb("seller_details").$type<{
    name: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
  }>(),
  packageDetails: jsonb("package_details").$type<{
    name: string;
    description?: string;
    duration: number;
    listingLimit: number;
  }>(),
  pdfUrl: text("pdf_url"),
  invoiceDate: timestamp("invoice_date").notNull().defaultNow(),
  dueDate: timestamp("due_date"),
  paidAt: timestamp("paid_at"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

export const platformSettings = pgTable("platform_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: settingsCategoryEnum("category").notNull(),
  key: text("key").notNull(),
  value: text("value"),
  isEncrypted: boolean("is_encrypted").notNull().default(false),
  description: text("description"),
  updatedBy: varchar("updated_by").references(() => users.id),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const emailTemplates = pgTable("email_templates", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  subject: text("subject").notNull(),
  body: text("body").notNull(),
  variables: jsonb("variables").$type<string[]>(),
  triggerEvent: emailTriggerEnum("trigger_event"),
  isActive: boolean("is_active").notNull().default(true),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const faqItems = pgTable("faq_items", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  question: text("question").notNull(),
  answer: text("answer").notNull(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const staticPages = pgTable("static_pages", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  metaTitle: text("meta_title"),
  metaDescription: text("meta_description"),
  showInHeader: boolean("show_in_header").notNull().default(false),
  showInFooter: boolean("show_in_footer").notNull().default(false),
  footerSection: text("footer_section"),
  sortOrder: integer("sort_order").notNull().default(0),
  isPublished: boolean("is_published").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const banners = pgTable("banners", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  title: text("title"),
  subtitle: text("subtitle"),
  ctaText: text("cta_text"),
  ctaLink: text("cta_link"),
  imageUrl: text("image_url"),
  position: text("position").notNull().default("hero"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  startDate: timestamp("start_date"),
  endDate: timestamp("end_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const popularCities = pgTable("popular_cities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  state: text("state"),
  imageUrl: text("image_url"),
  propertyCount: integer("property_count").notNull().default(0),
  searchParams: jsonb("search_params").$type<Record<string, string>>(),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const navPositionEnum = pgEnum("nav_position", ["header", "footer", "both"]);
export const navSectionEnum = pgEnum("nav_section", ["quick_links", "for_sellers", "legal", "main"]);
export const linkTypeEnum = pgEnum("link_type", ["internal", "external", "search_filter"]);

export const navigationLinks = pgTable("navigation_links", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  label: text("label").notNull(),
  url: text("url").notNull(),
  position: navPositionEnum("position").notNull().default("footer"),
  section: navSectionEnum("section").notNull().default("quick_links"),
  linkType: linkTypeEnum("link_type").notNull().default("internal"),
  searchParams: jsonb("search_params").$type<Record<string, string>>(),
  icon: text("icon"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  openInNewTab: boolean("open_in_new_tab").notNull().default(false),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyTypesManaged = pgTable("property_types_managed", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  description: text("description"),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertyCategories = pgTable("property_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  icon: text("icon"),
  description: text("description"),
  propertyCount: integer("property_count").notNull().default(0),
  allowedTransactionTypes: jsonb("allowed_transaction_types").$type<string[]>().default(["sale", "rent", "lease"]),
  hasProjectStage: boolean("has_project_stage").notNull().default(false),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const propertySubcategories = pgTable("property_subcategories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  categoryId: varchar("category_id").notNull().references(() => propertyCategories.id),
  name: text("name").notNull(),
  slug: text("slug").notNull(),
  icon: text("icon"),
  description: text("description"),
  applicableFor: jsonb("applicable_for").$type<string[]>().default(["sale", "rent", "lease"]),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const siteSettings = pgTable("site_settings", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  key: text("key").notNull().unique(),
  value: text("value"),
  type: text("type").notNull().default("text"),
  category: text("category").notNull().default("general"),
  label: text("label"),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Verified Builders - for homepage showcase and landing pages (Builder/Corporate only)
export const verifiedBuilders = pgTable("verified_builders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  companyName: text("company_name").notNull(),
  slug: text("slug").notNull().unique(),
  logoUrl: text("logo_url"),
  bannerImage: text("banner_image"),
  description: text("description"),
  aboutText: text("about_text"),
  establishedYear: integer("established_year"),
  website: text("website"),
  contactEmail: text("contact_email"),
  contactPhone: text("contact_phone"),
  address: text("address"),
  city: text("city"),
  state: text("state"),
  sellerId: varchar("seller_id").references(() => sellerProfiles.id),
  propertyCount: integer("property_count").notNull().default(0),
  isVerified: boolean("is_verified").notNull().default(false),
  showOnHomepage: boolean("show_on_homepage").notNull().default(true),
  hasLandingPage: boolean("has_landing_page").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Projects - for Builder/Broker/Corporate project listings (Sale only)
export const projectStatusEnum = pgEnum("project_status", ["draft", "submitted", "under_review", "approved", "live", "rejected", "completed"]);

export const projects = pgTable("projects", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  sellerId: varchar("seller_id").notNull().references(() => sellerProfiles.id),
  name: text("name").notNull(),
  slug: text("slug").notNull().unique(),
  description: text("description"),
  bannerImage: text("banner_image"),
  galleryImages: jsonb("gallery_images").$type<string[]>(),
  youtubeVideoUrl: text("youtube_video_url"),
  address: text("address"),
  locality: text("locality"),
  city: text("city").notNull(),
  state: text("state").notNull(),
  pincode: text("pincode"),
  latitude: decimal("latitude", { precision: 10, scale: 8 }),
  longitude: decimal("longitude", { precision: 11, scale: 8 }),
  projectStage: projectStageEnum("project_stage").notNull().default("under_construction"),
  launchDate: timestamp("launch_date"),
  completionDate: timestamp("completion_date"),
  reraNumber: text("rera_number"),
  totalUnits: integer("total_units"),
  availableUnits: integer("available_units"),
  priceRangeMin: integer("price_range_min"),
  priceRangeMax: integer("price_range_max"),
  areaRangeMin: integer("area_range_min"),
  areaRangeMax: integer("area_range_max"),
  amenities: jsonb("amenities").$type<string[]>(),
  highlights: jsonb("highlights").$type<string[]>(),
  specifications: jsonb("specifications").$type<{ category: string; items: string[] }[]>(),
  floorPlans: jsonb("floor_plans").$type<{ name: string; area: number; price: number; imageUrl?: string }[]>(),
  status: projectStatusEnum("status").notNull().default("draft"),
  isFeatured: boolean("is_featured").notNull().default(false),
  viewCount: integer("view_count").notNull().default(0),
  inquiryCount: integer("inquiry_count").notNull().default(0),
  approvedAt: timestamp("approved_at"),
  approvedBy: varchar("approved_by").references(() => users.id),
  rejectionReason: text("rejection_reason"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Testimonials - for customer testimonials displayed on homepage and testimonials page
export const testimonials = pgTable("testimonials", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  customerName: text("customer_name").notNull(),
  customerRole: text("customer_role"),
  customerImage: text("customer_image"),
  content: text("content").notNull(),
  rating: integer("rating").notNull().default(5),
  location: text("location"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Team Members - for team member profiles displayed on About page
export const teamMembers = pgTable("team_members", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  role: text("role"),
  bio: text("bio"),
  imageUrl: text("image_url"),
  linkedinUrl: text("linkedin_url"),
  twitterUrl: text("twitter_url"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Company Values - for company values displayed on About page
export const companyValues = pgTable("company_values", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  icon: text("icon").notNull().default("target"),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Hero Slides - for homepage hero banner slides
export const heroSlides = pgTable("hero_slides", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  subtitle: text("subtitle"),
  imageUrl: text("image_url"),
  buttonText: text("button_text"),
  buttonLink: text("button_link"),
  overlayOpacity: integer("overlay_opacity").notNull().default(50),
  isActive: boolean("is_active").notNull().default(true),
  sortOrder: integer("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  lastLoginAt: true,
});

export type UpsertUser = {
  id: string;
  email?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  profileImageUrl?: string | null;
};

export const insertSellerProfileSchema = createInsertSchema(sellerProfiles).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  totalListings: true,
  totalSold: true,
  rating: true,
  reviewCount: true,
});

export const insertPackageSchema = createInsertSchema(packages).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  inquiryCount: true,
  favoriteCount: true,
  publishedAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  respondedAt: true,
});

export const insertFavoriteSchema = createInsertSchema(favorites).omit({
  id: true,
  createdAt: true,
});

export const insertChatMessageSchema = createInsertSchema(chatMessages).omit({
  id: true,
  createdAt: true,
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export const insertAppointmentSchema = createInsertSchema(appointments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  confirmedAt: true,
  completedAt: true,
  cancelledAt: true,
});

export const insertPaymentSchema = createInsertSchema(payments).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertContactMessageSchema = createInsertSchema(contactMessages).omit({
  id: true,
  createdAt: true,
  repliedAt: true,
});

export const insertReviewSchema = createInsertSchema(reviews).omit({
  id: true,
  createdAt: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertSellerProfile = z.infer<typeof insertSellerProfileSchema>;
export type SellerProfile = typeof sellerProfiles.$inferSelect;

export type InsertPackage = z.infer<typeof insertPackageSchema>;
export type Package = typeof packages.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type PropertyImage = typeof propertyImages.$inferSelect;
export type PropertyDocument = typeof propertyDocuments.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertFavorite = z.infer<typeof insertFavoriteSchema>;
export type Favorite = typeof favorites.$inferSelect;

export type SavedSearch = typeof savedSearches.$inferSelect;
export type PropertyView = typeof propertyViews.$inferSelect;

export type ChatThread = typeof chatThreads.$inferSelect;
export type InsertChatMessage = z.infer<typeof insertChatMessageSchema>;
export type ChatMessage = typeof chatMessages.$inferSelect;

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export type InsertAppointment = z.infer<typeof insertAppointmentSchema>;
export type Appointment = typeof appointments.$inferSelect;

export type InsertPayment = z.infer<typeof insertPaymentSchema>;
export type Payment = typeof payments.$inferSelect;

export type InsertReview = z.infer<typeof insertReviewSchema>;
export type Review = typeof reviews.$inferSelect;

export type InsertContactMessage = z.infer<typeof insertContactMessageSchema>;
export type ContactMessage = typeof contactMessages.$inferSelect;

export type AdminApproval = typeof adminApprovals.$inferSelect;
export type AuditLog = typeof auditLogs.$inferSelect;
export type SystemSetting = typeof systemSettings.$inferSelect;
export type SellerSubscription = typeof sellerSubscriptions.$inferSelect;
export type PropertyAlert = typeof propertyAlerts.$inferSelect;
export type PropertyApprovalRequest = typeof propertyApprovalRequests.$inferSelect;

export const insertInvoiceSchema = createInsertSchema(invoices).omit({
  id: true,
  createdAt: true,
});

export const insertInvoiceSettingsSchema = createInsertSchema(invoiceSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPlatformSettingSchema = createInsertSchema(platformSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEmailTemplateSchema = createInsertSchema(emailTemplates).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertInvoice = z.infer<typeof insertInvoiceSchema>;
export type Invoice = typeof invoices.$inferSelect;

export type InsertInvoiceSettings = z.infer<typeof insertInvoiceSettingsSchema>;
export type InvoiceSettings = typeof invoiceSettings.$inferSelect;

export type InsertPlatformSetting = z.infer<typeof insertPlatformSettingSchema>;
export type PlatformSetting = typeof platformSettings.$inferSelect;

export type InsertEmailTemplate = z.infer<typeof insertEmailTemplateSchema>;
export type EmailTemplate = typeof emailTemplates.$inferSelect;

export const insertFaqItemSchema = createInsertSchema(faqItems).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertStaticPageSchema = createInsertSchema(staticPages).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertBannerSchema = createInsertSchema(banners).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertFaqItem = z.infer<typeof insertFaqItemSchema>;
export type FaqItem = typeof faqItems.$inferSelect;

export type InsertStaticPage = z.infer<typeof insertStaticPageSchema>;
export type StaticPage = typeof staticPages.$inferSelect;

export type InsertBanner = z.infer<typeof insertBannerSchema>;
export type Banner = typeof banners.$inferSelect;

export const insertPopularCitySchema = createInsertSchema(popularCities).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertNavigationLinkSchema = createInsertSchema(navigationLinks).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertyTypeManagedSchema = createInsertSchema(propertyTypesManaged).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSiteSettingSchema = createInsertSchema(siteSettings).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPopularCity = z.infer<typeof insertPopularCitySchema>;
export type PopularCity = typeof popularCities.$inferSelect;

export type InsertNavigationLink = z.infer<typeof insertNavigationLinkSchema>;
export type NavigationLink = typeof navigationLinks.$inferSelect;

export type InsertPropertyTypeManaged = z.infer<typeof insertPropertyTypeManagedSchema>;
export type PropertyTypeManaged = typeof propertyTypesManaged.$inferSelect;

export type InsertSiteSetting = z.infer<typeof insertSiteSettingSchema>;
export type SiteSetting = typeof siteSettings.$inferSelect;

export const insertPropertyCategorySchema = createInsertSchema(propertyCategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  propertyCount: true,
});

export const insertPropertySubcategorySchema = createInsertSchema(propertySubcategories).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertPropertyCategory = z.infer<typeof insertPropertyCategorySchema>;
export type PropertyCategory = typeof propertyCategories.$inferSelect;

export type InsertPropertySubcategory = z.infer<typeof insertPropertySubcategorySchema>;
export type PropertySubcategory = typeof propertySubcategories.$inferSelect;

export const insertVerifiedBuilderSchema = createInsertSchema(verifiedBuilders).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  propertyCount: true,
});

export const insertProjectSchema = createInsertSchema(projects).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
  viewCount: true,
  inquiryCount: true,
  approvedAt: true,
  approvedBy: true,
});

export type InsertVerifiedBuilder = z.infer<typeof insertVerifiedBuilderSchema>;
export type VerifiedBuilder = typeof verifiedBuilders.$inferSelect;

export type InsertProject = z.infer<typeof insertProjectSchema>;
export type Project = typeof projects.$inferSelect;

export const insertTestimonialSchema = createInsertSchema(testimonials).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertTeamMemberSchema = createInsertSchema(teamMembers).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertCompanyValueSchema = createInsertSchema(companyValues).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertHeroSlideSchema = createInsertSchema(heroSlides).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export type InsertTestimonial = z.infer<typeof insertTestimonialSchema>;
export type Testimonial = typeof testimonials.$inferSelect;

export type InsertTeamMember = z.infer<typeof insertTeamMemberSchema>;
export type TeamMember = typeof teamMembers.$inferSelect;

export type InsertCompanyValue = z.infer<typeof insertCompanyValueSchema>;
export type CompanyValue = typeof companyValues.$inferSelect;

export type InsertHeroSlide = z.infer<typeof insertHeroSlideSchema>;
export type HeroSlide = typeof heroSlides.$inferSelect;
