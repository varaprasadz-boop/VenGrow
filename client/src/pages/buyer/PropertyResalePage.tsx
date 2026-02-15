import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { TrendingUp } from "lucide-react";

export default function PropertyResalePage() {
  const resaleData = {
    currentPrice: "₹85 L",
    projectedGrowth: "12%",
    estimatedResaleValue: "₹95.2 L",
    timeHorizon: "3 years",
    marketTrends: "Strong demand in Bandra",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Resale Value Projection
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">
                Projected Value in {resaleData.timeHorizon}
              </p>
              <p className="text-5xl font-bold font-serif text-primary mb-2">
                {resaleData.estimatedResaleValue}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                <TrendingUp className="h-3 w-3 mr-1" />
                {resaleData.projectedGrowth} growth
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Current Price</h3>
              <p className="text-3xl font-bold text-primary">
                {resaleData.currentPrice}
              </p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Projected Growth</h3>
              <p className="text-3xl font-bold text-green-600">
                {resaleData.projectedGrowth}
              </p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Market Analysis</h3>
            <p className="text-muted-foreground">
              {resaleData.marketTrends}. Historical data shows consistent price
              appreciation in this locality due to excellent connectivity, premium
              amenities, and high demand.
            </p>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
