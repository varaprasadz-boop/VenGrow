import { db } from "./db";
import { 
  users, sellerProfiles, packages, properties, propertyImages,
  inquiries, favorites, notifications, chatThreads, chatMessages,
  adminApprovals
} from "@shared/schema";
import { sql } from "drizzle-orm";

export async function seedDatabase() {
  console.log("Starting database seed...");

  try {
    // Clear existing data in reverse dependency order
    await db.delete(chatMessages);
    await db.delete(chatThreads);
    await db.delete(notifications);
    await db.delete(favorites);
    await db.delete(inquiries);
    await db.delete(propertyImages);
    await db.delete(properties);
    await db.delete(adminApprovals);
    await db.delete(sellerProfiles);
    await db.delete(packages);
    await db.delete(users);

    console.log("Cleared existing data...");

    // Seed packages first
    const [basicPkg, premiumPkg, enterprisePkg] = await db.insert(packages).values([
      {
        name: "Basic",
        description: "Perfect for individual property owners",
        price: 999,
        duration: 30,
        listingLimit: 3,
        featuredListings: 0,
        features: ["3 Property Listings", "30 Days Validity", "Basic Analytics", "Email Support"],
        isPopular: false,
        isActive: true,
      },
      {
        name: "Premium",
        description: "Ideal for serious sellers and brokers",
        price: 2499,
        duration: 60,
        listingLimit: 10,
        featuredListings: 2,
        features: ["10 Property Listings", "60 Days Validity", "2 Featured Listings", "Advanced Analytics", "Priority Support", "Verified Badge"],
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
        features: ["50 Property Listings", "90 Days Validity", "10 Featured Listings", "Full Analytics Suite", "Dedicated Account Manager", "Premium Badge", "Bulk Upload"],
        isPopular: false,
        isActive: true,
      },
    ]).returning();

    console.log("Created packages...");

    // Seed users
    const [adminUser, buyerUser1, buyerUser2, sellerUser1, sellerUser2, sellerUser3] = await db.insert(users).values([
      {
        email: "admin@vengrow.com",
        name: "Super Admin",
        phone: "+91 9876543210",
        role: "admin",
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
      {
        email: "rahul.sharma@example.com",
        name: "Rahul Sharma",
        phone: "+91 9876543211",
        role: "buyer",
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: "priya.patel@example.com",
        name: "Priya Patel",
        phone: "+91 9876543212",
        role: "buyer",
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: "amit.kumar@example.com",
        name: "Amit Kumar",
        phone: "+91 9876543213",
        role: "seller",
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
      {
        email: "sunita.devi@example.com",
        name: "Sunita Devi",
        phone: "+91 9876543214",
        role: "seller",
        isActive: true,
        isEmailVerified: true,
      },
      {
        email: "prestige@estates.com",
        name: "Prestige Estates",
        phone: "+91 9876543215",
        role: "seller",
        isActive: true,
        isEmailVerified: true,
        isPhoneVerified: true,
      },
    ]).returning();

    console.log("Created users...");

    // Seed seller profiles
    const [sellerProfile1, sellerProfile2, sellerProfile3] = await db.insert(sellerProfiles).values([
      {
        userId: sellerUser1.id,
        sellerType: "individual",
        companyName: null,
        reraNumber: "RERA123456",
        city: "Mumbai",
        state: "Maharashtra",
        verificationStatus: "verified",
        description: "Individual property owner with premium apartments in Mumbai",
        totalListings: 2,
        rating: "4.5",
        reviewCount: 12,
      },
      {
        userId: sellerUser2.id,
        sellerType: "broker",
        companyName: "Sunita Real Estate",
        reraNumber: "RERA789012",
        city: "Bangalore",
        state: "Karnataka",
        verificationStatus: "verified",
        description: "Experienced real estate broker specializing in Bangalore properties",
        totalListings: 5,
        rating: "4.2",
        reviewCount: 28,
      },
      {
        userId: sellerUser3.id,
        sellerType: "builder",
        companyName: "Prestige Estates Private Limited",
        reraNumber: "RERA345678",
        gstNumber: "29AABCP1234C1ZL",
        city: "Bangalore",
        state: "Karnataka",
        verificationStatus: "verified",
        description: "Leading real estate developer with projects across South India",
        website: "https://prestigeestates.example.com",
        totalListings: 15,
        rating: "4.8",
        reviewCount: 156,
      },
    ] as any).returning();

    console.log("Created seller profiles...");

    // Seed properties
    const propertiesData = [
      {
        sellerId: sellerProfile1.id,
        title: "Luxury 3BHK Apartment in Bandra West",
        description: "Spacious 3BHK apartment with sea view, modern amenities, and premium finishes. Located in the heart of Bandra West with easy access to transport and shopping.",
        propertyType: "apartment" as const,
        transactionType: "sale" as const,
        price: 85000000,
        pricePerSqft: 58620,
        area: 1450,
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2,
        floor: 12,
        totalFloors: 20,
        facing: "West",
        furnishing: "Semi-Furnished",
        ageOfProperty: 2,
        possessionStatus: "Ready to Move",
        address: "Sea View Heights, 14th Road, Bandra West",
        locality: "Bandra West",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400050",
        latitude: "19.0596",
        longitude: "72.8295",
        amenities: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup", "Lift", "Club House"],
        highlights: ["Sea View", "Corner Unit", "Near Station", "Vastu Compliant"],
        status: "active" as const,
        isVerified: true,
        isFeatured: true,
        viewCount: 245,
        inquiryCount: 18,
        favoriteCount: 32,
      },
      {
        sellerId: sellerProfile1.id,
        title: "Modern 2BHK Flat in Andheri East",
        description: "Well-maintained 2BHK flat in a prime location of Andheri East. Close to metro station and commercial hubs.",
        propertyType: "apartment" as const,
        transactionType: "sale" as const,
        price: 12500000,
        pricePerSqft: 13889,
        area: 900,
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1,
        floor: 7,
        totalFloors: 15,
        facing: "East",
        furnishing: "Unfurnished",
        ageOfProperty: 5,
        possessionStatus: "Ready to Move",
        address: "Green Valley Apartments, MIDC Road, Andheri East",
        locality: "Andheri East",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400093",
        latitude: "19.1136",
        longitude: "72.8697",
        amenities: ["Parking", "Security", "Lift", "Power Backup"],
        highlights: ["Near Metro", "Gated Community"],
        status: "active" as const,
        isVerified: true,
        isFeatured: false,
        viewCount: 156,
        inquiryCount: 12,
        favoriteCount: 18,
      },
      {
        sellerId: sellerProfile2.id,
        title: "Spacious 3BHK in Koramangala",
        description: "Beautiful 3BHK apartment in the heart of Koramangala. Perfect for families with children, close to schools and hospitals.",
        propertyType: "apartment" as const,
        transactionType: "rent" as const,
        price: 55000,
        pricePerSqft: null,
        area: 1350,
        bedrooms: 3,
        bathrooms: 2,
        balconies: 2,
        floor: 4,
        totalFloors: 8,
        facing: "North",
        furnishing: "Fully Furnished",
        ageOfProperty: 3,
        possessionStatus: "Ready to Move",
        address: "Palm Grove Apartments, 5th Block, Koramangala",
        locality: "Koramangala",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560095",
        latitude: "12.9352",
        longitude: "77.6245",
        amenities: ["Gym", "Swimming Pool", "Parking", "Security", "Children's Play Area"],
        highlights: ["Fully Furnished", "Near IT Parks", "Pet Friendly"],
        status: "active" as const,
        isVerified: true,
        isFeatured: true,
        viewCount: 189,
        inquiryCount: 24,
        favoriteCount: 41,
      },
      {
        sellerId: sellerProfile2.id,
        title: "Premium Villa in Whitefield",
        description: "Luxurious 4BHK villa with private garden and swimming pool. Premium gated community with 24/7 security.",
        propertyType: "villa" as const,
        transactionType: "sale" as const,
        price: 45000000,
        pricePerSqft: 12500,
        area: 3600,
        bedrooms: 4,
        bathrooms: 4,
        balconies: 3,
        floor: null,
        totalFloors: 2,
        facing: "South",
        furnishing: "Semi-Furnished",
        ageOfProperty: 1,
        possessionStatus: "Ready to Move",
        address: "Prestige Villas, ITPL Main Road, Whitefield",
        locality: "Whitefield",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560066",
        latitude: "12.9698",
        longitude: "77.7500",
        amenities: ["Private Pool", "Garden", "Parking", "Security", "Club House", "Tennis Court"],
        highlights: ["Corner Plot", "Private Garden", "Near Schools"],
        status: "active" as const,
        isVerified: true,
        isFeatured: true,
        viewCount: 312,
        inquiryCount: 8,
        favoriteCount: 56,
      },
      {
        sellerId: sellerProfile3.id,
        title: "New Launch: Prestige City - 2BHK",
        description: "Brand new 2BHK apartments in Prestige City. World-class amenities and smart home features. Pre-launch prices!",
        propertyType: "apartment" as const,
        transactionType: "sale" as const,
        price: 8500000,
        pricePerSqft: 8095,
        area: 1050,
        bedrooms: 2,
        bathrooms: 2,
        balconies: 1,
        floor: null,
        totalFloors: 25,
        facing: "East",
        furnishing: "Unfurnished",
        ageOfProperty: 0,
        possessionStatus: "Under Construction",
        address: "Prestige City, Sarjapur Road",
        locality: "Sarjapur Road",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560102",
        latitude: "12.8565",
        longitude: "77.7632",
        amenities: ["Smart Home", "Gym", "Swimming Pool", "Parking", "Security", "Club House", "Co-working Space"],
        highlights: ["New Launch", "Smart Home Ready", "Pre-Launch Price"],
        status: "active" as const,
        isVerified: true,
        isFeatured: true,
        viewCount: 567,
        inquiryCount: 89,
        favoriteCount: 123,
      },
      {
        sellerId: sellerProfile3.id,
        title: "Commercial Office Space in Marathahalli",
        description: "Premium commercial office space with modern infrastructure. Ideal for IT companies and startups.",
        propertyType: "commercial" as const,
        transactionType: "rent" as const,
        price: 125000,
        pricePerSqft: null,
        area: 2500,
        bedrooms: null,
        bathrooms: 4,
        balconies: null,
        floor: 8,
        totalFloors: 12,
        facing: "North",
        furnishing: "Bare Shell",
        ageOfProperty: 2,
        possessionStatus: "Ready to Move",
        address: "Tech Park Tower, Outer Ring Road, Marathahalli",
        locality: "Marathahalli",
        city: "Bangalore",
        state: "Karnataka",
        pincode: "560037",
        latitude: "12.9591",
        longitude: "77.6974",
        amenities: ["Parking", "Security", "Lift", "Power Backup", "Cafeteria", "Conference Room"],
        highlights: ["Tech Park", "Metro Accessible", "24/7 Access"],
        status: "active" as const,
        isVerified: true,
        isFeatured: false,
        viewCount: 234,
        inquiryCount: 15,
        favoriteCount: 28,
      },
      {
        sellerId: sellerProfile2.id,
        title: "Agricultural Land in Doddaballapur",
        description: "Fertile agricultural land perfect for farming or investment. Clear title and good road connectivity.",
        propertyType: "plot" as const,
        transactionType: "sale" as const,
        price: 15000000,
        pricePerSqft: 150,
        area: 100000,
        bedrooms: null,
        bathrooms: null,
        balconies: null,
        floor: null,
        totalFloors: null,
        facing: "East",
        furnishing: null,
        ageOfProperty: null,
        possessionStatus: "Ready",
        address: "Survey No. 45, Doddaballapur Taluk",
        locality: "Doddaballapur",
        city: "Bangalore Rural",
        state: "Karnataka",
        pincode: "561203",
        latitude: "13.2927",
        longitude: "77.5387",
        amenities: ["Borewell", "Fencing", "Road Access"],
        highlights: ["Clear Title", "Water Source", "Investment Opportunity"],
        status: "active" as const,
        isVerified: true,
        isFeatured: false,
        viewCount: 89,
        inquiryCount: 5,
        favoriteCount: 12,
      },
      {
        sellerId: sellerProfile1.id,
        title: "Penthouse in Lower Parel",
        description: "Exclusive penthouse with panoramic city views. Ultra-luxury living with private terrace and jacuzzi.",
        propertyType: "penthouse" as const,
        transactionType: "sale" as const,
        price: 250000000,
        pricePerSqft: 62500,
        area: 4000,
        bedrooms: 4,
        bathrooms: 5,
        balconies: 3,
        floor: 45,
        totalFloors: 45,
        facing: "West",
        furnishing: "Fully Furnished",
        ageOfProperty: 1,
        possessionStatus: "Ready to Move",
        address: "Sky Towers, NM Joshi Marg, Lower Parel",
        locality: "Lower Parel",
        city: "Mumbai",
        state: "Maharashtra",
        pincode: "400013",
        latitude: "18.9976",
        longitude: "72.8278",
        amenities: ["Private Terrace", "Jacuzzi", "Home Theater", "Smart Home", "Private Lift", "Concierge"],
        highlights: ["Panoramic View", "Ultra Luxury", "Private Terrace", "Celebrity Neighbors"],
        status: "active" as const,
        isVerified: true,
        isFeatured: true,
        viewCount: 456,
        inquiryCount: 6,
        favoriteCount: 78,
      },
    ];

    const insertedProperties = await db.insert(properties).values(propertiesData as any).returning();
    console.log(`Created ${insertedProperties.length} properties...`);

    // Add property images
    const propertyImagesData = insertedProperties.flatMap((prop) => [
      {
        propertyId: prop.id,
        url: "/attached_assets/generated_images/luxury_indian_apartment_building.png",
        caption: "Main View",
        isPrimary: true,
        sortOrder: 0,
      },
      {
        propertyId: prop.id,
        url: "/attached_assets/generated_images/modern_apartment_interior_india.png",
        caption: "Interior View",
        isPrimary: false,
        sortOrder: 1,
      },
    ]);

    await db.insert(propertyImages).values(propertyImagesData);
    console.log("Created property images...");

    // Create some favorites for buyers
    await db.insert(favorites).values([
      { userId: buyerUser1.id, propertyId: insertedProperties[0].id },
      { userId: buyerUser1.id, propertyId: insertedProperties[2].id },
      { userId: buyerUser1.id, propertyId: insertedProperties[4].id },
      { userId: buyerUser2.id, propertyId: insertedProperties[1].id },
      { userId: buyerUser2.id, propertyId: insertedProperties[3].id },
    ]);
    console.log("Created favorites...");

    // Create some inquiries
    await db.insert(inquiries).values([
      {
        propertyId: insertedProperties[0].id,
        buyerId: buyerUser1.id,
        sellerId: sellerProfile1.id,
        message: "Hi, I'm interested in this property. Is the price negotiable?",
        status: "pending",
        buyerPhone: buyerUser1.phone,
        buyerEmail: buyerUser1.email,
      },
      {
        propertyId: insertedProperties[2].id,
        buyerId: buyerUser1.id,
        sellerId: sellerProfile2.id,
        message: "Can I schedule a site visit for this weekend?",
        status: "replied",
        buyerPhone: buyerUser1.phone,
        buyerEmail: buyerUser1.email,
        sellerResponse: "Sure! We can arrange a visit on Saturday at 11 AM. Please confirm.",
        respondedAt: new Date(),
      },
      {
        propertyId: insertedProperties[4].id,
        buyerId: buyerUser2.id,
        sellerId: sellerProfile3.id,
        message: "What is the expected possession date? Are there any additional charges?",
        status: "pending",
        buyerPhone: buyerUser2.phone,
        buyerEmail: buyerUser2.email,
      },
    ] as any);
    console.log("Created inquiries...");

    // Create notifications
    await db.insert(notifications).values([
      {
        userId: sellerUser1.id,
        type: "inquiry",
        title: "New Inquiry Received",
        message: "You have received a new inquiry for 'Luxury 3BHK Apartment in Bandra West'",
        data: { propertyId: insertedProperties[0].id },
        isRead: false,
      },
      {
        userId: buyerUser1.id,
        type: "message",
        title: "Seller Responded",
        message: "Sunita Devi has responded to your inquiry about the Koramangala property",
        data: { propertyId: insertedProperties[2].id },
        isRead: false,
      },
      {
        userId: adminUser.id,
        type: "system",
        title: "New Seller Registration",
        message: "A new seller has registered and is awaiting verification",
        data: {},
        isRead: false,
      },
    ] as any);
    console.log("Created notifications...");

    // Create a chat thread
    const [chatThread] = await db.insert(chatThreads).values({
      propertyId: insertedProperties[2].id,
      buyerId: buyerUser1.id,
      sellerId: sellerUser2.id,
      lastMessageAt: new Date(),
      buyerUnreadCount: 1,
      sellerUnreadCount: 0,
    }).returning();

    await db.insert(chatMessages).values([
      {
        threadId: chatThread.id,
        senderId: buyerUser1.id,
        content: "Hi, I'm interested in the 3BHK in Koramangala. Is it still available?",
        isRead: true,
      },
      {
        threadId: chatThread.id,
        senderId: sellerUser2.id,
        content: "Yes, it's available! Would you like to schedule a viewing?",
        isRead: true,
      },
      {
        threadId: chatThread.id,
        senderId: buyerUser1.id,
        content: "That would be great. How about this Saturday?",
        isRead: true,
      },
      {
        threadId: chatThread.id,
        senderId: sellerUser2.id,
        content: "Saturday works! Let's say 11 AM. I'll send you the exact location.",
        isRead: false,
      },
    ] as any);
    console.log("Created chat messages...");

    console.log("Database seeding completed successfully!");
    return { success: true };
  } catch (error) {
    console.error("Error seeding database:", error);
    throw error;
  }
}

// Run seed if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}
