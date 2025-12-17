# VenGrow - Real Estate Marketplace India

## Overview

VenGrow is a real estate marketplace platform for the Indian market, connecting property buyers, sellers, and brokers. It offers property listings, search, inquiries, and transactions, featuring verified sellers, package-based listing subscriptions, and role-based dashboards. The platform aims to be a leading solution in the Indian real estate sector.

## User Preferences

Preferred communication style: Simple, everyday language.

## Test Credentials

**Test Seller Account:**
- Email: `testseller@vengrow.com`
- Password: `Test@123`
- User ID: `56eff86c-3819-41e5-a36e-ee7c9c462ccf`
- Has active Basic subscription (valid until Jan 2026)
- Seller Type: Broker

**Test Buyer Account:**
- Email: `testbuyer@vengrow.com`
- Password: `Test@123`
- User ID: `828bcfaa-11df-48c1-a523-7e5105d0bca2`

**Admin Account:**
- Email: `admin@vengrow.com`
- Admin login via `/admin/login`

## System Architecture

### Frontend Architecture

The frontend uses React 18 with TypeScript, Vite, Wouter for routing, and TanStack Query for server state. The UI is built with shadcn/ui and Tailwind CSS, following a mobile-first responsive design with custom CSS variables for theming. State management relies on React Query for server state and react-hook-form with Zod for form state. Key patterns include component composition, custom hooks, consistent spacing, and role-based UI rendering.

### Backend Architecture

The backend is built with Node.js and Express.js, using TypeScript for type safety. It features a RESTful API design with centralized route registration. Storage uses an abstracted interface, currently implemented with in-memory storage, designed for future integration with Drizzle ORM and PostgreSQL.

### Data Storage

PostgreSQL via Neon serverless is the primary database, managed with Drizzle ORM for type-safe queries and migrations. The schema is defined in shared files for client/server type sharing, utilizing UUIDs for primary keys. Drizzle Kit handles schema migrations.

### Authentication & Authorization

A multi-role authentication system supports Google OAuth and email/password for regular users, and separate admin authentication. Intent-based registration guides users as buyers or sellers, with detailed seller type differentiation (Individual, Broker, Corporate). Session management uses Express-session with a PostgreSQL store. Role-based access control is implemented client-side with ProtectedRoute components and role-specific navigation.

### Property Approval Workflow

Properties progress through states: draft, submitted, under_review, approved, live, needs_reapproval, and rejected. An admin moderation queue manages approval/rejection, and properties edited after approval require re-review.

### Package & Subscription System

The platform offers tiered subscription packages (Free, Basic, Premium, Enterprise) that dictate listing limits. Sellers must have active subscriptions to create listings. Razorpay is integrated for payments, with a dummy gateway for development. Payments automatically create subscriptions and seller profiles.

### Design System & Theming

A color system based on CSS custom properties provides semantic color tokens and automatic dark mode support. Components utilize variants for consistent styling. Accessibility is ensured through Radix UI primitives, keyboard navigation, and focus states. Subtle animations enhance user interaction.

### Interactive Maps

A PropertyMapView component uses Leaflet with OpenStreetMap tiles, offering grid, list, and map views for property listings. Interactive markers with popups display property details, and the map auto-fits bounds to show all properties.

### Verified Builders Section

The homepage features a section showcasing clickable corporate builder logos with verified badges, property counts, and links to filtered listings.

### Transaction Types

The platform supports three transaction types: Buy (Sale), Lease, and Rent. The UI consistently displays these in the Buy/Lease/Rent sequence across all components. Both Lease and Rent properties display "/month" price suffix. Components updated for this include:
- HeroSection with transaction type tabs
- ListingsFilterHeader with Buy/Lease/Rent tabs
- FilterSidebar with transaction type checkboxes
- PropertyCard with transaction type badges
- Seller create listing flow with Lease option
- Admin listing moderation with Lease support

### Property Categories & Subcategories

The platform features an expanded hierarchical property categorization system with 11 main categories and 63 subcategories:

**Categories:**
1. Apartments (Studio, 1BHK, 2BHK, 3BHK, 4BHK, 5BHK+, Penthouse, Duplex, Service)
2. Villas (Independent, Luxury, Farm House, Row House, Twin, Triplex)
3. Plots (Residential, Commercial, Agricultural, Industrial, NA)
4. Independent House (1RK, 1BHK, 2BHK, 3BHK, 4BHK, 5BHK+)
5. New Projects (Residential, Commercial, Integrated Township)
6. Ultra Luxury (Premium Apartments, Luxury Villas, Premium Commercial)
7. Commercial (Office Space, Shop, Showroom, Warehouse, Industrial Building, Co-working, Business Center)
8. Joint Venture (Land, Redevelopment, Partial Development)
9. PG (Single, Double, Triple Sharing, Boys Only, Girls Only, Co-ed)
10. Farm Land (Agriculture, Converted, NA Plot, Orchard)
11. Rush Deal (Distress Sale, Bank Auction, Quick Sale)

**Project Stage Filter:** Applicable to New Projects, Apartments, Villas categories:
- Pre-launch
- Launch
- Under Construction
- Ready to Move

**Implementation:**
- Database tables: `property_categories` and `property_subcategories` with parent-child relationships
- Admin management via `/admin/property-types` with tabbed interface for categories/subcategories
- Seller create listing form dynamically loads subcategories based on selected category
- FilterSidebar displays category and subcategory filters with project stage for applicable categories
- PropertyCard displays project stage and subcategory badges

### Enhanced FilterSidebar

The filter sidebar includes advanced options for transaction type (Buy/Lease/Rent), location (city/locality), property category/subcategory selection, project stage (for applicable categories), property age, builder/developer search, and seller type, all with robust test attributes.

### Seller Dashboard Components

The SellerDashboardPage includes an ApprovalStatusTracker, providing visual progress for property workflow, displaying rejected properties with reasons, and offering actions for editing or resubmitting. The ManageListingsPage supports filtering by status including "Leased" alongside "Sold" and "Rented".

### Property Listing Features

Properties now capture additional details including Possession Status (Ready to Move/Under Construction), New Construction indicator, Furnishing Status (Unfurnished/Semi-Furnished/Fully Furnished), and Property Age. These fields are displayed as badges in PropertyCard, property detail pages, and admin moderation views.

### Admin Content Management System

A reusable AdminDataTable component powers various content management pages, including Popular Cities, Property Types, Navigation Links, Static Pages, FAQs, Banners, and Site Settings. It offers configurable filters, sortable columns, and row actions.

### Routing & Navigation

Client-side routing is handled by Wouter, supporting public, authenticated, and administrative routes. Navigation patterns include a sticky header, mobile hamburger menu, and breadcrumbs.

## External Dependencies

**UI Component Library:**
- @radix-ui/* primitives
- shadcn/ui

**Styling & Design:**
- Tailwind CSS
- class-variance-authority
- clsx, tailwind-merge
- PostCSS

**Database & ORM:**
- @neondatabase/serverless
- drizzle-orm, drizzle-zod
- ws
- connect-pg-simple

**Form Handling:**
- react-hook-form
- @hookform/resolvers
- Zod

**Date & Time:**
- date-fns

**Development Tools:**
- tsx, esbuild, vite
- @replit/vite-plugin-*

**Utilities:**
- nanoid
- lucide-react
- cmdk