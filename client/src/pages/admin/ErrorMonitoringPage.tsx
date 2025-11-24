import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, XCircle, TrendingDown } from "lucide-react";

export default function ErrorMonitoringPage() {
  const errorStats = [
    {
      type: "4xx Errors",
      count: 234,
      trend: -12,
      color: "yellow",
    },
    {
      type: "5xx Errors",
      count: 23,
      trend: -45,
      color: "red",
    },
    {
      type: "API Timeouts",
      count: 12,
      trend: -30,
      color: "orange",
    },
  ];

  const recentErrors = [
    {
      id: "1",
      type: "404",
      message: "Property not found",
      path: "/api/properties/invalid-id",
      timestamp: "2 min ago",
      count: 5,
    },
    {
      id: "2",
      type: "500",
      message: "Database connection timeout",
      path: "/api/search",
      timestamp: "15 min ago",
      count: 3,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" />
              Error Monitoring
            </h1>
            <p className="text-muted-foreground">
              Track and analyze application errors
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {errorStats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <XCircle className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.count}</p>
                    <p className="text-sm text-muted-foreground mb-1">
                      {stat.type}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-green-600">
                      <TrendingDown className="h-4 w-4" />
                      <span>{Math.abs(stat.trend)}% decrease</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Chart */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Error Trend (24h)</h3>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">Error Trend Chart</span>
            </div>
          </Card>

          {/* Recent Errors */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Recent Errors</h2>
            <div className="space-y-3">
              {recentErrors.map((error) => (
                <Card key={error.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <Badge variant="destructive">{error.type}</Badge>
                        <h3 className="font-semibold">{error.message}</h3>
                        <Badge variant="outline">{error.count}x</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground font-mono mb-2">
                        {error.path}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {error.timestamp}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
