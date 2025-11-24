import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, List, Map, Filter } from "lucide-react";

export default function PropertyMapPage() {
  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      price: "₹85 L",
      location: "Bandra West",
      bedrooms: 3,
      area: "1,200 sqft",
    },
    {
      id: "2",
      title: "Modern 2BHK Flat",
      price: "₹65 L",
      location: "Andheri East",
      bedrooms: 2,
      area: "950 sqft",
    },
    {
      id: "3",
      title: "Spacious 4BHK Villa",
      price: "₹1.2 Cr",
      location: "Powai",
      bedrooms: 4,
      area: "2,500 sqft",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="h-screen flex flex-col">
          {/* Top Bar */}
          <div className="border-b p-4">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <h1 className="font-serif font-bold text-2xl">Map View</h1>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" data-testid="button-filter">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
                <Button variant="outline" size="sm" data-testid="button-list">
                  <List className="h-4 w-4 mr-2" />
                  List View
                </Button>
              </div>
            </div>
          </div>

          {/* Map Container */}
          <div className="flex-1 flex">
            {/* Map */}
            <div className="flex-1 relative">
              <div className="absolute inset-0 bg-muted flex items-center justify-center">
                <div className="text-center">
                  <Map className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground">
                    Interactive Google Maps will be displayed here
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    (Available for logged-in users only)
                  </p>
                </div>
              </div>
            </div>

            {/* Property List Sidebar */}
            <div className="w-96 border-l overflow-y-auto">
              <div className="p-4">
                <h3 className="font-semibold mb-4">
                  {properties.length} Properties Found
                </h3>
                <div className="space-y-4">
                  {properties.map((property) => (
                    <Card key={property.id} className="p-4 hover-elevate cursor-pointer">
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-xs text-muted-foreground">Image</span>
                      </div>
                      <h4 className="font-semibold mb-2">{property.title}</h4>
                      <p className="text-2xl font-bold font-serif text-primary mb-2">
                        {property.price}
                      </p>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-3 w-3" />
                        <span>{property.location}</span>
                      </div>
                      <div className="flex gap-2">
                        <Badge variant="outline">{property.bedrooms} BHK</Badge>
                        <Badge variant="outline">{property.area}</Badge>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
