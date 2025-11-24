import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Activity, Eye, Search, Heart } from "lucide-react";

export default function UserActivityPage() {
  const recentActivities = [
    {
      id: "1",
      user: "Amit Kumar",
      action: "Viewed property",
      target: "Luxury 3BHK Apartment, Bandra",
      timestamp: "2 min ago",
      type: "view",
    },
    {
      id: "2",
      user: "Priya Sharma",
      action: "Searched for",
      target: "2BHK in Andheri",
      timestamp: "5 min ago",
      type: "search",
    },
    {
      id: "3",
      user: "Raj Properties",
      action: "Added new listing",
      target: "Commercial Office, BKC",
      timestamp: "10 min ago",
      type: "listing",
    },
    {
      id: "4",
      user: "Neha Patel",
      action: "Shortlisted property",
      target: "4BHK Villa, Powai",
      timestamp: "15 min ago",
      type: "favorite",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "view":
        return <Eye className="h-4 w-4" />;
      case "search":
        return <Search className="h-4 w-4" />;
      case "favorite":
        return <Heart className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Activity className="h-8 w-8 text-primary" />
              User Activity
            </h1>
            <p className="text-muted-foreground">
              Real-time platform activity monitoring
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Activity className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">1,234</p>
                  <p className="text-sm text-muted-foreground">Active Now</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Eye className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">5.6K</p>
                  <p className="text-sm text-muted-foreground">Views (24h)</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Search className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">2.3K</p>
                  <p className="text-sm text-muted-foreground">Searches (24h)</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <Heart className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">856</p>
                  <p className="text-sm text-muted-foreground">Favorites (24h)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Activity Stream */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Recent Activity</h3>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div
                  key={activity.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="p-2 rounded-lg bg-muted">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{activity.user}</span>
                      <span className="text-sm text-muted-foreground">
                        {activity.action}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {activity.target}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {activity.timestamp}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
