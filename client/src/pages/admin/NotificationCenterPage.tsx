import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell, Mail, MessageSquare, Send, CheckCircle } from "lucide-react";

export default function NotificationCenterPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const notifications = [
    {
      id: "1",
      type: "email",
      recipient: "john@example.com",
      subject: "New property inquiry",
      sentAt: "Nov 24, 2025, 10:30 AM",
      status: "delivered",
    },
    {
      id: "2",
      type: "sms",
      recipient: "+91 98765 43210",
      message: "Your property listing has been approved",
      sentAt: "Nov 24, 2025, 09:15 AM",
      status: "delivered",
    },
    {
      id: "3",
      type: "push",
      recipient: "Rahul Sharma",
      message: "New property matches your saved search",
      sentAt: "Nov 23, 2025, 05:45 PM",
      status: "delivered",
    },
    {
      id: "4",
      type: "email",
      recipient: "priya@example.com",
      subject: "Welcome to VenGrow",
      sentAt: "Nov 23, 2025, 02:30 PM",
      status: "failed",
    },
  ];

  const stats = [
    { label: "Total Sent", value: "45,234", icon: Send },
    { label: "Delivered", value: "43,891", icon: CheckCircle },
    { label: "Email", value: "25,678", icon: Mail },
    { label: "SMS", value: "12,456", icon: MessageSquare },
  ];

  const filterNotifications = () => {
    if (selectedTab === "all") return notifications;
    return notifications.filter((n) => n.type === selectedTab);
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return Mail;
      case "sms":
        return MessageSquare;
      case "push":
        return Bell;
      default:
        return Bell;
    }
  };

  const getStatusBadge = (status: string) => {
    return status === "delivered" ? (
      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
        Delivered
      </Badge>
    ) : (
      <Badge variant="destructive">Failed</Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Notification Center
            </h1>
            <p className="text-muted-foreground">
              Monitor all platform notifications
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="email" data-testid="tab-email">
                Email ({notifications.filter((n) => n.type === "email").length})
              </TabsTrigger>
              <TabsTrigger value="sms" data-testid="tab-sms">
                SMS ({notifications.filter((n) => n.type === "sms").length})
              </TabsTrigger>
              <TabsTrigger value="push" data-testid="tab-push">
                Push ({notifications.filter((n) => n.type === "push").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filterNotifications().map((notification) => {
                  const Icon = getTypeIcon(notification.type);
                  return (
                    <Card key={notification.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-medium">
                                  {notification.subject || notification.message}
                                </h3>
                                {getStatusBadge(notification.status)}
                              </div>
                              <p className="text-sm text-muted-foreground">
                                To: {notification.recipient}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{notification.sentAt}</span>
                            <span>•</span>
                            <Badge variant="outline" className="text-xs capitalize">
                              {notification.type}
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
