import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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
  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/me/dashboard"],
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/properties"],
  });

  const isLoading = statsLoading || propertiesLoading;

  const totalViews = properties.reduce((sum, p) => sum + (p.viewCount || 0), 0);
  const totalFavorites = properties.reduce((sum, p) => sum + (p.favoriteCount || 0), 0);
  const totalInquiries = properties.reduce((sum, p) => sum + (p.inquiryCount || 0), 0);
  const engagementRate = totalViews > 0 ? ((totalFavorites + totalInquiries) / totalViews * 100).toFixed(1) : "0.0";

  const stats = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      change: "All-time views on your listings",
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

  const topProperties = [...properties]
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
      
            <div className="flex gap-3">
              <Button variant="outline" data-testid="button-date-range">
                <Calendar className="h-4 w-4 mr-2" />
                All Time
              </Button>
              <Button data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
      
    

          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-6">
                  <Skeleton className="h-10 w-10 rounded-lg mb-4" />
                  <Skeleton className="h-8 w-24 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </Card>
              ))}
      
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((stat, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <stat.icon className="h-6 w-6 text-primary" />
              
            
                  <div>
                    <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                    <p className="text-xs text-muted-foreground">{stat.change}</p>
            
                </Card>
              ))}
      
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
              
                  ) : properties.length === 0 ? (
                    <div className="text-center py-8">
                      <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                      <p className="text-muted-foreground mb-4">No properties yet</p>
                      <Link href="/seller/listings/new">
                        <Button>Create Your First Listing</Button>
                      </Link>
              
                  ) : (
                    <div className="space-y-4">
                      {topProperties.slice(0, 5).map((property, index) => (
                        <div key={property.id}>
                          <div className="flex items-center justify-between mb-2 text-sm">
                            <span className="font-medium truncate max-w-[200px]">{property.title}</span>
                            <div className="flex gap-4 text-xs">
                              <span className="text-muted-foreground">{property.views} views</span>
                              <span className="text-muted-foreground">{property.inquiries} inquiries</span>
                      
                    
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ 
                                width: `${Math.min(100, totalViews > 0 ? (property.views / totalViews * 100) : 0)}%` 
                              }}
                            />
                    
                  
                      ))}
              
                  )}
                </Card>

                <Card className="p-6">
                  <h3 className="font-semibold text-lg mb-6">Engagement Breakdown</h3>
                  {isLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-12 w-full" />
                      ))}
              
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
                    
                          <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-primary rounded-full"
                              style={{ width: `${Math.min(100, item.percentage)}%` }}
                            />
                    
                  
                      ))}
              
                  )}
                </Card>
        
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
            
                ) : properties.length === 0 ? (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground mb-4">No properties to analyze</p>
                    <Link href="/seller/listings/new">
                      <Button>Create Your First Listing</Button>
                    </Link>
            
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
            
                )}
              </Card>
            </TabsContent>
          </Tabs>
  
    </main>
  );
}
