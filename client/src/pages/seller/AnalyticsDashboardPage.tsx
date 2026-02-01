import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Eye,
  Heart,
  MessageSquare,
  TrendingUp,
  Calendar,
  Download,
  Building,
} from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

interface DashboardStats {
  totalListings: number;
  totalInquiries: number;
  totalViews: number;
  totalFavorites?: number;
}

export default function AnalyticsDashboardPage() {
  const { toast } = useToast();
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("all");
  const [filteredProperties, setFilteredProperties] = useState<Property[]>([]);

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/me/dashboard"],
    queryFn: async () => {
      const response = await fetch("/api/me/dashboard");
      if (!response.ok) {
        throw new Error("Failed to fetch dashboard stats");
      }
      return response.json();
    },
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/properties"],
    queryFn: async () => {
      const response = await fetch("/api/me/properties");
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
  });

  const isLoading = statsLoading || propertiesLoading;

  useEffect(() => {
    if (properties.length > 0 && selectedRange === "all") {
      setFilteredProperties(properties);
    }
  }, [properties, selectedRange]);

  const handleDateRangeClick = () => {
    setDateRangeDialogOpen(true);
  };

  const handleRangeSelect = (range: string) => {
    setSelectedRange(range);
    setDateRangeDialogOpen(false);
    
    if (range === "all") {
      setFilteredProperties(properties);
      return;
    }
    
    const now = new Date();
    let startDate: Date;
    
    if (range === "week") {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === "month") {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else {
      setFilteredProperties(properties);
      return;
    }
    
    const filtered = properties.filter(p => {
      const createdAt = new Date(p.createdAt);
      return createdAt >= startDate;
    });
    
    setFilteredProperties(filtered);
  };

  const handleExport = () => {
    // Generate CSV data
    const csvData = [
      ["Property", "Views", "Favorites", "Inquiries", "Engagement Rate"],
      ...topProperties.map(p => [
        p.title,
        p.views.toString(),
        p.favorites.toString(),
        p.inquiries.toString(),
        p.engagementRate,
      ]),
    ];

    const csvContent = csvData.map(row => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast({ title: "Report exported successfully" });
  };

  // Use filtered properties if date range is selected, otherwise use all properties
  const propertiesToUse = selectedRange !== "all" && filteredProperties.length > 0 ? filteredProperties : properties;
  
  const totalViews = propertiesToUse.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalFavorites = propertiesToUse.reduce((sum, p) => sum + (p.favoriteCount || 0), 0);
  const totalInquiries = propertiesToUse.reduce((sum, p) => sum + (p.inquiryCount || 0), 0);
  const engagementRate = totalViews > 0 ? ((totalFavorites + totalInquiries) / totalViews * 100).toFixed(1) : "0.0";

  const stats = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      change: selectedRange === "all" ? "All-time views on your listings" : `${selectedRange === "week" ? "Last 7 days" : "Last 30 days"} views`,
      icon: Eye,
    },
    {
      label: "Favorites",
      value: totalFavorites.toLocaleString(),
      change: "Properties saved by buyers",
      icon: Heart,
    },
    {
      label: "Inquiries",
      value: totalInquiries.toLocaleString(),
      change: "Total buyer inquiries",
      icon: MessageSquare,
    },
    {
      label: "Engagement Rate",
      value: `${engagementRate}%`,
      change: "(Favorites + Inquiries) / Views",
      icon: TrendingUp,
    },
  ];

  const topProperties = [...propertiesToUse]
    .sort((a, b) => (b.viewCount || 0) - (a.viewCount || 0))
    .slice(0, 5)
    .map((p) => ({
      id: p.id,
      title: p.title,
      views: p.viewCount || 0,
      favorites: p.favoriteCount || 0,
      inquiries: p.inquiryCount || 0,
      engagementRate: p.viewCount && p.viewCount > 0
        ? `${(((p.favoriteCount || 0) + (p.inquiryCount || 0)) / p.viewCount * 100).toFixed(1)}%`
        : "0.0%",
    }));

  return (
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
              <Button variant="outline" data-testid="button-date-range" onClick={handleDateRangeClick}>
                <Calendar className="h-4 w-4 mr-2" />
                {selectedRange === "all" ? "All Time" : selectedRange === "week" ? "Last Week" : selectedRange === "month" ? "Last Month" : "Custom"}
              </Button>
              <Dialog open={dateRangeDialogOpen} onOpenChange={setDateRangeDialogOpen}>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Select Date Range</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-2">
                    <Button 
                      variant={selectedRange === "all" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => handleRangeSelect("all")}
                    >
                      All Time
                    </Button>
                    <Button 
                      variant={selectedRange === "week" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => handleRangeSelect("week")}
                    >
                      Last 7 Days
                    </Button>
                    <Button 
                      variant={selectedRange === "month" ? "default" : "outline"} 
                      className="w-full justify-start"
                      onClick={() => handleRangeSelect("month")}
                    >
                      Last 30 Days
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
              <Button data-testid="button-export" onClick={handleExport}>
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </Card>
              ))}
            </div>
          ) : (
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
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
                  </div>
                </Card>
              ))}
            </div>
          )}

          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList>
              <TabsTrigger value="overview" data-testid="tab-overview">
                Overview
              </TabsTrigger>
              <TabsTrigger value="properties" data-testid="tab-properties">
                By Property
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Property Performance</h3>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No properties yet</p>
                      <Link href="/seller/listings/new">
                        <Button>Create Your First Listing</Button>
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {topProperties.slice(0, 5).map((property, index) => (
                        <div key={property.id}>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="font-medium truncate max-w-[200px]">{property.title}</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">{property.views} views</span>
                              <span className="text-muted-foreground">{property.inquiries} inquiries</span>
                            </div>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ 
                                width: `${Math.min(100, totalViews > 0 ? (property.views / totalViews * 100) : 0)}%` 
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Engagement Breakdown</h3>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {[
                        { 
                          source: "Property Views", 
                          percentage: 100, 
                          count: totalViews.toLocaleString() 
                        },
                        { 
                          source: "Favorites Received", 
                          percentage: totalViews > 0 ? Math.round(totalFavorites / totalViews * 100) : 0, 
                          count: totalFavorites.toLocaleString() 
                        },
                        { 
                          source: "Inquiries Received", 
                          percentage: totalViews > 0 ? Math.round(totalInquiries / totalViews * 100) : 0, 
                          count: totalInquiries.toLocaleString() 
                        },
                        { 
                          source: "Active Listings", 
                          percentage: 100, 
                          count: properties.filter(p => p.status === "active").length.toString() 
                        },
                      ].map((item, index) => (
                        <div key={index}>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="font-medium">{item.source}</span>
                            <span className="text-muted-foreground">
                              {item.count} {item.percentage > 0 && item.percentage < 100 && `(${item.percentage}%)`}
                            </span>
                          </div>
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, item.percentage)}%` }}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="properties">
              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">
                  Property Performance Details
                </h3>
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-12 w-full" />
                    ))}
                  </div>
                ) : properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No properties to analyze</p>
                    <Link href="/seller/listings/new">
                      <Button>Create Your First Listing</Button>
                    </Link>
                  </div>
                ) : (
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
                                <Link href={`/properties/${property.id}`}>
                                  <span className="font-medium hover:text-primary cursor-pointer">
                                    {property.title}
                                  </span>
                                </Link>
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
                )}
              </Card>
            </TabsContent>
          </Tabs>
        </div>
    </main>
  );
}
