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
  FileText,
  Eye,
  MessageSquare,
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

export default function SellerFormInquiriesPage() {
  const { data: inquiries = [], isLoading, isError, refetch } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/seller/inquiries", { sourceType: "form" }],
  });

  const formInquiries = inquiries.filter(i => i.sourceType === "form");

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"><CheckCircle className="h-3 w-3 mr-1" />Replied</Badge>;
      case "pending":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"><Clock className="h-3 w-3 mr-1" />New</Badge>;
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
          <h2 className="text-xl font-semibold mb-2">Failed to Load Inquiries</h2>
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
          <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <FileText className="h-6 w-6 text-blue-600" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-3xl">Form Submissions</h1>
            <p className="text-muted-foreground">Inquiries from property forms ({formInquiries.length})</p>
          </div>
        </div>

        <Card className="p-6">
          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Property</TableHead>
                  <TableHead>Buyer</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>Message</TableHead>
                  <TableHead className="text-center">Status</TableHead>
                  <TableHead className="text-center">Received</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {formInquiries.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                      No form submissions yet
                    </TableCell>
                  </TableRow>
                ) : (
                  formInquiries.map((inquiry) => (
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
                        <p className="text-sm font-mono">{inquiry.buyerPhone || inquiry.buyer?.phone || "-"}</p>
                      </TableCell>
                      <TableCell>
                        <p className="text-sm truncate max-w-[150px]">{inquiry.message || "-"}</p>
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
                          <Button size="sm" data-testid={`button-reply-${inquiry.id}`}>
                            <MessageSquare className="h-4 w-4 mr-1" />Reply
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
    </main>
  );
}
