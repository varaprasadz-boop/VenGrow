import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { MapPin, TrendingUp, Train, ShoppingBag, GraduationCap, Hospital } from "lucide-react";

export default function PropertyLocationAnalysisPage() {
  const locationScore = 8.5;

  const amenities = [
    { icon: Train, name: "Transport", distance: "500m", score: 9 },
    { icon: ShoppingBag, name: "Shopping", distance: "1.2km", score: 8 },
    { icon: GraduationCap, name: "Schools", distance: "800m", score: 9 },
    { icon: Hospital, name: "Healthcare", distance: "1.5km", score: 7 },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Location Analysis
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Overall Score */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Location Score</p>
              <p className="text-6xl font-bold font-serif text-primary mb-2">
                {locationScore}/10
              </p>
              <p className="text-sm text-muted-foreground">Excellent Location</p>
            </div>
          </Card>

          {/* Map */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Nearby Amenities</h3>
            <div className="h-96 bg-muted rounded-lg flex items-center justify-center mb-6">
              <span className="text-muted-foreground">Interactive Map</span>
            </div>
          </Card>

          {/* Amenities Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {amenities.map((amenity, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <amenity.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{amenity.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {amenity.distance} away
                    </p>
                  </div>
                  <div className="text-2xl font-bold text-primary">
                    {amenity.score}/10
                  </div>
                </div>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary"
                    style={{ width: `${amenity.score * 10}%` }}
                  />
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
