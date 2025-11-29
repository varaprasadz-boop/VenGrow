import { db } from "./db";
import { packages, faqItems, staticPages, banners, platformSettings, emailTemplates } from "@shared/schema";
import { eq } from "drizzle-orm";

async function seedPackages() {
  console.log("Seeding packages...");
  
  const existingPackages = await db.select().from(packages);
  if (existingPackages.length > 0) {
    console.log("Packages already exist, skipping...");
    return;
  }

  const packageData = [
    {
      name: "Free",
      description: "Get started with VenGrow at no cost",
      price: 0,
      duration: 365,
      listingLimit: 1,
      featuredListings: 0,
      features: [
        "1 active listing",
        "365 days listing duration",
        "Standard placement in search results",
        "Basic property analytics",
        "Email support",
        "Property photos (up to 5 per listing)",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Basic",
      description: "Perfect for individual property owners",
      price: 999,
      duration: 30,
      listingLimit: 3,
      featuredListings: 0,
      features: [
        "3 active listings",
        "30 days listing duration",
        "Standard placement in search results",
        "Basic property analytics",
        "Email support",
        "Property photos (up to 10 per listing)",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Premium",
      description: "Best for brokers and active sellers",
      price: 2499,
      duration: 60,
      listingLimit: 10,
      featuredListings: 2,
      features: [
        "10 active listings",
        "60 days listing duration",
        "Priority placement in search results",
        "Featured badge on listings",
        "Full analytics dashboard",
        "Email & chat support",
        "Property photos (up to 20 per listing)",
        "Video tour upload",
        "Social media sharing tools",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Enterprise",
      description: "For builders and large agencies",
      price: 9999,
      duration: 90,
      listingLimit: 50,
      featuredListings: 10,
      features: [
        "50 active listings",
        "90 days listing duration",
        "Top homepage placement",
        "Premium verified badge",
        "Advanced analytics & insights",
        "Priority 24/7 support",
        "Dedicated account manager",
        "Property photos (unlimited per listing)",
        "Video tour & 360° view upload",
        "Featured on social media",
        "Custom branding options",
      ],
      isPopular: false,
      isActive: true,
    },
  ];

  await db.insert(packages).values(packageData);
  console.log(`Inserted ${packageData.length} packages`);
}

async function seedFaqItems() {
  console.log("Seeding FAQ items...");
  
  const existingFaqs = await db.select().from(faqItems);
  if (existingFaqs.length > 0) {
    console.log("FAQ items already exist, skipping...");
    return;
  }

  const faqData = [
    // For Buyers
    {
      category: "For Buyers",
      question: "How do I search for properties on VenGrow?",
      answer: "You can search for properties using our search bar on the homepage. Filter by location, property type, price range, BHK configuration, and more. You can also save your search criteria to get notifications when new matching properties are listed.",
      sortOrder: 1,
      isActive: true,
    },
    {
      category: "For Buyers",
      question: "Are all sellers verified?",
      answer: "Yes, we have a thorough verification process for all sellers. Individual owners verify their property documents, brokers provide RERA certification, and builders submit company registration details. Look for the verified badge on listings.",
      sortOrder: 2,
      isActive: true,
    },
    {
      category: "For Buyers",
      question: "How do I contact a property seller?",
      answer: "Simply click on a property listing and use the 'Send Inquiry' button or 'Chat with Seller' option. Your contact details will be shared with the seller, and they'll respond directly.",
      sortOrder: 3,
      isActive: true,
    },
    {
      category: "For Buyers",
      question: "Is there any fee for buyers?",
      answer: "No, VenGrow is completely free for buyers. You can browse unlimited properties, save favorites, and contact sellers without any charges.",
      sortOrder: 4,
      isActive: true,
    },
    {
      category: "For Buyers",
      question: "Can I schedule property visits?",
      answer: "Yes, you can request site visits directly through the inquiry form or chat with sellers to arrange a convenient time for property viewing.",
      sortOrder: 5,
      isActive: true,
    },
    // For Sellers
    {
      category: "For Sellers",
      question: "What are the different seller packages?",
      answer: "We offer four packages: Free (1 listing, 365 days), Basic (₹999/month for 3 listings), Premium (₹2,499/month for 10 listings with featured badge), and Enterprise (₹9,999/month for 50 listings with dedicated support). Each package offers different visibility and features.",
      sortOrder: 6,
      isActive: true,
    },
    {
      category: "For Sellers",
      question: "How long does verification take?",
      answer: "Verification typically takes 24-48 hours. We verify property documents for individual owners, RERA certification for brokers, and company registration for builders.",
      sortOrder: 7,
      isActive: true,
    },
    {
      category: "For Sellers",
      question: "How do I create a property listing?",
      answer: "After purchasing a package, go to your seller dashboard and click 'Create Listing'. Fill in property details, upload photos, set the price, and publish. Your listing will go live after approval.",
      sortOrder: 8,
      isActive: true,
    },
    {
      category: "For Sellers",
      question: "Can I edit or delete my listings?",
      answer: "Yes, you can edit listing details, update photos, or change pricing anytime from your dashboard. You can also pause or delete listings as needed.",
      sortOrder: 9,
      isActive: true,
    },
    {
      category: "For Sellers",
      question: "How do I receive inquiries?",
      answer: "You'll receive inquiries via email, SMS, and through the platform's messaging system. You can respond directly from your seller dashboard.",
      sortOrder: 10,
      isActive: true,
    },
    // Payments & Refunds
    {
      category: "Payments & Refunds",
      question: "What payment methods are accepted?",
      answer: "We accept all major payment methods through Razorpay including credit/debit cards, UPI, net banking, and wallets.",
      sortOrder: 11,
      isActive: true,
    },
    {
      category: "Payments & Refunds",
      question: "Is there a refund policy?",
      answer: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied with our service within the first 7 days, contact support for a full refund.",
      sortOrder: 12,
      isActive: true,
    },
    {
      category: "Payments & Refunds",
      question: "Are payments secure?",
      answer: "Yes, all payments are processed through Razorpay, a PCI DSS compliant payment gateway. We don't store any payment card details on our servers.",
      sortOrder: 13,
      isActive: true,
    },
    {
      category: "Payments & Refunds",
      question: "Can I cancel my subscription?",
      answer: "Yes, you can cancel anytime. Your package will remain active until the end of your billing period, and you won't be charged again.",
      sortOrder: 14,
      isActive: true,
    },
    // Technical Support
    {
      category: "Technical Support",
      question: "I forgot my password. How do I reset it?",
      answer: "Click on 'Forgot Password' on the login page. Enter your email address, and we'll send you a password reset link.",
      sortOrder: 15,
      isActive: true,
    },
    {
      category: "Technical Support",
      question: "How do I change my email or phone number?",
      answer: "Go to your Profile Settings and update your email or phone number. You'll need to verify the new email/phone through OTP.",
      sortOrder: 16,
      isActive: true,
    },
    {
      category: "Technical Support",
      question: "Why can't I upload property photos?",
      answer: "Ensure your images are in JPG, PNG, or WebP format and under 5MB each. If the problem persists, try a different browser or contact support.",
      sortOrder: 17,
      isActive: true,
    },
    {
      category: "Technical Support",
      question: "How do I delete my account?",
      answer: "Go to Settings > Account Actions > Delete Account. Note that this action is permanent and will remove all your data.",
      sortOrder: 18,
      isActive: true,
    },
  ];

  await db.insert(faqItems).values(faqData);
  console.log(`Inserted ${faqData.length} FAQ items`);
}

async function seedPlatformSettings() {
  console.log("Seeding platform settings...");
  
  const existingSettings = await db.select().from(platformSettings);
  if (existingSettings.length > 0) {
    console.log("Platform settings already exist, skipping...");
    return;
  }

  const settingsData = [
    // Stats for homepage
    { category: "general" as const, key: "stat_active_listings", value: "10,000+", description: "Number of active property listings" },
    { category: "general" as const, key: "stat_registered_users", value: "50,000+", description: "Number of registered users" },
    { category: "general" as const, key: "stat_properties_sold", value: "5,000+", description: "Number of properties sold" },
    { category: "general" as const, key: "stat_verified_sellers", value: "1,000+", description: "Number of verified sellers" },
    // Site info
    { category: "general" as const, key: "site_name", value: "VenGrow", description: "Website name" },
    { category: "general" as const, key: "site_tagline", value: "India's trusted verified property marketplace", description: "Website tagline" },
    { category: "general" as const, key: "support_email", value: "support@vengrow.com", description: "Support email address" },
    { category: "general" as const, key: "support_phone", value: "+91 98765 43210", description: "Support phone number" },
    // Social links
    { category: "social" as const, key: "facebook_url", value: "https://facebook.com/vengrow", description: "Facebook page URL" },
    { category: "social" as const, key: "twitter_url", value: "https://twitter.com/vengrow", description: "Twitter profile URL" },
    { category: "social" as const, key: "instagram_url", value: "https://instagram.com/vengrow", description: "Instagram profile URL" },
    { category: "social" as const, key: "linkedin_url", value: "https://linkedin.com/company/vengrow", description: "LinkedIn page URL" },
  ];

  await db.insert(platformSettings).values(settingsData);
  console.log(`Inserted ${settingsData.length} platform settings`);
}

async function seedEmailTemplates() {
  console.log("Seeding email templates...");
  
  const existingTemplates = await db.select().from(emailTemplates);
  if (existingTemplates.length > 0) {
    console.log("Email templates already exist, skipping...");
    return;
  }

  const templateData = [
    {
      name: "Welcome Buyer",
      subject: "Welcome to VenGrow - Start Your Property Search!",
      body: `<h1>Welcome to VenGrow, {{firstName}}!</h1>
<p>Thank you for joining India's trusted property marketplace.</p>
<p>You can now:</p>
<ul>
  <li>Browse thousands of verified properties</li>
  <li>Save your favorite listings</li>
  <li>Contact sellers directly</li>
  <li>Schedule property visits</li>
</ul>
<p>Start your property search today!</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName", "email"],
      triggerEvent: "welcome_buyer" as const,
      isActive: true,
      description: "Sent when a new buyer registers",
    },
    {
      name: "Welcome Seller",
      subject: "Welcome to VenGrow - Start Selling Your Properties!",
      body: `<h1>Welcome to VenGrow, {{firstName}}!</h1>
<p>Thank you for becoming a seller on India's trusted property marketplace.</p>
<p>Your seller account is now active. Here's what you can do:</p>
<ul>
  <li>List your properties with photos and details</li>
  <li>Receive inquiries from interested buyers</li>
  <li>Track views and engagement</li>
  <li>Manage all your listings from one dashboard</li>
</ul>
<p>Ready to list your first property? Visit your seller dashboard to get started.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName", "email"],
      triggerEvent: "welcome_seller" as const,
      isActive: true,
      description: "Sent when a new seller registers",
    },
    {
      name: "Inquiry Received",
      subject: "New Inquiry for Your Property - {{propertyTitle}}",
      body: `<h1>You have a new inquiry!</h1>
<p>Hi {{sellerName}},</p>
<p>A potential buyer is interested in your property: <strong>{{propertyTitle}}</strong></p>
<h3>Buyer Details:</h3>
<ul>
  <li>Name: {{buyerName}}</li>
  <li>Email: {{buyerEmail}}</li>
  <li>Phone: {{buyerPhone}}</li>
</ul>
<h3>Message:</h3>
<p>{{message}}</p>
<p>Login to your seller dashboard to respond to this inquiry.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "propertyTitle", "buyerName", "buyerEmail", "buyerPhone", "message"],
      triggerEvent: "inquiry_received" as const,
      isActive: true,
      description: "Sent to seller when a new inquiry is received",
    },
    {
      name: "Property Submitted",
      subject: "Property Submitted for Review - {{propertyTitle}}",
      body: `<h1>Property Submitted Successfully!</h1>
<p>Hi {{sellerName}},</p>
<p>Your property <strong>{{propertyTitle}}</strong> has been submitted for review.</p>
<p>Our team will review your listing within 24-48 hours. You will receive an email once your property is approved or if any changes are required.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "propertyTitle"],
      triggerEvent: "property_submitted" as const,
      isActive: true,
      description: "Sent when a property is submitted for review",
    },
    {
      name: "Property Approved",
      subject: "Your Property is Now Live - {{propertyTitle}}",
      body: `<h1>Congratulations!</h1>
<p>Hi {{sellerName}},</p>
<p>Your property <strong>{{propertyTitle}}</strong> has been approved and is now live on VenGrow!</p>
<p>Buyers can now view your listing and send you inquiries.</p>
<p>Tips to get more views:</p>
<ul>
  <li>Add more high-quality photos</li>
  <li>Keep your pricing competitive</li>
  <li>Respond to inquiries promptly</li>
</ul>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "propertyTitle"],
      triggerEvent: "property_approved" as const,
      isActive: true,
      description: "Sent when a property is approved and goes live",
    },
    {
      name: "Property Rejected",
      subject: "Action Required - Property Review Update",
      body: `<h1>Property Review Update</h1>
<p>Hi {{sellerName}},</p>
<p>Your property <strong>{{propertyTitle}}</strong> requires some changes before it can be published.</p>
<h3>Reason:</h3>
<p>{{rejectionReason}}</p>
<p>Please update your listing and resubmit for review.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "propertyTitle", "rejectionReason"],
      triggerEvent: "property_rejected" as const,
      isActive: true,
      description: "Sent when a property is rejected with feedback",
    },
    {
      name: "Payment Success",
      subject: "Payment Successful - {{packageName}} Package Activated",
      body: `<h1>Payment Successful!</h1>
<p>Hi {{sellerName}},</p>
<p>Your payment of ₹{{amount}} for the <strong>{{packageName}}</strong> package has been received.</p>
<h3>Transaction Details:</h3>
<ul>
  <li>Transaction ID: {{transactionId}}</li>
  <li>Package: {{packageName}}</li>
  <li>Amount: ₹{{amount}}</li>
  <li>Valid Until: {{validUntil}}</li>
</ul>
<p>You can now list up to {{listingLimit}} properties.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "amount", "packageName", "transactionId", "validUntil", "listingLimit"],
      triggerEvent: "payment_success" as const,
      isActive: true,
      description: "Sent when payment is successful",
    },
    {
      name: "Subscription Expiring",
      subject: "Your VenGrow Subscription is Expiring Soon",
      body: `<h1>Subscription Expiring Soon</h1>
<p>Hi {{sellerName}},</p>
<p>Your <strong>{{packageName}}</strong> subscription will expire on {{expiryDate}}.</p>
<p>To continue listing properties and receiving inquiries, please renew your subscription.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "packageName", "expiryDate"],
      triggerEvent: "subscription_expiring" as const,
      isActive: true,
      description: "Sent when subscription is about to expire",
    },
  ];

  await db.insert(emailTemplates).values(templateData);
  console.log(`Inserted ${templateData.length} email templates`);
}

async function seedStaticPages() {
  console.log("Seeding static pages...");
  
  const existingPages = await db.select().from(staticPages);
  if (existingPages.length > 0) {
    console.log("Static pages already exist, skipping...");
    return;
  }

  const pagesData = [
    {
      slug: "about",
      title: "About VenGrow",
      content: `<h2>Our Mission</h2>
<p>VenGrow is India's trusted verified property marketplace, connecting property buyers and sellers through a transparent, secure, and efficient platform.</p>
<h2>What We Do</h2>
<p>We verify every seller and listing to ensure you get authentic property information. Our platform serves:</p>
<ul>
  <li><strong>Buyers:</strong> Access thousands of verified properties with detailed information, photos, and direct seller contact.</li>
  <li><strong>Individual Sellers:</strong> List your property easily and connect with genuine buyers.</li>
  <li><strong>Brokers:</strong> Professional tools to manage multiple listings and clients.</li>
  <li><strong>Builders:</strong> Showcase your projects with premium branding options.</li>
</ul>
<h2>Our Promise</h2>
<p>Every listing on VenGrow goes through our approval process. We verify property documents, seller credentials, and ensure pricing transparency.</p>`,
      metaTitle: "About VenGrow - India's Trusted Property Marketplace",
      metaDescription: "Learn about VenGrow, India's verified property marketplace connecting buyers with trusted sellers for apartments, villas, plots, and commercial properties.",
      isPublished: true,
    },
    {
      slug: "terms",
      title: "Terms of Service",
      content: `<h2>1. Acceptance of Terms</h2>
<p>By accessing and using VenGrow, you agree to be bound by these Terms of Service and all applicable laws and regulations.</p>
<h2>2. User Accounts</h2>
<p>You are responsible for maintaining the confidentiality of your account credentials. You must provide accurate information during registration.</p>
<h2>3. Listing Guidelines</h2>
<p>All property listings must be accurate and genuine. Sellers must have the legal right to sell or rent the property. Misleading information will result in account suspension.</p>
<h2>4. Payment Terms</h2>
<p>Seller packages are non-transferable. Refunds are available within 7 days of purchase if no listings have been created.</p>
<h2>5. Prohibited Activities</h2>
<p>Users may not: post fraudulent listings, harass other users, scrape our platform, or use automated tools without permission.</p>
<h2>6. Limitation of Liability</h2>
<p>VenGrow is a platform connecting buyers and sellers. We do not guarantee any transaction outcomes or property conditions.</p>`,
      metaTitle: "Terms of Service - VenGrow",
      metaDescription: "Read VenGrow's terms of service covering user accounts, listing guidelines, payment terms, and platform usage policies.",
      isPublished: true,
    },
    {
      slug: "privacy",
      title: "Privacy Policy",
      content: `<h2>Information We Collect</h2>
<p>We collect information you provide: name, email, phone number, and property details for listings.</p>
<h2>How We Use Your Information</h2>
<ul>
  <li>To provide and improve our services</li>
  <li>To process transactions and send notifications</li>
  <li>To connect buyers with sellers</li>
  <li>To verify seller credentials</li>
</ul>
<h2>Information Sharing</h2>
<p>We share contact information between buyers and sellers for property inquiries. We do not sell your personal data to third parties.</p>
<h2>Data Security</h2>
<p>We use industry-standard security measures including encryption and secure payment processing through Razorpay.</p>
<h2>Your Rights</h2>
<p>You can access, update, or delete your account data at any time through your profile settings.</p>`,
      metaTitle: "Privacy Policy - VenGrow",
      metaDescription: "VenGrow's privacy policy explains how we collect, use, and protect your personal information on our property marketplace.",
      isPublished: true,
    },
    {
      slug: "refund-policy",
      title: "Refund Policy",
      content: `<h2>7-Day Money Back Guarantee</h2>
<p>We offer a full refund within 7 days of purchase if you're not satisfied with our service.</p>
<h2>Eligibility</h2>
<p>To be eligible for a refund:</p>
<ul>
  <li>Request must be within 7 days of purchase</li>
  <li>No property listings should have been created</li>
  <li>Account must be in good standing</li>
</ul>
<h2>How to Request a Refund</h2>
<p>Contact our support team at support@vengrow.com with your order details. Refunds are processed within 5-7 business days.</p>
<h2>Non-Refundable</h2>
<p>Refunds are not available after 7 days or if listings have been created and published.</p>`,
      metaTitle: "Refund Policy - VenGrow",
      metaDescription: "Learn about VenGrow's 7-day money back guarantee and refund policy for seller packages.",
      isPublished: true,
    },
    {
      slug: "contact",
      title: "Contact Us",
      content: `<h2>Get in Touch</h2>
<p>We're here to help you with any questions about our platform.</p>
<h2>Support</h2>
<p>Email: support@vengrow.com<br>Phone: +91 98765 43210<br>Hours: Mon-Sat, 9 AM - 6 PM IST</p>
<h2>Business Inquiries</h2>
<p>For partnerships and enterprise solutions: business@vengrow.com</p>
<h2>Office Address</h2>
<p>VenGrow Technologies Pvt. Ltd.<br>123 Tech Park, Sector 5<br>Gurugram, Haryana 122001<br>India</p>`,
      metaTitle: "Contact VenGrow - Customer Support",
      metaDescription: "Contact VenGrow's support team for help with property listings, payments, or any questions about our marketplace.",
      isPublished: true,
    },
  ];

  await db.insert(staticPages).values(pagesData);
  console.log(`Inserted ${pagesData.length} static pages`);
}

async function seedBanners() {
  console.log("Seeding banners...");
  
  const existingBanners = await db.select().from(banners);
  if (existingBanners.length > 0) {
    console.log("Banners already exist, skipping...");
    return;
  }

  const bannerData = [
    {
      name: "Hero Banner",
      title: "Find Your Dream Property in India",
      subtitle: "India's trusted verified property marketplace. Browse 10,000+ verified listings across apartments, villas, plots, and commercial spaces.",
      ctaText: "Start Searching",
      ctaLink: "/listings",
      position: "hero",
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Seller CTA",
      title: "List Your Property",
      subtitle: "Reach thousands of verified buyers. Get started with our seller packages from just ₹999.",
      ctaText: "Become a Seller",
      ctaLink: "/seller/type",
      position: "homepage_cta",
      sortOrder: 2,
      isActive: true,
    },
  ];

  await db.insert(banners).values(bannerData);
  console.log(`Inserted ${bannerData.length} banners`);
}

export async function seedAllContent() {
  console.log("Starting content seeding...\n");
  
  try {
    await seedPackages();
    await seedFaqItems();
    await seedPlatformSettings();
    await seedEmailTemplates();
    await seedStaticPages();
    await seedBanners();
    
    console.log("\nContent seeding completed successfully!");
  } catch (error) {
    console.error("Error seeding content:", error);
    throw error;
  }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedAllContent()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
