import { useState, useMemo, useEffect, useCallback, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation as useWouterLocation } from "wouter";
import { Filter, X, Search, Calendar, Building2, Layers, Milestone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
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
import type { PropertyCategory, PropertySubcategory } from "@shared/schema";

interface FilterSidebarProps {
  onApplyFilters?: (filters: any) => void;
  initialCategory?: string;
  initialFilters?: {
    priceRange?: [number, number];
    transactionTypes?: string[];
    category?: string;
    subcategories?: string[];
    projectStages?: string[];
    bhk?: string[];
    sellerTypes?: string[];
    propertyAge?: string[];
    corporateSearch?: string;
  };
}

const projectStages = [
  { value: "pre_launch", label: "Pre-launch" },
  { value: "launch", label: "Launch" },
  { value: "under_construction", label: "Under Construction" },
  { value: "ready_to_move", label: "Ready to Move" },
];

const PRICE_MAX_LACS = 200; // 2 Cr
const lacsToRupees = (lacs: number) => Math.round(lacs * 100000);
const rupeesToLacs = (rupees: number) => rupees / 100000;

export default function FilterSidebar({ onApplyFilters, initialCategory, initialFilters }: FilterSidebarProps) {
  const [wouterLocation] = useWouterLocation();
  
  // Read category directly from URL as fallback - use window.location to get query string
  const categoryFromURL = useMemo(() => {
    // wouterLocation only gives pathname, so use window.location.search for query params
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const category = params.get('category') || params.get('type') || null;
    return category;
  }, [wouterLocation]);
  
  const [priceRange, setPriceRange] = useState<[number, number]>(
    initialFilters?.priceRange || [0, lacsToRupees(PRICE_MAX_LACS)]
  );
  const [selectedTransactionTypes, setSelectedTransactionTypes] = useState<string[]>(
    initialFilters?.transactionTypes || []
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(() => {
    // Use lazy initialization to ensure categoryFromURL is computed
    // Use window.location.search to get query string since wouterLocation doesn't include it
    const params = new URLSearchParams(typeof window !== 'undefined' ? window.location.search : '');
    const urlCategory = params.get('category') || params.get('type') || null;
    return urlCategory || initialCategory || initialFilters?.category || "all";
  });
  const [selectedSubcategories, setSelectedSubcategories] = useState<string[]>(
    initialFilters?.subcategories || []
  );
  const [selectedProjectStages, setSelectedProjectStages] = useState<string[]>(
    initialFilters?.projectStages || []
  );
  const [selectedBHK, setSelectedBHK] = useState<string[]>(
    initialFilters?.bhk || []
  );
  const [selectedSeller, setSelectedSeller] = useState<string[]>(
    initialFilters?.sellerTypes || []
  );
  const [selectedPropertyAge, setSelectedPropertyAge] = useState<string[]>(
    initialFilters?.propertyAge || []
  );
  const [corporateSearch, setCorporateSearch] = useState<string>("");
  const [accordionValue, setAccordionValue] = useState<string[]>(["category", "subcategory", "projectStage", "transaction", "price", "seller"]);
  
  // Fetch categories - must be declared before useEffects that use it
  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  // Memoize the category from URL for sync - we only sync when URL actually changes, not when user selects a different category in the dropdown
  const categoryFromURLOrProps = useMemo(() => {
    return categoryFromURL || initialFilters?.category || initialCategory || null;
  }, [categoryFromURL, initialCategory, initialFilters?.category]);

  // Track last URL category we synced from - so we only sync when URL/props changed (e.g. Apply or navigation), not when user changes dropdown
  const lastSyncedUrlCategoryRef = useRef<string | null>(null);

  // Sync selectedCategory from URL only when the URL category actually changed. Normalize slug so Select value matches an option (e.g. "apartments" -> "apartment").
  useEffect(() => {
    const urlCategory = categoryFromURLOrProps;
    const effectiveUrlCategory = urlCategory || "all";
    if (effectiveUrlCategory === lastSyncedUrlCategoryRef.current) return;
    lastSyncedUrlCategoryRef.current = effectiveUrlCategory;

    if (effectiveUrlCategory === "all") {
      setSelectedCategory("all");
      return;
    }
    let valueToSet = effectiveUrlCategory;
    if (categories.length > 0) {
      const exact = categories.find(c => c.slug === effectiveUrlCategory);
      const withoutS = categories.find(c => c.slug === effectiveUrlCategory.replace(/s$/, ""));
      const withS = categories.find(c => c.slug + "s" === effectiveUrlCategory);
      if (exact) valueToSet = exact.slug;
      else if (withoutS) valueToSet = withoutS.slug;
      else if (withS) valueToSet = withS.slug;
      else valueToSet = categories.some(c => c.slug === effectiveUrlCategory) ? effectiveUrlCategory : "all";
    }
    setSelectedCategory(valueToSet);
    setSelectedSubcategories([]);
    if (valueToSet !== "all") {
      setAccordionValue(prev => {
        const newValue = [...prev];
        if (!newValue.includes("category")) newValue.push("category");
        if (!newValue.includes("subcategory")) newValue.push("subcategory");
        return newValue;
      });
    }
  }, [categoryFromURLOrProps, categories]);

  // When categories first load, if we have a URL category that wasn't synced yet (e.g. categories were empty on first run), sync once
  const hasSyncedCategoriesRef = useRef(false);
  useEffect(() => {
    if (categories.length === 0) return;
    if (hasSyncedCategoriesRef.current) return;
    const urlCategory = categoryFromURLOrProps;
    if (!urlCategory || urlCategory === "all") {
      hasSyncedCategoriesRef.current = true;
      return;
    }
    const exact = categories.find(c => c.slug === urlCategory);
    const withoutS = categories.find(c => c.slug === urlCategory.replace(/s$/, ""));
    const withS = categories.find(c => c.slug + "s" === urlCategory);
    const valueToSet = exact ? exact.slug : withoutS ? withoutS.slug : withS ? withS.slug : "all";
    setSelectedCategory(valueToSet);
    setSelectedSubcategories([]);
    hasSyncedCategoriesRef.current = true;
  }, [categories, categoryFromURLOrProps]);

  // On popstate (browser back/forward), update ref so next effect run will see URL change
  useEffect(() => {
    const handlePopState = () => {
      const params = new URLSearchParams(window.location.search);
      const urlCategory = params.get('category') || params.get('type') || null;
      lastSyncedUrlCategoryRef.current = null;
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Get category ID from slug for subcategories query
  const selectedCategoryId = useMemo(() => {
    if (selectedCategory === "all") return null;
    const category = categories.find(c => c.slug === selectedCategory);
    return category?.id || null;
  }, [categories, selectedCategory]);

  const { data: subcategories = [] } = useQuery<PropertySubcategory[]>({
    queryKey: ["/api/property-subcategories", selectedCategoryId],
    queryFn: async () => {
      const url = selectedCategoryId 
        ? `/api/property-subcategories?categoryId=${selectedCategoryId}`
        : "/api/property-subcategories";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch subcategories");
      return res.json();
    },
    enabled: selectedCategory !== "all" && !!selectedCategoryId,
  });

  const selectedCategoryObj = useMemo(() => {
    return categories.find(c => c.slug === selectedCategory);
  }, [categories, selectedCategory]);

  const filteredSubcategories = useMemo(() => {
    if (selectedCategory === "all") return [];
    const category = categories.find(c => c.slug === selectedCategory);
    if (!category) return [];
    return subcategories.filter(sub => sub.categoryId === category.id);
  }, [subcategories, categories, selectedCategory]);

  const handleSubcategoryToggle = (slug: string) => {
    setSelectedSubcategories(prev =>
      prev.includes(slug) ? prev.filter(s => s !== slug) : [...prev, slug]
    );
  };

  const handleProjectStageToggle = (stage: string) => {
    setSelectedProjectStages(prev =>
      prev.includes(stage) ? prev.filter(s => s !== stage) : [...prev, stage]
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

  const handleTransactionTypeToggle = (type: string) => {
    setSelectedTransactionTypes(prev =>
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleCategoryChange = (value: string) => {
    setSelectedCategory(value);
    setSelectedSubcategories([]);
    setSelectedProjectStages([]);
    // Open subcategory accordion if category is selected
    if (value !== "all") {
      setAccordionValue(prev => {
        if (!prev.includes("subcategory")) {
          return [...prev, "subcategory"];
        }
        return prev;
      });
    }
  };

  const handleClearFilters = () => {
    if (window.confirm("Are you sure you want to clear all filters?")) {
      const defaultMaxRupees = lacsToRupees(PRICE_MAX_LACS);
      setPriceRange([0, defaultMaxRupees]);
      setSelectedTransactionTypes([]);
      setSelectedCategory("all");
      setSelectedSubcategories([]);
      setSelectedProjectStages([]);
      setSelectedBHK([]);
      setSelectedSeller([]);
      setSelectedPropertyAge([]);
      setCorporateSearch("");
      
      // Apply cleared filters
      const clearedFilters = {
        priceRange: [0, defaultMaxRupees],
        transactionTypes: [],
        category: "all",
        subcategories: [],
        projectStages: [],
        bhk: [],
        sellerTypes: [],
        propertyAge: [],
        corporateSearch: "",
      };
      onApplyFilters?.(clearedFilters);
    }
  };

  const handleApply = () => {
    const filters = {
      priceRange,
      transactionTypes: selectedTransactionTypes,
      category: selectedCategory,
      subcategories: selectedSubcategories,
      projectStages: selectedProjectStages,
      bhk: selectedBHK,
      sellerTypes: selectedSeller,
      propertyAge: selectedPropertyAge,
      corporateSearch,
    };
    onApplyFilters?.(filters);
    console.log('Filters applied:', filters);
  };

  const corporateBuilders = [
    "Prestige Group", "Godrej Properties", "DLF Limited", "Lodha Group",
    "Sobha Limited", "Brigade Group", "Puravankara", "Mahindra Lifespace"
  ];

  const filteredCorporates = corporateBuilders.filter(corp => 
    corp.toLowerCase().includes(corporateSearch.toLowerCase())
  );

  const formatPrice = (value: number) => {
    if (value >= 10000000) return `${(value / 10000000).toFixed(1)} Cr`;
    if (value >= 100000) return `${(value / 100000).toFixed(1)} L`;
    return `${value.toLocaleString('en-IN')}`;
  };

  // Calculate active filters count in real-time
  const activeFiltersCount = useMemo(() => {
    const defaultMaxRupees = lacsToRupees(PRICE_MAX_LACS);
    return selectedTransactionTypes.length + 
      (selectedCategory !== "all" ? 1 : 0) + 
      selectedSubcategories.length +
      selectedProjectStages.length +
      selectedBHK.length + 
      selectedSeller.length + 
      selectedPropertyAge.length + 
      (corporateSearch ? 1 : 0) +
      (priceRange[0] !== 0 || priceRange[1] !== defaultMaxRupees ? 1 : 0);
  }, [
    selectedTransactionTypes,
    selectedCategory,
    selectedSubcategories,
    selectedProjectStages,
    selectedBHK,
    selectedSeller,
    selectedPropertyAge,
    corporateSearch,
    priceRange,
  ]);

  return (
    <div className="w-full space-y-4">
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

      <Accordion type="multiple" value={accordionValue} onValueChange={setAccordionValue} className="w-full">
        <AccordionItem value="category">
          <AccordionTrigger>
            <div className="flex items-center gap-2">
              <Layers className="h-4 w-4" />
              Property Category
            </div>
          </AccordionTrigger>
          <AccordionContent className="space-y-3">
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger data-testid="select-category">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((category) => (
                  <SelectItem key={category.id} value={category.slug}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </AccordionContent>
        </AccordionItem>

        {selectedCategory !== "all" && filteredSubcategories.length > 0 && (
          <AccordionItem value="subcategory">
            <AccordionTrigger>Subcategory</AccordionTrigger>
            <AccordionContent className="space-y-3 max-h-48 overflow-y-auto">
              {filteredSubcategories.map((sub) => (
                <div key={sub.id} className="flex items-center space-x-2">
                  <Checkbox
                    id={`subcategory-${sub.slug}`}
                    checked={selectedSubcategories.includes(sub.slug)}
                    onCheckedChange={() => handleSubcategoryToggle(sub.slug)}
                    data-testid={`checkbox-subcategory-${sub.slug}`}
                  />
                  <Label
                    htmlFor={`subcategory-${sub.slug}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {sub.name}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        {selectedCategoryObj?.hasProjectStage && (
          <AccordionItem value="projectStage">
            <AccordionTrigger>
              <div className="flex items-center gap-2">
                <Milestone className="h-4 w-4" />
                Project Stage
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-3">
              {projectStages.map((stage) => (
                <div key={stage.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={`stage-${stage.value}`}
                    checked={selectedProjectStages.includes(stage.value)}
                    onCheckedChange={() => handleProjectStageToggle(stage.value)}
                    data-testid={`checkbox-stage-${stage.value}`}
                  />
                  <Label
                    htmlFor={`stage-${stage.value}`}
                    className="flex-1 cursor-pointer text-sm font-normal"
                  >
                    {stage.label}
                  </Label>
                </div>
              ))}
            </AccordionContent>
          </AccordionItem>
        )}

        <AccordionItem value="transaction">
          <AccordionTrigger>Transaction Type</AccordionTrigger>
          <AccordionContent className="space-y-3">
            {[
              { id: "buy", label: "Buy" },
              { id: "lease", label: "Lease" },
              { id: "rent", label: "Rent" },
            ].map((type) => (
              <div key={type.id} className="flex items-center space-x-2">
                <Checkbox
                  id={`transaction-${type.id}`}
                  checked={selectedTransactionTypes.includes(type.id)}
                  onCheckedChange={() => handleTransactionTypeToggle(type.id)}
                  data-testid={`checkbox-transaction-${type.id}`}
                />
                <Label
                  htmlFor={`transaction-${type.id}`}
                  className="flex-1 cursor-pointer text-sm font-normal"
                >
                  {type.label}
                </Label>
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="price">
          <AccordionTrigger>Price Range (Lacs)</AccordionTrigger>
          <AccordionContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="price-from" className="text-muted-foreground">From</Label>
                <Input
                  id="price-from"
                  type="number"
                  min={0}
                  max={PRICE_MAX_LACS}
                  step={0.5}
                  placeholder="0"
                  value={priceRange[0] === 0 ? "" : rupeesToLacs(priceRange[0])}
                  onChange={(e) => {
                    const v = e.target.value === "" ? 0 : parseFloat(e.target.value) || 0;
                    const lacs = Math.max(0, Math.min(PRICE_MAX_LACS, v));
                    const rupees = lacsToRupees(lacs);
                    setPriceRange(([, max]) => [rupees, rupees > max ? rupees : max]);
                  }}
                  data-testid="input-price-from-lacs"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price-to" className="text-muted-foreground">To</Label>
                <Input
                  id="price-to"
                  type="number"
                  min={0}
                  max={PRICE_MAX_LACS}
                  step={0.5}
                  placeholder={String(PRICE_MAX_LACS)}
                  value={priceRange[1] === lacsToRupees(PRICE_MAX_LACS) ? "" : rupeesToLacs(priceRange[1])}
                  onChange={(e) => {
                    const v = e.target.value === "" ? PRICE_MAX_LACS : parseFloat(e.target.value) || PRICE_MAX_LACS;
                    const lacs = Math.max(0, Math.min(PRICE_MAX_LACS, v));
                    const rupees = lacsToRupees(lacs);
                    setPriceRange(([min]) => [min, rupees < min ? min : rupees]);
                  }}
                  data-testid="input-price-to-lacs"
                />
              </div>
            </div>
            <p className="text-xs text-muted-foreground">Enter price in lacs (e.g. 50 = ₹50 L)</p>
          </AccordionContent>
        </AccordionItem>

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

      <div className="space-y-2">
        <Button className="w-full" onClick={handleApply} data-testid="button-apply-filters">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}
