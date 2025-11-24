import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, MapPin, Heart } from "lucide-react";

export default function RecentlyViewedPage() {
  const recentProperties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      area: "1,200 sqft",
      viewedAt: "2 hours ago",
    },
    {
      id: "2",
      title: "Modern 2BHK Flat",
      location: "Andheri East, Mumbai",
      price: "₹65 L",
      bedrooms: 2,
      area: "950 sqft",
      viewedAt: "1 day ago",
    },
    {
      id: "3",
      title: "Spacious 4BHK Villa",
      location: "Powai, Mumbai",
      price: "₹1.2 Cr",
      bedrooms: 4,
      area: "2,500 sqft",
      viewedAt: "2 days ago",
    },
    {
      id: "4",
      title: "Commercial Office Space",
      location: "BKC, Mumbai",
      price: "₹2.5 Cr",
      bedrooms: 0,
      area: "3,000 sqft",
      viewedAt: "3 days ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <Clock className="h-8 w-8 text-primary" />
              <h1 className="font-serif font-bold text-3xl">
                Recently Viewed
              </h1>
            </div>
            <p className="text-muted-foreground">
              {recentProperties.length} properties you've recently looked at
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recentProperties.map((property) => (
              <Card key={property.id} className="overflow-hidden hover-elevate">
                <div className="relative">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/90 hover-elevate active-elevate-2">
                    <Heart className="h-5 w-5" />
                  </button>
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-black/70 text-white">
                      <Clock className="h-3 w-3 mr-1" />
                      {property.viewedAt}
                    </Badge>
                  </div>
                </div>

                <div className="p-6">
                  <h3 className="font-serif font-bold text-lg mb-2">
                    {property.title}
                  </h3>

                  <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                    <MapPin className="h-4 w-4" />
                    <span>{property.location}</span>
                  </div>

                  <p className="text-3xl font-bold font-serif text-primary mb-4">
                    {property.price}
                  </p>

                  <div className="flex gap-2 mb-4">
                    {property.bedrooms > 0 && (
                      <Badge variant="outline">{property.bedrooms} BHK</Badge>
                    )}
                    <Badge variant="outline">{property.area}</Badge>
                  </div>

                  <Button className="w-full" data-testid={`button-view-${property.id}`}>
                    View Again
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
