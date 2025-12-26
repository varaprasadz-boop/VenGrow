import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2 } from "lucide-react";

export default function PropertyFloorsPage() {
  const buildingInfo = {
    totalFloors: 25,
    thisFloor: 12,
    floorType: "Mid Floor",
    views: ["City skyline", "Partial sea view"],
    sunlight: "East facing - Morning sun",
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Building2 className="h-8 w-8 text-primary" />
              Floor Information
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <Card className="p-8 mb-8 text-center bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center justify-center gap-4 mb-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">This Floor</p>
                <p className="text-5xl font-bold text-primary">
                  {buildingInfo.thisFloor}
                </p>
              </div>
              <div className="text-4xl text-muted-foreground">/</div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Floors</p>
                <p className="text-5xl font-bold">{buildingInfo.totalFloors}</p>
              </div>
            </div>
            <Badge>{buildingInfo.floorType}</Badge>
          </Card>

          <div className="grid grid-cols-1 gap-6">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Views</h3>
              <div className="flex flex-wrap gap-2">
                {buildingInfo.views.map((view, index) => (
                  <Badge key={index} variant="outline">
                    {view}
                  </Badge>
                ))}
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-4">Natural Light</h3>
              <p className="text-muted-foreground">{buildingInfo.sunlight}</p>
            </Card>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
