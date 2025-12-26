import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Ruler } from "lucide-react";

export default function PropertyDimensionsPage() {
  const dimensions = {
    livingRoom: { length: "20 ft", width: "12.5 ft", height: "10 ft" },
    masterBedroom: { length: "15 ft", width: "12 ft", height: "10 ft" },
    bedroom2: { length: "12 ft", width: "10 ft", height: "10 ft" },
    bedroom3: { length: "12 ft", width: "10 ft", height: "10 ft" },
    kitchen: { length: "12 ft", width: "10 ft", height: "10 ft" },
    balcony: { length: "10 ft", width: "4 ft", height: "Open" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Ruler className="h-8 w-8 text-primary" />
              Room Dimensions
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <div className="space-y-4">
            {Object.entries(dimensions).map(([room, dims], index) => (
              <Card key={index} className="p-6">
                <h3 className="font-semibold text-lg mb-4 capitalize">
                  {room.replace(/([A-Z])/g, " $1").trim()}
                </h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Length</p>
                    <p className="font-semibold">{dims.length}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Width</p>
                    <p className="font-semibold">{dims.width}</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Height</p>
                    <p className="font-semibold">{dims.height}</p>
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
