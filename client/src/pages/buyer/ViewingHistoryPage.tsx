import { useState } from "react";
import { Link } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Bed, Bath, Maximize, Trash2 } from "lucide-react";

export default function ViewingHistoryPage() {
  const [history] = useState([
    {
      id: "1",
      property: "Luxury 3BHK Apartment in Prime Location",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      viewedDate: "Nov 24, 2025",
      viewedTime: "10:30 AM",
    },
    {
      id: "2",
      property: "Modern 2BHK Flat with Amenities",
      location: "Koramangala, Bangalore",
      price: "₹65 L",
      bedrooms: 2,
      bathrooms: 2,
      area: 950,
      viewedDate: "Nov 23, 2025",
      viewedTime: "03:45 PM",
    },
    {
      id: "3",
      property: "Spacious 4BHK Villa with Garden",
      location: "Whitefield, Bangalore",
      price: "₹1.5 Cr",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      viewedDate: "Nov 22, 2025",
      viewedTime: "11:20 AM",
    },
  ]);

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Viewing History
              </h1>
              <p className="text-muted-foreground">
                Properties you've recently viewed
              </p>
            </div>
            <Button variant="outline" data-testid="button-clear-all">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All
            </Button>
          </div>

          <div className="space-y-4">
            {history.map((item) => (
              <Card key={item.id} className="p-6">
                <div className="flex flex-col lg:flex-row gap-6">
                  <div className="aspect-video lg:w-64 bg-muted rounded-lg flex items-center justify-center flex-shrink-0">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">
                          {item.property}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground mb-3">
                          <MapPin className="h-4 w-4" />
                          <span className="text-sm">{item.location}</span>
                        </div>
                        <p className="text-2xl font-bold font-serif text-primary mb-4">
                          {item.price}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm mb-4">
                      <div className="flex items-center gap-1">
                        <Bed className="h-4 w-4 text-muted-foreground" />
                        <span>{item.bedrooms} Beds</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Bath className="h-4 w-4 text-muted-foreground" />
                        <span>{item.bathrooms} Baths</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Maximize className="h-4 w-4 text-muted-foreground" />
                        <span>{item.area} sqft</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                      <Calendar className="h-4 w-4" />
                      <span>Viewed on {item.viewedDate} at {item.viewedTime}</span>
                    </div>

                    <div className="flex gap-2">
                      <Link href={`/property/${item.id}`}>
                        <Button data-testid={`button-view-${item.id}`}>
                          View Again
                        </Button>
                      </Link>
                      <Button variant="outline" data-testid={`button-remove-${item.id}`}>
                        Remove
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {history.length === 0 && (
            <Card className="p-12 text-center">
              <Calendar className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Viewing History</h3>
              <p className="text-muted-foreground mb-6">
                Properties you view will appear here
              </p>
              <Link href="/search">
                <Button>Start Searching</Button>
              </Link>
            </Card>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
