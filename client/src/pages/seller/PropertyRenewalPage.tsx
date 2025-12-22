
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RotateCcw } from "lucide-react";

export default function PropertyRenewalPage() {
  const listing = {
    title: "Luxury 3BHK Apartment",
    package: "Premium",
    expiryDate: "Dec 15, 2025",
    daysLeft: 21,
    views: 456,
    inquiries: 23,
  };

  const renewalOptions = [
    { duration: "1 Month", price: "₹999", savings: null },
    { duration: "3 Months", price: "₹2,499", savings: "Save ₹500", popular: true },
    { duration: "6 Months", price: "₹4,499", savings: "Save ₹1,500" },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-primary" />
              Renew Listing
            </h1>
            <p className="text-muted-foreground">
              Extend your property listing
            </p>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{listing.title}</h3>
                <p className="text-sm text-muted-foreground">
                  Current Package: {listing.package}
                </p>
              </div>
              <Badge
                className={
                  listing.daysLeft < 7
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"
                }
              >
                {listing.daysLeft} days left
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Views</p>
                <p className="font-semibold text-xl">{listing.views}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Inquiries</p>
                <p className="font-semibold text-xl">{listing.inquiries}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4 mb-8">
            {renewalOptions.map((option, index) => (
              <Card
                key={index}
                className={`p-6 ${
                  option.popular ? "border-primary border-2" : ""
                }`}
              >
                {option.popular && (
                  <Badge className="mb-3">Most Popular</Badge>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {option.duration}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {option.price}
                      </span>
                      {option.savings && (
                        <span className="text-sm text-green-600">
                          {option.savings}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={option.popular ? "default" : "outline"}
                    data-testid={`button-renew-${index}`}
                  >
                    Select
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
