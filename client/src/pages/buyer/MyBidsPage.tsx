import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Clock } from "lucide-react";

export default function MyBidsPage() {
  const bids = [
    {
      id: "1",
      property: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      askingPrice: "₹85 L",
      bidAmount: "₹80 L",
      status: "pending",
      date: "Nov 20, 2025",
      timeLeft: "2 days",
    },
    {
      id: "2",
      property: "Commercial Office Space",
      location: "BKC, Mumbai",
      askingPrice: "₹1.2 Cr",
      bidAmount: "₹1.1 Cr",
      status: "outbid",
      date: "Nov 18, 2025",
      highestBid: "₹1.15 Cr",
    },
    {
      id: "3",
      property: "2BHK Flat",
      location: "Andheri East, Mumbai",
      askingPrice: "₹65 L",
      bidAmount: "₹63 L",
      status: "accepted",
      date: "Nov 15, 2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "outbid":
        return (
          <Badge variant="destructive">
            Outbid
          </Badge>
        );
      case "accepted":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Accepted
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              My Bids
            </h1>
            <p className="text-muted-foreground">
              Track all your property bids
            </p>
          </div>

          <div className="space-y-4">
            {bids.map((bid) => (
              <Card key={bid.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{bid.property}</h3>
                      {getStatusBadge(bid.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      {bid.location}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Bid placed on {bid.date}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">
                      Asking Price
                    </p>
                    <p className="font-semibold">{bid.askingPrice}</p>
                  </div>
                  <div className="p-4 bg-primary/5 border border-primary/20 rounded-lg">
                    <p className="text-xs text-muted-foreground mb-1">Your Bid</p>
                    <p className="font-semibold text-primary">{bid.bidAmount}</p>
                  </div>
                  {bid.status === "outbid" && bid.highestBid && (
                    <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Highest Bid
                      </p>
                      <p className="font-semibold text-red-600">{bid.highestBid}</p>
                    </div>
                  )}
                  {bid.status === "pending" && bid.timeLeft && (
                    <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-900/20 rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Time Left
                      </p>
                      <p className="font-semibold text-yellow-600">{bid.timeLeft}</p>
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {bid.status === "outbid" && (
                    <Button
                      variant="default"
                      size="sm"
                      data-testid={`button-rebid-${bid.id}`}
                    >
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Place Higher Bid
                    </Button>
                  )}
                  {bid.status === "accepted" && (
                    <Button
                      variant="default"
                      size="sm"
                      data-testid={`button-proceed-${bid.id}`}
                    >
                      Proceed to Purchase
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-view-${bid.id}`}
                  >
                    View Property
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
