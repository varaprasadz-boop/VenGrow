import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FilterSidebar from "@/components/FilterSidebar";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";
import ListingsFilterHeader from "@/components/ListingsFilterHeader";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapView from "@/components/PropertyMapView";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Filter, Grid3x3, List, Map, Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Property } from "@shared/schema";

interface FilterState {
  priceRange?: [number, number];
  transactionTypes?: string[];
  category?: string;
  subcategories?: string[];
  projectStages?: string[];
  bhk?: string[];
  sellerTypes?: string[];
  state?: string;
  city?: string;
  locality?: string;
  propertyAge?: string[];
  corporateSearch?: string;
}

export default function ListingsPage() {
  const [location] = useLocation();
  const [viewType, setViewType] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState<FilterState>({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  
  // Get selected city from LocationContext (header city selector)
  const locationContext = useLocationContext();
  const headerSelectedCity = locationContext?.selectedCity?.name || null;
  
  // Parse URL parameters
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    return {
      category: params.get('category') || params.get('type') || null,
      featured: params.get('featured') === 'true',
      sort: params.get('sort') || null,
    };
  }, [location]);
  
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
  
  // Initialize filters from URL on mount
  useEffect(() => {
    if (urlParams.category && !filters.category) {
      setFilters(prev => ({ ...prev, category: urlParams.category! }));
    }
    if (urlParams.featured && !filters.category) {
      // Featured is handled separately
    }
  }, [urlParams.category, urlParams.featured]);

  // Handle filter application
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
    setMobileFilterOpen(false);
  }, []);

  // Fetch real properties from the API
  const { data: propertiesData, isLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  // Transform API data for PropertyCard component
  const allProperties = useMemo(() => {
    if (!propertiesData) return [];
    return propertiesData.map(property => {
      // Extract first image URL from images array
      const imageUrl = (property as any).images?.length > 0
        ? (typeof (property as any).images[0] === 'string' 
            ? (property as any).images[0] 
            : (property as any).images[0]?.url)
        : '';
      
      return {
        id: property.id,
        title: property.title,
        price: property.price,
        location: `${property.locality || ''}, ${property.city || ''}`.replace(/^, |, $/g, '') || 'Location not specified',
        imageUrl: imageUrl, // Empty string will trigger placeholder in PropertyCard
        bedrooms: property.bedrooms || undefined,
        bathrooms: property.bathrooms || undefined,
        area: property.area || 0,
        propertyType: property.propertyType || "Property",
        isFeatured: property.isFeatured || false,
        isVerified: property.isVerified || false,
        sellerType: ((property as any).sellerType || "Builder") as "Individual" | "Broker" | "Builder",
        transactionType: (property.transactionType || "Sale") as "Sale" | "Lease" | "Rent",
        lat: property.latitude ? parseFloat(property.latitude) : 19.0596,
        lng: property.longitude ? parseFloat(property.longitude) : 72.8295,
        projectStage: property.projectStage || undefined,
        subcategory: property.subcategoryId || undefined,
        ageOfProperty: property.ageOfProperty ? String(property.ageOfProperty) : undefined,
        city: property.city,
        state: property.state,
        categoryId: property.categoryId,
      };
    });
  }, [propertiesData]);
  
  // Apply filters to properties
  const filteredProperties = useMemo(() => {
    let result = allProperties;
    
    // Featured filter from URL
    if (urlParams.featured) {
      result = result.filter(p => p.isFeatured === true);
    }
    
    // Category filter from URL or filters
    const categoryFilter = urlParams.category || filters.category;
    if (categoryFilter && categoryFilter !== "all") {
      // Filter by propertyType or categoryId
      result = result.filter(p => {
        const propertyTypeMatch = p.propertyType?.toLowerCase() === categoryFilter.toLowerCase();
        // You might also want to match by categoryId if available
        return propertyTypeMatch;
      });
    }
    
    // Transaction type from URL path
    if (transactionTypeFromPath) {
      result = result.filter(p => p.transactionType === transactionTypeFromPath);
    }
    
    // Transaction type from filters
    if (filters.transactionTypes && filters.transactionTypes.length > 0) {
      result = result.filter(p => filters.transactionTypes!.includes(p.transactionType));
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
    }
    
    // City filter - prioritize header city selection, fallback to sidebar filter
    const cityFilter = headerSelectedCity || filters.city;
    if (cityFilter && cityFilter !== "all") {
      result = result.filter(p => 
        p.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }
    
    // State filter
    if (filters.state && filters.state !== "all") {
      result = result.filter(p => 
        p.state?.toLowerCase() === filters.state?.toLowerCase()
      );
    }
    
    // BHK filter
    if (filters.bhk && filters.bhk.length > 0) {
      result = result.filter(p => {
        if (!p.bedrooms) return false;
        return filters.bhk!.some(bhk => {
          if (bhk === "5+") return p.bedrooms! >= 5;
          return p.bedrooms === parseInt(bhk);
        });
      });
    }
    
    // Seller type filter
    if (filters.sellerTypes && filters.sellerTypes.length > 0) {
      result = result.filter(p => 
        filters.sellerTypes!.includes(p.sellerType)
      );
    }
    
    // Project stage filter
    if (filters.projectStages && filters.projectStages.length > 0) {
      result = result.filter(p => 
        p.projectStage && filters.projectStages!.includes(p.projectStage)
      );
    }
    
    // Property age filter
    if (filters.propertyAge && filters.propertyAge.length > 0) {
      result = result.filter(p => {
        if (!p.ageOfProperty) return filters.propertyAge!.includes("new");
        const age = parseInt(p.ageOfProperty);
        if (isNaN(age)) return filters.propertyAge!.includes("new");
        if (age === 0) return filters.propertyAge!.includes("new");
        if (age >= 1 && age <= 5) return filters.propertyAge!.includes("1-5");
        if (age > 5) return filters.propertyAge!.includes("5+");
        return false;
      });
    }
    
    // Sort properties
    switch (sortBy) {
      case "price-low":
        result = [...result].sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        result = [...result].sort((a, b) => b.price - a.price);
        break;
      case "featured":
        result = [...result].sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0));
        break;
      case "newest":
      default:
        // Keep original order (newest first from API)
        break;
    }
    
    return result;
  }, [transactionTypeFromPath, allProperties, filters, sortBy, urlParams, headerSelectedCity]);

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
                <FilterSidebar onApplyFilters={handleApplyFilters} />
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
                    <Sheet open={mobileFilterOpen} onOpenChange={setMobileFilterOpen}>
                      <SheetTrigger asChild>
                        <Button variant="outline" className="lg:hidden" data-testid="button-mobile-filters">
                          <Filter className="h-4 w-4 mr-2" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 p-0 flex flex-col h-full">
                        <div className="p-4 border-b">
                          <h2 className="font-semibold text-lg">Filters</h2>
                        </div>
                        <ScrollArea className="flex-1">
                          <div className="p-4">
                            <FilterSidebar onApplyFilters={handleApplyFilters} />
                          </div>
                        </ScrollArea>
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
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => setFilters({})}
                  >
                    Clear Filters
                  </Button>
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
