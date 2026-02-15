import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

export default function PropertyTaxesPage() {
  const taxDetails = {
    propertyTax: "₹18,000/year",
    lastPaid: "Apr 2025",
    status: "Paid",
    dues: "₹0",
    nextDue: "Apr 2026",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              Property Tax Information
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Annual Property Tax</p>
              <p className="text-5xl font-bold text-primary mb-3">
                {taxDetails.propertyTax}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                {taxDetails.status}
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Last Payment</h3>
              <p className="text-2xl font-bold">{taxDetails.lastPaid}</p>
            </Card>
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Outstanding Dues</h3>
              <p className="text-2xl font-bold text-green-600">{taxDetails.dues}</p>
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-4">Next Payment Due</h3>
            <p className="text-xl font-semibold text-primary">
              {taxDetails.nextDue}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              Tax payments can be made online through the municipal website
            </p>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
