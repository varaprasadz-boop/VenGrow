import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import PropertyCard from "@/components/PropertyCard";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Heart, Trash2, Share2, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Property } from "@shared/schema";

export default function FavoritesPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const { user } = useAuth();

  const { data: favorites = [], isLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/favorites"],
    enabled: !!user,
  });

  const clearAllMutation = useMutation({
    mutationFn: async () => {
      for (const property of favorites) {
        await apiRequest("DELETE", "/api/me/favorites", { 
          propertyId: property.id 
        });
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/dashboard"] });
      toast({ title: "All favorites cleared" });
    },
    onError: () => {
      toast({ title: "Failed to clear favorites", variant: "destructive" });
    },
  });

  const filterByTab = (properties: Property[]) => {
    if (selectedTab === "all") return properties;
    if (selectedTab === "sale") return properties.filter(p => p.transactionType === "sale");
    if (selectedTab === "rent") return properties.filter(p => p.transactionType === "rent");
    return properties;
  };

  const filteredProperties = filterByTab(favorites);

  const formatPropertyForCard = (property: Property) => ({
    id: property.id,
    title: property.title,
    price: property.price,
    location: `${property.locality || ''}, ${property.city}`.replace(/^, /, ''),
    imageUrl: typeof (property as any).images?.[0] === 'string' 
      ? ((property as any).images?.[0] || '/placeholder-property.jpg')
      : ((property as any).images?.[0]?.url || '/placeholder-property.jpg'),
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area,
    propertyType: property.propertyType,
    isFeatured: property.isFeatured || false,
    isVerified: property.isVerified || false,
    sellerType: "Individual" as const,
    transactionType: (property.transactionType === "sale" ? "Sale" : "Rent") as "Sale" | "Rent",
    addedDate: (property as any).approvedAt || property.createdAt,
  });

  const breadcrumbItems = [
    { label: "Dashboard", href: "/buyer/dashboard" },
    { label: "Favorites" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 rounded-lg bg-primary/10">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">My Favorites</h1>
              <p className="text-muted-foreground">
                {isLoading ? "Loading..." : `${favorites.length} saved properties`}
              </p>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="mb-8">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
            <TabsList>
              <TabsTrigger value="all" data-testid="tab-all">
                All ({favorites.length})
              </TabsTrigger>
              <TabsTrigger value="sale" data-testid="tab-sale">
                For Sale ({favorites.filter(p => p.transactionType === "sale").length})
              </TabsTrigger>
              <TabsTrigger value="rent" data-testid="tab-rent">
                For Rent ({favorites.filter(p => p.transactionType === "rent").length})
              </TabsTrigger>
            </TabsList>

            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={async () => {
                  const url = window.location.href;
                  if (navigator.share) {
                    try {
                      await navigator.share({
                        title: "My Favorite Properties",
                        text: "Check out my favorite properties on VenGrow",
                        url: url,
                      });
                    } catch (err) {
                      // User cancelled
                    }
                  } else {
                    await navigator.clipboard.writeText(url);
                    toast({
                      title: "Link copied to clipboard",
                    });
                  }
                }}
                data-testid="button-share-favorites"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Share List
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                data-testid="button-clear-favorites"
                onClick={() => clearAllMutation.mutate()}
                disabled={favorites.length === 0 || clearAllMutation.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          <TabsContent value={selectedTab} className="mt-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-3">
                    <Skeleton className="h-48 w-full rounded-lg" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                ))}
              </div>
            ) : filteredProperties.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} {...formatPropertyForCard(property)} />
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <Heart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                <h3 className="font-semibold text-xl mb-2">
                  {selectedTab === "all" ? "No favorites yet" : `No ${selectedTab === "sale" ? "sale" : "rental"} properties saved`}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {selectedTab === "all" 
                    ? "Start adding properties to your favorites to see them here"
                    : `You haven't saved any ${selectedTab === "sale" ? "sale" : "rental"} properties yet`}
                </p>
                <Link href="/properties">
                  <Button data-testid="button-browse-properties">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Browse Properties
                  </Button>
                </Link>
              </div>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
