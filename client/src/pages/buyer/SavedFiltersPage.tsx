import { useState } from "react";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Filter, MapPin, Home, DollarSign, Edit, Trash2, Play } from "lucide-react";

export default function SavedFiltersPage() {
  const [filters] = useState([
    {
      id: "1",
      name: "3BHK in Mumbai under ₹1 Cr",
      location: "Mumbai",
      propertyType: "Apartment",
      minBudget: 5000000,
      maxBudget: 10000000,
      bedrooms: 3,
      savedDate: "Nov 20, 2025",
      matchCount: 23,
    },
    {
      id: "2",
      name: "Luxury Villas in Bangalore",
      location: "Bangalore",
      propertyType: "Villa",
      minBudget: 20000000,
      maxBudget: 50000000,
      bedrooms: 4,
      savedDate: "Nov 15, 2025",
      matchCount: 8,
    },
    {
      id: "3",
      name: "Commercial Spaces in Gurgaon",
      location: "Gurgaon",
      propertyType: "Commercial",
      minBudget: 30000000,
      maxBudget: 100000000,
      bedrooms: 0,
      savedDate: "Nov 10, 2025",
      matchCount: 15,
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Saved Filters
              </h1>
              <p className="text-muted-foreground">
                Quickly access your frequently used search filters
              </p>
            </div>
            <Button data-testid="button-create">
              <Filter className="h-4 w-4 mr-2" />
              Create Filter
            </Button>
          </div>

          <div className="space-y-4">
            {filters.map((filter) => (
              <Card key={filter.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{filter.name}</h3>
                      {filter.matchCount > 0 && (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          {filter.matchCount} New Matches
                        </Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{filter.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>
                          {filter.propertyType}
                          {filter.bedrooms > 0 && ` • ${filter.bedrooms} BHK`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          ₹{(filter.minBudget / 100000).toFixed(1)}L - ₹
                          {(filter.maxBudget / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="text-muted-foreground">
                        Saved on {filter.savedDate}
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button data-testid={`button-apply-${filter.id}`}>
                    <Play className="h-4 w-4 mr-2" />
                    Apply Filter
                  </Button>
                  <Button
                    variant="outline"
                    data-testid={`button-edit-${filter.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    data-testid={`button-delete-${filter.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {filters.length === 0 && (
            <Card className="p-12 text-center">
              <Filter className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Saved Filters</h3>
              <p className="text-muted-foreground mb-6">
                Save your search filters for quick access
              </p>
              <Button>Create Your First Filter</Button>
            </Card>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
