import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Landmark, MapPin, Clock } from "lucide-react";

export default function PropertyBanksPage() {
  const banks = [
    {
      id: "1",
      name: "HDFC Bank",
      type: "Private Bank",
      distance: "400m",
      branch: "Bandra West Branch",
      atm: true,
      hours: "10 AM - 4 PM",
    },
    {
      id: "2",
      name: "State Bank of India",
      type: "Public Sector Bank",
      distance: "650m",
      branch: "Bandra Branch",
      atm: true,
      hours: "10 AM - 5 PM",
    },
    {
      id: "3",
      name: "ICICI Bank",
      type: "Private Bank",
      distance: "800m",
      branch: "Linking Road Branch",
      atm: true,
      hours: "9:30 AM - 4:30 PM",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Landmark className="h-8 w-8 text-primary" />
              Nearby Banks & ATMs
            </h1>
            <p className="text-muted-foreground">
              Banking facilities near this property
            </p>
          </div>

          <div className="space-y-4">
            {banks.map((bank) => (
              <Card key={bank.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{bank.name}</h3>
                      <Badge variant="outline">{bank.type}</Badge>
                      {bank.atm && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          ATM Available
                        </Badge>
                      )}
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {bank.branch}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{bank.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{bank.hours}</span>
                      </div>
                    </div>
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
