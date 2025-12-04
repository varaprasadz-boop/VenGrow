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
import { useQuery } from "@tanstack/react-query";
import type { PopularCity, PropertyTypeManaged } from "@shared/schema";

interface HeroSectionProps {
  backgroundImage: string;
  onSearch?: (params: { location: string; propertyType: string; transactionType: string }) => void;
}

const fallbackCities = ["Mumbai", "Bangalore", "Delhi", "Pune", "Hyderabad"];
const fallbackPropertyTypes = [
  { slug: "all", name: "All Types" },
  { slug: "apartment", name: "Apartment" },
  { slug: "villa", name: "Villa" },
  { slug: "plot", name: "Plot/Land" },
  { slug: "commercial", name: "Commercial" },
];

export default function HeroSection({ backgroundImage, onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("all");
  const [transactionType, setTransactionType] = useState("sale");

  const { data: popularCities = [] } = useQuery<PopularCity[]>({
    queryKey: ["/api/popular-cities"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: propertyTypes = [] } = useQuery<PropertyTypeManaged[]>({
    queryKey: ["/api/property-types"],
    staleTime: 5 * 60 * 1000,
  });

  const displayCities = popularCities.length > 0 
    ? popularCities.slice(0, 5).map(c => c.name) 
    : fallbackCities;

  const displayPropertyTypes = propertyTypes.length > 0 
    ? propertyTypes 
    : fallbackPropertyTypes;

  const handleSearch = () => {
    onSearch?.({ location, propertyType, transactionType });
    console.log('Search triggered:', { location, propertyType, transactionType });
  };

  return (
    <div className="relative h-[600px] w-full overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src={backgroundImage}
          alt="Luxury properties in India"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70" />
      </div>

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            {/* Heading */}
            <h1 className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg">
              Find Your Dream Property in India
            </h1>
            <p className="text-lg sm:text-xl text-white/90 mb-8 drop-shadow-md">
              Discover apartments, villas, plots, and commercial spaces from verified sellers
            </p>

            {/* Search Box */}
            <div className="bg-background/95 backdrop-blur-lg rounded-lg shadow-2xl p-4 sm:p-6">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                {/* Location Input */}
                <div className="md:col-span-5">
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="text"
                      placeholder="City, Locality, or Project"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      className="pl-10"
                      data-testid="input-hero-location"
                    />
                  </div>
                </div>

                {/* Property Type Select */}
                <div className="md:col-span-3">
                  <Select value={propertyType} onValueChange={setPropertyType}>
                    <SelectTrigger data-testid="select-property-type">
                      <SelectValue placeholder="Property Type" />
                    </SelectTrigger>
                    <SelectContent>
                      {displayPropertyTypes.map((type) => (
                        <SelectItem key={type.slug} value={type.slug}>
                          {type.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Transaction Type Select */}
                <div className="md:col-span-2">
                  <Select value={transactionType} onValueChange={setTransactionType}>
                    <SelectTrigger data-testid="select-transaction-type">
                      <SelectValue placeholder="Buy/Lease/Rent" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Buy</SelectItem>
                      <SelectItem value="lease">Lease</SelectItem>
                      <SelectItem value="rent">Rent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Search Button */}
                <div className="md:col-span-2">
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

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                <span className="text-sm text-muted-foreground">Popular:</span>
                {displayCities.map((city) => (
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
