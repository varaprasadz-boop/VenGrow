import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Loader2, AlertCircle } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

// Supported cities in India
const SUPPORTED_CITIES = [
  { name: "Mumbai", state: "Maharashtra", lat: 19.0760, lng: 72.8777 },
  { name: "Delhi", state: "Delhi", lat: 28.7041, lng: 77.1025 },
  { name: "Bangalore", state: "Karnataka", lat: 12.9716, lng: 77.5946 },
  { name: "Hyderabad", state: "Telangana", lat: 17.3850, lng: 78.4867 },
  { name: "Chennai", state: "Tamil Nadu", lat: 13.0827, lng: 80.2707 },
  { name: "Pune", state: "Maharashtra", lat: 18.5204, lng: 73.8567 },
  { name: "Kolkata", state: "West Bengal", lat: 22.5726, lng: 88.3639 },
  { name: "Ahmedabad", state: "Gujarat", lat: 23.0225, lng: 72.5714 },
  { name: "Jaipur", state: "Rajasthan", lat: 26.9124, lng: 75.7873 },
  { name: "Lucknow", state: "Uttar Pradesh", lat: 26.8467, lng: 80.9462 },
  { name: "Chandigarh", state: "Chandigarh", lat: 30.7333, lng: 76.7794 },
  { name: "Noida", state: "Uttar Pradesh", lat: 28.5355, lng: 77.3910 },
  { name: "Gurgaon", state: "Haryana", lat: 28.4595, lng: 77.0266 },
  { name: "Thane", state: "Maharashtra", lat: 19.2183, lng: 72.9781 },
  { name: "Navi Mumbai", state: "Maharashtra", lat: 19.0330, lng: 73.0297 },
  { name: "Goa", state: "Goa", lat: 15.2993, lng: 74.1240 },
  { name: "Kochi", state: "Kerala", lat: 9.9312, lng: 76.2673 },
  { name: "Indore", state: "Madhya Pradesh", lat: 22.7196, lng: 75.8577 },
  { name: "Surat", state: "Gujarat", lat: 21.1702, lng: 72.8311 },
  { name: "Nagpur", state: "Maharashtra", lat: 21.1458, lng: 79.0882 },
];

const CITY_STORAGE_KEY = "vengrow_selected_city";
const LOCATION_PERMISSION_KEY = "vengrow_location_permission";

interface LocationCity {
  name: string;
  state: string;
  lat: number;
  lng: number;
}

interface LocationContextType {
  selectedCity: LocationCity | null;
  setSelectedCity: (city: LocationCity) => void;
  isLoading: boolean;
  showCityPicker: boolean;
  setShowCityPicker: (show: boolean) => void;
  supportedCities: LocationCity[];
  requestLocationPermission: () => void;
  permissionStatus: 'granted' | 'denied' | 'prompt' | 'unknown';
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: ReactNode }) {
  const [selectedCity, setSelectedCityState] = useState<LocationCity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCityPicker, setShowCityPicker] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [geoError, setGeoError] = useState<string | null>(null);

  // Find city by name
  const findCityByName = useCallback((name: string): LocationCity | null => {
    return SUPPORTED_CITIES.find(
      city => city.name.toLowerCase() === name.toLowerCase()
    ) || null;
  }, []);

  // Set city and persist to localStorage
  const setSelectedCity = useCallback((city: LocationCity) => {
    setSelectedCityState(city);
    localStorage.setItem(CITY_STORAGE_KEY, city.name);
    setShowCityPicker(false);
  }, []);

  // Reverse geocode coordinates to city name using Google Maps API
  const reverseGeocode = useCallback(async (lat: number, lng: number): Promise<string | null> => {
    const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
    if (!apiKey) {
      console.log('[Location] No Google Maps API key configured');
      return null;
    }

    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
      );
      const data = await response.json();
      
      if (data.status === 'OK' && data.results.length > 0) {
        // Look for locality or administrative_area_level_2 (city)
        for (const result of data.results) {
          for (const component of result.address_components) {
            if (component.types.includes('locality') || 
                component.types.includes('administrative_area_level_2')) {
              return component.long_name;
            }
          }
        }
      }
    } catch (error) {
      console.error('[Location] Geocoding failed:', error);
    }
    return null;
  }, []);

  // Handle geolocation success
  const handleGeoSuccess = useCallback(async (position: GeolocationPosition) => {
    const { latitude, longitude } = position.coords;
    console.log('[Location] Got coordinates:', latitude, longitude);
    
    setPermissionStatus('granted');
    localStorage.setItem(LOCATION_PERMISSION_KEY, 'granted');
    
    // Try to reverse geocode the location
    const cityName = await reverseGeocode(latitude, longitude);
    
    if (cityName) {
      const matchedCity = findCityByName(cityName);
      if (matchedCity) {
        console.log('[Location] Matched city:', matchedCity.name);
        setSelectedCity(matchedCity);
        setIsLoading(false);
        return;
      }
    }
    
    // If city not found or not in supported list, show picker
    console.log('[Location] City not in supported list, showing picker');
    setIsLoading(false);
    setShowCityPicker(true);
  }, [reverseGeocode, findCityByName, setSelectedCity]);

  // Handle geolocation error
  const handleGeoError = useCallback((error: GeolocationPositionError) => {
    console.log('[Location] Geolocation error:', error.message, 'code:', error.code);
    
    if (error.code === error.PERMISSION_DENIED) {
      // Only persist 'denied' for actual permission denials
      setPermissionStatus('denied');
      localStorage.setItem(LOCATION_PERMISSION_KEY, 'denied');
      setGeoError("Location access denied. Please select your city manually.");
    } else if (error.code === error.POSITION_UNAVAILABLE) {
      // Transient error - don't persist, allow retry on next load
      setPermissionStatus('prompt');
      setGeoError("Location information unavailable. Please select your city manually.");
    } else if (error.code === error.TIMEOUT) {
      // Timeout - don't persist, allow retry on next load
      setPermissionStatus('prompt');
      setGeoError("Location request timed out. Please select your city manually.");
    } else {
      // Unknown error - don't persist
      setPermissionStatus('prompt');
      setGeoError("Unable to get your location. Please select your city manually.");
    }
    
    setIsLoading(false);
    setShowCityPicker(true);
  }, []);

  // Request location permission
  const requestLocationPermission = useCallback(() => {
    if (!navigator.geolocation) {
      setGeoError("Geolocation is not supported by your browser.");
      setShowCityPicker(true);
      return;
    }

    setIsLoading(true);
    setGeoError(null);
    
    navigator.geolocation.getCurrentPosition(
      handleGeoSuccess,
      handleGeoError,
      {
        enableHighAccuracy: false,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes cache
      }
    );
  }, [handleGeoSuccess, handleGeoError]);

  // Initialize on mount
  useEffect(() => {
    // Check for saved city first
    const savedCity = localStorage.getItem(CITY_STORAGE_KEY);
    if (savedCity) {
      const city = findCityByName(savedCity);
      if (city) {
        setSelectedCityState(city);
        setIsLoading(false);
        return;
      }
    }

    // Check for saved permission status
    const savedPermission = localStorage.getItem(LOCATION_PERMISSION_KEY);
    if (savedPermission === 'denied') {
      setPermissionStatus('denied');
      setIsLoading(false);
      setShowCityPicker(true);
      return;
    }

    // Request location
    requestLocationPermission();
  }, [findCityByName, requestLocationPermission]);

  return (
    <LocationContext.Provider
      value={{
        selectedCity,
        setSelectedCity,
        isLoading,
        showCityPicker,
        setShowCityPicker,
        supportedCities: SUPPORTED_CITIES,
        requestLocationPermission,
        permissionStatus,
      }}
    >
      {children}
      
      {/* City Picker Modal */}
      <Dialog open={showCityPicker} onOpenChange={setShowCityPicker}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Select Your City
            </DialogTitle>
            <DialogDescription>
              {geoError || "Choose your city to see properties near you."}
            </DialogDescription>
          </DialogHeader>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Detecting your location...</span>
            </div>
          ) : (
            <>
              {permissionStatus === 'denied' && (
                <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg text-sm text-yellow-800 dark:text-yellow-200 mb-4">
                  <AlertCircle className="h-4 w-4 flex-shrink-0" />
                  <span>Location access was denied. Please select your city below or enable location in your browser settings.</span>
                </div>
              )}
              
              <ScrollArea className="h-[300px] pr-4">
                <div className="grid grid-cols-2 gap-2">
                  {SUPPORTED_CITIES.map((city) => (
                    <Button
                      key={city.name}
                      variant={selectedCity?.name === city.name ? "default" : "outline"}
                      className="justify-start h-auto py-3 px-4"
                      onClick={() => setSelectedCity(city)}
                    >
                      <div className="text-left">
                        <div className="font-medium">{city.name}</div>
                        <div className="text-xs text-muted-foreground">{city.state}</div>
                      </div>
                    </Button>
                  ))}
                </div>
              </ScrollArea>
              
              {permissionStatus !== 'granted' && navigator.geolocation && (
                <Button
                  variant="ghost"
                  className="w-full mt-4"
                  onClick={() => {
                    setShowCityPicker(false);
                    requestLocationPermission();
                  }}
                >
                  <MapPin className="h-4 w-4 mr-2" />
                  Try Auto-detect Again
                </Button>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}

// Export cities for use in other components
export { SUPPORTED_CITIES };
