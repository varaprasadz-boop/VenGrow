import { useQueries } from "@tanstack/react-query";
import { Link } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  X,
  Bed,
  Bath,
  Maximize,
  MapPin,
  Scale,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { useCompare } from "@/contexts/CompareContext";
import type { Property } from "@shared/schema";

function formatPrice(price: number): string {
  if (price >= 10000000) return `₹${(price / 10000000).toFixed(1)} Cr`;
  if (price >= 100000) return `₹${(price / 100000).toFixed(0)} L`;
  return `₹${price.toLocaleString()}`;
}

export default function ComparePropertiesPage() {
  const { compareIds, removeFromCompare, clearCompare } = useCompare();

  const propertyQueries = useQueries({
    queries: compareIds.map((id) => ({
      queryKey: ["/api/properties", id],
      queryFn: async () => {
        const res = await fetch(`/api/properties/${id}`);
        if (!res.ok) throw new Error("Failed to fetch");
        return res.json() as Promise<Property & { images?: unknown[] }>;
      },
      enabled: !!id,
    })),
  });

  const properties = propertyQueries
    .map((q) => q.data)
    .filter((p): p is Property & { images?: unknown[] } => !!p);
  const isLoading = propertyQueries.some((q) => q.isLoading);
  const allAmenities = Array.from(
    new Set(
      properties.flatMap((p) => (Array.isArray(p.amenities) ? p.amenities : []))
    )
  );

  if (compareIds.length === 0) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16 lg:pb-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="mb-8">
              <h1 className="font-serif font-bold text-3xl mb-2">
                Compare Properties
              </h1>
              <p className="text-muted-foreground">
                Add properties from listings or property details to compare them side by side (up to 3).
              </p>
            </div>
            <Card className="p-12 text-center text-muted-foreground">
              <Scale className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium">No properties to compare</p>
              <p className="text-sm mt-1">Add properties using the &quot;Compare&quot; button on listing or detail pages.</p>
              <Link href="/properties">
                <Button className="mt-4">Browse Properties</Button>
              </Link>
            </Card>
          </div>
        </main>
        <BuyerBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Compare Properties
              </h1>
              <p className="text-muted-foreground">
                Compare up to 3 properties side by side
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={clearCompare}>
              Clear all
            </Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {compareIds.map((id) => (
                <Card key={id} className="p-4">
                  <Skeleton className="aspect-video w-full rounded-lg mb-3" />
                  <Skeleton className="h-5 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3" />
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <div className="min-w-[800px]">
                  <div className={`grid gap-4 mb-8`} style={{ gridTemplateColumns: `repeat(${Math.max(1, properties.length)}, minmax(0, 1fr))` }}>
                    {properties.map((property) => (
                      <Card key={property.id} className="p-4">
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="absolute -top-2 -right-2 h-6 w-6 z-10"
                            onClick={() => removeFromCompare(property.id)}
                            data-testid={`button-remove-${property.id}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          <div className="aspect-video bg-muted rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                            {(property as any).images?.[0] ? (
                              <img
                                src={typeof (property as any).images[0] === "string"
                                  ? (property as any).images[0]
                                  : (property as any).images[0]?.url}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <span className="text-sm text-muted-foreground">No image</span>
                            )}
                          </div>
                          <h3 className="font-semibold mb-1 line-clamp-2">
                            {property.title}
                          </h3>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mb-2">
                            <MapPin className="h-3 w-3 shrink-0" />
                            <span className="line-clamp-1">
                              {[property.locality, property.city].filter(Boolean).join(", ")}
                            </span>
                          </div>
                          <p className="text-lg font-bold font-serif text-primary">
                            {formatPrice(property.price)}
                          </p>
                          <Link href={`/properties/${property.id}`}>
                            <Button className="w-full mt-2" size="sm" data-testid={`button-view-${property.id}`}>
                              View Details
                            </Button>
                          </Link>
                        </div>
                      </Card>
                    ))}
                  </div>

                  <Card className="overflow-hidden">
                    <table className="w-full">
                      <tbody>
                        <tr className="border-b bg-muted/50">
                          <td className="p-4 font-semibold w-48" colSpan={properties.length + 1}>
                            Basic Details
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Bed className="h-4 w-4" />
                              Bedrooms
                            </div>
                          </td>
                          {properties.map((p) => (
                            <td key={p.id} className="p-4 text-center">
                              {p.bedrooms != null ? `${p.bedrooms} BHK` : "—"}
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
                              {p.bathrooms ?? "—"}
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
                              {p.area != null ? `${p.area} sq ft` : "—"}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b bg-muted/50">
                          <td className="p-4 font-semibold" colSpan={properties.length + 1}>
                            Property Features
                          </td>
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm text-muted-foreground">Floor</td>
                          {properties.map((p) => (
                            <td key={p.id} className="p-4 text-center">
                              {p.floor != null ? p.floor : "—"}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm text-muted-foreground">Facing</td>
                          {properties.map((p) => (
                            <td key={p.id} className="p-4 text-center">
                              {p.facing || "—"}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm text-muted-foreground">Furnishing</td>
                          {properties.map((p) => (
                            <td key={p.id} className="p-4 text-center">
                              {p.furnishing || "—"}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm text-muted-foreground">Age</td>
                          {properties.map((p) => (
                            <td key={p.id} className="p-4 text-center">
                              {p.ageOfProperty != null ? `${p.ageOfProperty} years` : "—"}
                            </td>
                          ))}
                        </tr>
                        {allAmenities.length > 0 && (
                          <>
                            <tr className="border-b bg-muted/50">
                              <td className="p-4 font-semibold" colSpan={properties.length + 1}>
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
                                    {Array.isArray(p.amenities) && p.amenities.includes(amenity) ? (
                                      <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                                    ) : (
                                      <XCircle className="h-5 w-5 text-muted-foreground mx-auto" />
                                    )}
                                  </td>
                                ))}
                              </tr>
                            ))}
                          </>
                        )}
                      </tbody>
                    </table>
                  </Card>
                </div>
              </div>
            </>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
