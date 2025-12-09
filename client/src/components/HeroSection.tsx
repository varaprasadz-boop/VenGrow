import { useState } from "react";
import { Search, MapPin, Building2, Home, TreePine, Building, Warehouse, LandPlot, IndianRupee } from "lucide-react";
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

interface HeroSectionProps {
  onSearch?: (params: { location: string; propertyType: string; transactionType: string; budget: string }) => void;
}

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "farmhouse", label: "Farmhouse" },
];

const budgetRanges = [
  { value: "all", label: "Budget" },
  { value: "under-25l", label: "Under ₹25 Lac" },
  { value: "25l-50l", label: "₹25-50 Lac" },
  { value: "50l-1cr", label: "₹50 Lac - 1 Cr" },
  { value: "1cr-2cr", label: "₹1-2 Cr" },
  { value: "2cr-5cr", label: "₹2-5 Cr" },
  { value: "above-5cr", label: "Above ₹5 Cr" },
];

const propertyTypeCards = [
  { type: "apartment", label: "Apartments", icon: Building2, count: "2,450" },
  { type: "villa", label: "Villas", icon: Home, count: "890" },
  { type: "plot", label: "Plots", icon: LandPlot, count: "1,230" },
  { type: "commercial", label: "Commercial", icon: Building, count: "567" },
  { type: "farmhouse", label: "Farmhouse", icon: TreePine, count: "234" },
  { type: "warehouse", label: "Warehouse", icon: Warehouse, count: "189" },
];

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("buy");
  const [budget, setBudget] = useState("all");

  const handleSearch = () => {
    onSearch?.({ location, propertyType, transactionType, budget });
  };

  return (
    <div className="w-full bg-background py-12 md:py-16" data-testid="section-hero">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-10">
          <h1 
            className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-foreground mb-3"
            data-testid="text-hero-title"
          >
            Search on VenGrow is now{" "}
            <span className="italic text-primary">Simplified</span>
          </h1>
          <p 
            className="text-muted-foreground text-base sm:text-lg"
            data-testid="text-hero-subtitle"
          >
            Find the perfect property that matches your needs from our diverse collection
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 mb-10">
          {propertyTypeCards.map((item) => (
            <Link 
              key={item.type} 
              href={`/listings?type=${item.type}`}
              className="block"
            >
              <div 
                className="bg-card border rounded-lg p-4 text-center hover-elevate active-elevate-2 cursor-pointer transition-all"
                data-testid={`card-property-type-${item.type}`}
              >
                <div className="w-12 h-12 mx-auto mb-3 bg-primary/10 rounded-lg flex items-center justify-center">
                  <item.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-medium text-sm text-foreground">{item.label}</h3>
                <p className="text-xs text-muted-foreground mt-1">{item.count} Properties</p>
              </div>
            </Link>
          ))}
        </div>

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
                  <SelectValue placeholder="Flat +1" />
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
