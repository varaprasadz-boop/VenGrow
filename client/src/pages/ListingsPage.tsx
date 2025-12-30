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
  const [location, setLocation] = useLocation();
  const [viewType, setViewType] = useState<"grid" | "list" | "map">("grid");
  const [sortBy, setSortBy] = useState("newest");
  const [filters, setFilters] = useState<FilterState>({});
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const itemsPerPage = 20;
  
  // Get selected city from LocationContext (header city selector)
  const locationContext = useLocationContext();
  const headerSelectedCity = locationContext?.selectedCity?.name || null;
  
  // Parse URL parameters
  const urlParams = useMemo(() => {
    const params = new URLSearchParams(location.split('?')[1] || '');
    const parsedFilters: FilterState = {};
    
    // Parse filters from URL
    if (params.get('category')) parsedFilters.category = params.get('category')!;
    if (params.get('city')) parsedFilters.city = params.get('city')!;
    if (params.get('state')) parsedFilters.state = params.get('state')!;
    if (params.get('locality')) parsedFilters.locality = params.get('locality')!;
    if (params.get('minPrice') && params.get('maxPrice')) {
      parsedFilters.priceRange = [
        parseInt(params.get('minPrice')!),
        parseInt(params.get('maxPrice')!)
      ];
    }
    if (params.get('bhk')) {
      parsedFilters.bhk = params.get('bhk')!.split(',');
    }
    if (params.get('transactionTypes')) {
      parsedFilters.transactionTypes = params.get('transactionTypes')!.split(',');
    }
    if (params.get('sellerTypes')) {
      parsedFilters.sellerTypes = params.get('sellerTypes')!.split(',');
    }
    if (params.get('propertyAge')) {
      parsedFilters.propertyAge = params.get('propertyAge')!.split(',');
    }
    
    return {
      category: params.get('category') || params.get('type') || null,
      featured: params.get('featured') === 'true',
      sort: params.get('sort') || null,
      page: parseInt(params.get('page') || '1'),
      filters: parsedFilters,
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
  
  // Initialize filters and page from URL on mount
  useEffect(() => {
    if (Object.keys(urlParams.filters).length > 0) {
      setFilters(urlParams.filters);
    }
    if (urlParams.category && !filters.category) {
      setFilters(prev => ({ ...prev, category: urlParams.category! }));
    }
    if (urlParams.sort) {
      setSortBy(urlParams.sort);
    }
    if (urlParams.page) {
      setCurrentPage(urlParams.page);
    }
  }, [location]); // Only run when location changes

  // Update URL with current filters and page
  const updateURL = useCallback((newFilters: FilterState, newPage: number = 1, newSort?: string) => {
    const params = new URLSearchParams();
    
    if (newFilters.category && newFilters.category !== "all") {
      params.set('category', newFilters.category);
    }
    if (newFilters.city && newFilters.city !== "all") {
      params.set('city', newFilters.city);
    }
    if (newFilters.state && newFilters.state !== "all") {
      params.set('state', newFilters.state);
    }
    if (newFilters.locality) {
      params.set('locality', newFilters.locality);
    }
    if (newFilters.priceRange) {
      params.set('minPrice', newFilters.priceRange[0].toString());
      params.set('maxPrice', newFilters.priceRange[1].toString());
    }
    if (newFilters.bhk && newFilters.bhk.length > 0) {
      params.set('bhk', newFilters.bhk.join(','));
    }
    if (newFilters.transactionTypes && newFilters.transactionTypes.length > 0) {
      params.set('transactionTypes', newFilters.transactionTypes.join(','));
    }
    if (newFilters.sellerTypes && newFilters.sellerTypes.length > 0) {
      params.set('sellerTypes', newFilters.sellerTypes.join(','));
    }
    if (newFilters.propertyAge && newFilters.propertyAge.length > 0) {
      params.set('propertyAge', newFilters.propertyAge.join(','));
    }
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }
    if (newSort) {
      params.set('sort', newSort);
    } else if (sortBy !== "newest") {
      params.set('sort', sortBy);
    }
    
    const basePath = location.split('?')[0];
    const queryString = params.toString();
    const newPath = queryString ? `${basePath}?${queryString}` : basePath;
    setLocation(newPath);
  }, [location, sortBy, setLocation]);

  // Handle filter application
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setIsApplyingFilters(true);
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    updateURL(newFilters, 1);
    setMobileFilterOpen(false);
    setTimeout(() => setIsApplyingFilters(false), 300);
  }, [updateURL]);

  // Build API query parameters from filters
  const apiQueryParams = useMemo(() => {
    const params: Record<string, string> = {
      limit: itemsPerPage.toString(),
      offset: ((currentPage - 1) * itemsPerPage).toString(),
    };
    
    if (filters.city && filters.city !== "all") {
      params.city = filters.city;
    }
    if (filters.state && filters.state !== "all") {
      params.state = filters.state;
    }
    if (filters.priceRange) {
      params.minPrice = filters.priceRange[0].toString();
      params.maxPrice = filters.priceRange[1].toString();
    }
    if (filters.bhk && filters.bhk.length > 0) {
      // Convert "1 BHK" format to "1" format for API
      const bhkValues = filters.bhk.map(bhk => {
        if (bhk === "4+ BHK") return "5+";
        return bhk.replace(" BHK", "");
      });
      params.bedrooms = bhkValues.join(',');
    }
    if (filters.transactionTypes && filters.transactionTypes.length > 0) {
      // Map "buy" to "sale", "rent" to "rent", "lease" to "lease"
      const mappedTypes = filters.transactionTypes.map(t => {
        if (t === "buy") return "sale";
        return t;
      });
      params.transactionType = mappedTypes.join(',');
    }
    if (filters.sellerTypes && filters.sellerTypes.length > 0) {
      // Map "Corporate" to "builder"
      const mappedTypes = filters.sellerTypes.map(t => {
        if (t === "Corporate") return "builder";
        return t.toLowerCase();
      });
      params.sellerType = mappedTypes.join(',');
    }
    if (filters.category && filters.category !== "all") {
      params.propertyType = filters.category;
    }
    if (urlParams.featured) {
      params.isFeatured = "true";
    }
    if (transactionTypeFromPath) {
      params.transactionType = transactionTypeFromPath.toLowerCase();
    }
    
    return params;
  }, [filters, currentPage, urlParams.featured, transactionTypeFromPath]);

  // Fetch real properties from the API with filters
  const { data: propertiesData, isLoading, error } = useQuery<Property[]>({
    queryKey: ["/api/properties", apiQueryParams],
    queryFn: async () => {
      const queryString = new URLSearchParams(apiQueryParams).toString();
      const response = await fetch(`/api/properties?${queryString}`);
      if (!response.ok) {
        throw new Error("Failed to fetch properties");
      }
      return response.json();
    },
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
    
    // BHK filter - handle both "1 BHK" and "1" formats
    if (filters.bhk && filters.bhk.length > 0) {
      result = result.filter(p => {
        if (!p.bedrooms) return false;
        return filters.bhk!.some(bhk => {
          // Handle "1 BHK", "2 BHK", "3 BHK", "4+ BHK" format
          const bhkNum = bhk.replace(" BHK", "").replace("+", "");
          if (bhk.includes("+") || bhk === "5+") {
            return p.bedrooms! >= parseInt(bhkNum);
          }
          return p.bedrooms === parseInt(bhkNum);
        });
      });
    }
    
    // Seller type filter - map "Corporate" to "Builder"
    if (filters.sellerTypes && filters.sellerTypes.length > 0) {
      result = result.filter(p => {
        const normalizedSellerType = p.sellerType === "Builder" ? "Corporate" : p.sellerType;
        return filters.sellerTypes!.includes(normalizedSellerType) || 
               filters.sellerTypes!.includes(p.sellerType);
      });
    }
    
    // Project stage filter
    if (filters.projectStages && filters.projectStages.length > 0) {
      result = result.filter(p => 
        p.projectStage && filters.projectStages!.includes(p.projectStage)
      );
    }
    
    // Property age filter - improved logic
    if (filters.propertyAge && filters.propertyAge.length > 0) {
      result = result.filter(p => {
        // If property has no ageOfProperty, it's likely new construction
        if (!p.ageOfProperty || p.ageOfProperty === "" || p.ageOfProperty === "0") {
          return filters.propertyAge!.includes("new");
        }
        
        const age = parseInt(String(p.ageOfProperty));
        if (isNaN(age) || age === 0) {
          return filters.propertyAge!.includes("new");
        }
        
        // Check if property matches any selected age range
        if (filters.propertyAge!.includes("new") && age === 0) return true;
        if (filters.propertyAge!.includes("1-5") && age >= 1 && age <= 5) return true;
        if (filters.propertyAge!.includes("5+") && age > 5) return true;
        
        return false;
      });
    }
    
    // Sort properties (if not already sorted by API)
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

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    updateURL(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    updateURL(filters, currentPage, newSort);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <SEO 
        title={pageTitle}
        description={`Browse ${pageTitle.toLowerCase()} across India. Find verified apartments, villas, plots, and commercial properties from trusted sellers on VenGrow.`}
      />
      <Header />
      
      {/* Filter Header with Selected Filters */}
      <ListingsFilterHeader 
        filters={filters}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
          setCurrentPage(1);
          updateURL(newFilters, 1);
        }}
        onOpenFilters={() => setMobileFilterOpen(true)}
      />
      
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Desktop Sidebar */}
            <aside className="hidden lg:block w-64 flex-shrink-0">
              <div className="sticky top-24">
                <FilterSidebar 
                  onApplyFilters={handleApplyFilters}
                  initialCategory={filters.category}
                  initialFilters={filters}
                />
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
                    <Select value={sortBy} onValueChange={handleSortChange}>
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
                          {Object.keys(filters).length > 0 && (
                            <Badge variant="secondary" className="ml-2 h-5 px-1.5 text-xs">
                              {Object.keys(filters).filter(k => {
                                const val = filters[k as keyof FilterState];
                                if (Array.isArray(val)) return val.length > 0;
                                if (typeof val === 'object' && val !== null) return true;
                                return val && val !== "all" && val !== "";
                              }).length}
                            </Badge>
                          )}
                        </Button>
                      </SheetTrigger>
                      <SheetContent side="left" className="w-80 p-0 flex flex-col h-full">
                        <div className="p-4 border-b">
                          <h2 className="font-semibold text-lg">Filters</h2>
                          {Object.keys(filters).length > 0 && (
                            <p className="text-xs text-muted-foreground mt-1">
                              {Object.keys(filters).filter(k => {
                                const val = filters[k as keyof FilterState];
                                if (Array.isArray(val)) return val.length > 0;
                                if (typeof val === 'object' && val !== null) return true;
                                return val && val !== "all" && val !== "";
                              }).length} filter(s) applied
                            </p>
                          )}
                        </div>
                        <ScrollArea className="flex-1">
                          <div className="p-4">
                            <FilterSidebar 
                              onApplyFilters={handleApplyFilters}
                              initialCategory={filters.category}
                              initialFilters={filters}
                            />
                          </div>
                        </ScrollArea>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </div>

              {/* Properties Display */}
              {(isLoading || isApplyingFilters) ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2 text-muted-foreground">
                    {isApplyingFilters ? "Applying filters..." : "Loading properties..."}
                  </span>
                </div>
              ) : error ? (
                <div className="text-center py-12">
                  <p className="text-destructive mb-4">Failed to load properties. Please try again.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                  >
                    Retry
                  </Button>
                </div>
              ) : viewType === 'map' ? (
                <PropertyMapView 
                  properties={filteredProperties} 
                  className="h-[600px]" 
                />
              ) : filteredProperties.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">No properties found matching your criteria.</p>
                  <Button 
                    variant="outline" 
                    onClick={() => {
                      setFilters({});
                      setCurrentPage(1);
                      updateURL({}, 1);
                    }}
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
                    {paginatedProperties.map((property) => (
                      <PropertyCard key={property.id} {...property} />
                    ))}
                  </div>

                  {/* Pagination */}
                  {totalPages > 1 && (
                    <div className="flex justify-center pt-8">
                      <div className="flex gap-2">
                        <Button 
                          variant="outline" 
                          disabled={currentPage === 1}
                          onClick={() => handlePageChange(currentPage - 1)}
                          data-testid="button-pagination-prev"
                        >
                          Previous
                        </Button>
                        {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                          let pageNum;
                          if (totalPages <= 5) {
                            pageNum = i + 1;
                          } else if (currentPage <= 3) {
                            pageNum = i + 1;
                          } else if (currentPage >= totalPages - 2) {
                            pageNum = totalPages - 4 + i;
                          } else {
                            pageNum = currentPage - 2 + i;
                          }
                          return (
                            <Button
                              key={pageNum}
                              variant={currentPage === pageNum ? "default" : "outline"}
                              onClick={() => handlePageChange(pageNum)}
                              data-testid={`button-pagination-${pageNum}`}
                            >
                              {pageNum}
                            </Button>
                          );
                        })}
                        <Button 
                          variant="outline" 
                          disabled={currentPage === totalPages}
                          onClick={() => handlePageChange(currentPage + 1)}
                          data-testid="button-pagination-next"
                        >
                          Next
                        </Button>
                      </div>
                    </div>
                  )}
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
