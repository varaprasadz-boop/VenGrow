import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Train, Bus, Plane, MapPin } from "lucide-react";

export default function PropertyTransportPage() {
  const transport = [
    {
      type: "Metro Station",
      name: "Bandra Metro Station",
      distance: "500m",
      walkTime: "6 mins",
      icon: Train,
      lines: ["Line 1 (Blue)"],
    },
    {
      type: "Railway Station",
      name: "Bandra Railway Station",
      distance: "1.2 km",
      walkTime: "15 mins",
      icon: Train,
      lines: ["Western Line", "Harbour Line"],
    },
    {
      type: "Bus Stop",
      name: "Bandra Bus Depot",
      distance: "300m",
      walkTime: "4 mins",
      icon: Bus,
      lines: ["Route 33", "Route 84", "Route 220"],
    },
    {
      type: "Airport",
      name: "Mumbai International Airport",
      distance: "8.5 km",
      driveTime: "25 mins",
      icon: Plane,
      lines: [],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Transportation & Connectivity
            </h1>
            <p className="text-muted-foreground">
              Nearby public transport options
            </p>
          </div>

          {/* Map */}
          <Card className="p-6 mb-8">
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center">
              <span className="text-muted-foreground">Transport Map View</span>
            </div>
          </Card>

          {/* Transport Options */}
          <div className="space-y-4">
            {transport.map((option, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <option.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{option.name}</h3>
                      <Badge variant="outline">{option.type}</Badge>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{option.distance} away</span>
                      </div>
                      <div className="text-sm">
                        <span className="text-muted-foreground">
                          {option.walkTime ? "Walk: " : "Drive: "}
                        </span>
                        <span className="font-medium">
                          {option.walkTime || option.driveTime}
                        </span>
                      </div>
                    </div>

                    {option.lines.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {option.lines.map((line, idx) => (
                          <Badge key={idx}>{line}</Badge>
                        ))}
                      </div>
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
