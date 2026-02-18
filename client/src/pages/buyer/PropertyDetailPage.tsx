import { useState, useEffect } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Heart,
  Share2,
  MessageSquare,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Home,
  Calendar,
  Building2,
  CheckCircle,
  Flag,
  Loader2,
  Edit,
  Scale,
} from "lucide-react";
import { useCompareOptional } from "@/contexts/CompareContext";
import { format } from "date-fns";
import type { Property } from "@shared/schema";
import { Link } from "wouter";
import { validatePhone, cleanPhone } from "@/utils/validation";

export default function PropertyDetailPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const { user, isAdmin } = useAuth();
  const { toast } = useToast();
  const propertyId = params.id;

  const { data: property, isLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const { data: favorites = [] } = useQuery({
    queryKey: ["/api/me/favorites"],
    enabled: !!user,
  });

  const isFavorited = property ? favorites.some((p: any) => p.id === property.id) : false;

  const favoriteMutation = useMutation({
    mutationFn: async (add: boolean) => {
      if (!property || !user) return;
      if (add) {
        return apiRequest("POST", "/api/me/favorites", {
          propertyId: property.id,
        });
      } else {
        return apiRequest("DELETE", "/api/me/favorites", {
          propertyId: property.id,
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/dashboard"] });
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
      });
    },
    onError: () => {
      toast({
        title: "Failed to update favorites",
        variant: "destructive",
      });
    },
  });

  const handleFavorite = () => {
    if (!user) {
      toast({
        title: "Please login to save favorites",
        variant: "destructive",
      });
      setLocation("/login");
      return;
    }
    favoriteMutation.mutate(!isFavorited);
  };

  const compareContext = useCompareOptional();

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: property?.title || "Property",
          text: `Check out this property: ${property?.title}`,
          url: url,
        });
      } catch (err) {
        // User cancelled or error
      }
    } else {
      // Fallback: Copy to clipboard
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied to clipboard",
      });
    }
  };

  const handleReport = () => {
    toast({
      title: "Report functionality",
      description: "Report dialog will be implemented",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-3/4 mb-4" />
            <Skeleton className="h-6 w-1/2 mb-8" />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <Skeleton className="h-96 w-full" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-64 w-full" />
                <Skeleton className="h-48 w-full" />
              </div>
            </div>
          </div>
        </main>
        <BuyerBottomNav />
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16 lg:pb-8 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Building2 className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif font-bold text-2xl mb-2">Property Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The property you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => setLocation("/properties")}>Browse Properties</Button>
          </Card>
        </main>
        <BuyerBottomNav />
      </div>
    );
  }

  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === "rent" || transactionType === "lease") {
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const transactionTypeLabel = property.transactionType === "sale" ? "For Sale" : 
                               property.transactionType === "rent" ? "For Rent" : "For Lease";

  const location = `${property.locality || ''}, ${property.city || ''}, ${property.state || ''}`.replace(/^, |, $/g, '').replace(/,,/g, ',');
  const amenities = (property.amenities as string[]) || [];
  const features = {
    facing: property.facing || "Not specified",
    floor: property.floor ? `${property.floor}${property.floor === 1 ? 'st' : property.floor === 2 ? 'nd' : property.floor === 3 ? 'rd' : 'th'} Floor` : "Not specified",
    totalFloors: property.totalFloors || "Not specified",
    furnishing: property.furnishing || "Not specified",
    parking: property.parking || "Not specified",
    ageOfProperty: property.ageOfProperty || "Not specified",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        {/* Image Gallery */}
        <div className="relative h-[400px] bg-muted">
          {property.images && property.images.length > 0 ? (
            <img 
              src={typeof property.images[0] === 'string' ? property.images[0] : (property.images[0] as any).url} 
              alt={property.title}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-muted-foreground">No images available</p>
            </div>
          )}
          <div className="absolute top-4 right-4 flex gap-2">
            {isAdmin && (
              <Link href={`/admin/property/edit/${propertyId}`}>
                <Button
                  size="sm"
                  variant="default"
                  data-testid="button-admin-edit"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Property
                </Button>
              </Link>
            )}
            <Button
              size="sm"
              variant="secondary"
              onClick={handleFavorite}
              disabled={favoriteMutation.isPending}
              data-testid="button-favorite"
            >
              {favoriteMutation.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Heart
                  className={`h-4 w-4 mr-2 ${
                    isFavorited ? "fill-current text-red-500" : ""
                  }`}
                />
              )}
              {isFavorited ? "Saved" : "Save"}
            </Button>
            <Button 
              size="sm" 
              variant="secondary" 
              onClick={handleShare}
              data-testid="button-share"
            >
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
            {compareContext && property && (
              <Button
                size="sm"
                variant="secondary"
                onClick={(e) => { e.preventDefault(); compareContext.addToCompare(property.id); }}
                data-testid="button-compare"
              >
                <Scale className="h-4 w-4 mr-2" />
                {compareContext.isInCompare(property.id) ? "In Compare" : "Compare"}
              </Button>
            )}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Title & Price */}
              <div>
                <div className="flex items-start justify-between gap-4 mb-3">
                  <h1 className="font-serif font-bold text-3xl">{property.title}</h1>
                  <Button variant="ghost" size="sm" onClick={handleReport} data-testid="button-report">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p className="text-muted-foreground">{location}</p>
                </div>
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 mb-4">
                  <Badge variant="outline" className="h-6 min-h-6 items-center">{property.propertyType}</Badge>
                  <Badge variant="default" className="h-6 min-h-6 items-center" data-testid="badge-status">{transactionTypeLabel}</Badge>
                  {property.possessionStatus && (
                    <Badge variant="outline" className="h-6 min-h-6 items-center" data-testid="badge-possession">
                      {property.possessionStatus}
                    </Badge>
                  )}
                  {property.ageOfProperty && (
                    <Badge variant="outline" className="h-6 min-h-6 items-center" data-testid="badge-property-age">
                      {property.ageOfProperty} old
                    </Badge>
                  )}
                  <span className="text-sm text-muted-foreground whitespace-nowrap" data-testid="text-added-date">
                    Added {format(new Date((property as any).approvedAt || property.createdAt), "MMM d, yyyy")}
                  </span>
                </div>
                {/* Locality Display */}
                <div className="flex items-center gap-2 mb-2">
                  {property.locality && (
                    <>
                      <Badge variant="secondary" className="text-xs" data-testid="badge-locality">
                        {property.locality}
                      </Badge>
                      <span className="text-sm text-muted-foreground">•</span>
                    </>
                  )}
                  <span className="text-sm font-medium" data-testid="text-bhk">
                    {property.bedrooms || 0} BHK {property.propertyType}
                  </span>
                </div>
                <p className="text-4xl font-bold font-serif text-primary mb-2">
                  {formatPrice(property.price, property.transactionType)}
                </p>
              </div>

              <Separator />

              {/* Quick Stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bed className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.bedrooms}</p>
                    <p className="text-xs text-muted-foreground">Bedrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Bath className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.bathrooms}</p>
                    <p className="text-xs text-muted-foreground">Bathrooms</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Maximize className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.area}</p>
                    <p className="text-xs text-muted-foreground">{(property as { areaUnit?: string }).areaUnit || "sq ft"}</p>
                  </div>
                </div>
                {(property as { flooring?: string }).flooring && (
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Home className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{(property as { flooring?: string }).flooring}</p>
                      <p className="text-xs text-muted-foreground">Flooring</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.floor || "N/A"}</p>
                    <p className="text-xs text-muted-foreground">Floor</p>
                  </div>
                </div>
              </div>

              {/* Tabs */}
              <Tabs defaultValue="overview">
                <TabsList>
                  <TabsTrigger value="overview" data-testid="tab-overview">
                    Overview
                  </TabsTrigger>
                  <TabsTrigger value="features" data-testid="tab-features">
                    Features
                  </TabsTrigger>
                  <TabsTrigger value="amenities" data-testid="tab-amenities">
                    Amenities
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Description</h3>
                    <p className="text-muted-foreground whitespace-pre-line">
                      {property.description || "No description available"}
                    </p>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Property Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {features.facing !== "Not specified" && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Facing</span>
                          <span className="font-medium">{features.facing}</span>
                        </div>
                      )}
                      {features.totalFloors !== "Not specified" && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Total Floors</span>
                          <span className="font-medium">{features.totalFloors}</span>
                        </div>
                      )}
                      {features.furnishing !== "Not specified" && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Furnishing</span>
                          <span className="font-medium">{features.furnishing}</span>
                        </div>
                      )}
                      {features.parking !== "Not specified" && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Parking</span>
                          <span className="font-medium">{features.parking}</span>
                        </div>
                      )}
                      {features.ageOfProperty !== "Not specified" && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Age</span>
                          <span className="font-medium">{features.ageOfProperty}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                    {amenities.length > 0 ? (
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                        {amenities.map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <span className="text-sm">{amenity}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-muted-foreground">No amenities listed</p>
                    )}
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seller Card */}
              {(property as any).seller && (
                <Card className="p-6">
                  <div className="flex items-start gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Building2 className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">
                          {(property as any).seller.businessName || 
                           `${(property as any).seller.firstName || ''} ${(property as any).seller.lastName || ''}`.trim() || 
                           'Seller'}
                        </h3>
                        {(property as any).seller.isVerified && (
                          <CheckCircle className="h-4 w-4 text-blue-600" />
                        )}
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {(property as any).seller.sellerType || 'Individual'}
                      </Badge>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {(() => {
                      const sellerPhone = property.contactPhone || (property as any).seller?.phone || (property as any).sellerUser?.phone || "";
                      const validPhone = sellerPhone && validatePhone(cleanPhone(sellerPhone));
                      const whatsappNumber = validPhone ? "91" + cleanPhone(sellerPhone) : "";
                      return (
                        <>
                          {validPhone && (
                            <Button
                              className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white"
                              onClick={() => window.open(`https://wa.me/${whatsappNumber}`, "_blank")}
                              data-testid="button-whatsapp"
                            >
                              <MessageSquare className="h-4 w-4 mr-2" />
                              Chat on WhatsApp
                            </Button>
                          )}
                          <Button 
                            variant="outline" 
                            className="w-full" 
                            onClick={() => {
                              const sellerId = (property as any).seller?.id ?? (property as any).sellerId;
                              if (sellerId) {
                                setLocation(`/buyer/chat?sellerId=${encodeURIComponent(sellerId)}&propertyId=${encodeURIComponent(property.id)}`);
                              } else {
                                toast({
                                  title: "Cannot start chat",
                                  description: "Seller information not available",
                                  variant: "destructive",
                                });
                              }
                            }}
                            data-testid="button-chat"
                          >
                            <MessageSquare className="h-4 w-4 mr-2" />
                            Chat with Seller
                          </Button>
                        </>
                      );
                    })()}
                  </div>
                </Card>
              )}

              {/* Schedule Visit */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Schedule a Visit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a property tour at your convenient time
                </p>
                <Button 
                  variant="outline" 
                  className="w-full" 
                  onClick={() => setLocation(`/buyer/schedule-visit?propertyId=${property.id}`)}
                  data-testid="button-schedule"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Visit
                </Button>
              </Card>

              {/* Map Placeholder */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Location</h3>
                <div className="h-48 bg-muted rounded-lg flex items-center justify-center">
                  <p className="text-sm text-muted-foreground">Map View</p>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />

    </div>
  );
}
