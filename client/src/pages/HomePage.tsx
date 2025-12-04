import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import CategorySection from "@/components/CategorySection";
import PropertyCard from "@/components/PropertyCard";
import StatsSection from "@/components/StatsSection";
import VerifiedBuildersSection from "@/components/VerifiedBuildersSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import Footer from "@/components/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";

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

export default function HomePage() {
  const { data: featuredProperties = [], isLoading: featuredLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "featured"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: newProperties = [], isLoading: newLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", "new"],
    staleTime: 5 * 60 * 1000,
  });

  const PropertySkeletons = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {[1, 2, 3].map((i) => (
        <Skeleton key={i} className="h-80 w-full rounded-lg" />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        <HeroSection />
        
        <CategorySection />

        {(featuredLoading || featuredProperties.length > 0) && (
          <section className="py-16 bg-background" data-testid="section-featured-properties">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif font-bold text-3xl mb-2">Featured Properties</h2>
                  <p className="text-muted-foreground">Handpicked premium properties for you</p>
                </div>
                <Link href="/listings?featured=true" className="text-primary font-medium hover:underline" data-testid="link-view-all-featured">
                  View All
                </Link>
              </div>
              {featuredLoading ? (
                <PropertySkeletons />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-featured-properties">
                  {featuredProperties.slice(0, 3).map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <StatsSection />

        {(newLoading || newProperties.length > 0) && (
          <section className="py-16 bg-background" data-testid="section-new-listings">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="font-serif font-bold text-3xl mb-2">New Listings</h2>
                  <p className="text-muted-foreground">Recently added properties</p>
                </div>
                <Link href="/listings?sort=newest" className="text-primary font-medium hover:underline" data-testid="link-view-all-new">
                  View All
                </Link>
              </div>
              {newLoading ? (
                <PropertySkeletons />
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="grid-new-listings">
                  {newProperties.slice(0, 3).map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              )}
            </div>
          </section>
        )}

        <VerifiedBuildersSection />

        <TestimonialsSection />

        <section className="py-16 bg-primary text-primary-foreground" data-testid="section-cta">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
              Ready to Sell Your Property?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of sellers and list your property with verified buyers waiting
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
