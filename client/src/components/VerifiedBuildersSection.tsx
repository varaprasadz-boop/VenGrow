import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { BadgeCheck, ArrowRight, ChevronLeft, ChevronRight, Building2, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { VerifiedBuilder } from "@shared/schema";

import builderImg1 from "@assets/stock_images/corporate_office_bui_2f340793.jpg";
import builderImg2 from "@assets/stock_images/corporate_office_bui_8f6c9c5a.jpg";
import builderImg3 from "@assets/stock_images/corporate_office_bui_43dafb3e.jpg";
import builderImg4 from "@assets/stock_images/corporate_office_bui_998dee1f.jpg";
import builderImg5 from "@assets/stock_images/corporate_office_bui_3c3196e3.jpg";
import builderImg6 from "@assets/stock_images/corporate_office_bui_cd677e1c.jpg";

const fallbackBuilders = [
  { id: "1", companyName: "Prestige Group", logoUrl: builderImg1, propertyCount: 156, slug: "prestige-group" },
  { id: "2", companyName: "Godrej Properties", logoUrl: builderImg2, propertyCount: 134, slug: "godrej-properties" },
  { id: "3", companyName: "DLF Limited", logoUrl: builderImg3, propertyCount: 98, slug: "dlf-limited" },
  { id: "4", companyName: "Sobha Developers", logoUrl: builderImg4, propertyCount: 87, slug: "sobha-developers" },
  { id: "5", companyName: "Brigade Group", logoUrl: builderImg5, propertyCount: 76, slug: "brigade-group" },
  { id: "6", companyName: "Mahindra Lifespaces", logoUrl: builderImg6, propertyCount: 65, slug: "mahindra-lifespaces" },
];

export default function VerifiedBuildersSection() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const { data: apiBuilders, isLoading } = useQuery<VerifiedBuilder[]>({
    queryKey: ["/api/verified-builders", { homepage: true }],
    queryFn: async () => {
      const response = await fetch("/api/verified-builders?homepage=true");
      if (!response.ok) throw new Error("Failed to fetch builders");
      return response.json();
    },
  });

  const builders = apiBuilders && apiBuilders.length > 0 
    ? apiBuilders.map(b => {
        // Normalize logoUrl: handle null, undefined, empty string, and ensure relative paths start with /
        let logoUrl = b.logoUrl;
        if (!logoUrl || logoUrl.trim() === '') {
          logoUrl = fallbackBuilders[0].logoUrl;
        } else {
          // If it's a relative path (doesn't start with http:// or https://), ensure it starts with /
          if (!logoUrl.startsWith('http://') && !logoUrl.startsWith('https://')) {
            logoUrl = logoUrl.startsWith('/') ? logoUrl : `/${logoUrl}`;
          }
        }
        return {
          id: b.id,
          companyName: b.companyName,
          logoUrl,
          propertyCount: b.propertyCount || 0,
          slug: b.slug,
        };
      })
    : fallbackBuilders;

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
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, [builders]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = scrollContainerRef.current;
        if (scrollLeft >= scrollWidth - clientWidth - 10) {
          scrollContainerRef.current.scrollTo({ left: 0, behavior: "smooth" });
        } else {
          scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
        }
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -200, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 200, behavior: "smooth" });
    }
  };

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30" data-testid="section-verified-builders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/30" data-testid="section-verified-builders">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <BadgeCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Trusted Partners</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
            Verified Builders & Developers
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Explore properties from India's most trusted real estate developers
          </p>
        </div>

        <div className="relative group/carousel">
          <button
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm border shadow-sm transition-all duration-200 ${
              canScrollLeft 
                ? "opacity-0 group-hover/carousel:opacity-100 hover:bg-background hover:shadow-md cursor-pointer" 
                : "opacity-0 cursor-not-allowed"
            }`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            data-testid="button-scroll-left"
          >
            <ChevronLeft className="h-5 w-5 text-muted-foreground" />
          </button>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-8 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            data-testid="carousel-verified-builders"
          >
            {builders.map((builder) => (
              <Link 
                key={builder.id} 
                href={`/builder/${builder.slug}`}
                data-testid={`link-builder-${builder.id}`}
                className="flex-shrink-0"
              >
                <Card 
                  className="p-6 w-52 hover-elevate active-elevate-2 cursor-pointer transition-all group text-center"
                  data-testid={`card-builder-${builder.id}`}
                >
                  <div className="flex flex-col items-center justify-center gap-3">
                    <div 
                      className="h-20 w-20 rounded-lg overflow-hidden bg-muted flex items-center justify-center"
                      data-testid={`img-builder-logo-${builder.id}`}
                    >
                      {builder.logoUrl ? (
                        <img 
                          src={builder.logoUrl} 
                          alt={builder.companyName}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Building2 className="h-8 w-8 text-muted-foreground" />
                      )}
                    </div>
                    
                    <div>
                      <p 
                        className="font-semibold text-sm line-clamp-2"
                        data-testid={`text-builder-name-${builder.id}`}
                      >
                        {builder.companyName}
                      </p>
                      <p 
                        className="text-xs text-muted-foreground mt-1"
                        data-testid={`text-builder-count-${builder.id}`}
                      >
                        {builder.propertyCount} Properties
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-primary" data-testid={`badge-verified-${builder.id}`}>
                      <BadgeCheck className="h-4 w-4" />
                      <span className="text-xs font-medium">Verified</span>
                    </div>
                  </div>
                </Card>
              </Link>
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
            data-testid="button-scroll-right"
          >
            <ChevronRight className="h-5 w-5 text-muted-foreground" />
          </button>
        </div>

        <div className="text-center mt-10">
          <Link href="/builders">
            <Button variant="outline" size="lg" data-testid="button-view-all-builders">
              View All Builders
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
