import { Link } from "wouter";
import { BadgeCheck, Building2, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface VerifiedBuilder {
  id: string;
  companyName: string;
  logoUrl: string;
  propertyCount: number;
  slug?: string;
}

interface VerifiedBuildersSectionProps {
  builders?: VerifiedBuilder[];
  isLoading?: boolean;
}

export default function VerifiedBuildersSection({ builders, isLoading }: VerifiedBuildersSectionProps) {
  const mockBuilders: VerifiedBuilder[] = [
    { id: "1", companyName: "Prestige Group", logoUrl: "", propertyCount: 45, slug: "prestige-group" },
    { id: "2", companyName: "Godrej Properties", logoUrl: "", propertyCount: 38, slug: "godrej-properties" },
    { id: "3", companyName: "DLF Limited", logoUrl: "", propertyCount: 52, slug: "dlf-limited" },
    { id: "4", companyName: "Lodha Group", logoUrl: "", propertyCount: 29, slug: "lodha-group" },
    { id: "5", companyName: "Sobha Limited", logoUrl: "", propertyCount: 33, slug: "sobha-limited" },
    { id: "6", companyName: "Brigade Group", logoUrl: "", propertyCount: 27, slug: "brigade-group" },
  ];

  const displayBuilders = builders || mockBuilders;

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-64 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!displayBuilders || displayBuilders.length === 0) {
    return null;
  }

  return (
    <section className="py-16 bg-muted/30" data-testid="section-verified-builders">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
            <BadgeCheck className="h-5 w-5" />
            <span className="text-sm font-medium">Trusted Partners</span>
          </div>
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
            Verified Builders
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Browse properties from India's most trusted and verified builders and developers
          </p>
        </div>

        {/* Builder Logos Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" data-testid="grid-verified-builders">
          {displayBuilders.map((builder) => (
            <Link 
              key={builder.id} 
              href={`/listings?seller=${builder.slug || builder.id}`}
              data-testid={`link-builder-${builder.id}`}
            >
              <Card 
                className="p-6 h-full hover-elevate active-elevate-2 cursor-pointer transition-all group text-center"
                data-testid={`card-builder-${builder.id}`}
              >
                <div className="flex flex-col items-center justify-center h-full gap-3">
                  {/* Logo or Placeholder */}
                  {builder.logoUrl ? (
                    <img 
                      src={builder.logoUrl} 
                      alt={builder.companyName}
                      className="h-16 w-16 object-contain"
                      data-testid={`img-builder-logo-${builder.id}`}
                    />
                  ) : (
                    <div 
                      className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                      data-testid={`placeholder-builder-logo-${builder.id}`}
                    >
                      <Building2 className="h-8 w-8" />
                    </div>
                  )}
                  
                  {/* Company Name */}
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

                  {/* Verified Badge */}
                  <div className="flex items-center gap-1 text-primary" data-testid={`badge-verified-${builder.id}`}>
                    <BadgeCheck className="h-4 w-4" />
                    <span className="text-xs font-medium">Verified</span>
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-10">
          <Link href="/listings?sellerType=corporate">
            <Button variant="outline" size="lg" data-testid="button-view-all-builders">
              View All Verified Builders
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
