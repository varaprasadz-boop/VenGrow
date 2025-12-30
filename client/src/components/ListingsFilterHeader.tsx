import { useMemo } from "react";
import { useLocation } from "wouter";
import { ChevronDown, X, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { useLocation as useLocationContext } from "@/contexts/LocationContext";

interface FilterChip {
  id: string;
  label: string;
  value: string;
  isRemovable?: boolean;
  hasDropdown?: boolean;
}

interface ListingsFilterHeaderProps {
  filters?: {
    priceRange?: [number, number];
    transactionTypes?: string[];
    category?: string;
    bhk?: string[];
    sellerTypes?: string[];
    city?: string;
    state?: string;
    locality?: string;
    propertyAge?: string[];
  };
  onFilterChange?: (filters: any) => void;
  onOpenFilters?: () => void;
}

export default function ListingsFilterHeader({ filters = {}, onFilterChange, onOpenFilters }: ListingsFilterHeaderProps) {
  const [location, setLocation] = useLocation();
  const locationContext = useLocationContext();
  const headerSelectedCity = locationContext?.selectedCity?.name || null;

  // Determine transaction type from URL path
  const transactionTypeFromPath = useMemo(() => {
    if (location === "/buy" || location.startsWith("/buy?")) return "Buy";
    if (location === "/lease" || location.startsWith("/lease?")) return "Lease";
    if (location === "/rent" || location.startsWith("/rent?")) return "Rent";
    return null;
  }, [location]);

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  // Build filter chips from actual filters
  const selectedFilters = useMemo<FilterChip[]>(() => {
    const chips: FilterChip[] = [];
    
    // Transaction type chip (always shown if on /buy, /lease, /rent)
    if (transactionTypeFromPath) {
      chips.push({
        id: "transaction",
        label: transactionTypeFromPath,
        value: transactionTypeFromPath,
        hasDropdown: true,
      });
    }
    
    // City chip
    const cityValue = headerSelectedCity || filters.city;
    if (cityValue && cityValue !== "all") {
      chips.push({
        id: "city",
        label: cityValue,
        value: cityValue,
        hasDropdown: true,
        isRemovable: true,
      });
    }
    
    // Locality chip
    if (filters.locality) {
      chips.push({
        id: "locality",
        label: filters.locality,
        value: filters.locality,
        isRemovable: true,
        hasDropdown: true,
      });
    }
    
    // Price range chip
    if (filters.priceRange) {
      const [min, max] = filters.priceRange;
      chips.push({
        id: "price",
        label: `${formatPrice(min)} - ${formatPrice(max)}`,
        value: `${min}-${max}`,
        isRemovable: true,
        hasDropdown: true,
      });
    }
    
    // Category chip
    if (filters.category && filters.category !== "all") {
      chips.push({
        id: "category",
        label: filters.category,
        value: filters.category,
        isRemovable: true,
        hasDropdown: true,
      });
    }
    
    // BHK chip
    if (filters.bhk && filters.bhk.length > 0) {
      const bhkLabel = filters.bhk.length === 1 
        ? filters.bhk[0] 
        : `${filters.bhk.slice(0, 2).join(", ")}${filters.bhk.length > 2 ? ` +${filters.bhk.length - 2}` : ""}`;
      chips.push({
        id: "bhk",
        label: bhkLabel,
        value: filters.bhk.join(","),
        isRemovable: true,
        hasDropdown: true,
      });
    }
    
    // Seller type chip
    if (filters.sellerTypes && filters.sellerTypes.length > 0) {
      chips.push({
        id: "seller",
        label: filters.sellerTypes[0],
        value: filters.sellerTypes.join(","),
        isRemovable: true,
      });
    }
    
    return chips;
  }, [filters, transactionTypeFromPath, headerSelectedCity]);

  const moreFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.propertyAge && filters.propertyAge.length > 0) count++;
    if (filters.state && filters.state !== "all") count++;
    // Add other filters that aren't shown as chips
    return count;
  }, [filters]);

  const handleClearFilter = (filterId: string) => {
    if (!onFilterChange) return;
    
    const newFilters = { ...filters };
    switch (filterId) {
      case "city":
        delete newFilters.city;
        break;
      case "locality":
        delete newFilters.locality;
        break;
      case "price":
        delete newFilters.priceRange;
        break;
      case "category":
        delete newFilters.category;
        break;
      case "bhk":
        delete newFilters.bhk;
        break;
      case "seller":
        delete newFilters.sellerTypes;
        break;
    }
    onFilterChange(newFilters);
  };

  const handleTransactionChange = (type: string) => {
    const basePath = type === "Buy" ? "/buy" : type === "Lease" ? "/lease" : "/rent";
    setLocation(basePath);
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Gurgaon"];
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

  return (
    <div className="bg-background border-b" data-testid="section-filter-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {selectedFilters.length === 0 && (
            <span className="text-sm text-muted-foreground">No filters applied</span>
          )}
          
          {selectedFilters.map((chip) => {
            if (chip.id === "transaction") {
              return (
                <Popover key={chip.id}>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="h-9 rounded-full bg-primary text-primary-foreground border-primary hover:bg-primary/90 flex-shrink-0 gap-1.5"
                      data-testid="chip-transaction"
                    >
                      {chip.label}
                      <ChevronDown className="h-3.5 w-3.5" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-48 p-2" align="start">
                    <div className="space-y-1">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start" 
                        onClick={() => handleTransactionChange("Buy")}
                        data-testid="option-buy"
                      >
                        Buy
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start" 
                        onClick={() => handleTransactionChange("Lease")}
                        data-testid="option-lease"
                      >
                        Lease
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="w-full justify-start" 
                        onClick={() => handleTransactionChange("Rent")}
                        data-testid="option-rent"
                      >
                        Rent
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }
            
            return (
              <Button
                key={chip.id}
                variant="secondary" 
                size="sm" 
                className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
                data-testid={`chip-${chip.id}`}
              >
                <span>{chip.label}</span>
                {chip.isRemovable && (
                  <span 
                    className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleClearFilter(chip.id);
                    }}
                    data-testid={`clear-${chip.id}`}
                  >
                    <X className="h-3.5 w-3.5" />
                  </span>
                )}
              </Button>
            );
          })}

          {/* Spacer */}
          <div className="flex-1" />

          {/* More Filters Button */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 rounded-full flex-shrink-0 gap-2"
                onClick={onOpenFilters}
                data-testid="button-more-filters"
              >
                <SlidersHorizontal className="h-4 w-4" />
                <span className="hidden sm:inline">More Filters</span>
                {moreFiltersCount > 0 && (
                  <Badge className="h-5 w-5 p-0 flex items-center justify-center text-xs rounded-full">
                    {moreFiltersCount}
                  </Badge>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-80 p-4" align="end">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Additional Filters</Label>
                  <Button variant="ghost" size="sm" className="text-xs h-7" data-testid="button-clear-more-filters">
                    Clear All
                  </Button>
                </div>
                
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-new" defaultChecked data-testid="checkbox-new-construction" />
                    <Label htmlFor="filter-new" className="text-sm cursor-pointer">New Construction</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-ready" defaultChecked data-testid="checkbox-ready-to-move" />
                    <Label htmlFor="filter-ready" className="text-sm cursor-pointer">Ready to Move</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-featured" data-testid="checkbox-featured" />
                    <Label htmlFor="filter-featured" className="text-sm cursor-pointer">Featured Properties</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="filter-photos" defaultChecked data-testid="checkbox-with-photos" />
                    <Label htmlFor="filter-photos" className="text-sm cursor-pointer">With Photos</Label>
                  </div>
                </div>

                <div className="pt-2 border-t">
                  <Label className="text-xs text-muted-foreground">Furnishing</Label>
                  <div className="flex flex-wrap gap-2 mt-2">
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" data-testid="btn-furnished">
                      Furnished
                    </Button>
                    <Button variant="secondary" size="sm" className="h-7 text-xs rounded-full" data-testid="btn-semi-furnished">
                      Semi-Furnished
                    </Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs rounded-full" data-testid="btn-unfurnished">
                      Unfurnished
                    </Button>
                  </div>
                </div>

                <Button className="w-full" size="sm" data-testid="button-apply-more-filters">
                  Apply Filters
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        </div>
      </div>
    </div>
  );
}
