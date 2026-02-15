import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow } from "date-fns";
import type { Notification, User } from "@shared/schema";
import {
  Bell,
  Heart,
  MessageSquare,
  TrendingDown,
  CheckCheck,
  Trash2,
  CreditCard,
  Home,
  AlertCircle,
} from "lucide-react";

const getNotificationIcon = (type: string) => {
  switch (type) {
    case "message":
      return MessageSquare;
    case "inquiry":
      return MessageSquare;
    case "payment":
      return CreditCard;
    case "listing":
      return Home;
    case "alert":
      return AlertCircle;
    default:
      return Bell;
  }
};

export default function NotificationsPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: notifications = [], isLoading } = useQuery<Notification[]>({
    queryKey: ["/api/notifications", currentUser?.id],
    enabled: !!currentUser?.id,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("PATCH", `/api/notifications/${id}/read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const markAllAsReadMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest("POST", `/api/notifications/mark-all-read`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "All notifications marked as read" });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/notifications/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
      toast({ title: "Notification deleted" });
    },
  });

  const filterNotifications = () => {
    if (selectedTab === "all") return notifications;
    if (selectedTab === "unread") return notifications.filter((n) => !n.isRead);
    return notifications.filter((n) => n.type === selectedTab);
  };

  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter((n) => !n.isRead).length;

  const handleMarkAsRead = (id: string) => {
    markAsReadMutation.mutate(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAsReadMutation.mutate();
  };

  const handleDelete = (id: string) => {
    deleteNotificationMutation.mutate(id);
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif font-bold text-2xl mb-2">Sign in Required</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to view your notifications
            </p>
            <Button asChild data-testid="button-login">
              <a href="/login">Sign In</a>
            </Button>
          </Card>
        </main>
        <BuyerBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4 flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-serif font-bold text-3xl">Notifications</h1>
                  <p className="text-muted-foreground">
                    {unreadCount} unread notification{unreadCount !== 1 ? "s" : ""}
                  </p>
                </div>
              </div>

              <div className="flex gap-2 flex-wrap">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleMarkAllAsRead}
                  disabled={unreadCount === 0 || markAllAsReadMutation.isPending}
                  data-testid="button-mark-all-read"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
              </div>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6 flex-wrap h-auto gap-1">
              <TabsTrigger value="all" data-testid="tab-all">
                All
                {notifications.length > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {notifications.length}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="unread" data-testid="tab-unread">
                Unread
                {unreadCount > 0 && (
                  <Badge className="ml-2">{unreadCount}</Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="message" data-testid="tab-chat">
                Chat
              </TabsTrigger>
              <TabsTrigger value="inquiry" data-testid="tab-inquiries">
                Inquiries
              </TabsTrigger>
              <TabsTrigger value="listing" data-testid="tab-listings">
                Listings
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-3">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-4">
                      <div className="flex gap-4">
                        <Skeleton className="h-10 w-10 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-32 mb-2" />
                          <Skeleton className="h-3 w-full mb-2" />
                          <Skeleton className="h-3 w-20" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : filteredNotifications.length === 0 ? (
                <div className="text-center py-16">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                  <h3 className="font-semibold text-xl mb-2">No notifications</h3>
                  <p className="text-muted-foreground">
                    {selectedTab === "all"
                      ? "You're all caught up!"
                      : `No ${selectedTab} notifications`}
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {filteredNotifications.map((notification) => {
                    const IconComponent = getNotificationIcon(notification.type);
                    return (
                      <Card
                        key={notification.id}
                        className={`p-4 hover-elevate ${
                          !notification.isRead ? "border-l-4 border-l-primary bg-primary/5" : ""
                        }`}
                        data-testid={`notification-${notification.id}`}
                      >
                        <div className="flex gap-4">
                          <div
                            className={`p-2 rounded-lg h-fit ${
                              !notification.isRead ? "bg-primary/10" : "bg-muted"
                            }`}
                          >
                            <IconComponent
                              className={`h-5 w-5 ${
                                !notification.isRead ? "text-primary" : "text-muted-foreground"
                              }`}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between gap-4 mb-1 flex-wrap">
                              <h3
                                className={`font-medium ${
                                  !notification.isRead ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {notification.title}
                              </h3>
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {!notification.isRead && (
                                  <Badge variant="default">New</Badge>
                                )}
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleMarkAsRead(notification.id)}
                                  disabled={notification.isRead}
                                  data-testid={`button-mark-read-${notification.id}`}
                                >
                                  <CheckCheck className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-8 w-8"
                                  onClick={() => handleDelete(notification.id)}
                                  data-testid={`button-delete-${notification.id}`}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {notification.message}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notification.createdAt
                                ? formatDistanceToNow(new Date(notification.createdAt), {
                                    addSuffix: true,
                                  })
                                : ""}
                            </p>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
