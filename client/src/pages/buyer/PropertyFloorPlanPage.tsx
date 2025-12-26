import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, ZoomIn, Maximize } from "lucide-react";

export default function PropertyFloorPlanPage() {
  const floorPlans = [
    {
      id: "1",
      name: "Ground Floor",
      area: "600 sqft",
      rooms: ["Living Room", "Kitchen", "Powder Room"],
    },
    {
      id: "2",
      name: "First Floor",
      area: "600 sqft",
      rooms: ["Master Bedroom", "Bedroom 2", "Bedroom 3", "Bathroom 1", "Bathroom 2"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">Floor Plans</h1>
              <p className="text-muted-foreground">
                Luxury 3BHK Apartment • Bandra West, Mumbai
              </p>
            </div>
            <Button variant="outline" data-testid="button-download-all">
              <Download className="h-4 w-4 mr-2" />
              Download All
            </Button>
          </div>

          <div className="space-y-8">
            {floorPlans.map((plan) => (
              <Card key={plan.id} className="p-8">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="font-serif font-bold text-2xl mb-2">
                      {plan.name}
                    </h2>
                    <Badge>{plan.area}</Badge>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-zoom-${plan.id}`}
                    >
                      <ZoomIn className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-fullscreen-${plan.id}`}
                    >
                      <Maximize className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${plan.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Floor Plan Image */}
                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-muted-foreground">
                    {plan.name} Floor Plan
                  </span>
                </div>

                {/* Room List */}
                <div>
                  <h3 className="font-semibold mb-3">Rooms:</h3>
                  <div className="flex flex-wrap gap-2">
                    {plan.rooms.map((room, index) => (
                      <Badge key={index} variant="outline">
                        {room}
                      </Badge>
                    ))}
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
