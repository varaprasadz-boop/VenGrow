import { useState, useEffect, useRef } from "react";
import { Link } from "wouter";
import { BadgeCheck, ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import builderImg1 from "@assets/stock_images/corporate_office_bui_2f340793.jpg";
import builderImg2 from "@assets/stock_images/corporate_office_bui_8f6c9c5a.jpg";
import builderImg3 from "@assets/stock_images/corporate_office_bui_43dafb3e.jpg";
import builderImg4 from "@assets/stock_images/corporate_office_bui_998dee1f.jpg";
import builderImg5 from "@assets/stock_images/corporate_office_bui_3c3196e3.jpg";
import builderImg6 from "@assets/stock_images/corporate_office_bui_cd677e1c.jpg";

const verifiedBuilders = [
  {
    id: "1",
    companyName: "Prestige Group",
    logoUrl: builderImg1,
    propertyCount: 156,
    slug: "prestige-group",
  },
  {
    id: "2",
    companyName: "Godrej Properties",
    logoUrl: builderImg2,
    propertyCount: 134,
    slug: "godrej-properties",
  },
  {
    id: "3",
    companyName: "DLF Limited",
    logoUrl: builderImg3,
    propertyCount: 98,
    slug: "dlf-limited",
  },
  {
    id: "4",
    companyName: "Sobha Developers",
    logoUrl: builderImg4,
    propertyCount: 87,
    slug: "sobha-developers",
  },
  {
    id: "5",
    companyName: "Brigade Group",
    logoUrl: builderImg5,
    propertyCount: 76,
    slug: "brigade-group",
  },
  {
    id: "6",
    companyName: "Mahindra Lifespaces",
    logoUrl: builderImg6,
    propertyCount: 65,
    slug: "mahindra-lifespaces",
  },
];

export default function VerifiedBuildersSection() {
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
      return () => container.removeEventListener("scroll", checkScrollButtons);
    }
  }, []);

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

        <div className="relative">
          <Button
            variant="outline"
            size="icon"
            className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md ${
              !canScrollLeft ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={scrollLeft}
            disabled={!canScrollLeft}
            data-testid="button-scroll-left"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>

          <div
            ref={scrollContainerRef}
            className="flex gap-6 overflow-x-auto scrollbar-hide px-10 py-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            data-testid="carousel-verified-builders"
          >
            {verifiedBuilders.map((builder) => (
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
                      className="h-20 w-20 rounded-lg overflow-hidden"
                      data-testid={`img-builder-logo-${builder.id}`}
                    >
                      <img 
                        src={builder.logoUrl} 
                        alt={builder.companyName}
                        className="w-full h-full object-cover"
                      />
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

          <Button
            variant="outline"
            size="icon"
            className={`absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-background shadow-md ${
              !canScrollRight ? "opacity-50 cursor-not-allowed" : ""
            }`}
            onClick={scrollRight}
            disabled={!canScrollRight}
            data-testid="button-scroll-right"
          >
            <ChevronRight className="h-5 w-5" />
          </Button>
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
