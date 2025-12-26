import { useState } from "react";
import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import {
  Heart,
  Share2,
  MessageSquare,
  Phone,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Building2,
  CheckCircle,
  Flag,
} from "lucide-react";

export default function PropertyDetailPage() {
  const [isFavorited, setIsFavorited] = useState(false);

  const property = {
    id: "PROP-001",
    title: "Luxury 3BHK Apartment in Prime Location",
    price: "₹85 L",
    location: "Bandra West, Mumbai, Maharashtra",
    locality: "Bandra West",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    status: "For Sale" as "For Sale" | "For Lease" | "For Rent",
    propertyType: "Apartment",
    postedDate: "Oct 15, 2025",
    isNewConstruction: false,
    possessionStatus: "Ready to Move",
    seller: {
      name: "Prestige Estates",
      type: "Builder" as "Individual" | "Broker" | "Builder",
      verified: true,
    },
    features: {
      facing: "North",
      floor: "3rd Floor",
      totalFloors: 10,
      furnishing: "Semi-Furnished",
      parking: "2 Covered",
      ageOfProperty: "2 years",
    },
    amenities: [
      "Swimming Pool",
      "Gym",
      "Garden",
      "Power Backup",
      "Lift",
      "Security",
      "Play Area",
      "Club House",
    ],
    description: `Welcome to your dream home! This spacious 3BHK apartment is located in the heart of Bandra West, offering the perfect blend of luxury and convenience.

The property features modern amenities, ample natural light, and is situated in a well-maintained residential complex with 24/7 security.

Key Highlights:
- Prime location with excellent connectivity
- Close to schools, hospitals, and shopping centers
- Well-ventilated and spacious rooms
- Premium fittings and fixtures
- Covered parking for 2 vehicles`,
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        {/* Image Gallery */}
        <div className="relative h-[400px] bg-muted">
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-muted-foreground">Property Image Gallery</p>
          </div>
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              size="sm"
              variant="secondary"
              onClick={() => setIsFavorited(!isFavorited)}
              data-testid="button-favorite"
            >
              <Heart
                className={`h-4 w-4 mr-2 ${
                  isFavorited ? "fill-current text-red-500" : ""
                }`}
              />
              {isFavorited ? "Saved" : "Save"}
            </Button>
            <Button size="sm" variant="secondary" data-testid="button-share">
              <Share2 className="h-4 w-4 mr-2" />
              Share
            </Button>
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
                  <Button variant="ghost" size="sm" data-testid="button-report">
                    <Flag className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <MapPin className="h-5 w-5 text-muted-foreground" />
                  <p className="text-muted-foreground">{property.location}</p>
                </div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <Badge variant="outline">{property.propertyType}</Badge>
                  <Badge variant="default" data-testid="badge-status">{property.status}</Badge>
                  {property.isNewConstruction && (
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" data-testid="badge-new-construction">
                      New Construction
                    </Badge>
                  )}
                  {!property.isNewConstruction && (
                    <Badge variant="outline" className="text-muted-foreground" data-testid="badge-resale">
                      Resale
                    </Badge>
                  )}
                  <Badge variant="outline" data-testid="badge-possession">
                    {property.possessionStatus}
                  </Badge>
                  <Badge variant="outline" data-testid="badge-property-age">
                    {property.features.ageOfProperty} old
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    Posted {property.postedDate}
                  </span>
                </div>
                {/* Locality Display */}
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary" className="text-xs" data-testid="badge-locality">
                    {property.locality}
                  </Badge>
                  <span className="text-sm text-muted-foreground">•</span>
                  <span className="text-sm font-medium" data-testid="text-bhk">{property.bedrooms} BHK {property.propertyType}</span>
                </div>
                <p className="text-4xl font-bold font-serif text-primary mb-2">
                  {property.price}
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
                    <p className="text-xs text-muted-foreground">sq ft</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 rounded-lg border">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building2 className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold">{property.features.floor}</p>
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
                      {property.description}
                    </p>
                  </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Property Features</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Facing</span>
                        <span className="font-medium">{property.features.facing}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Total Floors</span>
                        <span className="font-medium">{property.features.totalFloors}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Furnishing</span>
                        <span className="font-medium">{property.features.furnishing}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Parking</span>
                        <span className="font-medium">{property.features.parking}</span>
                      </div>
                      <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                        <span className="text-muted-foreground">Age</span>
                        <span className="font-medium">{property.features.ageOfProperty}</span>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="amenities" className="space-y-4">
                  <Card className="p-6">
                    <h3 className="font-semibold text-lg mb-4">Amenities</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                      {property.amenities.map((amenity, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600" />
                          <span className="text-sm">{amenity}</span>
                        </div>
                      ))}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Seller Card */}
              <Card className="p-6">
                <div className="flex items-start gap-3 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Building2 className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="font-semibold">{property.seller.name}</h3>
                      {property.seller.verified && (
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      )}
                    </div>
                    <Badge variant="outline" className="text-xs">
                      {property.seller.type}
                    </Badge>
                  </div>
                </div>
                <div className="space-y-2">
                  <Button className="w-full" data-testid="button-contact">
                    <Phone className="h-4 w-4 mr-2" />
                    Contact Seller
                  </Button>
                  <Button variant="outline" className="w-full" data-testid="button-chat">
                    <MessageSquare className="h-4 w-4 mr-2" />
                    Start Chat
                  </Button>
                </div>
              </Card>

              {/* Schedule Visit */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Schedule a Visit</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Book a property tour at your convenient time
                </p>
                <Button variant="outline" className="w-full" data-testid="button-schedule">
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
