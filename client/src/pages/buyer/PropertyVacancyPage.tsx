import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "lucide-react";

export default function PropertyVacancyPage() {
  const vacancyInfo = {
    status: "Available",
    availableFrom: "Jan 1, 2026",
    noticePeriod: "30 days",
    currentOccupancy: "Owner occupied",
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Calendar className="h-8 w-8 text-primary" />
              Vacancy Information
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/10 dark:to-green-900/20">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">Availability Status</p>
              <p className="text-5xl font-bold text-green-600 mb-3">
                {vacancyInfo.status}
              </p>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                Ready to move
              </Badge>
            </div>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Available From</h3>
              <p className="text-3xl font-bold text-primary">
                {vacancyInfo.availableFrom}
              </p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Current Status</h3>
              <p className="text-muted-foreground">{vacancyInfo.currentOccupancy}</p>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Notice Period</h3>
              <p className="text-xl font-semibold">{vacancyInfo.noticePeriod}</p>
              <p className="text-sm text-muted-foreground mt-2">
                Required notice before move-in
              </p>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
