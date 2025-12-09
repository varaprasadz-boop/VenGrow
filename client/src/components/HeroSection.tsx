import { useState } from "react";
import { Search, MapPin, Building2, Home, TreePine, Building, Warehouse, LandPlot } from "lucide-react";
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
  onSearch?: (params: { location: string; propertyType: string; transactionType: string }) => void;
}

const propertyTypes = [
  { value: "all", label: "All Types" },
  { value: "apartment", label: "Apartment" },
  { value: "villa", label: "Villa" },
  { value: "plot", label: "Plot" },
  { value: "commercial", label: "Commercial" },
  { value: "farmhouse", label: "Farmhouse" },
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

  const handleSearch = () => {
    onSearch?.({ location, propertyType, transactionType });
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
          <div className="bg-card border rounded-lg shadow-sm p-4 sm:p-6">
            <div className="flex border-b mb-4">
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  transactionType === "buy"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTransactionType("buy")}
                data-testid="tab-buy"
              >
                Buy
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  transactionType === "lease"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTransactionType("lease")}
                data-testid="tab-lease"
              >
                Lease
              </button>
              <button
                className={`px-4 py-2 font-medium text-sm transition-colors ${
                  transactionType === "rent"
                    ? "text-primary border-b-2 border-primary"
                    : "text-muted-foreground hover:text-foreground"
                }`}
                onClick={() => setTransactionType("rent")}
                data-testid="tab-rent"
              >
                Rent
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
              <div className="md:col-span-5">
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    type="text"
                    placeholder="Enter city, locality, or project"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10"
                    data-testid="input-hero-location"
                  />
                </div>
              </div>

              <div className="md:col-span-4">
                <Select value={propertyType} onValueChange={setPropertyType}>
                  <SelectTrigger data-testid="select-property-type">
                    <SelectValue placeholder="Property Type" />
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

              <div className="md:col-span-3">
                <Button
                  className="w-full h-full"
                  onClick={handleSearch}
                  data-testid="button-hero-search"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
