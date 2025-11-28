import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
  BadgeCheck,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

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
  const { data: requests = [], isLoading, isError, refetch } = useQuery<VerificationRequest[]>({
    queryKey: ["/api/admin/verifications"],
  });

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
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
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
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Verification Requests</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
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
                            <Button variant="ghost" size="sm" data-testid={`button-view-${request.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" data-testid={`button-approve-${request.id}`}>Approve</Button>
                            <Button variant="destructive" size="sm" data-testid={`button-reject-${request.id}`}>Reject</Button>
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
      </main>
      <Footer />
    </div>
  );
}
