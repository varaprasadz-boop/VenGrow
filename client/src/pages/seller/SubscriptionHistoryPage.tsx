
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Receipt } from "lucide-react";

export default function SubscriptionHistoryPage() {
  const subscriptions = [
    {
      id: "1",
      package: "Premium Package",
      startDate: "Nov 1, 2025",
      endDate: "Dec 1, 2025",
      amount: "₹5,999",
      status: "active",
      listings: "10 Listings",
    },
    {
      id: "2",
      package: "Basic Package",
      startDate: "Oct 1, 2025",
      endDate: "Nov 1, 2025",
      amount: "₹2,999",
      status: "expired",
      listings: "5 Listings",
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Receipt className="h-8 w-8 text-primary" />
              Subscription History
            </h1>
            <p className="text-muted-foreground">
              View all your past and current subscriptions
            </p>
          </div>

          <div className="space-y-4">
            {subscriptions.map((sub) => (
              <Card key={sub.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{sub.package}</h3>
                      {sub.status === "active" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Expired</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                      <div>
                        <p className="text-xs text-muted-foreground">Start Date</p>
                        <p className="font-medium">{sub.startDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">End Date</p>
                        <p className="font-medium">{sub.endDate}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Amount</p>
                        <p className="font-medium">{sub.amount}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground">Listings</p>
                        <p className="font-medium">{sub.listings}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-invoice-${sub.id}`}
                  >
                    Download Invoice
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
