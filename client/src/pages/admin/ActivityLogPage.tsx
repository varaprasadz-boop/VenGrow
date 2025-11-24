import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  User,
  Building,
  DollarSign,
  Settings,
  Download,
} from "lucide-react";

export default function ActivityLogPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const activities = [
    {
      id: "1",
      type: "user",
      action: "User Registration",
      user: "Rahul Sharma",
      details: "New user registered as Buyer",
      timestamp: "Nov 24, 2025, 10:30 AM",
      ipAddress: "103.25.45.67",
    },
    {
      id: "2",
      type: "listing",
      action: "Listing Approved",
      user: "Admin",
      details: "Approved listing: Luxury 3BHK Apartment",
      timestamp: "Nov 24, 2025, 09:15 AM",
      ipAddress: "103.25.45.68",
    },
    {
      id: "3",
      type: "payment",
      action: "Payment Completed",
      user: "Prestige Estates",
      details: "Payment of ₹2,999 for Premium package",
      timestamp: "Nov 23, 2025, 05:45 PM",
      ipAddress: "103.25.45.69",
    },
    {
      id: "4",
      type: "settings",
      action: "Settings Updated",
      user: "Admin",
      details: "Updated email notification settings",
      timestamp: "Nov 23, 2025, 02:30 PM",
      ipAddress: "103.25.45.70",
    },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "user":
        return User;
      case "listing":
        return Building;
      case "payment":
        return DollarSign;
      case "settings":
        return Settings;
      default:
        return User;
    }
  };

  const getTypeBadge = (type: string) => {
    const colors: Record<string, string> = {
      user: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
      listing: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
      payment: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500",
      settings: "bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500",
    };
    return (
      <Badge className={colors[type] || ""}>
        {type.charAt(0).toUpperCase() + type.slice(1)}
      </Badge>
    );
  };

  const filterActivities = () => {
    let filtered = activities;
    if (selectedTab !== "all") {
      filtered = filtered.filter((a) => a.type === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (a) =>
          a.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          a.details.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Activity Log
              </h1>
              <p className="text-muted-foreground">
                Track all platform activities
              </p>
            </div>
            <Button data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export Log
            </Button>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search activities..."
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
                All ({activities.length})
              </TabsTrigger>
              <TabsTrigger value="user" data-testid="tab-user">
                Users
              </TabsTrigger>
              <TabsTrigger value="listing" data-testid="tab-listing">
                Listings
              </TabsTrigger>
              <TabsTrigger value="payment" data-testid="tab-payment">
                Payments
              </TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-3">
                {filterActivities().map((activity) => {
                  const Icon = getTypeIcon(activity.type);
                  return (
                    <Card key={activity.id} className="p-6">
                      <div className="flex items-start gap-4">
                        <div className="p-3 rounded-lg bg-muted">
                          <Icon className="h-5 w-5" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-1">
                                <h3 className="font-semibold">{activity.action}</h3>
                                {getTypeBadge(activity.type)}
                              </div>
                              <p className="text-sm text-muted-foreground mb-1">
                                {activity.details}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                By: <strong>{activity.user}</strong>
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 text-xs text-muted-foreground">
                            <span>{activity.timestamp}</span>
                            <span>•</span>
                            <span>IP: {activity.ipAddress}</span>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filterActivities().length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">No activities found</h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} activities`}
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
