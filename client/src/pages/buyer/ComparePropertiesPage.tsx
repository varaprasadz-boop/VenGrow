import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  X,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Calendar,
  CheckCircle,
  XCircle,
} from "lucide-react";

export default function ComparePropertiesPage() {
  const [properties] = useState([
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
      furnishing: "Semi-Furnished",
      parking: "2 Covered",
      age: "2 years",
      amenities: ["Pool", "Gym", "Garden", "Security"],
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
      furnishing: "Fully Furnished",
      parking: "1 Covered",
      age: "1 year",
      amenities: ["Pool", "Gym", "Club House"],
    },
    {
      id: "3",
      title: "Spacious 3BHK Villa",
      location: "Whitefield, Bangalore",
      price: "₹1.25 Cr",
      bedrooms: 3,
      bathrooms: 3,
      area: 1800,
      floor: "Ground",
      facing: "South",
      furnishing: "Unfurnished",
      parking: "3 Covered",
      age: "New",
      amenities: ["Garden", "Security"],
    },
  ]);

  const allAmenities = Array.from(
    new Set(properties.flatMap((p) => p.amenities))
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Compare Properties
            </h1>
            <p className="text-muted-foreground">
              Compare up to 3 properties side by side
            </p>
          </div>

          <div className="overflow-x-auto">
            <div className="min-w-[900px]">
              {/* Property Cards */}
              <div className="grid grid-cols-3 gap-4 mb-8">
                {properties.map((property) => (
                  <Card key={property.id} className="p-4">
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute -top-2 -right-2 h-6 w-6"
                        data-testid={`button-remove-${property.id}`}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                      <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center">
                        <span className="text-sm text-muted-foreground">Image</span>
                      </div>
                      <h3 className="font-semibold mb-1 line-clamp-2">
                        {property.title}
                      </h3>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                        <MapPin className="h-3 w-3" />
                        <span className="line-clamp-1">{property.location}</span>
                      </div>
                      <p className="text-lg font-bold font-serif text-primary">
                        {property.price}
                      </p>
                    </div>
                  </Card>
                ))}
              </div>

              {/* Comparison Table */}
              <Card className="overflow-hidden">
                <table className="w-full">
                  <tbody>
                    {/* Basic Details */}
                    <tr className="border-b bg-muted/50">
                      <td className="p-4 font-semibold" colSpan={4}>
                        Basic Details
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground w-48">
                        <div className="flex items-center gap-2">
                          <Bed className="h-4 w-4" />
                          Bedrooms
                        </div>
                      </td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.bedrooms} BHK
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Bath className="h-4 w-4" />
                          Bathrooms
                        </div>
                      </td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.bathrooms}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Maximize className="h-4 w-4" />
                          Area
                        </div>
                      </td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.area} sq ft
                        </td>
                      ))}
                    </tr>

                    {/* Property Features */}
                    <tr className="border-b bg-muted/50">
                      <td className="p-4 font-semibold" colSpan={4}>
                        Property Features
                      </td>
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">Floor</td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.floor}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">Facing</td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.facing}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">
                        Furnishing
                      </td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.furnishing}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">Parking</td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.parking}
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b">
                      <td className="p-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-2">
                          <Calendar className="h-4 w-4" />
                          Age
                        </div>
                      </td>
                      {properties.map((p) => (
                        <td key={p.id} className="p-4 text-center">
                          {p.age}
                        </td>
                      ))}
                    </tr>

                    {/* Amenities */}
                    <tr className="border-b bg-muted/50">
                      <td className="p-4 font-semibold" colSpan={4}>
                        Amenities
                      </td>
                    </tr>
                    {allAmenities.map((amenity) => (
                      <tr key={amenity} className="border-b">
                        <td className="p-4 text-sm text-muted-foreground">
                          {amenity}
                        </td>
                        {properties.map((p) => (
                          <td key={p.id} className="p-4 text-center">
                            {p.amenities.includes(amenity) ? (
                              <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                            ) : (
                              <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                            )}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </Card>

              {/* Actions */}
              <div className="grid grid-cols-3 gap-4 mt-6">
                {properties.map((property) => (
                  <div key={property.id} className="flex gap-2">
                    <Button className="flex-1" data-testid={`button-view-${property.id}`}>
                      View Details
                    </Button>
                    <Button
                      variant="outline"
                      className="flex-1"
                      data-testid={`button-contact-${property.id}`}
                    >
                      Contact Seller
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
