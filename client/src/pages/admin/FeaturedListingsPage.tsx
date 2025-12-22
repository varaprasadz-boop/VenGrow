import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Star, Search, MapPin, TrendingUp } from "lucide-react";

interface FeaturedListing {
  id: string;
  title: string;
  seller: string;
  location: string;
  price: string;
  views: number;
  inquiries: number;
  featuredSince: string;
  daysRemaining: number;
  position: number;
}

export default function FeaturedListingsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const allFeaturedListings: FeaturedListing[] = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      seller: "Prestige Estates",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      views: 2345,
      inquiries: 45,
      featuredSince: "Nov 20, 2025",
      daysRemaining: 25,
      position: 1,
    },
    {
      id: "2",
      title: "Commercial Office Space in IT Park",
      seller: "DLF Properties",
      location: "Cyber City, Gurgaon",
      price: "₹1.5 Cr",
      views: 1987,
      inquiries: 32,
      featuredSince: "Nov 18, 2025",
      daysRemaining: 23,
      position: 2,
    },
    {
      id: "3",
      title: "Spacious 4BHK Villa with Garden",
      seller: "Real Estate Pro",
      location: "Whitefield, Bangalore",
      price: "₹1.25 Cr",
      views: 1654,
      inquiries: 28,
      featuredSince: "Nov 15, 2025",
      daysRemaining: 20,
      position: 3,
    },
  ];

  const filteredListings = allFeaturedListings.filter(listing =>
    listing.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
    listing.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
                  <p className="text-3xl font-bold">{allFeaturedListings.length}</p>
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
                  <p className="text-3xl font-bold">5,986</p>
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
                  <p className="text-3xl font-bold">105</p>
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
              {filteredListings.map((listing) => (
              <Card key={listing.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 dark:bg-yellow-900/20 flex-shrink-0">
                    <span className="text-xl font-bold text-yellow-600">
                      #{listing.position}
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
                          <span>
                            <strong>Seller:</strong> {listing.seller}
                          </span>
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            <span>{listing.location}</span>
                          </div>
                        </div>
                        <p className="text-2xl font-bold font-serif text-primary mb-3">
                          {listing.price}
                        </p>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Views</p>
                        <p className="font-semibold">{listing.views}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Inquiries
                        </p>
                        <p className="font-semibold">{listing.inquiries}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Featured Since
                        </p>
                        <p className="font-semibold text-xs">
                          {listing.featuredSince}
                        </p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Days Remaining
                        </p>
                        <p className="font-semibold">{listing.daysRemaining}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-view-${listing.id}`}
                      >
                        View Listing
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-reorder-${listing.id}`}
                      >
                        Change Position
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-remove-${listing.id}`}
                      >
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
      </main>
    );
}
