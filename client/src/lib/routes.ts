import { lazy } from "react";

export interface RouteConfig {
  path: string;
  component: React.LazyExoticComponent<React.ComponentType<any>> | React.ComponentType<any>;
  requireAuth?: boolean;
  roles?: string[];
  title?: string;
}

// Public Pages - No auth required
export const publicRoutes: RouteConfig[] = [
  // Auth Pages
  { path: "/login", component: lazy(() => import("@/pages/LoginPage")), title: "Login" },
  { path: "/register", component: lazy(() => import("@/pages/RegisterPage")), title: "Register" },
  { path: "/admin/login", component: lazy(() => import("@/pages/AdminLoginPage")), title: "Admin Login" },
  { path: "/forgot-password", component: lazy(() => import("@/pages/ForgotPasswordPage")), title: "Forgot Password" },
  { path: "/reset-password", component: lazy(() => import("@/pages/ResetPasswordPage")), title: "Reset Password" },
  { path: "/verify-email", component: lazy(() => import("@/pages/EmailVerificationPage")), title: "Verify Email" },
  { path: "/email-verified", component: lazy(() => import("@/pages/EmailVerifiedPage")), title: "Email Verified" },
  { path: "/verify-otp", component: lazy(() => import("@/pages/OTPVerificationPage")), title: "Verify OTP" },
  { path: "/password-reset-success", component: lazy(() => import("@/pages/PasswordResetSuccessPage")), title: "Password Reset" },
  { path: "/logout", component: lazy(() => import("@/pages/LogoutPage")), title: "Logout" },
  
  // Main Public Pages
  { path: "/", component: lazy(() => import("@/pages/HomePage")), title: "Home" },
  { path: "/listings", component: lazy(() => import("@/pages/ListingsPage")), title: "Properties" },
  { path: "/properties/:citySlug", component: lazy(() => import("@/pages/CityPropertiesPage")), title: "Properties" },
  { path: "/property/:id", component: lazy(() => import("@/pages/PropertyDetailPage")), title: "Property Details" },
  { path: "/packages", component: lazy(() => import("@/pages/PackagesPage")), title: "Pricing Plans" },
  
  // Builders & Projects (Public)
  { path: "/builders", component: lazy(() => import("@/pages/BuildersListPage")), title: "Verified Builders" },
  { path: "/builder/:slug", component: lazy(() => import("@/pages/BuilderLandingPage")), title: "Builder" },
  { path: "/projects", component: lazy(() => import("@/pages/ProjectsListPage")), title: "Projects" },
  { path: "/project/:slug", component: lazy(() => import("@/pages/ProjectDetailPage")), title: "Project Details" },
  
  // Static Pages
  { path: "/about", component: lazy(() => import("@/pages/static/AboutPage")), title: "About Us" },
  { path: "/contact", component: lazy(() => import("@/pages/static/ContactPage")), title: "Contact Us" },
  { path: "/faq", component: lazy(() => import("@/pages/static/FAQPage")), title: "FAQ" },
  { path: "/terms", component: lazy(() => import("@/pages/static/TermsPage")), title: "Terms of Service" },
  { path: "/privacy", component: lazy(() => import("@/pages/static/PrivacyPage")), title: "Privacy Policy" },
  { path: "/refund", component: lazy(() => import("@/pages/static/RefundPage")), title: "Refund Policy" },
  { path: "/refund-policy", component: lazy(() => import("@/pages/static/RefundPolicyPage")), title: "Refund Policy" },
  { path: "/how-it-works", component: lazy(() => import("@/pages/static/HowItWorksPage")), title: "How It Works" },
  { path: "/blog", component: lazy(() => import("@/pages/static/BlogPage")), title: "Blog" },
  { path: "/careers", component: lazy(() => import("@/pages/static/CareersPage")), title: "Careers" },
  { path: "/events", component: lazy(() => import("@/pages/static/EventsPage")), title: "Events" },
  { path: "/testimonials", component: lazy(() => import("@/pages/static/TestimonialsPage")), title: "Testimonials" },
  { path: "/press", component: lazy(() => import("@/pages/static/PressPage")), title: "Press" },
  { path: "/pricing", component: lazy(() => import("@/pages/static/PricingPage")), title: "Pricing" },
  { path: "/help", component: lazy(() => import("@/pages/static/HelpCenterPage")), title: "Help Center" },
  { path: "/newsletter", component: lazy(() => import("@/pages/static/NewsletterPage")), title: "Newsletter" },
  { path: "/sitemap", component: lazy(() => import("@/pages/static/SitemapPage")), title: "Sitemap" },
  { path: "/security", component: lazy(() => import("@/pages/static/SecurityPage")), title: "Security" },
  { path: "/trust-safety", component: lazy(() => import("@/pages/static/TrustSafetyPage")), title: "Trust & Safety" },
  { path: "/sustainability", component: lazy(() => import("@/pages/static/SustainabilityPage")), title: "Sustainability" },
  { path: "/affiliates", component: lazy(() => import("@/pages/static/AffiliatesPage")), title: "Affiliates" },
  { path: "/partners", component: lazy(() => import("@/pages/static/PartnerProgramPage")), title: "Partner Program" },
  { path: "/partnership", component: lazy(() => import("@/pages/static/PartnershipPage")), title: "Partnership" },
  { path: "/investors", component: lazy(() => import("@/pages/static/InvestorPage")), title: "Investors" },
  { path: "/investor-relations", component: lazy(() => import("@/pages/static/InvestorRelationsPage")), title: "Investor Relations" },
  { path: "/corporate", component: lazy(() => import("@/pages/static/CorporatePage")), title: "Corporate" },
  { path: "/awards", component: lazy(() => import("@/pages/static/AwardsPage")), title: "Awards" },
  { path: "/mobile-app", component: lazy(() => import("@/pages/static/MobileAppPage")), title: "Mobile App" },
  { path: "/download-app", component: lazy(() => import("@/pages/static/DownloadAppPage")), title: "Download App" },
  { path: "/rera-compliance", component: lazy(() => import("@/pages/static/ReraCompliancePage")), title: "RERA Compliance" },
  
  // Buyer Guide Pages (Public)
  { path: "/buyer-guide", component: lazy(() => import("@/pages/static/BuyerGuidePage")), title: "Buyer Guide" },
  { path: "/first-time-buyer", component: lazy(() => import("@/pages/static/FirstTimeBuyerPage")), title: "First Time Buyer" },
  { path: "/home-loan-guide", component: lazy(() => import("@/pages/static/HomeLoanGuidePage")), title: "Home Loan Guide" },
  { path: "/property-valuation", component: lazy(() => import("@/pages/static/PropertyValuationPage")), title: "Property Valuation" },
  
  // Seller Guide Pages (Public)
  { path: "/sell-your-property", component: lazy(() => import("@/pages/static/SellYourPropertyPage")), title: "Sell Property" },
  { path: "/sell-faster-guide", component: lazy(() => import("@/pages/static/SellFasterGuidePage")), title: "Sell Faster" },
  
  // Seller Registration Flow (Public)
  { path: "/seller/type", component: lazy(() => import("@/pages/seller/SellerTypePage")), title: "Seller Type" },
  { path: "/seller/register/individual", component: lazy(() => import("@/pages/seller/IndividualRegisterPage")), title: "Individual Registration" },
  { path: "/seller/register/broker", component: lazy(() => import("@/pages/seller/BrokerRegisterPage")), title: "Broker Registration" },
  { path: "/seller/register/builder", component: lazy(() => import("@/pages/seller/BuilderRegisterPage")), title: "Builder Registration" },
  { path: "/seller/register/corporate", component: lazy(() => import("@/pages/seller/CorporateRegisterPage")), title: "Corporate Registration" },
  
  // Error Pages
  { path: "/404", component: lazy(() => import("@/pages/error/NotFoundPage")), title: "Not Found" },
  { path: "/403", component: lazy(() => import("@/pages/error/ForbiddenPage")), title: "Forbidden" },
  { path: "/500", component: lazy(() => import("@/pages/error/ServerErrorPage")), title: "Server Error" },
  { path: "/maintenance", component: lazy(() => import("@/pages/error/MaintenancePage")), title: "Maintenance" },
];

// Buyer Routes - Requires auth with buyer or admin role
export const buyerRoutes: RouteConfig[] = [
  // Dashboard
  { path: "/dashboard", component: lazy(() => import("@/pages/buyer/BuyerDashboardPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Dashboard" },
  { path: "/buyer/dashboard", component: lazy(() => import("@/pages/buyer/BuyerDashboardPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Dashboard" },
  
  // Core Buyer Features - Sidebar Links
  { path: "/favorites", component: lazy(() => import("@/pages/buyer/FavoritesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Favorites" },
  { path: "/buyer/favorites", component: lazy(() => import("@/pages/buyer/FavoritesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Favorites" },
  { path: "/inquiries", component: lazy(() => import("@/pages/buyer/InquiriesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "My Inquiries" },
  { path: "/buyer/inquiries", component: lazy(() => import("@/pages/buyer/MyInquiriesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "My Inquiries" },
  { path: "/buyer/notifications", component: lazy(() => import("@/pages/buyer/NotificationsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Notifications" },
  { path: "/buyer/chat", component: lazy(() => import("@/pages/buyer/BuyerMessagesPage")), requireAuth: true, roles: ["buyer", "seller", "admin"], title: "Chat" },
  { path: "/buyer/visits", component: lazy(() => import("@/pages/buyer/ScheduleVisitPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Scheduled Visits" },
  { path: "/buyer/reviews", component: lazy(() => import("@/pages/buyer/BuyerReviewsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "My Reviews" },
  { path: "/buyer/search-history", component: lazy(() => import("@/pages/buyer/SearchHistoryPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Search History" },
  
  // Quick Links - Sidebar
  { path: "/buy", component: lazy(() => import("@/pages/ListingsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Buy Property" },
  { path: "/lease", component: lazy(() => import("@/pages/ListingsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Lease Property" },
  { path: "/rent", component: lazy(() => import("@/pages/ListingsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Rent Property" },
  
  // Browse Properties - Buyer access to public listings
  { path: "/properties", component: lazy(() => import("@/pages/ListingsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Browse Properties" },
  
  // Profile & Settings
  { path: "/profile", component: lazy(() => import("@/pages/buyer/ProfilePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Profile" },
  { path: "/buyer/profile", component: lazy(() => import("@/pages/buyer/ProfilePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Profile" },
  { path: "/settings", component: lazy(() => import("@/pages/buyer/SettingsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Settings" },
  { path: "/buyer/settings", component: lazy(() => import("@/pages/buyer/SettingsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Settings" },
  
  // Map View - Sidebar Links
  { path: "/map", component: lazy(() => import("@/pages/buyer/PropertyMapPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Map View" },
  { path: "/map-search", component: lazy(() => import("@/pages/buyer/PropertyMapPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Map Search" },
  
  // Property Comparison & Search
  { path: "/compare", component: lazy(() => import("@/pages/buyer/ComparePropertiesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Compare" },
  { path: "/buyer/compare", component: lazy(() => import("@/pages/buyer/PropertyComparePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Compare" },
  { path: "/buyer/compare/:ids", component: lazy(() => import("@/pages/buyer/PropertyComparisonDetailPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Compare" },
  { path: "/buyer/saved-searches", component: lazy(() => import("@/pages/buyer/SavedSearchesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Saved Searches" },
  { path: "/buyer/saved-filters", component: lazy(() => import("@/pages/buyer/SavedFiltersPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Saved Filters" },
  { path: "/buyer/saved-properties", component: lazy(() => import("@/pages/buyer/SavedPropertiesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Saved Properties" },
  { path: "/buyer/search-results", component: lazy(() => import("@/pages/buyer/SearchResultsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Search Results" },
  { path: "/buyer/viewing-history", component: lazy(() => import("@/pages/buyer/ViewingHistoryPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Viewing History" },
  { path: "/buyer/property-alerts", component: lazy(() => import("@/pages/buyer/PropertyAlertsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Property Alerts" },
  { path: "/buyer/wishlist", component: lazy(() => import("@/pages/buyer/WishlistPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Wishlist" },
  
  // Property Viewing Features
  { path: "/buyer/recently-viewed", component: lazy(() => import("@/pages/buyer/RecentlyViewedPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Recently Viewed" },
  { path: "/buyer/schedule-visit", component: lazy(() => import("@/pages/buyer/ScheduleVisitPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Schedule Visit" },
  { path: "/buyer/virtual-tour", component: lazy(() => import("@/pages/buyer/VirtualTourPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Virtual Tour" },
  
  // Financial Tools
  { path: "/buyer/mortgage-calculator", component: lazy(() => import("@/pages/buyer/MortgageCalculatorPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Mortgage Calculator" },
  { path: "/buyer/budget-calculator", component: lazy(() => import("@/pages/buyer/BudgetCalculatorPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Budget Calculator" },
  { path: "/buyer/home-valuation", component: lazy(() => import("@/pages/buyer/HomeValuationPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Home Valuation" },
  { path: "/buyer/loan-assistance", component: lazy(() => import("@/pages/buyer/LoanAssistancePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Loan Assistance" },
  
  // Property Detail Sub-pages
  { path: "/buyer/property/:id/virtual-tour", component: lazy(() => import("@/pages/buyer/Property3DVirtualTourPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Virtual Tour" },
  { path: "/buyer/property/:id/floor-plan", component: lazy(() => import("@/pages/buyer/PropertyFloorPlanPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Floor Plan" },
  { path: "/buyer/property/:id/floors", component: lazy(() => import("@/pages/buyer/PropertyFloorsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Floors" },
  { path: "/buyer/property/:id/amenities", component: lazy(() => import("@/pages/buyer/PropertyAmenitiesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Amenities" },
  { path: "/buyer/property/:id/location", component: lazy(() => import("@/pages/buyer/PropertyLocationAnalysisPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Location Analysis" },
  { path: "/buyer/property/:id/map", component: lazy(() => import("@/pages/buyer/PropertyMapPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Map View" },
  { path: "/buyer/property/:id/neighborhood", component: lazy(() => import("@/pages/buyer/PropertyNeighborhoodPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Neighborhood" },
  { path: "/buyer/property/:id/schools", component: lazy(() => import("@/pages/buyer/PropertySchoolsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Schools" },
  { path: "/buyer/property/:id/hospitals", component: lazy(() => import("@/pages/buyer/PropertyHospitalsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Hospitals" },
  { path: "/buyer/property/:id/restaurants", component: lazy(() => import("@/pages/buyer/PropertyRestaurantsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Restaurants" },
  { path: "/buyer/property/:id/shopping", component: lazy(() => import("@/pages/buyer/PropertyShoppingPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Shopping" },
  { path: "/buyer/property/:id/transport", component: lazy(() => import("@/pages/buyer/PropertyTransportPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Public Transit" },
  { path: "/buyer/property/:id/parks", component: lazy(() => import("@/pages/buyer/PropertyParksPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Parks" },
  { path: "/buyer/property/:id/banks", component: lazy(() => import("@/pages/buyer/PropertyBanksPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Banks" },
  { path: "/buyer/property/:id/gym", component: lazy(() => import("@/pages/buyer/PropertyGymFitnessPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Gym & Fitness" },
  { path: "/buyer/property/:id/cinema", component: lazy(() => import("@/pages/buyer/PropertyCinemaPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Cinema" },
  { path: "/buyer/property/:id/police-station", component: lazy(() => import("@/pages/buyer/PropertyPoliceStationPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Police Station" },
  { path: "/buyer/property/:id/fire-safety", component: lazy(() => import("@/pages/buyer/PropertyFireSafetyPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Fire Safety" },
  { path: "/buyer/property/:id/environmental", component: lazy(() => import("@/pages/buyer/PropertyEnvironmentalPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Environmental" },
  { path: "/buyer/property/:id/electricity", component: lazy(() => import("@/pages/buyer/PropertyElectricityPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Electricity" },
  { path: "/buyer/property/:id/water", component: lazy(() => import("@/pages/buyer/PropertyWaterPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Water Supply" },
  { path: "/buyer/property/:id/noise", component: lazy(() => import("@/pages/buyer/PropertyNoisePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Noise Analysis" },
  { path: "/buyer/property/:id/community", component: lazy(() => import("@/pages/buyer/PropertyCommunityPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Community" },
  { path: "/buyer/property/:id/neighbors", component: lazy(() => import("@/pages/buyer/PropertyNeighborsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Neighbors" },
  { path: "/buyer/property/:id/accessibility", component: lazy(() => import("@/pages/buyer/PropertyAccessibilityPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Accessibility" },
  { path: "/buyer/property/:id/dimensions", component: lazy(() => import("@/pages/buyer/PropertyDimensionsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Dimensions" },
  { path: "/buyer/property/:id/age", component: lazy(() => import("@/pages/buyer/PropertyAgePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Property Age" },
  { path: "/buyer/property/:id/construction", component: lazy(() => import("@/pages/buyer/PropertyConstructionQualityPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Construction Quality" },
  { path: "/buyer/property/:id/history", component: lazy(() => import("@/pages/buyer/PropertyHistoryPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Property History" },
  { path: "/buyer/property/:id/price-history", component: lazy(() => import("@/pages/buyer/PropertyPriceHistoryPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Price History" },
  { path: "/buyer/property/:id/rental-yield", component: lazy(() => import("@/pages/buyer/PropertyRentalYieldPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Rental Yield" },
  { path: "/buyer/property/:id/financing", component: lazy(() => import("@/pages/buyer/PropertyFinancingPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Financing Options" },
  { path: "/buyer/property/:id/taxes", component: lazy(() => import("@/pages/buyer/PropertyTaxesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Property Taxes" },
  { path: "/buyer/property/:id/tax-calculator", component: lazy(() => import("@/pages/buyer/PropertyTaxCalculatorPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Tax Calculator" },
  { path: "/buyer/property/:id/maintenance", component: lazy(() => import("@/pages/buyer/PropertyMaintenancePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Maintenance" },
  { path: "/buyer/property/:id/legal", component: lazy(() => import("@/pages/buyer/PropertyLegalChecklistPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Legal Checklist" },
  { path: "/buyer/property/:id/transfer", component: lazy(() => import("@/pages/buyer/PropertyOwnershipTransferPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Ownership Transfer" },
  { path: "/buyer/property/:id/documents", component: lazy(() => import("@/pages/buyer/PropertyDocumentsViewPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Documents" },
  { path: "/buyer/property/:id/news", component: lazy(() => import("@/pages/buyer/PropertyNewsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Property News" },
  { path: "/buyer/property/:id/nearby-attractions", component: lazy(() => import("@/pages/buyer/PropertyNearbyAttractionsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Nearby Attractions" },
  { path: "/buyer/property/:id/recommendations", component: lazy(() => import("@/pages/buyer/PropertyRecommendationsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Recommendations" },
  { path: "/buyer/property/:id/seller", component: lazy(() => import("@/pages/buyer/SellerProfilePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Seller Profile" },
  { path: "/buyer/property/:id/share", component: lazy(() => import("@/pages/buyer/PropertySharePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Share Property" },
  { path: "/buyer/property/:id/print", component: lazy(() => import("@/pages/buyer/PropertyPrintPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Print Details" },
  { path: "/buyer/property/:id/qr-code", component: lazy(() => import("@/pages/buyer/PropertyQRCodePage")), requireAuth: true, roles: ["buyer", "admin"], title: "QR Code" },
  { path: "/buyer/property/:id/request", component: lazy(() => import("@/pages/buyer/PropertyRequestPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Request Info" },
  { path: "/buyer/property/:id/tour-booking", component: lazy(() => import("@/pages/buyer/PropertyTourBookingPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Book Tour" },
  { path: "/buyer/property/:id/video-call", component: lazy(() => import("@/pages/buyer/PropertyVideoCallPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Video Call" },
  { path: "/buyer/property/:id/saved-notes", component: lazy(() => import("@/pages/buyer/PropertySavedNotesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Notes" },
  { path: "/buyer/property/:id/watchlist", component: lazy(() => import("@/pages/buyer/PropertyWatchlistPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Watchlist" },
  { path: "/buyer/property/:id/orientation", component: lazy(() => import("@/pages/buyer/PropertyOrientationPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Orientation" },
  { path: "/buyer/property/:id/parking", component: lazy(() => import("@/pages/buyer/PropertyParkingPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Parking" },
  { path: "/buyer/property/:id/parking-details", component: lazy(() => import("@/pages/buyer/PropertyParkingDetailsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Parking Details" },
  { path: "/buyer/property/:id/pets", component: lazy(() => import("@/pages/buyer/PropertyPetsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Pets" },
  { path: "/buyer/property/:id/pet-policy", component: lazy(() => import("@/pages/buyer/PropertyPetPolicyPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Pet Policy" },
  { path: "/buyer/property/:id/utilities", component: lazy(() => import("@/pages/buyer/PropertyUtilitiesPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Utilities" },
  { path: "/buyer/property/:id/vacancy", component: lazy(() => import("@/pages/buyer/PropertyVacancyPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Vacancy" },
  { path: "/buyer/property/:id/warranty", component: lazy(() => import("@/pages/buyer/PropertyWarrantyPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Warranty" },
  { path: "/buyer/property/:id/resale", component: lazy(() => import("@/pages/buyer/PropertyResalePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Resale Value" },
  { path: "/buyer/property/:id/rooms", component: lazy(() => import("@/pages/buyer/PropertyRoomDetailsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Room Details" },
  
  // Guides & Insights
  { path: "/buyer/buying-guide", component: lazy(() => import("@/pages/buyer/BuyingGuidePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Buying Guide" },
  { path: "/buyer/neighborhood-guide", component: lazy(() => import("@/pages/buyer/NeighborhoodGuidePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Neighborhood Guide" },
  { path: "/buyer/market-insights", component: lazy(() => import("@/pages/buyer/MarketInsightsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "Market Insights" },
  { path: "/buyer/property-type-guide", component: lazy(() => import("@/pages/buyer/PropertyTypeGuidePage")), requireAuth: true, roles: ["buyer", "admin"], title: "Property Type Guide" },
  
  // Bidding & Offers
  { path: "/buyer/bids", component: lazy(() => import("@/pages/buyer/MyBidsPage")), requireAuth: true, roles: ["buyer", "admin"], title: "My Bids" },
];

// Seller Routes - Requires auth with seller or admin role
export const sellerRoutes: RouteConfig[] = [
  // Onboarding & Registration - Note: Registration routes are in publicRoutes
  { path: "/seller/verification", component: lazy(() => import("@/pages/seller/VerificationCenterPage")), requireAuth: true, roles: ["seller"], title: "Verification" },
  { path: "/seller/document-verification", component: lazy(() => import("@/pages/seller/DocumentVerificationPage")), requireAuth: true, roles: ["seller"], title: "Document Verification" },
  { path: "/seller/approval-pending", component: lazy(() => import("@/pages/seller/ApprovalPendingPage")), requireAuth: true, roles: ["seller"], title: "Approval Pending" },
  { path: "/seller/approval-approved", component: lazy(() => import("@/pages/seller/ApprovalApprovedPage")), requireAuth: true, roles: ["seller"], title: "Approved" },
  { path: "/seller/approval-rejected", component: lazy(() => import("@/pages/seller/ApprovalRejectedPage")), requireAuth: true, roles: ["seller"], title: "Rejected" },
  
  // Dashboard
  { path: "/seller/dashboard", component: lazy(() => import("@/pages/seller/SellerDashboardPage")), requireAuth: true, roles: ["seller"], title: "Seller Dashboard" },
  
  // Property Management - Sidebar Links
  { path: "/seller/property/add", component: lazy(() => import("@/pages/seller/CreateListingStep1Page")), requireAuth: true, roles: ["seller"], title: "Add Property" },
  { path: "/seller/properties", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "My Properties" },
  { path: "/seller/listings", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "My Listings" },
  { path: "/seller/listings/edit/:id", component: lazy(() => import("@/pages/seller/CreatePropertyPage")), requireAuth: true, roles: ["seller"], title: "Edit Property" },
  { path: "/seller/properties/edit/:id", component: lazy(() => import("@/pages/seller/CreatePropertyPage")), requireAuth: true, roles: ["seller"], title: "Edit Property" },
  { path: "/seller/property/edit/:id", component: lazy(() => import("@/pages/seller/CreatePropertyPage")), requireAuth: true, roles: ["seller"], title: "Edit Property" },
  { path: "/seller/listings/active", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "Active Listings" },
  { path: "/seller/listings/pending", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "Pending Review" },
  { path: "/seller/listings/drafts", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "Drafts" },
  { path: "/seller/listings/expired", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "Expired Listings" },
  { path: "/seller/manage-listings", component: lazy(() => import("@/pages/seller/ManageListingsPage")), requireAuth: true, roles: ["seller"], title: "Manage Listings" },
  { path: "/seller/create-property", component: lazy(() => import("@/pages/seller/CreateListingStep1Page")), requireAuth: true, roles: ["seller"], title: "Create Property" },
  { path: "/seller/create-listing", component: lazy(() => import("@/pages/seller/CreateListingStep1Page")), requireAuth: true, roles: ["seller"], title: "Create Listing" },
  { path: "/seller/create-listing/step1", component: lazy(() => import("@/pages/seller/CreateListingStep1Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 1" },
  { path: "/seller/listings/create/step1", component: lazy(() => import("@/pages/seller/CreateListingStep1Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 1" },
  { path: "/seller/listings/create/step2", component: lazy(() => import("@/pages/seller/CreateListingStep2Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 2" },
  { path: "/seller/listings/create/step3", component: lazy(() => import("@/pages/seller/CreateListingStep3Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 3" },
  { path: "/seller/listings/create/step4", component: lazy(() => import("@/pages/seller/CreateListingStep4Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 4" },
  { path: "/seller/create-listing/step2", component: lazy(() => import("@/pages/seller/CreateListingStep2Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 2" },
  { path: "/seller/create-listing/step3", component: lazy(() => import("@/pages/seller/CreateListingStep3Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 3" },
  { path: "/seller/create-listing/step4", component: lazy(() => import("@/pages/seller/CreateListingStep4Page")), requireAuth: true, roles: ["seller"], title: "Create Listing - Step 4" },
  { path: "/seller/property/:id/photos", component: lazy(() => import("@/pages/seller/PropertyPhotosPage")), requireAuth: true, roles: ["seller"], title: "Property Photos" },
  { path: "/seller/property/:id/media", component: lazy(() => import("@/pages/seller/PropertyMediaPage")), requireAuth: true, roles: ["seller"], title: "Property Media" },
  { path: "/seller/property/:id/status", component: lazy(() => import("@/pages/seller/PropertyStatusPage")), requireAuth: true, roles: ["seller"], title: "Property Status" },
  { path: "/seller/property/:id/insights", component: lazy(() => import("@/pages/seller/PropertyInsightsPage")), requireAuth: true, roles: ["seller"], title: "Property Insights" },
  { path: "/seller/property/:id/archive", component: lazy(() => import("@/pages/seller/PropertyArchivePage")), requireAuth: true, roles: ["seller"], title: "Archive Property" },
  { path: "/seller/property/:id/archived", component: lazy(() => import("@/pages/seller/PropertyArchivedPage")), requireAuth: true, roles: ["seller"], title: "Archived Properties" },
  { path: "/seller/property/:id/duplicate", component: lazy(() => import("@/pages/seller/PropertyDuplicatePage")), requireAuth: true, roles: ["seller"], title: "Duplicate Property" },
  { path: "/seller/property/:id/clone", component: lazy(() => import("@/pages/seller/PropertyClonePage")), requireAuth: true, roles: ["seller"], title: "Clone Property" },
  { path: "/seller/property/:id/renewal", component: lazy(() => import("@/pages/seller/PropertyRenewalPage")), requireAuth: true, roles: ["seller"], title: "Renew Listing" },
  { path: "/seller/property/:id/expiry", component: lazy(() => import("@/pages/seller/PropertyExpiryPage")), requireAuth: true, roles: ["seller"], title: "Listing Expiry" },
  { path: "/seller/property/:id/boost", component: lazy(() => import("@/pages/seller/PropertyBoostPage")), requireAuth: true, roles: ["seller"], title: "Boost Listing" },
  { path: "/seller/property/:id/promotion", component: lazy(() => import("@/pages/seller/PropertyPromotionPage")), requireAuth: true, roles: ["seller"], title: "Promote Listing" },
  { path: "/seller/property/:id/branding", component: lazy(() => import("@/pages/seller/PropertyBrandingPage")), requireAuth: true, roles: ["seller"], title: "Property Branding" },
  { path: "/seller/property/:id/seo", component: lazy(() => import("@/pages/seller/PropertySEOPage")), requireAuth: true, roles: ["seller"], title: "Property SEO" },
  { path: "/seller/property/:id/tags", component: lazy(() => import("@/pages/seller/PropertyTagsPage")), requireAuth: true, roles: ["seller"], title: "Property Tags" },
  { path: "/seller/property/:id/rating", component: lazy(() => import("@/pages/seller/PropertyRatingPage")), requireAuth: true, roles: ["seller"], title: "Property Rating" },
  { path: "/seller/property/:id/feedback", component: lazy(() => import("@/pages/seller/PropertyFeedbackPage")), requireAuth: true, roles: ["seller"], title: "Property Feedback" },
  { path: "/seller/property/:id/schedule", component: lazy(() => import("@/pages/seller/PropertySchedulePage")), requireAuth: true, roles: ["seller"], title: "Viewing Schedule" },
  { path: "/seller/property/:id/sold", component: lazy(() => import("@/pages/seller/PropertySoldPage")), requireAuth: true, roles: ["seller"], title: "Mark as Sold" },
  { path: "/seller/property/:id/export", component: lazy(() => import("@/pages/seller/PropertyExportPage")), requireAuth: true, roles: ["seller"], title: "Export Property" },
  { path: "/seller/property/:id/performance", component: lazy(() => import("@/pages/seller/PropertyPerformanceReportPage")), requireAuth: true, roles: ["seller"], title: "Performance Report" },
  { path: "/seller/bulk-upload", component: lazy(() => import("@/pages/seller/BulkUploadPage")), requireAuth: true, roles: ["seller"], title: "Bulk Upload" },
  { path: "/seller/listing-settings", component: lazy(() => import("@/pages/seller/ListingSettingsPage")), requireAuth: true, roles: ["seller"], title: "Listing Settings" },
  { path: "/seller/documents", component: lazy(() => import("@/pages/seller/DocumentsPage")), requireAuth: true, roles: ["seller"], title: "Documents" },
  { path: "/seller/export-data", component: lazy(() => import("@/pages/seller/ExportDataPage")), requireAuth: true, roles: ["seller"], title: "Export Data" },
  { path: "/seller/contract-templates", component: lazy(() => import("@/pages/seller/ContractTemplatesPage")), requireAuth: true, roles: ["seller"], title: "Contract Templates" },
  
  // Inquiries & Leads - Sidebar Links
  { path: "/seller/inquiries", component: lazy(() => import("@/pages/seller/InquiriesPage")), requireAuth: true, roles: ["seller"], title: "Inquiries" },
  { path: "/seller/inquiries/new", component: lazy(() => import("@/pages/seller/InquiriesPage")), requireAuth: true, roles: ["seller"], title: "Inquiries" },
  { path: "/seller/inquiries/form", component: lazy(() => import("@/pages/seller/FormInquiriesPage")), requireAuth: true, roles: ["seller"], title: "Form Submissions" },
  { path: "/seller/inquiries/chat", component: lazy(() => import("@/pages/seller/ChatInquiriesPage")), requireAuth: true, roles: ["seller"], title: "Chat Inquiries" },
  { path: "/seller/inquiries/call", component: lazy(() => import("@/pages/seller/CallInquiriesPage")), requireAuth: true, roles: ["seller"], title: "Call Requests" },
  { path: "/seller/visits", component: lazy(() => import("@/pages/seller/AppointmentsPage")), requireAuth: true, roles: ["seller"], title: "Scheduled Visits" },
  { path: "/seller/appointments", component: lazy(() => import("@/pages/seller/AppointmentsPage")), requireAuth: true, roles: ["seller"], title: "Appointments" },
  { path: "/seller/favorites", component: lazy(() => import("@/pages/seller/CustomerReviewsPage")), requireAuth: true, roles: ["seller"], title: "Favorites" },
  { path: "/seller/leads", component: lazy(() => import("@/pages/seller/LeadManagementPage")), requireAuth: true, roles: ["seller"], title: "Lead Management" },
  { path: "/seller/lead-pipeline", component: lazy(() => import("@/pages/seller/LeadPipelinePage")), requireAuth: true, roles: ["seller"], title: "Lead Pipeline" },
  { path: "/seller/lead-score", component: lazy(() => import("@/pages/seller/LeadScorePage")), requireAuth: true, roles: ["seller"], title: "Lead Scoring" },
  { path: "/seller/lead-sources", component: lazy(() => import("@/pages/seller/LeadSourcesPage")), requireAuth: true, roles: ["seller"], title: "Lead Sources" },
  { path: "/seller/chat", component: lazy(() => import("@/pages/seller/MessagesPage")), requireAuth: true, roles: ["seller"], title: "Chat" },
  { path: "/seller/quick-replies", component: lazy(() => import("@/pages/seller/QuickRepliesPage")), requireAuth: true, roles: ["seller"], title: "Quick Replies" },
  { path: "/seller/auto-responses", component: lazy(() => import("@/pages/seller/AutoResponsesPage")), requireAuth: true, roles: ["seller"], title: "Auto Responses" },
  
  // Analytics & Reports - Sidebar Links
  { path: "/seller/analytics", component: lazy(() => import("@/pages/seller/AnalyticsDashboardPage")), requireAuth: true, roles: ["seller"], title: "Analytics" },
  { path: "/seller/analytics/views", component: lazy(() => import("@/pages/seller/AnalyticsDashboardPage")), requireAuth: true, roles: ["seller"], title: "Property Views" },
  { path: "/seller/analytics/leads", component: lazy(() => import("@/pages/seller/PerformanceInsightsPage")), requireAuth: true, roles: ["seller"], title: "Lead Performance" },
  { path: "/seller/analytics/conversion", component: lazy(() => import("@/pages/seller/PerformanceInsightsPage")), requireAuth: true, roles: ["seller"], title: "Conversion Insights" },
  { path: "/seller/performance", component: lazy(() => import("@/pages/seller/PerformanceInsightsPage")), requireAuth: true, roles: ["seller"], title: "Performance" },
  { path: "/seller/competitor-analysis", component: lazy(() => import("@/pages/seller/CompetitorAnalysisPage")), requireAuth: true, roles: ["seller"], title: "Competitor Analysis" },
  { path: "/seller/sales-targets", component: lazy(() => import("@/pages/seller/SalesTargetsPage")), requireAuth: true, roles: ["seller"], title: "Sales Targets" },
  { path: "/seller/commission-calculator", component: lazy(() => import("@/pages/seller/CommissionCalculatorPage")), requireAuth: true, roles: ["seller"], title: "Commission Calculator" },
  
  // Subscription & Payments - Sidebar Links
  { path: "/seller/packages", component: lazy(() => import("@/pages/seller/PackageSelectionPage")), requireAuth: true, roles: ["seller"], title: "My Packages" },
  { path: "/seller/packages/buy", component: lazy(() => import("@/pages/seller/PackageSelectionPage")), requireAuth: true, roles: ["seller"], title: "Buy Package" },
  { path: "/seller/package-history", component: lazy(() => import("@/pages/seller/SubscriptionHistoryPage")), requireAuth: true, roles: ["seller"], title: "Package History" },
  { path: "/seller/wallet", component: lazy(() => import("@/pages/seller/DashboardPage")), requireAuth: true, roles: ["seller"], title: "Dashboard" },
  { path: "/seller/transactions", component: lazy(() => import("@/pages/seller/TransactionHistoryPage")), requireAuth: true, roles: ["seller"], title: "Transactions" },
  { path: "/seller/subscription", component: lazy(() => import("@/pages/seller/SubscriptionPage")), requireAuth: true, roles: ["seller"], title: "Subscription" },
  { path: "/seller/subscription-history", component: lazy(() => import("@/pages/seller/SubscriptionHistoryPage")), requireAuth: true, roles: ["seller"], title: "Subscription History" },
  { path: "/seller/invoices", component: lazy(() => import("@/pages/seller/InvoicesPage")), requireAuth: true, roles: ["seller"], title: "My Invoices" },
  { path: "/seller/payments", component: lazy(() => import("@/pages/seller/PaymentsPage")), requireAuth: true, roles: ["seller"], title: "Payment History" },
  { path: "/seller/payment", component: lazy(() => import("@/pages/seller/PaymentPage")), requireAuth: true, roles: ["seller"], title: "Payment" },
  { path: "/seller/payment-methods", component: lazy(() => import("@/pages/seller/PaymentMethodsPage")), requireAuth: true, roles: ["seller"], title: "Payment Methods" },
  { path: "/seller/payment-success", component: lazy(() => import("@/pages/seller/PaymentSuccessPage")), requireAuth: true, roles: ["seller"], title: "Payment Success" },
  { path: "/seller/payment-failed", component: lazy(() => import("@/pages/seller/PaymentFailedPage")), requireAuth: true, roles: ["seller"], title: "Payment Failed" },
  { path: "/seller/transaction-history", component: lazy(() => import("@/pages/seller/TransactionHistoryPage")), requireAuth: true, roles: ["seller"], title: "Transactions" },
  { path: "/seller/earnings", component: lazy(() => import("@/pages/seller/DashboardPage")), requireAuth: true, roles: ["seller"], title: "Dashboard" },
  { path: "/seller/withdraw", component: lazy(() => import("@/pages/seller/DashboardPage")), requireAuth: true, roles: ["seller"], title: "Dashboard" },
  { path: "/seller/upgrade", component: lazy(() => import("@/pages/seller/UpgradeAccountPage")), requireAuth: true, roles: ["seller"], title: "Upgrade Account" },
  
  // Profile & Settings - Sidebar Links
  { path: "/seller/profile", component: lazy(() => import("@/pages/seller/BrandingPage")), requireAuth: true, roles: ["seller"], title: "Profile" },
  { path: "/seller/settings", component: lazy(() => import("@/pages/seller/ListingSettingsPage")), requireAuth: true, roles: ["seller"], title: "Account Settings" },
  { path: "/seller/notifications", component: lazy(() => import("@/pages/seller/NotificationPreferencesPage")), requireAuth: true, roles: ["seller"], title: "Notifications" },
  { path: "/seller/help", component: lazy(() => import("@/pages/seller/DocumentsPage")), requireAuth: true, roles: ["seller"], title: "Help Center" },
  { path: "/seller/branding", component: lazy(() => import("@/pages/seller/BrandingPage")), requireAuth: true, roles: ["seller"], title: "Branding" },
  { path: "/seller/notification-preferences", component: lazy(() => import("@/pages/seller/NotificationPreferencesPage")), requireAuth: true, roles: ["seller"], title: "Notification Preferences" },
  { path: "/seller/reviews", component: lazy(() => import("@/pages/seller/ReviewsPage")), requireAuth: true, roles: ["seller"], title: "Reviews" },
  { path: "/seller/customer-reviews", component: lazy(() => import("@/pages/seller/CustomerReviewsPage")), requireAuth: true, roles: ["seller"], title: "Customer Reviews" },
  { path: "/seller/calendar", component: lazy(() => import("@/pages/seller/CalendarPage")), requireAuth: true, roles: ["seller"], title: "Calendar" },
  
  // Projects Management (Builders/Brokers only)
  { path: "/seller/projects", component: lazy(() => import("@/pages/seller/SellerProjectsPage")), requireAuth: true, roles: ["seller"], title: "My Projects" },
  { path: "/seller/projects/create", component: lazy(() => import("@/pages/seller/ProjectCreatePage")), requireAuth: true, roles: ["seller"], title: "Create Project" },
  { path: "/seller/projects/:id/edit", component: lazy(() => import("@/pages/seller/ProjectEditPage")), requireAuth: true, roles: ["seller"], title: "Edit Project" },
  
  // Team Management
  { path: "/seller/team", component: lazy(() => import("@/pages/seller/TeamManagementPage")), requireAuth: true, roles: ["seller"], title: "Team" },
  { path: "/seller/team-members", component: lazy(() => import("@/pages/seller/TeamMembersPage")), requireAuth: true, roles: ["seller"], title: "Team Members" },
  
  // Marketing & Promotion
  { path: "/seller/marketing-campaigns", component: lazy(() => import("@/pages/seller/MarketingCampaignsPage")), requireAuth: true, roles: ["seller"], title: "Marketing Campaigns" },
  { path: "/seller/social-media", component: lazy(() => import("@/pages/seller/SocialMediaIntegrationPage")), requireAuth: true, roles: ["seller"], title: "Social Media" },
  { path: "/seller/referral-program", component: lazy(() => import("@/pages/seller/ReferralProgramPage")), requireAuth: true, roles: ["seller"], title: "Referral Program" },
  { path: "/seller/referral-dashboard", component: lazy(() => import("@/pages/seller/ReferralDashboardPage")), requireAuth: true, roles: ["seller"], title: "Referral Dashboard" },
];

// Admin Routes - Requires auth with admin role
export const adminRoutes: RouteConfig[] = [
  // Dashboard - Sidebar Links
  { path: "/admin", component: lazy(() => import("@/pages/admin/AdminDashboardPage")), requireAuth: true, roles: ["admin"], title: "Admin Dashboard" },
  { path: "/admin/dashboard", component: lazy(() => import("@/pages/admin/AdminDashboardPage")), requireAuth: true, roles: ["admin"], title: "Admin Dashboard" },
  { path: "/admin/activity", component: lazy(() => import("@/pages/admin/ActivityLogPage")), requireAuth: true, roles: ["admin"], title: "Activity Log" },
  
  // User Management
  { path: "/admin/users", component: lazy(() => import("@/pages/admin/UserManagementPage")), requireAuth: true, roles: ["admin"], title: "Users" },
  { path: "/admin/user-roles", component: lazy(() => import("@/pages/admin/UserRolesPage")), requireAuth: true, roles: ["admin"], title: "User Roles" },
  { path: "/admin/user-activity", component: lazy(() => import("@/pages/admin/UserActivityPage")), requireAuth: true, roles: ["admin"], title: "User Activity" },
  { path: "/admin/impersonate", component: lazy(() => import("@/pages/admin/ImpersonatePage")), requireAuth: true, roles: ["admin"], title: "Impersonate User" },
  { path: "/admin/whitelist", component: lazy(() => import("@/pages/admin/WhitelistManagementPage")), requireAuth: true, roles: ["admin"], title: "Whitelist" },
  
  // Seller Management
  { path: "/admin/sellers", component: lazy(() => import("@/pages/admin/SellerListPage")), requireAuth: true, roles: ["admin"], title: "Seller List" },
  { path: "/admin/sellers/:id", component: lazy(() => import("@/pages/admin/SellerApprovalDetailsPage")), requireAuth: true, roles: ["admin"], title: "Seller Details" },
  { path: "/admin/seller-approvals", component: lazy(() => import("@/pages/admin/SellerApprovalsPage")), requireAuth: true, roles: ["admin"], title: "Seller Approvals" },
  { path: "/admin/seller-approvals/:id", component: lazy(() => import("@/pages/admin/SellerApprovalDetailsPage")), requireAuth: true, roles: ["admin"], title: "Seller Details" },
  { path: "/admin/verifications", component: lazy(() => import("@/pages/admin/VerificationsPage")), requireAuth: true, roles: ["admin"], title: "Verification Requests" },
  { path: "/admin/buyers", component: lazy(() => import("@/pages/admin/BuyerListPage")), requireAuth: true, roles: ["admin"], title: "Buyer Accounts" },
  
  // Listing Management
  { path: "/admin/listing-moderation", component: lazy(() => import("@/pages/admin/ListingModerationPage")), requireAuth: true, roles: ["admin"], title: "Listing Moderation" },
  { path: "/admin/listings", component: lazy(() => import("@/pages/admin/ListingModerationPage")), requireAuth: true, roles: ["admin"], title: "Listing Moderation" },
  { path: "/admin/properties", component: lazy(() => import("@/pages/admin/PropertiesPage")), requireAuth: true, roles: ["admin"], title: "All Properties" },
  { path: "/admin/featured", component: lazy(() => import("@/pages/admin/FeaturedListingsPage")), requireAuth: true, roles: ["admin"], title: "Featured Properties" },
  { path: "/admin/featured-listings", component: lazy(() => import("@/pages/admin/FeaturedListingsPage")), requireAuth: true, roles: ["admin"], title: "Featured Listings" },
  { path: "/admin/pending-properties", component: lazy(() => import("@/pages/admin/PendingPropertiesPage")), requireAuth: true, roles: ["admin"], title: "Pending Properties" },
  { path: "/admin/rejected-properties", component: lazy(() => import("@/pages/admin/RejectedPropertiesPage")), requireAuth: true, roles: ["admin"], title: "Rejected Properties" },
  { path: "/admin/review-queue", component: lazy(() => import("@/pages/admin/ReviewQueuePage")), requireAuth: true, roles: ["admin"], title: "Review Queue" },
  { path: "/admin/bulk-actions", component: lazy(() => import("@/pages/admin/BulkActionsPage")), requireAuth: true, roles: ["admin"], title: "Bulk Actions" },
  { path: "/admin/projects", component: lazy(() => import("@/pages/admin/ProjectsModerationPage")), requireAuth: true, roles: ["admin"], title: "Projects Moderation" },
  
  // Inquiries Management  
  { path: "/admin/inquiries", component: lazy(() => import("@/pages/admin/InquiriesPage")), requireAuth: true, roles: ["admin"], title: "All Inquiries" },
  { path: "/admin/inquiries/form", component: lazy(() => import("@/pages/admin/FormInquiriesPage")), requireAuth: true, roles: ["admin"], title: "Form Submissions" },
  { path: "/admin/inquiries/chat", component: lazy(() => import("@/pages/admin/ChatInquiriesPage")), requireAuth: true, roles: ["admin"], title: "Chat Inquiries" },
  { path: "/admin/inquiries/call", component: lazy(() => import("@/pages/admin/CallInquiriesPage")), requireAuth: true, roles: ["admin"], title: "Call Requests" },
  
  // Invoices & Billing
  { path: "/admin/packages", component: lazy(() => import("@/pages/admin/PackagesPage")), requireAuth: true, roles: ["admin"], title: "Packages" },
  { path: "/admin/invoices", component: lazy(() => import("@/pages/admin/InvoicesPage")), requireAuth: true, roles: ["admin"], title: "Invoices" },
  { path: "/admin/invoice-settings", component: lazy(() => import("@/pages/admin/InvoiceSettingsPage")), requireAuth: true, roles: ["admin"], title: "Invoice Settings" },
  
  // Platform Settings
  { path: "/admin/settings/maps", component: lazy(() => import("@/pages/admin/MapSettingsPage")), requireAuth: true, roles: ["admin"], title: "Map Settings" },
  { path: "/admin/settings/smtp", component: lazy(() => import("@/pages/admin/SMTPSettingsPage")), requireAuth: true, roles: ["admin"], title: "SMTP Settings" },
  { path: "/admin/settings/razorpay", component: lazy(() => import("@/pages/admin/RazorpaySettingsPage")), requireAuth: true, roles: ["admin"], title: "Payment Gateway" },
  { path: "/admin/settings/analytics", component: lazy(() => import("@/pages/admin/AnalyticsSettingsPage")), requireAuth: true, roles: ["admin"], title: "Analytics Settings" },
  { path: "/admin/settings/social", component: lazy(() => import("@/pages/admin/SocialSettingsPage")), requireAuth: true, roles: ["admin"], title: "Social Links" },
  
  // Content Management
  { path: "/admin/content", component: lazy(() => import("@/pages/admin/ContentModerationPage")), requireAuth: true, roles: ["admin"], title: "Content Moderation" },
  { path: "/admin/content-guidelines", component: lazy(() => import("@/pages/admin/ContentGuidelinesPage")), requireAuth: true, roles: ["admin"], title: "Content Guidelines" },
  { path: "/admin/popular-cities", component: lazy(() => import("@/pages/admin/PopularCitiesPage")), requireAuth: true, roles: ["admin"], title: "Popular Cities" },
  { path: "/admin/property-types", component: lazy(() => import("@/pages/admin/PropertyTypesPage")), requireAuth: true, roles: ["admin"], title: "Property Types" },
  { path: "/admin/navigation-links", component: lazy(() => import("@/pages/admin/NavigationLinksPage")), requireAuth: true, roles: ["admin"], title: "Navigation Links" },
  { path: "/admin/navigation", component: lazy(() => import("@/pages/admin/NavigationLinksPage")), requireAuth: true, roles: ["admin"], title: "Navigation Links" },
  { path: "/admin/static-pages", component: lazy(() => import("@/pages/admin/StaticPagesPage")), requireAuth: true, roles: ["admin"], title: "Static Pages" },
  { path: "/admin/faqs", component: lazy(() => import("@/pages/admin/FaqManagementPage")), requireAuth: true, roles: ["admin"], title: "FAQ Management" },
  { path: "/admin/verified-builders", component: lazy(() => import("@/pages/admin/VerifiedBuildersPage")), requireAuth: true, roles: ["admin"], title: "Verified Builders" },
  { path: "/admin/testimonials", component: lazy(() => import("@/pages/admin/TestimonialsPage")), requireAuth: true, roles: ["admin"], title: "Testimonials" },
  { path: "/admin/team-members", component: lazy(() => import("@/pages/admin/TeamMembersPage")), requireAuth: true, roles: ["admin"], title: "Team Members" },
  { path: "/admin/company-values", component: lazy(() => import("@/pages/admin/CompanyValuesPage")), requireAuth: true, roles: ["admin"], title: "Company Values" },
  { path: "/admin/site-settings", component: lazy(() => import("@/pages/admin/SiteSettingsPage")), requireAuth: true, roles: ["admin"], title: "Site Settings" },
  
  // Analytics & Reports
  { path: "/admin/analytics", component: lazy(() => import("@/pages/admin/PlatformAnalyticsPage")), requireAuth: true, roles: ["admin"], title: "Analytics" },
  { path: "/admin/statistics", component: lazy(() => import("@/pages/admin/PlatformStatisticsPage")), requireAuth: true, roles: ["admin"], title: "Statistics" },
  { path: "/admin/reports", component: lazy(() => import("@/pages/admin/ReportsPage")), requireAuth: true, roles: ["admin"], title: "Reports" },
  { path: "/admin/transactions", component: lazy(() => import("@/pages/admin/TransactionsPage")), requireAuth: true, roles: ["admin"], title: "Transactions" },
  { path: "/admin/performance", component: lazy(() => import("@/pages/admin/PerformanceDashboardPage")), requireAuth: true, roles: ["admin"], title: "Performance" },
  
  // Communications
  { path: "/admin/email-templates", component: lazy(() => import("@/pages/admin/EmailTemplatesPage")), requireAuth: true, roles: ["admin"], title: "Email Templates" },
  { path: "/admin/email-campaigns", component: lazy(() => import("@/pages/admin/EmailCampaignsPage")), requireAuth: true, roles: ["admin"], title: "Email Campaigns" },
  { path: "/admin/sms-templates", component: lazy(() => import("@/pages/admin/SMSTemplatesPage")), requireAuth: true, roles: ["admin"], title: "SMS Templates" },
  { path: "/admin/notifications", component: lazy(() => import("@/pages/admin/NotificationCenterPage")), requireAuth: true, roles: ["admin"], title: "Notifications" },
  { path: "/admin/notification-history", component: lazy(() => import("@/pages/admin/NotificationHistoryPage")), requireAuth: true, roles: ["admin"], title: "Notification History" },
  { path: "/admin/support-tickets", component: lazy(() => import("@/pages/admin/SupportTicketsPage")), requireAuth: true, roles: ["admin"], title: "Support Tickets" },
  
  // System Settings
  { path: "/admin/settings", component: lazy(() => import("@/pages/admin/SystemSettingsPage")), requireAuth: true, roles: ["admin"], title: "System Settings" },
  { path: "/admin/website-settings", component: lazy(() => import("@/pages/admin/WebsiteSettingsPage")), requireAuth: true, roles: ["admin"], title: "Website Settings" },
  { path: "/admin/payment-settings", component: lazy(() => import("@/pages/admin/PaymentSettingsPage")), requireAuth: true, roles: ["admin"], title: "Payment Settings" },
  { path: "/admin/integration-settings", component: lazy(() => import("@/pages/admin/IntegrationSettingsPage")), requireAuth: true, roles: ["admin"], title: "Integrations" },
  { path: "/admin/language-settings", component: lazy(() => import("@/pages/admin/LanguageSettingsPage")), requireAuth: true, roles: ["admin"], title: "Language Settings" },
  { path: "/admin/theme-customization", component: lazy(() => import("@/pages/admin/ThemeCustomizationPage")), requireAuth: true, roles: ["admin"], title: "Theme" },
  { path: "/admin/dashboard-customization", component: lazy(() => import("@/pages/admin/DashboardCustomizationPage")), requireAuth: true, roles: ["admin"], title: "Dashboard Customization" },
  { path: "/admin/modules", component: lazy(() => import("@/pages/admin/ModulesPage")), requireAuth: true, roles: ["admin"], title: "Modules" },
  { path: "/admin/feature-flags", component: lazy(() => import("@/pages/admin/FeatureFlagsPage")), requireAuth: true, roles: ["admin"], title: "Feature Flags" },
  { path: "/admin/api-keys", component: lazy(() => import("@/pages/admin/ApiKeysPage")), requireAuth: true, roles: ["admin"], title: "API Keys" },
  { path: "/admin/webhooks", component: lazy(() => import("@/pages/admin/WebhooksPage")), requireAuth: true, roles: ["admin"], title: "Webhooks" },
  { path: "/admin/seo", component: lazy(() => import("@/pages/admin/SEOManagerPage")), requireAuth: true, roles: ["admin"], title: "SEO Manager" },
  { path: "/admin/geocoding", component: lazy(() => import("@/pages/admin/GeocodingPage")), requireAuth: true, roles: ["admin"], title: "Geocoding" },
  
  // Security & Monitoring
  { path: "/admin/security", component: lazy(() => import("@/pages/admin/SecurityPage")), requireAuth: true, roles: ["admin"], title: "Security" },
  { path: "/admin/security-settings", component: lazy(() => import("@/pages/admin/SecuritySettingsPage")), requireAuth: true, roles: ["admin"], title: "Security Settings" },
  { path: "/admin/sessions", component: lazy(() => import("@/pages/admin/SessionsPage")), requireAuth: true, roles: ["admin"], title: "Sessions" },
  { path: "/admin/rate-limiting", component: lazy(() => import("@/pages/admin/RateLimitingPage")), requireAuth: true, roles: ["admin"], title: "Rate Limiting" },
  { path: "/admin/audit-logs", component: lazy(() => import("@/pages/admin/AuditLogsPage")), requireAuth: true, roles: ["admin"], title: "Audit Logs" },
  { path: "/admin/audit-log", component: lazy(() => import("@/pages/admin/AuditLogPage")), requireAuth: true, roles: ["admin"], title: "Audit Log" },
  { path: "/admin/activity-log", component: lazy(() => import("@/pages/admin/ActivityLogPage")), requireAuth: true, roles: ["admin"], title: "Activity Log" },
  { path: "/admin/logs", component: lazy(() => import("@/pages/admin/LogsPage")), requireAuth: true, roles: ["admin"], title: "Logs" },
  { path: "/admin/error-monitoring", component: lazy(() => import("@/pages/admin/ErrorMonitoringPage")), requireAuth: true, roles: ["admin"], title: "Error Monitoring" },
  { path: "/admin/error-tracking", component: lazy(() => import("@/pages/admin/ErrorTrackingPage")), requireAuth: true, roles: ["admin"], title: "Error Tracking" },
  
  // Infrastructure
  { path: "/admin/database", component: lazy(() => import("@/pages/admin/DatabasePage")), requireAuth: true, roles: ["admin"], title: "Database" },
  { path: "/admin/database-management", component: lazy(() => import("@/pages/admin/DatabaseManagementPage")), requireAuth: true, roles: ["admin"], title: "Database Management" },
  { path: "/admin/database-backup", component: lazy(() => import("@/pages/admin/DatabaseBackupPage")), requireAuth: true, roles: ["admin"], title: "Database Backup" },
  { path: "/admin/backup-settings", component: lazy(() => import("@/pages/admin/BackupSettingsPage")), requireAuth: true, roles: ["admin"], title: "Backup Settings" },
  { path: "/admin/cache", component: lazy(() => import("@/pages/admin/CachePage")), requireAuth: true, roles: ["admin"], title: "Cache" },
  { path: "/admin/cache-management", component: lazy(() => import("@/pages/admin/CacheManagementPage")), requireAuth: true, roles: ["admin"], title: "Cache Management" },
  { path: "/admin/server-status", component: lazy(() => import("@/pages/admin/ServerStatusPage")), requireAuth: true, roles: ["admin"], title: "Server Status" },
  { path: "/admin/system-health", component: lazy(() => import("@/pages/admin/SystemHealthPage")), requireAuth: true, roles: ["admin"], title: "System Health" },
  { path: "/admin/job-queue", component: lazy(() => import("@/pages/admin/JobQueuePage")), requireAuth: true, roles: ["admin"], title: "Job Queue" },
];

// Common authenticated routes (accessible by all authenticated users)
export const commonAuthRoutes: RouteConfig[] = [
  { path: "/chat", component: lazy(() => import("@/pages/ChatPage")), requireAuth: true, title: "Chat" },
  { path: "/notifications", component: lazy(() => import("@/pages/NotificationsPage")), requireAuth: true, title: "Notifications" },
];

// Combine all routes
export const allRoutes = [
  ...publicRoutes,
  ...buyerRoutes,
  ...sellerRoutes,
  ...adminRoutes,
  ...commonAuthRoutes,
];

// Helper to get route by path
export function getRouteByPath(path: string): RouteConfig | undefined {
  return allRoutes.find(route => route.path === path);
}

// Helper to check if route requires auth
export function requiresAuth(path: string): boolean {
  const route = getRouteByPath(path);
  return route?.requireAuth ?? false;
}

// Helper to check if user has access to route
export function hasRouteAccess(path: string, userRole?: string): boolean {
  const route = getRouteByPath(path);
  if (!route) return false;
  if (!route.requireAuth) return true;
  if (!userRole) return false;
  if (!route.roles) return true;
  return route.roles.includes(userRole);
}
