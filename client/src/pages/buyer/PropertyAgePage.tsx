import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function PropertyAgePage() {
  const ageInfo = {
    yearBuilt: "2023",
    age: "1 year",
    condition: "Brand New",
    possessionDate: "Ready to move",
    lastRenovation: "N/A",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              Property Age
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Property Age</p>
              <p className="text-6xl font-bold text-green-600 mb-3">
                {ageInfo.age}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                {ageInfo.condition}
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Year Built</h3>
              <p className="text-3xl font-bold text-primary">{ageInfo.yearBuilt}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Possession Status</h3>
              <p className="text-xl font-semibold">{ageInfo.possessionDate}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Last Renovation</h3>
              <p className="text-muted-foreground">{ageInfo.lastRenovation}</p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
