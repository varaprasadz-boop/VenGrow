# VenGrow - Real Estate Marketplace India

## Overview

VenGrow is a comprehensive real estate marketplace platform tailored for the Indian market. It facilitates connections between property buyers, sellers, and brokers by offering robust property listings, advanced search functionalities, inquiry management, and streamlined transaction processes. The platform emphasizes verified sellers, package-based listing subscriptions, and role-based dashboards, aspiring to become a leading solution in the Indian real estate sector. Key capabilities include managing property listings, facilitating buyer-seller interactions, and providing administrative tools for platform oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend

The frontend is built with React 18, TypeScript, Vite, Wouter for routing, and TanStack Query for server state. It uses shadcn/ui and Tailwind CSS for a mobile-first, responsive design. State management leverages React Query and react-hook-form with Zod. The design system employs custom CSS variables for theming, component composition, and custom hooks, ensuring consistent UI and role-based rendering.

### Backend

The backend utilizes Node.js and Express.js with TypeScript, featuring a RESTful API design. It's built with an abstracted storage interface, currently in-memory, but designed for future integration with Drizzle ORM and PostgreSQL.

### Data Storage

PostgreSQL, hosted on Neon serverless, is the primary database, managed by Drizzle ORM for type-safe queries and migrations. The schema is defined in shared files, using UUIDs for primary keys, with Drizzle Kit handling migrations.

### Authentication & Authorization

The platform features a multi-role authentication system supporting Google OAuth and email/password logins for users, and separate admin authentication. User registration is intent-based (buyer or seller), with granular seller types (Individual, Broker, Corporate). Session management uses Express-session with a PostgreSQL store. Role-based access control is implemented both client-side (ProtectedRoute) and server-side.

### Core Features & Workflows

-   **Property Approval Workflow**: Properties progress through states like draft, submitted, under_review, approved, and rejected, managed by an admin moderation queue.
-   **Package & Subscription System**: Tiered subscription packages (Free, Basic, Premium, Enterprise) dictate listing limits, integrated with Razorpay for payments and automatic subscription creation.
-   **Design System & Theming**: A CSS custom property-based color system provides semantic tokens and automatic dark mode. Accessibility is ensured via Radix UI primitives.
-   **Interactive Maps**: Google Maps API (@react-google-maps/api) is used for various map components, including property views, detail pages, and location selection, with Google Places Autocomplete.
-   **Verified Builders Section**: A homepage section highlights corporate builders, linking to their filtered listings.
-   **Transaction Types**: Supports Buy (Sale), Lease, and Rent, consistently displayed across the UI.
-   **Property Categorization**: A hierarchical system with 11 main categories and 63 subcategories, including project stage filters for relevant categories.
-   **Location Standardization**: Uses standardized dropdowns for Indian states, cities, and PIN codes, enhancing data consistency.
-   **Enhanced FilterSidebar**: Advanced filtering options including transaction type, location, property category/subcategory, project stage, property age, builder search, and seller type.
-   **Seller Dashboard**: Includes an ApprovalStatusTracker for property workflow visualization and management, with lead and appointment management planned.
-   **Property Listing Details**: Captures Possession Status, New Construction, Furnishing Status, and Property Age.
-   **Admin CMS**: A reusable AdminDataTable component powers content management for various platform entities.
-   **Routing**: Client-side routing with Wouter for public, authenticated, and administrative routes, including sticky header, mobile menu, and breadcrumbs.

## External Dependencies

### UI Component Library
-   @radix-ui/* primitives
-   shadcn/ui

### Styling & Design
-   Tailwind CSS
-   class-variance-authority
-   clsx, tailwind-merge
-   PostCSS

### Database & ORM
-   @neondatabase/serverless
-   drizzle-orm, drizzle-zod
-   ws
-   connect-pg-simple

### Form Handling
-   react-hook-form
-   @hookform/resolvers
-   Zod

### Date & Time
-   date-fns

### Development Tools
-   tsx, esbuild, vite
-   @replit/vite-plugin-*

### Utilities
-   nanoid
-   lucide-react
-   cmdk

### Payment Gateway
-   Razorpay

### Mapping & Location Services
-   Google Maps API (@react-google-maps/api)
-   Google Places Autocomplete

---

## 🎯 IMPLEMENTATION ROADMAP (Master Plan)

**Last Updated:** December 2024

This is the complete implementation plan for VenGrow. Reference this for all remaining features.

---

### ✅ COMPLETED FEATURES

| Feature | Status |
|---------|--------|
| User authentication (buyer/seller/admin roles) | ✅ Done |
| Property listings with categories/subcategories | ✅ Done |
| Property search & filters | ✅ Done |
| Property detail pages with inquiry form | ✅ Done |
| Seller registration & packages | ✅ Done |
| Razorpay payment integration | ✅ Done |
| Admin property moderation | ✅ Done |
| Google Maps integration | ✅ Done |
| Builder landing pages (BuildersListPage, BuilderLandingPage) | ✅ Done |
| Projects catalog (ProjectsListPage, ProjectDetailPage) | ✅ Done |
| YouTube video embedding on properties | ✅ Done |
| **Inquiries system** (schema, API, frontend form) | ✅ Done |
| **Favorites** (schema, API, FavoritesPage) | ✅ Done |
| **Buyer Dashboard** (BuyerDashboardPage with stats) | ✅ Done |
| **Seller Leads Dashboard** (LeadManagementPage with hot/warm/cold) | ✅ Done |
| **Saved Searches** (schema, API, SavedSearchesPage) | ✅ Done |
| **Chat schema** (chatThreads, chatMessages tables) | ✅ Done |
| **Notifications schema** (notifications table) | ✅ Done |

---

### 📋 PHASE 2: Appointments & Real-Time Communication

**Goal:** Enable property visit scheduling and real-time messaging.

| Task ID | Feature | Description | Priority | Status |
|---------|---------|-------------|----------|--------|
| P2.1 | Appointments Schema | Create `appointments` table (buyerId, sellerId, propertyId, dateTime, status, notes) | Critical | ⏳ Pending |
| P2.2 | Appointments Storage & API | CRUD for appointments, status updates | Critical | ⏳ Pending |
| P2.3 | Schedule Visit Button | On property page, opens date/time picker modal | Critical | ⏳ Pending |
| P2.4 | Seller Appointments Dashboard | `/seller/appointments` - Calendar view, accept/reject/reschedule | Critical | ⏳ Pending |
| P2.5 | Buyer Appointments View | List scheduled visits in buyer dashboard | High | ⏳ Pending |
| P2.6 | Chat Storage & API | WebSocket integration for real-time messaging (schema exists) | High | ⏳ Pending |
| P2.7 | Chat UI Component | Conversation list, message thread, send message | High | ⏳ Pending |
| P2.8 | Notifications Bell Icon | Header notification icon with unread count, dropdown (schema exists) | High | ⏳ Pending |

---

### 📋 PHASE 3: Seller Tools & Project Management

**Goal:** Empower sellers (Builders/Brokers) to manage their projects.

| Task ID | Feature | Description | Priority | Status |
|---------|---------|-------------|----------|--------|
| P3.1 | Seller Project Create Page | `/seller/projects/create` - Form for builders/brokers to add projects (Sale only) | Critical | ⏳ Pending |
| P3.2 | Seller Project Edit Page | `/seller/projects/:id/edit` - Edit existing projects | Critical | ⏳ Pending |
| P3.3 | Seller Projects List | `/seller/projects` - Manage all seller's projects | Critical | ⏳ Pending |
| P3.4 | Link Properties to Projects | When creating listing, option to link to seller's project | High | ⏳ Pending |
| P3.5 | Lead CRM Features | Notes on leads, follow-up reminders, conversion tracking | Medium | ⏳ Pending |
| P3.6 | Seller Analytics Dashboard | Views count, inquiry count, conversion rate charts | Medium | ⏳ Pending |
| P3.7 | Subscription Quota Enforcement | Check listing limits before allowing new listings | High | ⏳ Pending |

---

### 📋 PHASE 4: Admin Governance

**Goal:** Complete admin tooling for platform management.

| Task ID | Feature | Description | Priority | Status |
|---------|---------|-------------|----------|--------|
| P4.1 | Admin Verified Builders CRUD | `/admin/verified-builders` - Full management UI (route exists, needs implementation) | Critical | ⏳ Pending |
| P4.2 | Admin Projects Moderation | `/admin/projects` - Approve/reject seller-submitted projects | Critical | ⏳ Pending |
| P4.3 | Admin User Management | `/admin/users` - View/edit/suspend users | High | ⏳ Pending |
| P4.4 | Admin Analytics Dashboard | Platform stats: users, listings, inquiries, revenue | Medium | ⏳ Pending |
| P4.5 | Audit Logging | Track admin actions (approvals, rejections, edits) | Medium | ⏳ Pending |

---

### 📋 PHASE 5: Platform Polish & Production Readiness

**Goal:** Finalize for production launch.

| Task ID | Feature | Description | Priority | Status |
|---------|---------|-------------|----------|--------|
| P5.1 | Email Notifications | Send emails for inquiries, appointments, status changes | High | ⏳ Pending |
| P5.2 | Razorpay Webhooks | Handle payment success/failure webhooks properly | High | ⏳ Pending |
| P5.3 | Invoice/Payment History | Sellers can view payment history and download invoices | Medium | ⏳ Pending |
| P5.4 | SEO Meta Tags | Dynamic titles, descriptions for all pages | Medium | ⏳ Pending |
| P5.5 | Mobile Responsiveness Audit | Test and fix all pages on mobile devices | Medium | ⏳ Pending |
| P5.6 | Error Handling & 404 Pages | Proper error boundaries, user-friendly error pages | Medium | ⏳ Pending |

---

### 📊 PROGRESS TRACKER

| Phase | Tasks | Completed | Remaining |
|-------|-------|-----------|-----------|
| Phase 1: Core Engagement | 10 | 10 | 0 ✅ |
| Phase 2: Appointments & Chat | 8 | 0 | 8 |
| Phase 3: Seller Tools | 7 | 0 | 7 |
| Phase 4: Admin Governance | 5 | 0 | 5 |
| Phase 5: Polish | 6 | 0 | 6 |
| **TOTAL** | **36** | **10** | **26** |

---

### 🔧 TECHNICAL NOTES

**Database Tables to Create:**
- `appointments` - Property visit scheduling (MISSING)

**Already Existing Tables:**
- `inquiries` - Buyer property inquiries/leads ✅
- `favorites` - User saved properties ✅
- `saved_searches` - User saved filter combinations ✅
- `chat_threads` & `chat_messages` - Messaging ✅
- `notifications` - In-app notifications ✅
- `property_views` - View tracking ✅
- `verified_builders` - Builder profiles ✅
- `projects` - Real estate projects ✅

**Key Constraints:**
- Projects feature: Only for Builder/Corporate AND Agent/Broker sellers (NOT Individual)
- Projects: Sale transactions only (no Lease/Rent)
- Builder landing pages: Only for Builder/Corporate seller types

**Test Credentials:**
- Buyer: testbuyer@vengrow.com / Test@123
- Seller: testseller@vengrow.com / Test@123
- Admin: superadmin@vengrow.com / Pa$$word@11