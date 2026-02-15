import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle } from "lucide-react";

export default function PropertyWarrantyPage() {
  const warranty = {
    structural: { duration: "10 years", coverage: "Foundation, beams, columns" },
    waterproofing: { duration: "5 years", coverage: "Roof, terraces, bathrooms" },
    electrical: { duration: "2 years", coverage: "Wiring, fixtures, switches" },
    plumbing: { duration: "2 years", coverage: "Pipes, faucets, fittings" },
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Builder Warranty
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="font-serif font-bold text-2xl mb-1">
                  Comprehensive Warranty Included
                </h2>
                <p className="text-muted-foreground">
                  This property comes with builder warranty coverage
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-4">
            {Object.entries(warranty).map(([key, value]) => (
              <Card key={key} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()} Warranty
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-muted-foreground">Duration</p>
                        <p className="font-semibold">{value.duration}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Coverage</p>
                        <p className="font-medium">{value.coverage}</p>
                      </div>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                    Active
                  </Badge>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
