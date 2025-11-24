import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Eye, Share2 } from "lucide-react";

export default function SavedPropertiesPage() {
  const savedProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,200 sqft",
      savedDate: "Nov 20, 2025",
      views: 1234,
    },
    {
      id: "2",
      title: "Modern 2BHK Flat",
      location: "Andheri East, Mumbai",
      price: "₹65 L",
      bedrooms: 2,
      bathrooms: 2,
      area: "950 sqft",
      savedDate: "Nov 18, 2025",
      views: 856,
    },
    {
      id: "3",
      title: "Spacious 4BHK Villa",
      location: "Powai, Mumbai",
      price: "₹1.2 Cr",
      bedrooms: 4,
      bathrooms: 3,
      area: "2,500 sqft",
      savedDate: "Nov 15, 2025",
      views: 2134,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Saved Properties
            </h1>
            <p className="text-muted-foreground">
              {savedProperties.length} properties saved for later
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {savedProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover-elevate">
                <div className="relative">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>
                  <button
                    className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/90 hover-elevate active-elevate-2"
                    data-testid={`button-unsave-${property.id}`}
                  >
                    <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                  </button>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg mb-2 line-clamp-1">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span className="line-clamp-1">{property.location}</span>
                  </div>

                  <p className="text-3xl font-bold font-serif text-primary mb-4">
                    {property.price}
                  </p>

                  <div className="flex gap-2 mb-4">
                    <Badge variant="outline">{property.bedrooms} BHK</Badge>
                    <Badge variant="outline">{property.bathrooms} Bath</Badge>
                    <Badge variant="outline">{property.area}</Badge>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
                    <Eye className="h-3 w-3" />
                    <span>{property.views} views</span>
                    <span>•</span>
                    <span>Saved {property.savedDate}</span>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1"
                      size="sm"
                      data-testid={`button-view-${property.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      data-testid={`button-share-${property.id}`}
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
