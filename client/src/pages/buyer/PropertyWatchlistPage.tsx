import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Bell, TrendingDown, MapPin } from "lucide-react";

export default function PropertyWatchlistPage() {
  const watchedProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      currentPrice: "₹85 L",
      initialPrice: "₹90 L",
      priceChange: -5.5,
      lastUpdate: "2 hours ago",
      alerts: true,
    },
    {
      id: "2",
      title: "Commercial Office Space",
      location: "BKC, Mumbai",
      currentPrice: "₹2.5 Cr",
      initialPrice: "₹2.5 Cr",
      priceChange: 0,
      lastUpdate: "1 day ago",
      alerts: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Eye className="h-8 w-8 text-primary" />
              Property Watchlist
            </h1>
            <p className="text-muted-foreground">
              Monitor price changes and updates for properties you're interested in
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {watchedProperties.map((property) => (
              <Card key={property.id} className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Image</span>
                </div>

                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                  <MapPin className="h-4 w-4" />
                  {property.location}
                </div>

                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-2xl font-bold font-serif text-primary">
                      {property.currentPrice}
                    </p>
                    {property.priceChange !== 0 && (
                      <div className="flex items-center gap-1 text-sm mt-1">
                        <TrendingDown className="h-4 w-4 text-green-600" />
                        <span className="text-green-600 font-medium">
                          {Math.abs(property.priceChange)}% down from ₹{property.initialPrice}
                        </span>
                      </div>
                    )}
                  </div>
                  <Badge
                    variant={property.alerts ? "default" : "outline"}
                    className="flex items-center gap-1"
                  >
                    <Bell className="h-3 w-3" />
                    {property.alerts ? "On" : "Off"}
                  </Badge>
                </div>

                <p className="text-xs text-muted-foreground mb-4">
                  Updated {property.lastUpdate}
                </p>

                <Button
                  className="w-full"
                  data-testid={`button-view-${property.id}`}
                >
                  View Details
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
