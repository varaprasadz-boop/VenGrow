import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MoreVertical,
  CheckCircle,
  X,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function InquiriesPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const inquiries = [
    {
      id: "INQ-001",
      buyer: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      property: "Luxury 3BHK Apartment in Prime Location",
      message: "I'm interested in this property. Can we schedule a visit this weekend?",
      date: "Nov 24, 2025, 10:30 AM",
      status: "new",
    },
    {
      id: "INQ-002",
      buyer: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98123 45678",
      property: "Spacious 2BHK Flat with Modern Amenities",
      message: "What's the final price? Is there room for negotiation?",
      date: "Nov 23, 2025, 03:45 PM",
      status: "responded",
    },
    {
      id: "INQ-003",
      buyer: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 97654 32109",
      property: "Commercial Office Space in IT Park",
      message: "Is the property still available? I'd like to know more details.",
      date: "Nov 22, 2025, 11:20 AM",
      status: "new",
    },
    {
      id: "INQ-004",
      buyer: "Sarah Johnson",
      email: "sarah@example.com",
      phone: "+91 96543 21098",
      property: "Luxury 3BHK Apartment in Prime Location",
      message: "Not interested anymore, found another property.",
      date: "Nov 21, 2025, 09:15 AM",
      status: "closed",
    },
  ];

  const filterInquiries = () => {
    let filtered = inquiries;
    if (selectedTab !== "all") {
      filtered = filtered.filter((i) => i.status === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          i.buyer.toLowerCase().includes(searchQuery.toLowerCase()) ||
          i.property.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredInquiries = filterInquiries();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      new: {
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
        label: "New",
      },
      responded: {
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        label: "Responded",
      },
      closed: {
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500",
        label: "Closed",
      },
    };
    return variants[status] || variants.new;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Buyer Inquiries
            </h1>
            <p className="text-muted-foreground">
              Manage inquiries from potential buyers
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by buyer name or property..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="new" data-testid="tab-new">
                New ({inquiries.filter((i) => i.status === "new").length})
              </TabsTrigger>
              <TabsTrigger value="responded" data-testid="tab-responded">
                Responded ({inquiries.filter((i) => i.status === "responded").length})
              </TabsTrigger>
              <TabsTrigger value="closed" data-testid="tab-closed">
                Closed ({inquiries.filter((i) => i.status === "closed").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filteredInquiries.map((inquiry) => {
                  const statusInfo = getStatusBadge(inquiry.status);
                  return (
                    <Card key={inquiry.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Inquiry Info */}
                        <div className="flex-1 space-y-4">
                          <div className="flex items-start gap-4">
                            <Avatar>
                              <AvatarFallback>
                                {inquiry.buyer.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1">
                              <div className="flex items-center flex-wrap gap-3 mb-2">
                                <h3 className="font-semibold text-lg">
                                  {inquiry.buyer}
                                </h3>
                                <Badge className={statusInfo.className}>
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <p className="text-sm text-muted-foreground mb-2">
                                {inquiry.property}
                              </p>
                              <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {inquiry.date}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Mail className="h-4 w-4" />
                                  {inquiry.email}
                                </span>
                                <span className="flex items-center gap-1">
                                  <Phone className="h-4 w-4" />
                                  {inquiry.phone}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Message */}
                          <div className="p-4 bg-muted/50 rounded-lg">
                            <p className="text-sm">{inquiry.message}</p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2">
                          <Button
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-call-${inquiry.id}`}
                          >
                            <Phone className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Call</span>
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-chat-${inquiry.id}`}
                          >
                            <MessageSquare className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Chat</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-more-${inquiry.id}`}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {inquiry.status === "new" && (
                                <DropdownMenuItem>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Mark as Responded
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem>
                                <X className="h-4 w-4 mr-2" />
                                Close Inquiry
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredInquiries.length === 0 && (
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No inquiries found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} inquiries`}
                  </p>
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
