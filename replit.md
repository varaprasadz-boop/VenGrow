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

## Add Property Form Restructuring (IMPLEMENTED)

### Overview
The Add Property form has 4 stages: Basic Info, Details, Photos, Review (save to Draft). The Details tab (Step 2) is category-specific, showing different fields depending on the category selected in Basic Info (Step 1). All categories share common fields in Basic Info; category-unique fields appear in Details. propertyType enum values used: apartment, villa, plot, commercial, farmhouse, penthouse, independent_house, pg_co_living, new_projects, joint_venture.

### Basic Info (Step 1) - Common Fields for ALL Categories
- Title, Description, Transaction Type
- Category & Subcategory, Project Stage
- Project/Society Name
- Location (State, City, Locality, Area in Locality, Nearby Landmark, PIN code, Google Places Search)
- Price, Area, Area Unit, Per sqft Price (auto-calculated)

### Details (Step 2) - Category-Specific
Renders different form fields based on `categoryId` from Step 1. Each category has its own field config.

### Apartment Category [IMPLEMENTED]
BHK, Bathrooms, Balconies, Super Built Up Area, Carpet Area, Facing, Floor Number, Flooring Type, No of Car Parking, Maintenance Charges, Overlooking, Furnishing Status, Total Flats, Total Floors, Flats on Floor, New/Resale, Possession Status (conditional), No of Lifts, Amenities (55+ list)

### Villa Category [IMPLEMENTED]
BHK, Bathrooms, Balconies, Land Area, Super Built Up Area, Carpet Area, Room Sizes (dynamic), Facing, Flooring Type, No of Car Parking, Maintenance Charges, Overlooking, Furnishing Status, Total Villas, Total Floors, Is Corner Property, Road Width in Feet, New/Resale, Possession Status (conditional), Lifts Available (Yes/No), Amenities (55+ list)

### Plots Category [IMPLEMENTED]
Plot Length, Plot Breadth, Is Corner Plot (Yes/No), Facing, Floor Allowed for Construction, Maintenance Charges, Width of Road Facing Plot (meters), Overlooking, New/Resale, Club House Available (Yes/No). NO amenities, NO BHK/bathrooms, NO furnishing.

### Independent House Category [IMPLEMENTED]
BHK (with 1 RK), Bathrooms, Balconies, Super Built Up Area, Carpet Area, Room Sizes (dynamic), Facing, Floor Number, Flooring Type, No of Car Parking, Maintenance Charges, Overlooking, Furnished Status, Total Units, Total Floors, New/Resale, Possession Status (conditional). NO amenities, NO lifts.

### New Projects Category [IMPLEMENTED]
Floor Plans (1-4, each with: Super Built Up Area, Carpet Area, BHK, Bathrooms, Balconies, Total Price), Facings Available, Flooring Type, No of Car Parking, Maintenance Charges, Per sqft Price, Total Flats, Total Floors, Flats on Floor, Possession Status (conditional), No of Lifts, Amenities (55+ list)

### Commercial Category [IMPLEMENTED]
Facing, Width of Road Facing the Plot (meters). Simplest category — 2 fields only.

### PG (Paying Guest) Category [IMPLEMENTED]
Sharing Type (1/2/3/4 with Rent & Deposit per type), Facilities (9 items), Rules (5 items), Safety & Security (CCTV, Biometric Entry, Security Guard), Services (3 items), Food Provided, Non Veg Provided, Notice Period.

### Joint Venture [IMPLEMENTED]
Separate JV-specific form with development type, revenue/built-up share, landowner/developer expectations.

### Category Routing
Step 2 uses `getCategorySlug()` to match categoryId from Step 1 data → renders the correct category form via `renderCategoryForm()` switch statement. Default fallback is Apartment form.

### Featured Listing Opt-in (Step 4) [IMPLEMENTED]
Sellers can request their listing to be featured at submission time (Step 4). The checkbox only appears if the seller's subscription package has remaining featured slots (`featuredLimit - featuredUsed > 0`). When admin approves the property, if `requestFeatured` is true, the system auto-sets `isFeatured = true` and increments `featuredUsed` on the subscription. DB column: `request_featured` (boolean, default false) on properties table.

### Technical Notes
- jsPDF Helvetica font doesn't support ₹ symbol - use "Rs." text instead in invoicePDF.ts
- When importing User icon from lucide-react alongside User type from @shared/schema, alias as UserIcon
- TanStack Query refetch() doesn't throw errors; check QueryObserverResult properties instead

## External Dependencies

-   **UI Component Libraries:** @radix-ui/* primitives, shadcn/ui
-   **Styling & Design:** Tailwind CSS, class-variance-authority, clsx, tailwind-merge, PostCSS
-   **Database & ORM:** @neondatabase/serverless, drizzle-orm, drizzle-zod, ws, connect-pg-simple
-   **Form Handling:** react-hook-form, @hookform/resolvers, Zod
-   **Date & Time:** date-fns
-   **Utilities:** nanoid, lucide-react, cmdk
-   **Payment Gateway:** Razorpay
-   **Mapping & Location Services:** Google Maps API (@react-google-maps/api), Google Places Autocomplete