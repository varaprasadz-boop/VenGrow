import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { X, MapPin, Home, DollarSign, TrendingUp } from "lucide-react";

export default function PropertyComparePage() {
  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,200 sqft",
      floor: "3rd",
      age: "5 years",
      parking: "2 covered",
      amenities: ["Gym", "Pool", "Security", "Garden"],
    },
    {
      id: "2",
      title: "Modern 3BHK Flat",
      location: "Andheri East, Mumbai",
      price: "₹72 L",
      bedrooms: 3,
      bathrooms: 2,
      area: "1,150 sqft",
      floor: "7th",
      age: "2 years",
      parking: "1 covered",
      amenities: ["Gym", "Security", "Lift"],
    },
    {
      id: "3",
      title: "Spacious 3BHK",
      location: "Powai, Mumbai",
      price: "₹95 L",
      bedrooms: 3,
      bathrooms: 3,
      area: "1,350 sqft",
      floor: "10th",
      age: "Under construction",
      parking: "2 covered",
      amenities: ["Gym", "Pool", "Security", "Garden", "Clubhouse"],
    },
  ];

  const comparisonRows = [
    { label: "Price", key: "price", icon: DollarSign },
    { label: "Location", key: "location", icon: MapPin },
    { label: "Bedrooms", key: "bedrooms", icon: Home },
    { label: "Bathrooms", key: "bathrooms", icon: Home },
    { label: "Area", key: "area", icon: TrendingUp },
    { label: "Floor", key: "floor", icon: Home },
    { label: "Age", key: "age", icon: Home },
    { label: "Parking", key: "parking", icon: Home },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Compare Properties
            </h1>
            <p className="text-muted-foreground">
              Side-by-side comparison of selected properties
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-max">
              {/* Property Cards */}
              <div className="grid grid-cols-4 gap-4 mb-8">
                <div className="p-4"></div>
                {properties.map((property) => (
                  <Card key={property.id} className="p-6">
                    <div className="flex justify-end mb-4">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        data-testid={`button-remove-${property.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Image</span>
                    </div>
                    <h3 className="font-semibold mb-2">{property.title}</h3>
                    <p className="text-2xl font-bold font-serif text-primary mb-2">
                      {property.price}
                    </p>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="h-3 w-3" />
                      <span className="line-clamp-1">{property.location}</span>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Comparison Table */}
              <Card className="p-6">
                <div className="space-y-4">
                  {comparisonRows.map((row, index) => (
                    <div
                      key={index}
                      className="grid grid-cols-4 gap-4 py-3 border-b last:border-0"
                    >
                      <div className="flex items-center gap-2 font-medium">
                        <row.icon className="h-4 w-4 text-muted-foreground" />
                        <span>{row.label}</span>
                      </div>
                      {properties.map((property) => (
                        <div key={property.id} className="text-sm">
                          {property[row.key as keyof typeof property]}
                        </div>
                      ))}
                    </div>
                  ))}

                  {/* Amenities */}
                  <div className="grid grid-cols-4 gap-4 py-3">
                    <div className="font-medium">Amenities</div>
                    {properties.map((property) => (
                      <div key={property.id} className="flex flex-wrap gap-2">
                        {property.amenities.map((amenity, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {amenity}
                          </Badge>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-4 gap-4 mt-6">
                <div></div>
                {properties.map((property) => (
                  <Button
                    key={property.id}
                    className="w-full"
                    data-testid={`button-view-${property.id}`}
                  >
                    View Details
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
