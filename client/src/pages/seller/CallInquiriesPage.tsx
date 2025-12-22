import { useQuery } from "@tanstack/react-query";

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
  Phone,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Inquiry } from "@shared/schema";

interface InquiryWithDetails extends Inquiry {
  property?: { title: string; city: string };
  buyer?: { firstName: string | null; lastName: string | null; email: string | null; phone: string | null };
}

export default function SellerCallInquiriesPage() {
  const { data: inquiries = [], isLoading, isError, refetch } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/seller/inquiries", { sourceType: "call" }],
  });

  const callInquiries = inquiries.filter(i => i.sourceType === "call");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"><CheckCircle className="h-3 w-3 mr-1" />Called</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
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
  
      </main>
    );
  }

  if (isError) {
  return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
        <div className="text-center p-8">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h2 className="text-xl font-semibold mb-2">Failed to Load Call Requests</h2>
          <Button onClick={() => refetch()} data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />Retry
          </Button>
  
      </main>
    );
  }

  return (
    <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Phone className="h-6 w-6 text-purple-600" />
      
            <div>
              <h1 className="font-serif font-bold text-3xl">Call Requests</h1>
              <p className="text-muted-foreground">Buyers who want a call back ({callInquiries.length})</p>
      
    

          <Card className="p-6">
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Phone Number</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Requested</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {callInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No call requests yet
                      </TableCell>
                    </TableRow>
                  ) : (
                    callInquiries.map((inquiry) => (
                      <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                        <TableCell>
                          <p className="font-medium">{inquiry.property?.title || "Unknown"}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.property?.city}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-medium">{inquiry.buyer?.firstName} {inquiry.buyer?.lastName}</p>
                          <p className="text-sm text-muted-foreground">{inquiry.buyer?.email}</p>
                        </TableCell>
                        <TableCell>
                          <p className="font-mono font-medium">{inquiry.buyerPhone || inquiry.buyer?.phone || "-"}</p>
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell className="text-center text-sm">
                          {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" data-testid={`button-view-${inquiry.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button size="sm" data-testid={`button-mark-called-${inquiry.id}`}>
                              <CheckCircle className="h-4 w-4 mr-1" />Mark Called
                            </Button>
                    
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
      
          </Card>
  
      </main>
  );
}
