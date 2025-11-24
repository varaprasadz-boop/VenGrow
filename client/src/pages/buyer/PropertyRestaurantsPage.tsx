import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { UtensilsCrossed, Star, MapPin } from "lucide-react";

export default function PropertyRestaurantsPage() {
  const restaurants = [
    {
      id: "1",
      name: "Taj Land's End - Masala Bay",
      cuisine: "Indian Fine Dining",
      distance: "1.2 km",
      rating: 4.5,
      priceRange: "₹₹₹₹",
    },
    {
      id: "2",
      name: "Pali Village Cafe",
      cuisine: "European, Cafe",
      distance: "800m",
      rating: 4.3,
      priceRange: "₹₹₹",
    },
    {
      id: "3",
      name: "Suzette",
      cuisine: "French, Crepes",
      distance: "600m",
      rating: 4.4,
      priceRange: "₹₹",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              Nearby Restaurants & Cafes
            </h1>
            <p className="text-muted-foreground">
              Dining options near this property
            </p>
          </div>

          <div className="space-y-4">
            {restaurants.map((restaurant) => (
              <Card key={restaurant.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">
                      {restaurant.name}
                    </h3>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3">
                      <div className="text-sm">
                        <span className="text-muted-foreground">Cuisine: </span>
                        <span className="font-medium">{restaurant.cuisine}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{restaurant.distance}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{restaurant.rating}/5</span>
                      </div>
                      <div className="text-sm">
                        <Badge variant="outline">{restaurant.priceRange}</Badge>
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
