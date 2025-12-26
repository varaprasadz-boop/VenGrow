import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Film, MapPin, Star } from "lucide-react";

export default function PropertyCinemaPage() {
  const cinemas = [
    {
      id: "1",
      name: "PVR Icon Versova",
      type: "Multiplex",
      distance: "2.5 km",
      screens: 7,
      rating: 4.3,
      features: ["IMAX", "Dolby Atmos", "Recliner Seats"],
    },
    {
      id: "2",
      name: "Carnival Cinemas",
      type: "Cinema",
      distance: "1.8 km",
      screens: 5,
      rating: 4.1,
      features: ["Standard Seating", "Snack Bar"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Film className="h-8 w-8 text-primary" />
              Nearby Cinemas
            </h1>
            <p className="text-muted-foreground">
              Entertainment options near this property
            </p>
          </div>

          <div className="space-y-4">
            {cinemas.map((cinema) => (
              <Card key={cinema.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{cinema.name}</h3>
                      <Badge variant="outline">{cinema.type}</Badge>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{cinema.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{cinema.rating}/5</span>
                      </div>
                      <div className="text-muted-foreground">
                        {cinema.screens} Screens
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {cinema.features.map((feature, index) => (
                          <Badge key={index}>{feature}</Badge>
                        ))}
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
