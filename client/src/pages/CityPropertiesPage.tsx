import { useState } from "react";
import { useRoute } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FilterSidebar from "@/components/FilterSidebar";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapView from "@/components/PropertyMapView";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid3x3, List, Map, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQuery } from "@tanstack/react-query";
import type { PopularCity, Property } from "@shared/schema";

export default function CityPropertiesPage() {
  const [, params] = useRoute("/properties/:citySlug");
  const citySlug = params?.citySlug || "";

  const [viewType, setViewType] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("newest");

  const { data: city, isLoading: cityLoading } = useQuery<PopularCity>({
    queryKey: ["/api/popular-cities", citySlug],
    queryFn: async () => {
      const response = await fetch(`/api/popular-cities/${citySlug}`);
      if (!response.ok) {
        if (response.status === 404) return null;
        throw new Error("Failed to fetch city");
      }
      return response.json();
    },
    enabled: !!citySlug,
  });

  const { data: allCities = [] } = useQuery<PopularCity[]>({
    queryKey: ["/api/popular-cities"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties", { city: city?.name }],
    queryFn: async () => {
      const response = await fetch(`/api/properties?city=${encodeURIComponent(city?.name || "")}`);
      if (!response.ok) throw new Error("Failed to fetch properties");
      return response.json();
    },
    enabled: !!city?.name,
  });

  const isLoading = cityLoading || propertiesLoading;

  const sortedProperties = [...properties].sort((a, b) => {
    switch (sortBy) {
      case "price_low":
        return a.price - b.price;
      case "price_high":
        return b.price - a.price;
      case "newest":
      default:
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    }
  });

  const pageTitle = city ? `Properties in ${city.name}` : "Properties";
  const pageDescription = city
    ? `Browse ${properties.length || "verified"} properties for sale and rent in ${city.name}, ${city.state}. Find apartments, villas, plots, and commercial spaces from verified sellers.`
    : "Browse properties across India";

  if (cityLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1 flex items-center justify-center">
          <div className="animate-pulse text-muted-foreground">Loading...</div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!city) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
            <h1 className="font-serif font-bold text-3xl mb-4">City Not Found</h1>
            <p className="text-muted-foreground mb-8">
              We couldn't find properties for this location. Try browsing our popular cities.
            </p>
            <div className="flex flex-wrap justify-center gap-3 mb-8">
              {allCities.slice(0, 8).map((c) => (
                <Link key={c.id} href={`/properties/${c.slug}`}>
                  <Button variant="outline" data-testid={`link-city-${c.slug}`}>
                    {c.name}
                  </Button>
                </Link>
              ))}
            </div>
            <Link href="/listings">
              <Button data-testid="button-all-listings">
                <ArrowLeft className="h-4 w-4 mr-2" />
                View All Properties
              </Button>
            </Link>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* SEO Hero Section */}
        <div className="bg-gradient-to-r from-primary/10 to-primary/5 border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
              <Link href="/" className="hover:text-foreground">Home</Link>
              <span>/</span>
              <Link href="/listings" className="hover:text-foreground">Properties</Link>
              <span>/</span>
              <span className="text-foreground">{city.name}</span>
            </nav>
            <h1 className="font-serif font-bold text-3xl md:text-4xl mb-2" data-testid="text-page-title">
              {pageTitle}
            </h1>
            <p className="text-muted-foreground max-w-2xl" data-testid="text-page-description">
              {pageDescription}
            </p>

            {/* Related Cities */}
            <div className="flex flex-wrap items-center gap-2 mt-6">
              <span className="text-sm text-muted-foreground">Explore nearby:</span>
              {allCities
                .filter((c) => c.id !== city.id)
                .slice(0, 5)
                .map((c) => (
                  <Link key={c.id} href={`/properties/${c.slug}`}>
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-7 text-xs"
                      data-testid={`link-nearby-${c.slug}`}
                    >
                      {c.name}
                    </Button>
                  </Link>
                ))}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar />
              </div>
            </aside>

            {/* Main Content */}
            <div className="flex-1 space-y-6">
              {/* Controls */}
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground" data-testid="text-property-count">
                  {properties.length} properties found in {city.name}
                </p>

                <div className="flex items-center gap-3">
                  {/* View Type Toggle */}
                  <div className="hidden sm:flex border rounded-lg p-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${viewType === "grid" ? "bg-accent" : ""}`}
                      onClick={() => setViewType("grid")}
                      data-testid="button-view-grid"
                    >
                      <Grid3x3 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${viewType === "list" ? "bg-accent" : ""}`}
                      onClick={() => setViewType("list")}
                      data-testid="button-view-list"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className={`h-8 w-8 ${viewType === "map" ? "bg-accent" : ""}`}
                      onClick={() => setViewType("map")}
                      data-testid="button-view-map"
                    >
                      <Map className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* Sort Select */}
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price_low">Price: Low to High</SelectItem>
                      <SelectItem value="price_high">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* Mobile Filter Button */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" className="lg:hidden" data-testid="button-mobile-filter">
                        <Filter className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-80 p-0">
                      <div className="p-4">
                        <FilterSidebar />
                      </div>
                    </SheetContent>
                  </Sheet>
                </div>
              </div>

              {/* Property Grid/List/Map */}
              {isLoading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="animate-pulse text-muted-foreground">Loading properties...</div>
                </div>
              ) : viewType === "map" ? (
                <PropertyMapView
                  properties={sortedProperties.map((p) => ({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    location: `${p.locality || ""}, ${p.city}`,
                    imageUrl: "",
                    bedrooms: p.bedrooms || undefined,
                    bathrooms: p.bathrooms || undefined,
                    area: p.area,
                    propertyType: p.propertyType,
                    isFeatured: p.isFeatured || false,
                    isVerified: p.isVerified || false,
                    lat: Number(p.latitude) || 0,
                    lng: Number(p.longitude) || 0,
                  }))}
                />
              ) : properties.length === 0 ? (
                <div className="text-center py-16">
                  <h3 className="font-semibold text-lg mb-2">No properties found</h3>
                  <p className="text-muted-foreground mb-6">
                    We couldn't find any properties in {city.name} matching your criteria.
                  </p>
                  <Link href="/listings">
                    <Button data-testid="button-browse-all">Browse All Properties</Button>
                  </Link>
                </div>
              ) : (
                <div
                  className={
                    viewType === "grid"
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }
                >
                  {sortedProperties.map((property) => (
                    <PropertyCard
                      key={property.id}
                      id={property.id}
                      title={property.title}
                      price={property.price}
                      location={`${property.locality || ""}, ${property.city}`}
                      imageUrl=""
                      bedrooms={property.bedrooms || undefined}
                      bathrooms={property.bathrooms || undefined}
                      area={property.area}
                      propertyType={property.propertyType}
                      isFeatured={property.isFeatured || false}
                      isVerified={property.isVerified || false}
                      sellerType="Individual"
                      transactionType={property.transactionType as "Sale" | "Lease" | "Rent"}
                    />
                  ))}
                </div>
              )}

              {/* SEO Content Section */}
              {city && (
                <div className="mt-12 p-6 bg-card rounded-lg border">
                  <h2 className="font-serif font-bold text-xl mb-4">
                    About Real Estate in {city.name}
                  </h2>
                  <div className="prose prose-sm text-muted-foreground max-w-none">
                    <p>
                      {city.name} is one of India's most sought-after real estate markets, offering
                      a diverse range of properties from luxury apartments to affordable housing
                      options. Located in {city.state}, {city.name} attracts homebuyers and
                      investors looking for quality properties with excellent connectivity and
                      infrastructure.
                    </p>
                    <p className="mt-4">
                      VenGrow offers verified property listings in {city.name} from trusted
                      sellers including individual owners, brokers, and builders. Our platform
                      ensures transparent pricing and authentic property information to help you
                      make informed decisions.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
