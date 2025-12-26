import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dumbbell, MapPin, Star, Clock } from "lucide-react";

export default function PropertyGymFitnessPage() {
  const facilities = [
    {
      id: "1",
      name: "Building Gym (Included)",
      type: "Residential Gym",
      distance: "In Building",
      rating: 4.0,
      hours: "6 AM - 10 PM",
      amenities: ["Cardio Equipment", "Free Weights", "Yoga Studio"],
    },
    {
      id: "2",
      name: "Gold's Gym Bandra",
      type: "Commercial Gym",
      distance: "800m",
      rating: 4.5,
      hours: "24/7",
      amenities: ["CrossFit", "Swimming Pool", "Personal Training"],
    },
    {
      id: "3",
      name: "Yoga Studio Bandra",
      type: "Yoga Center",
      distance: "500m",
      rating: 4.7,
      hours: "6 AM - 9 PM",
      amenities: ["Hatha Yoga", "Meditation", "Pilates"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Dumbbell className="h-8 w-8 text-primary" />
              Fitness & Wellness
            </h1>
            <p className="text-muted-foreground">
              Gyms and fitness centers near this property
            </p>
          </div>

          <div className="space-y-4">
            {facilities.map((facility) => (
              <Card key={facility.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{facility.name}</h3>
                      <Badge variant="outline">{facility.type}</Badge>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{facility.distance}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span>{facility.rating}/5</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{facility.hours}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Amenities:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {facility.amenities.map((amenity, index) => (
                          <Badge key={index}>{amenity}</Badge>
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
