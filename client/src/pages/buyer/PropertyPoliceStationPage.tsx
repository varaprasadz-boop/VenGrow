import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, MapPin, Phone } from "lucide-react";

export default function PropertyPoliceStationPage() {
  const policeStations = [
    {
      id: "1",
      name: "Bandra Police Station",
      type: "Main Station",
      distance: "1.2 km",
      address: "Hill Road, Bandra West",
      phone: "022-2642-2222",
      emergency: "100",
    },
    {
      id: "2",
      name: "Khar Police Station",
      type: "Sub-Station",
      distance: "2.5 km",
      address: "Linking Road, Khar West",
      phone: "022-2648-8888",
      emergency: "100",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Nearby Police Stations
            </h1>
            <p className="text-muted-foreground">
              Law enforcement facilities near this property
            </p>
          </div>

          {/* Emergency */}
          <Card className="p-8 mb-8 bg-red-50 dark:bg-red-900/10 border-red-200 dark:border-red-900/20">
            <div className="text-center">
              <h2 className="font-serif font-bold text-2xl mb-2">
                Emergency: 100
              </h2>
              <p className="text-sm text-muted-foreground">
                Police Emergency Helpline (24/7)
              </p>
            </div>
          </Card>

          <div className="space-y-4">
            {policeStations.map((station) => (
              <Card key={station.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{station.name}</h3>
                      <Badge variant="outline">{station.type}</Badge>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{station.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <span className="text-muted-foreground">Distance:</span>
                        <span className="font-medium">{station.distance}</span>
                      </div>
                    </div>

                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground" />
                        <span className="font-semibold">{station.phone}</span>
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
