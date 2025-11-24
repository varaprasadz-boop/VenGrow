import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, TrendingUp, User, FileText } from "lucide-react";

export default function PropertyHistoryPage() {
  const history = [
    {
      date: "Nov 2025",
      event: "Listed for Sale",
      price: "₹85 L",
      seller: "Prestige Estates",
      type: "listing",
    },
    {
      date: "Sep 2023",
      event: "Previous Sale",
      price: "₹72 L",
      seller: "Individual Owner",
      type: "sale",
    },
    {
      date: "Jun 2021",
      event: "Property Registered",
      price: "₹65 L",
      seller: "Builder",
      type: "registration",
    },
  ];

  const priceHistory = [
    { year: "2021", price: 6500000 },
    { year: "2023", price: 7200000 },
    { year: "2025", price: 8500000 },
  ];

  const maxPrice = Math.max(...priceHistory.map((p) => p.price));

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property History
            </h1>
            <p className="text-muted-foreground">
              Complete ownership and transaction history
            </p>
          </div>

          {/* Property Info */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-4">
              Luxury 3BHK Apartment in Prime Location
            </h3>
            <p className="text-muted-foreground mb-4">
              Bandra West, Mumbai • 1,200 sqft • 3 BHK
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Current Price
                </p>
                <p className="text-2xl font-bold text-primary">₹85 L</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Price Appreciation
                </p>
                <p className="text-2xl font-bold text-green-600">+30.8%</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">
                  Years Owned
                </p>
                <p className="text-2xl font-bold">4 years</p>
              </div>
            </div>
          </Card>

          {/* Price Trend */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Price Trend
            </h3>
            <div className="space-y-4">
              {priceHistory.map((item, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium">{item.year}</span>
                    <span className="font-semibold">
                      ₹{(item.price / 100000).toFixed(1)} L
                    </span>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary rounded-full transition-all"
                      style={{ width: `${(item.price / maxPrice) * 100}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Transaction History */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" />
              Transaction History
            </h3>
            <div className="space-y-6">
              {history.map((item, index) => (
                <div
                  key={index}
                  className="relative pl-8 pb-6 border-l-2 border-muted last:border-0 last:pb-0"
                >
                  <div className="absolute -left-2 top-0">
                    <div className="h-4 w-4 rounded-full bg-primary border-4 border-background" />
                  </div>
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <p className="font-semibold">{item.event}</p>
                      {item.type === "listing" && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
                          Current
                        </Badge>
                      )}
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4" />
                        <span>{item.date}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="h-4 w-4" />
                        <span className="font-semibold text-foreground">
                          {item.price}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="h-4 w-4" />
                        <span>{item.seller}</span>
                      </div>
                    </div>
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
