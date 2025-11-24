import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  MoreVertical,
  UserX,
  Eye,
  Mail,
  Phone,
  Calendar,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function UserManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const users = [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      type: "Buyer",
      status: "active",
      joinedDate: "Oct 15, 2025",
      lastActive: "2 hours ago",
      properties: { favorited: 12, inquired: 5 },
    },
    {
      id: "2",
      name: "Prestige Estates",
      email: "info@prestige.com",
      phone: "+91 22 1234 5678",
      type: "Seller (Builder)",
      status: "active",
      joinedDate: "Sep 10, 2025",
      lastActive: "1 hour ago",
      properties: { listed: 8, views: 1234 },
    },
    {
      id: "3",
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98123 45678",
      type: "Buyer",
      status: "active",
      joinedDate: "Nov 1, 2025",
      lastActive: "3 days ago",
      properties: { favorited: 5, inquired: 2 },
    },
    {
      id: "4",
      name: "Real Estate Pro",
      email: "contact@realestatepro.com",
      phone: "+91 98456 78901",
      type: "Seller (Broker)",
      status: "suspended",
      joinedDate: "Aug 5, 2025",
      lastActive: "1 week ago",
      properties: { listed: 15, views: 567 },
    },
  ];

  const filterUsers = () => {
    let filtered = users;
    if (selectedTab === "buyers") {
      filtered = filtered.filter((u) => u.type.startsWith("Buyer"));
    } else if (selectedTab === "sellers") {
      filtered = filtered.filter((u) => u.type.startsWith("Seller"));
    } else if (selectedTab === "suspended") {
      filtered = filtered.filter((u) => u.status === "suspended");
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          u.email.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredUsers = filterUsers();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage all platform users
            </p>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
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
                All Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="buyers" data-testid="tab-buyers">
                Buyers ({users.filter((u) => u.type.startsWith("Buyer")).length})
              </TabsTrigger>
              <TabsTrigger value="sellers" data-testid="tab-sellers">
                Sellers ({users.filter((u) => u.type.startsWith("Seller")).length})
              </TabsTrigger>
              <TabsTrigger value="suspended" data-testid="tab-suspended">
                Suspended ({users.filter((u) => u.status === "suspended").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filteredUsers.map((user) => (
                  <Card key={user.id} className="p-6">
                    <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                      {/* User Info */}
                      <div className="flex-1 space-y-4">
                        <div>
                          <div className="flex items-start gap-3 mb-2">
                            <h3 className="font-semibold text-lg flex-1">
                              {user.name}
                            </h3>
                            {user.status === "suspended" ? (
                              <Badge variant="destructive">Suspended</Badge>
                            ) : (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                Active
                              </Badge>
                            )}
                          </div>
                          <Badge variant="outline" className="mb-3">
                            {user.type}
                          </Badge>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Mail className="h-4 w-4" />
                              {user.email}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Phone className="h-4 w-4" />
                              {user.phone}
                            </div>
                            <div className="flex items-center gap-2 text-muted-foreground">
                              <Calendar className="h-4 w-4" />
                              Joined {user.joinedDate}
                            </div>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap gap-6 text-sm">
                          {user.properties.listed !== undefined && (
                            <>
                              <div>
                                <span className="text-muted-foreground">Listed: </span>
                                <span className="font-medium">{user.properties.listed}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Views: </span>
                                <span className="font-medium">{user.properties.views}</span>
                              </div>
                            </>
                          )}
                          {user.properties.favorited !== undefined && (
                            <>
                              <div>
                                <span className="text-muted-foreground">Favorited: </span>
                                <span className="font-medium">{user.properties.favorited}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Inquiries: </span>
                                <span className="font-medium">{user.properties.inquired}</span>
                              </div>
                            </>
                          )}
                        </div>

                        {/* Last Active */}
                        <p className="text-xs text-muted-foreground">
                          Last active: {user.lastActive}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex lg:flex-col gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 lg:flex-none"
                          data-testid={`button-view-${user.id}`}
                        >
                          <Eye className="h-4 w-4 lg:mr-2" />
                          <span className="hidden lg:inline">View Details</span>
                        </Button>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              data-testid={`button-more-${user.id}`}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>
                              <Mail className="h-4 w-4 mr-2" />
                              Send Email
                            </DropdownMenuItem>
                            {user.status === "active" ? (
                              <DropdownMenuItem className="text-destructive">
                                <UserX className="h-4 w-4 mr-2" />
                                Suspend User
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem>
                                <UserX className="h-4 w-4 mr-2" />
                                Unsuspend User
                              </DropdownMenuItem>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              {filteredUsers.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No users found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} users`}
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
