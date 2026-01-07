import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Clock,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0";
  }
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function PendingPropertiesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [rejectDialogOpen, setRejectDialogOpen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const { data: allProperties = [], isLoading, isError, refetch } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    queryFn: async () => {
      const response = await fetch("/api/properties", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch properties");
      return response.json();
    },
  });

  // Filter properties that are pending approval (submitted or under review)
  const properties = allProperties.filter(
    (p) => p.workflowStatus === "submitted" ||
      p.workflowStatus === "under_review" ||
      (p.status === "pending" && p.workflowStatus !== "live" && p.workflowStatus !== "rejected")
  );

  const handleRefresh = async () => {
    const result = await refetch();
    if (result.isError || result.error) {
      toast({
        title: "Refresh Failed",
        description: "Failed to refresh property data. Please try again.",
        variant: "destructive",
      });
    } else {
      toast({
        title: "Properties Refreshed",
        description: "Property data has been updated successfully.",
      });
    }
  };

  const approveMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      return apiRequest("PATCH", `/api/properties/${propertyId}`, {
        workflowStatus: "live",
        status: "active",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
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
    mutationFn: async ({ propertyId, reason }: { propertyId: string; reason: string }) => {
      return apiRequest("PATCH", `/api/properties/${propertyId}`, {
        workflowStatus: "rejected",
        status: "draft",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      setRejectDialogOpen(false);
      setSelectedProperty(null);
      setRejectReason("");
      toast({
        title: "Property Rejected",
        description: "The property has been rejected.",
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
    if (selectedProperty && rejectReason.trim()) {
      rejectMutation.mutate({ propertyId: selectedProperty.id, reason: rejectReason });
    }
  };

  const openRejectDialog = (property: Property) => {
    setSelectedProperty(property);
    setRejectReason("");
    setRejectDialogOpen(true);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Properties</h2>
          <Button onClick={() => refetch()} data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />Retry
          </Button>
        </div>
      </main>
    );
  }

  return (
    <><main className="flex-1 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Pending Properties</h1>
              <p className="text-muted-foreground">Properties awaiting approval ({properties.length})</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleRefresh} disabled={isLoading} data-testid="button-refresh">
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="p-6">
          <div className="border rounded-lg overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="text-right">Price</TableHead>
                  <TableHead className="text-center">Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {properties.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-16">
                      <Clock className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="font-semibold text-xl mb-2">No Pending Properties</h3>
                      <p className="text-muted-foreground">All properties have been reviewed. Great job!</p>
                    </TableCell>
                  </TableRow>
                ) : (
                  properties.map((property) => (
                    <TableRow key={property.id} data-testid={`row-property-${property.id}`}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{property.title || "Untitled Property"}</p>
                          <p className="text-sm text-muted-foreground">
                            {property.city || "Unknown"}, {property.state || "Unknown"}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="capitalize">{property.propertyType}</Badge>
                      </TableCell>
                      <TableCell className="text-right font-semibold">
                        {formatPrice(property.price ?? 0)}
                      </TableCell>
                      <TableCell className="text-center text-sm">
                        {property.createdAt ? formatDistanceToNow(new Date(property.createdAt), { addSuffix: true }) : "N/A"}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Link href={`/property/${property.id}`}>
                            <Button variant="ghost" size="sm" data-testid={`button-view-${property.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
                          <Button
                            size="sm"
                            data-testid={`button-approve-${property.id}`}
                            onClick={() => approveMutation.mutate(property.id)}
                            disabled={approveMutation.isPending}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />Approve
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            data-testid={`button-reject-${property.id}`}
                            onClick={() => openRejectDialog(property)}
                            disabled={rejectMutation.isPending}
                          >
                            <XCircle className="h-4 w-4 mr-1" />Reject
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>
    </main><Dialog open={rejectDialogOpen} onOpenChange={setRejectDialogOpen}>
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
              data-testid="textarea-reject-reason" />
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
      </Dialog></>
  );
}
