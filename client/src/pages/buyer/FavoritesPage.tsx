import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Heart, Trash2, Share2 } from "lucide-react";
import heroImage from '@assets/generated_images/luxury_indian_apartment_building.png';
import apartmentImage from '@assets/generated_images/modern_apartment_interior_india.png';
import villaImage from '@assets/generated_images/independent_villa_with_garden.png';
import commercialImage from '@assets/generated_images/commercial_office_building_india.png';

export default function FavoritesPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const favorites = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      price: 8500000,
      location: "Bandra West, Mumbai",
      imageUrl: heroImage,
      bedrooms: 3,
      bathrooms: 2,
      area: 1450,
      propertyType: "Apartment",
      isFeatured: true,
      isVerified: true,
      sellerType: "Builder" as const,
      transactionType: "Sale" as const,
      savedDate: "2 days ago",
    },
    {
      id: "2",
      title: "Spacious 2BHK Flat with Modern Amenities",
      price: 45000,
      location: "Koramangala, Bangalore",
      imageUrl: apartmentImage,
      bedrooms: 2,
      bathrooms: 2,
      area: 1200,
      propertyType: "Apartment",
      isVerified: true,
      sellerType: "Individual" as const,
      transactionType: "Rent" as const,
      savedDate: "1 week ago",
    },
    {
      id: "3",
      title: "Beautiful Independent Villa with Garden",
      price: 12500000,
      location: "Whitefield, Bangalore",
      imageUrl: villaImage,
      bedrooms: 4,
      bathrooms: 3,
      area: 2800,
      propertyType: "Villa",
      isVerified: true,
      sellerType: "Broker" as const,
      transactionType: "Sale" as const,
      savedDate: "3 days ago",
    },
    {
      id: "4",
      title: "Modern Commercial Office Space",
      price: 15000000,
      location: "Cyber City, Gurgaon",
      imageUrl: commercialImage,
      area: 3500,
      propertyType: "Commercial",
      isVerified: true,
      sellerType: "Builder" as const,
      transactionType: "Sale" as const,
      savedDate: "5 days ago",
    },
  ];

  const filterByTab = (properties: typeof favorites) => {
    if (selectedTab === "all") return properties;
    if (selectedTab === "sale") return properties.filter(p => p.transactionType === "Sale");
    if (selectedTab === "rent") return properties.filter(p => p.transactionType === "Rent");
    return properties;
  };

  const filteredProperties = filterByTab(favorites);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Heart className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-3xl">My Favorites</h1>
                <p className="text-muted-foreground">
                  {favorites.length} saved properties
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <TabsList>
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({favorites.length})
                </TabsTrigger>
                <TabsTrigger value="sale" data-testid="tab-sale">
                  For Sale ({favorites.filter(p => p.transactionType === "Sale").length})
                </TabsTrigger>
                <TabsTrigger value="rent" data-testid="tab-rent">
                  For Rent ({favorites.filter(p => p.transactionType === "Rent").length})
                </TabsTrigger>
              </TabsList>

              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-share-favorites">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share List
                </Button>
                <Button variant="outline" size="sm" data-testid="button-clear-favorites">
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear All
                </Button>
              </div>
            </div>

            <TabsContent value="all" className="mt-0">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">No favorites yet</h3>
                  <p className="text-muted-foreground mb-6">
                    Start adding properties to your favorites to see them here
                  </p>
                  <Button>Browse Properties</Button>
                </div>
              )}
            </TabsContent>

            <TabsContent value="sale" className="mt-0">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">No properties for sale</h3>
                  <p className="text-muted-foreground">
                    You haven't saved any properties for sale yet
                  </p>
                </div>
              )}
            </TabsContent>

            <TabsContent value="rent" className="mt-0">
              {filteredProperties.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredProperties.map((property) => (
                    <PropertyCard key={property.id} {...property} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">No rental properties</h3>
                  <p className="text-muted-foreground">
                    You haven't saved any rental properties yet
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
