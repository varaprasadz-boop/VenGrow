import { Card } from "@/components/ui/card";
import { TrendingUp, Clock, Zap, Server } from "lucide-react";

export default function PerformanceDashboardPage() {
  const metrics = [
    {
      label: "Response Time",
      value: "245ms",
      trend: "-15%",
      icon: Clock,
      color: "blue",
    },
    {
      label: "Uptime",
      value: "99.98%",
      trend: "+0.02%",
      icon: Server,
      color: "green",
    },
    {
      label: "Page Load Speed",
      value: "1.2s",
      trend: "-20%",
      icon: Zap,
      color: "purple",
    },
    {
      label: "API Success Rate",
      value: "99.5%",
      trend: "+0.5%",
      icon: TrendingUp,
      color: "orange",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Performance Dashboard
            </h1>
            <p className="text-muted-foreground">
              Monitor system performance and health metrics
            </p>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={`p-3 rounded-lg bg-${metric.color}-100 dark:bg-${metric.color}-900/20`}>
                    <metric.icon className={`h-6 w-6 text-${metric.color}-600`} />
                  </div>
                </div>
                <p className="text-3xl font-bold mb-2">{metric.value}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{metric.label}</p>
                  <span className={`text-sm ${metric.trend.startsWith('-') ? 'text-green-600' : 'text-blue-600'}`}>
                    {metric.trend}
                  </span>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Response Time (24h)</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Response Time Chart</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">API Request Volume</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Request Volume Chart</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Error Rate Trend</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Error Rate Chart</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Server Load</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Server Load Chart</span>
              </div>
            </Card>
          </div>
        </div>
      </main>
    );
}
