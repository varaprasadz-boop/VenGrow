import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Plus,
  Search,
  Eye,
  Heart,
  MessageSquare,
  Edit,
  Trash2,
  MoreVertical,
  Pause,
  Play,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function ManageListingsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const listings = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      type: "Apartment",
      status: "active",
      views: 345,
      favorites: 28,
      inquiries: 12,
      createdDate: "Oct 15, 2025",
      expiryDate: "Dec 15, 2025",
    },
    {
      id: "2",
      title: "Spacious 2BHK Flat with Modern Amenities",
      location: "Koramangala, Bangalore",
      price: "₹45,000/mo",
      type: "Apartment",
      status: "active",
      views: 234,
      favorites: 15,
      inquiries: 8,
      createdDate: "Oct 20, 2025",
      expiryDate: "Dec 20, 2025",
    },
    {
      id: "3",
      title: "Commercial Office Space in IT Park",
      location: "Cyber City, Gurgaon",
      price: "₹1.5 Cr",
      type: "Commercial",
      status: "paused",
      views: 156,
      favorites: 8,
      inquiries: 3,
      createdDate: "Sep 10, 2025",
      expiryDate: "Nov 10, 2025",
    },
    {
      id: "4",
      title: "Beautiful Villa with Garden",
      location: "Whitefield, Bangalore",
      price: "₹1.25 Cr",
      type: "Villa",
      status: "expired",
      views: 567,
      favorites: 42,
      inquiries: 18,
      createdDate: "Aug 1, 2025",
      expiryDate: "Oct 1, 2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      active: {
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        label: "Active",
      },
      paused: {
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500",
        label: "Paused",
      },
      expired: {
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500",
        label: "Expired",
      },
    };
    return variants[status] || variants.active;
  };

  const filterListings = () => {
    let filtered = listings;
    if (selectedTab !== "all") {
      filtered = filtered.filter((l) => l.status === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.location.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredListings = filterListings();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Manage Listings
              </h1>
              <p className="text-muted-foreground">
                View and manage all your property listings
              </p>
            </div>
            <Button size="lg" data-testid="button-create-listing">
              <Plus className="h-5 w-5 mr-2" />
              Create New Listing
            </Button>
          </div>

          {/* Search & Filters */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by title or location..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({listings.length})
              </TabsTrigger>
              <TabsTrigger value="active" data-testid="tab-active">
                Active ({listings.filter((l) => l.status === "active").length})
              </TabsTrigger>
              <TabsTrigger value="paused" data-testid="tab-paused">
                Paused ({listings.filter((l) => l.status === "paused").length})
              </TabsTrigger>
              <TabsTrigger value="expired" data-testid="tab-expired">
                Expired ({listings.filter((l) => l.status === "expired").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filteredListings.map((listing) => {
                  const statusInfo = getStatusBadge(listing.status);
                  return (
                    <Card key={listing.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Main Info */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start gap-3 mb-2">
                              <h3 className="font-semibold text-lg flex-1">
                                {listing.title}
                              </h3>
                              <Badge className={statusInfo.className}>
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                              <span>{listing.location}</span>
                              <span>•</span>
                              <span>{listing.type}</span>
                              <span>•</span>
                              <span className="font-medium text-primary">
                                {listing.price}
                              </span>
                            </div>
                          </div>

                          {/* Stats */}
                          <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <Eye className="h-4 w-4 text-muted-foreground" />
                              <span>{listing.views} views</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Heart className="h-4 w-4 text-muted-foreground" />
                              <span>{listing.favorites} favorites</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <MessageSquare className="h-4 w-4 text-muted-foreground" />
                              <span>{listing.inquiries} inquiries</span>
                            </div>
                          </div>

                          {/* Dates */}
                          <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                            <span>Created: {listing.createdDate}</span>
                            <span>•</span>
                            <span>Expires: {listing.expiryDate}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-view-${listing.id}`}
                          >
                            <Eye className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">View</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-edit-${listing.id}`}
                          >
                            <Edit className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Edit</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-more-${listing.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {listing.status === "active" && (
                                <DropdownMenuItem>
                                  <Pause className="h-4 w-4 mr-2" />
                                  Pause Listing
                                </DropdownMenuItem>
                              )}
                              {listing.status === "paused" && (
                                <DropdownMenuItem>
                                  <Play className="h-4 w-4 mr-2" />
                                  Resume Listing
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-destructive">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Listing
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredListings.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No listings found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {searchQuery
                      ? "Try a different search term"
                      : selectedTab === "all"
                      ? "Create your first listing to get started"
                      : `No ${selectedTab} listings`}
                  </p>
                  {selectedTab === "all" && !searchQuery && (
                    <Button>Create New Listing</Button>
                  )}
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
