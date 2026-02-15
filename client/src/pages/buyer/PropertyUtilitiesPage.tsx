import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, Droplet, Wifi, Flame, CheckCircle, XCircle } from "lucide-react";

export default function PropertyUtilitiesPage() {
  const utilities = [
    {
      icon: Zap,
      name: "Electricity",
      provider: "Maharashtra State Electricity",
      available: true,
      backup: "24/7 Power Backup",
      details: "3-phase connection available",
    },
    {
      icon: Droplet,
      name: "Water Supply",
      provider: "Municipal Corporation",
      available: true,
      backup: "Water Storage Tank",
      details: "24/7 water supply + storage",
    },
    {
      icon: Flame,
      name: "Gas Pipeline",
      provider: "Mahanagar Gas Limited",
      available: true,
      backup: null,
      details: "PNG connection",
    },
    {
      icon: Wifi,
      name: "Internet & Cable",
      provider: "Multiple ISPs Available",
      available: true,
      backup: null,
      details: "Fiber optic ready",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Utilities & Services
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <div className="space-y-4">
            {utilities.map((utility, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <utility.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{utility.name}</h3>
                      {utility.available ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Available
                        </Badge>
                      ) : (
                        <Badge variant="destructive">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Available
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      Provider: {utility.provider}
                    </p>
                    <p className="text-sm mb-2">{utility.details}</p>
                    {utility.backup && (
                      <Badge variant="outline">{utility.backup}</Badge>
                    )}
                  </div>
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
