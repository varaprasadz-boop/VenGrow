import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Calendar,
  Download,
} from "lucide-react";

export default function AnalyticsDashboardPage() {
  const stats = [
    {
      label: "Total Views",
      value: "12,345",
      change: "+23% vs last month",
      icon: Eye,
    },
    {
      label: "Favorites",
      value: "456",
      change: "+18% vs last month",
      icon: Heart,
    },
    {
      label: "Inquiries",
      value: "89",
      change: "+35% vs last month",
      icon: MessageSquare,
    },
    {
      label: "Engagement Rate",
      value: "7.2%",
      change: "+1.5% vs last month",
      icon: TrendingUp,
    },
  ];

  const topProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      views: 2345,
      favorites: 128,
      inquiries: 45,
      engagementRate: "9.5%",
    },
    {
      id: "2",
      title: "Commercial Office Space",
      views: 1987,
      favorites: 89,
      inquiries: 32,
      engagementRate: "8.2%",
    },
    {
      id: "3",
      title: "2BHK Flat in Koramangala",
      views: 1654,
      favorites: 76,
      inquiries: 28,
      engagementRate: "7.8%",
    },
  ];

  const weeklyData = [
    { day: "Mon", views: 234, favorites: 12, inquiries: 5 },
    { day: "Tue", views: 345, favorites: 18, inquiries: 8 },
    { day: "Wed", views: 289, favorites: 15, inquiries: 6 },
    { day: "Thu", views: 412, favorites: 22, inquiries: 11 },
    { day: "Fri", views: 378, favorites: 19, inquiries: 9 },
    { day: "Sat", views: 456, favorites: 25, inquiries: 13 },
    { day: "Sun", views: 398, favorites: 21, inquiries: 10 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Analytics Dashboard
              </h1>
              <p className="text-muted-foreground">
                Track performance of your property listings
              </p>
            </div>
            <div className="flex gap-3">
              <Button variant="outline" data-testid="button-date-range">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 Days
              </Button>
              <Button data-testid="button-export">
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
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="properties" data-testid="tab-properties">
                By Property
              </TabsTrigger>
              <TabsTrigger value="demographics" data-testid="tab-demographics">
                Demographics
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Weekly Trend */}
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Weekly Trend</h3>
                  <div className="space-y-4">
                    {weeklyData.map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-medium">{item.day}</span>
                          <div className="flex gap-4 text-xs">
                            <span className="text-muted-foreground">
                              {item.views} views
                            </span>
                            <span className="text-muted-foreground">
                              {item.inquiries} inquiries
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${(item.views / 500) * 100}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>

                {/* Traffic Sources */}
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Traffic Sources</h3>
                  <div className="space-y-4">
                    {[
                      { source: "Direct Search", percentage: 45, count: "5,555" },
                      { source: "Featured Listings", percentage: 30, count: "3,703" },
                      { source: "Saved Searches", percentage: 15, count: "1,851" },
                      { source: "Social Media", percentage: 10, count: "1,234" },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-medium">{item.source}</span>
                          <span className="text-muted-foreground">
                            {item.count} ({item.percentage}%)
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{ width: `${item.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="properties">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">
                  Top Performing Properties
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-3 text-sm font-semibold">
                          Property
                        </th>
                        <th className="text-center p-3 text-sm font-semibold">
                          Views
                        </th>
                        <th className="text-center p-3 text-sm font-semibold">
                          Favorites
                        </th>
                        <th className="text-center p-3 text-sm font-semibold">
                          Inquiries
                        </th>
                        <th className="text-center p-3 text-sm font-semibold">
                          Engagement
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {topProperties.map((property, index) => (
                        <tr key={property.id} className="border-b last:border-0">
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">
                                #{index + 1}
                              </span>
                              <span className="font-medium">{property.title}</span>
                            </div>
                          </td>
                          <td className="p-3 text-center">{property.views}</td>
                          <td className="p-3 text-center">{property.favorites}</td>
                          <td className="p-3 text-center">{property.inquiries}</td>
                          <td className="p-3 text-center text-primary font-semibold">
                            {property.engagementRate}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="demographics">
              <Card className="p-6">
                <p className="text-center text-muted-foreground py-16">
                  Demographic analytics coming soon
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
