import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MapPin, Star } from "lucide-react";

export default function PropertyNearbyAttractionsPage() {
  const attractions = [
    {
      id: "1",
      name: "Bandra Fort",
      type: "Historical",
      distance: "1.5 km",
      rating: 4.2,
      description: "Historic fort with sea views",
    },
    {
      id: "2",
      name: "Carter Road Promenade",
      type: "Recreation",
      distance: "1 km",
      rating: 4.5,
      description: "Popular seafront walking area",
    },
    {
      id: "3",
      name: "Mount Mary Church",
      type: "Religious",
      distance: "2 km",
      rating: 4.6,
      description: "Famous Catholic basilica",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Nearby Attractions
            </h1>
            <p className="text-muted-foreground">
              Popular tourist spots and landmarks
            </p>
          </div>

          <div className="space-y-4">
            {attractions.map((attraction) => (
              <Card key={attraction.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{attraction.name}</h3>
                      <Badge variant="outline">{attraction.type}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {attraction.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{attraction.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{attraction.rating}/5</span>
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
