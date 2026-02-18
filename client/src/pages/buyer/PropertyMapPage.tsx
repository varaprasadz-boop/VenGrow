import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyMapView from "@/components/PropertyMapView";
import PropertyCard from "@/components/PropertyCard";
import type { Property, User } from "@shared/schema";
import { List, Filter, Lock, MapPin } from "lucide-react";

export default function PropertyMapPage() {
  const [, setLocation] = useLocation();
  
  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { limit: 50 }],
    enabled: !!currentUser,
  });

  // Transform properties for PropertyMapView
  const mapProperties = useMemo(() => {
    return properties.map((property) => {
      // Extract first image URL from images array
      const imageUrl = (property as any).images?.length > 0
        ? (typeof (property as any).images[0] === 'string' 
            ? (property as any).images[0] 
            : (property as any).images[0]?.url)
        : '';
      
      return {
        id: property.id,
        title: property.title,
        price: property.price,
        location: `${property.locality || ""}, ${property.city || ""}`.replace(/^, |, $/g, '') || 'Location not specified',
        imageUrl: imageUrl || undefined,
        bedrooms: property.bedrooms || undefined,
        bathrooms: property.bathrooms || undefined,
        area: property.area || undefined,
        propertyType: property.propertyType || undefined,
        isFeatured: property.isFeatured || false,
        isVerified: property.isVerified || false,
        lat: property.latitude ? Number(property.latitude) : 0,
        lng: property.longitude ? Number(property.longitude) : 0,
        transactionType: (property.transactionType || "Sale") as "Sale" | "Lease" | "Rent",
      };
    });
  }, [properties]);

  // Transform properties for PropertyCard
  const cardProperties = useMemo(() => {
    return properties.map((property) => {
      // Extract first image URL from images array
      const imageUrl = (property as any).images?.length > 0
        ? (typeof (property as any).images[0] === 'string' 
            ? (property as any).images[0] 
            : (property as any).images[0]?.url)
        : '';
      
      return {
        id: property.id,
        title: property.title,
        price: property.price,
        location: `${property.locality || ""}, ${property.city || ""}`.replace(/^, |, $/g, '') || 'Location not specified',
        imageUrl: imageUrl || '',
        bedrooms: property.bedrooms || undefined,
        bathrooms: property.bathrooms || undefined,
        area: property.area || 0,
        areaUnit: (property as { areaUnit?: string }).areaUnit,
        propertyType: property.propertyType || "Property",
        isFeatured: property.isFeatured || false,
        isVerified: property.isVerified || false,
        sellerType: ((property as any).sellerType || "Builder") as "Individual" | "Broker" | "Builder",
        transactionType: (property.transactionType || "Sale") as "Sale" | "Lease" | "Rent",
        projectStage: property.projectStage || undefined,
        subcategory: property.subcategoryId || undefined,
        ageOfProperty: property.ageOfProperty ? String(property.ageOfProperty) : undefined,
        city: property.city,
        slug: (property as any).slug || undefined,
      };
    });
  }, [properties]);

  if (!currentUser) {
    return (
      <main className="flex-1 flex items-center justify-center bg-muted/30">
        <Card className="p-8 text-center max-w-md">
          <Lock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-serif font-bold text-2xl mb-2">Sign in Required</h2>
          <p className="text-muted-foreground mb-4">
            Interactive map view is available only for logged-in users
          </p>
          <div className="flex gap-2 justify-center flex-wrap">
            <Button asChild data-testid="button-login">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button variant="outline" asChild data-testid="button-list-view">
              <Link href="/listings">List View</Link>
            </Button>
          </div>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="h-[calc(100vh-4rem)] flex flex-col">
        <div className="border-b p-4">
          <div className="max-w-7xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <h1 className="font-serif font-bold text-2xl">Map View</h1>
            <div className="flex gap-2 flex-wrap">
              <Button variant="outline" size="sm" data-testid="button-filter">
                <Filter className="h-4 w-4 mr-2" />
                Filters
              </Button>
              <Button variant="outline" size="sm" asChild data-testid="button-list">
                <Link href="/listings">
                  <List className="h-4 w-4 mr-2" />
                  List View
                </Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          <div className="flex-1 relative min-h-[300px] lg:min-h-0">
            {isLoading ? (
              <Skeleton className="absolute inset-0" />
            ) : (
              <PropertyMapView
                properties={mapProperties}
                className="h-full"
              />
            )}
          </div>

          <div className="lg:w-96 border-t lg:border-t-0 lg:border-l overflow-y-auto max-h-[40vh] lg:max-h-none bg-background">
            <div className="p-4">
              <h3 className="font-semibold mb-4">
                {isLoading ? (
                  <Skeleton className="h-5 w-32" />
                ) : (
                  `${properties.length} Properties Found`
                )}
              </h3>
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <Skeleton className="aspect-video mb-3" />
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-6 w-24 mb-2" />
                      <Skeleton className="h-3 w-full" />
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {cardProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      {...property}
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
