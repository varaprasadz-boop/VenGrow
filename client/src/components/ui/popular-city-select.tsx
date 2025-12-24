import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";

interface PopularCity {
  id: string;
  name: string;
  slug: string;
  state?: string;
  isActive: boolean;
}

interface PopularCitySelectProps {
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  "data-testid"?: string;
}

const OTHER_CITY_VALUE = "__OTHER__";

export function PopularCitySelect({
  value,
  onValueChange,
  placeholder = "Select city",
  disabled = false,
  required = false,
  error,
  "data-testid": testId = "select-popular-city",
}: PopularCitySelectProps) {
  const [isOther, setIsOther] = useState(false);
  const [customCity, setCustomCity] = useState("");

  // Fetch popular cities from API
  const { data: cities = [], isLoading } = useQuery<PopularCity[]>({
    queryKey: ["/api/popular-cities"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/popular-cities");
      return response.json();
    },
  });

  // Check if current value is a custom city (not in dropdown)
  useEffect(() => {
    if (value && cities.length > 0) {
      const isInList = cities.some(
        (c) => c.name.toLowerCase() === value.toLowerCase()
      );
      if (!isInList && value !== "" && value !== OTHER_CITY_VALUE) {
        setIsOther(true);
        setCustomCity(value);
      } else if (value === OTHER_CITY_VALUE) {
        setIsOther(true);
        setCustomCity("");
      } else {
        setIsOther(false);
        setCustomCity("");
      }
    }
  }, [value, cities]);

  const handleSelectChange = (selectedValue: string) => {
    if (selectedValue === OTHER_CITY_VALUE) {
      setIsOther(true);
      setCustomCity("");
      onValueChange("");
    } else {
      setIsOther(false);
      setCustomCity("");
      onValueChange(selectedValue);
    }
  };

  const handleCustomCityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setCustomCity(newValue);
    onValueChange(newValue);
  };

  if (isLoading) {
    return (
      <div className="space-y-1">
        <Select disabled>
          <SelectTrigger data-testid={testId}>
            <SelectValue placeholder="Loading cities..." />
          </SelectTrigger>
        </Select>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <Loader2 className="h-4 w-4 animate-spin" />
          <span>Loading cities...</span>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  if (isOther) {
    return (
      <div className="space-y-2">
        <Input
          value={customCity}
          onChange={handleCustomCityChange}
          placeholder="Enter city name"
          data-testid={`${testId}-custom`}
          className={error ? "border-destructive" : ""}
          disabled={disabled}
        />
        <button
          type="button"
          onClick={() => {
            setIsOther(false);
            setCustomCity("");
            onValueChange("");
          }}
          className="text-xs text-primary hover:underline"
          data-testid={`${testId}-back-to-list`}
        >
          ← Back to city list
        </button>
        {error && <p className="text-xs text-destructive">{error}</p>}
      </div>
    );
  }

  const activeCities = cities.filter((city) => city.isActive);

  return (
    <div className="space-y-1">
      <Select
        value={value || ""} // Ensure value is always a string to avoid controlled/uncontrolled warning
        onValueChange={handleSelectChange}
        disabled={disabled}
      >
        <SelectTrigger
          data-testid={testId}
          className={error ? "border-destructive" : ""}
        >
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent className="max-h-[300px]">
          {activeCities.length > 0 ? (
            <>
              {activeCities.map((city) => (
                <SelectItem key={city.id} value={city.name}>
                  {city.name}
                  {city.state && (
                    <span className="text-xs text-muted-foreground ml-1">
                      ({city.state})
                    </span>
                  )}
                </SelectItem>
              ))}
              <div className="h-px bg-border my-1" />
              <SelectItem value={OTHER_CITY_VALUE}>
                <span className="text-muted-foreground">Other (enter manually)</span>
              </SelectItem>
            </>
          ) : (
            <SelectItem value={OTHER_CITY_VALUE} disabled>
              No cities available. Enter manually.
            </SelectItem>
          )}
        </SelectContent>
      </Select>
      {error && <p className="text-xs text-destructive">{error}</p>}
    </div>
  );
}

