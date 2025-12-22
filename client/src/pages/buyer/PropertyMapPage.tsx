import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import PropertyMap from "@/components/PropertyMap";
import type { Property, User } from "@shared/schema";
import { MapPin, List, Filter, Lock } from "lucide-react";

export default function PropertyMapPage() {
  const [, setLocation] = useLocation();

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: properties = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { limit: 50 }],
    enabled: !!currentUser,
  });

  const handlePropertyClick = (property: Property) => {
    setLocation(`/property/${property.id}`);
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

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
              <PropertyMap
                properties={properties}
                height="100%"
                zoom={12}
                onPropertyClick={handlePropertyClick}
              />
            )}
          </div>

          <div className="lg:w-96 border-t lg:border-t-0 lg:border-l overflow-y-auto max-h-[40vh] lg:max-h-none">
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
                  {properties.map((property) => (
                    <Card
                      key={property.id}
                      className="p-4 hover-elevate cursor-pointer"
                      onClick={() => handlePropertyClick(property)}
                      data-testid={`property-card-${property.id}`}
                    >
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                        <span className="text-xs text-muted-foreground">
                          {property.propertyType}
                        </span>
                      </div>
                      <h4 className="font-semibold mb-2 truncate">{property.title}</h4>
                      <p className="text-2xl font-bold font-serif text-primary mb-2">
                        {formatPrice(property.price)}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3 flex-shrink-0" />
                        <span className="truncate">
                          {property.locality}, {property.city}
                        </span>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {property.bedrooms && (
                          <Badge variant="outline">{property.bedrooms} BHK</Badge>
                        )}
                        <Badge variant="outline">{property.area} sqft</Badge>
                      </div>
                    </Card>
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
