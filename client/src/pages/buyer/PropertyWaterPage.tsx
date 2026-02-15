import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Droplet } from "lucide-react";

export default function PropertyWaterPage() {
  const waterInfo = {
    supply: "24/7 Municipal + Borewell",
    storage: "10,000 liters overhead tank",
    quality: "RO purification system",
    pressure: "Good water pressure on all floors",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Droplet className="h-8 w-8 text-primary" />
              Water Supply
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/10 dark:to-blue-900/20">
            <div className="text-center">
              <Droplet className="h-16 w-16 text-blue-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-blue-600 mb-2" data-testid="text-water-supply">
                {waterInfo.supply}
              </p>
              <Badge
                className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500"
                data-testid="badge-water-status"
              >
                Continuous Supply
              </Badge>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Storage Capacity</h3>
              <p className="text-xl font-semibold" data-testid="text-water-storage">
                {waterInfo.storage}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Water Quality</h3>
              <p className="text-muted-foreground" data-testid="text-water-quality">
                {waterInfo.quality}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Water Pressure</h3>
              <p className="text-muted-foreground" data-testid="text-water-pressure">
                {waterInfo.pressure}
              </p>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
