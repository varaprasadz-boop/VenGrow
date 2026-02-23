import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
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
  Building,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  Send,
  CalendarX2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import type { Property } from "@shared/schema";

export default function ManageListingsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useAuth();
  const { toast } = useToast();

  const { data: listings = [], isLoading, refetch } = useQuery<Property[]>({
    queryKey: ["/api/me/properties"],
    enabled: !!user,
    queryFn: async () => {
      const response = await fetch("/api/me/properties", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch properties");
      return response.json();
    },
  });

  const submitForReviewMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/properties/${id}/submit-for-approval`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      toast({ 
        title: "Submitted for Review",
        description: "Your property has been submitted for admin approval."
      });
    },
    onError: () => {
      toast({ title: "Failed to submit for review", variant: "destructive" });
    },
  });

  const updatePropertyMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Property> }) => {
      return apiRequest("PATCH", `/api/properties/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      toast({ title: "Listing updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update listing", variant: "destructive" });
    },
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/properties/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      toast({ title: "Listing deleted successfully" });
    },
    onError: (error: Error) => {
      toast({
        title: "Failed to delete listing",
        description: error?.message || "Please try again.",
        variant: "destructive",
      });
    },
  });

  const getWorkflowStatusBadge = (property: Property) => {
    const workflowStatus = property.workflowStatus || "draft";
    const status = property.status;

    const variants: Record<string, { className: string; label: string; icon: any }> = {
      draft: {
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400",
        label: "Draft",
        icon: Edit,
      },
      submitted: {
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500",
        label: "Submitted",
        icon: Clock,
      },
      under_review: {
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
        label: "Under Review",
        icon: Clock,
      },
      approved: {
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        label: "Approved",
        icon: CheckCircle,
      },
      live: {
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        label: "Live",
        icon: CheckCircle,
      },
      needs_reapproval: {
        className: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500",
        label: "Needs Re-approval",
        icon: RefreshCw,
      },
      rejected: {
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500",
        label: "Rejected",
        icon: XCircle,
      },
      sold: {
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500",
        label: "Sold",
        icon: CheckCircle,
      },
      rented: {
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500",
        label: "Rented",
        icon: CheckCircle,
      },
      leased: {
        className: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/20 dark:text-indigo-500",
        label: "Leased",
        icon: CheckCircle,
      },
      expired: {
        className: "bg-amber-100 text-amber-800 dark:bg-amber-900/20 dark:text-amber-500",
        label: "Expired",
        icon: Clock,
      },
    };

    if (status === "expired") {
      return variants.expired;
    }
    if (status === "sold" || status === "rented" || (status as string) === "leased") {
      return variants[status as keyof typeof variants] || variants.draft;
    }

    return variants[workflowStatus] || variants.draft;
  };

  const filterListings = () => {
    let filtered = listings;
    if (selectedTab !== "all") {
      if (selectedTab === "pending") {
        filtered = filtered.filter((l) => 
          l.workflowStatus === "submitted" || l.workflowStatus === "under_review" || l.workflowStatus === "needs_reapproval"
        );
      } else if (selectedTab === "live") {
        filtered = filtered.filter((l) => l.workflowStatus === "live" || l.workflowStatus === "approved");
      } else if (selectedTab === "draft") {
        filtered = filtered.filter((l) => l.workflowStatus === "draft" || !l.workflowStatus);
      } else if (selectedTab === "rejected") {
        filtered = filtered.filter((l) => l.workflowStatus === "rejected");
      } else if (selectedTab === "expired") {
        filtered = filtered.filter((l) => l.status === "expired" || (l.expiresAt && new Date(l.expiresAt) < new Date()));
      } else if (selectedTab === "sold") {
        filtered = filtered.filter((l) => l.status === "sold" || l.status === "rented" || (l.status as string) === "leased");
      }
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.locality && l.locality.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    return filtered;
  };

  const filteredListings = filterListings();

  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === "rent" || transactionType === "lease") {
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const handleSubmitForReview = (id: string) => {
    submitForReviewMutation.mutate(id);
  };

  const handleMarkSold = (id: string) => {
    updatePropertyMutation.mutate({ id, data: { status: "sold" } });
  };

  const handleReactivate = (id: string) => {
    updatePropertyMutation.mutate({ id, data: { status: "active" } });
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deletePropertyMutation.mutate(id);
    }
  };

  const pendingCount = listings.filter((l) => 
    l.workflowStatus === "submitted" || l.workflowStatus === "under_review" || l.workflowStatus === "needs_reapproval"
  ).length;
  const liveCount = listings.filter((l) => l.workflowStatus === "live" || l.workflowStatus === "approved").length;
  const draftCount = listings.filter((l) => l.workflowStatus === "draft" || !l.workflowStatus).length;
  const rejectedCount = listings.filter((l) => l.workflowStatus === "rejected").length;
  const expiredCount = listings.filter((l) => l.status === "expired" || (l.expiresAt && new Date(l.expiresAt) < new Date())).length;
  const soldCount = listings.filter((l) => l.status === "sold" || l.status === "rented").length;

  const breadcrumbItems = [
    { label: "Dashboard", href: "/seller/dashboard" },
    { label: "Manage Listings" },
  ];

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Breadcrumbs items={breadcrumbItems} className="mb-6" />
        
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Manage Listings
              </h1>
              <p className="text-muted-foreground">
                View and manage all your property listings
              </p>
            </div>
            <Link href="/seller/select-form">
              <Button size="lg" data-testid="button-create-listing-manage">
                <Plus className="h-5 w-5 mr-2" />
                Create New Listing
              </Button>
            </Link>
          </div>

          <Alert className="mb-6">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Property Approval Required</AlertTitle>
            <AlertDescription>
              All properties must be approved by admin before they go live. After making changes to an approved property, you'll need to submit it for re-approval.
            </AlertDescription>
          </Alert>

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

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6 flex w-full sm:w-auto flex-wrap gap-2 p-2 h-auto min-h-10">
              <TabsTrigger value="all" data-testid="tab-all" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                All ({listings.length})
              </TabsTrigger>
              <TabsTrigger value="live" data-testid="tab-live" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                <CheckCircle className="h-3 w-3 mr-1" />
                Live ({liveCount})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                <Clock className="h-3 w-3 mr-1" />
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="draft" data-testid="tab-draft" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                <Edit className="h-3 w-3 mr-1" />
                Draft ({draftCount})
              </TabsTrigger>
              <TabsTrigger value="expired" data-testid="tab-expired" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                <CalendarX2 className="h-3 w-3 mr-1" />
                Expired ({expiredCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                <XCircle className="h-3 w-3 mr-1" />
                Rejected ({rejectedCount})
              </TabsTrigger>
              <TabsTrigger value="sold" data-testid="tab-sold" className="px-4 py-2.5 sm:px-3 sm:py-1.5">
                Sold ({soldCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                      <div className="flex flex-col gap-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <div className="flex gap-4">
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredListings.length > 0 ? (
                <div className="space-y-4">
                  {filteredListings.map((listing) => {
                    const statusInfo = getWorkflowStatusBadge(listing);
                    const StatusIcon = statusInfo.icon;
                    const canSubmitForReview = listing.workflowStatus === "draft" || 
                      listing.workflowStatus === "rejected" || 
                      !listing.workflowStatus;
                    const isLive = listing.workflowStatus === "live" || listing.workflowStatus === "approved";

                    return (
                      <Card key={listing.id} className="p-6" data-testid={`card-listing-${listing.id}`}>
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          <div className="flex-1 space-y-4">
                            <div>
                              <div className="flex flex-wrap items-start gap-3 mb-2">
                                <h3 className="font-semibold text-lg flex-1">
                                  {listing.title}
                                </h3>
                                <Badge className={statusInfo.className}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span>{listing.locality}, {listing.city}</span>
                                <span>•</span>
                                <span>{listing.propertyType}</span>
                                <span>•</span>
                                <span className="font-medium text-primary">
                                  {formatPrice(listing.price, listing.transactionType)}
                                </span>
                              </div>
                            </div>

                            {listing.workflowStatus === "rejected" && listing.rejectionReason && (
                              <div className="p-3 bg-destructive/5 border border-destructive/20 rounded-lg">
                                <p className="text-sm text-destructive">
                                  <strong>Rejection Reason:</strong> {listing.rejectionReason}
                                </p>
                              </div>
                            )}

                            <div className="flex flex-wrap items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <Eye className="h-4 w-4 text-muted-foreground" />
                                <span>{listing.viewCount || 0} views</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <Heart className="h-4 w-4 text-muted-foreground" />
                                <span>{listing.favoriteCount || 0} favorites</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                                <span>{listing.inquiryCount || 0} inquiries</span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
                              <span>Created: {format(new Date(listing.createdAt), 'MMM d, yyyy')}</span>
                              <span>•</span>
                              <span>Updated: {format(new Date(listing.updatedAt), 'MMM d, yyyy')}</span>
                              {listing.approvedAt && (
                                <>
                                  <span>•</span>
                                  <span className="text-green-600 dark:text-green-400">
                                    Approved: {format(new Date(listing.approvedAt), 'MMM d, yyyy')}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2">
                            {canSubmitForReview && (
                              <Button
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-submit-${listing.id}`}
                                onClick={() => handleSubmitForReview(listing.id)}
                                disabled={submitForReviewMutation.isPending}
                              >
                                <Send className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Submit for Review</span>
                              </Button>
                            )}
                            <Link href={`/property/${listing.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none w-full"
                                data-testid={`button-view-${listing.id}`}
                              >
                                <Eye className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">View</span>
                              </Button>
                            </Link>
                            <Link href={`/seller/property/edit/${listing.id}`}>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none w-full"
                                data-testid={`button-edit-${listing.id}`}
                              >
                                <Edit className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Edit</span>
                              </Button>
                            </Link>
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
                                {isLive && (
                                  <DropdownMenuItem onClick={() => handleMarkSold(listing.id)}>
                                    <Pause className="h-4 w-4 mr-2" />
                                    Mark as Sold
                                  </DropdownMenuItem>
                                )}
                                {(listing.status === "sold" || listing.status === "rented") && (
                                  <DropdownMenuItem onClick={() => handleReactivate(listing.id)}>
                                    <Play className="h-4 w-4 mr-2" />
                                    Reactivate Listing
                                  </DropdownMenuItem>
                                )}
                                <DropdownMenuSeparator />
                                <DropdownMenuItem 
                                  className="text-destructive"
                                  onClick={() => handleDelete(listing.id)}
                                >
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
              ) : (
                <div className="text-center py-16">
                  {searchQuery ? (
                    <>
                      <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-xl mb-2">
                        No listings found
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        Try a different search term
                      </p>
                    </>
                  ) : (
                    <>
                      <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-xl mb-2">
                        {selectedTab === "all" ? "No listings yet" : `No ${selectedTab} listings`}
                      </h3>
                      <p className="text-muted-foreground mb-6">
                        {selectedTab === "all" ? "Create your first listing to get started" : ""}
                      </p>
                      {selectedTab === "all" && (
                        <Link href="/seller/select-form">
                          <Button data-testid="button-create-first">Create New Listing</Button>
                        </Link>
                      )}
                    </>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
}
