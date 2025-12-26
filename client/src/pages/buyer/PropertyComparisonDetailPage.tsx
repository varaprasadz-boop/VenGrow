import { Link } from "wouter";
import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Check,
  X,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  Compass,
  Sofa,
  Car,
} from "lucide-react";

export default function PropertyComparisonDetailPage() {
  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      floor: "3rd",
      facing: "North",
      age: "2 years",
      furnishing: "Semi-Furnished",
      parking: "2 Covered",
      amenities: ["Pool", "Gym", "Garden", "Security", "Club House"],
      features: {
        balcony: true,
        powerBackup: true,
        lift: true,
        security: true,
        gatedCommunity: true,
        park: true,
        waterSupply: true,
        maintenance: "₹3,500/month",
      },
    },
    {
      id: "2",
      title: "Modern 3BHK Flat",
      location: "Koramangala, Bangalore",
      price: "₹75 L",
      bedrooms: 3,
      bathrooms: 2,
      area: 1100,
      floor: "5th",
      facing: "East",
      age: "1 year",
      furnishing: "Fully Furnished",
      parking: "1 Covered",
      amenities: ["Pool", "Gym", "Club House", "Play Area"],
      features: {
        balcony: true,
        powerBackup: true,
        lift: true,
        security: true,
        gatedCommunity: true,
        park: false,
        waterSupply: true,
        maintenance: "₹4,000/month",
      },
    },
  ];

  const ComparisonRow = ({ label, values }: { label: string; values: any[] }) => (
    <div className="grid grid-cols-3 gap-4 p-4 border-b last:border-0">
      <div className="font-medium">{label}</div>
      {values.map((value, index) => (
        <div key={index} className="text-center">
          {typeof value === "boolean" ? (
            value ? (
              <Check className="h-5 w-5 text-green-600 mx-auto" />
            ) : (
              <X className="h-5 w-5 text-red-600 mx-auto" />
            )
          ) : (
            <span>{value}</span>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Link href="/buyer/compare">
            <a className="text-sm text-primary hover:underline mb-4 inline-block">
              ← Back to Compare
            </a>
          </Link>

          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Comparison
            </h1>
            <p className="text-muted-foreground">
              Detailed side-by-side comparison
            </p>
          </div>

          {/* Property Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {properties.map((property) => (
              <Card key={property.id} className="p-6">
                <div className="aspect-video bg-muted rounded-lg mb-4 flex items-center justify-center">
                  <span className="text-sm text-muted-foreground">Image</span>
                </div>
                <h3 className="font-semibold text-lg mb-2">{property.title}</h3>
                <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{property.location}</span>
                </div>
                <p className="text-3xl font-bold font-serif text-primary mb-4">
                  {property.price}
                </p>
                <Link href={`/property/${property.id}`}>
                  <Button className="w-full" data-testid={`button-view-${property.id}`}>
                    View Full Details
                  </Button>
                </Link>
              </Card>
            ))}
          </div>

          {/* Comparison Table */}
          <Card className="overflow-hidden">
            <div className="bg-muted p-4 border-b">
              <h2 className="font-semibold text-lg">Basic Details</h2>
            </div>
            <ComparisonRow
              label="Price"
              values={properties.map((p) => p.price)}
            />
            <ComparisonRow
              label="Bedrooms"
              values={properties.map((p) => `${p.bedrooms} BHK`)}
            />
            <ComparisonRow
              label="Bathrooms"
              values={properties.map((p) => p.bathrooms)}
            />
            <ComparisonRow
              label="Area"
              values={properties.map((p) => `${p.area} sqft`)}
            />
            <ComparisonRow
              label="Floor"
              values={properties.map((p) => p.floor)}
            />
            <ComparisonRow
              label="Facing"
              values={properties.map((p) => p.facing)}
            />
            <ComparisonRow
              label="Property Age"
              values={properties.map((p) => p.age)}
            />
            <ComparisonRow
              label="Furnishing"
              values={properties.map((p) => p.furnishing)}
            />
            <ComparisonRow
              label="Parking"
              values={properties.map((p) => p.parking)}
            />
            <ComparisonRow
              label="Maintenance"
              values={properties.map((p) => p.features.maintenance)}
            />
          </Card>

          {/* Features */}
          <Card className="overflow-hidden mt-6">
            <div className="bg-muted p-4 border-b">
              <h2 className="font-semibold text-lg">Features</h2>
            </div>
            <ComparisonRow
              label="Balcony"
              values={properties.map((p) => p.features.balcony)}
            />
            <ComparisonRow
              label="Power Backup"
              values={properties.map((p) => p.features.powerBackup)}
            />
            <ComparisonRow
              label="Lift"
              values={properties.map((p) => p.features.lift)}
            />
            <ComparisonRow
              label="24/7 Security"
              values={properties.map((p) => p.features.security)}
            />
            <ComparisonRow
              label="Gated Community"
              values={properties.map((p) => p.features.gatedCommunity)}
            />
            <ComparisonRow
              label="Park"
              values={properties.map((p) => p.features.park)}
            />
            <ComparisonRow
              label="Water Supply"
              values={properties.map((p) => p.features.waterSupply)}
            />
          </Card>

          {/* Amenities */}
          <Card className="p-6 mt-6">
            <h2 className="font-semibold text-lg mb-4">Amenities</h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="font-medium">Amenity</div>
              {properties.map((property, index) => (
                <div key={index} className="text-center font-medium">
                  Property {index + 1}
                </div>
              ))}

              {Array.from(
                new Set(properties.flatMap((p) => p.amenities))
              ).map((amenity) => (
                <>
                  <div className="py-2">{amenity}</div>
                  {properties.map((property, index) => (
                    <div key={index} className="py-2 text-center">
                      {property.amenities.includes(amenity) ? (
                        <Check className="h-5 w-5 text-green-600 mx-auto" />
                      ) : (
                        <X className="h-5 w-5 text-red-600 mx-auto" />
                      )}
                    </div>
                  ))}
                </>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
