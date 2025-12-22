
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Archive, Eye } from "lucide-react";

export default function PropertyArchivePage() {
  const archivedProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      archivedDate: "Oct 15, 2025",
      reason: "Sold",
    },
    {
      id: "2",
      title: "2BHK Flat",
      location: "Andheri East, Mumbai",
      price: "₹55 L",
      archivedDate: "Sep 22, 2025",
      reason: "Expired",
    },
  ];

  const getReasonBadge = (reason: string) => {
    switch (reason) {
      case "Sold":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            {reason}
          </Badge>
        );
      case "Expired":
        return <Badge variant="outline">{reason}</Badge>;
      default:
        return <Badge>{reason}</Badge>;
    }
  };

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Archive className="h-8 w-8 text-primary" />
              Archived Properties
            </h1>
            <p className="text-muted-foreground">
              View your past listings
            </p>
          </div>

          {archivedProperties.length > 0 ? (
            <div className="space-y-4">
              {archivedProperties.map((property) => (
                <Card key={property.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{property.title}</h3>
                        {getReasonBadge(property.reason)}
                      </div>
                      <div className="space-y-1 text-sm">
                        <p className="text-muted-foreground">{property.location}</p>
                        <p className="font-semibold text-primary">{property.price}</p>
                        <p className="text-xs text-muted-foreground">
                          Archived on {property.archivedDate}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-view-${property.id}`}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                      <Button
                        size="sm"
                        data-testid={`button-restore-${property.id}`}
                      >
                        Restore
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Archive className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-semibold text-xl mb-2">No Archived Properties</h2>
              <p className="text-muted-foreground">
                Your archived listings will appear here
              </p>
            </Card>
          )}
        </div>
      </main>
  );
}
