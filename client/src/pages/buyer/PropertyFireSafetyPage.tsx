import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Flame, CheckCircle, XCircle } from "lucide-react";

export default function PropertyFireSafetyPage() {
  const safetyFeatures = {
    fireAlarm: true,
    sprinklerSystem: true,
    fireExtinguishers: true,
    emergencyExits: 2,
    fireSafetyCertificate: true,
    smokeDetectors: true,
    evacuationPlan: true,
  };

  const features = [
    { name: "Fire Alarm System", available: safetyFeatures.fireAlarm },
    { name: "Automatic Sprinklers", available: safetyFeatures.sprinklerSystem },
    { name: "Fire Extinguishers", available: safetyFeatures.fireExtinguishers },
    { name: "Smoke Detectors", available: safetyFeatures.smokeDetectors },
    { name: "Emergency Evacuation Plan", available: safetyFeatures.evacuationPlan },
    { name: "Fire Safety Certificate", available: safetyFeatures.fireSafetyCertificate },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Flame className="h-8 w-8 text-primary" />
              Fire Safety Features
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Certification */}
          <Card className="p-8 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="font-serif font-bold text-2xl mb-1">
                  Fire Safety Certified
                </h2>
                <p className="text-muted-foreground">
                  This building is fully compliant with fire safety regulations
                </p>
              </div>
            </div>
          </Card>

          {/* Emergency Exits */}
          <Card className="p-8 mb-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Emergency Exits</p>
              <p className="text-6xl font-bold font-serif text-primary">
                {safetyFeatures.emergencyExits}
              </p>
            </div>
          </Card>

          {/* Safety Features */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Safety Features</h3>
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
                    <Badge variant="destructive">
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
