import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Users, Building, TrendingUp, DollarSign } from "lucide-react";

export default function PlatformStatisticsPage() {
  const stats = [
    { label: "Total Users", value: "156,234", icon: Users, color: "blue" },
    { label: "Active Listings", value: "56,789", icon: Building, color: "green" },
    { label: "Monthly Transactions", value: "₹45 Cr", icon: DollarSign, color: "orange" },
    { label: "Platform Growth", value: "+23%", icon: TrendingUp, color: "purple" },
  ];

  const metrics = [
    { category: "User Engagement", value: "87%", description: "Monthly active users" },
    { category: "Listing Success Rate", value: "72%", description: "Properties sold/rented" },
    { category: "Response Time", value: "2.4 hrs", description: "Average inquiry response" },
    { category: "Customer Satisfaction", value: "4.5/5", description: "Average rating" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Platform Statistics
            </h1>
            <p className="text-muted-foreground">
              Overview of platform performance and metrics
            </p>
          </div>

          {/* Main Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg bg-${stat.color}-100 dark:bg-${stat.color}-900/20`}>
                    <stat.icon className={`h-6 w-6 text-${stat.color}-600`} />
                  </div>
                  <div>
                    <p className="text-3xl font-bold">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">User Growth (Last 6 Months)</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">User Growth Chart</span>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Revenue Trends</h3>
              <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                <span className="text-muted-foreground">Revenue Chart</span>
              </div>
            </Card>
          </div>

          {/* Key Metrics */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Key Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    {metric.category}
                  </p>
                  <p className="text-3xl font-bold mb-2">{metric.value}</p>
                  <p className="text-xs text-muted-foreground">{metric.description}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
