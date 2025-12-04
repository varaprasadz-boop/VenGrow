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

interface SiteSetting {
  key: string;
  value: string | null;
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

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const getSettingValue = (key: string): string | null => {
    const setting = siteSettings.find(s => s.key === key);
    return setting?.value || null;
  };

  const featuredTitle = getSettingValue("home_featured_title");
  const featuredSubtitle = getSettingValue("home_featured_subtitle");
  const featuredViewAll = getSettingValue("home_featured_view_all");
  const newListingsTitle = getSettingValue("home_new_title");
  const newListingsSubtitle = getSettingValue("home_new_subtitle");
  const newListingsViewAll = getSettingValue("home_new_view_all");
  const ctaTitle = getSettingValue("home_cta_title");
  const ctaSubtitle = getSettingValue("home_cta_subtitle");
  const ctaButtonText = getSettingValue("home_cta_button");

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

        {(featuredLoading || featuredProperties.length > 0) && (featuredTitle || featuredSubtitle) && (
          <section className="py-16 bg-background" data-testid="section-featured-properties">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  {featuredTitle && (
                    <h2 className="font-serif font-bold text-3xl mb-2">{featuredTitle}</h2>
                  )}
                  {featuredSubtitle && (
                    <p className="text-muted-foreground">{featuredSubtitle}</p>
                  )}
                </div>
                {featuredViewAll && (
                  <Link href="/listings?featured=true" className="text-primary font-medium hover:underline" data-testid="link-view-all-featured">
                    {featuredViewAll}
                  </Link>
                )}
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

        {(newLoading || newProperties.length > 0) && (newListingsTitle || newListingsSubtitle) && (
          <section className="py-16 bg-background" data-testid="section-new-listings">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between mb-8">
                <div>
                  {newListingsTitle && (
                    <h2 className="font-serif font-bold text-3xl mb-2">{newListingsTitle}</h2>
                  )}
                  {newListingsSubtitle && (
                    <p className="text-muted-foreground">{newListingsSubtitle}</p>
                  )}
                </div>
                {newListingsViewAll && (
                  <Link href="/listings?sort=newest" className="text-primary font-medium hover:underline" data-testid="link-view-all-new">
                    {newListingsViewAll}
                  </Link>
                )}
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

        {(ctaTitle || ctaSubtitle) && (
          <section className="py-16 bg-primary text-primary-foreground" data-testid="section-cta">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {ctaTitle && (
                <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
                  {ctaTitle}
                </h2>
              )}
              {ctaSubtitle && (
                <p className="text-lg mb-8 opacity-90">
                  {ctaSubtitle}
                </p>
              )}
              {ctaButtonText && (
                <Link href="/seller/register" data-testid="link-become-seller">
                  <Button size="lg" variant="secondary" className="font-semibold text-lg px-8">
                    {ctaButtonText}
                  </Button>
                </Link>
              )}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
