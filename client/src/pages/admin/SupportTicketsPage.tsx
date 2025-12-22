import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { MessageSquare, Search, Clock, CheckCircle } from "lucide-react";

export default function SupportTicketsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const tickets = [
    {
      id: "TKT-001",
      user: "Rahul Sharma",
      subject: "Payment not reflecting",
      category: "Payment",
      status: "open",
      priority: "high",
      createdAt: "Nov 24, 2025, 10:30 AM",
      lastUpdate: "2 hours ago",
    },
    {
      id: "TKT-002",
      user: "Priya Patel",
      subject: "Unable to upload property images",
      category: "Technical",
      status: "in-progress",
      priority: "medium",
      createdAt: "Nov 23, 2025, 03:45 PM",
      lastUpdate: "5 hours ago",
    },
    {
      id: "TKT-003",
      user: "Amit Kumar",
      subject: "Need help with listing approval",
      category: "General",
      status: "resolved",
      priority: "low",
      createdAt: "Nov 22, 2025, 11:20 AM",
      lastUpdate: "1 day ago",
    },
  ];

  const filterTickets = () => {
    let filtered = tickets;
    if (selectedTab !== "all") {
      filtered = filtered.filter((t) => t.status === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "open":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            Open
          </Badge>
        );
      case "in-progress":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            In Progress
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High</Badge>;
      case "medium":
        return <Badge variant="outline">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Support Tickets
            </h1>
            <p className="text-muted-foreground">
              Manage user support requests
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by ticket ID, user, or subject..."
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
                All ({tickets.length})
              </TabsTrigger>
              <TabsTrigger value="open" data-testid="tab-open">
                Open ({tickets.filter((t) => t.status === "open").length})
              </TabsTrigger>
              <TabsTrigger value="in-progress" data-testid="tab-in-progress">
                In Progress ({tickets.filter((t) => t.status === "in-progress").length})
              </TabsTrigger>
              <TabsTrigger value="resolved" data-testid="tab-resolved">
                Resolved ({tickets.filter((t) => t.status === "resolved").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filterTickets().map((ticket) => (
                  <Card key={ticket.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <MessageSquare className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-1">
                              <h3 className="font-semibold">{ticket.subject}</h3>
                              {getStatusBadge(ticket.status)}
                              {getPriorityBadge(ticket.priority)}
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {ticket.id} • {ticket.user} • {ticket.category}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3" />
                            <span>Created {ticket.createdAt}</span>
                          </div>
                          <span>•</span>
                          <span>Last updated {ticket.lastUpdate}</span>
                        </div>

                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-${ticket.id}`}
                          >
                            View Details
                          </Button>
                          {ticket.status !== "resolved" && (
                            <Button
                              size="sm"
                              data-testid={`button-resolve-${ticket.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Mark Resolved
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filterTickets().length === 0 && (
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">No tickets found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} tickets`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    );
}
