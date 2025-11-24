import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Heart, MapPin, Bed, Bath, Maximize, Trash2, Share2 } from "lucide-react";

export default function WishlistPage() {
  const [properties, setProperties] = useState([
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      type: "Apartment",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      addedDate: "Nov 20, 2025",
    },
    {
      id: "2",
      title: "Modern 2BHK Flat with Amenities",
      location: "Koramangala, Bangalore",
      price: "₹65 L",
      type: "Apartment",
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      addedDate: "Nov 18, 2025",
    },
    {
      id: "3",
      title: "Spacious 4BHK Villa with Garden",
      location: "Whitefield, Bangalore",
      price: "₹1.5 Cr",
      type: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      addedDate: "Nov 15, 2025",
    },
  ]);

  const removeFromWishlist = (id: string) => {
    setProperties(properties.filter((p) => p.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                My Wishlist
              </h1>
              <p className="text-muted-foreground">
                {properties.length} {properties.length === 1 ? "property" : "properties"} saved
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" data-testid="button-share-wishlist">
                <Share2 className="h-4 w-4 mr-2" />
                Share Wishlist
              </Button>
            </div>
          </div>

          {properties.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {properties.map((property) => (
                <Card key={property.id} className="overflow-hidden hover-elevate">
                  <div className="relative">
                    <div className="aspect-video bg-muted flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Image</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute top-2 right-2 bg-white/90 dark:bg-black/90 hover:bg-white dark:hover:bg-black"
                      onClick={() => removeFromWishlist(property.id)}
                      data-testid={`button-remove-${property.id}`}
                    >
                      <Heart className="h-5 w-5 fill-red-500 text-red-500" />
                    </Button>
                    <Badge className="absolute bottom-2 left-2">
                      {property.type}
                    </Badge>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      {property.title}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                    <p className="text-2xl font-bold font-serif text-primary mb-3">
                      {property.price}
                    </p>

                    <div className="flex items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bedrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span>{property.bathrooms}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4 text-muted-foreground" />
                        <span>{property.area} sqft</span>
                      </div>
                    </div>

                    <p className="text-xs text-muted-foreground mb-4">
                      Added on {property.addedDate}
                    </p>

                    <div className="flex gap-2">
                      <Link href={`/property/${property.id}`} className="flex-1">
                        <Button
                          variant="outline"
                          className="w-full"
                          data-testid={`button-view-${property.id}`}
                        >
                          View Details
                        </Button>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromWishlist(property.id)}
                        data-testid={`button-delete-${property.id}`}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Properties Saved</h3>
              <p className="text-muted-foreground mb-6">
                Start adding properties to your wishlist to keep track of your favorites
              </p>
              <Link href="/search">
                <Button>Browse Properties</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
