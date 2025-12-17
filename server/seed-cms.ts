import { db } from "./db";
import { 
  propertyCategories, propertySubcategories, popularCities, faqItems,
  staticPages, banners, navigationLinks, siteSettings, propertyTypesManaged
} from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedCMSContent() {
  console.log("Starting CMS content seed...");

  try {
    // Clear existing CMS data
    await db.delete(propertySubcategories);
    await db.delete(propertyCategories);
    await db.delete(propertyTypesManaged);
    await db.delete(popularCities);
    await db.delete(faqItems);
    await db.delete(staticPages);
    await db.delete(banners);
    await db.delete(navigationLinks);
    await db.delete(siteSettings);

    console.log("Cleared existing CMS data...");

    // ============================================
    // 1. PROPERTY CATEGORIES & SUBCATEGORIES
    // ============================================
    
    const categoriesData = [
      {
        name: "Apartments",
        slug: "apartments",
        icon: "Building2",
        description: "Flats and apartments in residential complexes",
        hasProjectStage: true,
        allowedTransactionTypes: ["sale", "rent", "lease"],
        sortOrder: 1,
      },
      {
        name: "Villas",
        slug: "villas",
        icon: "Home",
        description: "Independent villas and bungalows",
        hasProjectStage: true,
        allowedTransactionTypes: ["sale", "rent", "lease"],
        sortOrder: 2,
      },
      {
        name: "Plots",
        slug: "plots",
        icon: "Map",
        description: "Residential and commercial plots",
        hasProjectStage: false,
        allowedTransactionTypes: ["sale"],
        sortOrder: 3,
      },
      {
        name: "Independent House",
        slug: "independent-house",
        icon: "House",
        description: "Independent houses and builder floors",
        hasProjectStage: false,
        allowedTransactionTypes: ["sale", "rent", "lease"],
        sortOrder: 4,
      },
      {
        name: "New Projects",
        slug: "new-projects",
        icon: "Sparkles",
        description: "Newly launched residential and commercial projects",
        hasProjectStage: true,
        allowedTransactionTypes: ["sale"],
        sortOrder: 5,
      },
      {
        name: "Ultra Luxury",
        slug: "ultra-luxury",
        icon: "Crown",
        description: "Premium luxury properties",
        hasProjectStage: true,
        allowedTransactionTypes: ["sale", "rent"],
        sortOrder: 6,
      },
      {
        name: "Commercial",
        slug: "commercial",
        icon: "Briefcase",
        description: "Office spaces, shops, and commercial properties",
        hasProjectStage: false,
        allowedTransactionTypes: ["sale", "rent", "lease"],
        sortOrder: 7,
      },
      {
        name: "Joint Venture",
        slug: "joint-venture",
        icon: "Handshake",
        description: "Partnership opportunities for land development",
        hasProjectStage: false,
        allowedTransactionTypes: ["sale"],
        sortOrder: 8,
      },
      {
        name: "PG / Co-Living",
        slug: "pg-coliving",
        icon: "Users",
        description: "Paying guest and co-living accommodations",
        hasProjectStage: false,
        allowedTransactionTypes: ["rent"],
        sortOrder: 9,
      },
      {
        name: "Farm Land",
        slug: "farm-land",
        icon: "TreeDeciduous",
        description: "Agricultural and farm properties",
        hasProjectStage: false,
        allowedTransactionTypes: ["sale"],
        sortOrder: 10,
      },
      {
        name: "Rush Deal",
        slug: "rush-deal",
        icon: "Timer",
        description: "Quick sale and distress sale properties",
        hasProjectStage: false,
        allowedTransactionTypes: ["sale"],
        sortOrder: 11,
      },
    ];

    const insertedCategories = await db.insert(propertyCategories).values(categoriesData as any).returning();
    console.log(`Created ${insertedCategories.length} property categories...`);

    // Create a map for easy lookup
    const categoryMap = new Map(insertedCategories.map(c => [c.slug, c.id]));

    // Subcategories by category
    const subcategoriesData = [
      // Apartments (9 subcategories)
      { categoryId: categoryMap.get("apartments"), name: "Studio Apartment", slug: "studio", sortOrder: 1 },
      { categoryId: categoryMap.get("apartments"), name: "1 BHK", slug: "1bhk", sortOrder: 2 },
      { categoryId: categoryMap.get("apartments"), name: "2 BHK", slug: "2bhk", sortOrder: 3 },
      { categoryId: categoryMap.get("apartments"), name: "3 BHK", slug: "3bhk", sortOrder: 4 },
      { categoryId: categoryMap.get("apartments"), name: "4 BHK", slug: "4bhk", sortOrder: 5 },
      { categoryId: categoryMap.get("apartments"), name: "5 BHK+", slug: "5bhk-plus", sortOrder: 6 },
      { categoryId: categoryMap.get("apartments"), name: "Penthouse", slug: "penthouse", sortOrder: 7 },
      { categoryId: categoryMap.get("apartments"), name: "Duplex Apartment", slug: "duplex-apartment", sortOrder: 8 },
      { categoryId: categoryMap.get("apartments"), name: "Service Apartment", slug: "service-apartment", sortOrder: 9 },

      // Villas (6 subcategories)
      { categoryId: categoryMap.get("villas"), name: "Independent Villa", slug: "independent-villa", sortOrder: 1 },
      { categoryId: categoryMap.get("villas"), name: "Luxury Villa", slug: "luxury-villa", sortOrder: 2 },
      { categoryId: categoryMap.get("villas"), name: "Farm House", slug: "farm-house", sortOrder: 3 },
      { categoryId: categoryMap.get("villas"), name: "Row House", slug: "row-house", sortOrder: 4 },
      { categoryId: categoryMap.get("villas"), name: "Twin Villa", slug: "twin-villa", sortOrder: 5 },
      { categoryId: categoryMap.get("villas"), name: "Triplex Villa", slug: "triplex-villa", sortOrder: 6 },

      // Plots (5 subcategories)
      { categoryId: categoryMap.get("plots"), name: "Residential Plot", slug: "residential-plot", sortOrder: 1 },
      { categoryId: categoryMap.get("plots"), name: "Commercial Plot", slug: "commercial-plot", sortOrder: 2 },
      { categoryId: categoryMap.get("plots"), name: "Agricultural Plot", slug: "agricultural-plot", sortOrder: 3 },
      { categoryId: categoryMap.get("plots"), name: "Industrial Plot", slug: "industrial-plot", sortOrder: 4 },
      { categoryId: categoryMap.get("plots"), name: "NA Plot", slug: "na-plot", sortOrder: 5 },

      // Independent House (6 subcategories)
      { categoryId: categoryMap.get("independent-house"), name: "1 RK House", slug: "1rk-house", sortOrder: 1 },
      { categoryId: categoryMap.get("independent-house"), name: "1 BHK House", slug: "1bhk-house", sortOrder: 2 },
      { categoryId: categoryMap.get("independent-house"), name: "2 BHK House", slug: "2bhk-house", sortOrder: 3 },
      { categoryId: categoryMap.get("independent-house"), name: "3 BHK House", slug: "3bhk-house", sortOrder: 4 },
      { categoryId: categoryMap.get("independent-house"), name: "4 BHK House", slug: "4bhk-house", sortOrder: 5 },
      { categoryId: categoryMap.get("independent-house"), name: "5 BHK+ House", slug: "5bhk-plus-house", sortOrder: 6 },

      // New Projects (3 subcategories)
      { categoryId: categoryMap.get("new-projects"), name: "Residential Project", slug: "residential-project", sortOrder: 1 },
      { categoryId: categoryMap.get("new-projects"), name: "Commercial Project", slug: "commercial-project", sortOrder: 2 },
      { categoryId: categoryMap.get("new-projects"), name: "Integrated Township", slug: "integrated-township", sortOrder: 3 },

      // Ultra Luxury (3 subcategories)
      { categoryId: categoryMap.get("ultra-luxury"), name: "Premium Apartments", slug: "premium-apartments", sortOrder: 1 },
      { categoryId: categoryMap.get("ultra-luxury"), name: "Luxury Villas", slug: "luxury-villas", sortOrder: 2 },
      { categoryId: categoryMap.get("ultra-luxury"), name: "Premium Commercial", slug: "premium-commercial", sortOrder: 3 },

      // Commercial (7 subcategories)
      { categoryId: categoryMap.get("commercial"), name: "Office Space", slug: "office-space", sortOrder: 1 },
      { categoryId: categoryMap.get("commercial"), name: "Shop", slug: "shop", sortOrder: 2 },
      { categoryId: categoryMap.get("commercial"), name: "Showroom", slug: "showroom", sortOrder: 3 },
      { categoryId: categoryMap.get("commercial"), name: "Warehouse", slug: "warehouse", sortOrder: 4 },
      { categoryId: categoryMap.get("commercial"), name: "Industrial Building", slug: "industrial-building", sortOrder: 5 },
      { categoryId: categoryMap.get("commercial"), name: "Co-working Space", slug: "coworking-space", sortOrder: 6 },
      { categoryId: categoryMap.get("commercial"), name: "Business Center", slug: "business-center", sortOrder: 7 },

      // Joint Venture (3 subcategories)
      { categoryId: categoryMap.get("joint-venture"), name: "Land JV", slug: "land-jv", sortOrder: 1 },
      { categoryId: categoryMap.get("joint-venture"), name: "Redevelopment", slug: "redevelopment", sortOrder: 2 },
      { categoryId: categoryMap.get("joint-venture"), name: "Partial Development", slug: "partial-development", sortOrder: 3 },

      // PG / Co-Living (5 subcategories)
      { categoryId: categoryMap.get("pg-coliving"), name: "Single Sharing", slug: "single-sharing", sortOrder: 1 },
      { categoryId: categoryMap.get("pg-coliving"), name: "Double Sharing", slug: "double-sharing", sortOrder: 2 },
      { categoryId: categoryMap.get("pg-coliving"), name: "Triple Sharing", slug: "triple-sharing", sortOrder: 3 },
      { categoryId: categoryMap.get("pg-coliving"), name: "Boys Only PG", slug: "boys-only-pg", sortOrder: 4 },
      { categoryId: categoryMap.get("pg-coliving"), name: "Girls Only PG", slug: "girls-only-pg", sortOrder: 5 },

      // Farm Land (4 subcategories)
      { categoryId: categoryMap.get("farm-land"), name: "Agriculture Land", slug: "agriculture-land", sortOrder: 1 },
      { categoryId: categoryMap.get("farm-land"), name: "Converted Land", slug: "converted-land", sortOrder: 2 },
      { categoryId: categoryMap.get("farm-land"), name: "NA Farm Plot", slug: "na-farm-plot", sortOrder: 3 },
      { categoryId: categoryMap.get("farm-land"), name: "Orchard", slug: "orchard", sortOrder: 4 },

      // Rush Deal (3 subcategories)
      { categoryId: categoryMap.get("rush-deal"), name: "Distress Sale", slug: "distress-sale", sortOrder: 1 },
      { categoryId: categoryMap.get("rush-deal"), name: "Bank Auction", slug: "bank-auction", sortOrder: 2 },
      { categoryId: categoryMap.get("rush-deal"), name: "Quick Sale", slug: "quick-sale", sortOrder: 3 },
    ];

    await db.insert(propertySubcategories).values(subcategoriesData as any);
    console.log(`Created ${subcategoriesData.length} property subcategories...`);

    // ============================================
    // 2. PROPERTY TYPES (Legacy support)
    // ============================================
    
    const propertyTypesData = [
      { name: "Apartment", slug: "apartment", icon: "Building2", description: "Flats in residential buildings", sortOrder: 1 },
      { name: "Villa", slug: "villa", icon: "Home", description: "Independent luxury villas", sortOrder: 2 },
      { name: "Plot", slug: "plot", icon: "Map", description: "Land plots for construction", sortOrder: 3 },
      { name: "Penthouse", slug: "penthouse", icon: "Castle", description: "Top floor luxury units", sortOrder: 4 },
      { name: "Commercial", slug: "commercial", icon: "Briefcase", description: "Office and retail spaces", sortOrder: 5 },
      { name: "Independent House", slug: "independent-house", icon: "House", description: "Standalone houses", sortOrder: 6 },
    ];

    await db.insert(propertyTypesManaged).values(propertyTypesData as any);
    console.log("Created property types...");

    // ============================================
    // 3. POPULAR CITIES
    // ============================================
    
    const citiesData = [
      {
        name: "Mumbai",
        slug: "mumbai",
        state: "Maharashtra",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        propertyCount: 15420,
        searchParams: { city: "Mumbai" },
        sortOrder: 1,
      },
      {
        name: "Bangalore",
        slug: "bangalore",
        state: "Karnataka",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        propertyCount: 12850,
        searchParams: { city: "Bangalore" },
        sortOrder: 2,
      },
      {
        name: "Delhi NCR",
        slug: "delhi-ncr",
        state: "Delhi",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        propertyCount: 18200,
        searchParams: { city: "Delhi" },
        sortOrder: 3,
      },
      {
        name: "Hyderabad",
        slug: "hyderabad",
        state: "Telangana",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        propertyCount: 9870,
        searchParams: { city: "Hyderabad" },
        sortOrder: 4,
      },
      {
        name: "Chennai",
        slug: "chennai",
        state: "Tamil Nadu",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        propertyCount: 7650,
        searchParams: { city: "Chennai" },
        sortOrder: 5,
      },
      {
        name: "Pune",
        slug: "pune",
        state: "Maharashtra",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        propertyCount: 8940,
        searchParams: { city: "Pune" },
        sortOrder: 6,
      },
      {
        name: "Kolkata",
        slug: "kolkata",
        state: "West Bengal",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        propertyCount: 5420,
        searchParams: { city: "Kolkata" },
        sortOrder: 7,
      },
      {
        name: "Ahmedabad",
        slug: "ahmedabad",
        state: "Gujarat",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        propertyCount: 6780,
        searchParams: { city: "Ahmedabad" },
        sortOrder: 8,
      },
      {
        name: "Jaipur",
        slug: "jaipur",
        state: "Rajasthan",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        propertyCount: 4320,
        searchParams: { city: "Jaipur" },
        sortOrder: 9,
      },
      {
        name: "Goa",
        slug: "goa",
        state: "Goa",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        propertyCount: 3150,
        searchParams: { city: "Goa" },
        sortOrder: 10,
      },
      {
        name: "Lucknow",
        slug: "lucknow",
        state: "Uttar Pradesh",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        propertyCount: 3890,
        searchParams: { city: "Lucknow" },
        sortOrder: 11,
      },
      {
        name: "Chandigarh",
        slug: "chandigarh",
        state: "Chandigarh",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        propertyCount: 2450,
        searchParams: { city: "Chandigarh" },
        sortOrder: 12,
      },
    ];

    await db.insert(popularCities).values(citiesData as any);
    console.log(`Created ${citiesData.length} popular cities...`);

    // ============================================
    // 4. FAQ ITEMS
    // ============================================
    
    const faqData = [
      // Buying FAQs
      { category: "Buying", question: "What documents do I need to buy a property in India?", answer: "To buy a property in India, you typically need: Aadhaar Card, PAN Card, Address Proof, Bank Statements (last 6 months), Income Proof (salary slips or ITR), and Passport-size photographs. For home loans, additional documents like Form 16 and employment letter may be required.", sortOrder: 1 },
      { category: "Buying", question: "How do I verify if a property is RERA registered?", answer: "You can verify RERA registration by visiting your state's RERA website. Enter the project name or RERA number to check registration status, project details, builder information, and compliance history. All under-construction projects must be RERA registered.", sortOrder: 2 },
      { category: "Buying", question: "What is the typical home loan interest rate in India?", answer: "Home loan interest rates in India typically range from 8.5% to 10.5% per annum, depending on the lender, loan amount, and borrower's credit profile. Rates may be fixed or floating, with floating rates being more common.", sortOrder: 3 },
      { category: "Buying", question: "What are the additional costs when buying a property?", answer: "Beyond the property price, expect: Stamp Duty (3-8% depending on state), Registration Charges (1-2%), GST on under-construction properties (1-5%), Legal Fees, Home Loan Processing Fee (0.5-1%), and Society Charges. Total additional costs can be 8-12% of property value.", sortOrder: 4 },
      { category: "Buying", question: "How long does the property registration process take?", answer: "Property registration typically takes 1-3 days once all documents are in order. However, the entire purchase process including document verification, loan approval, and registration can take 2-4 weeks.", sortOrder: 5 },

      // Selling FAQs
      { category: "Selling", question: "How do I list my property on VenGrow?", answer: "To list your property: 1) Register as a seller on VenGrow, 2) Complete your profile verification, 3) Choose a subscription package, 4) Create your listing with photos, videos, and property details, 5) Submit for admin review. Once approved, your property goes live!", sortOrder: 1 },
      { category: "Selling", question: "What documents are required to sell a property?", answer: "Key documents include: Original Sale Deed, Property Tax Receipts, Encumbrance Certificate, Approved Building Plan, Occupancy Certificate, Society NOC (for apartments), and Identity Proof. Having these ready speeds up the sale process.", sortOrder: 2 },
      { category: "Selling", question: "How is property pricing determined?", answer: "Property pricing depends on: Location and locality, Property age and condition, Carpet area vs super built-up area, Amenities and facilities, Current market rates, and Comparable sales in the area. Our team can help you with competitive pricing.", sortOrder: 3 },
      { category: "Selling", question: "What are the charges for selling on VenGrow?", answer: "VenGrow offers transparent subscription packages starting from Free (1 listing) to Enterprise (50 listings). There are no hidden charges or commission on property sales. Premium packages include featured listings and analytics.", sortOrder: 4 },
      { category: "Selling", question: "How long does it take to sell a property?", answer: "Sale duration varies based on location, pricing, and property type. Well-priced properties in prime locations typically sell within 30-90 days. Featured listings and competitive pricing can significantly reduce selling time.", sortOrder: 5 },

      // Legal FAQs
      { category: "Legal", question: "What is an Encumbrance Certificate (EC)?", answer: "An Encumbrance Certificate is a legal document that certifies the property is free from any monetary or legal liabilities. It shows the history of all transactions on the property for a specified period, typically 13-30 years.", sortOrder: 1 },
      { category: "Legal", question: "Is stamp duty refundable if the deal falls through?", answer: "Stamp duty refund policies vary by state. Generally, if registration is cancelled before completion, partial refunds may be available. It's advisable to check your state's specific rules and consult a legal expert.", sortOrder: 2 },
      { category: "Legal", question: "What is the difference between Carpet Area, Built-up Area, and Super Built-up Area?", answer: "Carpet Area is the actual usable floor area. Built-up Area includes carpet area plus walls and balconies. Super Built-up Area includes common areas like lobby, stairs, and amenities proportionally. Always negotiate based on carpet area.", sortOrder: 3 },
      { category: "Legal", question: "Can NRIs buy property in India?", answer: "Yes, NRIs and PIOs can buy residential and commercial properties in India. However, they cannot purchase agricultural land, farmhouses, or plantation properties without RBI permission. Transactions must comply with FEMA regulations.", sortOrder: 4 },
      { category: "Legal", question: "What is RERA and why is it important?", answer: "RERA (Real Estate Regulatory Authority) is a regulatory body that protects homebuyers' interests. It ensures project transparency, timely delivery, and developer accountability. Always verify RERA registration before purchasing under-construction properties.", sortOrder: 5 },

      // Platform FAQs
      { category: "Platform", question: "How do I contact a property seller?", answer: "Once you find a property you like: 1) Click 'Contact Seller' or 'Send Inquiry', 2) Fill in your details and message, 3) The seller receives your inquiry and responds directly. You can also use our chat feature for instant communication.", sortOrder: 1 },
      { category: "Platform", question: "How do I save properties for later?", answer: "Click the heart icon on any property listing to add it to your favorites. Access your saved properties anytime from your dashboard under 'Favorites'. You can also create custom property alerts for new matching listings.", sortOrder: 2 },
      { category: "Platform", question: "What are Featured Listings?", answer: "Featured Listings appear at the top of search results and homepage, getting 3x more visibility than regular listings. Available with Premium and Enterprise packages, they help properties sell faster.", sortOrder: 3 },
      { category: "Platform", question: "How does VenGrow verify sellers?", answer: "Our verification process includes: Identity verification (Aadhaar/PAN), Business verification for brokers/builders, RERA compliance check, Document verification, and background checks. Verified sellers display a trust badge.", sortOrder: 4 },
      { category: "Platform", question: "Is my personal information safe on VenGrow?", answer: "Yes, we take data security seriously. All personal information is encrypted, and we never share your details with third parties without consent. Our platform complies with data protection regulations.", sortOrder: 5 },

      // Home Loan FAQs
      { category: "Home Loans", question: "What is the maximum home loan amount I can get?", answer: "Home loan eligibility depends on your income, existing liabilities, credit score, and property value. Generally, banks offer up to 80-90% of property value for loans up to Rs. 30 lakhs, and 75-80% for higher amounts.", sortOrder: 1 },
      { category: "Home Loans", question: "What is a good CIBIL score for home loans?", answer: "A CIBIL score of 750 or above is considered good for home loans and helps you get better interest rates. Scores between 700-749 are acceptable but may result in slightly higher rates. Below 650 may lead to loan rejection.", sortOrder: 2 },
      { category: "Home Loans", question: "Can I prepay my home loan without penalty?", answer: "As per RBI guidelines, banks cannot charge prepayment penalties on floating rate home loans. For fixed rate loans, prepayment charges may apply as per bank policy. Partial prepayments can significantly reduce your interest burden.", sortOrder: 3 },
      { category: "Home Loans", question: "What tax benefits are available on home loans?", answer: "Under Section 80C, you can claim up to Rs. 1.5 lakh deduction on principal repayment. Under Section 24, interest up to Rs. 2 lakh is deductible for self-occupied property. First-time buyers get additional benefits under Section 80EEA.", sortOrder: 4 },
    ];

    await db.insert(faqItems).values(faqData as any);
    console.log(`Created ${faqData.length} FAQ items...`);

    // ============================================
    // 5. STATIC PAGES
    // ============================================
    
    const staticPagesData = [
      {
        slug: "about",
        title: "About VenGrow",
        content: `
# About VenGrow

## Transforming Real Estate in India

VenGrow is India's premier real estate marketplace, connecting property buyers, sellers, and brokers through an innovative digital platform. Founded with a vision to simplify property transactions, we've grown to become a trusted name in the Indian real estate sector.

## Our Mission

To democratize real estate by providing a transparent, efficient, and user-friendly platform that empowers every Indian to find their dream property or sell their assets at the best value.

## Our Story

Started in 2023, VenGrow emerged from a simple observation: the Indian real estate market needed a fresh approach. Traditional property searches were time-consuming, lacked transparency, and often led to frustration for both buyers and sellers.

We built VenGrow to change this narrative. Our platform leverages technology to bring clarity, speed, and trust to property transactions.

## What Sets Us Apart

### Verified Listings
Every property on VenGrow undergoes a thorough verification process. We ensure RERA compliance, ownership verification, and accurate property details.

### Pan-India Presence
From metros like Mumbai and Bangalore to emerging cities, we cover properties across India, making us a one-stop destination for all real estate needs.

### Technology-First Approach
Our AI-powered search, virtual tours, and smart recommendations help you find the perfect property faster.

### Transparent Pricing
No hidden fees, no surprises. Our pricing is straightforward, and all costs are disclosed upfront.

## Our Numbers

- **50,000+** Verified Properties
- **12+** Major Cities
- **10,000+** Happy Customers
- **500+** Verified Sellers

## Join the VenGrow Family

Whether you're a first-time buyer, seasoned investor, or property developer, VenGrow is here to make your real estate journey smooth and successful.

**Contact us today and experience the future of real estate!**
        `,
        metaTitle: "About VenGrow - India's Premier Real Estate Marketplace",
        metaDescription: "Learn about VenGrow, India's leading real estate marketplace connecting buyers, sellers, and brokers with verified properties across major cities.",
        showInHeader: true,
        showInFooter: true,
        footerSection: "quick_links",
        sortOrder: 1,
      },
      {
        slug: "terms",
        title: "Terms of Service",
        content: `
# Terms of Service

*Last Updated: January 2024*

Welcome to VenGrow. By using our platform, you agree to these Terms of Service.

## 1. Acceptance of Terms

By accessing or using VenGrow's website and services, you acknowledge that you have read, understood, and agree to be bound by these Terms of Service.

## 2. User Accounts

### 2.1 Registration
- You must provide accurate and complete information during registration
- You are responsible for maintaining the confidentiality of your account
- You must be at least 18 years old to create an account

### 2.2 Account Security
- You are responsible for all activities under your account
- Notify us immediately of any unauthorized use

## 3. Property Listings

### 3.1 Seller Responsibilities
- All listing information must be accurate and truthful
- Properties must comply with local regulations and RERA requirements
- Sellers must have legal authority to sell or rent the property

### 3.2 Platform Rights
- VenGrow reserves the right to remove listings that violate our policies
- We may verify listing information and require additional documentation

## 4. Prohibited Activities

Users may not:
- Post false or misleading information
- Engage in fraudulent activities
- Violate any applicable laws or regulations
- Spam or send unsolicited communications
- Attempt to circumvent platform fees

## 5. Payments and Fees

### 5.1 Subscription Packages
- Package prices are as displayed at the time of purchase
- All payments are processed securely through authorized payment gateways

### 5.2 Refunds
- Refund requests are handled per our Refund Policy
- Unused listing credits may be refunded within 7 days of purchase

## 6. Intellectual Property

All content on VenGrow, including logos, design, and text, is protected by copyright and trademark laws.

## 7. Limitation of Liability

VenGrow acts as a marketplace facilitator and is not responsible for:
- Property conditions or defects
- Disputes between buyers and sellers
- Accuracy of third-party information

## 8. Privacy

Your use of VenGrow is also governed by our Privacy Policy.

## 9. Changes to Terms

We may update these terms periodically. Continued use constitutes acceptance of modified terms.

## 10. Contact

For questions about these Terms, contact us at legal@vengrow.com
        `,
        metaTitle: "Terms of Service - VenGrow",
        metaDescription: "Read VenGrow's Terms of Service governing the use of our real estate marketplace platform.",
        showInHeader: false,
        showInFooter: true,
        footerSection: "legal",
        sortOrder: 2,
      },
      {
        slug: "privacy",
        title: "Privacy Policy",
        content: `
# Privacy Policy

*Last Updated: January 2024*

VenGrow ("we," "our," or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, and safeguard your information.

## 1. Information We Collect

### 1.1 Personal Information
- Name, email address, phone number
- Identity documents (for verification)
- Payment information

### 1.2 Property Information
- Property details, photos, and documents
- Location data

### 1.3 Usage Information
- Device information, IP address
- Browsing history on our platform
- Search preferences and saved listings

## 2. How We Use Your Information

We use collected information to:
- Provide and improve our services
- Process transactions and subscriptions
- Verify user and property authenticity
- Send relevant notifications and updates
- Analyze platform usage and trends
- Comply with legal obligations

## 3. Information Sharing

We may share information with:
- Service providers who assist our operations
- Legal authorities when required by law
- Other users as necessary for transactions

We do NOT sell your personal information to third parties.

## 4. Data Security

We implement industry-standard security measures:
- SSL encryption for data transmission
- Secure storage with access controls
- Regular security audits

## 5. Cookies and Tracking

We use cookies to:
- Remember your preferences
- Analyze site traffic
- Personalize your experience

You can control cookies through your browser settings.

## 6. Your Rights

You have the right to:
- Access your personal data
- Correct inaccurate information
- Request deletion of your data
- Opt-out of marketing communications

## 7. Data Retention

We retain your information for as long as necessary to provide services and comply with legal obligations.

## 8. Children's Privacy

VenGrow is not intended for users under 18. We do not knowingly collect information from minors.

## 9. Changes to This Policy

We may update this policy periodically. Significant changes will be communicated via email or platform notification.

## 10. Contact Us

For privacy concerns, contact: privacy@vengrow.com

**Data Protection Officer**
VenGrow Technologies Pvt. Ltd.
Mumbai, Maharashtra, India
        `,
        metaTitle: "Privacy Policy - VenGrow",
        metaDescription: "VenGrow's Privacy Policy explaining how we collect, use, and protect your personal information on our real estate platform.",
        showInHeader: false,
        showInFooter: true,
        footerSection: "legal",
        sortOrder: 3,
      },
      {
        slug: "refund-policy",
        title: "Refund Policy",
        content: `
# Refund Policy

*Last Updated: January 2024*

At VenGrow, we strive for complete customer satisfaction. This Refund Policy outlines the terms and conditions for refunds on our subscription packages.

## 1. Subscription Packages

### 1.1 Free Package
The Free package has no cost and therefore no refund applies.

### 1.2 Paid Packages (Basic, Premium, Enterprise)

**Full Refund Eligibility:**
- Request within 7 days of purchase
- No listings created or published
- Account in good standing

**Partial Refund Eligibility:**
- Request within 14 days of purchase
- Listings created but not yet published
- Refund calculated on unused portion

**No Refund:**
- Requests after 14 days
- Published listings exist
- Terms of Service violations

## 2. How to Request a Refund

1. Log into your VenGrow account
2. Go to Settings > Subscription
3. Click "Request Refund"
4. Provide reason for refund
5. Submit request

Alternatively, email refunds@vengrow.com with your account details.

## 3. Processing Time

- Refund requests reviewed within 3-5 business days
- Approved refunds processed within 7-10 business days
- Refund credited to original payment method

## 4. Special Circumstances

### 4.1 Technical Issues
If our platform issues prevented you from using paid features, contact support for a full or partial refund regardless of timing.

### 4.2 Duplicate Payments
Accidental duplicate payments will be refunded in full upon verification.

## 5. Contact Us

For refund queries:
- Email: refunds@vengrow.com
- Phone: +91 1800-XXX-XXXX
- Support Hours: Mon-Sat, 9 AM - 6 PM IST
        `,
        metaTitle: "Refund Policy - VenGrow",
        metaDescription: "VenGrow's refund policy for subscription packages. Learn about eligibility, process, and timelines for refund requests.",
        showInHeader: false,
        showInFooter: true,
        footerSection: "legal",
        sortOrder: 4,
      },
      {
        slug: "contact",
        title: "Contact Us",
        content: `
# Contact Us

We'd love to hear from you! Whether you have questions, feedback, or need assistance, our team is here to help.

## Get in Touch

### Customer Support
**Email:** support@vengrow.com
**Phone:** +91 1800-XXX-XXXX (Toll Free)
**Hours:** Monday to Saturday, 9 AM - 6 PM IST

### Sales Inquiries
**Email:** sales@vengrow.com
**Phone:** +91 98XX-XXX-XXX

### Partnership Opportunities
**Email:** partners@vengrow.com

## Our Offices

### Mumbai (Head Office)
VenGrow Technologies Pvt. Ltd.
Level 5, Trade Tower
Bandra Kurla Complex
Mumbai, Maharashtra 400051

### Bangalore
VenGrow Technologies
Floor 3, Tech Park
Outer Ring Road
Bangalore, Karnataka 560103

### Delhi NCR
VenGrow Technologies
Tower B, Cyber City
Gurugram, Haryana 122002

## Quick Links

- **FAQs** - Find answers to common questions
- **Help Center** - Browse our knowledge base
- **Report an Issue** - Technical support
- **Feedback** - Share your suggestions

## Social Media

Follow us for updates, tips, and real estate insights:
- Facebook: /vengrow
- Instagram: @vengrow_india
- Twitter: @vengrow
- LinkedIn: /company/vengrow

## Response Time

We aim to respond to all inquiries within:
- Email: 24-48 hours
- Phone: Immediate during business hours
- Social Media: 4-6 hours
        `,
        metaTitle: "Contact Us - VenGrow",
        metaDescription: "Get in touch with VenGrow. Find our contact details, office locations, and support channels for all your real estate queries.",
        showInHeader: true,
        showInFooter: true,
        footerSection: "quick_links",
        sortOrder: 5,
      },
    ];

    await db.insert(staticPages).values(staticPagesData as any);
    console.log(`Created ${staticPagesData.length} static pages...`);

    // ============================================
    // 6. BANNERS
    // ============================================
    
    const bannersData = [
      {
        name: "Main Hero Banner",
        title: "Find Your Dream Home in India",
        subtitle: "Discover verified properties across 12+ cities with transparent pricing and trusted sellers",
        ctaText: "Explore Properties",
        ctaLink: "/listings",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        position: "hero",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "New Year Sale Banner",
        title: "New Year Property Fest 2024",
        subtitle: "Get up to 20% off on premium listings. Limited time offer!",
        ctaText: "View Offers",
        ctaLink: "/packages",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        position: "hero",
        sortOrder: 2,
        isActive: true,
      },
      {
        name: "Seller CTA Banner",
        title: "Ready to Sell Your Property?",
        subtitle: "List with VenGrow and reach thousands of verified buyers",
        ctaText: "Start Selling",
        ctaLink: "/seller/register",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        position: "homepage_middle",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Mobile App Banner",
        title: "VenGrow on Mobile",
        subtitle: "Search properties on the go. Download our app today!",
        ctaText: "Download App",
        ctaLink: "/mobile-app",
        imageUrl: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        position: "homepage_bottom",
        sortOrder: 1,
        isActive: true,
      },
      {
        name: "Premium Listing Promo",
        title: "Go Premium, Sell Faster",
        subtitle: "Premium listings get 3x more views and sell 50% faster",
        ctaText: "Upgrade Now",
        ctaLink: "/packages",
        imageUrl: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        position: "sidebar",
        sortOrder: 1,
        isActive: true,
      },
    ];

    await db.insert(banners).values(bannersData as any);
    console.log(`Created ${bannersData.length} banners...`);

    // ============================================
    // 7. NAVIGATION LINKS
    // ============================================
    
    const navLinksData = [
      // Header Links
      { label: "Buy", url: "/listings?type=sale", position: "header", section: "main", linkType: "search_filter", searchParams: { transactionType: "sale" }, sortOrder: 1 },
      { label: "Rent", url: "/listings?type=rent", position: "header", section: "main", linkType: "search_filter", searchParams: { transactionType: "rent" }, sortOrder: 2 },
      { label: "Lease", url: "/listings?type=lease", position: "header", section: "main", linkType: "search_filter", searchParams: { transactionType: "lease" }, sortOrder: 3 },
      { label: "New Projects", url: "/listings?category=new-projects", position: "header", section: "main", linkType: "search_filter", searchParams: { category: "new-projects" }, sortOrder: 4 },
      { label: "Pricing", url: "/packages", position: "header", section: "main", linkType: "internal", sortOrder: 5 },

      // Footer - Quick Links
      { label: "Home", url: "/", position: "footer", section: "quick_links", linkType: "internal", sortOrder: 1 },
      { label: "About Us", url: "/about", position: "footer", section: "quick_links", linkType: "internal", sortOrder: 2 },
      { label: "Contact Us", url: "/contact", position: "footer", section: "quick_links", linkType: "internal", sortOrder: 3 },
      { label: "Blog", url: "/blog", position: "footer", section: "quick_links", linkType: "internal", sortOrder: 4 },
      { label: "Careers", url: "/careers", position: "footer", section: "quick_links", linkType: "internal", sortOrder: 5 },
      { label: "FAQ", url: "/faq", position: "footer", section: "quick_links", linkType: "internal", sortOrder: 6 },

      // Footer - For Sellers
      { label: "Sell Property", url: "/seller/register", position: "footer", section: "for_sellers", linkType: "internal", sortOrder: 1 },
      { label: "Pricing Plans", url: "/packages", position: "footer", section: "for_sellers", linkType: "internal", sortOrder: 2 },
      { label: "Seller Guide", url: "/sell-your-property", position: "footer", section: "for_sellers", linkType: "internal", sortOrder: 3 },
      { label: "Post Property Free", url: "/seller/type", position: "footer", section: "for_sellers", linkType: "internal", sortOrder: 4 },
      { label: "Seller Dashboard", url: "/seller/dashboard", position: "footer", section: "for_sellers", linkType: "internal", sortOrder: 5 },

      // Footer - Legal
      { label: "Terms of Service", url: "/terms", position: "footer", section: "legal", linkType: "internal", sortOrder: 1 },
      { label: "Privacy Policy", url: "/privacy", position: "footer", section: "legal", linkType: "internal", sortOrder: 2 },
      { label: "Refund Policy", url: "/refund-policy", position: "footer", section: "legal", linkType: "internal", sortOrder: 3 },
      { label: "RERA Compliance", url: "/rera-compliance", position: "footer", section: "legal", linkType: "internal", sortOrder: 4 },
      { label: "Security", url: "/security", position: "footer", section: "legal", linkType: "internal", sortOrder: 5 },
    ];

    await db.insert(navigationLinks).values(navLinksData as any);
    console.log(`Created ${navLinksData.length} navigation links...`);

    // ============================================
    // 8. SITE SETTINGS
    // ============================================
    
    const siteSettingsData = [
      // General Settings
      { key: "site_name", value: "VenGrow", type: "text", category: "general", label: "Site Name", description: "The name of the platform" },
      { key: "site_tagline", value: "India's Premier Real Estate Marketplace", type: "text", category: "general", label: "Tagline", description: "Site tagline for branding" },
      { key: "site_description", value: "VenGrow connects property buyers, sellers, and brokers across India with verified listings and transparent transactions.", type: "textarea", category: "general", label: "Site Description", description: "SEO meta description" },
      { key: "site_logo", value: "/logo.png", type: "image", category: "general", label: "Site Logo", description: "Main site logo" },
      { key: "site_favicon", value: "/favicon.ico", type: "image", category: "general", label: "Favicon", description: "Browser favicon" },

      // Contact Information
      { key: "contact_email", value: "support@vengrow.com", type: "email", category: "contact", label: "Support Email", description: "Primary support email" },
      { key: "contact_phone", value: "+91 1800-XXX-XXXX", type: "text", category: "contact", label: "Support Phone", description: "Toll-free support number" },
      { key: "contact_address", value: "Level 5, Trade Tower, Bandra Kurla Complex, Mumbai, Maharashtra 400051", type: "textarea", category: "contact", label: "Office Address", description: "Head office address" },
      { key: "whatsapp_number", value: "+919876543210", type: "text", category: "contact", label: "WhatsApp", description: "WhatsApp support number" },

      // Social Media
      { key: "social_facebook", value: "https://facebook.com/vengrow", type: "url", category: "social", label: "Facebook", description: "Facebook page URL" },
      { key: "social_instagram", value: "https://instagram.com/vengrow_india", type: "url", category: "social", label: "Instagram", description: "Instagram profile URL" },
      { key: "social_twitter", value: "https://twitter.com/vengrow", type: "url", category: "social", label: "Twitter/X", description: "Twitter profile URL" },
      { key: "social_linkedin", value: "https://linkedin.com/company/vengrow", type: "url", category: "social", label: "LinkedIn", description: "LinkedIn company page" },
      { key: "social_youtube", value: "https://youtube.com/@vengrow", type: "url", category: "social", label: "YouTube", description: "YouTube channel" },

      // Business Settings
      { key: "default_currency", value: "INR", type: "text", category: "business", label: "Currency", description: "Default currency for prices" },
      { key: "default_country", value: "India", type: "text", category: "business", label: "Country", description: "Default country" },
      { key: "gst_number", value: "27XXXXX1234X1ZX", type: "text", category: "business", label: "GST Number", description: "Company GST registration" },
      { key: "rera_registration", value: "MHRERA/XXX/2023", type: "text", category: "business", label: "RERA Registration", description: "RERA registration number" },

      // Feature Flags
      { key: "enable_chat", value: "true", type: "boolean", category: "features", label: "Enable Chat", description: "Enable buyer-seller chat feature" },
      { key: "enable_virtual_tours", value: "true", type: "boolean", category: "features", label: "Virtual Tours", description: "Enable 3D virtual tours" },
      { key: "enable_video_calls", value: "false", type: "boolean", category: "features", label: "Video Calls", description: "Enable video call scheduling" },
      { key: "maintenance_mode", value: "false", type: "boolean", category: "features", label: "Maintenance Mode", description: "Put site in maintenance mode" },
      { key: "new_registrations", value: "true", type: "boolean", category: "features", label: "New Registrations", description: "Allow new user registrations" },

      // SEO Settings
      { key: "google_analytics_id", value: "", type: "text", category: "seo", label: "Google Analytics ID", description: "GA4 measurement ID" },
      { key: "google_tag_manager_id", value: "", type: "text", category: "seo", label: "GTM Container ID", description: "Google Tag Manager ID" },
      { key: "facebook_pixel_id", value: "", type: "text", category: "seo", label: "Facebook Pixel ID", description: "Facebook Pixel for tracking" },
    ];

    await db.insert(siteSettings).values(siteSettingsData as any);
    console.log(`Created ${siteSettingsData.length} site settings...`);

    console.log("\n===========================================");
    console.log("CMS Content seeding completed successfully!");
    console.log("===========================================");
    console.log(`
Summary:
- ${insertedCategories.length} Property Categories
- ${subcategoriesData.length} Property Subcategories
- ${propertyTypesData.length} Property Types
- ${citiesData.length} Popular Cities
- ${faqData.length} FAQ Items
- ${staticPagesData.length} Static Pages
- ${bannersData.length} Banners
- ${navLinksData.length} Navigation Links
- ${siteSettingsData.length} Site Settings
    `);

    return { success: true };
  } catch (error) {
    console.error("Error seeding CMS content:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedCMSContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
