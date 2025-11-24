import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";

export default function PropertyPriceHistoryPage() {
  const priceHistory = [
    {
      date: "Nov 2025",
      price: "₹85 L",
      change: 0,
      status: "current",
    },
    {
      date: "Sep 2025",
      price: "₹90 L",
      change: -5.5,
      status: "reduced",
    },
    {
      date: "Jul 2025",
      price: "₹88 L",
      change: 2.3,
      status: "increased",
    },
    {
      date: "Jan 2025",
      price: "₹86 L",
      change: 2.3,
      status: "increased",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Price History
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Current Price */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Current Price</p>
              <p className="text-5xl font-bold font-serif text-primary mb-2">
                ₹85 L
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                <TrendingDown className="h-3 w-3 mr-1" />
                5.5% below initial listing
              </Badge>
            </div>
          </Card>

          {/* Price Chart */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Price Trend</h3>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">Price History Chart</span>
            </div>
          </Card>

          {/* Timeline */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Price Timeline</h3>
            <div className="space-y-4">
              {priceHistory.map((entry, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">{entry.date}</p>
                    {entry.status === "current" && (
                      <Badge variant="outline" className="mt-1">
                        Current
                      </Badge>
                    )}
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-lg">{entry.price}</p>
                    {entry.change !== 0 && (
                      <div className="flex items-center gap-1 justify-end mt-1">
                        {entry.change < 0 ? (
                          <>
                            <TrendingDown className="h-4 w-4 text-green-600" />
                            <span className="text-sm text-green-600 font-medium">
                              {Math.abs(entry.change)}% down
                            </span>
                          </>
                        ) : (
                          <>
                            <TrendingUp className="h-4 w-4 text-red-600" />
                            <span className="text-sm text-red-600 font-medium">
                              {entry.change}% up
                            </span>
                          </>
                        )}
                      </div>
                    )}
                  </div>
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
