import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  MapPin,
  IndianRupee,
  Building,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { Property, SellerProfile } from "@shared/schema";

interface PropertyWithSeller extends Property {
  seller?: SellerProfile;
}

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  } else if (price >= 100000) {
    return `₹${(price / 100000).toFixed(1)} L`;
  } else if (price >= 1000) {
    return `₹${(price / 1000).toFixed(0)}K`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

export default function ListingModerationPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pending");

  const { data: properties = [], isLoading, isError, refetch } = useQuery<PropertyWithSeller[]>({
    queryKey: ["/api/properties"],
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/properties/${id}`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Status Updated",
        description: "Property status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update property status.",
        variant: "destructive",
      });
    },
  });

  const filterListings = () => {
    const statusMap: Record<string, string[]> = {
      pending: ["pending"],
      flagged: ["rejected"],
      approved: ["active"],
      rejected: ["rejected"],
    };
    return properties.filter((p) => statusMap[selectedTab]?.includes(p.status));
  };

  const filteredListings = filterListings();

  const pendingCount = properties.filter((p) => p.status === "pending").length;
  const activeCount = properties.filter((p) => p.status === "active").length;
  const rejectedCount = properties.filter((p) => p.status === "rejected").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-12 w-full mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Listings</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading property listings. Please try again.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Listing Moderation
            </h1>
            <p className="text-muted-foreground">
              Review and moderate property listings
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">
                Approved ({activeCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredListings.length === 0 ? (
                <div className="text-center py-16">
                  <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No {selectedTab} listings
                  </h3>
                  <p className="text-muted-foreground">
                    There are currently no {selectedTab} property listings
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredListings.map((listing) => (
                    <Card key={listing.id} className="p-6" data-testid={`card-listing-${listing.id}`}>
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {listing.title}
                                  </h3>
                                  {listing.status === "pending" && (
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending Review
                                    </Badge>
                                  )}
                                  {listing.status === "active" && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </Badge>
                                  )}
                                  {listing.status === "rejected" && (
                                    <Badge variant="destructive">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejected
                                    </Badge>
                                  )}
                                  {listing.status === "draft" && (
                                    <Badge variant="secondary">
                                      Draft
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex flex-wrap items-center gap-2 mb-2">
                                  <Badge variant="outline" className="capitalize">{listing.propertyType}</Badge>
                                  <Badge variant="outline" className="capitalize">{listing.transactionType}</Badge>
                                </div>
                                <div className="space-y-1 text-sm">
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <MapPin className="h-4 w-4" />
                                    {listing.locality}, {listing.city}
                                  </div>
                                  <div className="flex items-center gap-2 text-muted-foreground">
                                    <IndianRupee className="h-4 w-4" />
                                    <span className="font-medium text-primary">
                                      {formatPrice(listing.price)}
                                      {listing.transactionType === "rent" && "/month"}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span>Seller: {listing.seller?.companyName || "Individual"}</span>
                            <span>•</span>
                            <span>Submitted {format(new Date(listing.createdAt), "MMM d, yyyy")}</span>
                          </div>

                          {listing.rejectionReason && (
                            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                              <p className="text-sm text-destructive">
                                <strong>Rejection Reason:</strong> {listing.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-view-${listing.id}`}
                          >
                            <Eye className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">View Listing</span>
                          </Button>
                          {listing.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-approve-${listing.id}`}
                                onClick={() => updateStatusMutation.mutate({ id: listing.id, status: "active" })}
                                disabled={updateStatusMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Approve</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-reject-${listing.id}`}
                                onClick={() => updateStatusMutation.mutate({ id: listing.id, status: "rejected" })}
                                disabled={updateStatusMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
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
