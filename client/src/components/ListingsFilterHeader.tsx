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

interface FilterChip {
  id: string;
  label: string;
  value: string;
  isRemovable?: boolean;
  hasDropdown?: boolean;
}

interface ListingsFilterHeaderProps {
  onOpenFilters?: () => void;
}

export default function ListingsFilterHeader({ onOpenFilters }: ListingsFilterHeaderProps) {
  const selectedFilters: FilterChip[] = [
    { id: "transaction", label: "Buy", value: "Buy", hasDropdown: true },
    { id: "city", label: "Mumbai", value: "Mumbai", hasDropdown: true },
    { id: "locality", label: "Bandra, Andheri +2", value: "Bandra, Andheri +2", isRemovable: true, hasDropdown: true },
    { id: "price", label: "₹50L - ₹2Cr", value: "₹50L - ₹2Cr", isRemovable: true, hasDropdown: true },
    { id: "type", label: "Apartment +1", value: "Apartment +1", isRemovable: true, hasDropdown: true },
    { id: "bhk", label: "2, 3 BHK", value: "2, 3 BHK", isRemovable: true, hasDropdown: true },
    { id: "seller", label: "Corporate", value: "Corporate", isRemovable: true },
  ];

  const moreFiltersCount = 4;

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(0)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const cities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", "Pune", "Gurgaon"];
  const localities = ["Bandra", "Andheri", "Powai", "Worli", "Juhu", "Goregaon"];
  const propertyTypes = ["Apartment", "Villa", "Plot/Land", "Commercial"];
  const bhkOptions = ["1 BHK", "2 BHK", "3 BHK", "4+ BHK"];

  return (
    <div className="bg-background border-b" data-testid="section-filter-header">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-3 flex items-center gap-2 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {/* Transaction Type Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 rounded-full bg-primary text-primary-foreground border-primary hover:bg-primary/90 flex-shrink-0 gap-1.5"
                data-testid="chip-transaction"
              >
                Buy
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-2" align="start">
              <div className="space-y-1">
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="option-buy">
                  Buy
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="option-rent">
                  Rent
                </Button>
                <Button variant="ghost" size="sm" className="w-full justify-start" data-testid="option-pg">
                  PG/Co-living
                </Button>
              </div>
            </PopoverContent>
          </Popover>

          {/* City Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="outline" 
                size="sm" 
                className="h-9 rounded-full bg-primary text-primary-foreground border-primary hover:bg-primary/90 flex-shrink-0 gap-1.5"
                data-testid="chip-city"
              >
                Mumbai
                <ChevronDown className="h-3.5 w-3.5" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">Select City</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {cities.map((city) => (
                    <div key={city} className="flex items-center space-x-2">
                      <Checkbox id={`city-${city}`} defaultChecked={city === "Mumbai"} data-testid={`checkbox-city-${city.toLowerCase()}`} />
                      <Label htmlFor={`city-${city}`} className="text-sm cursor-pointer">{city}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Divider */}
          <div className="h-6 w-px bg-border flex-shrink-0" />

          {/* Locality Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
                data-testid="chip-locality"
              >
                <span>Localities</span>
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">3</Badge>
                <ChevronDown className="h-3.5 w-3.5" />
                <span 
                  className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); console.log('Clear localities'); }}
                  data-testid="clear-locality"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-3" align="start">
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">Select Localities in Mumbai</Label>
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {localities.map((locality) => (
                    <div key={locality} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`locality-${locality}`} 
                        defaultChecked={["Bandra", "Andheri", "Powai"].includes(locality)} 
                        data-testid={`checkbox-locality-${locality.toLowerCase()}`}
                      />
                      <Label htmlFor={`locality-${locality}`} className="text-sm cursor-pointer">{locality}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Price Range Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
                data-testid="chip-price"
              >
                ₹50L - ₹2Cr
                <ChevronDown className="h-3.5 w-3.5" />
                <span 
                  className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); console.log('Clear price'); }}
                  data-testid="clear-price"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-72 p-4" align="start">
              <div className="space-y-4">
                <Label className="text-xs font-medium text-muted-foreground">Price Range</Label>
                <Slider
                  defaultValue={[5000000, 20000000]}
                  min={0}
                  max={50000000}
                  step={500000}
                  className="w-full"
                  data-testid="slider-header-price"
                />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>{formatPrice(5000000)}</span>
                  <span>{formatPrice(20000000)}</span>
                </div>
                <div className="flex gap-2">
                  <Select defaultValue="50l">
                    <SelectTrigger className="h-8 text-xs" data-testid="select-min-price">
                      <SelectValue placeholder="Min" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Min</SelectItem>
                      <SelectItem value="25l">₹25 L</SelectItem>
                      <SelectItem value="50l">₹50 L</SelectItem>
                      <SelectItem value="1cr">₹1 Cr</SelectItem>
                    </SelectContent>
                  </Select>
                  <span className="text-muted-foreground self-center">to</span>
                  <Select defaultValue="2cr">
                    <SelectTrigger className="h-8 text-xs" data-testid="select-max-price">
                      <SelectValue placeholder="Max" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1cr">₹1 Cr</SelectItem>
                      <SelectItem value="2cr">₹2 Cr</SelectItem>
                      <SelectItem value="5cr">₹5 Cr</SelectItem>
                      <SelectItem value="none">No Max</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Property Type Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
                data-testid="chip-property-type"
              >
                <span>Property Type</span>
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">2</Badge>
                <ChevronDown className="h-3.5 w-3.5" />
                <span 
                  className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); console.log('Clear type'); }}
                  data-testid="clear-property-type"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="start">
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">Property Type</Label>
                <div className="space-y-2">
                  {propertyTypes.map((type) => (
                    <div key={type} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`type-${type}`} 
                        defaultChecked={["Apartment", "Villa"].includes(type)}
                        data-testid={`checkbox-type-${type.toLowerCase().replace('/', '-')}`}
                      />
                      <Label htmlFor={`type-${type}`} className="text-sm cursor-pointer">{type}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* BHK Chip */}
          <Popover>
            <PopoverTrigger asChild>
              <Button 
                variant="secondary" 
                size="sm" 
                className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
                data-testid="chip-bhk"
              >
                <span>BHK</span>
                <Badge variant="secondary" className="ml-1 h-5 px-1.5 text-xs bg-primary/10 text-primary">2</Badge>
                <ChevronDown className="h-3.5 w-3.5" />
                <span 
                  className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
                  onClick={(e) => { e.stopPropagation(); console.log('Clear bhk'); }}
                  data-testid="clear-bhk"
                >
                  <X className="h-3.5 w-3.5" />
                </span>
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-48 p-3" align="start">
              <div className="space-y-3">
                <Label className="text-xs font-medium text-muted-foreground">BHK Configuration</Label>
                <div className="space-y-2">
                  {bhkOptions.map((bhk) => (
                    <div key={bhk} className="flex items-center space-x-2">
                      <Checkbox 
                        id={`header-bhk-${bhk}`} 
                        defaultChecked={["2 BHK", "3 BHK"].includes(bhk)}
                        data-testid={`checkbox-header-bhk-${bhk.replace(/\s/g, '-').toLowerCase()}`}
                      />
                      <Label htmlFor={`header-bhk-${bhk}`} className="text-sm cursor-pointer">{bhk}</Label>
                    </div>
                  ))}
                </div>
              </div>
            </PopoverContent>
          </Popover>

          {/* Seller Type Chip (simple, no dropdown) */}
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
            data-testid="chip-seller"
          >
            Corporate
            <span 
              className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); console.log('Clear seller'); }}
              data-testid="clear-seller"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          </Button>

          {/* Verified Only Chip */}
          <Button 
            variant="secondary" 
            size="sm" 
            className="h-9 rounded-full flex-shrink-0 gap-1.5 pr-2"
            data-testid="chip-verified"
          >
            Verified Only
            <span 
              className="ml-0.5 p-0.5 rounded-full hover:bg-muted-foreground/20 cursor-pointer"
              onClick={(e) => { e.stopPropagation(); console.log('Clear verified'); }}
              data-testid="clear-verified"
            >
              <X className="h-3.5 w-3.5" />
            </span>
          </Button>

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
