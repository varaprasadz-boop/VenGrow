import { useState, useEffect } from "react";
import { Search, MapPin, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import type { PopularCity, PropertyTypeManaged } from "@shared/schema";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText?: string;
  buttonLink?: string;
  overlayOpacity?: number;
  isActive: boolean;
}

interface SiteSetting {
  key: string;
  value: string | null;
}

interface TransactionOption {
  value: string;
  label: string;
}

interface HeroSectionProps {
  onSearch?: (params: { location: string; propertyType: string; transactionType: string }) => void;
}

export default function HeroSection({ onSearch }: HeroSectionProps) {
  const [location, setLocation] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [transactionType, setTransactionType] = useState("");

  const { data: heroSlides = [], isLoading: heroLoading } = useQuery<HeroSlide[]>({
    queryKey: ["/api/hero-slides"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: popularCities = [], isLoading: citiesLoading } = useQuery<PopularCity[]>({
    queryKey: ["/api/popular-cities"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: propertyTypes = [], isLoading: typesLoading } = useQuery<PropertyTypeManaged[]>({
    queryKey: ["/api/property-types"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const getSettingValue = (key: string): string | null => {
    const setting = siteSettings.find(s => s.key === key);
    return setting?.value || null;
  };

  const searchPlaceholder = getSettingValue("hero_search_placeholder");
  const allTypesLabel = getSettingValue("hero_all_types_label");
  const allTypesValue = getSettingValue("hero_all_types_value");
  const searchButtonText = getSettingValue("hero_search_button");
  const popularLabel = getSettingValue("hero_popular_label");
  const emptyTitle = getSettingValue("hero_empty_title");
  const emptyDescription = getSettingValue("hero_empty_description");
  const adminPromptTitle = getSettingValue("admin_config_prompt_title");
  const adminPromptDescription = getSettingValue("admin_config_prompt_description");
  const defaultPropertyType = getSettingValue("hero_default_property_type");
  const defaultTransactionType = getSettingValue("hero_default_transaction_type");

  const transactionOptions: TransactionOption[] = [];
  const buyLabel = getSettingValue("hero_buy_label");
  const leaseLabel = getSettingValue("hero_lease_label");
  const rentLabel = getSettingValue("hero_rent_label");
  const buyValue = getSettingValue("hero_buy_value");
  const leaseValue = getSettingValue("hero_lease_value");
  const rentValue = getSettingValue("hero_rent_value");
  
  if (buyLabel && buyValue) transactionOptions.push({ value: buyValue, label: buyLabel });
  if (leaseLabel && leaseValue) transactionOptions.push({ value: leaseValue, label: leaseLabel });
  if (rentLabel && rentValue) transactionOptions.push({ value: rentValue, label: rentLabel });

  useEffect(() => {
    if (defaultPropertyType && !propertyType) {
      setPropertyType(defaultPropertyType);
    }
    if (defaultTransactionType && !transactionType) {
      setTransactionType(defaultTransactionType);
    }
  }, [defaultPropertyType, defaultTransactionType, propertyType, transactionType]);

  const activeSlide = heroSlides.find(s => s.isActive) || heroSlides[0];
  const displayCities = popularCities.slice(0, 5);
  const displayPropertyTypes = propertyTypes.filter(pt => pt.isActive);

  const handleSearch = () => {
    onSearch?.({ location, propertyType, transactionType });
  };

  if (heroLoading || settingsLoading) {
    return (
      <div className="relative h-[600px] w-full" data-testid="section-hero">
        <Skeleton className="w-full h-full" />
      </div>
    );
  }

  if (!activeSlide) {
    const promptTitle = emptyTitle || adminPromptTitle;
    const promptDescription = emptyDescription || adminPromptDescription;
    
    if (!promptTitle && !promptDescription) {
      return null;
    }
    
    return (
      <div className="relative h-[500px] w-full bg-gradient-to-br from-primary/20 to-primary/5" data-testid="section-hero">
        <div className="absolute inset-0 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            {promptTitle && <h2 className="font-semibold text-xl mb-2">{promptTitle}</h2>}
            {promptDescription && <p className="text-muted-foreground text-sm">{promptDescription}</p>}
          </Card>
        </div>
      </div>
    );
  }

  const hasLocationSearch = !!searchPlaceholder;
  const hasPropertyTypeSelect = displayPropertyTypes.length > 0 && allTypesLabel && allTypesValue;
  const hasTransactionSelect = transactionOptions.length > 0;
  const hasSearchButton = !!searchButtonText;
  const hasPopularCities = displayCities.length > 0 && popularLabel;
  
  const hasSearchForm = hasLocationSearch || hasPropertyTypeSelect || hasTransactionSelect || hasSearchButton;

  return (
    <div className="relative h-[600px] w-full overflow-hidden" data-testid="section-hero">
      <div className="absolute inset-0">
        {activeSlide.imageUrl ? (
          <img
            src={activeSlide.imageUrl}
            alt=""
            className="w-full h-full object-cover"
            data-testid="img-hero-background"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary/30 to-primary/10" />
        )}
        <div 
          className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/70"
          style={{ opacity: (activeSlide.overlayOpacity || 50) / 100 }}
        />
      </div>

      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="max-w-3xl">
            <h1 
              className="font-serif font-bold text-4xl sm:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg"
              data-testid="text-hero-title"
            >
              {activeSlide.title}
            </h1>
            <p 
              className="text-lg sm:text-xl text-white/90 mb-8 drop-shadow-md"
              data-testid="text-hero-subtitle"
            >
              {activeSlide.subtitle}
            </p>

            {hasSearchForm && (
              <div className="bg-background/95 backdrop-blur-lg rounded-lg shadow-2xl p-4 sm:p-6">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                  {hasLocationSearch && (
                    <div className="md:col-span-5">
                      <div className="relative">
                        <MapPin className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        <Input
                          type="text"
                          placeholder={searchPlaceholder}
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="pl-10"
                          data-testid="input-hero-location"
                        />
                      </div>
                    </div>
                  )}

                  {hasPropertyTypeSelect && (
                    <div className={hasLocationSearch ? "md:col-span-3" : "md:col-span-5"}>
                      <Select value={propertyType} onValueChange={setPropertyType}>
                        <SelectTrigger data-testid="select-property-type">
                          <SelectValue placeholder={allTypesLabel} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value={allTypesValue}>{allTypesLabel}</SelectItem>
                          {displayPropertyTypes.map((type) => (
                            <SelectItem key={type.slug} value={type.slug}>
                              {type.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {hasTransactionSelect && (
                    <div className="md:col-span-2">
                      <Select value={transactionType} onValueChange={setTransactionType}>
                        <SelectTrigger data-testid="select-transaction-type">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {transactionOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {hasSearchButton && (
                    <div className="md:col-span-2">
                      <Button
                        className="w-full h-full"
                        onClick={handleSearch}
                        data-testid="button-hero-search"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        {searchButtonText}
                      </Button>
                    </div>
                  )}
                </div>

                {hasPopularCities && (
                  <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
                    <span className="text-sm text-muted-foreground">{popularLabel}</span>
                    {displayCities.map((city) => (
                      <Button
                        key={city.id}
                        variant="outline"
                        size="sm"
                        className="h-7 text-xs"
                        onClick={() => setLocation(city.name)}
                        data-testid={`button-quick-${city.name.toLowerCase()}`}
                      >
                        {city.name}
                      </Button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
