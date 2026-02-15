import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Leaf, CheckCircle, XCircle } from "lucide-react";

export default function PropertyEnvironmentalPage() {
  const features = {
    rainwaterHarvesting: true,
    solarPanels: false,
    wasteSegregation: true,
    greenBuilding: true,
    energyEfficient: true,
    organicWaste: true,
  };

  const environmentalFeatures = [
    { name: "Rainwater Harvesting", available: features.rainwaterHarvesting },
    { name: "Solar Panels", available: features.solarPanels },
    { name: "Waste Segregation", available: features.wasteSegregation },
    { name: "Green Building Certified", available: features.greenBuilding },
    { name: "Energy Efficient Lighting", available: features.energyEfficient },
    { name: "Organic Waste Composting", available: features.organicWaste },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Leaf className="h-8 w-8 text-primary" />
              Environmental Features
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Green Certification */}
          {features.greenBuilding && (
            <Card className="p-8 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
              <div className="flex items-center gap-4">
                <Leaf className="h-12 w-12 text-green-600" />
                <div>
                  <h2 className="font-serif font-bold text-2xl mb-1">
                    Green Building Certified
                  </h2>
                  <p className="text-muted-foreground">
                    This property is certified for environmental sustainability
                  </p>
                </div>
              </div>
            </Card>
          )}

          {/* Environmental Features */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Eco-Friendly Features</h3>
            <div className="space-y-4">
              {environmentalFeatures.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <span className="font-medium">{feature.name}</span>
                  {feature.available ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Available
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
