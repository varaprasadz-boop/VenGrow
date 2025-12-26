import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wrench } from "lucide-react";

export default function PropertyMaintenancePage() {
  const maintenanceDetails = {
    monthlyFee: "₹8,500",
    includedServices: [
      "Common area cleaning",
      "Security services",
      "Lift maintenance",
      "Water supply",
      "Garden upkeep",
      "Waste management",
    ],
    additionalCharges: [
      { name: "Parking (extra space)", amount: "₹2,000/month" },
      { name: "Club membership", amount: "₹5,000/year" },
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Wrench className="h-8 w-8 text-primary" />
              Maintenance Details
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Monthly Fee */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Monthly Maintenance</p>
              <p className="text-5xl font-bold font-serif text-primary mb-2">
                {maintenanceDetails.monthlyFee}
              </p>
              <Badge variant="outline">Inclusive of all services</Badge>
            </div>
          </Card>

          {/* Included Services */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Included Services</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {maintenanceDetails.includedServices.map((service, index) => (
                <div
                  key={index}
                  className="flex items-center gap-3 p-3 bg-muted rounded-lg"
                >
                  <span className="text-green-600">✓</span>
                  <span>{service}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Additional Charges */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Additional Charges (Optional)</h3>
            <div className="space-y-3">
              {maintenanceDetails.additionalCharges.map((charge, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <span className="font-medium">{charge.name}</span>
                  <span className="text-sm font-semibold">{charge.amount}</span>
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
