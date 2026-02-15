import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Heart } from "lucide-react";

export default function PropertyPetsPage() {
  const petPolicy = {
    allowed: true,
    types: ["Dogs (small breeds)", "Cats", "Birds"],
    restrictions: "Maximum 2 pets per unit",
    deposit: "₹10,000 (refundable)",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Heart className="h-8 w-8 text-primary" />
              Pet Policy
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <div className="flex items-center gap-4">
              <Heart className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="font-serif font-bold text-2xl mb-1">
                  Pet-Friendly Property
                </h2>
                <p className="text-muted-foreground">
                  Pets are welcome in this building
                </p>
              </div>
            </div>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Allowed Pets</h3>
              <div className="flex flex-wrap gap-2">
                {petPolicy.types.map((type, index) => (
                  <Badge key={index} variant="outline">
                    {type}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Restrictions</h3>
              <p className="text-muted-foreground">{petPolicy.restrictions}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Pet Deposit</h3>
              <p className="text-2xl font-bold text-primary mb-1">
                {petPolicy.deposit}
              </p>
              <p className="text-sm text-muted-foreground">
                Fully refundable upon move-out
              </p>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
