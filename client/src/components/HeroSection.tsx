import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search, MapPin, Home, IndianRupee, Building2, Building, Map, House, Crown, Briefcase, Handshake, Users, Trees, Zap, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyCategory } from "@shared/schema";

interface HeroSectionProps {
  onSearch?: (params: { location: string; propertyType: string; transactionType: string; budget: string }) => void;
}

const iconMap: Record<string, typeof Building2> = {
  Building2,
  Home,
  Map,
  House,
  Building,
  Crown,
  Briefcase,
  Handshake,
  Users,
  Trees,
  Zap,
};

const budgetRanges = [
  { value: "all", label: "Budget" },
  { value: "under-25l", label: "Under ₹25 Lac" },
  { value: "25l-50l", label: "₹25-50 Lac" },
  { value: "50l-1cr", label: "₹50 Lac - 1 Cr" },
  { value: "1cr-2cr", label: "₹1-2 Cr" },
  { value: "2cr-5cr", label: "₹2-5 Cr" },
  { value: "above-5cr", label: "Above ₹5 Cr" },
];

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("buy");
  const [budget, setBudget] = useState("all");

  const { data: categories = [], isLoading: categoriesLoading } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const handleSearch = () => {
    onSearch?.({ location, propertyType, transactionType, budget });
  };

  const propertyTypes = [
    { value: "all", label: "All Types" },
    ...categories.map(cat => ({ value: cat.slug, label: cat.name })),
  ];

  return (
    <div className="w-full bg-background py-12 md:py-16" data-testid="section-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 
            className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3"
            data-testid="text-hero-title"
          >
            <span className="italic text-primary">Simplified Property Searching</span>
          </h1>
          <p 
            className="text-muted-foreground text-base sm:text-lg"
            data-testid="text-hero-subtitle"
          >
            Find the perfect property that matches your needs from our diverse collection
          </p>
        </div>

        {categoriesLoading ? (
          <div className="flex items-center justify-center mb-10 py-8">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : (
          <div className="grid grid-cols-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 mb-10">
            {categories.slice(0, 11).map((category) => {
              const IconComponent = iconMap[category.icon || "Building2"] || Building2;
              return (
                <Link 
                  key={category.id} 
                  href={`/listings?category=${category.slug}`}
                  className="block"
                >
                  <div 
                    className="bg-card border rounded-lg p-3 sm:p-4 text-center hover-elevate active-elevate-2 cursor-pointer transition-all"
                    data-testid={`card-category-${category.slug}`}
                  >
                    <div className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2 sm:mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                      <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                    </div>
                    <h3 className="font-medium text-xs sm:text-sm text-foreground line-clamp-1">{category.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1 hidden sm:block">{category.description?.slice(0, 20) || "View properties"}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center gap-6 mb-4">
            <button
              className={`text-sm font-medium transition-colors ${
                transactionType === "buy"
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setTransactionType("buy")}
              data-testid="tab-buy"
            >
              Buy
            </button>
            <button
              className={`text-sm font-medium transition-colors ${
                transactionType === "lease"
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setTransactionType("lease")}
              data-testid="tab-lease"
            >
              Lease
            </button>
            <button
              className={`text-sm font-medium transition-colors ${
                transactionType === "rent"
                  ? "text-primary border-b-2 border-primary pb-1"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              onClick={() => setTransactionType("rent")}
              data-testid="tab-rent"
            >
              Rent
            </button>
            <Link href="/login" data-testid="link-post-free-property">
              <span className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
                Post Property <span className="text-primary font-bold">FREE</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center bg-card border rounded-full shadow-sm p-1.5 sm:p-2">
            <div className="flex-1 flex items-center min-w-0 px-2 sm:px-4 border-r">
              <MapPin className="h-4 w-4 text-primary shrink-0" />
              <Input
                type="text"
                placeholder="Enter city, locality..."
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent text-sm"
                data-testid="input-hero-location"
              />
            </div>

            <div className="hidden sm:flex items-center px-2 border-r">
              <Home className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
              <Select value={propertyType} onValueChange={setPropertyType}>
                <SelectTrigger 
                  className="border-0 shadow-none focus:ring-0 bg-transparent w-[100px] sm:w-[120px] text-sm h-9"
                  data-testid="select-property-type"
                >
                  <SelectValue placeholder="All Types" />
                </SelectTrigger>
                <SelectContent>
                  {propertyTypes.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="hidden md:flex items-center px-2 border-r">
              <IndianRupee className="h-4 w-4 text-muted-foreground shrink-0 mr-1" />
              <Select value={budget} onValueChange={setBudget}>
                <SelectTrigger 
                  className="border-0 shadow-none focus:ring-0 bg-transparent w-[100px] sm:w-[120px] text-sm h-9"
                  data-testid="select-budget"
                >
                  <SelectValue placeholder="Budget" />
                </SelectTrigger>
                <SelectContent>
                  {budgetRanges.map((range) => (
                    <SelectItem key={range.value} value={range.value}>
                      {range.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="pl-2">
              <Button
                className="rounded-full px-4 sm:px-6"
                onClick={handleSearch}
                data-testid="button-hero-search"
              >
                <Search className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Search</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
