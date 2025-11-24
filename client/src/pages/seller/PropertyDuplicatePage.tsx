import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function PropertyDuplicatePage() {
  const duplicates = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      similarity: "98%",
    },
    {
      id: "2",
      title: "Spacious 3BHK Flat",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      similarity: "85%",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-yellow-600" />
              Possible Duplicate Listings
            </h1>
            <p className="text-muted-foreground">
              Review similar listings to avoid duplicates
            </p>
          </div>

          <Card className="p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">Why This Matters</h3>
            <p className="text-sm text-muted-foreground">
              Duplicate listings reduce trust and may result in account penalties.
              Review these similar properties before proceeding.
            </p>
          </Card>

          <div className="space-y-4">
            {duplicates.map((listing) => (
              <Card key={listing.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{listing.title}</h3>
                      <div className="px-3 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500 rounded text-xs font-semibold">
                        {listing.similarity} Match
                      </div>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>{listing.location}</p>
                      <p className="font-semibold text-primary">{listing.price}</p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-view-${listing.id}`}
                  >
                    View Details
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              variant="outline"
              className="flex-1"
              data-testid="button-cancel"
            >
              Go Back
            </Button>
            <Button className="flex-1" data-testid="button-proceed">
              This is Not a Duplicate
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
