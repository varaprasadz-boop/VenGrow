import { useState, useEffect, useRef, useMemo } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import PropertyCarouselSection from "@/components/PropertyCarouselSection";
import StatsSection from "@/components/StatsSection";
import VerifiedBuildersSection from "@/components/VerifiedBuildersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import type { Property } from "@shared/schema";

import propertyImg1 from "@assets/stock_images/luxury_apartment_bui_734bab84.jpg";
import propertyImg2 from "@assets/stock_images/modern_villa_house_w_a69bd44b.jpg";
import propertyImg3 from "@assets/stock_images/luxury_apartment_bui_d72f53b5.jpg";
import propertyImg4 from "@assets/stock_images/luxury_apartment_bui_1d237319.jpg";
import propertyImg5 from "@assets/stock_images/modern_villa_house_w_e69d664a.jpg";
import propertyImg6 from "@assets/stock_images/commercial_office_bu_35b810a4.jpg";

interface Property {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  propertyType: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  sellerType: "Individual" | "Broker" | "Builder";
  transactionType: "Sale" | "Rent" | "Lease";
}

const sampleFeaturedProperties: Property[] = [
  {
    id: "1",
    title: "Luxury 3 BHK Apartment in Bandra West",
    price: 25000000,
    location: "Bandra West, Mumbai",
    imageUrl: propertyImg1,
    bedrooms: 3,
    bathrooms: 3,
    area: 1800,
    propertyType: "Apartment",
    isFeatured: true,
    isVerified: true,
    sellerType: "Builder",
    transactionType: "Sale",
  },
  {
    id: "2",
    title: "Modern Villa with Garden in Whitefield",
    price: 45000000,
    location: "Whitefield, Bangalore",
    imageUrl: propertyImg2,
    bedrooms: 4,
    bathrooms: 4,
    area: 3500,
    propertyType: "Villa",
    isFeatured: true,
    isVerified: true,
    sellerType: "Builder",
    transactionType: "Sale",
  },
  {
    id: "3",
    title: "Premium 2 BHK in Gurgaon",
    price: 18000000,
    location: "Golf Course Road, Gurgaon",
    imageUrl: propertyImg3,
    bedrooms: 2,
    bathrooms: 2,
    area: 1400,
    propertyType: "Apartment",
    isFeatured: true,
    isVerified: true,
    sellerType: "Broker",
    transactionType: "Sale",
  },
  {
    id: "7",
    title: "Spacious 4 BHK in Powai",
    price: 35000000,
    location: "Powai, Mumbai",
    imageUrl: propertyImg4,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    propertyType: "Apartment",
    isFeatured: true,
    isVerified: true,
    sellerType: "Builder",
    transactionType: "Sale",
  },
];

const sampleNewProperties: Property[] = [
  {
    id: "4",
    title: "Spacious 4 BHK in Powai",
    price: 35000000,
    location: "Powai, Mumbai",
    imageUrl: propertyImg4,
    bedrooms: 4,
    bathrooms: 3,
    area: 2400,
    propertyType: "Apartment",
    isFeatured: false,
    isVerified: true,
    sellerType: "Individual",
    transactionType: "Sale",
  },
  {
    id: "5",
    title: "Cozy 1 BHK for Rent in Koramangala",
    price: 35000,
    location: "Koramangala, Bangalore",
    imageUrl: propertyImg5,
    bedrooms: 1,
    bathrooms: 1,
    area: 650,
    propertyType: "Apartment",
    isFeatured: false,
    isVerified: true,
    sellerType: "Individual",
    transactionType: "Rent",
  },
  {
    id: "6",
    title: "Commercial Space in Connaught Place",
    price: 150000,
    location: "Connaught Place, Delhi",
    imageUrl: propertyImg6,
    bedrooms: 0,
    bathrooms: 2,
    area: 2000,
    propertyType: "Commercial",
    isFeatured: false,
    isVerified: true,
    sellerType: "Broker",
    transactionType: "Lease",
  },
  {
    id: "8",
    title: "Sea View Penthouse in Worli",
    price: 85000000,
    location: "Worli, Mumbai",
    imageUrl: propertyImg1,
    bedrooms: 5,
    bathrooms: 5,
    area: 4500,
    propertyType: "Apartment",
    isFeatured: false,
    isVerified: true,
    sellerType: "Builder",
    transactionType: "Sale",
  },
];

export default function HomePage() {
  // Fetch featured properties from API
  const { data: featuredPropertiesData = [], isLoading: featuredLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties/featured"],
    queryFn: async () => {
      const response = await fetch("/api/properties/featured?limit=8");
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Fetch new properties from API
  const { data: newPropertiesData = [], isLoading: newLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "new"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active");
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Fetch section-specific properties
  const { data: newProjectsData = [], isLoading: newProjectsLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "new-projects"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active&sellerType=builder");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: luxuryData = [], isLoading: luxuryLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "luxury"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active&minPrice=10000000");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: commercialSaleData = [], isLoading: commercialLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "commercial-sale"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active&propertyType=commercial&transactionType=sale&isFeatured=true");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: plotsData = [], isLoading: plotsLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "plots"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active&propertyType=plot");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: ownerPostedData = [], isLoading: ownerPostedLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "owner-posted"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active&sellerType=individual");
      if (!response.ok) return [];
      return response.json();
    },
  });

  const { data: channelPartnerData = [], isLoading: channelPartnerLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "channel-partner"],
    queryFn: async () => {
      const response = await fetch("/api/properties?limit=8&status=active&sellerType=builder&verifiedSeller=true");
      if (!response.ok) return [];
      return response.json();
    },
  });

  // Helper to transform API property to PropertyCard format
  const transformProperty = (property: any, defaultSellerType: "Individual" | "Broker" | "Builder" = "Builder") => {
    const imageUrl = (property as any).images?.length > 0
      ? (typeof (property as any).images[0] === "string"
        ? (property as any).images[0]
        : (property as any).images[0]?.url)
      : "";
    return {
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.locality || ""}, ${property.city || ""}`.replace(/^, |, $/g, "") || "Location not specified",
      imageUrl,
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms || undefined,
      area: property.area || 0,
      propertyType: property.propertyType || "Property",
      isFeatured: property.isFeatured || false,
      isVerified: property.isVerified || false,
      sellerType: ((property as any).sellerType || defaultSellerType) as "Individual" | "Broker" | "Builder",
      transactionType: (property.transactionType === "sale" ? "Sale" : property.transactionType === "rent" ? "Rent" : "Lease") as "Sale" | "Rent" | "Lease",
      addedDate: (property as any).approvedAt || property.createdAt,
    };
  };

  // Transform API data for PropertyCard component
  const displayFeatured = useMemo(() => {
    if (featuredPropertiesData.length === 0) return [];
    return featuredPropertiesData.map((p) => transformProperty(p, "Builder"));
  }, [featuredPropertiesData]);

  const displayNew = useMemo(() => {
    if (newPropertiesData.length === 0) return [];
    return newPropertiesData.map((p) => transformProperty(p, "Individual"));
  }, [newPropertiesData]);

  const displayNewProjects = useMemo(() => {
    if (newProjectsData.length === 0) return [];
    return newProjectsData.map((p) => transformProperty(p, "Builder"));
  }, [newProjectsData]);

  const displayLuxury = useMemo(() => {
    if (luxuryData.length === 0) return [];
    return luxuryData.map((p) => transformProperty(p, "Builder"));
  }, [luxuryData]);

  const displayCommercialSale = useMemo(() => {
    if (commercialSaleData.length === 0) return [];
    return commercialSaleData.map((p) => transformProperty(p, "Builder"));
  }, [commercialSaleData]);

  const displayPlots = useMemo(() => {
    if (plotsData.length === 0) return [];
    return plotsData.map((p) => transformProperty(p, "Individual"));
  }, [plotsData]);

  const displayOwnerPosted = useMemo(() => {
    if (ownerPostedData.length === 0) return [];
    return ownerPostedData.map((p) => transformProperty(p, "Individual"));
  }, [ownerPostedData]);

  const displayChannelPartner = useMemo(() => {
    if (channelPartnerData.length === 0) return [];
    return channelPartnerData.map((p) => transformProperty(p, "Builder"));
  }, [channelPartnerData]);
  
  // Featured Properties scroll state
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  // New Listings scroll state
  const newListingsScrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeftNew, setCanScrollLeftNew] = useState(false);
  const [canScrollRightNew, setCanScrollRightNew] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const checkScrollButtonsNew = () => {
    if (newListingsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = newListingsScrollRef.current;
      setCanScrollLeftNew(scrollLeft > 0);
      setCanScrollRightNew(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    checkScrollButtonsNew();
    const container = scrollContainerRef.current;
    const containerNew = newListingsScrollRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }
    if (containerNew) {
      containerNew.addEventListener("scroll", checkScrollButtonsNew);
      window.addEventListener("resize", checkScrollButtonsNew);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      }
      if (containerNew) {
        containerNew.removeEventListener("scroll", checkScrollButtonsNew);
        window.removeEventListener("resize", checkScrollButtonsNew);
      }
    };
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  const scrollLeftNew = () => {
    if (newListingsScrollRef.current) {
      newListingsScrollRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRightNew = () => {
    if (newListingsScrollRef.current) {
      newListingsScrollRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title="Home"
        description="VenGrow - India's trusted verified property marketplace. Buy, sell, or rent apartments, villas, plots, and commercial spaces from verified sellers across India."
        ogType="website"
      />
      <Header />
      
      <main className="flex-1">
        <HeroSection />

        <section className="py-16 bg-background" data-testid="section-featured-properties">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif font-bold text-3xl mb-2">Featured Properties</h2>
                <p className="text-muted-foreground">Handpicked premium properties for you</p>
              </div>
              <Link href="/listings?featured=true" className="text-primary font-medium hover:underline" data-testid="link-view-all-featured">
                View All
              </Link>
            </div>
            
            {/* Desktop: Grid layout, Mobile: Horizontal scroll */}
            {featuredLoading ? (
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : displayFeatured.length === 0 ? (
              <div className="hidden md:flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No featured properties available</p>
                  <Link href="/listings">
                    <Button variant="outline">Browse All Properties</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-featured-properties-desktop">
                {displayFeatured.slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
            
            {/* Mobile: Horizontal scroll with 2 cards visible */}
            <div className="md:hidden relative group/carousel">
              <button
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                  canScrollLeft 
                    ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" 
                    : "opacity-0 cursor-not-allowed"
                }`}
                onClick={scrollLeft}
                disabled={!canScrollLeft}
                data-testid="button-featured-scroll-left"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>

              {featuredLoading ? (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 pr-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[min(85vw,320px)] min-w-[260px] aspect-[4/3] bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : displayFeatured.length === 0 ? (
                <div className="flex items-center justify-center py-12 px-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">No featured properties available</p>
                    <Link href="/listings">
                      <Button variant="outline" size="sm">Browse All</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  ref={scrollContainerRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 pr-6"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  data-testid="carousel-featured-properties"
                >
                  {displayFeatured.map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-[min(85vw,320px)] min-w-[260px]">
                      <PropertyCard {...property} />
                    </div>
                  ))}
                </div>
              )}

              <button
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                  canScrollRight 
                    ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" 
                    : "opacity-0 cursor-not-allowed"
                }`}
                onClick={scrollRight}
                disabled={!canScrollRight}
                data-testid="button-featured-scroll-right"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </section>

        <section className="py-16 bg-muted/30" data-testid="section-new-listings">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
              <div>
                <h2 className="font-serif font-bold text-3xl mb-2">New Listings</h2>
                <p className="text-muted-foreground">Recently added properties you might like</p>
              </div>
              <Link href="/listings?sort=newest" className="text-primary font-medium hover:underline" data-testid="link-view-all-new">
                View All
              </Link>
            </div>
            
            {/* Desktop: Grid layout */}
            {newLoading ? (
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
                ))}
              </div>
            ) : displayNew.length === 0 ? (
              <div className="hidden md:flex items-center justify-center py-12">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">No new listings available</p>
                  <Link href="/listings">
                    <Button variant="outline">Browse All Properties</Button>
                  </Link>
                </div>
              </div>
            ) : (
              <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-new-listings-desktop">
                {displayNew.slice(0, 4).map((property) => (
                  <PropertyCard key={property.id} {...property} />
                ))}
              </div>
            )}
            
            {/* Mobile: Horizontal scroll with 2 cards visible */}
            <div className="md:hidden relative group/carousel-new">
              <button
                className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                  canScrollLeftNew 
                    ? "opacity-0 group-hover/carousel-new:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" 
                    : "opacity-0 cursor-not-allowed"
                }`}
                onClick={scrollLeftNew}
                disabled={!canScrollLeftNew}
                data-testid="button-new-scroll-left"
              >
                <ChevronLeft className="h-5 w-5 text-muted-foreground" />
              </button>

              {newLoading ? (
                <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 pr-6">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="flex-shrink-0 w-[min(85vw,320px)] min-w-[260px] aspect-[4/3] bg-muted animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : displayNew.length === 0 ? (
                <div className="flex items-center justify-center py-12 px-6">
                  <div className="text-center">
                    <p className="text-muted-foreground mb-2">No new listings available</p>
                    <Link href="/listings">
                      <Button variant="outline" size="sm">Browse All</Button>
                    </Link>
                  </div>
                </div>
              ) : (
                <div
                  ref={newListingsScrollRef}
                  className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 pr-6"
                  style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                  data-testid="carousel-new-listings"
                >
                  {displayNew.map((property) => (
                    <div key={property.id} className="flex-shrink-0 w-[min(85vw,320px)] min-w-[260px]">
                      <PropertyCard {...property} />
                    </div>
                  ))}
                </div>
              )}

              <button
                className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
                  canScrollRightNew 
                    ? "opacity-0 group-hover/carousel-new:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" 
                    : "opacity-0 cursor-not-allowed"
                }`}
                onClick={scrollRightNew}
                disabled={!canScrollRightNew}
                data-testid="button-new-scroll-right"
              >
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
          </div>
        </section>

        <PropertyCarouselSection
          title="New Projects"
          description="Newly launched residential and commercial projects"
          viewAllHref="/listings?category=new-projects"
          emptyMessage="No new projects available"
          properties={displayNewProjects}
          isLoading={newProjectsLoading}
          sectionId="section-new-projects"
          bgClass="bg-background"
        />

        <PropertyCarouselSection
          title="Luxury Property"
          description="Premium and ultra-luxury properties"
          viewAllHref="/listings?category=ultra-luxury"
          emptyMessage="No luxury properties available"
          properties={displayLuxury}
          isLoading={luxuryLoading}
          sectionId="section-luxury-property"
          bgClass="bg-muted/30"
        />

        <VerifiedBuildersSection />

        <PropertyCarouselSection
          title="Featured Commercial Sale"
          description="Featured commercial spaces for sale"
          viewAllHref="/listings?category=commercial&featured=true"
          emptyMessage="No featured commercial properties available"
          properties={displayCommercialSale}
          isLoading={commercialLoading}
          sectionId="section-featured-commercial-sale"
          bgClass="bg-background"
        />

        <PropertyCarouselSection
          title="Featured Plot / Land"
          description="Residential and commercial plots"
          viewAllHref="/listings?category=plots"
          emptyMessage="No plots or land available"
          properties={displayPlots}
          isLoading={plotsLoading}
          sectionId="section-featured-plot-land"
          bgClass="bg-muted/30"
        />

        <PropertyCarouselSection
          title="Owner Posted Property"
          description="Properties listed directly by owners"
          viewAllHref="/listings?sellerTypes=Individual"
          emptyMessage="No owner posted properties available"
          properties={displayOwnerPosted}
          isLoading={ownerPostedLoading}
          sectionId="section-owner-posted-property"
          bgClass="bg-background"
        />

        <PropertyCarouselSection
          title="Certified Channel Partner"
          description="Verified builders and channel partners"
          viewAllHref="/builders"
          emptyMessage="No properties from certified partners available"
          properties={displayChannelPartner}
          isLoading={channelPartnerLoading}
          sectionId="section-certified-channel-partner"
          bgClass="bg-muted/30"
        />

        <TestimonialsSection />

        <StatsSection />

        <section className="py-16 bg-primary text-primary-foreground" data-testid="section-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
              Ready to Sell Your Property?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of verified sellers on VenGrow and reach millions of potential buyers
            </p>
            <Link href="/seller/register" data-testid="link-become-seller">
              <Button size="lg" variant="secondary" className="font-semibold text-lg px-8">
                Become a Seller
              </Button>
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
