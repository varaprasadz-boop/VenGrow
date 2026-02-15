import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, TrendingUp, Building } from "lucide-react";

export default function PropertyNeighborsPage() {
  const neighborhoodProfile = {
    totalHouseholds: 450,
    avgFamilySize: 3.2,
    ownerOccupied: 85,
    rentalUnits: 15,
    avgResidencyYears: 6.5,
  };

  const demographics = [
    { label: "Professionals", percentage: 60 },
    { label: "Retirees", percentage: 25 },
    { label: "Students", percentage: 15 },
  ];

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Neighborhood Profile
            </h1>
            <p className="text-muted-foreground">
              Learn about your future neighbors
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Building className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{neighborhoodProfile.totalHouseholds}</p>
                  <p className="text-sm text-muted-foreground">Households</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{neighborhoodProfile.avgFamilySize}</p>
                  <p className="text-sm text-muted-foreground">Avg Family Size</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <TrendingUp className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{neighborhoodProfile.avgResidencyYears}</p>
                  <p className="text-sm text-muted-foreground">Avg Residency (years)</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Ownership */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Ownership Distribution</h3>
            <div className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Owner Occupied</span>
                  <span className="text-sm font-semibold">
                    {neighborhoodProfile.ownerOccupied}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-600"
                    style={{ width: `${neighborhoodProfile.ownerOccupied}%` }}
                  />
                </div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Rental Units</span>
                  <span className="text-sm font-semibold">
                    {neighborhoodProfile.rentalUnits}%
                  </span>
                </div>
                <div className="h-3 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600"
                    style={{ width: `${neighborhoodProfile.rentalUnits}%` }}
                  />
                </div>
              </div>
            </div>
          </Card>

          {/* Demographics */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Resident Demographics</h3>
            <div className="space-y-4">
              {demographics.map((demo, index) => (
                <div key={index}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{demo.label}</span>
                    <Badge variant="outline">{demo.percentage}%</Badge>
                  </div>
                  <div className="h-3 bg-muted rounded-full overflow-hidden">
                    <div
                      className="h-full bg-primary"
                      style={{ width: `${demo.percentage}%` }}
                    />
                  </div>
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
