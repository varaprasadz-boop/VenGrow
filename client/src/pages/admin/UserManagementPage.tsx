import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  MoreVertical,
  UserX,
  Eye,
  Mail,
  Calendar,
  Users,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { formatDistanceToNow, format } from "date-fns";
import type { User } from "@shared/schema";

export default function UserManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: users = [], isLoading, isError, refetch } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const filterUsers = () => {
    let filtered = users;
    if (selectedTab === "buyers") {
      filtered = filtered.filter((u) => u.role === "buyer");
    } else if (selectedTab === "sellers") {
      filtered = filtered.filter((u) => u.role === "seller");
    } else if (selectedTab === "suspended") {
      filtered = filtered.filter((u) => !u.isActive);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (u) =>
          (u.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (u.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (u.email?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredUsers = filterUsers();

  const buyerCount = users.filter((u) => u.role === "buyer").length;
  const sellerCount = users.filter((u) => u.role === "seller").length;
  const suspendedCount = users.filter((u) => !u.isActive).length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <Skeleton className="h-10 w-full mb-6" />
            <Skeleton className="h-12 w-96 mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
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
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Users</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading user data. Please try again.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
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

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              User Management
            </h1>
            <p className="text-muted-foreground">
              Manage all platform users
            </p>
          </div>

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

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All Users ({users.length})
              </TabsTrigger>
              <TabsTrigger value="buyers" data-testid="tab-buyers">
                Buyers ({buyerCount})
              </TabsTrigger>
              <TabsTrigger value="sellers" data-testid="tab-sellers">
                Sellers ({sellerCount})
              </TabsTrigger>
              <TabsTrigger value="suspended" data-testid="tab-suspended">
                Suspended ({suspendedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredUsers.length === 0 ? (
                <div className="text-center py-16">
                  <Users className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No users found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} users`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredUsers.map((user) => (
                    <Card key={user.id} className="p-6" data-testid={`card-user-${user.id}`}>
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start gap-3 mb-2 flex-wrap">
                              <h3 className="font-semibold text-lg flex-1">
                                {user.firstName || user.lastName 
                                  ? `${user.firstName || ""} ${user.lastName || ""}`.trim() 
                                  : user.email || "Unknown User"}
                              </h3>
                              {!user.isActive ? (
                                <Badge variant="destructive">Suspended</Badge>
                              ) : (
                                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                  Active
                                </Badge>
                              )}
                            </div>
                            <Badge variant="outline" className="mb-3 capitalize">
                              {user.role}
                            </Badge>
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Mail className="h-4 w-4" />
                                {user.email || "No email"}
                              </div>
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />
                                Joined {format(new Date(user.createdAt), "MMM d, yyyy")}
                              </div>
                            </div>
                          </div>

                          <p className="text-xs text-muted-foreground">
                            Last active: {formatDistanceToNow(new Date(user.updatedAt), { addSuffix: true })}
                          </p>
                        </div>

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
                              {user.isActive ? (
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
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
