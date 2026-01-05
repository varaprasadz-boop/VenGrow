import { useQuery } from "@tanstack/react-query";
import { useParams, Link } from "wouter";
import { useState, useMemo } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { BuilderSEO } from "@/components/SEO";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { 
  BadgeCheck, Building2, MapPin, Calendar, Globe, Phone, Mail, 
  Loader2, ArrowLeft, ExternalLink, Building, Home
} from "lucide-react";
import type { VerifiedBuilder, Property } from "@shared/schema";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";

// Component to handle property image with error fallback
function PropertyImageWithFallback({ 
  imageUrl, 
  alt 
}: { 
  imageUrl: string | null | undefined; 
  alt: string;
}) {
  const [imageError, setImageError] = useState(false);
  
  if (!imageUrl || imageError) {
    return <Home className="h-8 w-8 text-muted-foreground" />;
  }
  
  return (
    <img 
      src={imageUrl} 
      alt={alt}
      className="w-full h-full object-cover"
      onError={() => setImageError(true)}
    />
  );
}

export default function BuilderLandingPage() {
  const { slug } = useParams<{ slug: string }>();
  
  // Get selected city from LocationContext (header city selector)
  const locationContext = useLocationContext();
  const headerSelectedCity = useMemo(() => {
    return locationContext?.selectedCity?.name || null;
  }, [locationContext?.selectedCity?.name]);

  const { data: builder, isLoading, error } = useQuery<VerifiedBuilder>({
    queryKey: ["/api/verified-builders/slug", slug],
    queryFn: async () => {
      const response = await fetch(`/api/verified-builders/slug/${slug}`);
      if (!response.ok) throw new Error("Builder not found");
      return response.json();
    },
    enabled: !!slug,
  });

  const { data: properties = [], isLoading: propertiesLoading, error: propertiesError } = useQuery<Property[]>({
    queryKey: ["/api/properties", "builder", builder?.sellerId],
    queryFn: async () => {
      if (!builder?.sellerId) return [];
      // Fetch ALL properties for this builder (don't filter by header city on builder profile)
      // The header city filter should only apply on listings page, not builder profiles
      const params = new URLSearchParams({
        sellerId: builder.sellerId,
        status: 'active'
      });
      const url = `/api/properties?${params.toString()}`;
      console.log('[BuilderLandingPage] Fetching properties:', url);
      const response = await fetch(url);
      if (!response.ok) {
        console.error('[BuilderLandingPage] Failed to fetch properties:', response.status, response.statusText);
        return [];
      }
      const data = await response.json();
      console.log('[BuilderLandingPage] Fetched properties:', data.length, 'properties');
      return data;
    },
    enabled: !!builder?.sellerId,
    staleTime: 30 * 1000, // Cache for 30 seconds
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });

  // Group properties by city - show all properties, but prioritize header city if selected
  const { propertiesByCity, cityNames, hasPropertiesInSelectedCity } = useMemo(() => {
    // Group ALL properties by city (don't filter - show all on builder profile)
    const grouped: Record<string, Property[]> = {};
    properties.forEach((property) => {
      const city = property.city || 'Other';
      if (!grouped[city]) {
        grouped[city] = [];
      }
      grouped[city].push(property);
    });
    
    // Check if builder has properties in the selected city
    const hasSelectedCity = headerSelectedCity && 
      Object.keys(grouped).some(city => 
        city.toLowerCase() === headerSelectedCity.toLowerCase()
      );
    
    // Sort city names - prioritize header city if selected and has properties
    const sortedCityNames = Object.keys(grouped).sort((a, b) => {
      if (headerSelectedCity) {
        if (a.toLowerCase() === headerSelectedCity.toLowerCase()) return -1;
        if (b.toLowerCase() === headerSelectedCity.toLowerCase()) return 1;
      }
      return a.localeCompare(b);
    });
    
    return { 
      propertiesByCity: grouped, 
      cityNames: sortedCityNames,
      hasPropertiesInSelectedCity: hasSelectedCity || false
    };
  }, [properties, headerSelectedCity]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !builder) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center gap-4">
          <Building2 className="h-16 w-16 text-muted-foreground" />
          <h1 className="text-2xl font-semibold">Builder Not Found</h1>
          <p className="text-muted-foreground">The builder you're looking for doesn't exist.</p>
          <Link href="/builders">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Builders
            </Button>
          </Link>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <BuilderSEO
        name={builder.companyName}
        location={builder.city || undefined}
        projectCount={builder.propertyCount || 0}
        imageUrl={builder.logoUrl || undefined}
      />
      <Header />
      
      <main className="flex-1">
        {builder.bannerImage && (
          <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden">
            <img 
              src={builder.bannerImage} 
              alt={builder.companyName}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>
        )}

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row gap-6 items-start mb-8">
            <div className="h-32 w-32 rounded-lg overflow-hidden bg-muted flex items-center justify-center flex-shrink-0 border">
              {builder.logoUrl ? (
                <img 
                  src={builder.logoUrl} 
                  alt={builder.companyName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <Building2 className="h-16 w-16 text-muted-foreground" />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <h1 className="font-serif font-bold text-3xl" data-testid="text-builder-name">
                  {builder.companyName}
                </h1>
                {builder.isVerified && (
                  <Badge className="flex items-center gap-1 bg-primary">
                    <BadgeCheck className="h-3 w-3" />
                    Verified
                  </Badge>
                )}
              </div>
              
              <div className="flex flex-wrap gap-4 text-muted-foreground mb-4">
                {(builder.city || builder.state) && (
                  <span className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {[builder.city, builder.state].filter(Boolean).join(", ")}
                  </span>
                )}
                {builder.establishedYear && (
                  <span className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Established {builder.establishedYear}
                  </span>
                )}
                {builder.website && (
                  <a 
                    href={builder.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center gap-1 text-primary hover:underline"
                  >
                    <Globe className="h-4 w-4" />
                    Website
                    <ExternalLink className="h-3 w-3" />
                  </a>
                )}
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge variant="secondary" className="text-sm">
                  <Building className="h-3 w-3 mr-1" />
                  {builder.propertyCount || 0} Properties
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            <div className="lg:col-span-2 space-y-8">
              {builder.aboutText && (
                <Card className="p-6">
                  <h2 className="font-semibold text-xl mb-4">About {builder.companyName}</h2>
                  <p className="text-muted-foreground whitespace-pre-wrap" data-testid="text-about">
                    {builder.aboutText}
                  </p>
                </Card>
              )}

              {builder.description && !builder.aboutText && (
                <Card className="p-6">
                  <h2 className="font-semibold text-xl mb-4">About</h2>
                  <p className="text-muted-foreground" data-testid="text-description">
                    {builder.description}
                  </p>
                </Card>
              )}

              {propertiesLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading properties...</span>
                </div>
              ) : propertiesError ? (
                <Card className="p-8 text-center">
                  <Building2 className="h-12 w-12 text-destructive mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Error loading properties</h3>
                  <p className="text-muted-foreground mb-4">
                    Failed to load properties. Please try again.
                  </p>
                  <Link href={`/listings?sellerId=${builder.sellerId}`}>
                    <Button variant="outline">
                      View All Properties
                      <ExternalLink className="h-4 w-4 ml-2" />
                    </Button>
                  </Link>
                </Card>
              ) : properties.length > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-xl">
                      Properties by {builder.companyName}
                    </h2>
                    <Link href={`/listings?sellerId=${builder.sellerId}${headerSelectedCity ? `&city=${encodeURIComponent(headerSelectedCity)}` : ''}`}>
                      <Button variant="outline" size="sm">
                        View All
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {properties.map((property) => {
                      // Handle both array format and object format for images
                      const imageUrl = property.images && Array.isArray(property.images) && property.images.length > 0
                        ? (typeof property.images[0] === 'string' 
                            ? property.images[0] 
                            : property.images[0]?.url)
                        : null;
                      
                      return (
                        <Link key={property.id} href={`/property/${property.id}`}>
                          <Card className="overflow-hidden hover-elevate cursor-pointer">
                            <div className="h-40 bg-muted flex items-center justify-center">
                              <PropertyImageWithFallback 
                                imageUrl={imageUrl}
                                alt={property.title}
                              />
                            </div>
                            <div className="p-4">
                              <h3 className="font-medium line-clamp-1">{property.title}</h3>
                              <p className="text-sm text-muted-foreground line-clamp-1">
                                {property.locality}, {property.city}
                              </p>
                              <p className="font-semibold text-primary mt-2">
                                ₹{(property.price / 100000).toFixed(2)} Lac
                              </p>
                            </div>
                          </Card>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold text-xl">Properties by {builder.companyName}</h2>
                    <Link href={`/listings?sellerId=${builder.sellerId}`}>
                      <Button variant="outline" size="sm">
                        View All
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                    </Link>
                  </div>
                  <Card className="p-8 text-center">
                    <Building2 className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="font-semibold text-lg mb-2">No properties found</h3>
                    <p className="text-muted-foreground">
                      {headerSelectedCity 
                        ? `No properties available in ${headerSelectedCity} for this builder.`
                        : "No properties available for this builder."}
                    </p>
                  </Card>
                </div>
              )}
            </div>

            <div className="space-y-6 mt-8 lg:sticky lg:top-28 lg:self-start lg:mt-0">
              {(builder.contactPhone || builder.contactEmail || builder.address) && (
                <Card className="p-6">
                  <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
                  <div className="space-y-3">
                    {builder.contactPhone && (
                      <a 
                        href={`tel:${builder.contactPhone}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                        {builder.contactPhone}
                      </a>
                    )}
                    {builder.contactEmail && (
                      <a 
                        href={`mailto:${builder.contactEmail}`}
                        className="flex items-center gap-3 text-muted-foreground hover:text-primary"
                      >
                        <Mail className="h-4 w-4" />
                        {builder.contactEmail}
                      </a>
                    )}
                    {builder.address && (
                      <p className="flex items-start gap-3 text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        {builder.address}
                      </p>
                    )}
                  </div>
                </Card>
              )}

              <Card className="p-6">
                <h2 className="font-semibold text-lg mb-4">Quick Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Total Properties</span>
                    <span className="font-medium">{builder.propertyCount || 0}</span>
                  </div>
                  {builder.establishedYear && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Years in Business</span>
                      <span className="font-medium">{new Date().getFullYear() - builder.establishedYear}+</span>
                    </div>
                  )}
                  <Separator />
                  <div className="flex items-center gap-2 text-primary">
                    <BadgeCheck className="h-5 w-5" />
                    <span className="font-medium">VenGrow Verified Builder</span>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
