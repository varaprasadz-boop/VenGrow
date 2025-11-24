import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trees, MapPin, Clock } from "lucide-react";

export default function PropertyParksPage() {
  const parks = [
    {
      id: "1",
      name: "Bandra Bandstand Promenade",
      type: "Seafront Park",
      distance: "1.5 km",
      features: ["Walking Track", "Sea View", "Gardens"],
      hours: "24/7",
    },
    {
      id: "2",
      name: "Joggers Park",
      type: "Community Park",
      distance: "800m",
      features: ["Jogging Track", "Exercise Equipment", "Children's Play Area"],
      hours: "5 AM - 10 PM",
    },
    {
      id: "3",
      name: "Bandra Fort Garden",
      type: "Historic Park",
      distance: "2 km",
      features: ["Historic Monument", "Picnic Spots", "Photography"],
      hours: "6 AM - 8 PM",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Trees className="h-8 w-8 text-primary" />
              Parks & Green Spaces
            </h1>
            <p className="text-muted-foreground">
              Outdoor recreation areas near this property
            </p>
          </div>

          <div className="space-y-4">
            {parks.map((park) => (
              <Card key={park.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{park.name}</h3>
                      <Badge variant="outline">{park.type}</Badge>
                    </div>

                    <div className="flex items-center gap-6 mb-4 text-sm">
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{park.distance} away</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span>{park.hours}</span>
                      </div>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground mb-2">
                        Features:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {park.features.map((feature, index) => (
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

      <Footer />
    </div>
  );
}
