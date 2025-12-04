import { useState } from "react";
import { Filter, X, Search, MapPin, Calendar, Building2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
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
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedLocality, setSelectedLocality] = useState<string>("all");
  const [selectedPropertyAge, setSelectedPropertyAge] = useState<string[]>([]);
  const [corporateSearch, setCorporateSearch] = useState<string>("");

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

  const handlePropertyAgeToggle = (age: string) => {
    setSelectedPropertyAge(prev =>
      prev.includes(age) ? prev.filter(a => a !== age) : [...prev, age]
    );
  };

  const handleClearFilters = () => {
    setPriceRange([0, 20000000]);
    setSelectedTypes([]);
    setSelectedBHK([]);
    setSelectedSeller([]);
    setSelectedCity("all");
    setSelectedLocality("all");
    setSelectedPropertyAge([]);
    setCorporateSearch("");
    console.log('Filters cleared');
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      propertyTypes: selectedTypes,
      bhk: selectedBHK,
      sellerTypes: selectedSeller,
      city: selectedCity,
      locality: selectedLocality,
      propertyAge: selectedPropertyAge,
      corporateSearch,
    };
    onApplyFilters?.(filters);
    console.log('Filters applied:', filters);
  };

  const cities = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai", 
    "Kolkata", "Pune", "Ahmedabad", "Gurgaon", "Noida"
  ];

  const localities: Record<string, string[]> = {
    Mumbai: ["Bandra", "Andheri", "Powai", "Worli", "Juhu", "Goregaon"],
    Bangalore: ["Koramangala", "Whitefield", "HSR Layout", "Indiranagar", "Electronic City"],
    Delhi: ["Connaught Place", "Dwarka", "Rohini", "Saket", "Vasant Kunj"],
    Pune: ["Koregaon Park", "Baner", "Hinjewadi", "Kharadi", "Wakad"],
    Gurgaon: ["DLF Phase 1", "Sector 56", "Golf Course Road", "Sohna Road"],
  };

  const corporateBuilders = [
    "Prestige Group", "Godrej Properties", "DLF Limited", "Lodha Group",
    "Sobha Limited", "Brigade Group", "Puravankara", "Mahindra Lifespace"
  ];

  const filteredCorporates = corporateBuilders.filter(corp => 
    corp.toLowerCase().includes(corporateSearch.toLowerCase())
  );

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `₹${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `₹${(value / 100000).toFixed(1)} L`;
    return `₹${value.toLocaleString('en-IN')}`;
  };

  const activeFiltersCount = selectedTypes.length + selectedBHK.length + selectedSeller.length + 
    selectedPropertyAge.length + (selectedCity !== "all" ? 1 : 0) + (corporateSearch ? 1 : 0);

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
      <Accordion type="multiple" defaultValue={["location", "price", "type", "seller", "age"]} className="w-full">
        {/* Location Filter */}
        <AccordionItem value="location">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="space-y-2">
              <Label className="text-xs text-muted-foreground">City</Label>
              <Select value={selectedCity} onValueChange={(value) => {
                setSelectedCity(value);
                setSelectedLocality("all");
              }}>
                <SelectTrigger data-testid="select-city">
                  <SelectValue placeholder="Select city" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>{city}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            {selectedCity !== "all" && localities[selectedCity] && (
              <div className="space-y-2">
                <Label className="text-xs text-muted-foreground">Locality</Label>
                <Select value={selectedLocality} onValueChange={setSelectedLocality}>
                  <SelectTrigger data-testid="select-locality">
                    <SelectValue placeholder="Select locality" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Localities</SelectItem>
                    {localities[selectedCity].map((locality) => (
                      <SelectItem key={locality} value={locality}>{locality}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </AccordionContent>
        </AccordionItem>

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
            {["Individual", "Broker", "Corporate"].map((seller) => (
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

        {/* Property Age */}
        <AccordionItem value="age">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Property Age
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            {[
              { id: "new", label: "New Construction", desc: "Under construction / Ready to move" },
              { id: "1-5", label: "1-5 Years", desc: "Relatively new" },
              { id: "5+", label: "5+ Years", desc: "Resale properties" },
            ].map((age) => (
              <div key={age.id} className="flex items-start space-x-2">
                <Checkbox
                  id={`age-${age.id}`}
                  checked={selectedPropertyAge.includes(age.id)}
                  onCheckedChange={() => handlePropertyAgeToggle(age.id)}
                  data-testid={`checkbox-age-${age.id}`}
                />
                <div className="grid gap-0.5 leading-none">
                  <Label htmlFor={`age-${age.id}`} className="text-sm cursor-pointer">
                    {age.label}
                  </Label>
                  <span className="text-xs text-muted-foreground">{age.desc}</span>
                </div>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        {/* Corporate/Builder Search */}
        <AccordionItem value="corporate">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Building2 className="h-4 w-4" />
              Builder/Developer
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search builders..."
                value={corporateSearch}
                onChange={(e) => setCorporateSearch(e.target.value)}
                className="pl-8"
                data-testid="input-corporate-search"
              />
            </div>
            {corporateSearch && (
              <div className="max-h-32 overflow-y-auto space-y-1">
                {filteredCorporates.length > 0 ? (
                  filteredCorporates.map((corp) => (
                    <Button
                      key={corp}
                      variant="ghost"
                      size="sm"
                      className="w-full justify-start text-sm"
                      onClick={() => setCorporateSearch(corp)}
                      data-testid={`option-corporate-${corp.toLowerCase().replace(/\s+/g, '-')}`}
                    >
                      <Building2 className="h-3 w-3 mr-2" />
                      {corp}
                    </Button>
                  ))
                ) : (
                  <p className="text-xs text-muted-foreground py-2 text-center">
                    No builders found
                  </p>
                )}
              </div>
            )}
            <p className="text-xs text-muted-foreground">
              Search for verified builders and developers
            </p>
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
