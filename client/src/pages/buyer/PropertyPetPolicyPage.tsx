import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dog, CheckCircle, XCircle } from "lucide-react";

export default function PropertyPetPolicyPage() {
  const petPolicy = {
    petsAllowed: true,
    restrictions: [
      "Maximum 2 pets per apartment",
      "Small to medium breeds preferred",
      "Pet registration required with society",
    ],
    allowedPets: ["Dogs", "Cats"],
    notAllowed: ["Exotic pets", "Large breed dogs over 25kg"],
    amenities: [
      "Designated pet walking area",
      "Pet waste disposal stations",
    ],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Dog className="h-8 w-8 text-primary" />
              Pet Policy
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          {/* Policy Status */}
          <Card className="p-8 mb-8 bg-green-50 dark:bg-green-900/10 border-green-200 dark:border-green-900/20">
            <div className="flex items-center gap-4">
              <CheckCircle className="h-12 w-12 text-green-600" />
              <div>
                <h2 className="font-serif font-bold text-2xl mb-1">
                  Pet-Friendly Property
                </h2>
                <p className="text-muted-foreground">
                  This property welcomes pets with certain restrictions
                </p>
              </div>
            </div>
          </Card>

          {/* Allowed Pets */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <CheckCircle className="h-5 w-5 text-green-600" />
                Allowed Pets
              </h3>
              <div className="flex flex-wrap gap-2">
                {petPolicy.allowedPets.map((pet, index) => (
                  <Badge key={index} className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                    {pet}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <XCircle className="h-5 w-5 text-red-600" />
                Not Allowed
              </h3>
              <div className="flex flex-wrap gap-2">
                {petPolicy.notAllowed.map((pet, index) => (
                  <Badge key={index} variant="destructive">
                    {pet}
                  </Badge>
                ))}
              </div>
            </Card>
          </div>

          {/* Restrictions */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Pet Policy Restrictions</h3>
            <ul className="space-y-3">
              {petPolicy.restrictions.map((restriction, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary">•</span>
                  <span>{restriction}</span>
                </li>
              ))}
            </ul>
          </Card>

          {/* Amenities */}
          <Card className="p-6">
            <h3 className="font-semibold mb-4">Pet Amenities</h3>
            <div className="space-y-3">
              {petPolicy.amenities.map((amenity, index) => (
                <div key={index} className="flex items-center gap-3">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  <span>{amenity}</span>
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
