import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accessibility, CheckCircle, XCircle } from "lucide-react";

export default function PropertyAccessibilityPage() {
  const accessibilityFeatures = {
    wheelchairAccess: true,
    rampAccess: true,
    wideDoorsways: true,
    accessibleParking: true,
    elevatorWithBraille: true,
    accessibleBathroom: false,
  };

  const features = [
    { name: "Wheelchair Accessible Entrance", available: accessibilityFeatures.wheelchairAccess },
    { name: "Ramp Access to Building", available: accessibilityFeatures.rampAccess },
    { name: "Wide Doorways (36\" minimum)", available: accessibilityFeatures.wideDoorsways },
    { name: "Accessible Parking Spaces", available: accessibilityFeatures.accessibleParking },
    { name: "Elevator with Braille Buttons", available: accessibilityFeatures.elevatorWithBraille },
    { name: "Accessible Bathroom", available: accessibilityFeatures.accessibleBathroom },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Accessibility className="h-8 w-8 text-primary" />
              Accessibility Features
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Overview */}
          <Card className="p-8 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <div className="flex items-center gap-4">
              <Accessibility className="h-12 w-12 text-blue-600" />
              <div>
                <h2 className="font-serif font-bold text-2xl mb-1">
                  Partially Accessible
                </h2>
                <p className="text-muted-foreground">
                  This property has some accessibility features for people with
                  disabilities
                </p>
              </div>
            </div>
          </Card>

          {/* Features List */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Accessibility Features</h3>
            <div className="space-y-4">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <span className="font-medium">{feature.name}</span>
                  {feature.available ? (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Available
                    </Badge>
                  ) : (
                    <Badge variant="outline">
                      <XCircle className="h-3 w-3 mr-1" />
                      Not Available
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
