import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
  FileEdit,
  User,
  Calendar,
} from "lucide-react";
import { format } from "date-fns";
import type { Property, SellerProfile } from "@shared/schema";

interface ApprovalRequest {
  id: string;
  propertyId: string;
  sellerId: string;
  submittedBy: string;
  approverId?: string;
  status: "pending" | "approved" | "rejected";
  requestType: string;
  decisionReason?: string;
  submittedAt: string;
  decidedAt?: string;
  property: Property;
  sellerProfile?: SellerProfile;
  submitter?: {
    id: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
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
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedApproval, setSelectedApproval] = useState<ApprovalRequest | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: approvalData, isLoading, isError, refetch } = useQuery<{
    success: boolean;
    approvals: ApprovalRequest[];
  }>({
    queryKey: ["/api/admin/property-approvals", selectedTab],
    queryFn: async () => {
      const res = await fetch(`/api/admin/property-approvals?status=${selectedTab === "pending" ? "pending" : selectedTab}`, {
        credentials: "include",
      });
      if (!res.ok) throw new Error("Failed to fetch approvals");
      return res.json();
    },
  });

  const approvals = approvalData?.approvals || [];

  const approveMutation = useMutation({
    mutationFn: async ({ id, notes }: { id: string; notes?: string }) => {
      return apiRequest("POST", `/api/admin/property-approvals/${id}/approve`, { notes });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-approvals"] });
      toast({
        title: "Property Approved",
        description: "The property is now live on the marketplace.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to approve property.",
        variant: "destructive",
      });
    },
  });

  const rejectMutation = useMutation({
    mutationFn: async ({ id, reason }: { id: string; reason: string }) => {
      return apiRequest("POST", `/api/admin/property-approvals/${id}/reject`, { reason });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-approvals"] });
      setRejectDialogOpen(false);
      setSelectedApproval(null);
      setRejectReason("");
      toast({
        title: "Property Rejected",
        description: "The seller will be notified of the rejection.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to reject property.",
        variant: "destructive",
      });
    },
  });

  const handleReject = () => {
    if (selectedApproval && rejectReason.trim()) {
      rejectMutation.mutate({ id: selectedApproval.id, reason: rejectReason });
    }
  };

  const openRejectDialog = (approval: ApprovalRequest) => {
    setSelectedApproval(approval);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
      <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Approvals</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading property approvals. Make sure you're logged in as admin.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
    <>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Property Approval Queue
              </h1>
              <p className="text-muted-foreground">
                Review and approve property listings before they go live
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" data-testid="tab-pending">
                <Clock className="h-4 w-4 mr-2" />
                Pending
              </TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">
                <CheckCircle className="h-4 w-4 mr-2" />
                Approved
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                <XCircle className="h-4 w-4 mr-2" />
                Rejected
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {approvals.length === 0 ? (
                <div className="text-center py-16">
                  <Building className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No {selectedTab === "pending" ? "Pending" : selectedTab === "approved" ? "Approved" : "Rejected"} Approvals
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedTab === "pending" 
                      ? "All properties have been reviewed. Great job!" 
                      : `No ${selectedTab} property approvals to show`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {approvals.map((approval) => (
                    <Card key={approval.id} className="p-6" data-testid={`card-approval-${approval.id}`}>
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start gap-3 mb-3">
                              <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {approval.property?.title || "Untitled Property"}
                                  </h3>
                                  {approval.requestType === "new" && (
                                    <Badge variant="outline" className="text-blue-600 border-blue-300">
                                      New Listing
                                    </Badge>
                                  )}
                                  {approval.requestType === "edit" && (
                                    <Badge variant="outline" className="text-orange-600 border-orange-300">
                                      <FileEdit className="h-3 w-3 mr-1" />
                                      Edit Request
                                    </Badge>
                                  )}
                                  {approval.status === "pending" && (
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending Review
                                    </Badge>
                                  )}
                                  {approval.status === "approved" && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </Badge>
                                  )}
                                  {approval.status === "rejected" && (
                                    <Badge variant="destructive">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejected
                                    </Badge>
                                  )}
                                </div>
                                
                                {approval.property && (
                                  <>
                                    <div className="flex flex-wrap items-center gap-2 mb-2">
                                      <Badge variant="outline" className="capitalize">
                                        {approval.property.propertyType}
                                      </Badge>
                                      <Badge variant="outline" className="capitalize">
                                        {approval.property.transactionType === "sale" ? "For Sale" : 
                                         (approval.property.transactionType as string) === "lease" ? "For Lease" : "For Rent"}
                                      </Badge>
                                      {approval.property.bedrooms && (
                                        <Badge variant="secondary" className="text-xs" data-testid={`badge-bhk-${approval.id}`}>
                                          {approval.property.bedrooms} BHK
                                        </Badge>
                                      )}
                                      {approval.property.furnishing && (
                                        <Badge variant="outline" className="text-xs capitalize" data-testid={`badge-furnishing-${approval.id}`}>
                                          {approval.property.furnishing}
                                        </Badge>
                                      )}
                                      {approval.property.ageOfProperty && (
                                        <Badge variant="outline" className="text-xs" data-testid={`badge-age-${approval.id}`}>
                                          {approval.property.ageOfProperty}
                                        </Badge>
                                      )}
                                      {approval.property.possessionStatus && (
                                        <Badge variant="outline" className="text-xs capitalize" data-testid={`badge-possession-${approval.id}`}>
                                          {approval.property.possessionStatus === "ready-to-move" ? "Ready to Move" : "Under Construction"}
                                        </Badge>
                                      )}
                                    </div>
                                    <div className="space-y-1 text-sm">
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <MapPin className="h-4 w-4" />
                                        {approval.property.locality && <span className="font-medium">{approval.property.locality}, </span>}
                                        {approval.property.city}
                                      </div>
                                      <div className="flex items-center gap-2 text-muted-foreground">
                                        <IndianRupee className="h-4 w-4" />
                                        <span className="font-medium text-primary">
                                          {formatPrice(approval.property.price)}
                                          {(approval.property.transactionType === "rent" || (approval.property.transactionType as string) === "lease") && "/month"}
                                        </span>
                                      </div>
                                    </div>
                                  </>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <User className="h-4 w-4" />
                              {approval.submitter?.firstName} {approval.submitter?.lastName || "Unknown Seller"}
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Submitted {format(new Date(approval.submittedAt), "MMM d, yyyy 'at' h:mm a")}
                            </span>
                          </div>

                          {approval.decisionReason && (
                            <div className={`p-4 rounded-lg ${
                              approval.status === "rejected" 
                                ? "bg-destructive/5 border border-destructive/20" 
                                : "bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-800"
                            }`}>
                              <p className={`text-sm ${
                                approval.status === "rejected" ? "text-destructive" : "text-green-700 dark:text-green-400"
                              }`}>
                                <strong>{approval.status === "rejected" ? "Rejection Reason:" : "Approval Notes:"}</strong>{" "}
                                {approval.decisionReason}
                              </p>
                            </div>
                          )}
                        </div>

                        <div className="flex lg:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-view-${approval.id}`}
                            onClick={() => window.open(`/property/${approval.propertyId}`, "_blank")}
                          >
                            <Eye className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">View Listing</span>
                          </Button>
                          {approval.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-approve-${approval.id}`}
                                onClick={() => approveMutation.mutate({ id: approval.id })}
                                disabled={approveMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Approve</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-reject-${approval.id}`}
                                onClick={() => openRejectDialog(approval)}
                                disabled={rejectMutation.isPending}
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

      <Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Property</DialogTitle>
            <DialogDescription>
              Please provide a reason for rejecting this property. The seller will be notified.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Enter rejection reason..."
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              rows={4}
              data-testid="textarea-reject-reason"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRejectDialogOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={!rejectReason.trim() || rejectMutation.isPending}
              data-testid="button-confirm-reject"
            >
              {rejectMutation.isPending ? "Rejecting..." : "Reject Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
