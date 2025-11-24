import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, MapPin, Heart } from "lucide-react";

export default function PropertyRecommendationsPage() {
  const recommendations = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      matchScore: 95,
      reason: "Matches your budget and location preferences",
      bedrooms: 3,
      area: "1,200 sqft",
    },
    {
      id: "2",
      title: "Modern 3BHK Flat",
      location: "Andheri East, Mumbai",
      price: "₹72 L",
      matchScore: 88,
      reason: "Similar to properties you've viewed",
      bedrooms: 3,
      area: "1,150 sqft",
    },
    {
      id: "3",
      title: "Spacious 3BHK",
      location: "Powai, Mumbai",
      price: "₹95 L",
      matchScore: 82,
      reason: "Popular in your search area",
      bedrooms: 3,
      area: "1,350 sqft",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Sparkles className="h-6 w-6 text-primary" />
              </div>
              <h1 className="font-serif font-bold text-3xl">
                Recommended for You
              </h1>
            </div>
            <p className="text-muted-foreground">
              Personalized property recommendations based on your preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((property) => (
              <Card key={property.id} className="overflow-hidden hover-elevate">
                <div className="relative">
                  <div className="aspect-video bg-muted flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-primary/90">
                      <Sparkles className="h-3 w-3 mr-1" />
                      {property.matchScore}% Match
                    </Badge>
                  </div>
                  <button className="absolute top-3 right-3 p-2 rounded-full bg-white/90 dark:bg-black/90 hover-elevate active-elevate-2">
                    <Heart className="h-5 w-5" />
                  </button>
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
                    <Badge variant="outline">{property.bedrooms} BHK</Badge>
                    <Badge variant="outline">{property.area}</Badge>
                  </div>

                  <div className="p-3 bg-primary/5 border border-primary/20 rounded-lg mb-4">
                    <p className="text-sm text-muted-foreground">
                      <Sparkles className="h-4 w-4 inline mr-1" />
                      {property.reason}
                    </p>
                  </div>

                  <Button className="w-full" data-testid={`button-view-${property.id}`}>
                    View Details
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
