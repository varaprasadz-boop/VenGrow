# Design Guidelines - Real Estate Marketplace MVP

## Design Approach: Reference-Based (Airbnb + Linear + Indian Real Estate)

**Primary References:**
- **Airbnb**: Property cards, image galleries, search/filter UX, trust elements
- **Linear**: Clean dashboards, modern forms, subtle animations
- **99acres/MagicBricks**: Indian real estate patterns, local expectations
- **Stripe**: Payment flows, professional admin interfaces

**Design Principles:**
1. **Visual Trust**: Property imagery drives engagement; verification badges build credibility
2. **Role Clarity**: Distinct visual identity for Guest/Buyer/Seller/Admin experiences
3. **Information Density**: Balance rich property details with clean, scannable layouts
4. **Mobile-First Excellence**: Indian market skews mobile; desktop enhances rather than defines

## Typography

**Font Stack:**
- **Primary**: Inter (via Google Fonts) - body text, UI elements
- **Headings**: Poppins (via Google Fonts) - warm, friendly for Indian market

**Scale:**
- Mega Headings (Hero): text-5xl/text-6xl (48-60px), font-bold
- Page Titles: text-3xl/text-4xl (30-36px), font-semibold
- Section Headings: text-2xl (24px), font-semibold
- Card Titles: text-lg (18px), font-medium
- Body: text-base (16px), font-normal
- Small/Meta: text-sm (14px), font-normal
- Tiny/Labels: text-xs (12px), font-medium

## Layout System

**Spacing Primitives (Tailwind):** Use 4, 8, 12, 16, 24, 32, 48 (e.g., p-4, gap-8, mb-12)

**Containers:**
- Full-width sections: `w-full` with inner `max-w-7xl mx-auto px-4`
- Content sections: `max-w-6xl mx-auto`
- Forms/Reading: `max-w-2xl mx-auto`
- Cards: `max-w-sm` (property cards), `max-w-md` (modals)

**Grid Systems:**
- Property Listings: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Feature Grids: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`
- Dashboard Stats: `grid grid-cols-2 lg:grid-cols-4 gap-4`

**Vertical Rhythm:** Consistent section spacing of `py-16` (desktop), `py-12` (mobile)

## Component Library

### Navigation
- **Main Nav**: Sticky header, logo left, search center, user menu right
- **Mobile Nav**: Hamburger menu, bottom tab bar for key actions
- **Breadcrumbs**: text-sm with slash separators, hover underline

### Property Cards (Core Component)
- **Structure**: Image top (aspect-ratio-4/3), content below, shadow-md, rounded-lg, hover:shadow-xl
- **Image**: Gradient overlay at bottom for price/location text, favorite heart icon (top-right)
- **Content Sections**: Price (bold, large), Location (icon + text), Specs (BHK/Area in pills), Seller badge
- **States**: Default, Hover (lift effect), Featured (border accent), Sold (overlay)

### Filters & Search
- **Desktop**: Sticky sidebar (w-64), collapsible sections, clear visual grouping
- **Mobile**: Bottom sheet modal, pill buttons for quick filters
- **Components**: Range sliders (dual-handle), checkboxes with counts, location autocomplete

### Forms
- **Input Fields**: Rounded borders, focus ring, label above, helper text below
- **Multi-step Forms**: Progress indicator (dots or bar), back/next buttons, save draft option
- **File Upload**: Drag-drop zone, thumbnail previews, progress bars
- **Validation**: Inline errors (red text + icon), success states (green checkmark)

### Buttons
- **Primary CTA**: Solid background, rounded-lg, px-6 py-3, font-medium
- **Secondary**: Border only, transparent background
- **Tertiary**: Text only, hover underline
- **Icon Buttons**: Circular, p-2, ghost or filled
- **Hero Buttons**: Larger (px-8 py-4), backdrop-blur-sm when on images

### Modals & Popups
- **Size Variants**: SM (max-w-md), MD (max-w-2xl), LG (max-w-4xl), Full (inquiry details, chat)
- **Structure**: Overlay (bg-black/50), centered card, close icon (top-right), action buttons (bottom)
- **Animations**: Fade-in overlay, scale-up modal

### Dashboards (Seller/Admin)
- **Stats Cards**: Shadow card, icon/number/label/trend, 4-column grid
- **Charts**: Recharts library, muted grid, accent highlights, responsive legends
- **Tables**: Stripe rows, sticky headers, sortable columns, action menus (dropdown)
- **Empty States**: Centered icon/message/CTA, friendly illustration

### Chat Interface
- **Layout**: Conversation list (left sidebar on desktop), chat window (right/full)
- **Messages**: Bubble style, sender/receiver colors differentiated, timestamps
- **Input**: Sticky bottom, attachment icon, send button, typing indicator

### Maps (Google Maps)
- **Container**: Rounded corners, shadow, minimum height h-96
- **Markers**: Custom property icon, cluster for multiple, info window on click
- **Controls**: Zoom, street view, directions buttons

### Badges & Indicators
- **Verification Badge**: Green checkmark icon, subtle background, small text
- **Status Pills**: Rounded-full, px-3 py-1, text-xs (Available/Sold/Featured)
- **Notification Badges**: Red dot with count, absolute positioned

### Payment Screens
- **Package Cards**: Border on hover, checkmark for selected, comparison table below
- **Payment Summary**: Bordered section, line items, total emphasized
- **Success/Failure**: Full-page, large icon (animated checkmark/X), clear next steps

### Image Galleries
- **Thumbnails**: Grid below main image, 4-6 visible, scroll horizontally on mobile
- **Lightbox**: Black overlay, large image centered, navigation arrows, close button
- **Lazy Loading**: Blur-up placeholder, smooth transition

## Images

**Hero Sections:**
- **Homepage**: Large hero image (h-screen or h-[600px]) showing premium Indian property with search overlay
  - Image: Modern apartment building or villa in warm Indian sunlight
  - Search bar: Centered, backdrop-blur, prominent shadow
  
- **Property Detail**: Full-width image gallery with 3-5 images visible in grid (main + thumbnails)
  - Images: Professional property photos, exterior + interior mix

- **Seller Dashboard**: No hero image; focus on data/cards

- **Admin Panel**: No hero image; utilitarian interface

**Content Images:**
- Property Cards: Always include thumbnail (aspect-ratio-4/3, object-cover)
- Seller Profiles: Logo/avatar (circular, 64x64 or 128x128)
- Empty States: Friendly illustrations (not photos)
- Testimonials (future): Customer photos (circular, grayscale to match palette)

**Image Treatment:**
- All property images: rounded-lg, object-cover
- Overlays: Linear gradient (transparent to black/50) for text legibility
- Loading: Shimmer skeleton effect

## Key Patterns

**Trust Elements:**
- Verified seller checkmarks throughout
- "Trusted by X users" social proof
- Security badges on payment pages
- Professional property photography emphasis

**Indian Market Localization:**
- Rupee symbol (₹) prominent and consistent
- Indian city names in filters/search
- Locality-first addressing (not just street numbers)
- Mobile-first interactions (tap targets 44px minimum)

**Accessibility:**
- ARIA labels on interactive elements
- Keyboard navigation (focus visible)
- Color contrast WCAG AA minimum
- Screen reader friendly form labels

**Responsive Breakpoints:**
- Mobile: < 768px (single column, bottom sheets)
- Tablet: 768-1024px (2 columns, adapted layouts)
- Desktop: > 1024px (3+ columns, full features)

**Performance:**
- Lazy load images below fold
- Skeleton loaders for content
- Optimistic UI updates (favorites, chat)

This design system creates a modern, trustworthy real estate marketplace with clear visual hierarchy, optimized for India's mobile-first market while maintaining professional desktop experiences for sellers and admins.