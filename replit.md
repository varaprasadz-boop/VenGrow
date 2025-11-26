# PropConnect - Real Estate Marketplace India

## Overview

PropConnect is a real estate marketplace platform designed for the Indian market, connecting property buyers, sellers, and brokers. The application facilitates property listings, searches, inquiries, and transactions with features like verified sellers, package-based listing subscriptions, and role-based dashboards.

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

**Current Implementation:**
- Basic user schema with username and password fields
- Session management infrastructure ready (connect-pg-simple for PostgreSQL sessions)
- User types defined in UI (buyer, seller, admin) for role-based features

**Security Considerations:**
- Password storage requires hashing implementation (bcrypt/argon2)
- Session cookies with HTTP-only flags
- CSRF protection for state-changing operations
- Input validation with Zod schemas

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