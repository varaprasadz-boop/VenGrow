
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive } from "lucide-react";

export default function PropertyArchivedPage() {
  const archivedProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      archivedDate: "Nov 10, 2025",
      reason: "Sold",
      images: 12,
    },
    {
      id: "2",
      title: "2BHK Flat",
      location: "Andheri East, Mumbai",
      price: "₹65 L",
      archivedDate: "Oct 25, 2025",
      reason: "Expired",
      images: 8,
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Archive className="h-8 w-8 text-primary" />
              Archived Properties
            </h1>
            <p className="text-muted-foreground">
              View your previously listed properties
            </p>
          </div>

          <div className="space-y-4">
            {archivedProperties.map((property) => (
              <Card key={property.id} className="p-6">
                <div className="flex items-start gap-6">
                  <div className="w-32 h-24 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-muted-foreground">
                      {property.images} photos
                    </span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{property.title}</h3>
                      <Badge variant="outline">{property.reason}</Badge>
                    </div>

                    <p className="text-sm text-muted-foreground mb-3">
                      {property.location}
                    </p>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Price</p>
                        <p className="font-semibold text-lg">{property.price}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">
                          Archived On
                        </p>
                        <p className="font-medium">{property.archivedDate}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-view-${property.id}`}
                      >
                        View Details
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-reactivate-${property.id}`}
                      >
                        Reactivate Listing
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
