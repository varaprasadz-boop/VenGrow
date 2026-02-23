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
      if (!property?.id) throw new Error("Property not loaded");
      if (!user) throw new Error("Please log in to save favorites");
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
    onError: (error: Error) => {
      toast({
        title: "Failed to update favorites",
        description: error?.message || "Please try again.",
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
  const p = property as any;
  const features = {
    facing: property.facing || "Not specified",
    floor: property.floor ? `${property.floor}${property.floor === 1 ? 'st' : property.floor === 2 ? 'nd' : property.floor === 3 ? 'rd' : 'th'} Floor` : "Not specified",
    totalFloors: property.totalFloors || "Not specified",
    furnishing: property.furnishing || "Not specified",
    parking: p.carParkingCount != null ? `${p.carParkingCount} car parking` : property.parking || "Not specified",
    ageOfProperty: property.ageOfProperty != null ? `${property.ageOfProperty} years` : "Not specified",
    maintenanceCharges: p.maintenanceCharges != null ? `₹${Number(p.maintenanceCharges).toLocaleString("en-IN")}/month` : null,
    viewType: p.viewType || null,
    superBuiltUpArea: p.superBuiltUpArea != null ? `${p.superBuiltUpArea} ${(property as { areaUnit?: string }).areaUnit || "Sq-ft"}` : null,
    numberOfLifts: p.numberOfLifts != null ? p.numberOfLifts : null,
    isNegotiable: p.isNegotiable,
    securityDeposit: p.securityDeposit != null ? `₹${Number(p.securityDeposit).toLocaleString("en-IN")}` : null,
    lockInMonths: p.lockInMonths != null ? `${p.lockInMonths} months` : null,
    tenantsPreferred: p.tenantsPreferred || null,
    nearbyLandmark: p.nearbyLandmark || null,
    isResale: p.isResale,
    totalFlats: p.totalFlats != null ? p.totalFlats : null,
    flatsOnFloor: p.flatsOnFloor != null ? p.flatsOnFloor : null,
    totalVillas: p.totalVillas != null ? p.totalVillas : null,
    isCornerProperty: p.isCornerProperty,
    roadWidthFeet: p.roadWidthFeet != null ? p.roadWidthFeet : null,
    liftsAvailable: p.liftsAvailable,
    availableFrom: p.availableFrom || null,
    plotLength: p.plotLength != null ? p.plotLength : null,
    plotBreadth: p.plotBreadth != null ? p.plotBreadth : null,
    isCornerPlot: p.isCornerPlot,
    roadWidthPlotMeters: p.roadWidthPlotMeters != null ? p.roadWidthPlotMeters : null,
    clubHouseAvailable: p.clubHouseAvailable,
    floorAllowedConstruction: p.floorAllowedConstruction != null ? p.floorAllowedConstruction : null,
    soilType: p.soilType || null,
    fencing: p.fencing,
    waterSource: p.waterSource || null,
    titleClear: p.titleClear,
    farmHouse: p.farmHouse,
    approachRoadType: p.approachRoadType || null,
    distanceFromNearestTown: p.distanceFromNearestTown || null,
    farmProjectName: p.farmProjectName || null,
    coLivingName: p.coLivingName || null,
    pgGender: p.pgGender || null,
    pgListedFor: p.pgListedFor || null,
    pgRoomType: p.pgRoomType || null,
    pgAvailableIn: p.pgAvailableIn || null,
    pgFurnishingDetails: p.pgFurnishingDetails || null,
    pgAcAvailable: p.pgAcAvailable,
    pgWashRoomType: p.pgWashRoomType || null,
    pgFacilities: Array.isArray(p.pgFacilities) ? p.pgFacilities : [],
    pgRules: Array.isArray(p.pgRules) ? p.pgRules : [],
    pgCctv: p.pgCctv,
    pgBiometricEntry: p.pgBiometricEntry,
    pgSecurityGuard: p.pgSecurityGuard,
    pgServices: Array.isArray(p.pgServices) ? p.pgServices : [],
    pgFoodProvided: p.pgFoodProvided,
    pgNonVegProvided: p.pgNonVegProvided,
    pgNoticePeriod: p.pgNoticePeriod || null,
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
                      {features.maintenanceCharges && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Maintenance</span>
                          <span className="font-medium">{features.maintenanceCharges}</span>
                        </div>
                      )}
                      {features.viewType && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">View</span>
                          <span className="font-medium">{features.viewType}</span>
                        </div>
                      )}
                      {features.superBuiltUpArea && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Super Built-up</span>
                          <span className="font-medium">{features.superBuiltUpArea}</span>
                        </div>
                      )}
                      {features.numberOfLifts != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Lifts</span>
                          <span className="font-medium">{features.numberOfLifts}</span>
                        </div>
                      )}
                      {property.transactionType === "sale" && features.isNegotiable === true && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Price</span>
                          <span className="font-medium">Negotiable</span>
                        </div>
                      )}
                      {property.transactionType === "sale" && (features.isResale === true || features.isResale === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Property</span>
                          <span className="font-medium">{features.isResale === true ? "Resale" : "New property"}</span>
                        </div>
                      )}
                      {property.transactionType === "sale" && features.totalFlats != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Total Flats</span>
                          <span className="font-medium">{features.totalFlats}</span>
                        </div>
                      )}
                      {property.transactionType === "sale" && features.flatsOnFloor != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Flats on Floor</span>
                          <span className="font-medium">{features.flatsOnFloor}</span>
                        </div>
                      )}
                      {property.propertyType === "villa" && features.totalVillas != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Total Villas</span>
                          <span className="font-medium">{features.totalVillas}</span>
                        </div>
                      )}
                      {property.propertyType === "villa" && features.totalFloors && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Total Floors</span>
                          <span className="font-medium">{features.totalFloors}</span>
                        </div>
                      )}
                      {property.propertyType === "villa" && (features.isCornerProperty === true || features.isCornerProperty === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Corner Property</span>
                          <span className="font-medium">{features.isCornerProperty === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "villa" && features.roadWidthFeet != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Road width (ft)</span>
                          <span className="font-medium">{features.roadWidthFeet} ft</span>
                        </div>
                      )}
                      {property.propertyType === "villa" && (features.liftsAvailable === true || features.liftsAvailable === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Lifts Available</span>
                          <span className="font-medium">{features.liftsAvailable === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "independent_house" && features.totalVillas != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Total Units</span>
                          <span className="font-medium">{features.totalVillas}</span>
                        </div>
                      )}
                      {property.propertyType === "independent_house" && features.totalFloors && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Total Floors</span>
                          <span className="font-medium">{features.totalFloors}</span>
                        </div>
                      )}
                      {property.propertyType === "independent_house" && (features.isCornerProperty === true || features.isCornerProperty === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Corner Property</span>
                          <span className="font-medium">{features.isCornerProperty === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "independent_house" && features.roadWidthFeet != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Road width (ft)</span>
                          <span className="font-medium">{features.roadWidthFeet} ft</span>
                        </div>
                      )}
                      {property.propertyType === "independent_house" && (features.liftsAvailable === true || features.liftsAvailable === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Lifts Available</span>
                          <span className="font-medium">{features.liftsAvailable === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "plot" && features.plotLength != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Plot Length</span>
                          <span className="font-medium">{features.plotLength}</span>
                        </div>
                      )}
                      {property.propertyType === "plot" && features.plotBreadth != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Plot Breadth</span>
                          <span className="font-medium">{features.plotBreadth}</span>
                        </div>
                      )}
                      {property.propertyType === "plot" && (features.isCornerPlot === true || features.isCornerPlot === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Corner Plot</span>
                          <span className="font-medium">{features.isCornerPlot === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "plot" && features.roadWidthPlotMeters != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Road width (m)</span>
                          <span className="font-medium">{features.roadWidthPlotMeters} m</span>
                        </div>
                      )}
                      {property.propertyType === "plot" && (features.clubHouseAvailable === true || features.clubHouseAvailable === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Club House</span>
                          <span className="font-medium">{features.clubHouseAvailable === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "plot" && property.transactionType === "sale" && features.floorAllowedConstruction != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Floor allowed for Construction</span>
                          <span className="font-medium">{features.floorAllowedConstruction}</span>
                        </div>
                      )}
                      {property.propertyType === "commercial" && features.roadWidthFeet != null && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Width of Road (ft)</span>
                          <span className="font-medium">{features.roadWidthFeet} ft</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && features.soilType && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Soil Type</span>
                          <span className="font-medium">{features.soilType}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && (features.fencing === true || features.fencing === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Fencing</span>
                          <span className="font-medium">{features.fencing === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && features.waterSource && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Water Source</span>
                          <span className="font-medium">{features.waterSource}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && (features.titleClear === true || features.titleClear === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Title Clear</span>
                          <span className="font-medium">{features.titleClear === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && (features.farmHouse === true || features.farmHouse === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Farm House</span>
                          <span className="font-medium">{features.farmHouse === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && features.approachRoadType && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Approach Road</span>
                          <span className="font-medium">{features.approachRoadType}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && features.distanceFromNearestTown && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Distance from Nearest Town</span>
                          <span className="font-medium">{features.distanceFromNearestTown}</span>
                        </div>
                      )}
                      {property.propertyType === "farmhouse" && features.farmProjectName && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Farm Project Name</span>
                          <span className="font-medium">{features.farmProjectName}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).coLivingName && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Co-Living Name</span>
                          <span className="font-medium">{(features as any).coLivingName}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgGender && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Gender</span>
                          <span className="font-medium">{(features as any).pgGender}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgListedFor && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Listed for</span>
                          <span className="font-medium">{(features as any).pgListedFor}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgRoomType && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Room Type</span>
                          <span className="font-medium">{(features as any).pgRoomType}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgAvailableIn && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Available In</span>
                          <span className="font-medium">{(features as any).pgAvailableIn}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgFurnishingDetails && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Furnishing Details</span>
                          <span className="font-medium">{(features as any).pgFurnishingDetails}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && ((features as any).pgAcAvailable === true || (features as any).pgAcAvailable === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">AC</span>
                          <span className="font-medium">{(features as any).pgAcAvailable === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgWashRoomType && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Wash Room</span>
                          <span className="font-medium">{(features as any).pgWashRoomType}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgFacilities?.length > 0 && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Facilities</span>
                          <span className="font-medium">{(features as any).pgFacilities.join(", ")}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgRules?.length > 0 && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Rules</span>
                          <span className="font-medium">{(features as any).pgRules.join(", ")}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" &&
                        ((features as any).pgCctv === true || (features as any).pgCctv === false ||
                         (features as any).pgBiometricEntry === true || (features as any).pgBiometricEntry === false ||
                         (features as any).pgSecurityGuard === true || (features as any).pgSecurityGuard === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Safety</span>
                          <span className="font-medium">
                            {[
                              (features as any).pgCctv === true && "CCTV",
                              (features as any).pgBiometricEntry === true && "Biometric",
                              (features as any).pgSecurityGuard === true && "Security Guard",
                            ].filter(Boolean).join(", ") || "—"}
                          </span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgServices?.length > 0 && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Services</span>
                          <span className="font-medium">{(features as any).pgServices.join(", ")}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && ((features as any).pgFoodProvided === true || (features as any).pgFoodProvided === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Food Provided</span>
                          <span className="font-medium">{(features as any).pgFoodProvided === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && ((features as any).pgNonVegProvided === true || (features as any).pgNonVegProvided === false) && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Non Veg Provided</span>
                          <span className="font-medium">{(features as any).pgNonVegProvided === true ? "Yes" : "No"}</span>
                        </div>
                      )}
                      {property.propertyType === "pg_co_living" && (features as any).pgNoticePeriod && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Notice Period</span>
                          <span className="font-medium">{(features as any).pgNoticePeriod}</span>
                        </div>
                      )}
                      {(property.transactionType === "rent" || property.transactionType === "lease") && features.availableFrom && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Available From</span>
                          <span className="font-medium">
                            {features.availableFrom === "immediate"
                              ? "Immediate"
                              : (() => {
                                  try {
                                    const d = new Date(features.availableFrom);
                                    return isNaN(d.getTime()) ? features.availableFrom : d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
                                  } catch {
                                    return features.availableFrom;
                                  }
                                })()}
                          </span>
                        </div>
                      )}
                      {(property.transactionType === "rent" || property.transactionType === "lease") && features.securityDeposit && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Security Deposit</span>
                          <span className="font-medium">{features.securityDeposit}</span>
                        </div>
                      )}
                      {(property.transactionType === "rent" || property.transactionType === "lease") && features.lockInMonths && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Lock-in</span>
                          <span className="font-medium">{features.lockInMonths}</span>
                        </div>
                      )}
                      {(property.transactionType === "rent" || property.transactionType === "lease") && features.tenantsPreferred && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                          <span className="text-muted-foreground">Tenants Preferred</span>
                          <span className="font-medium">{features.tenantsPreferred}</span>
                        </div>
                      )}
                      {features.nearbyLandmark && (
                        <div className="flex justify-between p-3 bg-muted/50 rounded-lg md:col-span-2">
                          <span className="text-muted-foreground">Nearby Landmark</span>
                          <span className="font-medium">{features.nearbyLandmark}</span>
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

              {/* Schedule Visit - only when seller allows */}
              {(property as any).sellerContactVisibility?.allowScheduleVisit !== false && (
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
              )}

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
