import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap } from "lucide-react";

export default function PropertyElectricityPage() {
  const electricityInfo = {
    provider: "Tata Power",
    connection: "3-Phase",
    backup: "100% Power Backup",
    solarPanels: "Yes - 5 KW System",
    avgBill: "₹3,500/month",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Zap className="h-8 w-8 text-primary" />
              Electricity Details
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/10 dark:to-yellow-900/20">
            <div className="text-center">
              <Zap className="h-16 w-16 text-yellow-600 mx-auto mb-4" />
              <p className="text-2xl font-bold text-yellow-600 mb-2">
                {electricityInfo.backup}
              </p>
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                Uninterrupted Power
              </Badge>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-lg">Electricity Provider</h3>
                <Badge variant="outline">{electricityInfo.provider}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">Connection Type</p>
                  <p className="font-semibold">{electricityInfo.connection}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Avg. Bill</p>
                  <p className="font-semibold">{electricityInfo.avgBill}</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Solar Panels</h3>
              <div className="flex items-center gap-3 mb-2">
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                  Installed
                </Badge>
                <span className="font-semibold">{electricityInfo.solarPanels}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Reduces electricity bills and carbon footprint
              </p>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
