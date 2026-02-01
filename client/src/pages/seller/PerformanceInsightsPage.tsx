import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
} from "lucide-react";

interface LeadPerformanceData {
  averageResponseTimeHours: number;
  averageResponseTimeLabel: string;
  responseTimeChange: number;
  inquiryConversionRate: number;
  conversionRateChange: number;
  avgViewsPerProperty: number;
  viewsPerPropertyChange: number;
  favoriteRate: number;
  favoriteRateChange: number;
}

export default function PerformanceInsightsPage() {
  const { data, isLoading, error } = useQuery<LeadPerformanceData>({
    queryKey: ["/api/seller/lead-performance"],
    queryFn: async () => {
      const res = await fetch("/api/seller/lead-performance", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch lead performance");
      return res.json();
    },
  });

  const formatChange = (change: number) => {
    if (change === 0) return "—";
    const sign = change > 0 ? "+" : "";
    return `${sign}${Math.round(Math.abs(change))}%`;
  };

  const metrics = data
    ? [
        {
          label: "Average Response Time",
          value: data.averageResponseTimeLabel || "—",
          change: formatChange(data.responseTimeChange),
          trend: data.responseTimeChange <= 0 ? "up" as const : "down" as const,
          icon: MessageSquare,
        },
        {
          label: "Inquiry Conversion Rate",
          value: `${data.inquiryConversionRate}%`,
          change: formatChange(data.conversionRateChange),
          trend: data.conversionRateChange >= 0 ? "up" as const : "down" as const,
          icon: TrendingUp,
        },
        {
          label: "Listing Views per Property",
          value: data.avgViewsPerProperty.toLocaleString(),
          change: data.viewsPerPropertyChange !== 0 ? formatChange(data.viewsPerPropertyChange) : "—",
          trend: (data.viewsPerPropertyChange >= 0 ? "up" : "down") as "up" | "down",
          icon: Eye,
        },
        {
          label: "Favorite Rate",
          value: `${data.favoriteRate}%`,
          change: data.favoriteRateChange !== 0 ? formatChange(data.favoriteRateChange) : "—",
          trend: (data.favoriteRateChange >= 0 ? "up" : "down") as "up" | "down",
          icon: Heart,
        },
      ]
    : [];

  return (
    <main className="flex-1">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl mb-2">
            Performance Insights
          </h1>
          <p className="text-muted-foreground">
            Lead and listing performance metrics
          </p>
        </div>

        {/* Performance Insights - 4 cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {isLoading || error ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="p-6">
                <div className="flex flex-col gap-4">
                  <Skeleton className="h-10 w-10 rounded-lg" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-20" />
                </div>
              </Card>
            ))
          ) : (
            metrics.map((metric, index) => (
              <Card key={index} className="p-6" data-testid={`card-metric-${index}`}>
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <metric.icon className="h-6 w-6 text-primary" />
                  </div>
                  {metric.change !== "—" && (
                    metric.trend === "up" ? (
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    ) : (
                      <TrendingDown className="h-5 w-5 text-red-600" />
                    )
                  )}
                </div>
                <p className="text-3xl font-bold font-serif mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {metric.label}
                </p>
                <p
                  className={`text-sm font-medium ${
                    metric.change === "—"
                      ? "text-muted-foreground"
                      : metric.trend === "up"
                        ? "text-green-600"
                        : "text-red-600"
                  }`}
                >
                  {metric.change === "—" ? "No prior period data" : `${metric.change} vs last 30 days`}
                </p>
              </Card>
            ))
          )}
        </div>
      </div>
    </main>
  );
}
