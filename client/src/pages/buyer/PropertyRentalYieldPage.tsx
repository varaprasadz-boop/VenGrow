import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export default function PropertyRentalYieldPage() {
  const rentalData = {
    propertyPrice: "₹85 L",
    expectedRent: "₹45,000/month",
    annualRent: "₹5,40,000",
    rentalYield: "6.35%",
    marketAverage: "5.2%",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Rental Yield Analysis
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Rental Yield */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Expected Rental Yield</p>
              <p className="text-6xl font-bold font-serif text-primary mb-2">
                {rentalData.rentalYield}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                Above market average
              </Badge>
            </div>
          </Card>

          {/* Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Property Value</h3>
              <p className="text-3xl font-bold text-primary">
                {rentalData.propertyPrice}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Expected Monthly Rent</h3>
              <p className="text-3xl font-bold">{rentalData.expectedRent}</p>
            </Card>
          </div>

          {/* Comparison */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Market Comparison</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">This Property</span>
                  <span className="font-semibold text-primary">
                    {rentalData.rentalYield}
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-primary" style={{ width: "65%" }} />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">Market Average (Bandra)</span>
                  <span className="font-semibold">{rentalData.marketAverage}</span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div className="h-full bg-muted-foreground" style={{ width: "52%" }} />
                </div>
              </div>
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
