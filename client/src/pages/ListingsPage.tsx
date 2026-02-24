import { useState, useMemo, useCallback, useEffect } from "react";
import { useLocation, useSearch, useSearchParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import FilterSidebar from "@/components/FilterSidebar";
import ListingsFilterHeader from "@/components/ListingsFilterHeader";
import PropertyCard from "@/components/PropertyCard";
import PropertyMapView from "@/components/PropertyMapView";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Filter, Grid3x3, List, Map, Loader2, Bookmark, PanelLeftClose } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { Property } from "@shared/schema";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface FilterState {
  priceRange?: [number, number];
  transactionTypes?: string[];
  category?: string;
  subcategories?: string[];
  projectStages?: string[];
  bhk?: string[];
  sellerTypes?: string[];
  propertyAge?: string[];
  corporateSearch?: string;
  locality?: string;
  dynamicFilters?: Record<string, string | string[]>;
}

export default function ListingsPage() {
  const [location, setLocation] = useLocation();
  const searchString = useSearch();
  const [, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const itemsPerPage = 20;
  const { toast } = useToast();

  // Favorites: fetch with 401 → [] so we don't block on auth state
  const { data: favoritesList = [] } = useQuery<Property[]>({
    queryKey: ["/api/me/favorites"],
    queryFn: async () => {
      const res = await fetch("/api/me/favorites", { credentials: "include" });
      if (res.status === 401) return [];
      if (!res.ok) throw new Error("Failed to fetch favorites");
      return res.json();
    },
    retry: false,
  });
  const favoriteIds = useMemo(() => new Set((favoritesList || []).map((p) => p.id)), [favoritesList]);

  const toggleFavoriteMutation = useMutation({
    mutationFn: async ({ propertyId, isFav }: { propertyId: string; isFav: boolean }) => {
      if (isFav) {
        await apiRequest("DELETE", "/api/me/favorites", { propertyId });
      } else {
        await apiRequest("POST", "/api/me/favorites", { propertyId });
      }
    },
    onSuccess: (_, { propertyId, isFav }) => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/favorites"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/dashboard"] });
      toast({
        title: isFav ? "Removed from favorites" : "Added to favorites",
      });
    },
    onError: (error: Error) => {
      const isUnauthorized = error?.message?.includes("401") || error?.message?.toLowerCase().includes("unauthorized");
      toast({
        title: isUnauthorized ? "Please log in" : "Failed to update favorites",
        description: isUnauthorized ? "You need to be logged in to save favorites." : (error?.message || "Please try again."),
        variant: "destructive",
      });
    },
  });

  const handleFavoriteClick = useCallback((propertyId: string) => {
    const isFav = favoriteIds.has(propertyId);
    toggleFavoriteMutation.mutate({ propertyId, isFav });
  }, [favoriteIds, toggleFavoriteMutation]);

  // Parse URL parameters from search string (useSearch may return with or without leading "?")
  const urlParams = useMemo(() => {
    const raw = typeof searchString === "string" ? searchString : "";
    const params = new URLSearchParams(raw.startsWith("?") ? raw.slice(1) : raw);
    const parsedFilters: FilterState = {};
    
    if (params.get('category')) parsedFilters.category = params.get('category')!;
    if (params.get('type') && !parsedFilters.category) parsedFilters.category = params.get('type')!;
    if (params.get('minPrice') != null && params.get('maxPrice') != null) {
      const min = parseInt(params.get('minPrice')!, 10);
      const max = parseInt(params.get('maxPrice')!, 10);
      if (!Number.isNaN(min) && !Number.isNaN(max)) {
        parsedFilters.priceRange = [min, max];
      }
    }
    if (params.get('bhk')) {
      parsedFilters.bhk = params.get('bhk')!.split(',').filter(Boolean);
    }
    if (params.get('transactionTypes')) {
      parsedFilters.transactionTypes = params.get('transactionTypes')!.split(',').filter(Boolean);
    }
    if (params.get('sellerTypes')) {
      parsedFilters.sellerTypes = params.get('sellerTypes')!.split(',').filter(Boolean);
    }
    if (params.get('propertyAge')) {
      parsedFilters.propertyAge = params.get('propertyAge')!.split(',').filter(Boolean);
    }
    if (params.get('subcategories')) {
      parsedFilters.subcategories = params.get('subcategories')!.split(',').filter(Boolean);
    }
    if (params.get('projectStages')) {
      parsedFilters.projectStages = params.get('projectStages')!.split(',').filter(Boolean);
    }
    if (params.get('builder') || params.get('corporate')) {
      parsedFilters.corporateSearch = params.get('builder') || params.get('corporate') || undefined;
    }
    if (params.get('locality')) {
      parsedFilters.locality = params.get('locality')!;
    }
    if (params.get('dynamicFilters')) {
      try {
        parsedFilters.dynamicFilters = JSON.parse(params.get('dynamicFilters')!);
      } catch {}
    }
    
    return {
      category: params.get('category') || params.get('type') || null,
      featured: params.get('featured') === 'true',
      sort: params.get('sort') || null,
      page: parseInt(params.get('page') || '1', 10) || 1,
      sellerId: params.get('sellerId') || null,
      filters: parsedFilters,
    };
  }, [location, searchString]);

  // Single source of truth: derive filters, page, sort from URL so Apply Filter and URL stay in sync
  const filters = useMemo<FilterState>(() => ({
    ...urlParams.filters,
    ...(urlParams.category && { category: urlParams.category }),
  }), [urlParams]);
  const currentPage = urlParams.page;
  const sortBy = urlParams.sort || "newest";

  const [viewType, setViewType] = useState<"grid" | "list" | "map">("grid");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [filterSidebarOpen, setFilterSidebarOpen] = useState(false); // desktop filter sidebar - default hidden for larger view
  const [isApplyingFilters, setIsApplyingFilters] = useState(false);
  const [saveSearchOpen, setSaveSearchOpen] = useState(false);
  const [searchName, setSearchName] = useState("");
  
  // Same page is used for /listings, /buy, /lease, /rent (buyer routes). Path sets default transaction type.
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
  
  // Update URL with filters/page/sort using wouter's setSearchParams so URL and router stay in sync
  const updateURL = useCallback((newFilters: FilterState, newPage: number = 1, newSort?: string) => {
    const params = new URLSearchParams();
    
    if (newFilters.category && newFilters.category !== "all") {
      params.set('category', newFilters.category);
    }
    if (newFilters.priceRange && (newFilters.priceRange[0] > 0 || newFilters.priceRange[1] < 200 * 100000)) {
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
    if (newFilters.subcategories && newFilters.subcategories.length > 0) {
      params.set('subcategories', newFilters.subcategories.join(','));
    }
    if (newFilters.projectStages && newFilters.projectStages.length > 0) {
      params.set('projectStages', newFilters.projectStages.join(','));
    }
    if (newFilters.corporateSearch && newFilters.corporateSearch?.trim()) {
      params.set('builder', newFilters.corporateSearch.trim());
    }
    if (newFilters.locality && newFilters.locality.trim()) {
      params.set('locality', newFilters.locality.trim());
    }
    if (newFilters.dynamicFilters && Object.keys(newFilters.dynamicFilters).length > 0) {
      params.set('dynamicFilters', JSON.stringify(newFilters.dynamicFilters));
    }
    if (newPage > 1) {
      params.set('page', newPage.toString());
    }
    const sortVal = newSort ?? urlParams.sort ?? "newest";
    if (sortVal && sortVal !== "newest") {
      params.set('sort', sortVal);
    }
    if (urlParams.sellerId) {
      params.set('sellerId', urlParams.sellerId);
    }
    if (urlParams.featured) {
      params.set('featured', 'true');
    }
    
    setSearchParams(params);
  }, [urlParams.sort, urlParams.sellerId, urlParams.featured, setSearchParams]);

  // Handle filter application - update URL only; filters are derived from URL on next render
  const handleApplyFilters = useCallback((newFilters: FilterState) => {
    setIsApplyingFilters(true);
    updateURL(newFilters, 1);
    setMobileFilterOpen(false);
    setTimeout(() => setIsApplyingFilters(false), 300);
    // Record search history for logged-in users
    if (user) {
      const recordFilters: Record<string, unknown> = {};
      if (newFilters.category && newFilters.category !== "all") recordFilters.category = newFilters.category;
      if (newFilters.priceRange) {
        recordFilters.minPrice = newFilters.priceRange[0];
        recordFilters.maxPrice = newFilters.priceRange[1];
      }
      if (transactionTypeFromPath) recordFilters.transactionType = transactionTypeFromPath.toLowerCase();
      else if (newFilters.transactionTypes?.length) recordFilters.transactionType = newFilters.transactionTypes[0] === "buy" ? "sale" : newFilters.transactionTypes[0];
      if (newFilters.bhk?.length) recordFilters.bhk = newFilters.bhk[0];
      if (Object.keys(recordFilters).length > 0) {
        apiRequest("POST", "/api/me/search-history", { filters: recordFilters }).catch(() => {});
      }
    }
  }, [updateURL, user, transactionTypeFromPath]);

  // Save search mutation (uses current applied filters)
  const saveSearchMutation = useMutation({
    mutationFn: async () => {
      const payload: Record<string, unknown> = {
        minPrice: filters.priceRange?.[0],
        maxPrice: filters.priceRange?.[1],
        transactionTypes: transactionTypeFromPath ? [transactionTypeFromPath.toLowerCase()] : filters.transactionTypes,
        category: filters.category && filters.category !== "all" ? filters.category : undefined,
        subcategories: filters.subcategories?.length ? filters.subcategories : undefined,
        projectStages: filters.projectStages?.length ? filters.projectStages : undefined,
        bedrooms: filters.bhk?.length ? filters.bhk.map(b => b.replace(" BHK", "").replace("+", "")) : undefined,
        sellerTypes: filters.sellerTypes?.length ? filters.sellerTypes : undefined,
        propertyAge: filters.propertyAge?.length ? filters.propertyAge : undefined,
        builder: filters.corporateSearch || undefined,
      };
      Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);
      return apiRequest("POST", "/api/saved-searches", {
        userId: user?.id,
        name: searchName,
        filters: payload,
      });
    },
    onSuccess: () => {
      toast({ title: "Search saved successfully!" });
      setSaveSearchOpen(false);
      setSearchName("");
      queryClient.invalidateQueries({ queryKey: ["/api/me/saved-searches"] });
    },
    onError: () => {
      toast({ title: "Failed to save search", variant: "destructive" });
    },
  });

  const handleSaveSearch = () => {
    if (!searchName.trim()) {
      toast({ title: "Please enter a name for your search", variant: "destructive" });
      return;
    }
    saveSearchMutation.mutate();
  };

  const generateSearchName = () => {
    const parts: string[] = [];
    if (filters.category && filters.category !== "all") parts.push(filters.category);
    if (filters.bhk && filters.bhk.length > 0) parts.push(`${filters.bhk.join("/")} BHK`);
    const tx = transactionTypeFromPath || filters.transactionTypes?.[0];
    if (tx) parts.push(tx);
    return parts.length > 0 ? parts.join(" - ") : "My Search";
  };

  // Build API query parameters from filters
  const apiQueryParams = useMemo(() => {
    const params: Record<string, string> = {
      limit: itemsPerPage.toString(),
      offset: ((currentPage - 1) * itemsPerPage).toString(),
    };
    
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
    if (filters.projectStages && filters.projectStages.length > 0) {
      params.projectStage = filters.projectStages.join(",");
    }
    if (urlParams.featured) {
      params.isFeatured = "true";
    }
    if (transactionTypeFromPath) {
      params.transactionType = transactionTypeFromPath.toLowerCase();
    }
    if (urlParams.sellerId) {
      params.sellerId = urlParams.sellerId;
    }
    
    return params;
  }, [filters, currentPage, urlParams.featured, urlParams.sellerId, transactionTypeFromPath]);

  // Fetch real properties from the API with filters (searchString in key ensures refetch when URL params change)
  const { data: propertiesData, isLoading, error, refetch } = useQuery<Property[]>({
    queryKey: ["/api/properties", apiQueryParams, searchString],
    queryFn: async () => {
      const queryString = new URLSearchParams(apiQueryParams).toString();
      const response = await fetch(`/api/properties?${queryString}`, { credentials: "include" });
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
        areaUnit: (property as { areaUnit?: string }).areaUnit,
        propertyType: property.propertyType || "Property",
        isFeatured: property.isFeatured || false,
        isVerified: property.isVerified || false,
        sellerType: ((property as any).sellerType || "Builder") as "Individual" | "Broker" | "Builder",
        transactionType: (() => {
          const t = (property.transactionType || "sale").toString().toLowerCase();
          if (t === "sale") return "Sale" as const;
          if (t === "rent") return "Rent" as const;
          if (t === "lease") return "Lease" as const;
          return "Sale" as const;
        })(),
        lat: property.latitude ? parseFloat(property.latitude) : 19.0596,
        lng: property.longitude ? parseFloat(property.longitude) : 72.8295,
        projectStage: property.projectStage || undefined,
        subcategory: property.subcategoryId || undefined,
        ageOfProperty: property.ageOfProperty ? String(property.ageOfProperty) : undefined,
        city: property.city,
        state: property.state,
        categoryId: property.categoryId,
        slug: (property as any).slug || undefined,
        addedDate: (property as any).approvedAt || property.createdAt,
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
    
    // Category filter from URL or filters (normalize slug to match DB propertyType: apartments->apartment, etc.)
    const categoryFilter = urlParams.category || filters.category;
    if (categoryFilter && categoryFilter !== "all") {
      const slugNorm = categoryFilter.toLowerCase().replace(/s$/, "") || categoryFilter.toLowerCase();
      result = result.filter(p => {
        const pt = (p.propertyType || "").toLowerCase();
        return pt === categoryFilter.toLowerCase() || pt === slugNorm || (categoryFilter.toLowerCase().endsWith("s") && pt === categoryFilter.toLowerCase().slice(0, -1));
      });
    }
    
    // Transaction type from URL path (comparison is case-insensitive for robustness)
    if (transactionTypeFromPath) {
      const pathNorm = transactionTypeFromPath.toLowerCase();
      result = result.filter(p => (p.transactionType || "").toLowerCase() === pathNorm);
    }
    
    // Transaction type from filters
    if (filters.transactionTypes && filters.transactionTypes.length > 0) {
      result = result.filter(p => {
        const pNorm = (p.transactionType || "").toLowerCase();
        return filters.transactionTypes!.some(f => f.toLowerCase() === pNorm);
      });
    }
    
    // Price range filter
    if (filters.priceRange) {
      const [minPrice, maxPrice] = filters.priceRange;
      result = result.filter(p => p.price >= minPrice && p.price <= maxPrice);
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
    
    // Locality filter
    if (filters.locality && filters.locality.trim()) {
      const localityTerm = filters.locality.trim().toLowerCase();
      result = result.filter(p => {
        const loc = ((p as any).locality || "").toLowerCase();
        const area = ((p as any).areaInLocality || "").toLowerCase();
        const city = (p.city || "").toLowerCase();
        return loc.includes(localityTerm) || area.includes(localityTerm) || city.includes(localityTerm);
      });
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
    
    if (filters.dynamicFilters && Object.keys(filters.dynamicFilters).length > 0) {
      result = result.filter(p => {
        const customData = (p as any).property_custom_data?.formData || (p as any).customFormData || {};
        for (const [key, filterVal] of Object.entries(filters.dynamicFilters!)) {
          if (!filterVal || (Array.isArray(filterVal) && filterVal.length === 0)) continue;

          if (key.endsWith('_min')) {
            const baseKey = key.replace(/_min$/, '');
            const propVal = parseFloat(customData[baseKey]);
            const minVal = parseFloat(filterVal as string);
            if (!isNaN(minVal) && (isNaN(propVal) || propVal < minVal)) return false;
          } else if (key.endsWith('_max')) {
            const baseKey = key.replace(/_max$/, '');
            const propVal = parseFloat(customData[baseKey]);
            const maxVal = parseFloat(filterVal as string);
            if (!isNaN(maxVal) && (isNaN(propVal) || propVal > maxVal)) return false;
          } else if (Array.isArray(filterVal)) {
            const propVal = customData[key];
            if (Array.isArray(propVal)) {
              if (!filterVal.some(fv => propVal.includes(fv))) return false;
            } else {
              if (!filterVal.includes(String(propVal || ''))) return false;
            }
          } else {
            const propVal = String(customData[key] || '').toLowerCase();
            if (typeof filterVal === 'string' && !propVal.includes(filterVal.toLowerCase())) return false;
          }
        }
        return true;
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
  }, [transactionTypeFromPath, allProperties, filters, sortBy, urlParams]);

  // Calculate pagination
  const totalPages = Math.ceil(filteredProperties.length / itemsPerPage);
  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    return filteredProperties.slice(start, end);
  }, [filteredProperties, currentPage]);

  const handlePageChange = (page: number) => {
    updateURL(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSortChange = (newSort: string) => {
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
          updateURL(newFilters, 1);
        }}
        onOpenFilters={() => setMobileFilterOpen(true)}
      />
      
      <main className="flex-1 flex flex-col min-h-0">
        <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 flex-1 min-h-0 lg:h-[calc(100vh-8.5rem)] lg:max-h-[calc(100vh-8.5rem)] lg:overflow-hidden">
          {/* Desktop Filter Sidebar - toggleable for larger view */}
          {filterSidebarOpen && (
            <aside className="hidden lg:flex lg:flex-col w-64 flex-shrink-0 min-h-0 overflow-hidden pr-2">
              <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                <FilterSidebar 
                  onApplyFilters={handleApplyFilters}
                  initialCategory={filters.category}
                  initialFilters={filters}
                />
              </div>
            </aside>
          )}

          {/* Main Content - scrolls separately on desktop */}
          <div className="flex-1 min-w-0 min-h-0 lg:overflow-y-auto flex flex-col space-y-6">
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
                    {/* Desktop: Toggle filter sidebar for larger view */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="hidden lg:flex"
                      onClick={() => setFilterSidebarOpen((o) => !o)}
                      data-testid="button-toggle-filter-sidebar"
                      title={filterSidebarOpen ? "Hide filters" : "Show filters"}
                    >
                      {filterSidebarOpen ? (
                        <PanelLeftClose className="h-4 w-4 mr-2" />
                      ) : (
                        <Filter className="h-4 w-4 mr-2" />
                      )}
                      {filterSidebarOpen ? "Hide filters" : "Filters"}
                    </Button>
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

                    {/* Save Search - in header next to sort and view */}
                    {user ? (
                      <Dialog open={saveSearchOpen} onOpenChange={setSaveSearchOpen}>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            className="hidden sm:flex"
                            onClick={() => setSearchName(generateSearchName())}
                            data-testid="button-save-search"
                          >
                            <Bookmark className="h-4 w-4 mr-2" />
                            Save Search
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Save this search</DialogTitle>
                            <DialogDescription>
                              Give your search a name to easily find it later. You'll receive alerts when new properties match your criteria.
                            </DialogDescription>
                          </DialogHeader>
                          <div className="py-4">
                            <Label htmlFor="search-name">Search Name</Label>
                            <Input
                              id="search-name"
                              value={searchName}
                              onChange={(e) => setSearchName(e.target.value)}
                              placeholder="e.g., 3BHK in Mumbai"
                              className="mt-2"
                              data-testid="input-search-name"
                            />
                          </div>
                          <DialogFooter>
                            <Button variant="outline" onClick={() => setSaveSearchOpen(false)}>
                              Cancel
                            </Button>
                            <Button
                              onClick={handleSaveSearch}
                              disabled={saveSearchMutation.isPending}
                              data-testid="button-confirm-save-search"
                            >
                              {saveSearchMutation.isPending ? (
                                <>
                                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                  Saving...
                                </>
                              ) : (
                                "Save Search"
                              )}
                            </Button>
                          </DialogFooter>
                        </DialogContent>
                      </Dialog>
                    ) : (
                      <Button
                        variant="outline"
                        size="sm"
                        className="hidden sm:flex"
                        onClick={() => {
                          toast({
                            title: "Please login to save searches",
                            description: "You'll be redirected to the login page",
                          });
                          window.location.href = "/login?redirect=" + encodeURIComponent(window.location.pathname + window.location.search);
                        }}
                        data-testid="button-save-search-guest"
                      >
                        <Bookmark className="h-4 w-4 mr-2" />
                        Save Search
                      </Button>
                    )}

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
                        <div className="flex-1 min-h-0 flex flex-col overflow-hidden">
                          <div className="p-4">
                            <FilterSidebar 
                              onApplyFilters={handleApplyFilters}
                              initialCategory={filters.category}
                              initialFilters={filters}
                            />
                          </div>
                        </div>
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
                    onClick={() => refetch()}
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
                    onClick={() => updateURL({}, 1)}
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
                      <PropertyCard
                        key={property.id}
                        {...property}
                        variant={viewType === "list" ? "list" : "grid"}
                        isLoggedIn={!!user}
                        isFavorited={favoriteIds.has(property.id)}
                        onFavoriteClick={handleFavoriteClick}
                      />
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
      </main>

      <Footer />
    </div>
  );
}