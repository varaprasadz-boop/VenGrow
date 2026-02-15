import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Car, CheckCircle, XCircle } from "lucide-react";

export default function PropertyParkingDetailsPage() {
  const parkingDetails = {
    totalSpaces: 2,
    coveredSpaces: 2,
    openSpaces: 0,
    visitorParking: true,
    evCharging: false,
    securityFeatures: ["CCTV Surveillance", "24/7 Security Guard", "Controlled Access"],
    vehicleTypes: ["Car", "Two-Wheeler"],
  };

  return (
    <div className="min-h-screen flex flex-col">

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

          {/* Overview */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-6xl font-bold font-serif text-primary mb-2">
                {parkingDetails.totalSpaces}
              </p>
              <p className="text-muted-foreground">
                Dedicated Parking Spaces Included
              </p>
            </div>
          </Card>

          {/* Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Parking Breakdown</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Covered Parking</span>
                  <span className="font-semibold">
                    {parkingDetails.coveredSpaces}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Open Parking</span>
                  <span className="font-semibold">
                    {parkingDetails.openSpaces}
                  </span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Features</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">Visitor Parking</span>
                  {parkingDetails.visitorParking ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
                  <span className="text-sm">EV Charging</span>
                  {parkingDetails.evCharging ? (
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600" />
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Security */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Security Features</h3>
            <div className="flex flex-wrap gap-2">
              {parkingDetails.securityFeatures.map((feature, index) => (
                <Badge key={index} variant="outline">
                  {feature}
                </Badge>
              ))}
            </div>
          </Card>

          {/* Vehicle Types */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Allowed Vehicle Types</h3>
            <div className="flex flex-wrap gap-2">
              {parkingDetails.vehicleTypes.map((type, index) => (
                <Badge key={index}>{type}</Badge>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
