import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, DollarSign, Home } from "lucide-react";

export default function MarketInsightsPage() {
  const cityData = [
    {
      city: "Mumbai",
      avgPrice: "₹85 L",
      growth: "+12.5%",
      trending: "up",
      totalListings: 15234,
    },
    {
      city: "Bangalore",
      avgPrice: "₹65 L",
      growth: "+15.2%",
      trending: "up",
      totalListings: 12456,
    },
    {
      city: "Delhi NCR",
      avgPrice: "₹72 L",
      growth: "+8.3%",
      trending: "up",
      totalListings: 18765,
    },
    {
      city: "Pune",
      avgPrice: "₹55 L",
      growth: "-2.1%",
      trending: "down",
      totalListings: 9876,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Market Insights
            </h1>
            <p className="text-muted-foreground">
              Real-time property market trends and analytics
            </p>
          </div>

          {/* Overview Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Home className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">56K+</p>
                  <p className="text-sm text-muted-foreground">Total Listings</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">+10.8%</p>
                  <p className="text-sm text-muted-foreground">Market Growth</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <DollarSign className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">₹68 L</p>
                  <p className="text-sm text-muted-foreground">Avg Price</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Home className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">3.2K</p>
                  <p className="text-sm text-muted-foreground">New This Week</p>
                </div>
              </div>
            </Card>
          </div>

          {/* City-wise Analysis */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">City-wise Market Analysis</h3>
            <div className="space-y-4">
              {cityData.map((city, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center gap-4">
                    <div>
                      <h4 className="font-semibold text-lg">{city.city}</h4>
                      <p className="text-sm text-muted-foreground">
                        {city.totalListings.toLocaleString()} active listings
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">Avg Price</p>
                      <p className="font-semibold text-lg">{city.avgPrice}</p>
                    </div>

                    <div className="text-right">
                      <p className="text-sm text-muted-foreground mb-1">YoY Growth</p>
                      <div className="flex items-center gap-2">
                        {city.trending === "up" ? (
                          <TrendingUp className="h-5 w-5 text-green-600" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-red-600" />
                        )}
                        <p
                          className={`font-semibold ${
                            city.trending === "up"
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {city.growth}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Price Trends Chart */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Price Trends (Last 12 Months)</h3>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">Price Trend Chart</span>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
