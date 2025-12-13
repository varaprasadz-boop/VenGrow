import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import PropertyCard from "@/components/PropertyCard";
import StatsSection from "@/components/StatsSection";
import VerifiedBuildersSection from "@/components/VerifiedBuildersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  const displayFeatured = sampleFeaturedProperties;
  const displayNew = sampleNewProperties;
  
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
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-featured-properties-desktop">
              {displayFeatured.slice(0, 4).map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
            
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

              <div
                ref={scrollContainerRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-6 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                data-testid="carousel-featured-properties"
              >
                {displayFeatured.map((property) => (
                  <div key={property.id} className="flex-shrink-0 w-[calc(50%-8px)]">
                    <PropertyCard {...property} />
                  </div>
                ))}
              </div>

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

        <StatsSection />

        <section className="py-16 bg-background" data-testid="section-new-listings">
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
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6" data-testid="grid-new-listings-desktop">
              {displayNew.slice(0, 4).map((property) => (
                <PropertyCard key={property.id} {...property} />
              ))}
            </div>
            
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

              <div
                ref={newListingsScrollRef}
                className="flex gap-4 overflow-x-auto scrollbar-hide px-6 py-2"
                style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
                data-testid="carousel-new-listings"
              >
                {displayNew.map((property) => (
                  <div key={property.id} className="flex-shrink-0 w-[calc(50%-8px)]">
                    <PropertyCard {...property} />
                  </div>
                ))}
              </div>

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

        <VerifiedBuildersSection />

        <TestimonialsSection />

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
