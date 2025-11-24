import { useState } from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";

interface FilterSidebarProps {
  onApplyFilters?: (filters: any) => void;
}

export default function FilterSidebar({ onApplyFilters }: FilterSidebarProps) {
  const [priceRange, setPriceRange] = useState([0, 20000000]);
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [selectedBHK, setSelectedBHK] = useState<string[]>([]);
  const [selectedSeller, setSelectedSeller] = useState<string[]>([]);

  const handleTypeToggle = (type: string) => {
    setSelectedTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleBHKToggle = (bhk: string) => {
    setSelectedBHK(prev =>
      prev.includes(bhk) ? prev.filter(b => b !== bhk) : [...prev, bhk]
    );
  };

  const handleSellerToggle = (seller: string) => {
    setSelectedSeller(prev =>
      prev.includes(seller) ? prev.filter(s => s !== seller) : [...prev, seller]
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 20000000]);
    setSelectedTypes([]);
    setSelectedBHK([]);
    setSelectedSeller([]);
    console.log('Filters cleared');
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      propertyTypes: selectedTypes,
      bhk: selectedBHK,
      sellerTypes: selectedSeller,
    };
    onApplyFilters?.(filters);
    console.log('Filters applied:', filters);
  };

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const activeFiltersCount = selectedTypes.length + selectedBHK.length + selectedSeller.length;

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b">
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          <h2 className="font-semibold text-lg">Filters</h2>
          {activeFiltersCount > 0 && (
            <Badge variant="secondary">{activeFiltersCount}</Badge>
          )}
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={handleClearFilters}
          data-testid="button-clear-filters"
        >
          Clear All
        </Button>
      </div>

      {/* Filter Sections */}
      <Accordion type="multiple" defaultValue={["price", "type", "bhk", "seller"]} className="w-full">
        {/* Price Range */}
        <AccordionItem value="price">
          <AccordionTrigger>Price Range</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="px-2">
              <Slider
                value={priceRange}
                onValueChange={setPriceRange}
                min={0}
                max={20000000}
                step={100000}
                className="mb-4"
                data-testid="slider-price-range"
              />
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">{formatPrice(priceRange[0])}</span>
                <span className="text-muted-foreground">{formatPrice(priceRange[1])}</span>
              </div>
            </div>
            <Select defaultValue="all">
              <SelectTrigger data-testid="select-price-preset">
                <SelectValue placeholder="Quick select" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Prices</SelectItem>
                <SelectItem value="under50">Under ₹50 Lakhs</SelectItem>
                <SelectItem value="50to1cr">₹50L - ₹1 Cr</SelectItem>
                <SelectItem value="1to2cr">₹1 Cr - ₹2 Cr</SelectItem>
                <SelectItem value="above2cr">Above ₹2 Cr</SelectItem>
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {/* Property Type */}
        <AccordionItem value="type">
          <AccordionTrigger>Property Type</AccordionTrigger>
          <AccordionContent className="space-y-3">
            {["Apartment", "Villa", "Plot/Land", "Commercial"].map((type) => (
              <div key={type} className="flex items-center space-x-2">
                <Checkbox
                  id={`type-${type}`}
                  checked={selectedTypes.includes(type)}
                  onCheckedChange={() => handleTypeToggle(type)}
                  data-testid={`checkbox-type-${type.toLowerCase()}`}
                />
                <Label
                  htmlFor={`type-${type}`}
                  className="flex-1 cursor-pointer text-sm font-normal"
                >
                  {type}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* BHK Configuration */}
        <AccordionItem value="bhk">
          <AccordionTrigger>BHK</AccordionTrigger>
          <AccordionContent className="space-y-3">
            {["1 BHK", "2 BHK", "3 BHK", "4+ BHK"].map((bhk) => (
              <div key={bhk} className="flex items-center space-x-2">
                <Checkbox
                  id={`bhk-${bhk}`}
                  checked={selectedBHK.includes(bhk)}
                  onCheckedChange={() => handleBHKToggle(bhk)}
                  data-testid={`checkbox-bhk-${bhk.replace(/\s/g, '-').toLowerCase()}`}
                />
                <Label
                  htmlFor={`bhk-${bhk}`}
                  className="flex-1 cursor-pointer text-sm font-normal"
                >
                  {bhk}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Seller Type */}
        <AccordionItem value="seller">
          <AccordionTrigger>Seller Type</AccordionTrigger>
          <AccordionContent className="space-y-3">
            {["Individual", "Broker", "Builder"].map((seller) => (
              <div key={seller} className="flex items-center space-x-2">
                <Checkbox
                  id={`seller-${seller}`}
                  checked={selectedSeller.includes(seller)}
                  onCheckedChange={() => handleSellerToggle(seller)}
                  data-testid={`checkbox-seller-${seller.toLowerCase()}`}
                />
                <Label
                  htmlFor={`seller-${seller}`}
                  className="flex-1 cursor-pointer text-sm font-normal"
                >
                  {seller}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      {/* Apply Button */}
      <Button className="w-full" onClick={handleApply} data-testid="button-apply-filters">
        Apply Filters
      </Button>
    </div>
  );
}
