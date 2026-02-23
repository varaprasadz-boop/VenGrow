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

## Dynamic Form Builder System (IMPLEMENTED)

### Overview
The Add Property form is now powered by a dynamic Form Builder system. Super Admin designs configurable forms per seller type (individual/broker/builder) using a drag-and-drop interface. Sellers see forms tailored to their seller type. The system replaces all hardcoded category-specific forms.

### Architecture
- **Database Tables:** `form_templates` (with `categoryId` column), `form_sections`, `form_fields`, `property_custom_data`
- **Admin UI:** Form Builder listing page + editor page with 4 stage tabs (Basic Info, Details, Photos, Review). Each template tied to a seller type AND a property category.
- **Seller UI:** Form selection page (`/seller/select-form`) shows available forms as category cards. Dynamic form renderer fetches specific template via `GET /api/seller/form-template/:id`. Category is frozen/readonly in Step 1.
- **Buyer UI:** Property detail page renders custom data using displayStyle (grid/checklist/default); FilterSidebar auto-generates filters from sections marked `showInFilters`
- **Multi-form per seller type:** Each seller type can have multiple published templates (one per category). Publishing prevents duplicates for same seller type + category combo.

### Key Components
- `client/src/components/DynamicFormRenderer.tsx` — renders form fields dynamically based on field type configuration
- `client/src/components/DynamicIcon.tsx` — renders lucide-react icons by name string (used across admin, seller, buyer views)
- `client/src/components/IconPicker.tsx` — searchable icon picker for admin form builder (~80 curated real-estate icons)
- `client/src/pages/admin/FormBuilderPage.tsx` — admin listing page for form templates
- `client/src/pages/admin/FormBuilderEditorPage.tsx` — admin editor with all 4 stage tabs
- `client/src/pages/seller/SelectFormPage.tsx` — form selection page showing category cards for sellers

### Form Template Structure
- **Stage 1 (Basic Info):** Default fields (title, description, transaction type, category, location, price, area) + custom admin-added fields
- **Stage 2 (Details):** Admin-defined sections with fields (Property Details, Amenities, etc.) — each section can be marked `showInFilters` for buyer-side filter auto-generation
- **Stage 3 (Photos):** Default media upload + admin-defined additional upload sections
- **Stage 4 (Review):** Featured listing toggle (based on package credits), dynamic review of all fields, configurable terms text, save-as-draft option

### Field Display Styles
- `grid` — multi-column grid with icons (like Property Details box)
- `checklist` — green checkmark icons (like Amenities)
- `default` — label:value text pairs

### API Endpoints
- `GET /api/admin/form-templates` — list all templates
- `POST/GET/PUT/DELETE /api/admin/form-templates/:id` — CRUD
- `POST /api/admin/form-templates/:id/clone` — clone template
- `POST /api/admin/form-templates/:id/publish` — publish (prevents duplicate seller type + category)
- `GET /api/seller/form-templates` — all published templates for logged-in seller's type (with category info)
- `GET /api/seller/form-template/:id` — specific published template with sections/fields
- `GET /api/seller/form-template` — (legacy) first published template for logged-in seller's type
- `GET /api/filter-fields` — filterable sections/fields for buyer FilterSidebar
- Form section and field CRUD routes under `/api/admin/form-sections/` and `/api/admin/form-fields/`

### Data Storage
- Standard fields (title, price, bedrooms, etc.) stay in `properties` table columns
- Custom/dynamic field values stored in `property_custom_data.formData` (jsonb)
- `property_custom_data` links to both `properties` and `form_templates`

### Seed & Migration
- `server/seed-form-templates.ts` — seeds 3 default published templates (individual, broker, builder) with Property Details + Amenities sections
- `server/migrate-form-data.ts` — migrates existing property column data into `property_custom_data` records
- Both run automatically on app startup

### Technical Notes
- jsPDF Helvetica font doesn't support the rupee symbol - use "Rs." text instead in invoicePDF.ts
- When importing User icon from lucide-react alongside User type from @shared/schema, alias as UserIcon
- TanStack Query refetch() doesn't throw errors; check QueryObserverResult properties instead
- DynamicIcon is a named export: `import { DynamicIcon } from "@/components/DynamicIcon"`

## External Dependencies

-   **UI Component Libraries:** @radix-ui/* primitives, shadcn/ui
-   **Styling & Design:** Tailwind CSS, class-variance-authority, clsx, tailwind-merge, PostCSS
-   **Database & ORM:** @neondatabase/serverless, drizzle-orm, drizzle-zod, ws, connect-pg-simple
-   **Form Handling:** react-hook-form, @hookform/resolvers, Zod
-   **Date & Time:** date-fns
-   **Utilities:** nanoid, lucide-react, cmdk
-   **Payment Gateway:** Razorpay
-   **Mapping & Location Services:** Google Maps API (@react-google-maps/api), Google Places Autocomplete