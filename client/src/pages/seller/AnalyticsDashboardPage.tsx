import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import { format } from "date-fns";

interface AnalyticsResponse {
  totalViews: number;
  totalFavorites: number;
  totalInquiries: number;
  properties: {
    id: string;
    title: string;
    viewCount: number;
    favoriteCount: number;
    inquiryCount: number;
    engagementRate: string;
  }[];
  startDate: string | null;
  endDate: string | null;
}

function getRangeLabel(
  selectedRange: string,
  customStart?: string,
  customEnd?: string
): string {
  if (selectedRange === "all") return "All Time";
  if (selectedRange === "7d") return "Last 7 Days";
  if (selectedRange === "30d") return "Last 30 Days";
  if (selectedRange === "custom" && customStart && customEnd) {
    try {
      const start = format(new Date(customStart), "dd MMM yyyy");
      const end = format(new Date(customEnd), "dd MMM yyyy");
      return `${start} – ${end}`;
    } catch {
      return "Custom Range";
    }
  }
  return "Custom Range";
}

export default function AnalyticsDashboardPage() {
  const { toast } = useToast();
  const [dateRangeDialogOpen, setDateRangeDialogOpen] = useState(false);
  const [selectedRange, setSelectedRange] = useState("all");
  const [customStartDate, setCustomStartDate] = useState("");
  const [customEndDate, setCustomEndDate] = useState("");

  const buildQueryParams = (): Record<string, string> => {
    if (selectedRange === "custom" && customStartDate && customEndDate) {
      return { startDate: customStartDate, endDate: customEndDate };
    }
    if (selectedRange === "7d" || selectedRange === "30d") {
      return { range: selectedRange };
    }
    if (selectedRange === "custom") {
      return { range: "7d" };
    }
    return {};
  };

  const queryParams = buildQueryParams();
  const queryKey = [
    "/api/seller/analytics",
    queryParams as Record<string, string>,
  ] as const;

  const { data: analytics, isLoading } = useQuery<AnalyticsResponse>({
    queryKey,
    queryFn: async () => {
      const params = new URLSearchParams(queryParams);
      const response = await fetch(`/api/seller/analytics?${params}`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch analytics");
      }
      return response.json();
    },
  });

  const totalViews = analytics?.totalViews ?? 0;
  const totalFavorites = analytics?.totalFavorites ?? 0;
  const totalInquiries = analytics?.totalInquiries ?? 0;
  const engagementRate =
    totalViews > 0
      ? (((totalFavorites + totalInquiries) / totalViews) * 100).toFixed(1)
      : "0.0";
  const topProperties = analytics?.properties ?? [];
  const properties = analytics?.properties ?? [];

  const handleDateRangeClick = () => {
    setDateRangeDialogOpen(true);
  };

  const handleRangeSelect = (range: string) => {
    if (range === "custom") {
      setSelectedRange("custom");
      const now = new Date();
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (!customStartDate) setCustomStartDate(format(weekAgo, "yyyy-MM-dd"));
      if (!customEndDate) setCustomEndDate(format(now, "yyyy-MM-dd"));
      return;
    }
    setSelectedRange(range);
    setDateRangeDialogOpen(false);
  };

  const handleCustomRangeApply = () => {
    if (customStartDate && customEndDate) {
      const start = new Date(customStartDate);
      const end = new Date(customEndDate);
      if (start > end) {
        toast({
          title: "Invalid date range",
          description: "Start date must be before end date",
          variant: "destructive",
        });
        return;
      }
      setSelectedRange("custom");
      setDateRangeDialogOpen(false);
    }
  };

  const getRangeSubtitle = () => {
    if (selectedRange === "all") return "All-time views on your listings";
    if (selectedRange === "7d") return "Last 7 days";
    if (selectedRange === "30d") return "Last 30 days";
    if (selectedRange === "custom" && customStartDate && customEndDate) {
      return `${format(new Date(customStartDate), "dd MMM")} – ${format(new Date(customEndDate), "dd MMM yyyy")}`;
    }
    return "Select a date range";
  };

  const handleExport = () => {
    const csvData = [
      ["Property", "Views", "Favorites", "Inquiries", "Engagement Rate"],
      ...topProperties.map((p) => [
        p.title,
        p.viewCount.toString(),
        p.favoriteCount.toString(),
        p.inquiryCount.toString(),
        p.engagementRate,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(",")).join("\n");
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

  const stats = [
    {
      label: "Total Views",
      value: totalViews.toLocaleString(),
      change: getRangeSubtitle(),
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
            <Button
              variant="outline"
              data-testid="button-date-range"
              onClick={handleDateRangeClick}
            >
              <Calendar className="h-4 w-4 mr-2" />
              {getRangeLabel(
                selectedRange,
                customStartDate,
                customEndDate
              )}
            </Button>
            <Dialog
              open={dateRangeDialogOpen}
              onOpenChange={setDateRangeDialogOpen}
            >
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
                    variant={selectedRange === "7d" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleRangeSelect("7d")}
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    variant={selectedRange === "30d" ? "default" : "outline"}
                    className="w-full justify-start"
                    onClick={() => handleRangeSelect("30d")}
                  >
                    Last 30 Days
                  </Button>
                  <Button
                    variant={
                      selectedRange === "custom" ? "default" : "outline"
                    }
                    className="w-full justify-start"
                    onClick={() => handleRangeSelect("custom")}
                  >
                    Custom Range
                  </Button>
                  {selectedRange === "custom" && (
                    <div className="pt-4 space-y-3 border-t">
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Start Date
                        </label>
                        <Input
                          type="date"
                          value={customStartDate}
                          onChange={(e) =>
                            setCustomStartDate(e.target.value)
                          }
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          End Date
                        </label>
                        <Input
                          type="date"
                          value={customEndDate}
                          onChange={(e) =>
                            setCustomEndDate(e.target.value)
                          }
                        />
                      </div>
                      <Button
                        className="w-full"
                        onClick={handleCustomRangeApply}
                      >
                        Apply
                      </Button>
                    </div>
                  )}
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
                  <p className="text-3xl font-bold font-serif mb-1">
                    {stat.value}
                  </p>
                  <p className="text-sm text-muted-foreground mb-2">
                    {stat.label}
                  </p>
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
                <h3 className="font-semibold text-lg mb-6">
                  Property Performance
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
                    <p className="text-muted-foreground mb-4">
                      No properties yet
                    </p>
                    <Link href="/seller/listings/new">
                      <Button>Create Your First Listing</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {topProperties.slice(0, 5).map((property) => (
                      <div key={property.id}>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-medium truncate max-w-[200px]">
                            {property.title}
                          </span>
                          <div className="flex gap-4 text-xs">
                            <span className="text-muted-foreground">
                              {property.viewCount} views
                            </span>
                            <span className="text-muted-foreground">
                              {property.inquiryCount} inquiries
                            </span>
                          </div>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(
                                100,
                                totalViews > 0
                                  ? (property.viewCount / totalViews) * 100
                                  : 0
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold text-lg mb-6">
                  Engagement Breakdown
                </h3>
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
                        count: totalViews.toLocaleString(),
                      },
                      {
                        source: "Favorites Received",
                        percentage:
                          totalViews > 0
                            ? Math.round(
                                (totalFavorites / totalViews) * 100
                              )
                            : 0,
                        count: totalFavorites.toLocaleString(),
                      },
                      {
                        source: "Inquiries Received",
                        percentage:
                          totalViews > 0
                            ? Math.round(
                                (totalInquiries / totalViews) * 100
                              )
                            : 0,
                        count: totalInquiries.toLocaleString(),
                      },
                      {
                        source: "Active Listings",
                        percentage: 100,
                        count: properties.length.toString(),
                      },
                    ].map((item, index) => (
                      <div key={index}>
                        <div className="flex items-center justify-between mb-2 text-sm">
                          <span className="font-medium">{item.source}</span>
                          <span className="text-muted-foreground">
                            {item.count}{" "}
                            {item.percentage > 0 &&
                              item.percentage < 100 &&
                              `(${item.percentage}%)`}
                          </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className="h-full bg-primary rounded-full"
                            style={{
                              width: `${Math.min(100, item.percentage)}%`,
                            }}
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
                  <p className="text-muted-foreground mb-4">
                    No properties to analyze
                  </p>
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
                        <tr
                          key={property.id}
                          className="border-b last:border-0"
                        >
                          <td className="p-3">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-bold text-primary">
                                #{index + 1}
                              </span>
                              <Link href={`/property/${property.id}`}>
                                <span className="font-medium hover:text-primary cursor-pointer">
                                  {property.title}
                                </span>
                              </Link>
                            </div>
                          </td>
                          <td className="p-3 text-center">
                            {property.viewCount}
                          </td>
                          <td className="p-3 text-center">
                            {property.favoriteCount}
                          </td>
                          <td className="p-3 text-center">
                            {property.inquiryCount}
                          </td>
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
