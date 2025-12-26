import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Bed, Bath, UtensilsCrossed, Sofa } from "lucide-react";

export default function PropertyRoomDetailsPage() {
  const rooms = [
    {
      id: "1",
      name: "Living Room",
      icon: Sofa,
      size: "250 sqft",
      features: ["Large Windows", "Wooden Flooring", "False Ceiling", "AC"],
    },
    {
      id: "2",
      name: "Master Bedroom",
      icon: Bed,
      size: "180 sqft",
      features: ["Attached Bathroom", "Wardrobe", "Balcony", "AC"],
    },
    {
      id: "3",
      name: "Kitchen",
      icon: UtensilsCrossed,
      size: "120 sqft",
      features: ["Modular Kitchen", "Chimney", "Water Purifier", "Granite Counter"],
    },
    {
      id: "4",
      name: "Bathroom",
      icon: Bath,
      size: "60 sqft",
      features: ["Western Toilet", "Geyser", "Exhaust Fan", "Premium Fittings"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Room Details</h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {rooms.map((room) => (
              <Card key={room.id} className="p-6">
                <div className="flex items-center gap-4 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <room.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{room.name}</h3>
                    <Badge variant="outline">{room.size}</Badge>
                  </div>
                </div>

                <div className="aspect-video bg-muted rounded-lg mb-6 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">
                    {room.name} Image
                  </span>
                </div>

                <div>
                  <h4 className="font-medium mb-3">Features:</h4>
                  <div className="flex flex-wrap gap-2">
                    {room.features.map((feature, index) => (
                      <Badge key={index} variant="outline">
                        {feature}
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
