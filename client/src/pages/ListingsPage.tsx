import { useState, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FilterSidebar from "@/components/FilterSidebar";
import ListingsFilterHeader from "@/components/ListingsFilterHeader";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapView from "@/components/PropertyMapView";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Filter, Grid3x3, List, Map, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import type { Property } from "@shared/schema";
import defaultPropertyImage from '@assets/generated_images/luxury_indian_apartment_building.png';

export default function ListingsPage() {
  const [location] = useLocation();
  const [viewType, setViewType] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("newest");
  
  const transactionTypeFromPath = useMemo(() => {
    if (location === "/buy" || location.startsWith("/buy?")) return "Sale";
    if (location === "/lease" || location.startsWith("/lease?")) return "Lease";
    if (location === "/rent" || location.startsWith("/rent?")) return "Rent";
    return null;
  }, [location]);
  
  const pageTitle = useMemo(() => {
    if (location === "/buy" || location.startsWith("/buy?")) return "Properties for Sale";
    if (location === "/lease" || location.startsWith("/lease?")) return "Properties for Lease";
    if (location === "/rent" || location.startsWith("/rent?")) return "Properties for Rent";
    return "All Properties";
  }, [location]);

  // Fetch real properties from the API
  const { data: propertiesData, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Transform API data for PropertyCard component
  const allProperties = useMemo(() => {
    if (!propertiesData) return [];
    return propertiesData.map(property => ({
      id: property.id,
      title: property.title,
      price: property.price,
      location: `${property.locality || ''}, ${property.city || ''}`.replace(/^, |, $/g, '') || 'Location not specified',
      imageUrl: defaultPropertyImage,
      bedrooms: property.bedrooms || undefined,
      bathrooms: property.bathrooms || undefined,
      area: property.area || 0,
      propertyType: property.propertyType || "Property",
      isFeatured: property.isFeatured || false,
      isVerified: property.isVerified || false,
      sellerType: "Builder" as "Individual" | "Broker" | "Builder",
      transactionType: (property.transactionType || "Sale") as "Sale" | "Lease" | "Rent",
      lat: property.latitude ? parseFloat(property.latitude) : 19.0596,
      lng: property.longitude ? parseFloat(property.longitude) : 72.8295,
      projectStage: property.projectStage || undefined,
      subcategory: property.subcategoryId || undefined,
      ageOfProperty: property.ageOfProperty ? String(property.ageOfProperty) : undefined,
    }));
  }, [propertiesData]);
  
  const filteredProperties = useMemo(() => {
    if (!transactionTypeFromPath) return allProperties;
    return allProperties.filter(p => p.transactionType === transactionTypeFromPath);
  }, [transactionTypeFromPath, allProperties]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={pageTitle}
        description={`Browse ${pageTitle.toLowerCase()} across India. Find verified apartments, villas, plots, and commercial properties from trusted sellers on VenGrow.`}
      />
      <Header />
      
      {/* Filter Header with Selected Filters */}
      <ListingsFilterHeader />
      
      <main className="flex-1">
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
              {/* Header - Stacked on mobile, side-by-side on desktop */}
              <div className="space-y-4 sm:space-y-0">
                {/* Title Row - Always on its own line on mobile */}
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <h1 className="font-serif font-bold text-2xl sm:text-3xl" data-testid="heading-page-title">{pageTitle}</h1>
                    <p className="text-sm text-muted-foreground mt-1">
                      {filteredProperties.length} properties found
                    </p>
                  </div>

                  {/* Controls Row - Below title on mobile */}
                  <div className="flex items-center gap-2 sm:gap-3">
                    {/* View Type Toggle */}
                    <div className="hidden sm:flex border rounded-lg p-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${viewType === 'grid' ? 'bg-accent' : ''}`}
                        onClick={() => setViewType('grid')}
                        data-testid="button-view-grid"
                      >
                        <Grid3x3 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${viewType === 'list' ? 'bg-accent' : ''}`}
                        onClick={() => setViewType('list')}
                        data-testid="button-view-list"
                      >
                        <List className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className={`h-8 w-8 ${viewType === 'map' ? 'bg-accent' : ''}`}
                        onClick={() => setViewType('map')}
                        data-testid="button-view-map"
                      >
                        <Map className="h-4 w-4" />
                      </Button>
                    </div>

                    {/* Sort */}
                    <Select value={sortBy} onValueChange={setSortBy}>
                      <SelectTrigger className="w-32 sm:w-40" data-testid="select-sort">
                        <SelectValue placeholder="Sort by" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="newest">Newest First</SelectItem>
                        <SelectItem value="price-low">Price: Low to High</SelectItem>
                        <SelectItem value="price-high">Price: High to Low</SelectItem>
                        <SelectItem value="featured">Featured First</SelectItem>
                      </SelectContent>
                    </Select>

                    {/* Mobile Filter */}
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden" data-testid="button-mobile-filters">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80">
                        <div className="mt-8">
                          <FilterSidebar />
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              {/* Properties Display */}
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">Loading properties...</span>
                </div>
              ) : viewType === 'map' ? (
                <PropertyMapView 
                  properties={filteredProperties} 
                  className="h-[600px]" 
                />
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">No properties found matching your criteria.</p>
                </div>
              ) : (
                <>
                  <div className={
                    viewType === 'grid' 
                      ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6"
                      : "space-y-4"
                  }>
                    {filteredProperties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  <div className="flex justify-center pt-8">
                    <div className="flex gap-2">
                      <Button variant="outline" disabled>Previous</Button>
                      <Button variant="default">1</Button>
                      <Button variant="outline">2</Button>
                      <Button variant="outline">3</Button>
                      <Button variant="outline">Next</Button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
