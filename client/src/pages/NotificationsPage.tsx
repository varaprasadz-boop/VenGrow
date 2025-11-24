import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Bell,
  Heart,
  MessageSquare,
  TrendingUp,
  CheckCheck,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const notifications = [
    {
      id: "1",
      type: "inquiry",
      title: "New Inquiry Received",
      message: "Rahul Sharma inquired about your 3BHK Apartment",
      time: "2 hours ago",
      read: false,
      icon: MessageSquare,
    },
    {
      id: "2",
      type: "favorite",
      title: "Property Favorited",
      message: "3 users added your property to their favorites",
      time: "5 hours ago",
      read: false,
      icon: Heart,
    },
    {
      id: "3",
      type: "update",
      title: "Listing Approved",
      message: "Your property listing has been approved and is now live",
      time: "1 day ago",
      read: true,
      icon: TrendingUp,
    },
    {
      id: "4",
      type: "system",
      title: "Package Expiring Soon",
      message: "Your Premium package will expire in 7 days",
      time: "2 days ago",
      read: true,
      icon: Bell,
    },
  ];

  const filterNotifications = () => {
    if (selectedTab === "all") return notifications;
    if (selectedTab === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === selectedTab);
  };

  const filteredNotifications = filterNotifications();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Notifications
              </h1>
              <p className="text-muted-foreground">
                Stay updated with your property activities
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" data-testid="button-mark-read">
                <CheckCheck className="h-4 w-4 mr-2" />
                Mark All Read
              </Button>
              <Button variant="outline" size="sm" data-testid="button-clear">
                <Trash2 className="h-4 w-4 mr-2" />
                Clear All
              </Button>
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" data-testid="tab-unread">
                Unread ({notifications.filter((n) => !n.read).length})
              </TabsTrigger>
              <TabsTrigger value="inquiry" data-testid="tab-inquiry">
                Inquiries
              </TabsTrigger>
              <TabsTrigger value="system" data-testid="tab-system">
                System
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-3">
                {filteredNotifications.map((notification) => (
                  <Card
                    key={notification.id}
                    className={`p-6 ${!notification.read ? "bg-blue-50/50 dark:bg-blue-900/5" : ""}`}
                  >
                    <div className="flex items-start gap-4">
                      <div
                        className={`p-3 rounded-lg ${
                          !notification.read ? "bg-primary/10" : "bg-muted"
                        }`}
                      >
                        <notification.icon
                          className={`h-5 w-5 ${
                            !notification.read ? "text-primary" : "text-muted-foreground"
                          }`}
                        />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{notification.title}</h3>
                            {!notification.read && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {notification.time}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground mb-3">
                          {notification.message}
                        </p>
                        <div className="flex gap-2">
                          {!notification.read && (
                            <Button
                              variant="ghost"
                              size="sm"
                              data-testid={`button-mark-read-${notification.id}`}
                            >
                              Mark as Read
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            data-testid={`button-delete-${notification.id}`}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}

                {filteredNotifications.length === 0 && (
                  <div className="text-center py-16">
                    <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="font-semibold text-xl mb-2">
                      No notifications
                    </h3>
                    <p className="text-muted-foreground">
                      You're all caught up!
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
