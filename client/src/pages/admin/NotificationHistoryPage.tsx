import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Bell, Search, Mail, MessageSquare } from "lucide-react";

export default function NotificationHistoryPage() {
  const notifications = [
    {
      id: "1",
      type: "email",
      recipient: "user@example.com",
      subject: "Property Inquiry Confirmation",
      status: "delivered",
      sentAt: "Nov 24, 2025 10:30 AM",
    },
    {
      id: "2",
      type: "sms",
      recipient: "+91 XXXXX XXXXX",
      subject: "Visit Booking Confirmed",
      status: "delivered",
      sentAt: "Nov 24, 2025 10:15 AM",
    },
    {
      id: "3",
      type: "push",
      recipient: "John Doe",
      subject: "New Property Match Found",
      status: "delivered",
      sentAt: "Nov 24, 2025 09:45 AM",
    },
    {
      id: "4",
      type: "email",
      recipient: "seller@example.com",
      subject: "New Inquiry Received",
      status: "failed",
      sentAt: "Nov 24, 2025 09:30 AM",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "email":
        return <Mail className="h-4 w-4" />;
      case "sms":
        return <MessageSquare className="h-4 w-4" />;
      case "push":
        return <Bell className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "delivered":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Delivered
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Notification History
            </h1>
            <p className="text-muted-foreground">
              Track all sent notifications across all channels
            </p>
          </div>

          {/* Search */}
          <Card className="p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by recipient or subject..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Bell className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Delivered</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Bell className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">23</p>
                  <p className="text-sm text-muted-foreground">Failed</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Bell className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">98.2%</p>
                  <p className="text-sm text-muted-foreground">Success Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Notification List */}
          <div className="space-y-3">
            {notifications.map((notification) => (
              <Card key={notification.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 rounded-lg bg-muted">
                      {getTypeIcon(notification.type)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{notification.subject}</h3>
                        {getStatusBadge(notification.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="capitalize">{notification.type}</span>
                        <span>•</span>
                        <span>To: {notification.recipient}</span>
                        <span>•</span>
                        <span>{notification.sentAt}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
