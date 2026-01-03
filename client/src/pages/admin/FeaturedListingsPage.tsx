import { useState } from "react";
import { Link } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Star, Search, MapPin, TrendingUp, Eye, ArrowUpDown, X, RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

function formatPrice(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function FeaturedListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [positionDialogOpen, setPositionDialogOpen] = useState(false);
  const [newPosition, setNewPosition] = useState<number>(1);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: allProperties = [], isLoading, isError, refetch } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const featuredProperties = allProperties.filter(p => p.isFeatured && p.status === "active");

  const removeFeaturedMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      const response = await apiRequest("PATCH", `/api/admin/properties/${propertyId}/featured`, { isFeatured: false });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Feature Removed",
        description: "Property has been removed from featured listings.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to remove featured status.",
        variant: "destructive",
      });
    },
  });

  const handleRemoveFeatured = (property: Property) => {
    removeFeaturedMutation.mutate(property.id);
  };

  const handleChangePosition = (property: Property) => {
    setSelectedProperty(property);
    setNewPosition(featuredProperties.indexOf(property) + 1);
    setPositionDialogOpen(true);
  };

  const handleSavePosition = () => {
    // Position management would require backend support for ordering
    // For now, just show a message
    toast({
      title: "Position Change",
      description: "Position change feature requires backend support. Feature coming soon.",
    });
    setPositionDialogOpen(false);
  };

  const filteredListings = featuredProperties.filter(listing =>
    listing.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.locality?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Featured Listings</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Featured Listings
            </h1>
            <p className="text-muted-foreground">
              Manage premium featured property listings
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Star className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{featuredProperties.length}</p>
                  <p className="text-sm text-muted-foreground">
                    Active Featured
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <TrendingUp className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {featuredProperties.reduce((sum, p) => sum + (p.viewCount || 0), 0).toLocaleString()}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Views</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {featuredProperties.reduce((sum, p) => sum + (p.inquiryCount || 0), 0)}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search featured listings..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Featured Listings */}
          {filteredListings.length === 0 ? (
            <Card className="p-16 text-center">
              <Star className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Featured Listings Found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try adjusting your search criteria"
                  : "No featured listings available at the moment."}
              </p>
            </Card>
          ) : (
            <div className="space-y-4">
              {filteredListings.map((listing, index) => (
              <Card key={listing.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex-shrink-0">
                    <span className="text-xl font-bold text-yellow-600">
                      #{index + 1}
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {listing.title}
                          </h3>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                            <Star className="h-3 w-3 mr-1" />
                            Featured
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{listing.locality || listing.city}, {listing.city}, {listing.state}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold font-serif text-primary mb-3">
                          {formatPrice(listing.price)}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Views</p>
                        <p className="font-semibold">{(listing.viewCount || 0).toLocaleString()}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Inquiries
                        </p>
                        <p className="font-semibold">{listing.inquiryCount || 0}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Featured Since
                        </p>
                        <p className="font-semibold text-xs">
                          {listing.publishedAt ? format(new Date(listing.publishedAt), "MMM d, yyyy") : "N/A"}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Property Type
                        </p>
                        <p className="font-semibold text-xs capitalize">{listing.propertyType}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/property/${listing.id}`}>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-view-${listing.id}`}
                        >
                          <Eye className="h-4 w-4 mr-1" />
                          View Listing
                        </Button>
                      </Link>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleChangePosition(listing)}
                        data-testid={`button-reorder-${listing.id}`}
                      >
                        <ArrowUpDown className="h-4 w-4 mr-1" />
                        Change Position
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveFeatured(listing)}
                        disabled={removeFeaturedMutation.isPending}
                        data-testid={`button-remove-${listing.id}`}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Remove Feature
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
              ))}
            </div>
          )}
        </div>

        <Dialog open={positionDialogOpen} onOpenChange={setPositionDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Change Featured Position</DialogTitle>
              <DialogDescription>
                Set the display position for this featured property (lower numbers appear first).
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <Label htmlFor="position">Position (1-{featuredProperties.length})</Label>
              <Input
                id="position"
                type="number"
                min={1}
                max={featuredProperties.length}
                value={newPosition}
                onChange={(e) => setNewPosition(parseInt(e.target.value) || 1)}
                className="mt-2"
              />
              <p className="text-xs text-muted-foreground mt-2">
                Note: Position management requires backend support for ordering. This feature will be available soon.
              </p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setPositionDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSavePosition}>
                Save Position
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </main>
    );
}
