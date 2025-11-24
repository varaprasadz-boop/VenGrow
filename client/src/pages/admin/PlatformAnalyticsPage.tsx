import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  Eye,
  MessageSquare,
  Download,
  Calendar,
} from "lucide-react";

export default function PlatformAnalyticsPage() {
  const stats = [
    {
      label: "Total Users",
      value: "52,345",
      change: "+8.2%",
      trend: "up",
      icon: Users,
    },
    {
      label: "Active Listings",
      value: "10,234",
      change: "+12.5%",
      trend: "up",
      icon: Building,
    },
    {
      label: "Monthly Revenue",
      value: "₹12.5 L",
      change: "+18.3%",
      trend: "up",
      icon: DollarSign,
    },
    {
      label: "Total Views",
      value: "2.5M",
      change: "+25.1%",
      trend: "up",
      icon: Eye,
    },
  ];

  const topCities = [
    { city: "Mumbai", listings: 2345, percentage: 23 },
    { city: "Delhi", listings: 1987, percentage: 19 },
    { city: "Bangalore", listings: 1654, percentage: 16 },
    { city: "Pune", listings: 1234, percentage: 12 },
    { city: "Hyderabad", listings: 987, percentage: 10 },
  ];

  const topSellers = [
    {
      name: "Prestige Estates",
      listings: 145,
      revenue: "₹4.2L",
      views: "125K",
    },
    {
      name: "DLF Properties",
      listings: 123,
      revenue: "₹3.8L",
      views: "98K",
    },
    {
      name: "Godrej Properties",
      listings: 98,
      revenue: "₹3.1L",
      views: "87K",
    },
    {
      name: "Lodha Group",
      listings: 87,
      revenue: "₹2.9L",
      views: "76K",
    },
  ];

  const monthlyRevenue = [
    { month: "Jun", revenue: 8.5 },
    { month: "Jul", revenue: 9.2 },
    { month: "Aug", revenue: 10.1 },
    { month: "Sep", revenue: 9.8 },
    { month: "Oct", revenue: 11.3 },
    { month: "Nov", revenue: 12.5 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Platform Analytics
              </h1>
              <p className="text-muted-foreground">
                Comprehensive insights and metrics
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" data-testid="button-date-range">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
              <Button data-testid="button-export-analytics">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-green-600">{stat.change}</span>
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="revenue" data-testid="tab-revenue">
                Revenue
              </TabsTrigger>
              <TabsTrigger value="users" data-testid="tab-users">
                Users
              </TabsTrigger>
              <TabsTrigger value="listings" data-testid="tab-listings">
                Listings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Revenue Chart */}
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Monthly Revenue Trend</h3>
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <div className="space-y-4">
                    {monthlyRevenue.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-medium">{item.month}</span>
                          <span className="text-primary">₹{item.revenue}L</span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(item.revenue / 15) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Top Cities */}
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Top Cities by Listings</h3>
                  <div className="space-y-4">
                    {topCities.map((city, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <div className="flex items-center gap-2">
                            <span className="text-lg font-bold text-primary">
                              #{index + 1}
                            </span>
                            <span className="font-medium">{city.city}</span>
                          </div>
                          <span className="text-muted-foreground">
                            {city.listings} listings
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${city.percentage * 4}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>

              {/* Top Sellers */}
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">Top Performing Sellers</h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold">Rank</th>
                        <th className="text-left p-3 text-sm font-semibold">Seller</th>
                        <th className="text-center p-3 text-sm font-semibold">Listings</th>
                        <th className="text-center p-3 text-sm font-semibold">Revenue</th>
                        <th className="text-center p-3 text-sm font-semibold">Views</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topSellers.map((seller, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-3">
                            <span className="text-lg font-bold text-primary">
                              #{index + 1}
                            </span>
                          </td>
                          <td className="p-3 font-medium">{seller.name}</td>
                          <td className="p-3 text-center">{seller.listings}</td>
                          <td className="p-3 text-center text-primary font-semibold">
                            {seller.revenue}
                          </td>
                          <td className="p-3 text-center text-muted-foreground">
                            {seller.views}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="revenue">
              <Card className="p-6">
                <p className="text-center text-muted-foreground py-16">
                  Detailed revenue analytics coming soon
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="users">
              <Card className="p-6">
                <p className="text-center text-muted-foreground py-16">
                  User analytics coming soon
                </p>
              </Card>
            </TabsContent>

            <TabsContent value="listings">
              <Card className="p-6">
                <p className="text-center text-muted-foreground py-16">
                  Listing analytics coming soon
                </p>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
