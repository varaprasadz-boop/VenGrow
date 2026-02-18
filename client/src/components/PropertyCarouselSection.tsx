import { useRef, useState, useEffect } from "react";
import { Link } from "wouter";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PropertyCardData {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  areaUnit?: string;
  propertyType: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  sellerType?: "Individual" | "Broker" | "Builder";
  transactionType: "Sale" | "Rent" | "Lease";
  addedDate?: string | Date;
}

interface PropertyCarouselSectionProps {
  title: string;
  description: string;
  viewAllHref: string;
  emptyMessage: string;
  properties: PropertyCardData[];
  isLoading: boolean;
  sectionId: string;
  bgClass?: "bg-background" | "bg-muted/30";
}

export default function PropertyCarouselSection({
  title,
  description,
  viewAllHref,
  emptyMessage,
  properties,
  isLoading,
  sectionId,
  bgClass = "bg-background",
}: PropertyCarouselSectionProps) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const checkScrollButtons = () => {
    if (scrollContainerRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScrollButtons();
    const container = scrollContainerRef.current;
    if (container) {
      container.addEventListener("scroll", checkScrollButtons);
      window.addEventListener("resize", checkScrollButtons);
    }
    return () => {
      if (container) {
        container.removeEventListener("scroll", checkScrollButtons);
        window.removeEventListener("resize", checkScrollButtons);
      }
    };
  }, [properties.length]);

  const scrollLeft = () => {
    scrollContainerRef.current?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = () => {
    scrollContainerRef.current?.scrollBy({ left: 300, behavior: "smooth" });
  };

  const displayProperties = properties.slice(0, 8);

  return (
    <section className={`py-16 ${bgClass}`} data-testid={sectionId}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="font-serif font-bold text-3xl mb-2">{title}</h2>
            <p className="text-muted-foreground">{description}</p>
          </div>
          <Link href={viewAllHref} className="text-primary font-medium hover:underline">
            View All
          </Link>
        </div>

        {/* Desktop: Grid layout */}
        {isLoading ? (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="aspect-[4/3] bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : displayProperties.length === 0 ? (
          <div className="hidden md:flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-muted-foreground mb-2">{emptyMessage}</p>
              <Link href="/listings">
                <Button variant="outline">Browse All Properties</Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {displayProperties.slice(0, 4).map((property) => (
              <PropertyCard key={property.id} {...property} />
            ))}
          </div>
        )}

        {/* Mobile: Horizontal scroll */}
        <div className="md:hidden relative group/carousel">
          <button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
              canScrollLeft ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" : "opacity-0 cursor-not-allowed"
            }`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          {isLoading ? (
            <div className="flex gap-4 overflow-x-auto scrollbar-hide px-4 py-2 pr-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-shrink-0 w-[min(85vw,320px)] min-w-[260px] aspect-[4/3] bg-muted animate-pulse rounded-lg" />
              ))}
            </div>
          ) : displayProperties.length === 0 ? (
            <div className="flex items-center justify-center py-12 px-6">
              <div className="text-center">
                <p className="text-muted-foreground mb-2">{emptyMessage}</p>
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
            >
              {displayProperties.map((property) => (
                <div key={property.id} className="flex-shrink-0 w-[min(85vw,320px)] min-w-[260px]">
                  <PropertyCard {...property} />
                </div>
              ))}
            </div>
          )}

          <button
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
              canScrollRight ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" : "opacity-0 cursor-not-allowed"
            }`}
            onClick={scrollRight}
            disabled={!canScrollRight}
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>
      </div>
    </section>
  );
}
