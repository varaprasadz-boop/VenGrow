import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
  Home,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import type { Inquiry } from "@shared/schema";

interface InquiryWithProperty extends Inquiry {
  property?: {
    id: string;
    title: string;
    city: string;
    locality?: string;
    price: number;
    transactionType: string;
  };
  seller?: {
    businessName?: string;
    firstName?: string;
    lastName?: string;
  };
}

export default function InquiriesPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const { user } = useAuth();

  const { data: inquiries = [], isLoading } = useQuery<InquiryWithProperty[]>({
    queryKey: ["/api/me/inquiries"],
    enabled: !!user,
  });

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "replied":
      case "responded":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "replied":
      case "responded":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
      default:
        return "";
    }
  };

  const filterInquiries = () => {
    if (selectedTab === "all") return inquiries;
    return inquiries.filter((i) => i.status === selectedTab);
  };

  const filteredInquiries = filterInquiries();

  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === "Rent") {
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const getSellerName = (inquiry: InquiryWithProperty) => {
    if (inquiry.seller?.businessName) return inquiry.seller.businessName;
    if (inquiry.seller?.firstName) {
      return `${inquiry.seller.firstName} ${inquiry.seller.lastName || ''}`.trim();
    }
    return "Seller";
  };

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Breadcrumbs
            homeHref="/buyer/dashboard"
            items={[
              { label: "Inquiries" },
            ]}
            className="mb-4"
          />

          <div className="mb-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-2xl sm:text-3xl">My Inquiries</h1>
                <p className="text-muted-foreground text-sm sm:text-base">
                  {isLoading ? "Loading..." : "Track all your property inquiries"}
                </p>
              </div>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({inquiries.filter((i) => i.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="replied" data-testid="tab-replied">
                Replied ({inquiries.filter((i) => i.status === "replied").length})
              </TabsTrigger>
              <TabsTrigger value="closed" data-testid="tab-closed">
                Closed ({inquiries.filter((i) => i.status === "closed").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                      <div className="flex flex-col gap-4">
                        <Skeleton className="h-6 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-16 w-full" />
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredInquiries.length > 0 ? (
                <div className="space-y-4">
                  {filteredInquiries.map((inquiry) => (
                    <Card key={inquiry.id} className="p-6 hover-elevate active-elevate-2">
                      <div className="flex flex-col md:flex-row md:items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex flex-wrap items-center gap-2 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {inquiry.property?.title || "Property Inquiry"}
                                </h3>
                                <Badge className={getStatusColor(inquiry.status)}>
                                  {getStatusIcon(inquiry.status)}
                                  <span className="ml-1">{inquiry.status}</span>
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {inquiry.property?.locality}, {inquiry.property?.city}
                              </p>
                              <p className="text-sm font-medium text-primary">
                                {inquiry.property && formatPrice(inquiry.property.price, inquiry.property.transactionType)}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-xs text-muted-foreground mb-1">
                                Inquiry ID
                              </p>
                              <p className="text-sm font-medium">INQ-{inquiry.id.slice(0, 6).toUpperCase()}</p>
                            </div>
                          </div>

                          <div className="bg-muted/50 rounded-lg p-4">
                            <p className="text-sm text-muted-foreground mb-2">
                              Your message:
                            </p>
                            <p className="text-sm">{inquiry.message}</p>
                          </div>

                          <div className="flex flex-wrap items-center gap-4 pt-2 text-sm text-muted-foreground">
                            <span>To: {getSellerName(inquiry)}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>

                        <div className="flex md:flex-col gap-2">
                          <Link href={`/properties/${inquiry.propertyId}`}>
                            <Button variant="outline" size="sm" className="flex-1 md:flex-none" data-testid={`button-view-${inquiry.id}`}>
                              <Eye className="h-4 w-4 md:mr-2" />
                              <span className="hidden md:inline">View</span>
                            </Button>
                          </Link>
                          {inquiry.status !== "closed" && (
                            <Link href={`/buyer/chat?inquiry=${inquiry.id}`}>
                              <Button size="sm" className="flex-1 md:flex-none" data-testid={`button-reply-${inquiry.id}`}>
                                <Send className="h-4 w-4 md:mr-2" />
                                <span className="hidden md:inline">Reply</span>
                              </Button>
                            </Link>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No inquiries found
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {selectedTab === "all"
                      ? "You haven't sent any inquiries yet"
                      : `No ${selectedTab} inquiries`}
                  </p>
                  {selectedTab === "all" && (
                    <Link href="/properties">
                      <Button data-testid="button-browse-properties">
                        <Home className="h-4 w-4 mr-2" />
                        Browse Properties
                      </Button>
                    </Link>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
  );
}
