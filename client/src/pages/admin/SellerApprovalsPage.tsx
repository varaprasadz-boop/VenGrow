import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
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
  ChevronRight,
} from "lucide-react";
import { format } from "date-fns";
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
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Skeleton className="h-5 w-48 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-6" />
          <Skeleton className="h-10 w-80 mb-6" />
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
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
    <main className="flex-1 bg-muted/30">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Breadcrumbs
          homeHref="/admin/dashboard"
          items={[
            { label: "User Management", href: "/admin/users" },
            { label: "Seller Approvals" },
          ]}
          className="mb-4"
        />

        <div className="mb-6">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl mb-1">
            Seller Approvals
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base">
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
              <div className="bg-card rounded-lg border overflow-hidden">
                <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
                  <div className="col-span-4">Seller</div>
                  <div className="col-span-2">Type</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Submitted</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>
                <div className="divide-y">
                  {filteredApprovals.map((approval) => {
                    const Icon = sellerTypeIcons[approval.sellerType] || User;
                    return (
                      <div
                        key={approval.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors"
                        data-testid={`row-approval-${approval.id}`}
                      >
                        <div className="sm:col-span-4 flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 hidden sm:flex">
                            <Icon className="h-4 w-4 text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {approval.companyName || "Individual Seller"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate sm:hidden">
                              {approval.sellerType} • {format(new Date(approval.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>
                        
                        <div className="sm:col-span-2 hidden sm:block">
                          <Badge variant="outline" className="capitalize text-xs">
                            {approval.sellerType}
                          </Badge>
                        </div>
                        
                        <div className="sm:col-span-2 hidden sm:block">
                          {approval.verificationStatus === "pending" && (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500 text-xs">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                          {approval.verificationStatus === "verified" && (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500 text-xs">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Verified
                            </Badge>
                          )}
                          {approval.verificationStatus === "rejected" && (
                            <Badge variant="destructive" className="text-xs">
                              <XCircle className="h-3 w-3 mr-1" />
                              Rejected
                            </Badge>
                          )}
                        </div>
                        
                        <div className="sm:col-span-2 hidden sm:block text-sm text-muted-foreground">
                          {format(new Date(approval.createdAt), "MMM d, yyyy")}
                        </div>
                        
                        <div className="sm:col-span-2 flex items-center justify-end gap-2">
                          <Link href={`/admin/seller-approvals/${approval.id}`}>
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-${approval.id}`}
                            >
                              <Eye className="h-4 w-4 sm:mr-1" />
                              <span className="hidden sm:inline">View</span>
                            </Button>
                          </Link>
                          {approval.verificationStatus === "pending" && (
                            <>
                              <Button
                                size="sm"
                                data-testid={`button-approve-${approval.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateVerificationMutation.mutate({ id: approval.id, status: "verified" });
                                }}
                                disabled={updateVerificationMutation.isPending}
                              >
                                <CheckCircle className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Approve</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                data-testid={`button-reject-${approval.id}`}
                                onClick={(e) => {
                                  e.preventDefault();
                                  updateVerificationMutation.mutate({ id: approval.id, status: "rejected" });
                                }}
                                disabled={updateVerificationMutation.isPending}
                              >
                                <XCircle className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Reject</span>
                              </Button>
                            </>
                          )}
                          <Link href={`/admin/seller-approvals/${approval.id}`}>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <ChevronRight className="h-4 w-4" />
                            </Button>
                          </Link>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  );
}
