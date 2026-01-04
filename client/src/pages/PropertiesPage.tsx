import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { 
  Building2, MapPin, BedDouble, Bath, Maximize, Heart, 
  Search, Filter, Grid3X3, List, SlidersHorizontal,
  ChevronDown, CheckCircle
} from "lucide-react";
import type { Property } from "@shared/schema";

function PropertyCard({ property, variant = "grid" }: { property: Property; variant?: "grid" | "list" }) {
  const isListLayout = variant === "list";
  
  return (
    <Card className={`overflow-hidden hover-elevate group ${isListLayout ? "flex" : ""}`}>
      <div className={`relative bg-muted ${isListLayout ? "w-64 h-48 flex-shrink-0" : "h-48"}`}>
        <div className="absolute inset-0 flex items-center justify-center">
          <Building2 className="h-16 w-16 text-muted-foreground" />
        </div>
        <div className="absolute top-3 left-3 flex gap-2">
          {property.isFeatured && (
            <Badge className="bg-primary">Featured</Badge>
          )}
          {property.isVerified && (
            <Badge variant="secondary" className="flex items-center gap-1">
              <CheckCircle className="h-3 w-3" /> Verified
            </Badge>
          )}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute top-3 right-3 bg-background/80 hover:bg-background"
          data-testid={`button-favorite-${property.id}`}
        >
          <Heart className="h-4 w-4" />
        </Button>
        {!isListLayout && (
          <div className="absolute bottom-3 left-3">
            <Badge variant="outline" className="bg-background/80">
              {property.transactionType === "sale" ? "For Sale" : "For Rent"}
            </Badge>
          </div>
        )}
      </div>
      <CardContent className={`${isListLayout ? "flex-1" : ""} p-4`}>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className={`font-semibold ${isListLayout ? "text-xl" : ""} line-clamp-2 flex-1`}>{property.title}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {isListLayout && (
              <p className="text-xl font-bold text-primary">
                ₹{(property.price / 100000).toFixed(2)} L
                {property.transactionType === "rent" && <span className="text-sm font-normal">/month</span>}
              </p>
            )}
            <Badge variant="secondary">{property.propertyType}</Badge>
          </div>
        </div>
        <p className="text-sm text-muted-foreground flex items-center gap-1 mb-2">
          <MapPin className="h-3 w-3" /> 
          {property.city}, {property.state}
        </p>
        {isListLayout && (
          <Badge variant="outline" className="mb-2">
            {property.transactionType === "sale" ? "For Sale" : "For Rent"}
          </Badge>
        )}
        {!isListLayout && (
          <p className="text-xl font-bold text-primary mb-3">
            ₹{(property.price / 100000).toFixed(2)} L
            {property.transactionType === "rent" && <span className="text-sm font-normal">/month</span>}
          </p>
        )}
        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-4">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <BedDouble className="h-4 w-4" /> {property.bedrooms} Beds
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="h-4 w-4" /> {property.bathrooms} Baths
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="h-4 w-4" /> {property.area} sqft
          </span>
        </div>
        <Button className="w-full" asChild>
          <Link href={`/property/${property.id}`} data-testid={`button-view-property-${property.id}`}>
            View Details
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}

function FilterSidebar({ className }: { className?: string }) {
  const [priceRange, setPriceRange] = useState([0, 50000000]);

  return (
    <div className={className}>
      <div className="space-y-6">
        <div>
          <h3 className="font-semibold mb-3">Property Type</h3>
          <div className="space-y-2">
            {["Apartment", "Villa", "House", "Plot", "Commercial", "Farmhouse"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <Checkbox id={`type-${type}`} />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Price Range</h3>
          <Slider
            value={priceRange}
            onValueChange={setPriceRange}
            min={0}
            max={50000000}
            step={100000}
            className="mb-2"
          />
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>₹{(priceRange[0] / 100000).toFixed(0)}L</span>
            <span>₹{(priceRange[1] / 100000).toFixed(0)}L</span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Bedrooms</h3>
          <div className="flex flex-wrap gap-2">
            {["1", "2", "3", "4", "5+"].map((bed) => (
              <Button key={bed} variant="outline" size="sm">
                {bed} BHK
              </Button>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Transaction Type</h3>
          <div className="space-y-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox id="sale" data-testid="checkbox-buy" />
              <span className="text-sm">Buy</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox id="lease" data-testid="checkbox-lease" />
              <span className="text-sm">Lease</span>
            </label>
            <label className="flex items-center gap-2 cursor-pointer">
              <Checkbox id="rent" data-testid="checkbox-rent" />
              <span className="text-sm">Rent</span>
            </label>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Seller Type</h3>
          <div className="space-y-2">
            {["Individual", "Broker", "Builder"].map((type) => (
              <label key={type} className="flex items-center gap-2 cursor-pointer">
                <Checkbox id={`seller-${type}`} />
                <span className="text-sm">{type}</span>
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3">Verification</h3>
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox id="verified" />
            <span className="text-sm">Verified Properties Only</span>
          </label>
        </div>

        <Button className="w-full" data-testid="button-apply-filters">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export default function PropertiesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  
  const { data: properties, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <div className="bg-card rounded-lg p-4 mb-6 shadow-sm">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input 
                  placeholder="Search by location, property name, or keyword..." 
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select defaultValue="all">
                <SelectTrigger className="w-full sm:w-40" data-testid="select-city">
                  <SelectValue placeholder="City" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  <SelectItem value="mumbai">Mumbai</SelectItem>
                  <SelectItem value="delhi">Delhi NCR</SelectItem>
                  <SelectItem value="bangalore">Bangalore</SelectItem>
                  <SelectItem value="pune">Pune</SelectItem>
                  <SelectItem value="chennai">Chennai</SelectItem>
                  <SelectItem value="hyderabad">Hyderabad</SelectItem>
                </SelectContent>
              </Select>
              <Button data-testid="button-search">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Filters - Desktop */}
            <aside className="hidden lg:block w-64 shrink-0">
              <Card className="sticky top-4">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="font-semibold flex items-center gap-2">
                      <Filter className="h-4 w-4" /> Filters
                    </h2>
                    <Button variant="ghost" size="sm" data-testid="button-clear-filters">
                      Clear All
                    </Button>
                  </div>
                  <FilterSidebar />
                </CardContent>
              </Card>
            </aside>

            {/* Main Content */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h1 className="text-xl font-semibold">
                    {isLoading ? "Loading..." : `${properties?.length ?? 0} Properties Found`}
                  </h1>
                  <p className="text-sm text-muted-foreground">in All Cities</p>
                </div>
                <div className="flex items-center gap-2">
                  {/* Mobile Filter */}
                  <Sheet>
                    <SheetTrigger asChild>
                      <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                      </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="overflow-y-auto">
                      <SheetHeader>
                        <SheetTitle>Filters</SheetTitle>
                      </SheetHeader>
                      <FilterSidebar className="mt-4" />
                    </SheetContent>
                  </Sheet>

                  <Select defaultValue="newest">
                    <SelectTrigger className="w-40" data-testid="select-sort">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest First</SelectItem>
                      <SelectItem value="price-low">Price: Low to High</SelectItem>
                      <SelectItem value="price-high">Price: High to Low</SelectItem>
                      <SelectItem value="popular">Most Popular</SelectItem>
                    </SelectContent>
                  </Select>

                  <div className="hidden sm:flex items-center border rounded-md">
                    <Button 
                      variant={viewMode === "grid" ? "secondary" : "ghost"} 
                      size="icon"
                      onClick={() => setViewMode("grid")}
                      data-testid="button-view-grid"
                    >
                      <Grid3X3 className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant={viewMode === "list" ? "secondary" : "ghost"} 
                      size="icon"
                      onClick={() => setViewMode("list")}
                      data-testid="button-view-list"
                    >
                      <List className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Property Grid */}
              {isLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <Card key={i} className="overflow-hidden">
                      <div className="h-48 bg-muted animate-pulse" />
                      <CardContent className="p-4 space-y-3">
                        <div className="h-5 bg-muted animate-pulse rounded" />
                        <div className="h-4 bg-muted animate-pulse rounded w-2/3" />
                        <div className="h-6 bg-muted animate-pulse rounded w-1/3" />
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className={viewMode === "grid" 
                  ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                  : "space-y-4"
                }>
                  {properties?.map((property) => (
                    <PropertyCard key={property.id} property={property} variant={viewMode === "list" ? "list" : "grid"} />
                  ))}
                </div>
              )}

              {/* Pagination */}
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button variant="outline" size="sm" disabled data-testid="button-prev-page">
                  Previous
                </Button>
                <Button variant="secondary" size="sm">1</Button>
                <Button variant="outline" size="sm">2</Button>
                <Button variant="outline" size="sm">3</Button>
                <Button variant="outline" size="sm" data-testid="button-next-page">
                  Next
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
