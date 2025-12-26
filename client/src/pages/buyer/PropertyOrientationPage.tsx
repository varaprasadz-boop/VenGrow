import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Compass } from "lucide-react";

export default function PropertyOrientationPage() {
  const orientation = {
    facing: "East",
    sunlight: "Morning sun throughout the day",
    ventilation: "Excellent cross-ventilation",
    vastu: "Vastu compliant",
    views: ["City skyline - East", "Garden - North"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Compass className="h-8 w-8 text-primary" />
              Property Orientation
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Main Facing Direction</p>
              <p className="text-6xl font-bold text-primary mb-3">
                {orientation.facing}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                {orientation.vastu}
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Natural Light</h3>
              <p className="text-muted-foreground">{orientation.sunlight}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Ventilation</h3>
              <p className="text-muted-foreground">{orientation.ventilation}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Directional Views</h3>
              <div className="space-y-3">
                {orientation.views.map((view, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <Compass className="h-5 w-5 text-primary" />
                    <span>{view}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
