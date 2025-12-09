import { db } from "./db";
import { packages, faqItems, staticPages, banners, platformSettings, emailTemplates, popularCities, navigationLinks, propertyTypesManaged, siteSettings, propertyCategories, propertySubcategories } from "@shared/schema";
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
    {
      name: "Email Verification",
      subject: "Verify Your Email Address - VenGrow",
      body: `<h1>Verify Your Email</h1>
<p>Hi {{firstName}},</p>
<p>Please verify your email address by clicking the link below:</p>
<p><a href="{{verificationLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Verify Email</a></p>
<p>Or copy this link: {{verificationLink}}</p>
<p>This link expires in 24 hours.</p>
<p>If you didn't create an account, you can ignore this email.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName", "verificationLink"],
      triggerEvent: "email_verification" as const,
      isActive: true,
      description: "Sent when a user needs to verify their email address",
    },
    {
      name: "Password Reset",
      subject: "Reset Your Password - VenGrow",
      body: `<h1>Password Reset Request</h1>
<p>Hi {{firstName}},</p>
<p>We received a request to reset your password. Click the button below to create a new password:</p>
<p><a href="{{resetLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a></p>
<p>Or copy this link: {{resetLink}}</p>
<p>This link expires in 1 hour.</p>
<p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName", "resetLink"],
      triggerEvent: "password_reset" as const,
      isActive: true,
      description: "Sent when a user requests a password reset",
    },
    {
      name: "Password Changed",
      subject: "Your Password Has Been Changed - VenGrow",
      body: `<h1>Password Changed Successfully</h1>
<p>Hi {{firstName}},</p>
<p>Your VenGrow account password was changed on {{changeDate}} at {{changeTime}}.</p>
<p>If you made this change, no action is needed.</p>
<p>If you didn't change your password, please reset it immediately and contact our support team.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName", "changeDate", "changeTime"],
      triggerEvent: "password_changed" as const,
      isActive: true,
      description: "Sent when a user's password is changed",
    },
    {
      name: "Inquiry Response",
      subject: "Response to Your Inquiry - {{propertyTitle}}",
      body: `<h1>Seller Has Responded!</h1>
<p>Hi {{buyerName}},</p>
<p>The seller has responded to your inquiry about <strong>{{propertyTitle}}</strong>.</p>
<h3>Seller's Response:</h3>
<p>{{response}}</p>
<p>You can continue the conversation from your dashboard or reply directly to the seller.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["buyerName", "propertyTitle", "response", "sellerName"],
      triggerEvent: "inquiry_response" as const,
      isActive: true,
      description: "Sent to buyer when seller responds to their inquiry",
    },
    {
      name: "New Message",
      subject: "New Message from {{senderName}} - VenGrow",
      body: `<h1>You Have a New Message</h1>
<p>Hi {{recipientName}},</p>
<p><strong>{{senderName}}</strong> sent you a message regarding <strong>{{propertyTitle}}</strong>:</p>
<div style="background-color: #f5f5f5; padding: 16px; border-radius: 8px; margin: 16px 0;">
  <p>{{messagePreview}}</p>
</div>
<p><a href="{{chatLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Conversation</a></p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["recipientName", "senderName", "propertyTitle", "messagePreview", "chatLink"],
      triggerEvent: "new_message" as const,
      isActive: true,
      description: "Sent when a new chat message is received",
    },
    {
      name: "Property Needs Reapproval",
      subject: "Your Updated Property Needs Reapproval - {{propertyTitle}}",
      body: `<h1>Reapproval Required</h1>
<p>Hi {{sellerName}},</p>
<p>Your property <strong>{{propertyTitle}}</strong> has been updated and needs to be reapproved before it can go live again.</p>
<p>Our team will review your changes within 24-48 hours.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "propertyTitle"],
      triggerEvent: "property_needs_reapproval" as const,
      isActive: true,
      description: "Sent when an edited property needs reapproval",
    },
    {
      name: "Property Live",
      subject: "Your Property is Now Live! - {{propertyTitle}}",
      body: `<h1>Your Property is Live!</h1>
<p>Hi {{sellerName}},</p>
<p>Great news! Your property <strong>{{propertyTitle}}</strong> is now live and visible to buyers on VenGrow.</p>
<p>View your live listing: <a href="{{propertyLink}}">{{propertyLink}}</a></p>
<p>Share it on social media to attract more buyers!</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "propertyTitle", "propertyLink"],
      triggerEvent: "property_live" as const,
      isActive: true,
      description: "Sent when a property goes live",
    },
    {
      name: "Seller Approved",
      subject: "Your Seller Account is Approved! - VenGrow",
      body: `<h1>Welcome, Verified Seller!</h1>
<p>Hi {{sellerName}},</p>
<p>Congratulations! Your seller account has been verified and approved.</p>
<p>You can now:</p>
<ul>
  <li>List properties on VenGrow</li>
  <li>Receive inquiries from buyers</li>
  <li>Access your seller dashboard</li>
</ul>
<p><a href="{{dashboardLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Go to Dashboard</a></p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "dashboardLink"],
      triggerEvent: "seller_approved" as const,
      isActive: true,
      description: "Sent when a seller account is approved",
    },
    {
      name: "Seller Rejected",
      subject: "Action Required - Seller Verification Update",
      body: `<h1>Verification Update</h1>
<p>Hi {{sellerName}},</p>
<p>Your seller verification could not be completed at this time.</p>
<h3>Reason:</h3>
<p>{{rejectionReason}}</p>
<p>Please update your documents and resubmit for verification.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "rejectionReason"],
      triggerEvent: "seller_rejected" as const,
      isActive: true,
      description: "Sent when seller verification is rejected",
    },
    {
      name: "Seller Verification Pending",
      subject: "Your Verification is Being Reviewed - VenGrow",
      body: `<h1>Verification Under Review</h1>
<p>Hi {{sellerName}},</p>
<p>Thank you for submitting your documents. Your seller verification is now under review.</p>
<p>Our team will verify your details within 1-2 business days. You will receive an email once the verification is complete.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName"],
      triggerEvent: "seller_verification_pending" as const,
      isActive: true,
      description: "Sent when seller documents are submitted for verification",
    },
    {
      name: "Payment Failed",
      subject: "Payment Failed - Action Required",
      body: `<h1>Payment Failed</h1>
<p>Hi {{sellerName}},</p>
<p>We were unable to process your payment of ₹{{amount}} for the <strong>{{packageName}}</strong> package.</p>
<h3>Error Details:</h3>
<p>{{errorMessage}}</p>
<p>Please try again with a different payment method or contact your bank if the issue persists.</p>
<p><a href="{{retryLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Retry Payment</a></p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "amount", "packageName", "errorMessage", "retryLink"],
      triggerEvent: "payment_failed" as const,
      isActive: true,
      description: "Sent when a payment fails",
    },
    {
      name: "Subscription Activated",
      subject: "Your {{packageName}} Subscription is Active! - VenGrow",
      body: `<h1>Subscription Activated!</h1>
<p>Hi {{sellerName}},</p>
<p>Your <strong>{{packageName}}</strong> subscription is now active!</p>
<h3>Subscription Details:</h3>
<ul>
  <li>Package: {{packageName}}</li>
  <li>Listings: {{listingLimit}} properties</li>
  <li>Valid Until: {{validUntil}}</li>
</ul>
<p>Start listing your properties now!</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "packageName", "listingLimit", "validUntil"],
      triggerEvent: "subscription_activated" as const,
      isActive: true,
      description: "Sent when a subscription is activated",
    },
    {
      name: "Subscription Expired",
      subject: "Your VenGrow Subscription Has Expired",
      body: `<h1>Subscription Expired</h1>
<p>Hi {{sellerName}},</p>
<p>Your <strong>{{packageName}}</strong> subscription has expired.</p>
<p>Your active listings have been unpublished. Renew your subscription to make them visible again.</p>
<p><a href="{{renewLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Renew Now</a></p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["sellerName", "packageName", "renewLink"],
      triggerEvent: "subscription_expired" as const,
      isActive: true,
      description: "Sent when a subscription expires",
    },
    {
      name: "Account Deactivated",
      subject: "Your VenGrow Account Has Been Deactivated",
      body: `<h1>Account Deactivated</h1>
<p>Hi {{firstName}},</p>
<p>Your VenGrow account has been deactivated.</p>
<p>If you believe this was done in error, please contact our support team.</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName"],
      triggerEvent: "account_deactivated" as const,
      isActive: true,
      description: "Sent when an account is deactivated",
    },
    {
      name: "Account Reactivated",
      subject: "Welcome Back! Your VenGrow Account is Active",
      body: `<h1>Welcome Back!</h1>
<p>Hi {{firstName}},</p>
<p>Your VenGrow account has been reactivated. You can now login and access all features.</p>
<p><a href="{{loginLink}}" style="background-color: #E86A33; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Login Now</a></p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["firstName", "loginLink"],
      triggerEvent: "account_reactivated" as const,
      isActive: true,
      description: "Sent when an account is reactivated",
    },
    {
      name: "Admin Notification",
      subject: "{{notificationTitle}} - VenGrow Admin",
      body: `<h1>{{notificationTitle}}</h1>
<p>{{notificationBody}}</p>
<p>Best regards,<br>The VenGrow Team</p>`,
      variables: ["notificationTitle", "notificationBody"],
      triggerEvent: "admin_notification" as const,
      isActive: true,
      description: "Generic admin notification template",
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

async function seedPopularCities() {
  console.log("Seeding popular cities...");
  
  const existingCities = await db.select().from(popularCities);
  if (existingCities.length > 0) {
    console.log("Popular cities already exist, skipping...");
    return;
  }

  const citiesData = [
    {
      name: "Mumbai",
      slug: "mumbai",
      state: "Maharashtra",
      propertyCount: 2500,
      searchParams: { city: "Mumbai" },
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Bangalore",
      slug: "bangalore",
      state: "Karnataka",
      propertyCount: 2200,
      searchParams: { city: "Bangalore" },
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Delhi",
      slug: "delhi",
      state: "Delhi",
      propertyCount: 1800,
      searchParams: { city: "Delhi" },
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Pune",
      slug: "pune",
      state: "Maharashtra",
      propertyCount: 1500,
      searchParams: { city: "Pune" },
      sortOrder: 4,
      isActive: true,
    },
    {
      name: "Hyderabad",
      slug: "hyderabad",
      state: "Telangana",
      propertyCount: 1400,
      searchParams: { city: "Hyderabad" },
      sortOrder: 5,
      isActive: true,
    },
    {
      name: "Chennai",
      slug: "chennai",
      state: "Tamil Nadu",
      propertyCount: 1200,
      searchParams: { city: "Chennai" },
      sortOrder: 6,
      isActive: true,
    },
    {
      name: "Kolkata",
      slug: "kolkata",
      state: "West Bengal",
      propertyCount: 900,
      searchParams: { city: "Kolkata" },
      sortOrder: 7,
      isActive: true,
    },
    {
      name: "Ahmedabad",
      slug: "ahmedabad",
      state: "Gujarat",
      propertyCount: 800,
      searchParams: { city: "Ahmedabad" },
      sortOrder: 8,
      isActive: true,
    },
  ];

  await db.insert(popularCities).values(citiesData);
  console.log(`Inserted ${citiesData.length} popular cities`);
}

async function seedNavigationLinks() {
  console.log("Seeding navigation links...");
  
  const existingLinks = await db.select().from(navigationLinks);
  if (existingLinks.length > 0) {
    console.log("Navigation links already exist, skipping...");
    return;
  }

  const linksData = [
    // Footer - Quick Links
    {
      label: "About Us",
      url: "/about",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "internal" as const,
      sortOrder: 1,
      isActive: true,
    },
    {
      label: "How It Works",
      url: "/how-it-works",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "internal" as const,
      sortOrder: 2,
      isActive: true,
    },
    {
      label: "Pricing",
      url: "/packages",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "internal" as const,
      sortOrder: 3,
      isActive: true,
    },
    {
      label: "FAQ",
      url: "/faq",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "internal" as const,
      sortOrder: 4,
      isActive: true,
    },
    // Footer - For Sellers
    {
      label: "Become a Seller",
      url: "/seller/type",
      position: "footer" as const,
      section: "for_sellers" as const,
      linkType: "internal" as const,
      sortOrder: 1,
      isActive: true,
    },
    {
      label: "View Packages",
      url: "/packages",
      position: "footer" as const,
      section: "for_sellers" as const,
      linkType: "internal" as const,
      sortOrder: 2,
      isActive: true,
    },
    {
      label: "Seller Guide",
      url: "/sell-faster-guide",
      position: "footer" as const,
      section: "for_sellers" as const,
      linkType: "internal" as const,
      sortOrder: 3,
      isActive: true,
    },
    {
      label: "Contact Support",
      url: "/contact",
      position: "footer" as const,
      section: "for_sellers" as const,
      linkType: "internal" as const,
      sortOrder: 4,
      isActive: true,
    },
    // Footer - Legal
    {
      label: "Privacy Policy",
      url: "/privacy",
      position: "footer" as const,
      section: "legal" as const,
      linkType: "internal" as const,
      sortOrder: 1,
      isActive: true,
    },
    {
      label: "Terms of Service",
      url: "/terms",
      position: "footer" as const,
      section: "legal" as const,
      linkType: "internal" as const,
      sortOrder: 2,
      isActive: true,
    },
    {
      label: "Refund Policy",
      url: "/refund",
      position: "footer" as const,
      section: "legal" as const,
      linkType: "internal" as const,
      sortOrder: 3,
      isActive: true,
    },
    // Header - Main Navigation
    {
      label: "Browse Properties",
      url: "/listings",
      position: "header" as const,
      section: "main" as const,
      linkType: "internal" as const,
      sortOrder: 1,
      isActive: true,
    },
    // SEO City Pages
    {
      label: "Properties in Mumbai",
      url: "/properties/mumbai",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "search_filter" as const,
      searchParams: { city: "Mumbai" },
      sortOrder: 10,
      isActive: true,
    },
    {
      label: "Properties in Bangalore",
      url: "/properties/bangalore",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "search_filter" as const,
      searchParams: { city: "Bangalore" },
      sortOrder: 11,
      isActive: true,
    },
    {
      label: "Properties in Delhi",
      url: "/properties/delhi",
      position: "footer" as const,
      section: "quick_links" as const,
      linkType: "search_filter" as const,
      searchParams: { city: "Delhi" },
      sortOrder: 12,
      isActive: true,
    },
  ];

  await db.insert(navigationLinks).values(linksData);
  console.log(`Inserted ${linksData.length} navigation links`);
}

async function seedPropertyTypesManaged() {
  console.log("Seeding property types...");
  
  const existingTypes = await db.select().from(propertyTypesManaged);
  if (existingTypes.length > 0) {
    console.log("Property types already exist, skipping...");
    return;
  }

  const typesData = [
    {
      name: "All Types",
      slug: "all",
      icon: "Building2",
      description: "Browse all property types",
      sortOrder: 0,
      isActive: true,
    },
    {
      name: "Apartment",
      slug: "apartment",
      icon: "Building2",
      description: "Flats and apartments in residential buildings",
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Villa",
      slug: "villa",
      icon: "Home",
      description: "Independent houses and bungalows",
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Plot/Land",
      slug: "plot",
      icon: "LandPlot",
      description: "Residential and agricultural plots",
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Commercial",
      slug: "commercial",
      icon: "Building",
      description: "Offices, shops, and commercial spaces",
      sortOrder: 4,
      isActive: true,
    },
    {
      name: "Farmhouse",
      slug: "farmhouse",
      icon: "Warehouse",
      description: "Farm houses and agricultural properties",
      sortOrder: 5,
      isActive: true,
    },
    {
      name: "Penthouse",
      slug: "penthouse",
      icon: "Castle",
      description: "Luxury penthouses and duplexes",
      sortOrder: 6,
      isActive: true,
    },
  ];

  await db.insert(propertyTypesManaged).values(typesData);
  console.log(`Inserted ${typesData.length} property types`);
}

async function seedSiteSettings() {
  console.log("Seeding site settings...");
  
  const existingSettings = await db.select().from(siteSettings);
  if (existingSettings.length > 0) {
    console.log("Site settings already exist, skipping...");
    return;
  }

  const settingsData = [
    // Brand
    {
      key: "site_name",
      value: "VenGrow",
      type: "text",
      category: "brand",
      label: "Site Name",
      description: "The name of your website",
    },
    {
      key: "site_tagline",
      value: "India's Trusted Verified Property Marketplace",
      type: "text",
      category: "brand",
      label: "Site Tagline",
      description: "A short description that appears below the site name",
    },
    {
      key: "site_description",
      value: "Find your dream property with verified sellers and transparent pricing.",
      type: "textarea",
      category: "brand",
      label: "Site Description",
      description: "Used in footer and meta tags",
    },
    // Contact
    {
      key: "contact_email",
      value: "support@vengrow.in",
      type: "email",
      category: "contact",
      label: "Support Email",
      description: "Primary contact email",
    },
    {
      key: "contact_phone",
      value: "+91 1800-123-4567",
      type: "text",
      category: "contact",
      label: "Support Phone",
      description: "Primary contact phone number",
    },
    {
      key: "contact_address",
      value: "Mumbai, Maharashtra, India",
      type: "textarea",
      category: "contact",
      label: "Office Address",
      description: "Physical office address",
    },
    // Social Media
    {
      key: "social_facebook",
      value: "https://facebook.com/vengrow",
      type: "url",
      category: "social",
      label: "Facebook URL",
      description: "Facebook page URL",
    },
    {
      key: "social_twitter",
      value: "https://twitter.com/vengrow",
      type: "url",
      category: "social",
      label: "Twitter URL",
      description: "Twitter/X profile URL",
    },
    {
      key: "social_instagram",
      value: "https://instagram.com/vengrow",
      type: "url",
      category: "social",
      label: "Instagram URL",
      description: "Instagram profile URL",
    },
    {
      key: "social_linkedin",
      value: "https://linkedin.com/company/vengrow",
      type: "url",
      category: "social",
      label: "LinkedIn URL",
      description: "LinkedIn company page URL",
    },
    // SEO
    {
      key: "meta_title_suffix",
      value: " | VenGrow - Property Marketplace",
      type: "text",
      category: "seo",
      label: "Meta Title Suffix",
      description: "Appended to all page titles",
    },
    {
      key: "default_meta_description",
      value: "VenGrow is India's trusted verified property marketplace. Browse apartments, villas, plots, and commercial spaces from verified sellers.",
      type: "textarea",
      category: "seo",
      label: "Default Meta Description",
      description: "Used when page doesn't have a specific description",
    },
  ];

  await db.insert(siteSettings).values(settingsData);
  console.log(`Inserted ${settingsData.length} site settings`);
}

async function seedPropertyCategories() {
  console.log("Seeding property categories...");
  
  const existingCategories = await db.select().from(propertyCategories);
  if (existingCategories.length > 0) {
    console.log("Property categories already exist, skipping...");
    return;
  }

  const categoriesData = [
    {
      name: "Apartments",
      slug: "apartments",
      icon: "Building2",
      description: "Apartments, flats, and studio units",
      allowedTransactionTypes: ["sale", "rent", "lease"],
      hasProjectStage: true,
      sortOrder: 1,
      isActive: true,
    },
    {
      name: "Villas",
      slug: "villas",
      icon: "Home",
      description: "Independent villas and row houses",
      allowedTransactionTypes: ["sale", "rent", "lease"],
      hasProjectStage: true,
      sortOrder: 2,
      isActive: true,
    },
    {
      name: "Plots",
      slug: "plots",
      icon: "Map",
      description: "Residential and commercial plots",
      allowedTransactionTypes: ["sale"],
      hasProjectStage: false,
      sortOrder: 3,
      isActive: true,
    },
    {
      name: "Independent House",
      slug: "independent-house",
      icon: "House",
      description: "Independent houses and bungalows",
      allowedTransactionTypes: ["sale", "rent", "lease"],
      hasProjectStage: true,
      sortOrder: 4,
      isActive: true,
    },
    {
      name: "New Projects",
      slug: "new-projects",
      icon: "Building",
      description: "New construction projects",
      allowedTransactionTypes: ["sale"],
      hasProjectStage: true,
      sortOrder: 5,
      isActive: true,
    },
    {
      name: "Ultra Luxury",
      slug: "ultra-luxury",
      icon: "Crown",
      description: "Premium luxury properties",
      allowedTransactionTypes: ["sale", "rent", "lease"],
      hasProjectStage: true,
      sortOrder: 6,
      isActive: true,
    },
    {
      name: "Commercial",
      slug: "commercial",
      icon: "Briefcase",
      description: "Office spaces, retail, and warehouses",
      allowedTransactionTypes: ["sale", "rent", "lease"],
      hasProjectStage: true,
      sortOrder: 7,
      isActive: true,
    },
    {
      name: "Joint Venture",
      slug: "joint-venture",
      icon: "Handshake",
      description: "Joint development opportunities",
      allowedTransactionTypes: ["sale"],
      hasProjectStage: false,
      sortOrder: 8,
      isActive: true,
    },
    {
      name: "PG",
      slug: "pg",
      icon: "Users",
      description: "Paying guest and co-living spaces",
      allowedTransactionTypes: ["rent"],
      hasProjectStage: false,
      sortOrder: 9,
      isActive: true,
    },
    {
      name: "Farm Land",
      slug: "farm-land",
      icon: "Trees",
      description: "Agricultural and plantation land",
      allowedTransactionTypes: ["sale"],
      hasProjectStage: false,
      sortOrder: 10,
      isActive: true,
    },
    {
      name: "Rush Deal",
      slug: "rush-deal",
      icon: "Zap",
      description: "Time-sensitive property deals",
      allowedTransactionTypes: ["sale", "rent"],
      hasProjectStage: false,
      sortOrder: 11,
      isActive: true,
    },
  ];

  const insertedCategories = await db.insert(propertyCategories).values(categoriesData).returning();
  console.log(`Inserted ${insertedCategories.length} property categories`);

  // Create a map of category slugs to IDs
  const categoryMap: Record<string, string> = {};
  insertedCategories.forEach(cat => {
    categoryMap[cat.slug] = cat.id;
  });

  // Seed subcategories
  const subcategoriesData = [
    // Apartments subcategories
    { categoryId: categoryMap["apartments"], name: "Apartments / Flats", slug: "apartments-flats", sortOrder: 1 },
    { categoryId: categoryMap["apartments"], name: "Studio Apartments", slug: "studio-apartments", sortOrder: 2 },
    { categoryId: categoryMap["apartments"], name: "Duplex", slug: "duplex", sortOrder: 3 },
    { categoryId: categoryMap["apartments"], name: "Triplex", slug: "triplex", sortOrder: 4 },
    { categoryId: categoryMap["apartments"], name: "Penthouse", slug: "penthouse", sortOrder: 5 },
    { categoryId: categoryMap["apartments"], name: "Service Apartments", slug: "service-apartments", sortOrder: 6 },

    // Villas subcategories
    { categoryId: categoryMap["villas"], name: "Row Houses", slug: "row-houses", sortOrder: 1 },
    { categoryId: categoryMap["villas"], name: "Individual Villa", slug: "individual-villa", sortOrder: 2 },

    // Plots subcategories
    { categoryId: categoryMap["plots"], name: "Gated Community Plot", slug: "gated-community-plot", sortOrder: 1 },
    { categoryId: categoryMap["plots"], name: "Layout Plot", slug: "layout-plot", sortOrder: 2 },
    { categoryId: categoryMap["plots"], name: "Independent Plot", slug: "independent-plot", sortOrder: 3 },
    { categoryId: categoryMap["plots"], name: "Commercial Plot", slug: "commercial-plot", sortOrder: 4 },
    { categoryId: categoryMap["plots"], name: "Industrial Plot", slug: "industrial-plot", sortOrder: 5 },

    // Independent House subcategories
    { categoryId: categoryMap["independent-house"], name: "Single Floor House", slug: "single-floor-house", sortOrder: 1 },
    { categoryId: categoryMap["independent-house"], name: "Duplex House (G+1)", slug: "duplex-house", sortOrder: 2 },
    { categoryId: categoryMap["independent-house"], name: "Multi-Storey Independent House", slug: "multi-storey-house", sortOrder: 3 },
    { categoryId: categoryMap["independent-house"], name: "Rental Yield House", slug: "rental-yield-house", sortOrder: 4 },

    // New Projects subcategories
    { categoryId: categoryMap["new-projects"], name: "Apartment Projects", slug: "apartment-projects", sortOrder: 1 },
    { categoryId: categoryMap["new-projects"], name: "Villa Projects", slug: "villa-projects", sortOrder: 2 },
    { categoryId: categoryMap["new-projects"], name: "Plotted Development", slug: "plotted-development", sortOrder: 3 },

    // Ultra Luxury subcategories
    { categoryId: categoryMap["ultra-luxury"], name: "Ultra Luxury Villas", slug: "ultra-luxury-villas", sortOrder: 1 },
    { categoryId: categoryMap["ultra-luxury"], name: "Luxury Penthouses", slug: "luxury-penthouses", sortOrder: 2 },
    { categoryId: categoryMap["ultra-luxury"], name: "Signature Apartments", slug: "signature-apartments", sortOrder: 3 },
    { categoryId: categoryMap["ultra-luxury"], name: "Independent Bungalow", slug: "independent-bungalow", sortOrder: 4 },
    { categoryId: categoryMap["ultra-luxury"], name: "Estate Homes", slug: "estate-homes", sortOrder: 5 },

    // Commercial subcategories (Sale)
    { categoryId: categoryMap["commercial"], name: "Commercial Building", slug: "commercial-building", applicableFor: ["sale"], sortOrder: 1 },
    { categoryId: categoryMap["commercial"], name: "Office Space", slug: "office-space", applicableFor: ["sale", "rent", "lease"], sortOrder: 2 },
    { categoryId: categoryMap["commercial"], name: "Retail Shops", slug: "retail-shops", applicableFor: ["sale", "rent", "lease"], sortOrder: 3 },
    { categoryId: categoryMap["commercial"], name: "Showrooms", slug: "showrooms", applicableFor: ["sale", "rent", "lease"], sortOrder: 4 },
    { categoryId: categoryMap["commercial"], name: "Warehouse", slug: "warehouse", applicableFor: ["sale", "rent", "lease"], sortOrder: 5 },
    { categoryId: categoryMap["commercial"], name: "IT Parks", slug: "it-parks", applicableFor: ["sale", "rent", "lease"], sortOrder: 6 },
    { categoryId: categoryMap["commercial"], name: "Co-working", slug: "co-working", applicableFor: ["rent", "lease"], sortOrder: 7 },
    { categoryId: categoryMap["commercial"], name: "Industrial Sheds", slug: "industrial-sheds", applicableFor: ["rent", "lease"], sortOrder: 8 },
    { categoryId: categoryMap["commercial"], name: "Cloud Kitchens", slug: "cloud-kitchens", applicableFor: ["rent", "lease"], sortOrder: 9 },
    { categoryId: categoryMap["commercial"], name: "Logistics & Cold Storage", slug: "logistics-cold-storage", applicableFor: ["rent", "lease"], sortOrder: 10 },
    { categoryId: categoryMap["commercial"], name: "Plug-and-play IT Offices", slug: "plug-and-play-offices", applicableFor: ["rent", "lease"], sortOrder: 11 },
    { categoryId: categoryMap["commercial"], name: "Clinics", slug: "clinics", applicableFor: ["rent", "lease"], sortOrder: 12 },
    { categoryId: categoryMap["commercial"], name: "Diagnostic Centers", slug: "diagnostic-centers", applicableFor: ["rent", "lease"], sortOrder: 13 },
    { categoryId: categoryMap["commercial"], name: "Day-care Hospitals", slug: "day-care-hospitals", applicableFor: ["rent", "lease"], sortOrder: 14 },
    { categoryId: categoryMap["commercial"], name: "Medical Labs", slug: "medical-labs", applicableFor: ["rent", "lease"], sortOrder: 15 },
    { categoryId: categoryMap["commercial"], name: "Restaurants", slug: "restaurants", applicableFor: ["rent", "lease"], sortOrder: 16 },
    { categoryId: categoryMap["commercial"], name: "Cafés", slug: "cafes", applicableFor: ["rent", "lease"], sortOrder: 17 },
    { categoryId: categoryMap["commercial"], name: "Bars & Lounges", slug: "bars-lounges", applicableFor: ["rent", "lease"], sortOrder: 18 },
    { categoryId: categoryMap["commercial"], name: "Banquet Halls", slug: "banquet-halls", applicableFor: ["rent", "lease"], sortOrder: 19 },
    { categoryId: categoryMap["commercial"], name: "Education Spaces", slug: "education-spaces", applicableFor: ["rent", "lease"], sortOrder: 20 },

    // Joint Venture subcategories
    { categoryId: categoryMap["joint-venture"], name: "Apartment Construction", slug: "jv-apartment", sortOrder: 1 },
    { categoryId: categoryMap["joint-venture"], name: "Plotted Development", slug: "jv-plotted", sortOrder: 2 },
    { categoryId: categoryMap["joint-venture"], name: "Villa Construction", slug: "jv-villa", sortOrder: 3 },
    { categoryId: categoryMap["joint-venture"], name: "Commercial Construction", slug: "jv-commercial", sortOrder: 4 },

    // PG subcategories
    { categoryId: categoryMap["pg"], name: "Men PG", slug: "men-pg", sortOrder: 1 },
    { categoryId: categoryMap["pg"], name: "Women PG", slug: "women-pg", sortOrder: 2 },
    { categoryId: categoryMap["pg"], name: "Co-Living Spaces", slug: "co-living-spaces", sortOrder: 3 },
    { categoryId: categoryMap["pg"], name: "Luxury Co-living", slug: "luxury-co-living", sortOrder: 4 },

    // Farm Land subcategories
    { categoryId: categoryMap["farm-land"], name: "Agricultural", slug: "agricultural-land", sortOrder: 1 },
    { categoryId: categoryMap["farm-land"], name: "Plantation Land", slug: "plantation-land", sortOrder: 2 },
    { categoryId: categoryMap["farm-land"], name: "Managed Farmland", slug: "managed-farmland", sortOrder: 3 },

    // Rush Deal subcategories
    { categoryId: categoryMap["rush-deal"], name: "Apartment", slug: "rush-apartment", sortOrder: 1 },
    { categoryId: categoryMap["rush-deal"], name: "Villa", slug: "rush-villa", sortOrder: 2 },
    { categoryId: categoryMap["rush-deal"], name: "Builder Last-Unit Clearance", slug: "builder-clearance", sortOrder: 3 },
    { categoryId: categoryMap["rush-deal"], name: "Independent House", slug: "rush-independent-house", sortOrder: 4 },
    { categoryId: categoryMap["rush-deal"], name: "Commercial Building", slug: "rush-commercial-building", sortOrder: 5 },
    { categoryId: categoryMap["rush-deal"], name: "Commercial Plot", slug: "rush-commercial-plot", sortOrder: 6 },
    { categoryId: categoryMap["rush-deal"], name: "Residential Plots", slug: "rush-residential-plots", sortOrder: 7 },
  ];

  const validSubcategories = subcategoriesData.map(sub => ({
    ...sub,
    isActive: true,
    applicableFor: sub.applicableFor || ["sale", "rent", "lease"],
  }));

  await db.insert(propertySubcategories).values(validSubcategories);
  console.log(`Inserted ${validSubcategories.length} property subcategories`);
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
    await seedPopularCities();
    await seedNavigationLinks();
    await seedPropertyTypesManaged();
    await seedSiteSettings();
    await seedPropertyCategories();
    
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
