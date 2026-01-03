import { useQuery } from "@tanstack/react-query";
import { Link, useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MessageSquare,
  Search,
  FileText,
  MessagesSquare,
  Phone,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Building,
  Download,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import type { Inquiry } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";
import { exportToCSV } from "@/lib/utils";

interface InquiryWithDetails extends Inquiry {
  property?: {
    title: string;
    city: string;
  };
  buyer?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
  };
}

export default function InquiriesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: inquiries = [], isLoading, isError, refetch } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/admin/inquiries"],
  });

  const filteredInquiries = inquiries.filter(inquiry => {
    const matchesSearch = 
      inquiry.property?.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.buyer?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inquiry.message?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const formInquiries = filteredInquiries.filter(i => i.sourceType === "form");
  const chatInquiries = filteredInquiries.filter(i => i.sourceType === "chat");
  const callInquiries = filteredInquiries.filter(i => i.sourceType === "call");

  const handleExport = () => {
    const exportData = filteredInquiries.map(inquiry => ({
      property: inquiry.property?.title || 'N/A',
      city: inquiry.property?.city || 'N/A',
      buyer: inquiry.buyer?.email || 'N/A',
      sourceType: inquiry.sourceType || 'N/A',
      status: inquiry.status || 'pending',
      message: inquiry.message?.slice(0, 100) || '',
      createdAt: inquiry.createdAt ? format(new Date(inquiry.createdAt), "yyyy-MM-dd HH:mm") : 'N/A',
    }));
    exportToCSV(exportData, `inquiries_export_${format(new Date(), 'yyyy-MM-dd')}`, [
      { key: 'property', header: 'Property' },
      { key: 'city', header: 'City' },
      { key: 'buyer', header: 'Buyer Email' },
      { key: 'sourceType', header: 'Source' },
      { key: 'status', header: 'Status' },
      { key: 'message', header: 'Message (truncated)' },
      { key: 'createdAt', header: 'Date' },
    ]);
  };

  const handleView = (inquiry: InquiryWithDetails) => {
    toast({
      title: "Inquiry Details",
      description: `Viewing inquiry for ${inquiry.property?.title || 'property'}`,
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "replied":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Replied
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "closed":
        return (
          <Badge variant="secondary">
            Closed
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSourceIcon = (sourceType: string) => {
    switch (sourceType) {
      case "form":
        return <FileText className="h-4 w-4" />;
      case "chat":
        return <MessagesSquare className="h-4 w-4" />;
      case "call":
        return <Phone className="h-4 w-4" />;
      default:
        return <MessageSquare className="h-4 w-4" />;
    }
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96 mb-8" />
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
            <p className="text-muted-foreground mb-4">
              There was an error loading the inquiry data.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  const renderInquiryTable = (items: InquiryWithDetails[]) => (
    <div className="border rounded-lg overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Source</TableHead>
            <TableHead>Property</TableHead>
            <TableHead>Buyer</TableHead>
            <TableHead>Message</TableHead>
            <TableHead className="text-center">Status</TableHead>
            <TableHead className="text-center">Date</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {items.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                No inquiries found
              </TableCell>
            </TableRow>
          ) : (
            items.map((inquiry) => (
              <TableRow key={inquiry.id} data-testid={`row-inquiry-${inquiry.id}`}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    {getSourceIcon(inquiry.sourceType || "form")}
                    <span className="capitalize">{inquiry.sourceType || "form"}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium truncate max-w-[200px]">{inquiry.property?.title || "Unknown"}</p>
                    <p className="text-sm text-muted-foreground">{inquiry.property?.city}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <div>
                    <p className="font-medium">
                      {inquiry.buyer?.firstName} {inquiry.buyer?.lastName}
                    </p>
                    <p className="text-sm text-muted-foreground">{inquiry.buyer?.email}</p>
                  </div>
                </TableCell>
                <TableCell>
                  <p className="text-sm truncate max-w-[200px]">{inquiry.message || "-"}</p>
                </TableCell>
                <TableCell className="text-center">
                  {getStatusBadge(inquiry.status)}
                </TableCell>
                <TableCell className="text-center">
                  <div>
                    <p className="text-sm">{format(new Date(inquiry.createdAt), "MMM d, yyyy")}</p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleView(inquiry)} data-testid={`button-view-${inquiry.id}`}>
                    <Eye className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  );

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Inquiry Management
              </h1>
              <p className="text-muted-foreground">
                View and manage all property inquiries across the platform
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading} data-testid="button-refresh">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={handleExport} data-testid="button-export-inquiries">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <MessageSquare className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{inquiries.length}</p>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <FileText className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formInquiries.length}</p>
                  <p className="text-sm text-muted-foreground">Form Submissions</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <MessagesSquare className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{chatInquiries.length}</p>
                  <p className="text-sm text-muted-foreground">Chat Inquiries</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Phone className="h-5 w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{callInquiries.length}</p>
                  <p className="text-sm text-muted-foreground">Call Requests</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by property, buyer, or message..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>

            <Tabs defaultValue="all" className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({filteredInquiries.length})
                </TabsTrigger>
                <TabsTrigger value="form" data-testid="tab-form">
                  Form ({formInquiries.length})
                </TabsTrigger>
                <TabsTrigger value="chat" data-testid="tab-chat">
                  Chat ({chatInquiries.length})
                </TabsTrigger>
                <TabsTrigger value="call" data-testid="tab-call">
                  Call ({callInquiries.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="all">
                {renderInquiryTable(filteredInquiries)}
              </TabsContent>
              <TabsContent value="form">
                {renderInquiryTable(formInquiries)}
              </TabsContent>
              <TabsContent value="chat">
                {renderInquiryTable(chatInquiries)}
              </TabsContent>
              <TabsContent value="call">
                {renderInquiryTable(callInquiries)}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    );
}
