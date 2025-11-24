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
  TrendingDown,
  CheckCheck,
  Trash2,
} from "lucide-react";

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const notifications = [
    {
      id: "1",
      type: "inquiry_reply",
      title: "New reply to your inquiry",
      message: "Prestige Estates replied to your inquiry about Luxury 3BHK Apartment",
      time: "2 hours ago",
      read: false,
      icon: MessageSquare,
    },
    {
      id: "2",
      type: "price_drop",
      title: "Price Drop Alert",
      message: "Beautiful Villa in Whitefield is now ₹12.5 Cr (was ₹13 Cr)",
      time: "5 hours ago",
      read: false,
      icon: TrendingDown,
    },
    {
      id: "3",
      type: "new_listing",
      title: "New property matching your search",
      message: "3 new properties added in Mumbai under ₹1 Cr",
      time: "1 day ago",
      read: true,
      icon: Bell,
    },
    {
      id: "4",
      type: "favorite",
      title: "Property Status Update",
      message: "A property in your favorites has been marked as sold",
      time: "2 days ago",
      read: true,
      icon: Heart,
    },
    {
      id: "5",
      type: "inquiry_reply",
      title: "New reply to your inquiry",
      message: "John Smith replied to your inquiry about 2BHK Flat",
      time: "3 days ago",
      read: true,
      icon: MessageSquare,
    },
  ];

  const filterNotifications = () => {
    if (selectedTab === "all") return notifications;
    if (selectedTab === "unread") return notifications.filter((n) => !n.read);
    return notifications.filter((n) => n.type === selectedTab);
  };

  const filteredNotifications = filterNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAllAsRead = () => {
    console.log("Marking all as read");
  };

  const clearAll = () => {
    console.log("Clearing all notifications");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-lg bg-primary/10">
                  <Bell className="h-6 w-6 text-primary" />
                </div>
                <div>
                  <h1 className="font-serif font-bold text-3xl">Notifications</h1>
                  <p className="text-muted-foreground">
                    {unreadCount} unread notifications
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={markAllAsRead}
                  data-testid="button-mark-all-read"
                >
                  <CheckCheck className="h-4 w-4 mr-2" />
                  Mark all as read
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={clearAll}
                  data-testid="button-clear-all"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Clear all
                </Button>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" data-testid="tab-unread">
                Unread ({unreadCount})
              </TabsTrigger>
              <TabsTrigger value="inquiry_reply" data-testid="tab-inquiries">
                Inquiries
              </TabsTrigger>
              <TabsTrigger value="price_drop" data-testid="tab-price-drops">
                Price Drops
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-3">
                {filteredNotifications.map((notification) => {
                  const Icon = notification.icon;
                  return (
                    <Card
                      key={notification.id}
                      className={`p-4 hover-elevate active-elevate-2 cursor-pointer ${
                        !notification.read ? "border-l-4 border-l-primary bg-primary/5" : ""
                      }`}
                      data-testid={`notification-${notification.id}`}
                    >
                      <div className="flex gap-4">
                        <div className={`p-2 rounded-lg h-fit ${
                          !notification.read ? "bg-primary/10" : "bg-muted"
                        }`}>
                          <Icon className={`h-5 w-5 ${
                            !notification.read ? "text-primary" : "text-muted-foreground"
                          }`} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-1">
                            <h3 className={`font-medium ${
                              !notification.read ? "text-foreground" : "text-muted-foreground"
                            }`}>
                              {notification.title}
                            </h3>
                            {!notification.read && (
                              <Badge variant="default" className="flex-shrink-0">
                                New
                              </Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {notification.message}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {notification.time}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredNotifications.length === 0 && (
                <div className="text-center py-16">
                  <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No notifications
                  </h3>
                  <p className="text-muted-foreground">
                    {selectedTab === "all"
                      ? "You're all caught up!"
                      : `No ${selectedTab.replace("_", " ")} notifications`}
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
