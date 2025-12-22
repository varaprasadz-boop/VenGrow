
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  MessageSquare,
  Download,
} from "lucide-react";

export default function PerformanceInsightsPage() {
  const metrics = [
    {
      label: "Average Response Time",
      value: "2.5 hours",
      change: "-15%",
      trend: "up",
      icon: MessageSquare,
    },
    {
      label: "Inquiry Conversion Rate",
      value: "18%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
    },
    {
      label: "Listing Views per Property",
      value: "1,234",
      change: "+23%",
      trend: "up",
      icon: Eye,
    },
    {
      label: "Favorite Rate",
      value: "12%",
      change: "-2%",
      trend: "down",
      icon: Heart,
    },
  ];

  const recommendations = [
    {
      title: "Improve Response Time",
      description: "Your average response time is higher than top performers. Try responding within 1 hour for better engagement.",
      priority: "high",
    },
    {
      title: "Add More Photos",
      description: "Listings with 10+ photos get 45% more views. Consider adding more images to your properties.",
      priority: "medium",
    },
    {
      title: "Update Pricing",
      description: "Your properties in Bandra are priced 8% above market average. Consider reviewing your pricing strategy.",
      priority: "medium",
    },
    {
      title: "Optimize Descriptions",
      description: "Add more details about amenities and nearby facilities to increase inquiry rates.",
      priority: "low",
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Performance Insights
              </h1>
              <p className="text-muted-foreground">
                AI-powered recommendations to improve your listing performance
              </p>
      
            <Button data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
    

          {/* Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {metrics.map((metric, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <metric.icon className="h-6 w-6 text-primary" />
            
                  {metric.trend === "up" ? (
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-600" />
                  )}
          
                <p className="text-3xl font-bold font-serif mb-1">
                  {metric.value}
                </p>
                <p className="text-sm text-muted-foreground mb-2">
                  {metric.label}
                </p>
                <p
                  className={`text-sm font-medium ${
                    metric.trend === "up" ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {metric.change} vs last month
                </p>
              </Card>
            ))}
    

          {/* Recommendations */}
          <div>
            <h2 className="font-semibold text-xl mb-6">
              Personalized Recommendations
            </h2>
            <div className="space-y-4">
              {recommendations.map((rec, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{rec.title}</h3>
                        {rec.priority === "high" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
                            High Priority
                          </span>
                        )}
                        {rec.priority === "medium" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                            Medium Priority
                          </span>
                        )}
                        {rec.priority === "low" && (
                          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500">
                            Low Priority
                          </span>
                        )}
                
                      <p className="text-sm text-muted-foreground">
                        {rec.description}
                      </p>
              
            
                  <Button variant="outline" size="sm" data-testid={`button-action-${index}`}>
                    Take Action
                  </Button>
                </Card>
              ))}
      
    

          {/* Benchmark */}
          <Card className="p-6 mt-8">
            <h3 className="font-semibold text-lg mb-6">
              Industry Benchmark Comparison
            </h3>
            <div className="space-y-6">
              {[
                {
                  metric: "Response Time",
                  your: 150,
                  average: 120,
                  top: 60,
                  unit: "minutes",
                },
                {
                  metric: "Photos per Listing",
                  your: 8,
                  average: 10,
                  top: 15,
                  unit: "photos",
                },
                {
                  metric: "Description Length",
                  your: 180,
                  average: 200,
                  top: 300,
                  unit: "words",
                },
              ].map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.metric}</span>
                    <div className="flex gap-6 text-sm">
                      <span className="text-muted-foreground">
                        You: {item.your} {item.unit}
                      </span>
                      <span className="text-muted-foreground">
                        Avg: {item.average} {item.unit}
                      </span>
                      <span className="text-green-600">
                        Top 10%: {item.top} {item.unit}
                      </span>
              
            
                  <div className="relative h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="absolute h-full bg-blue-200 dark:bg-blue-900/40"
                      style={{ width: `${(item.your / item.top) * 100}%` }}
                    />
                    <div
                      className="absolute h-full border-l-2 border-orange-500"
                      style={{ left: `${(item.average / item.top) * 100}%` }}
                    />
            
          
              ))}
      
          </Card>
  
      </main>
  );
}
