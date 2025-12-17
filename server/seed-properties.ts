import { db } from "./db";
import { 
  users, sellerProfiles, properties, propertyImages, propertyCategories, propertySubcategories,
  packages, sellerSubscriptions
} from "@shared/schema";
import { eq, sql, inArray, like } from "drizzle-orm";
import { hashPassword } from "./auth-utils";

// Default password for all test sellers: TestSeller@123
const TEST_SELLER_PASSWORD = "TestSeller@123";

const CITIES_DATA = [
  {
    name: "Mumbai",
    state: "Maharashtra",
    localities: ["Bandra West", "Andheri East", "Powai", "Worli", "Juhu", "Goregaon", "Thane", "Navi Mumbai", "Malad", "Kandivali"],
    avgPriceMultiplier: 1.5,
    pinPrefix: "4000"
  },
  {
    name: "Bangalore",
    state: "Karnataka", 
    localities: ["Koramangala", "Whitefield", "HSR Layout", "Indiranagar", "Electronic City", "Sarjapur Road", "JP Nagar", "Marathahalli", "Hebbal", "Yelahanka"],
    avgPriceMultiplier: 1.2,
    pinPrefix: "5600"
  },
  {
    name: "Delhi",
    state: "Delhi",
    localities: ["Dwarka", "Rohini", "Vasant Kunj", "Greater Kailash", "Saket", "Janakpuri", "Pitampura", "Lajpat Nagar", "Karol Bagh", "Defence Colony"],
    avgPriceMultiplier: 1.4,
    pinPrefix: "1100"
  },
  {
    name: "Chennai",
    state: "Tamil Nadu",
    localities: ["Anna Nagar", "Adyar", "T Nagar", "Velachery", "OMR", "Porur", "Thiruvanmiyur", "Sholinganallur", "Mylapore", "Perambur"],
    avgPriceMultiplier: 0.9,
    pinPrefix: "6000"
  },
  {
    name: "Hyderabad",
    state: "Telangana",
    localities: ["Gachibowli", "HITEC City", "Banjara Hills", "Jubilee Hills", "Kukatpally", "Madhapur", "Kondapur", "Miyapur", "Secunderabad", "LB Nagar"],
    avgPriceMultiplier: 1.0,
    pinPrefix: "5000"
  },
  {
    name: "Pune",
    state: "Maharashtra",
    localities: ["Koregaon Park", "Hinjewadi", "Baner", "Kharadi", "Wakad", "Aundh", "Viman Nagar", "Hadapsar", "Magarpatta", "Pimple Saudagar"],
    avgPriceMultiplier: 0.85,
    pinPrefix: "4110"
  },
  {
    name: "Kolkata",
    state: "West Bengal",
    localities: ["Salt Lake", "New Town", "Rajarhat", "Ballygunge", "Alipore", "Park Street", "Gariahat", "Behala", "Howrah", "Lake Town"],
    avgPriceMultiplier: 0.7,
    pinPrefix: "7000"
  },
  {
    name: "Ahmedabad",
    state: "Gujarat",
    localities: ["SG Highway", "Prahlad Nagar", "Satellite", "Bodakdev", "Thaltej", "Vastrapur", "Navrangpura", "Shela", "Bopal", "Gota"],
    avgPriceMultiplier: 0.65,
    pinPrefix: "3800"
  },
  {
    name: "Jaipur",
    state: "Rajasthan",
    localities: ["Malviya Nagar", "Vaishali Nagar", "Mansarovar", "C-Scheme", "Tonk Road", "Raja Park", "Jagatpura", "Sodala", "Ajmer Road", "Sitapura"],
    avgPriceMultiplier: 0.5,
    pinPrefix: "3020"
  },
  {
    name: "Goa",
    state: "Goa",
    localities: ["Panaji", "Margao", "Calangute", "Candolim", "Anjuna", "Baga", "Mapusa", "Porvorim", "Vasco", "Ponda"],
    avgPriceMultiplier: 1.1,
    pinPrefix: "4030"
  },
  {
    name: "Lucknow",
    state: "Uttar Pradesh",
    localities: ["Gomti Nagar", "Hazratganj", "Aliganj", "Indira Nagar", "Vibhuti Khand", "Jankipuram", "Alambagh", "Rajajipuram", "Mahanagar", "Chinhat"],
    avgPriceMultiplier: 0.45,
    pinPrefix: "2260"
  },
  {
    name: "Chandigarh",
    state: "Chandigarh",
    localities: ["Sector 17", "Sector 22", "Sector 35", "Sector 43", "Sector 44", "Sector 9", "Sector 11", "Manimajra", "Panchkula", "Mohali"],
    avgPriceMultiplier: 0.8,
    pinPrefix: "1600"
  }
];

const SELLER_TYPES = ["individual", "broker", "builder"] as const;

const AMENITIES: Record<string, string[]> = {
  apartment: ["Swimming Pool", "Gym", "Parking", "Security", "Power Backup", "Lift", "Club House", "Children's Play Area", "Garden", "Intercom"],
  villa: ["Private Pool", "Garden", "Parking", "Security", "Club House", "Tennis Court", "Gym", "Power Backup", "Servant Quarters", "Home Theatre"],
  plot: ["Gated Community", "24/7 Security", "Water Connection", "Electricity", "Internal Roads", "Street Lights", "Drainage", "Boundary Wall"],
  penthouse: ["Private Terrace", "Swimming Pool", "Gym", "Concierge", "Smart Home", "Lift", "Club House", "Helipad Access", "Wine Cellar", "Home Theatre"],
  farmhouse: ["Organic Garden", "Swimming Pool", "Security", "Power Backup", "Water Well", "Orchard", "Gazebo", "BBQ Area", "Guest Cottage", "Stable"],
  commercial: ["Parking", "Security", "Power Backup", "Lift", "Fire Safety", "AC", "Conference Room", "Reception", "Cafeteria", "Server Room"],
  pg: ["WiFi", "Meals", "Laundry", "AC", "TV", "Housekeeping", "Security", "Power Backup", "Water Heater", "Refrigerator"]
};

const HIGHLIGHTS: Record<string, string[]> = {
  apartment: ["Sea View", "Corner Unit", "Near Metro", "Vastu Compliant", "Prime Location", "Gated Community", "Premium Finishes", "Smart Home"],
  villa: ["Corner Plot", "Private Garden", "Near Schools", "Premium Location", "Eco-Friendly", "Modern Architecture", "Home Automation"],
  plot: ["Clear Title", "NA Approved", "Corner Plot", "Main Road Facing", "Ready for Construction", "Near Highway"],
  penthouse: ["Panoramic View", "Exclusive Access", "Premium Finishes", "Designer Interiors", "Private Terrace", "Smart Home"],
  farmhouse: ["Scenic Views", "Organic Farm", "Peaceful Retreat", "Weekend Getaway", "Eco-Friendly", "Nature Trails"],
  commercial: ["Prime Location", "High Footfall", "Near Metro", "Corner Shop", "Ground Floor", "Anchor Tenant Nearby"],
  pg: ["Near IT Park", "Near Metro", "Furnished", "Meals Included", "Separate Entrance", "No Restrictions"]
};

const PROPERTY_IMAGES = [
  "/attached_assets/generated_images/luxury_indian_apartment_building.png",
  "/attached_assets/generated_images/modern_indian_villa.png",
  "/attached_assets/generated_images/residential_plot_land.png",
  "/attached_assets/generated_images/commercial_office_space.png",
  "/attached_assets/generated_images/indian_independent_house.png"
];

// Valid property types: apartment, villa, plot, commercial, farmhouse, penthouse
const PROPERTY_TEMPLATES: Record<string, any> = {
  "apartments": {
    propertyType: "apartment",
    bedroomRange: [1, 5],
    bathroomRange: [1, 4],
    areaRange: [500, 3000],
    basePricePerSqft: 8000,
    floorRange: [1, 30],
    furnishingOptions: ["Unfurnished", "Semi-Furnished", "Fully Furnished"]
  },
  "villas": {
    propertyType: "villa",
    bedroomRange: [3, 6],
    bathroomRange: [3, 6],
    areaRange: [2000, 6000],
    basePricePerSqft: 12000,
    floorRange: [1, 3],
    furnishingOptions: ["Unfurnished", "Semi-Furnished", "Fully Furnished"]
  },
  "plots": {
    propertyType: "plot",
    bedroomRange: [0, 0],
    bathroomRange: [0, 0],
    areaRange: [1000, 10000],
    basePricePerSqft: 3000,
    floorRange: [0, 0],
    furnishingOptions: ["Unfurnished"]
  },
  "independent-house": {
    propertyType: "villa", // Using villa as closest match for independent house
    bedroomRange: [2, 5],
    bathroomRange: [2, 4],
    areaRange: [1000, 3000],
    basePricePerSqft: 6000,
    floorRange: [1, 4],
    furnishingOptions: ["Unfurnished", "Semi-Furnished", "Fully Furnished"]
  },
  "new-projects": {
    propertyType: "apartment",
    bedroomRange: [1, 4],
    bathroomRange: [1, 3],
    areaRange: [700, 2500],
    basePricePerSqft: 7000,
    floorRange: [1, 40],
    furnishingOptions: ["Unfurnished"]
  },
  "ultra-luxury": {
    propertyType: "penthouse",
    bedroomRange: [3, 6],
    bathroomRange: [3, 6],
    areaRange: [2500, 8000],
    basePricePerSqft: 25000,
    floorRange: [10, 50],
    furnishingOptions: ["Semi-Furnished", "Fully Furnished"]
  },
  "commercial": {
    propertyType: "commercial",
    bedroomRange: [0, 0],
    bathroomRange: [1, 4],
    areaRange: [200, 5000],
    basePricePerSqft: 10000,
    floorRange: [0, 20],
    furnishingOptions: ["Unfurnished", "Bare Shell", "Fully Furnished"]
  },
  "joint-venture": {
    propertyType: "plot",
    bedroomRange: [0, 0],
    bathroomRange: [0, 0],
    areaRange: [5000, 50000],
    basePricePerSqft: 2000,
    floorRange: [0, 0],
    furnishingOptions: ["Unfurnished"]
  },
  "pg": {
    propertyType: "apartment",
    bedroomRange: [1, 1],
    bathroomRange: [1, 1],
    areaRange: [100, 300],
    basePricePerSqft: 0,
    monthlyRent: 8000,
    floorRange: [1, 5],
    furnishingOptions: ["Fully Furnished"]
  },
  "farm-land": {
    propertyType: "farmhouse",
    bedroomRange: [0, 0],
    bathroomRange: [0, 0],
    areaRange: [43560, 435600], // 1-10 acres in sqft
    basePricePerSqft: 100,
    floorRange: [0, 0],
    furnishingOptions: ["Unfurnished"]
  },
  "rush-deal": {
    propertyType: "apartment",
    bedroomRange: [1, 4],
    bathroomRange: [1, 3],
    areaRange: [600, 2000],
    basePricePerSqft: 5000, // Discounted
    floorRange: [1, 20],
    furnishingOptions: ["Unfurnished", "Semi-Furnished"]
  }
};

const TRANSACTION_TYPES = ["sale", "rent", "lease"] as const;
const PROJECT_STAGES = ["pre_launch", "launch", "under_construction", "ready_to_move"] as const;
const WORKFLOW_STATUSES = ["approved", "approved", "approved", "approved", "live", "live", "draft", "submitted"] as const; // Weighted towards approved/live

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomElements<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}

function generatePrice(template: any, city: typeof CITIES_DATA[0], transactionType: string): number {
  const area = randomInt(template.areaRange[0], template.areaRange[1]);
  
  if (transactionType === "rent" || transactionType === "lease") {
    // Monthly rent calculation
    if (template.monthlyRent) {
      return Math.round(template.monthlyRent * city.avgPriceMultiplier * (0.8 + Math.random() * 0.4));
    }
    const monthlyRent = (area * template.basePricePerSqft * city.avgPriceMultiplier * 0.004);
    return Math.round(monthlyRent / 1000) * 1000;
  }
  
  // Sale price calculation
  const pricePerSqft = template.basePricePerSqft * city.avgPriceMultiplier * (0.8 + Math.random() * 0.4);
  return Math.round((area * pricePerSqft) / 100000) * 100000;
}

function generatePropertyTitle(category: string, subcategory: string | null, bedrooms: number, locality: string, transactionType: string): string {
  const bhk = bedrooms > 0 ? `${bedrooms}BHK ` : "";
  const typeWord = category === "villas" ? "Villa" : 
                   category === "plots" || category === "farm-land" ? "Plot" :
                   category === "commercial" ? "Commercial Space" :
                   category === "pg" ? "PG Room" :
                   category === "independent-house" ? "Independent House" :
                   category === "ultra-luxury" ? "Luxury Apartment" :
                   "Apartment";
  
  const actionWord = transactionType === "rent" ? "for Rent" : 
                     transactionType === "lease" ? "for Lease" : 
                     "for Sale";
  
  const adjectives = ["Spacious", "Modern", "Premium", "Beautiful", "Elegant", "Stunning", "Luxurious"];
  const adj = randomElement(adjectives);
  
  return `${adj} ${bhk}${typeWord} in ${locality} ${actionWord}`;
}

function generateDescription(category: string, locality: string, city: string, amenities: string[]): string {
  const descriptions: Record<string, string[]> = {
    "apartments": [
      `Well-maintained apartment in the heart of ${locality}, ${city}. Features modern amenities and excellent connectivity.`,
      `Spacious apartment with premium finishes in ${locality}. Close to schools, hospitals, and shopping centers.`,
      `Beautiful apartment offering panoramic views and world-class amenities in ${locality}, ${city}.`
    ],
    "villas": [
      `Luxurious villa in a premium gated community in ${locality}, ${city}. Private garden and modern interiors.`,
      `Stunning villa with contemporary design and top-notch security in ${locality}.`,
      `Exclusive villa offering privacy and luxury in the prime location of ${locality}, ${city}.`
    ],
    "plots": [
      `Clear title plot in ${locality}, ${city}. Ready for construction with all approvals in place.`,
      `Prime residential plot in a developing area of ${locality}. Excellent investment opportunity.`,
      `Corner plot with good frontage in ${locality}, ${city}. All utilities available.`
    ],
    "commercial": [
      `Premium commercial space in ${locality}, ${city}. High visibility and footfall area.`,
      `Modern office space with all amenities in ${locality}. Ideal for IT/ITES companies.`,
      `Retail space in prime commercial hub of ${locality}, ${city}.`
    ],
    "independent-house": [
      `Independent house with ample parking in ${locality}, ${city}. Quiet residential area.`,
      `Well-maintained independent property in ${locality}. Ideal for families.`,
      `Spacious independent house with garden in ${locality}, ${city}.`
    ],
    "ultra-luxury": [
      `Ultra-luxury penthouse with breathtaking views in ${locality}, ${city}. World-class amenities and finishes.`,
      `Exclusive luxury residence in the most prestigious address of ${locality}. Unparalleled lifestyle.`,
      `Opulent living space with designer interiors in ${locality}, ${city}. Private elevator access.`
    ],
    "new-projects": [
      `Brand new project launching in ${locality}, ${city}. Pre-launch prices with flexible payment plans.`,
      `Upcoming residential development in ${locality}. Smart home features and modern amenities.`,
      `New construction project in prime ${locality}, ${city}. Early bird discounts available.`
    ],
    "joint-venture": [
      `Prime land available for joint venture in ${locality}, ${city}. Excellent development potential.`,
      `Strategic location for JV development in ${locality}. Clear title and approvals.`,
      `Land parcel for partnership development in ${locality}, ${city}. High ROI potential.`
    ],
    "farm-land": [
      `Agricultural land with water source in ${locality}, ${city}. Ideal for farming or farmhouse.`,
      `Scenic farm land away from city hustle in ${locality}. Perfect weekend getaway location.`,
      `Fertile land with road access in ${locality}, ${city}. Suitable for organic farming.`
    ],
    "rush-deal": [
      `Urgent sale! Below market price property in ${locality}, ${city}. Genuine reason for selling.`,
      `Distress sale opportunity in prime ${locality}. Negotiable price for quick closure.`,
      `Quick sale property in ${locality}, ${city}. Excellent value for money.`
    ],
    "pg": [
      `Comfortable PG accommodation in ${locality}, ${city}. All meals and utilities included.`,
      `Fully furnished PG near IT parks in ${locality}. WiFi and housekeeping included.`,
      `Premium PG with AC rooms in ${locality}, ${city}. No restrictions.`
    ]
  };
  
  const categoryDesc = descriptions[category] || descriptions["apartments"];
  let desc = randomElement(categoryDesc);
  
  if (amenities.length > 0) {
    desc += ` Key amenities include ${amenities.slice(0, 3).join(", ")}.`;
  }
  
  return desc;
}

export async function seedPropertiesComprehensive() {
  console.log("Starting comprehensive property seed...\n");

  try {
    // Clean up existing test seller data first
    console.log("Cleaning up existing test data...");
    
    // Find test users (by email pattern)
    const testUsers = await db.select().from(users).where(
      like(users.email, '%@vengrow.test')
    );
    
    if (testUsers.length > 0) {
      const testUserIds = testUsers.map(u => u.id);
      
      // Find seller profiles for these users
      const testSellers = await db.select().from(sellerProfiles).where(
        inArray(sellerProfiles.userId, testUserIds)
      );
      
      if (testSellers.length > 0) {
        const testSellerIds = testSellers.map(s => s.id);
        
        // Find properties by these sellers
        const testProperties = await db.select().from(properties).where(
          inArray(properties.sellerId, testSellerIds)
        );
        
        if (testProperties.length > 0) {
          const testPropertyIds = testProperties.map(p => p.id);
          
          // Delete property images
          await db.delete(propertyImages).where(inArray(propertyImages.propertyId, testPropertyIds));
          console.log("  Deleted test property images");
          
          // Delete properties
          await db.delete(properties).where(inArray(properties.sellerId, testSellerIds));
          console.log("  Deleted test properties");
        }
        
        // Delete seller subscriptions
        await db.delete(sellerSubscriptions).where(inArray(sellerSubscriptions.sellerId, testSellerIds));
        console.log("  Deleted test seller subscriptions");
        
        // Delete seller profiles
        await db.delete(sellerProfiles).where(inArray(sellerProfiles.userId, testUserIds));
        console.log("  Deleted test seller profiles");
      }
      
      // Delete test users
      await db.delete(users).where(like(users.email, '%@vengrow.test'));
      console.log("  Deleted test users");
    }
    
    console.log("Cleanup complete.\n");

    // Get existing categories
    const categories = await db.select().from(propertyCategories);
    const subcategories = await db.select().from(propertySubcategories);
    
    if (categories.length === 0) {
      console.log("No categories found. Please run CMS seed first.");
      return;
    }

    // Get or create package
    let existingPackages = await db.select().from(packages);
    if (existingPackages.length === 0) {
      existingPackages = await db.insert(packages).values([
        {
          name: "Enterprise",
          description: "For builders and large agencies",
          price: 9999,
          duration: 365,
          listingLimit: 1000,
          featuredListings: 100,
          features: ["Unlimited Listings", "Premium Support"],
          isPopular: false,
          isActive: true,
        }
      ]).returning();
    }
    const seedPackage = existingPackages[0];

    console.log(`Found ${categories.length} categories and ${subcategories.length} subcategories`);

    // Create sellers for each city
    const sellerProfiles_created: any[] = [];
    let sellerIndex = 0;
    
    // Hash password once for all test sellers
    const passwordHash = await hashPassword(TEST_SELLER_PASSWORD);
    
    for (const city of CITIES_DATA) {
      for (const sellerType of SELLER_TYPES) {
        sellerIndex++;
        const companyName = sellerType === "builder" ? 
          `${city.name} Developers Pvt Ltd` :
          sellerType === "broker" ? 
          `${city.name} Realty Services` : null;
        
        // Create user with password for email/password auth
        const [user] = await db.insert(users).values({
          email: `seller${sellerIndex}@vengrow.test`,
          firstName: sellerType === "builder" ? companyName : `Seller ${sellerIndex}`,
          lastName: city.name,
          phone: `+91 98765${String(sellerIndex).padStart(5, '0')}`,
          passwordHash: passwordHash,
          authProvider: "local",
          role: "seller",
          isActive: true,
          isEmailVerified: true,
          isPhoneVerified: true,
        }).returning();

        // Create seller profile
        const [seller] = await db.insert(sellerProfiles).values({
          userId: user.id,
          sellerType: sellerType,
          companyName: companyName,
          reraNumber: `RERA${city.name.toUpperCase().slice(0, 3)}${String(sellerIndex).padStart(6, '0')}`,
          gstNumber: sellerType !== "individual" ? `${city.state.slice(0, 2).toUpperCase()}ABCP${sellerIndex}234C1ZL` : null,
          city: city.name,
          state: city.state,
          verificationStatus: "verified",
          description: `${sellerType === "builder" ? "Leading developer" : sellerType === "broker" ? "Experienced broker" : "Property owner"} in ${city.name}`,
          totalListings: 0,
          rating: String((3.5 + Math.random() * 1.5).toFixed(1)),
          reviewCount: randomInt(5, 100),
        } as any).returning();

        // Create subscription for this seller
        const subscriptionEndDate = new Date();
        subscriptionEndDate.setFullYear(subscriptionEndDate.getFullYear() + 1);
        
        await db.insert(sellerSubscriptions).values({
          sellerId: seller.id,
          packageId: seedPackage.id,
          startDate: new Date(),
          endDate: subscriptionEndDate,
          listingsUsed: 0,
          featuredUsed: 0,
          isActive: true,
        });

        sellerProfiles_created.push({ ...seller, city });
      }
    }

    console.log(`Created ${sellerProfiles_created.length} seller profiles with subscriptions across ${CITIES_DATA.length} cities`);

    // Create properties for each category and city
    let totalProperties = 0;
    const propertyBatch: any[] = [];

    for (const category of categories) {
      const categorySlug = category.slug;
      const template = PROPERTY_TEMPLATES[categorySlug] || PROPERTY_TEMPLATES["apartments"];
      const categorySubcats = subcategories.filter(s => s.categoryId === category.id);
      
      for (const city of CITIES_DATA) {
        // Get sellers for this city
        const citySellers = sellerProfiles_created.filter(s => s.city.name === city.name);
        
        // Create 5+ properties per category per city
        const propertiesPerCity = 5 + randomInt(0, 3);
        
        for (let i = 0; i < propertiesPerCity; i++) {
          const seller = randomElement(citySellers);
          const locality = randomElement(city.localities);
          const transactionType = randomElement(TRANSACTION_TYPES);
          const subcategory = categorySubcats.length > 0 ? randomElement(categorySubcats) : null;
          
          const bedrooms = randomInt(template.bedroomRange[0], template.bedroomRange[1]);
          const bathrooms = randomInt(template.bathroomRange[0], template.bathroomRange[1]);
          const area = randomInt(template.areaRange[0], template.areaRange[1]);
          const floor = template.floorRange[1] > 0 ? randomInt(template.floorRange[0], template.floorRange[1]) : null;
          const totalFloors = template.floorRange[1] > 0 ? randomInt(floor || 1, Math.max(floor || 1, template.floorRange[1])) : null;
          
          const price = generatePrice(template, city, transactionType);
          const pricePerSqft = transactionType === "sale" ? Math.round(price / area) : null;
          
          const amenityType = template.propertyType === "villa" ? "villa" :
                             template.propertyType === "plot" ? "plot" :
                             template.propertyType === "commercial" ? "commercial" :
                             template.propertyType === "penthouse" ? "penthouse" :
                             template.propertyType === "farmhouse" ? "farmhouse" :
                             categorySlug === "pg" ? "pg" : "apartment";
          
          const selectedAmenities = randomElements(AMENITIES[amenityType] || AMENITIES.apartment, randomInt(4, 8));
          const selectedHighlights = randomElements(HIGHLIGHTS[amenityType] || HIGHLIGHTS.apartment, randomInt(2, 5));
          
          // Ensure each seller has at least one draft property for testing
          // First 2 properties per seller are draft, next 2 are live, rest are random
          const sellerPropertyCount = propertyBatch.filter(p => p.sellerId === seller.id).length;
          let workflowStatus: typeof WORKFLOW_STATUSES[number];
          if (sellerPropertyCount < 2) {
            workflowStatus = "draft"; // First 2 properties are drafts for testing
          } else if (sellerPropertyCount < 4) {
            workflowStatus = "live"; // Next 2 are live for display
          } else {
            workflowStatus = randomElement(WORKFLOW_STATUSES); // Rest are random
          }
          const status = workflowStatus === "live" || workflowStatus === "approved" ? "active" as const : 
                        workflowStatus === "draft" ? "draft" as const : "pending" as const;
          
          const needsProjectStage = category.hasProjectStage && ["apartments", "villas", "new-projects"].includes(categorySlug);
          
          propertyBatch.push({
            sellerId: seller.id,
            title: generatePropertyTitle(categorySlug, subcategory?.name || null, bedrooms, locality, transactionType),
            description: generateDescription(categorySlug, locality, city.name, selectedAmenities),
            propertyType: template.propertyType,
            transactionType: transactionType,
            categoryId: category.id,
            subcategoryId: subcategory?.id || null,
            projectStage: needsProjectStage ? randomElement(PROJECT_STAGES) : null,
            price: price,
            pricePerSqft: pricePerSqft,
            area: area,
            bedrooms: bedrooms > 0 ? bedrooms : null,
            bathrooms: bathrooms > 0 ? bathrooms : null,
            balconies: bedrooms > 0 ? randomInt(0, Math.min(bedrooms, 3)) : null,
            floor: floor,
            totalFloors: totalFloors,
            facing: randomElement(["North", "South", "East", "West", "North-East", "North-West", "South-East", "South-West"]),
            furnishing: randomElement(template.furnishingOptions),
            ageOfProperty: randomInt(0, 15),
            possessionStatus: randomElement(["Ready to Move", "Under Construction"]),
            address: `${randomInt(1, 999)}, ${locality} Main Road`,
            locality: locality,
            city: city.name,
            state: city.state,
            pincode: `${city.pinPrefix}${String(randomInt(10, 99))}`,
            latitude: String(randomInt(8, 30) + Math.random()),
            longitude: String(randomInt(72, 88) + Math.random()),
            amenities: selectedAmenities,
            highlights: selectedHighlights,
            nearbyPlaces: [
              { type: "school", name: `${locality} International School`, distance: `${randomInt(1, 5)} km` },
              { type: "hospital", name: `${city.name} City Hospital`, distance: `${randomInt(2, 8)} km` },
              { type: "metro", name: `${locality} Metro Station`, distance: `${randomInt(1, 3)} km` },
            ],
            status: status,
            workflowStatus: workflowStatus,
            isVerified: Math.random() > 0.3,
            isFeatured: Math.random() > 0.8,
            viewCount: randomInt(10, 500),
            inquiryCount: randomInt(0, 30),
            favoriteCount: randomInt(0, 50),
            publishedAt: status === "active" ? new Date() : null,
          });
          
          totalProperties++;
        }
      }
    }

    // Insert properties in batches
    console.log(`\nInserting ${propertyBatch.length} properties...`);
    
    const BATCH_SIZE = 50;
    const insertedProperties: any[] = [];
    
    for (let i = 0; i < propertyBatch.length; i += BATCH_SIZE) {
      const batch = propertyBatch.slice(i, i + BATCH_SIZE);
      const inserted = await db.insert(properties).values(batch).returning();
      insertedProperties.push(...inserted);
      console.log(`  Inserted batch ${Math.floor(i / BATCH_SIZE) + 1}/${Math.ceil(propertyBatch.length / BATCH_SIZE)}`);
    }

    // Add images for each property
    console.log("\nAdding property images...");
    const imageBatch: any[] = [];
    
    for (const property of insertedProperties) {
      const imageCount = randomInt(2, 5);
      for (let i = 0; i < imageCount; i++) {
        imageBatch.push({
          propertyId: property.id,
          url: PROPERTY_IMAGES[i % PROPERTY_IMAGES.length],
          caption: i === 0 ? "Main View" : `View ${i + 1}`,
          isPrimary: i === 0,
          sortOrder: i,
        });
      }
    }

    for (let i = 0; i < imageBatch.length; i += BATCH_SIZE * 3) {
      const batch = imageBatch.slice(i, i + BATCH_SIZE * 3);
      await db.insert(propertyImages).values(batch);
    }

    // Update seller listing counts
    for (const seller of sellerProfiles_created) {
      const count = insertedProperties.filter(p => p.sellerId === seller.id).length;
      await db.update(sellerProfiles)
        .set({ totalListings: count })
        .where(eq(sellerProfiles.id, seller.id));
    }

    console.log(`\n${"=".repeat(50)}`);
    console.log("PROPERTY SEEDING COMPLETE!");
    console.log("=".repeat(50));
    console.log(`\nSummary:`);
    console.log(`- ${sellerProfiles_created.length} Seller Profiles (${CITIES_DATA.length} cities x ${SELLER_TYPES.length} types)`);
    console.log(`- ${insertedProperties.length} Properties across all categories and cities`);
    console.log(`- ${imageBatch.length} Property Images`);
    console.log(`\nBreakdown by city:`);
    
    for (const city of CITIES_DATA) {
      const cityCount = insertedProperties.filter(p => p.city === city.name).length;
      console.log(`  - ${city.name}: ${cityCount} properties`);
    }

  } catch (error) {
    console.error("Error seeding properties:", error);
    throw error;
  }
}

// Run if called directly
const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  seedPropertiesComprehensive()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
}
