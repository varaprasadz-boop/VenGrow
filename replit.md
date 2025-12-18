# VenGrow - Real Estate Marketplace India

## Overview

VenGrow is a comprehensive real estate marketplace platform for the Indian market, connecting property buyers, sellers, and brokers. It offers property listings, advanced search, inquiry management, and streamlined transactions. The platform features verified sellers, package-based listing subscriptions, and role-based dashboards, aiming to be a leading solution in Indian real estate. Its core capabilities include property management, facilitating buyer-seller interactions, and providing administrative oversight.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### UI/UX
The frontend is built with React 18, TypeScript, Vite, Wouter for routing, and TanStack Query for server state. It uses shadcn/ui and Tailwind CSS for a mobile-first, responsive design with custom CSS variables for theming, component composition, and custom hooks. This ensures a consistent UI and role-based rendering, including automatic dark mode and accessibility via Radix UI primitives. Interactive maps are integrated using Google Maps API and Google Places Autocomplete.

### Technical Implementation
The backend uses Node.js and Express.js with TypeScript, featuring a RESTful API and an abstracted storage interface. PostgreSQL, hosted on Neon serverless, is the primary database, managed by Drizzle ORM for type-safe queries and migrations. Authentication supports multi-role users (buyer, seller, admin) with Google OAuth and email/password, intent-based registration, and session management via Express-session with a PostgreSQL store. Role-based access control is implemented both client-side and server-side.

### Core Features
-   **Property Management:** Includes an admin moderation queue with a workflow (draft, submitted, under_review, approved, rejected), hierarchical categorization (11 main, 63 subcategories), and detailed listing options (possession status, furnishing, age).
-   **Seller Tools:** Features tiered subscription packages (Free, Basic, Premium, Enterprise) integrated with Razorpay, a Seller Dashboard with an Approval Status Tracker, lead and appointment management, and project management capabilities for Builders/Brokers.
-   **Buyer & Search Features:** Advanced FilterSidebar (transaction type, location, category, project stage, property age, builder, seller type), Saved Searches, Favorites, and a Buyer Dashboard.
-   **Communication & Interaction:** Inquiry forms, real-time chat, appointment scheduling, and a notification system.
-   **Admin Tools:** A reusable AdminDataTable component for content management (users, listings, projects, verified builders), and comprehensive analytics.
-   **Location & Standardization:** Standardized dropdowns for Indian states, cities, and PIN codes.
-   **Routing:** Client-side routing with Wouter for public, authenticated, and administrative sections, including sticky headers, mobile menus, and breadcrumbs.

## External Dependencies

-   **UI Component Libraries:** @radix-ui/* primitives, shadcn/ui
-   **Styling & Design:** Tailwind CSS, class-variance-authority, clsx, tailwind-merge, PostCSS
-   **Database & ORM:** @neondatabase/serverless, drizzle-orm, drizzle-zod, ws, connect-pg-simple
-   **Form Handling:** react-hook-form, @hookform/resolvers, Zod
-   **Date & Time:** date-fns
-   **Utilities:** nanoid, lucide-react, cmdk
-   **Payment Gateway:** Razorpay
-   **Mapping & Location Services:** Google Maps API (@react-google-maps/api), Google Places Autocomplete