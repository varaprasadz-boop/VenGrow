
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Clock, RefreshCw } from "lucide-react";

export default function PropertyExpiryPage() {
  const expiringProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      daysLeft: 3,
      expiryDate: "Nov 27, 2025",
      views: 1234,
      inquiries: 45,
    },
    {
      id: "2",
      title: "Commercial Office Space",
      location: "BKC, Mumbai",
      daysLeft: 7,
      expiryDate: "Dec 1, 2025",
      views: 856,
      inquiries: 28,
    },
  ];

  const expiredProperties = [
    {
      id: "3",
      title: "2BHK Flat",
      location: "Andheri East, Mumbai",
      expiredDate: "Nov 20, 2025",
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Expiry Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and renew your property listings
            </p>
          </div>

          {/* Expiring Soon */}
          <div className="mb-8">
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-600" />
              Expiring Soon
            </h2>
            <div className="space-y-4">
              {expiringProperties.map((property) => (
                <Card key={property.id} className="p-6 border-orange-200 dark:border-orange-900/20">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {property.title}
                        </h3>
                        <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500">
                          {property.daysLeft} days left
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {property.location}
                      </p>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            Views
                          </p>
                          <p className="font-semibold">{property.views}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            Inquiries
                          </p>
                          <p className="font-semibold">{property.inquiries}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            Expires On
                          </p>
                          <p className="font-semibold text-xs">
                            {property.expiryDate}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Button
                    className="w-full"
                    data-testid={`button-renew-${property.id}`}
                  >
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Renew Listing
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* Expired */}
          <div>
            <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-600" />
              Expired Listings
            </h2>
            <div className="space-y-4">
              {expiredProperties.map((property) => (
                <Card key={property.id} className="p-6 border-red-200 dark:border-red-900/20 bg-red-50 dark:bg-red-900/5">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">
                          {property.title}
                        </h3>
                        <Badge variant="destructive">Expired</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {property.location}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Expired on {property.expiredDate}
                      </p>
                    </div>
                    <Button
                      size="sm"
                      data-testid={`button-reactivate-${property.id}`}
                    >
                      Reactivate
                    </Button>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
  );
}
