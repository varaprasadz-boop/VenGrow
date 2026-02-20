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

## Add Property Form Restructuring Plan

### Overview
The Add Property form has 4 stages: Basic Info, Details, Photos, Review (save to Draft). The Details tab (Step 2) will be made category-specific, showing different fields depending on the category selected in Basic Info (Step 1). All categories share common fields in Basic Info; category-unique fields appear in Details.

### Basic Info (Step 1) - Common Fields for ALL Categories
- Title, Description, Transaction Type
- Category & Subcategory, Project Stage
- Project/Society Name
- Location (State, City, Locality, Area in Locality, Nearby Landmark, PIN code, Google Places Search)
- Price, Area, Area Unit, Per sqft Price (auto-calculated)

### Details (Step 2) - Category-Specific
Renders different form fields based on `categoryId` from Step 1. Each category has its own field config.

### Apartment Category Analysis [PENDING IMPLEMENTATION]

**Already in DB schema AND form:** bedrooms (BHK), bathrooms, balconies, facing, floor, totalFloors, furnishing, flooring, ageOfProperty, possessionStatus, amenities (12 items only)

**In DB schema but NOT in form (quick wins - no migration):** superBuiltUpArea, totalFlats, flatsOnFloor, isResale, numberOfLifts, carParkingCount, maintenanceCharges, viewType (overlooking)

**New DB columns needed:** projectSocietyName (text), overlookingType (text - Garden/Pool/Road/Not Available)

**Amenities expansion:** Current list has 12 items; apartment needs 55+ amenities (Air Conditioned, Banquet Hall, Bar/Lounge, Cafeteria/Food Court, Club House, Concierge Services, Conference Room, DTH Television, Doorman, Fingerprint Access, Fireplace, Full Glass Wall, Golf Course, Gymnasium, Health club with Steam/Jacuzzi, Helipad, Hilltop, House help accommodation, Intercom Facility, Internet/Wi-Fi, Island Kitchen, Jogging Track, Laundry Service, Lift, Maintenance Staff, Outdoor Tennis Courts, Park, Piped Gas, Power Back Up, Private Garage, Private Terrace/Garden, Private Jacuzzi, Private Pool, RO Water System, Rain Water Harvesting, Reserved Parking, Sea Facing, Security, Service/Goods Lift, Sky Villa, Skydeck, Skyline View, Smart Home, Swimming Pool, Theme Based Architecture, Vaastu Compliant, Visitor Parking, Waste Disposal, Water Front, Water Storage, Wine Cellar, Wrap Around Balcony)

**Per sqft Price:** `pricePerSqft` exists in schema - needs auto-calculation from price and area

**Apartment Details fields:** BHK, Bathrooms, Balconies, Super Built Up Area, Carpet Area, Facing, Floor Number, Flooring Type, No of Car Parking, Maintenance Charges, Overlooking, Furnishing Status, Total Flats, Total Floors, Flats on Floor, New/Resale, Possession Status (conditional: under construction → possession date; ready to move → age of building), No of Lifts (count dropdown), Amenities (55+ list)

### Villa Category Analysis [PENDING IMPLEMENTATION]

**Shares with Apartment:** BHK, bathrooms, balconies, superBuiltUpArea, carpetArea, facing, furnishing, flooring, carParkingCount, maintenanceCharges, overlooking, amenities (same 55+ list), possessionStatus, isResale, pricePerSqft

**Already in DB schema, not in form (quick wins):** totalVillas, isCornerProperty, roadWidthFeet, liftsAvailable (boolean)

**New DB columns needed:** landArea (integer - separate from built-up area), roomSizes (jsonb - dynamic based on BHK count, e.g. [{room: "Bedroom 1", size: "12x14"}])

**Key differences from Apartment:** Uses totalVillas instead of totalFlats/flatsOnFloor; lifts is Yes/No boolean instead of count; adds isCornerProperty, roadWidthFeet, landArea, roomSizes; floor number not relevant for standalone villas

**Villa Details fields:** BHK, Bathrooms, Balconies, Land Area, Super Built Up Area, Carpet Area, Room Sizes (dynamic), Facing, Flooring Type, No of Car Parking, Maintenance Charges, Overlooking, Furnishing Status, Total Villas, Total Floors, Is Corner Property, Road Width in Feet, New/Resale, Possession Status (conditional), Lifts Available (Yes/No), Amenities (55+ list)

### Plots Category Analysis [PENDING IMPLEMENTATION]

**Already in DB schema:** plotLength, plotBreadth, isCornerPlot, roadWidthPlotMeters, floorAllowedConstruction, maintenanceCharges, isResale, clubHouseAvailable, facing

**New DB columns needed:** None expected — all plot fields already exist in schema

**Plots Details fields:** Plot Area (in Step 1), Plot Length, Plot Breadth, Is Corner Plot (Yes/No), Facing, Floor Allowed for Construction, Maintenance Charges, Width of Road Facing Plot (in meters), Overlooking, New/Resale, Club House Available (Yes/No). NO amenities, NO BHK/bathrooms, NO furnishing.

### Independent House Category Analysis [PENDING IMPLEMENTATION]

**Shares with Apartment/Villa:** BHK, bathrooms, balconies, superBuiltUpArea, carpetArea, facing, floor, totalFloors, furnishing, flooring, carParkingCount, maintenanceCharges, overlooking, possessionStatus, isResale, roomSizes (dynamic), pricePerSqft

**Key unique aspects:** BHK includes "1 RK" option (not in apartment/villa). Uses "Total Units" label (reuse totalFlats column). NO amenities list, NO lifts.

**New DB columns needed:** None beyond what apartment/villa already require (roomSizes jsonb, overlookingType text). totalFlats can be reused and labeled "Total Units" in the form.

**Independent House Details fields:** BHK (with 1 RK), Bathrooms, Balconies, Super Built Up Area, Carpet Area, Room Sizes (dynamic based on BHK), Facing, Floor Number, Flooring Type, No of Car Parking, Maintenance Charges, Overlooking, Furnished Status, Total Units (reuse totalFlats), Total Floors, New/Resale, Possession Status (conditional: under construction → possession date; ready to move → age of building). NO amenities, NO lifts.

### New Projects Category Analysis [PENDING IMPLEMENTATION]

**Already in DB schema:** newProjectFloorPlans (jsonb - array of {superBuiltUpArea, carpetArea, bhk, bathrooms, balconies, totalPrice}), facing, flooring, carParkingCount, maintenanceCharges, pricePerSqft, totalFlats, totalFloors, flatsOnFloor, possessionStatus, numberOfLifts, amenities

**New DB columns needed:** None — all fields already exist in schema

**Key unique aspect:** Multiple floor plans (up to 4) instead of single unit configuration. Each floor plan has its own Super Built Up Area, Carpet Area, BHK, Bathrooms, Balconies, Total Price stored in newProjectFloorPlans jsonb array.

**New Projects Details fields:** Floor Plans (1-4, each with: Super Built Up Area, Carpet Area, BHK, Bathrooms, Balconies, Total Price), Facings Available, Flooring Type, No of Car Parking, Maintenance Charges, Per sqft Price, Total Flats, Total Floors, Flats on Floor, Possession Status (conditional: under construction → when is possession), No of Lifts (count dropdown), Amenities (55+ list)

### Commercial Category Analysis [PENDING IMPLEMENTATION]

**Already in DB schema:** facing, roadWidthPlotMeters — both already exist

**New DB columns needed:** None

**Key unique aspect:** Simplest category — only 2 fields in Details tab. No residential features (no BHK, bathrooms, amenities, furnishing, parking, lifts, floors). Location, Area, and Price are all in Step 1 (common fields).

**Commercial Details fields:** Facing, Width of Road Facing the Plot (in meters). NO amenities, NO BHK/bathrooms, NO furnishing, NO parking, NO floors.

**Other categories (PG, Farmland, etc.):** Awaiting user input before implementation. Will implement all categories together.

### Implementation Approach
1. Schema changes: Add new columns (projectSocietyName, overlookingType, etc.) via Drizzle migration
2. Step 1 restructure: Move common fields, add Project/Society Name, auto-calc per sqft price
3. Step 2 restructure: Read categoryId from Step 1, render category-specific fields using config mapping
4. Expand amenities list to 55+ items with logical grouping
5. Steps 3 (Photos) and 4 (Review) remain as-is
6. Joint Venture form already implemented in Step 2 - keep as-is

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