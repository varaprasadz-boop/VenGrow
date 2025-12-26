import { useState } from "react";
import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  SlidersHorizontal,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Heart,
  X,
} from "lucide-react";

export default function SearchResultsPage() {
  const [showFilters, setShowFilters] = useState(true);
  const [filters, setFilters] = useState({
    location: "Mumbai",
    propertyType: "",
    minPrice: "",
    maxPrice: "",
    bedrooms: "",
    furnishing: "",
  });

  const properties = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment in Prime Location",
      location: "Bandra West, Mumbai",
      price: "₹85 L",
      bedrooms: 3,
      bathrooms: 2,
      area: 1200,
      featured: true,
    },
    {
      id: "2",
      title: "Spacious 2BHK Flat with Modern Amenities",
      location: "Koramangala, Bangalore",
      price: "₹45,000/mo",
      bedrooms: 2,
      bathrooms: 2,
      area: 900,
      featured: false,
    },
    {
      id: "3",
      title: "Beautiful Villa with Garden",
      location: "Whitefield, Bangalore",
      price: "₹1.25 Cr",
      bedrooms: 4,
      bathrooms: 3,
      area: 2500,
      featured: true,
    },
    {
      id: "4",
      title: "Modern 1BHK Apartment",
      location: "Andheri East, Mumbai",
      price: "₹35,000/mo",
      bedrooms: 1,
      bathrooms: 1,
      area: 600,
      featured: false,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search Bar */}
          <Card className="p-4 mb-6">
            <div className="flex gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  placeholder="Search by location, landmark, or property name..."
                  className="pl-10"
                  defaultValue="Mumbai"
                  data-testid="input-search"
                />
              </div>
              <Button data-testid="button-search">Search</Button>
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                data-testid="button-toggle-filters"
              >
                <SlidersHorizontal className="h-5 w-5 mr-2" />
                Filters
              </Button>
            </div>
          </Card>

          <div className="flex gap-6">
            {/* Filters Sidebar */}
            {showFilters && (
              <aside className="w-80 flex-shrink-0">
                <Card className="p-6 sticky top-4">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-semibold text-lg">Filters</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowFilters(false)}
                      className="lg:hidden"
                      data-testid="button-close-filters"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-6">
                    {/* Property Type */}
                    <div className="space-y-2">
                      <Label>Property Type</Label>
                      <Select
                        value={filters.propertyType}
                        onValueChange={(value) =>
                          setFilters({ ...filters, propertyType: value })
                        }
                      >
                        <SelectTrigger data-testid="select-property-type">
                          <SelectValue placeholder="All Types" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="house">Independent House</SelectItem>
                          <SelectItem value="commercial">Commercial</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Price Range */}
                    <div className="space-y-2">
                      <Label>Price Range</Label>
                      <div className="flex gap-2">
                        <Input
                          placeholder="Min"
                          type="number"
                          value={filters.minPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, minPrice: e.target.value })
                          }
                          data-testid="input-min-price"
                        />
                        <Input
                          placeholder="Max"
                          type="number"
                          value={filters.maxPrice}
                          onChange={(e) =>
                            setFilters({ ...filters, maxPrice: e.target.value })
                          }
                          data-testid="input-max-price"
                        />
                      </div>
                    </div>

                    {/* Bedrooms */}
                    <div className="space-y-2">
                      <Label>Bedrooms</Label>
                      <Select
                        value={filters.bedrooms}
                        onValueChange={(value) =>
                          setFilters({ ...filters, bedrooms: value })
                        }
                      >
                        <SelectTrigger data-testid="select-bedrooms">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 BHK</SelectItem>
                          <SelectItem value="2">2 BHK</SelectItem>
                          <SelectItem value="3">3 BHK</SelectItem>
                          <SelectItem value="4">4+ BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Furnishing */}
                    <div className="space-y-2">
                      <Label>Furnishing</Label>
                      <Select
                        value={filters.furnishing}
                        onValueChange={(value) =>
                          setFilters({ ...filters, furnishing: value })
                        }
                      >
                        <SelectTrigger data-testid="select-furnishing">
                          <SelectValue placeholder="Any" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="unfurnished">Unfurnished</SelectItem>
                          <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                          <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* Actions */}
                    <div className="flex gap-2">
                      <Button variant="outline" className="flex-1" data-testid="button-clear">
                        Clear All
                      </Button>
                      <Button className="flex-1" data-testid="button-apply">
                        Apply
                      </Button>
                    </div>
                  </div>
                </Card>
              </aside>
            )}

            {/* Results */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h2 className="font-semibold text-xl mb-1">
                    {properties.length} Properties Found
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    Properties in Mumbai
                  </p>
                </div>
                <Select defaultValue="featured">
                  <SelectTrigger className="w-48" data-testid="select-sort">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="featured">Featured First</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest First</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Property Cards */}
              <div className="space-y-4">
                {properties.map((property) => (
                  <Card key={property.id} className="p-6 hover-elevate active-elevate-2">
                    <div className="flex gap-6">
                      <div className="w-64 h-48 bg-muted rounded-lg flex-shrink-0 flex items-center justify-center">
                        <p className="text-sm text-muted-foreground">Property Image</p>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <div className="flex items-center gap-2 mb-2">
                              <h3 className="font-semibold text-lg">
                                {property.title}
                              </h3>
                              {property.featured && (
                                <Badge>Featured</Badge>
                              )}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                              <MapPin className="h-4 w-4" />
                              {property.location}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            data-testid={`button-favorite-${property.id}`}
                          >
                            <Heart className="h-5 w-5" />
                          </Button>
                        </div>

                        <div className="flex flex-wrap items-center gap-6 mb-4">
                          <div className="flex items-center gap-2 text-sm">
                            <Bed className="h-4 w-4 text-muted-foreground" />
                            <span>{property.bedrooms} Beds</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Bath className="h-4 w-4 text-muted-foreground" />
                            <span>{property.bathrooms} Baths</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm">
                            <Maximize className="h-4 w-4 text-muted-foreground" />
                            <span>{property.area} sq ft</span>
                          </div>
                        </div>

                        <div className="flex items-center justify-between">
                          <p className="text-2xl font-bold font-serif text-primary">
                            {property.price}
                          </p>
                          <Button data-testid={`button-view-${property.id}`}>
                            View Details
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
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
