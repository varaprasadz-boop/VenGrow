import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car } from "lucide-react";

export default function PropertyParkingPage() {
  const parkingDetails = {
    type: "Covered Parking",
    spaces: 2,
    vehicleTypes: ["Car", "Two-wheeler"],
    features: ["Secured access", "CCTV surveillance", "24/7 security"],
    additionalCharges: "₹2,000/month (additional space)",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Car className="h-8 w-8 text-primary" />
              Parking Details
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Parking Spaces</p>
              <p className="text-6xl font-bold text-primary mb-2">
                {parkingDetails.spaces}
              </p>
              <Badge>{parkingDetails.type}</Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Vehicle Types</h3>
              <div className="flex flex-wrap gap-2">
                {parkingDetails.vehicleTypes.map((type, index) => (
                  <Badge key={index} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Features</h3>
              <div className="space-y-3">
                {parkingDetails.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                  >
                    <span className="text-green-600">✓</span>
                    <span>{feature}</span>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Additional Parking</h3>
              <p className="text-muted-foreground">
                Extra parking space available at {parkingDetails.additionalCharges}
              </p>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
