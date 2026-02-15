import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function PropertyNeighborhoodPage() {
  const demographics = {
    avgAge: "35-45 years",
    families: "68%",
    professionals: "82%",
    petOwners: "45%",
  };

  const lifestyle = [
    "Family-friendly community",
    "Active neighborhood association",
    "Regular community events",
    "Well-maintained parks",
    "Safe and secure environment",
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Neighborhood Profile
            </h1>
            <p className="text-muted-foreground">
              Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Demographics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">{demographics.avgAge}</p>
                <p className="text-xs text-muted-foreground">Average Age</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">{demographics.families}</p>
                <p className="text-xs text-muted-foreground">Families</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">{demographics.professionals}</p>
                <p className="text-xs text-muted-foreground">Professionals</p>
              </div>
              <div className="p-4 bg-muted rounded-lg text-center">
                <p className="text-2xl font-bold mb-1">{demographics.petOwners}</p>
                <p className="text-xs text-muted-foreground">Pet Owners</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Community Lifestyle</h3>
            <div className="space-y-3">
              {lifestyle.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <span className="text-green-600">✓</span>
                  <span>{item}</span>
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
