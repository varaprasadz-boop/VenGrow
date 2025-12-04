import { useState } from "react";
import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const popularCities = ["Mumbai", "Delhi", "Bangalore", "Hyderabad", "Chennai"];

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("buy");

  const handleSearch = () => {
    onSearch?.({ location, propertyType, transactionType });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0">
        <div className="w-full h-full bg-gradient-to-br from-primary/30 via-primary/20 to-accent/30" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/60" />
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 
              className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg"
              data-testid="text-hero-title"
            >
              Find Your Dream Property in India
            </h1>
            <p 
              className="text-lg sm:text-xl text-white/90 mb-8 drop-shadow-md"
              data-testid="text-hero-subtitle"
            >
              Discover verified properties from trusted sellers. Buy, rent, or lease your perfect home today.
            </p>

            <div className="bg-background/95 backdrop-blur-lg rounded-lg shadow-2xl p-4 sm:p-6">
              <div className="flex border-b mb-4">
                <button
                  className={`px-4 py-2 font-medium transition-colors ${
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
                  className={`px-4 py-2 font-medium transition-colors ${
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
                  className={`px-4 py-2 font-medium transition-colors ${
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

              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {popularCities.map((city) => (
                  <Button
                    key={city}
                    variant="outline"
                    size="sm"
                    className="h-7 text-xs"
                    onClick={() => setLocation(city)}
                    data-testid={`button-quick-${city.toLowerCase()}`}
                  >
                    {city}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
