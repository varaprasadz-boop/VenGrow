import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingBag, MapPin, Star } from "lucide-react";

export default function PropertyShoppingPage() {
  const shopping = [
    {
      id: "1",
      name: "Linking Road Shopping Street",
      type: "Street Market",
      distance: "600m",
      description: "Popular street shopping destination",
      rating: 4.2,
    },
    {
      id: "2",
      name: "Palladium Mall",
      type: "Shopping Mall",
      distance: "2.5 km",
      description: "Premium shopping mall with luxury brands",
      rating: 4.6,
    },
    {
      id: "3",
      name: "DMart",
      type: "Supermarket",
      distance: "1.2 km",
      description: "Grocery and daily needs",
      rating: 4.0,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <ShoppingBag className="h-8 w-8 text-primary" />
              Shopping & Retail
            </h1>
            <p className="text-muted-foreground">
              Nearby shopping destinations
            </p>
          </div>

          <div className="space-y-4">
            {shopping.map((place) => (
              <Card key={place.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{place.name}</h3>
                      <Badge variant="outline">{place.type}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-4">
                      {place.description}
                    </p>

                    <div className="flex items-center gap-6 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{place.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{place.rating}/5</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
