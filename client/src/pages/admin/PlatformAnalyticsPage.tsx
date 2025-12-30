import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building,
  MessageSquare,
  TrendingUp,
  UserCheck,
  Download,
  Calendar,
  AlertCircle,
  RefreshCw,
  FolderKanban,
  ShieldCheck,
} from "lucide-react";
import { exportToCSV } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

interface AnalyticsData {
  users: {
    total: number;
    buyers: number;
    sellers: number;
    active: number;
  };
  listings: {
    total: number;
    live: number;
    pending: number;
  };
  inquiries: {
    total: number;
    pending: number;
  };
  sellers: {
    total: number;
    verified: number;
    pendingVerification: number;
  };
  projects: {
    total: number;
    live: number;
  };
  topCities: Array<{
    city: string;
    listings: number;
    percentage: number;
  }>;
}

export default function PlatformAnalyticsPage() {
  const { toast } = useToast();
  const { data: analytics, isLoading, isError, refetch } = useQuery<AnalyticsData>({
    queryKey: ["/api/admin/analytics"],
  });

  if (isLoading) {
    return (
      <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-96 mb-6" />
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Skeleton className="h-64 w-full" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </main>
    );
  }

  if (isError || !analytics) {
    return (
      <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Analytics</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading analytics data. Please try again.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  const stats = [
    {
      label: "Total Users",
      value: analytics.users.total.toLocaleString(),
      subtext: `${analytics.users.buyers} buyers, ${analytics.users.sellers} sellers`,
      icon: Users,
      color: "blue",
    },
    {
      label: "Active Listings",
      value: analytics.listings.live.toLocaleString(),
      subtext: `${analytics.listings.pending} pending approval`,
      icon: Building,
      color: "green",
    },
    {
      label: "Total Inquiries",
      value: analytics.inquiries.total.toLocaleString(),
      subtext: `${analytics.inquiries.pending} pending response`,
      icon: MessageSquare,
      color: "purple",
    },
    {
      label: "Live Projects",
      value: analytics.projects.live.toLocaleString(),
      subtext: `${analytics.projects.total} total projects`,
      icon: FolderKanban,
      color: "orange",
    },
  ];

  const colorClasses: Record<string, string> = {
    blue: "bg-blue-100 dark:bg-blue-900/20 text-blue-600",
    green: "bg-green-100 dark:bg-green-900/20 text-green-600",
    purple: "bg-purple-100 dark:bg-purple-900/20 text-purple-600",
    orange: "bg-orange-100 dark:bg-orange-900/20 text-orange-600",
  };

  const handleExportAnalytics = () => {
    const exportData = [
      { metric: 'Total Users', value: analytics.users.total, details: `${analytics.users.buyers} buyers, ${analytics.users.sellers} sellers` },
      { metric: 'Active Users', value: analytics.users.active, details: '' },
      { metric: 'Total Listings', value: analytics.listings.total, details: '' },
      { metric: 'Live Listings', value: analytics.listings.live, details: '' },
      { metric: 'Pending Listings', value: analytics.listings.pending, details: '' },
      { metric: 'Total Inquiries', value: analytics.inquiries.total, details: '' },
      { metric: 'Pending Inquiries', value: analytics.inquiries.pending, details: '' },
      { metric: 'Total Sellers', value: analytics.sellers.total, details: '' },
      { metric: 'Verified Sellers', value: analytics.sellers.verified, details: '' },
      { metric: 'Total Projects', value: analytics.projects.total, details: '' },
      { metric: 'Live Projects', value: analytics.projects.live, details: '' },
    ];

    exportToCSV(exportData, `platform_analytics_${new Date().toISOString().split('T')[0]}`, [
      { key: 'metric', header: 'Metric' },
      { key: 'value', header: 'Value' },
      { key: 'details', header: 'Details' },
    ]);
  };

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Platform Analytics
              </h1>
              <p className="text-muted-foreground">
                Real-time insights and metrics
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button 
                variant="outline" 
                data-testid="button-date-range"
                onClick={() => {
                  toast({
                    title: "Date Range",
                    description: "Date range picker feature is coming soon.",
                  });
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                All Time
              </Button>
              <Button onClick={handleExportAnalytics} data-testid="button-export-analytics">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6" data-testid={`card-stat-${index}`}>
                <div className="flex items-start justify-between mb-3">
                  <div className={`p-3 rounded-lg ${colorClasses[stat.color]}`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                  <p className="text-sm font-medium mb-1">{stat.label}</p>
                  <p className="text-xs text-muted-foreground">{stat.subtext}</p>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                Users
              </TabsTrigger>
              <TabsTrigger value="listings" data-testid="tab-listings">
                Listings
              </TabsTrigger>
              <TabsTrigger value="sellers" data-testid="tab-sellers">
                Sellers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Top Cities by Listings</h3>
                  {analytics.topCities.length === 0 ? (
                    <p className="text-center text-muted-foreground py-8">No listing data available</p>
                  ) : (
                    <div className="space-y-4">
                      {analytics.topCities.map((city, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">
                                #{index + 1}
                              </span>
                              <span className="font-medium">{city.city}</span>
                            </div>
                            <span className="text-muted-foreground">
                              {city.listings} listings ({city.percentage}%)
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(city.percentage * 2, 100)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Platform Summary</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Users className="h-5 w-5 text-blue-600" />
                        <span>Active Users</span>
                      </div>
                      <span className="font-bold">{analytics.users.active}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <ShieldCheck className="h-5 w-5 text-green-600" />
                        <span>Verified Sellers</span>
                      </div>
                      <span className="font-bold">{analytics.sellers.verified}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Building className="h-5 w-5 text-purple-600" />
                        <span>Total Listings</span>
                      </div>
                      <span className="font-bold">{analytics.listings.total}</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <TrendingUp className="h-5 w-5 text-orange-600" />
                        <span>Pending Verifications</span>
                      </div>
                      <span className="font-bold">{analytics.sellers.pendingVerification}</span>
                    </div>
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">User Breakdown</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{analytics.users.total}</p>
                    <p className="text-sm text-muted-foreground">Total Users</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{analytics.users.buyers}</p>
                    <p className="text-sm text-muted-foreground">Buyers</p>
                  </div>
                  <div className="p-4 bg-purple-50 dark:bg-purple-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-purple-600">{analytics.users.sellers}</p>
                    <p className="text-sm text-muted-foreground">Sellers</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-600">{analytics.users.active}</p>
                    <p className="text-sm text-muted-foreground">Active Users</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Listing Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{analytics.listings.total}</p>
                    <p className="text-sm text-muted-foreground">Total Listings</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{analytics.listings.live}</p>
                    <p className="text-sm text-muted-foreground">Live Listings</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-600">{analytics.listings.pending}</p>
                    <p className="text-sm text-muted-foreground">Pending Approval</p>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="sellers">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Seller Statistics</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-blue-600">{analytics.sellers.total}</p>
                    <p className="text-sm text-muted-foreground">Total Sellers</p>
                  </div>
                  <div className="p-4 bg-green-50 dark:bg-green-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-green-600">{analytics.sellers.verified}</p>
                    <p className="text-sm text-muted-foreground">Verified</p>
                  </div>
                  <div className="p-4 bg-orange-50 dark:bg-orange-900/10 rounded-lg text-center">
                    <p className="text-3xl font-bold text-orange-600">{analytics.sellers.pendingVerification}</p>
                    <p className="text-sm text-muted-foreground">Pending Verification</p>
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    );
}
