import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Search,
  MoreVertical,
  UserX,
  UserCheck,
  Eye,
  Mail,
  Users,
  AlertCircle,
  RefreshCw,
  ChevronRight,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { User } from "@shared/schema";

export default function UserManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [confirmAction, setConfirmAction] = useState<"suspend" | "unsuspend" | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: users = [], isLoading, isError, refetch } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const updateUserMutation = useMutation({
    mutationFn: async ({ id, isActive }: { id: string; isActive: boolean }) => {
      const res = await apiRequest("PATCH", `/api/admin/users/${id}`, { isActive });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
      toast({
        title: confirmAction === "suspend" ? "User Suspended" : "User Unsuspended",
        description: `${selectedUser?.firstName || selectedUser?.email} has been ${confirmAction === "suspend" ? "suspended" : "unsuspended"}.`,
      });
      setSelectedUser(null);
      setConfirmAction(null);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update user status.",
        variant: "destructive",
      });
    },
  });

  const handleConfirmAction = () => {
    if (!selectedUser || !confirmAction) return;
    updateUserMutation.mutate({
      id: selectedUser.id,
      isActive: confirmAction === "unsuspend",
    });
  };

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
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Skeleton className="h-5 w-48 mb-4" />
          <Skeleton className="h-8 w-64 mb-2" />
          <Skeleton className="h-5 w-48 mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-20 w-full" />
            ))}
          </div>
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
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
    );
  }

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <Breadcrumbs
            homeHref="/admin/dashboard"
            items={[
              { label: "User Management" },
            ]}
            className="mb-4"
          />

          <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
            <div>
              <h1 className="font-serif font-bold text-2xl sm:text-3xl mb-1">
                User Management
              </h1>
              <p className="text-muted-foreground text-sm sm:text-base">
                Manage all platform users
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 mb-6">
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold" data-testid="text-total-users">{users.length}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold" data-testid="text-buyers-count">{buyerCount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Buyers</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Users className="h-4 w-4 sm:h-5 sm:w-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold" data-testid="text-sellers-count">{sellerCount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Sellers</p>
                </div>
              </div>
            </Card>
            <Card className="p-3 sm:p-4">
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="p-1.5 sm:p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <UserX className="h-4 w-4 sm:h-5 sm:w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-bold" data-testid="text-suspended-count">{suspendedCount}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground">Suspended</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative max-w-md">
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
                All ({users.length})
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
                <div className="bg-card rounded-lg border overflow-hidden">
                  <div className="hidden sm:grid sm:grid-cols-12 gap-4 px-4 py-3 bg-muted/50 text-sm font-medium text-muted-foreground border-b">
                    <div className="col-span-4">User</div>
                    <div className="col-span-2">Role</div>
                    <div className="col-span-2">Status</div>
                    <div className="col-span-2">Joined</div>
                    <div className="col-span-2 text-right">Actions</div>
                  </div>
                  <div className="divide-y">
                    {filteredUsers.map((user) => (
                      <div
                        key={user.id}
                        className="grid grid-cols-1 sm:grid-cols-12 gap-2 sm:gap-4 px-4 py-3 items-center hover:bg-muted/30 transition-colors"
                        data-testid={`row-user-${user.id}`}
                      >
                        <div className="sm:col-span-4 flex items-center gap-3">
                          <div className="flex-1 min-w-0">
                            <p className="font-medium truncate">
                              {user.firstName || user.lastName
                                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                                : user.email || "Unknown User"}
                            </p>
                            <p className="text-xs text-muted-foreground truncate">
                              {user.email}
                            </p>
                            <p className="text-xs text-muted-foreground sm:hidden">
                              {user.role} • {format(new Date(user.createdAt), "MMM d, yyyy")}
                            </p>
                          </div>
                        </div>

                        <div className="sm:col-span-2 hidden sm:block">
                          <Badge variant="outline" className="capitalize text-xs">
                            {user.role}
                          </Badge>
                        </div>

                        <div className="sm:col-span-2 hidden sm:block">
                          {!user.isActive ? (
                            <Badge variant="destructive" className="text-xs">Suspended</Badge>
                          ) : (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500 text-xs">
                              Active
                            </Badge>
                          )}
                        </div>

                        <div className="sm:col-span-2 hidden sm:block text-sm text-muted-foreground">
                          {format(new Date(user.createdAt), "MMM d, yyyy")}
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-view-${user.id}`}
                          >
                            <Eye className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">View</span>
                          </Button>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="outline"
                                size="sm"
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
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setConfirmAction("suspend");
                                  }}
                                  data-testid={`button-suspend-${user.id}`}
                                >
                                  <UserX className="h-4 w-4 mr-2" />
                                  Suspend User
                                </DropdownMenuItem>
                              ) : (
                                <DropdownMenuItem
                                  onClick={() => {
                                    setSelectedUser(user);
                                    setConfirmAction("unsuspend");
                                  }}
                                  data-testid={`button-unsuspend-${user.id}`}
                                >
                                  <UserCheck className="h-4 w-4 mr-2" />
                                  Unsuspend User
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {confirmAction === "suspend" ? "Suspend User" : "Unsuspend User"}
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>
              Are you sure you want to {confirmAction} this user?
            </p>
            <p className="font-semibold mt-2">
              {selectedUser?.firstName || selectedUser?.lastName
                ? `${selectedUser.firstName || ""} ${selectedUser.lastName || ""}`.trim()
                : selectedUser?.email}
            </p>
            {confirmAction === "suspend" && (
              <p className="text-sm text-muted-foreground mt-2">
                Suspended users will not be able to log in or access the platform.
              </p>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setConfirmAction(null)}>
              Cancel
            </Button>
            <Button
              variant={confirmAction === "suspend" ? "destructive" : "default"}
              onClick={handleConfirmAction}
              disabled={updateUserMutation.isPending}
              data-testid="button-confirm-action"
            >
              {updateUserMutation.isPending ? "Processing..." : confirmAction === "suspend" ? "Suspend User" : "Unsuspend User"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
