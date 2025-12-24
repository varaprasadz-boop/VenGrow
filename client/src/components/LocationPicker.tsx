import { useState, useEffect, useCallback, useRef } from "react";
import { GoogleMap, Marker, Autocomplete } from "@react-google-maps/api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MapPin, Crosshair, Loader2 } from "lucide-react";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface LocationPickerProps {
  latitude?: number;
  longitude?: number;
  onLocationChange: (lat: number, lng: number) => void;
  onAddressSelect?: (address: string) => void;
  height?: string;
  defaultCity?: string;
}

const indianCityCenters: Record<string, { lat: number; lng: number }> = {
  Mumbai: { lat: 19.076, lng: 72.8777 },
  Delhi: { lat: 28.6139, lng: 77.209 },
  Bangalore: { lat: 12.9716, lng: 77.5946 },
  Hyderabad: { lat: 17.385, lng: 78.4867 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Pune: { lat: 18.5204, lng: 73.8567 },
  Ahmedabad: { lat: 23.0225, lng: 72.5714 },
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
  Gurgaon: { lat: 28.4595, lng: 77.0266 },
  Noida: { lat: 28.5355, lng: 77.391 },
  Thane: { lat: 19.2183, lng: 72.9781 },
  Goa: { lat: 15.2993, lng: 74.124 },
};

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

export default function LocationPicker({
  latitude,
  longitude,
  onLocationChange,
  onAddressSelect,
  height = "400px",
  defaultCity = "Mumbai",
}: LocationPickerProps) {
  const defaultCenter = indianCityCenters[defaultCity] || indianCityCenters.Mumbai;
  const [position, setPosition] = useState<{ lat: number; lng: number } | null>(
    latitude && longitude ? { lat: latitude, lng: longitude } : null
  );
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded, loadError, apiKey: GOOGLE_MAPS_API_KEY } = useGoogleMaps();

  useEffect(() => {
    if (latitude && longitude && !isNaN(latitude) && !isNaN(longitude)) {
      const newPosition = { lat: latitude, lng: longitude };
      setPosition(newPosition);
      // Update map center if map is loaded
      if (map) {
        map.panTo(newPosition);
        map.setZoom(15);
      }
    }
  }, [latitude, longitude, map]);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const handleMapClick = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      onLocationChange(lat, lng);
    }
  }, [onLocationChange]);

  const handleMarkerDragEnd = useCallback((e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      const lat = e.latLng.lat();
      const lng = e.latLng.lng();
      setPosition({ lat, lng });
      onLocationChange(lat, lng);
    }
  }, [onLocationChange]);

  const handleLocateMe = () => {
    if (!navigator.geolocation) return;
    
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude: lat, longitude: lng } = position.coords;
        setPosition({ lat, lng });
        onLocationChange(lat, lng);
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
        setIsLocating(false);
      },
      (error) => {
        console.error("Geolocation error:", error);
        setIsLocating(false);
      },
      { enableHighAccuracy: true }
    );
  };

  const onAutocompleteLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry?.location) {
        const lat = place.geometry.location.lat();
        const lng = place.geometry.location.lng();
        setPosition({ lat, lng });
        onLocationChange(lat, lng);
        if (map) {
          map.panTo({ lat, lng });
          map.setZoom(15);
        }
        if (onAddressSelect && place.formatted_address) {
          onAddressSelect(place.formatted_address);
        }
      }
    }
  };

  if (loadError || !GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="p-4">
        <div className="flex flex-col items-center justify-center h-48 text-center">
          <MapPin className="h-8 w-8 text-primary mb-2 opacity-70" />
          <p className="text-muted-foreground text-sm">
            {!GOOGLE_MAPS_API_KEY 
              ? "Google Maps API key is not configured"
              : "Map picker is being configured"}
          </p>
          <p className="text-xs text-muted-foreground mt-1">You can still enter coordinates manually</p>
          {loadError && import.meta.env.PROD && (
            <p className="text-xs text-destructive mt-2">
              Check API key restrictions and domain whitelist in Google Cloud Console
            </p>
          )}
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="p-4">
        <div className="flex items-center justify-center h-48">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-4 space-y-4">
      <div className="space-y-2">
        <Label className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          Search Location
        </Label>
        <div className="flex gap-2">
          <div className="flex-1">
            <Autocomplete
              onLoad={onAutocompleteLoad}
              onPlaceChanged={onPlaceChanged}
              options={{
                componentRestrictions: { country: "in" },
                types: ["geocode", "establishment"],
              }}
            >
              <Input
                ref={inputRef}
                type="text"
                placeholder="Search for address, locality, landmark..."
                data-testid="input-location-search"
              />
            </Autocomplete>
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Click on the map to set the exact location, or search for an address above
        </p>
      </div>

      <div className="relative rounded-lg overflow-hidden" style={{ height }}>
        <GoogleMap
          mapContainerStyle={mapContainerStyle}
          center={position || defaultCenter}
          zoom={position ? 15 : 12}
          onLoad={onLoad}
          onUnmount={onUnmount}
          onClick={handleMapClick}
          options={{
            streetViewControl: false,
            mapTypeControl: true,
            fullscreenControl: false,
          }}
        >
          {position && (
            <Marker
              position={position}
              draggable={true}
              onDragEnd={handleMarkerDragEnd}
            />
          )}
        </GoogleMap>

        <Button
          type="button"
          variant="secondary"
          size="icon"
          className="absolute bottom-20 right-2 z-10"
          onClick={handleLocateMe}
          disabled={isLocating}
          data-testid="button-locate-me"
        >
          {isLocating ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Crosshair className="h-4 w-4" />
          )}
        </Button>
      </div>

      {position && (
        <div className="flex items-center gap-4 text-sm text-muted-foreground bg-muted/50 rounded-md px-3 py-2">
          <div className="flex items-center gap-1">
            <span className="font-medium">Lat:</span>
            <span data-testid="text-latitude">{position.lat.toFixed(6)}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="font-medium">Lng:</span>
            <span data-testid="text-longitude">{position.lng.toFixed(6)}</span>
          </div>
        </div>
      )}
    </Card>
  );
}
