import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  Send,
} from "lucide-react";

export default function InquiriesPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const inquiries = [
    {
      id: "INQ-001",
      property: {
        title: "Luxury 3BHK Apartment in Prime Location",
        location: "Bandra West, Mumbai",
        price: "₹85 L",
      },
      seller: "Prestige Estates",
      status: "pending",
      date: "2 hours ago",
      message: "I'm interested in this property. Can we schedule a site visit?",
      responses: 0,
    },
    {
      id: "INQ-002",
      property: {
        title: "Spacious 2BHK Flat with Modern Amenities",
        location: "Koramangala, Bangalore",
        price: "₹45,000/mo",
      },
      seller: "John Smith",
      status: "replied",
      date: "1 day ago",
      message: "Is this property available for immediate possession?",
      responses: 2,
    },
    {
      id: "INQ-003",
      property: {
        title: "Beautiful Independent Villa with Garden",
        location: "Whitefield, Bangalore",
        price: "₹1.25 Cr",
      },
      seller: "Real Estate Pro",
      status: "closed",
      date: "3 days ago",
      message: "What are the payment terms for this villa?",
      responses: 4,
    },
    {
      id: "INQ-004",
      property: {
        title: "Modern Commercial Office Space",
        location: "Cyber City, Gurgaon",
        price: "₹1.5 Cr",
      },
      seller: "Elite Properties",
      status: "replied",
      date: "5 days ago",
      message: "Can you provide more details about the parking facilities?",
      responses: 1,
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "replied":
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

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <MessageSquare className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-3xl">My Inquiries</h1>
                <p className="text-muted-foreground">
                  Track all your property inquiries
                </p>
              </div>
            </div>
          </div>

          {/* Tabs */}
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
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => (
                  <Card key={inquiry.id} className="p-6 hover-elevate active-elevate-2">
                    <div className="flex flex-col md:flex-row md:items-start gap-6">
                      {/* Content */}
                      <div className="flex-1 space-y-4">
                        {/* Header */}
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {inquiry.property.title}
                              </h3>
                              <Badge className={getStatusColor(inquiry.status)}>
                                {getStatusIcon(inquiry.status)}
                                <span className="ml-1">{inquiry.status}</span>
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-1">
                              {inquiry.property.location}
                            </p>
                            <p className="text-sm font-medium text-primary">
                              {inquiry.property.price}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground mb-1">
                              Inquiry ID
                            </p>
                            <p className="text-sm font-medium">{inquiry.id}</p>
                          </div>
                        </div>

                        {/* Message */}
                        <div className="bg-muted/50 rounded-lg p-4">
                          <p className="text-sm text-muted-foreground mb-2">
                            Your message:
                          </p>
                          <p className="text-sm">{inquiry.message}</p>
                        </div>

                        {/* Footer */}
                        <div className="flex items-center justify-between pt-2">
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>To: {inquiry.seller}</span>
                            <span>•</span>
                            <span>{inquiry.date}</span>
                            {inquiry.responses > 0 && (
                              <>
                                <span>•</span>
                                <span className="flex items-center gap-1">
                                  <MessageSquare className="h-3 w-3" />
                                  {inquiry.responses} {inquiry.responses === 1 ? "reply" : "replies"}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="flex md:flex-col gap-2">
                        <Button variant="outline" size="sm" className="flex-1 md:flex-none" data-testid={`button-view-${inquiry.id}`}>
                          <Eye className="h-4 w-4 md:mr-2" />
                          <span className="hidden md:inline">View</span>
                        </Button>
                        {inquiry.status !== "closed" && (
                          <Button size="sm" className="flex-1 md:flex-none" data-testid={`button-reply-${inquiry.id}`}>
                            <Send className="h-4 w-4 md:mr-2" />
                            <span className="hidden md:inline">Reply</span>
                          </Button>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredInquiries.length === 0 && (
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
                    <Button>Browse Properties</Button>
                  )}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
