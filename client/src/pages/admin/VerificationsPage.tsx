import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BadgeCheck,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertCircle,
  FileText,
  Download,
  ExternalLink,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface VerificationRequest {
  id: string;
  sellerId: string;
  sellerName: string;
  sellerType: string;
  status: string;
  documents: string[];
  createdAt: string;
}

export default function VerificationsPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedRequest, setSelectedRequest] = useState<VerificationRequest | null>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { data: requests = [], isLoading, isError, refetch } = useQuery<VerificationRequest[]>({
    queryKey: ["/api/admin/verifications"],
  });

  // Fetch seller details for the selected request
  const { data: sellerDetails } = useQuery<any>({
    queryKey: ["/api/sellers", selectedRequest?.sellerId],
    enabled: !!selectedRequest?.sellerId,
  });

  const updateVerificationMutation = useMutation({
    mutationFn: async ({ sellerId, status }: { sellerId: string; status: string }) => {
      return apiRequest("PATCH", `/api/sellers/${sellerId}`, { verificationStatus: status });
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verifications"] });
      queryClient.invalidateQueries({ queryKey: ["/api/sellers"] });
      toast({
        title: "Status Updated",
        description: `Seller verification has been ${variables.status === "verified" ? "approved" : "rejected"}.`,
      });
      setViewDialogOpen(false);
      setSelectedRequest(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error?.message || "Failed to update verification status.",
        variant: "destructive",
      });
    },
  });

  const handleApprove = (request: VerificationRequest) => {
    if (confirm(`Are you sure you want to approve verification for ${request.sellerName}?`)) {
      updateVerificationMutation.mutate({ sellerId: request.sellerId, status: "verified" });
    }
  };

  const handleReject = (request: VerificationRequest) => {
    if (confirm(`Are you sure you want to reject verification for ${request.sellerName}?`)) {
      updateVerificationMutation.mutate({ sellerId: request.sellerId, status: "rejected" });
    }
  };

  const handleView = (request: VerificationRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"><CheckCircle className="h-3 w-3 mr-1" />Verified</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"><XCircle className="h-3 w-3 mr-1" />Rejected</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
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
            <h2 className="text-xl font-semibold mb-2">Failed to Load Verification Requests</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <BadgeCheck className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Verification Requests</h1>
              <p className="text-muted-foreground">Review and verify seller documents</p>
            </div>
          </div>

          <Card className="p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Documents</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Submitted</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No verification requests
                      </TableCell>
                    </TableRow>
                  ) : (
                    requests.map((request) => (
                      <TableRow key={request.id} data-testid={`row-verification-${request.id}`}>
                        <TableCell>
                          <p className="font-medium">{request.sellerName}</p>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">{request.sellerType}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.documents?.length || 0} docs</Badge>
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(request.status)}</TableCell>
                        <TableCell className="text-center">
                          <p className="text-sm">{formatDistanceToNow(new Date(request.createdAt), { addSuffix: true })}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              data-testid={`button-view-${request.id}`}
                              onClick={() => handleView(request)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {request.status === "pending" && (
                              <>
                                <Button 
                                  size="sm" 
                                  data-testid={`button-approve-${request.id}`}
                                  onClick={() => handleApprove(request)}
                                  disabled={updateVerificationMutation.isPending}
                                  className="bg-green-600 hover:bg-green-700"
                                >
                                  <CheckCircle className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button 
                                  variant="destructive" 
                                  size="sm" 
                                  data-testid={`button-reject-${request.id}`}
                                  onClick={() => handleReject(request)}
                                  disabled={updateVerificationMutation.isPending}
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Reject
                                </Button>
                              </>
                            )}
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

        {/* View Details Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Verification Request Details</DialogTitle>
              <DialogDescription>
                Review seller information and verification documents
              </DialogDescription>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-6">
                {/* Seller Information */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Seller Information</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Name</p>
                      <p className="font-medium">{selectedRequest.sellerName}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Type</p>
                      <Badge variant="outline" className="capitalize">{selectedRequest.sellerType}</Badge>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Status</p>
                      {getStatusBadge(selectedRequest.status)}
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Submitted</p>
                      <p className="font-medium">{formatDistanceToNow(new Date(selectedRequest.createdAt), { addSuffix: true })}</p>
                    </div>
                  </div>

                  {sellerDetails && (
                    <div className="mt-4 pt-4 border-t space-y-2">
                      {sellerDetails.companyName && (
                        <div>
                          <p className="text-sm text-muted-foreground">Company Name</p>
                          <p className="font-medium">{sellerDetails.companyName}</p>
                        </div>
                      )}
                      {sellerDetails.reraNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">RERA Number</p>
                          <p className="font-medium">{sellerDetails.reraNumber}</p>
                        </div>
                      )}
                      {sellerDetails.gstNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">GST Number</p>
                          <p className="font-medium">{sellerDetails.gstNumber}</p>
                        </div>
                      )}
                      {sellerDetails.panNumber && (
                        <div>
                          <p className="text-sm text-muted-foreground">PAN Number</p>
                          <p className="font-medium">{sellerDetails.panNumber}</p>
                        </div>
                      )}
                      {sellerDetails.address && (
                        <div>
                          <p className="text-sm text-muted-foreground">Address</p>
                          <p className="font-medium">{sellerDetails.address}</p>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Verification Documents */}
                <div className="border rounded-lg p-4">
                  <h3 className="font-semibold text-lg mb-4">Verification Documents</h3>
                  {selectedRequest.documents && selectedRequest.documents.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRequest.documents.map((docUrl, index) => (
                        <div key={index} className="border rounded-lg p-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <FileText className="h-5 w-5 text-muted-foreground" />
                              <span className="font-medium">Document {index + 1}</span>
                            </div>
                            <div className="flex gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => window.open(docUrl, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  const a = document.createElement('a');
                                  a.href = docUrl;
                                  a.download = `verification-doc-${index + 1}`;
                                  a.click();
                                }}
                              >
                                <Download className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                          <div className="mt-2">
                            <img 
                              src={docUrl} 
                              alt={`Verification document ${index + 1}`}
                              className="w-full h-48 object-cover rounded border cursor-pointer"
                              onClick={() => window.open(docUrl, '_blank')}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground">No documents uploaded</p>
                  )}
                </div>

                {/* Action Buttons */}
                {selectedRequest.status === "pending" && (
                  <div className="flex justify-end gap-2 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={() => setViewDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleReject(selectedRequest)}
                      disabled={updateVerificationMutation.isPending}
                    >
                      <XCircle className="h-4 w-4 mr-2" />
                      Reject
                    </Button>
                    <Button
                      onClick={() => handleApprove(selectedRequest)}
                      disabled={updateVerificationMutation.isPending}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Approve
                    </Button>
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    );
}
