import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
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
  FileText,
  Building2,
  User,
  Briefcase,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { SellerProfile } from "@shared/schema";

const sellerTypeIcons = {
  individual: User,
  broker: Briefcase,
  builder: Building2,
} as const;

export default function SellerApprovalsPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pending");

  const { data: sellerProfiles = [], isLoading, isError, refetch } = useQuery<SellerProfile[]>({
    queryKey: ["/api/sellers"],
  });

  const updateVerificationMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      return apiRequest("PATCH", `/api/sellers/${id}`, { verificationStatus: status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/sellers"] });
      toast({
        title: "Status Updated",
        description: "Seller verification status has been updated.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update verification status.",
        variant: "destructive",
      });
    },
  });

  const filterApprovals = () => {
    const statusMap: Record<string, string> = {
      pending: "pending",
      approved: "verified",
      rejected: "rejected",
    };
    return sellerProfiles.filter((s) => s.verificationStatus === statusMap[selectedTab]);
  };

  const filteredApprovals = filterApprovals();

  const pendingCount = sellerProfiles.filter((s) => s.verificationStatus === "pending").length;
  const approvedCount = sellerProfiles.filter((s) => s.verificationStatus === "verified").length;
  const rejectedCount = sellerProfiles.filter((s) => s.verificationStatus === "rejected").length;

  if (isLoading) {
    return (
      <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-12 w-96 mb-6" />
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
            <h2 className="text-xl font-semibold mb-2">Failed to Load Seller Approvals</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading seller data. Please try again.
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
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Seller Approvals
            </h1>
            <p className="text-muted-foreground">
              Review and approve seller registrations
            </p>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">
                Approved ({approvedCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                Rejected ({rejectedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredApprovals.length === 0 ? (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No {selectedTab} approvals
                  </h3>
                  <p className="text-muted-foreground">
                    There are currently no {selectedTab} seller registrations
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredApprovals.map((approval) => {
                    const Icon = sellerTypeIcons[approval.sellerType] || User;
                    return (
                      <Card key={approval.id} className="p-6" data-testid={`card-approval-${approval.id}`}>
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          <div className="flex-1 space-y-4">
                            <div>
                              <div className="flex items-start gap-3 mb-3 flex-wrap">
                                <div className="p-3 rounded-lg bg-primary/10">
                                  <Icon className="h-6 w-6 text-primary" />
                                </div>
                                <div className="flex-1">
                                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                                    <h3 className="font-semibold text-lg">
                                      {approval.companyName || "Individual Seller"}
                                    </h3>
                                    {approval.verificationStatus === "pending" && (
                                      <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                                        <Clock className="h-3 w-3 mr-1" />
                                        Pending
                                      </Badge>
                                    )}
                                    {approval.verificationStatus === "verified" && (
                                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                        <CheckCircle className="h-3 w-3 mr-1" />
                                        Verified
                                      </Badge>
                                    )}
                                    {approval.verificationStatus === "rejected" && (
                                      <Badge variant="destructive">
                                        <XCircle className="h-3 w-3 mr-1" />
                                        Rejected
                                      </Badge>
                                    )}
                                  </div>
                                  <Badge variant="outline" className="mb-3 capitalize">
                                    {approval.sellerType}
                                  </Badge>
                                  <div className="space-y-1 text-sm text-muted-foreground">
                                    {approval.city && approval.state && (
                                      <p>{approval.city}, {approval.state}</p>
                                    )}
                                    {approval.reraNumber && (
                                      <p>RERA: {approval.reraNumber}</p>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex flex-wrap items-center gap-6 text-sm">
                              <div className="flex items-center gap-2">
                                <Clock className="h-4 w-4 text-muted-foreground" />
                                <span>Submitted {format(new Date(approval.createdAt), "MMM d, yyyy")}</span>
                              </div>
                              <div className="flex items-center gap-2">
                                <FileText className="h-4 w-4 text-muted-foreground" />
                                <span>{approval.totalListings} listings</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              data-testid={`button-view-${approval.id}`}
                            >
                              <Eye className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">View Details</span>
                            </Button>
                            {approval.verificationStatus === "pending" && (
                              <>
                                <Button
                                  size="sm"
                                  className="flex-1 lg:flex-none"
                                  data-testid={`button-approve-${approval.id}`}
                                  onClick={() => updateVerificationMutation.mutate({ id: approval.id, status: "verified" })}
                                  disabled={updateVerificationMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4 lg:mr-2" />
                                  <span className="hidden lg:inline">Approve</span>
                                </Button>
                                <Button
                                  variant="destructive"
                                  size="sm"
                                  className="flex-1 lg:flex-none"
                                  data-testid={`button-reject-${approval.id}`}
                                  onClick={() => updateVerificationMutation.mutate({ id: approval.id, status: "rejected" })}
                                  disabled={updateVerificationMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 lg:mr-2" />
                                  <span className="hidden lg:inline">Reject</span>
                                </Button>
                              </>
                            )}
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    );
}
