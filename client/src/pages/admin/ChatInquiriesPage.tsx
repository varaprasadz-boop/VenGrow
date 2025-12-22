import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  MessagesSquare,
  Search,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import type { Inquiry } from "@shared/schema";

interface InquiryWithDetails extends Inquiry {
  property?: { title: string; city: string };
  buyer?: { firstName: string | null; lastName: string | null; email: string | null };
}

export default function ChatInquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: inquiries = [], isLoading, isError, refetch } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/admin/inquiries", { sourceType: "chat" }],
  });

  const chatInquiries = inquiries.filter(i => i.sourceType === "chat");
  const filteredInquiries = chatInquiries.filter(inquiry =>
    inquiry.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    inquiry.buyer?.email?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"><CheckCircle className="h-3 w-3 mr-1" />Replied</Badge>;
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
            <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
              <MessagesSquare className="h-6 w-6 text-green-600" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Chat Inquiries</h1>
              <p className="text-muted-foreground">Inquiries initiated via chat</p>
            </div>
          </div>

          <Card className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search inquiries..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Last Message</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-center">Started</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInquiries.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        No chat inquiries found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInquiries.map((inquiry) => (
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
                          <p className="text-sm truncate max-w-[200px]">{inquiry.message || "-"}</p>
                        </TableCell>
                        <TableCell className="text-center">{getStatusBadge(inquiry.status)}</TableCell>
                        <TableCell className="text-center">
                          <p className="text-sm">{format(new Date(inquiry.createdAt), "MMM d, yyyy")}</p>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" data-testid={`button-view-${inquiry.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
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
