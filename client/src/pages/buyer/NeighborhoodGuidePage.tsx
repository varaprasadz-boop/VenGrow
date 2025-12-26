import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  MapPin,
  School,
  Hospital,
  ShoppingCart,
  Train,
  Coffee,
  Star,
} from "lucide-react";

export default function NeighborhoodGuidePage() {
  const neighborhood = {
    name: "Bandra West",
    city: "Mumbai",
    rating: 4.5,
    description:
      "Bandra West is one of Mumbai's most sought-after residential areas, known for its blend of old-world charm and modern amenities. The area offers excellent connectivity, upscale dining, and a vibrant lifestyle.",
  };

  const highlights = [
    {
      icon: School,
      title: "Education",
      items: ["St. Stanislaus High School", "Lilavatibai Podar High School", "Vibgyor High"],
      distance: "Within 2 km",
    },
    {
      icon: Hospital,
      title: "Healthcare",
      items: ["Lilavati Hospital", "Bhabha Hospital", "Holy Family Hospital"],
      distance: "Within 3 km",
    },
    {
      icon: ShoppingCart,
      title: "Shopping",
      items: ["Linking Road", "Hill Road", "Turner Road"],
      distance: "Walking distance",
    },
    {
      icon: Train,
      title: "Transport",
      items: ["Bandra Railway Station", "Metro Station", "Airport"],
      distance: "Within 5 km",
    },
    {
      icon: Coffee,
      title: "Dining & Lifestyle",
      items: ["Carter Road Promenade", "Bandstand", "Bandra Fort"],
      distance: "Walking distance",
    },
  ];

  const stats = [
    { label: "Average Property Price", value: "₹85 L/BHK" },
    { label: "Population Density", value: "Medium" },
    { label: "Safety Rating", value: "4.5/5" },
    { label: "Traffic", value: "Moderate" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-3">
              <MapPin className="h-5 w-5 text-primary" />
              <h1 className="font-serif font-bold text-3xl">
                {neighborhood.name}, {neighborhood.city}
              </h1>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`h-5 w-5 ${
                      star <= neighborhood.rating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-muted-foreground"
                    }`}
                  />
                ))}
              </div>
              <span className="font-semibold">{neighborhood.rating}/5</span>
            </div>
            <p className="text-muted-foreground max-w-3xl">
              {neighborhood.description}
            </p>
          </div>

          {/* Hero Image */}
          <Card className="p-0 mb-8 overflow-hidden">
            <div className="aspect-video bg-muted flex items-center justify-center">
              <span className="text-muted-foreground">Neighborhood Image</span>
            </div>
          </Card>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <p className="text-2xl font-bold font-serif text-primary mb-1">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Highlights */}
          <div className="mb-8">
            <h2 className="font-serif font-bold text-2xl mb-6">
              Neighborhood Highlights
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {highlights.map((highlight, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <highlight.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{highlight.title}</h3>
                      <Badge variant="outline">{highlight.distance}</Badge>
                    </div>
                  </div>
                  <ul className="space-y-2">
                    {highlight.items.map((item, idx) => (
                      <li
                        key={idx}
                        className="flex items-center gap-2 text-sm text-muted-foreground"
                      >
                        <span className="text-primary">•</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </Card>
              ))}
            </div>
          </div>

          {/* Available Properties */}
          <Card className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-serif font-bold text-2xl">
                Available Properties in {neighborhood.name}
              </h2>
              <Button data-testid="button-view-all">View All Properties</Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-4 hover-elevate cursor-pointer">
                  <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>
                  <h3 className="font-semibold mb-2">3BHK Apartment</h3>
                  <p className="text-2xl font-bold font-serif text-primary mb-2">
                    ₹85 L
                  </p>
                  <p className="text-sm text-muted-foreground">1,200 sqft • 3 BHK</p>
                </Card>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
