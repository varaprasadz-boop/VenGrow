# VenGrow - Real Estate Marketplace India

## Overview

VenGrow is a real estate marketplace platform designed for the Indian market, connecting property buyers, sellers, and brokers. The application facilitates property listings, searches, inquiries, and transactions with features like verified sellers, package-based listing subscriptions, and role-based dashboards.

The platform follows a modern full-stack architecture with React/TypeScript on the frontend, Express.js for the backend API, and PostgreSQL (via Neon serverless) for data persistence. The design system is built on shadcn/ui components with Tailwind CSS, drawing inspiration from Airbnb's property cards, Linear's clean interfaces, and popular Indian real estate platforms like 99acres and MagicBricks.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build System:**
- React 18 with TypeScript for type safety
- Vite as the build tool and development server
- Wouter for client-side routing (lightweight alternative to React Router)
- TanStack Query (React Query) for server state management and API data fetching

**UI Component System:**
- shadcn/ui component library (Radix UI primitives with custom styling)
- Tailwind CSS for utility-first styling with custom design tokens
- Component variant architecture using class-variance-authority (CVA)
- Design system inspired by Airbnb, Linear, and Indian real estate platforms

**State Management:**
- React Query for server state (property listings, user data, inquiries)
- Local React state (useState, useContext) for UI state
- Form state managed via react-hook-form with Zod validation

**Styling Philosophy:**
- Mobile-first responsive design (critical for Indian market)
- Custom CSS variables for theming (light/dark mode support)
- Elevation-based interactions (hover-elevate, active-elevate classes)
- Typography: Inter for body text, Poppins for headings (Google Fonts)

**Key Design Patterns:**
- Component composition with clear separation of presentational and container components
- Custom hooks for reusable logic (use-mobile, use-toast)
- Consistent spacing primitives (4, 8, 12, 16, 24, 32, 48)
- Role-based UI rendering (buyer, seller, admin user types)

### Backend Architecture

**Runtime & Framework:**
- Node.js with Express.js for HTTP server
- TypeScript for type safety across the stack
- ESM modules (type: "module" in package.json)

**Development vs Production:**
- Development mode: Vite dev server with HMR middleware integration
- Production mode: Static file serving from pre-built dist/public directory
- Separate entry points (index-dev.ts vs index-prod.ts)

**API Structure:**
- RESTful API design with routes prefixed under /api
- Centralized route registration in server/routes.ts
- Express middleware for JSON parsing, request logging, and error handling

**Storage Layer:**
- Abstracted storage interface (IStorage) for CRUD operations
- In-memory implementation (MemStorage) for development/testing
- Designed for easy swap to database implementation (Drizzle ORM ready)

### Data Storage

**Database:**
- PostgreSQL via Neon serverless (WebSocket-based connection)
- Drizzle ORM for type-safe database queries and migrations
- Connection pooling via @neondatabase/serverless Pool

**Schema Design:**
- Schema defined in shared/schema.ts for type sharing between client/server
- Drizzle-Zod integration for runtime validation from database schema
- UUID-based primary keys with PostgreSQL's gen_random_uuid()

**Migration Strategy:**
- Drizzle Kit for schema migrations (drizzle.config.ts)
- Schema changes tracked in migrations directory
- Push-based workflow (db:push script) for rapid development

**Current Schema:**
- Users table with username/password authentication (baseline implementation)
- Extensible design ready for properties, listings, inquiries, packages, etc.

### Authentication & Authorization

**Multi-Role Authentication:**
- Dual authentication system: Google OAuth + email/password for regular users
- Separate admin authentication at /admin/login with dedicated session management
- Superadmin credentials configured via environment variables (SUPERADMIN_EMAIL, SUPERADMIN_PASSWORD_HASH)
- No hardcoded credentials - server fails gracefully if env vars not configured
- Password hashing using bcrypt with configurable salt rounds

**Intent-Based Registration:**
- Registration flow begins with intent selection (Buyer vs Seller)
- Buyer flow: Simple signup with name, email, phone (10-digit Indian mobile validation)
- Seller flow: Package selection first, then registration with seller type (owner/broker/builder)

**Session Management:**
- Express-session with PostgreSQL store (connect-pg-simple)
- Separate session namespaces for regular users (req.session.user) and admins (req.session.adminUser)
- HTTP-only session cookies with secure flag in production

**Role-Based Access Control:**
- Three user types: buyer, seller, admin
- ProtectedRoute component for client-side route protection
- Role-specific sidebars and navigation (AppSidebar.tsx)

### Property Approval Workflow

**Workflow States:**
- draft: Initial state, property being created/edited
- submitted: Seller submitted for admin review
- under_review: Admin is reviewing the property
- approved: Admin approved, ready to go live
- live: Property is published and visible to buyers
- needs_reapproval: Property was edited after approval, requires re-review
- rejected: Admin rejected with feedback

**Approval Flow:**
1. Seller creates property (status: draft)
2. Seller submits for review (status: submitted)
3. Admin reviews in moderation queue
4. Admin approves (status: approved → live) or rejects (status: rejected with notes)
5. If seller edits an approved/live property, it goes to needs_reapproval
6. Changes stored in pendingChanges field until re-approved

**API Endpoints:**
- POST /api/properties/:id/submit - Submit property for review
- PUT /api/admin/properties/:id/status - Admin approve/reject with notes
- GET /api/admin/properties/pending - Get all properties pending review

### Package & Subscription System

**Package Tiers:**
- Free: 1 listing, 365 days, ₹0
- Basic: 3 listings, 30 days, ₹999
- Premium: 10 listings, 60 days, ₹2,499 (includes featured listings)
- Enterprise: 50 listings, 90 days, ₹9,999 (includes premium support)

**Subscription Management:**
- Sellers must have an active subscription to create property listings
- Subscription tracks listingsUsed vs listingLimit
- Automatic check before property creation via canSellerCreateListing
- Subscription history available for seller accounts

**Payment Integration:**
- Razorpay integration ready (requires RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET)
- Dummy payment gateway for development/testing when Razorpay not configured
- Test card for dummy payments: 4111-1111-1111-1111 (any future expiry, any CVV)
- Payment creates subscription and seller profile automatically

**Subscription API Endpoints:**
- GET /api/subscriptions/current - Get seller's active subscription with package details
- GET /api/subscriptions/can-create-listing - Check if seller can create more listings
- GET /api/subscriptions/history - Get subscription history
- POST /api/payments/dummy - Process dummy payment (test mode)

### Design System & Theming

**Color System:**
- CSS custom properties (HSL-based) for all colors
- Semantic color tokens (primary, secondary, muted, accent, destructive)
- Automatic dark mode support via class-based theming
- Border color variants for opaque button styling

**Component Variants:**
- Button: default, destructive, outline, secondary, ghost
- Badge: default, secondary, destructive, outline
- Card: elevated with border and shadow variants
- Form controls: consistent sizing and focus states

**Accessibility:**
- Radix UI primitives ensure ARIA compliance
- Keyboard navigation support across all interactive components
- Focus visible states with ring utilities
- Screen reader text for icon-only buttons

**Animation & Interactions:**
- Subtle elevation changes on hover/active states
- Smooth transitions using Tailwind's transition utilities
- Accordion animations for collapsible content
- Toast notifications for user feedback

### Interactive Maps

**Map View Feature:**
- PropertyMapView component using Leaflet with OpenStreetMap tiles
- Three-way view toggle on ListingsPage: grid, list, and map views
- Interactive property markers with popups showing property details
- Custom marker styling with featured property highlighting
- Auto-fit bounds to display all property markers
- Map shows property count indicator at bottom

**Map Integration:**
- react-leaflet for React integration with Leaflet
- Properties with lat/lng coordinates are displayed on the map
- Map popup includes property image, price, details, and link to full listing
- Mobile-responsive map container with minimum height

### Seller Dashboard Components

**ApprovalStatusTracker:**
- Visual progress tracker for property workflow status
- Shows pending properties with workflow step progress bar
- Displays rejected properties with rejection reasons
- Action buttons for continuing edits or resubmitting rejected properties
- Dark mode compatible color tokens for status badges
- Integrated into SellerDashboardPage

### Routing & Navigation

**Client-Side Routing:**
- Wouter for declarative route definitions
- Route-based code splitting ready (lazy loading)
- Protected routes implementable via wrapper components

**Route Structure:**
- Public pages: Home, Listings, Property Detail, Login, Register
- Authenticated pages: Dashboard, Favorites, Inquiries, Profile, Settings
- Auth flow pages: Email verification, OTP verification, password reset
- Static pages: About, Contact, FAQ, Terms, Privacy, Refund, How It Works
- Error pages: 404, 403, 500, Maintenance

**Navigation Patterns:**
- Sticky header with role-based navigation items
- Mobile hamburger menu (Sheet component)
- Breadcrumb navigation ready for deep pages

## External Dependencies

**UI Component Library:**
- @radix-ui/* primitives (accordion, dialog, dropdown, popover, etc.)
- Provides accessible, unstyled base components
- 25+ Radix UI packages for comprehensive UI patterns

**Styling & Design:**
- Tailwind CSS for utility-first styling
- class-variance-authority for component variant management
- clsx + tailwind-merge for conditional class merging
- PostCSS with autoprefixer for CSS processing

**Database & ORM:**
- @neondatabase/serverless for PostgreSQL connection
- drizzle-orm for type-safe queries and schema definition
- drizzle-zod for runtime validation from schema
- ws (WebSocket) for Neon's WebSocket-based connections
- connect-pg-simple for PostgreSQL session store

**Form Handling:**
- react-hook-form for performant form state
- @hookform/resolvers for validation integration
- Zod for schema validation

**Date & Time:**
- date-fns for date manipulation and formatting

**Development Tools:**
- tsx for running TypeScript in Node.js during development
- esbuild for production server bundling
- vite for frontend development and building
- @replit/vite-plugin-* for Replit-specific dev features

**Utilities:**
- nanoid for generating unique IDs
- lucide-react for icon components
- cmdk for command palette/search functionality

**Build Process:**
- Vite builds frontend to dist/public
- esbuild bundles backend to dist/index.js
- Static assets served from dist/public in production
- Development uses Vite middleware for HMR