import { db } from "./db";
import { packages, faqItems } from "@shared/schema";

export async function seedPackages() {
  console.log("Seeding packages...");
  
  // Delete all existing packages to ensure fresh start with new structure
  await db.delete(packages);
  console.log("Deleted existing packages...");

  const packageData = [
    // Individual Packages
    {
      name: "Individual Basic",
      description: "Get started with basic features for individual property owners",
      sellerType: "individual" as const,
      planTier: "Basic",
      price: 0,
      duration: 30,
      listingLimit: 3,
      featuredListings: 0,
      features: [
        "3 property listings",
        "30 days listing duration",
        "Standard placement in search results",
        "Basic property analytics",
        "Email support",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Individual Pro",
      description: "Perfect for individual sellers who want more listings",
      sellerType: "individual" as const,
      planTier: "Pro",
      price: 99,
      duration: 60,
      listingLimit: 5,
      featuredListings: 1,
      features: [
        "5 property listings",
        "60 days listing duration",
        "1 featured listing",
        "Priority placement in search results",
        "Advanced property analytics",
        "Email & chat support",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Individual Premium",
      description: "Best value for serious individual sellers",
      sellerType: "individual" as const,
      planTier: "Premium",
      price: 999,
      duration: 90,
      listingLimit: 10,
      featuredListings: 2,
      features: [
        "10 property listings",
        "90 days listing duration",
        "2 featured listings",
        "Top placement in search results",
        "Full analytics dashboard",
        "Priority email & chat support",
        "Property photos (up to 20 per listing)",
      ],
      isPopular: false,
      isActive: true,
    },
    // Channel Partner / Broker Packages
    {
      name: "Channel Partner Basic",
      description: "Get started with basic broker features",
      sellerType: "broker" as const,
      planTier: "Basic",
      price: 0,
      duration: 180,
      listingLimit: 50,
      featuredListings: 0,
      features: [
        "50 property listings",
        "180 days listing duration",
        "Standard placement in search results",
        "Basic property analytics",
        "Email support",
        "Professional broker badge",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Channel Partner Pro",
      description: "Perfect for active brokers and channel partners",
      sellerType: "broker" as const,
      planTier: "Pro",
      price: 4999,
      duration: 365,
      listingLimit: 250,
      featuredListings: 50,
      features: [
        "250 property listings",
        "365 days listing duration",
        "50 featured listings",
        "Priority placement in search results",
        "Advanced analytics dashboard",
        "Priority email & chat support",
        "Professional broker badge",
        "RERA verification",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Channel Partner Premium",
      description: "Ultimate package for established brokers and channel partners",
      sellerType: "broker" as const,
      planTier: "Premium",
      price: 9999,
      duration: 365,
      listingLimit: 500,
      featuredListings: 100,
      features: [
        "500 property listings",
        "365 days listing duration",
        "100 featured listings",
        "Top placement in search results",
        "Full analytics suite",
        "24/7 priority support",
        "Premium broker badge",
        "RERA verification",
        "Advanced listing tools",
      ],
      isPopular: false,
      isActive: true,
    },
    // Builder / Corporate Packages
    {
      name: "Builder Basic",
      description: "Get started with basic builder features",
      sellerType: "builder" as const,
      planTier: "Basic",
      price: 0,
      duration: 180,
      listingLimit: 10,
      featuredListings: 0,
      features: [
        "10 property listings",
        "180 days listing duration",
        "Standard placement in search results",
        "Basic property analytics",
        "Email support",
        "Company logo display",
      ],
      isPopular: false,
      isActive: true,
    },
    {
      name: "Builder Pro",
      description: "Perfect for growing builders and developers",
      sellerType: "builder" as const,
      planTier: "Pro",
      price: 9999,
      duration: 365,
      listingLimit: 50,
      featuredListings: 10,
      features: [
        "50 property listings",
        "365 days listing duration",
        "10 featured listings",
        "Priority placement in search results",
        "Advanced analytics dashboard",
        "Priority email & chat support",
        "Company logo & branding display",
        "Upload company brochures (PDF)",
        "Verified Builder badge",
      ],
      isPopular: true,
      isActive: true,
    },
    {
      name: "Builder Premium",
      description: "Ultimate package for established builders and developers",
      sellerType: "builder" as const,
      planTier: "Premium",
      price: 19999,
      duration: 365,
      listingLimit: 150,
      featuredListings: 20,
      features: [
        "150 property listings",
        "365 days listing duration",
        "20 featured listings",
        "Top placement in search results",
        "Full analytics suite",
        "24/7 priority support",
        "Company logo & branding display",
        "Upload company brochures (PDF)",
        "Premium Verified Builder badge",
        "Bulk listing capabilities",
        "Featured on homepage",
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
    {
      question: "How do I list my property?",
      answer: "To list your property, sign up as a seller, complete your profile verification, choose a subscription package, and then create a new listing with all the property details.",
      category: "sellers",
      sortOrder: 1,
      isActive: true,
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit/debit cards, UPI, net banking, and digital wallets through our secure payment gateway.",
      category: "payments",
      sortOrder: 1,
      isActive: true,
    },
    {
      question: "How long does property verification take?",
      answer: "Property verification typically takes 24-48 hours after submission. You will be notified via email once your property is verified.",
      category: "listings",
      sortOrder: 1,
      isActive: true,
    },
  ];

  await db.insert(faqItems).values(faqData);
  console.log(`Inserted ${faqData.length} FAQ items`);
}

export async function seedCMSContent() {
  try {
    await seedPackages();
    await seedFaqItems();
  } catch (error) {
    console.error("Error seeding CMS content:", error);
    throw error;
  }
}