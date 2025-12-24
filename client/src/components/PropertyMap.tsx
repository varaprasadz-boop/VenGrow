import { useEffect, useRef, useState, useCallback } from "react";
import { GoogleMap, Marker, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Maximize2, Minimize2, Loader2 } from "lucide-react";
import type { Property } from "@shared/schema";
import { useGoogleMaps } from "@/hooks/useGoogleMaps";

interface PropertyMapProps {
  properties?: Property[];
  center?: { lat: number; lng: number };
  zoom?: number;
  height?: string;
  showPropertyCards?: boolean;
  onPropertyClick?: (property: Property) => void;
  singleProperty?: boolean;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
};

const defaultCenter = { lat: 19.076, lng: 72.8777 };

export default function PropertyMap({
  properties = [],
  center = defaultCenter,
  zoom = 11,
  height = "400px",
  showPropertyCards = true,
  onPropertyClick,
  singleProperty = false,
}: PropertyMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);
  const mapContainerRef = useRef<HTMLDivElement>(null);

  const { isLoaded, loadError, apiKey: GOOGLE_MAPS_API_KEY } = useGoogleMaps();

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  const toggleFullscreen = () => {
    if (!mapContainerRef.current) return;

    if (!isFullscreen) {
      if (mapContainerRef.current.requestFullscreen) {
        mapContainerRef.current.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const getPropertyCoordinates = (property: Property): { lat: number; lng: number } | null => {
    const lat = property.latitude ? parseFloat(String(property.latitude)) : null;
    const lng = property.longitude ? parseFloat(String(property.longitude)) : null;
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return { lat, lng };
    }
    return null;
  };

  const formatPrice = (price: number) => {
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    } else if (price >= 100000) {
      return `₹${(price / 100000).toFixed(2)} L`;
    }
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const propertiesWithCoords = properties.filter((p) => getPropertyCoordinates(p) !== null);

  useEffect(() => {
    if (map && propertiesWithCoords.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      propertiesWithCoords.forEach((property) => {
        const coords = getPropertyCoordinates(property);
        if (coords) {
          bounds.extend(coords);
        }
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, propertiesWithCoords]);

  if (loadError || !GOOGLE_MAPS_API_KEY) {
    return (
      <Card className="flex items-center justify-center text-center" style={{ height }}>
        <div className="p-8">
          <MapPin className="h-12 w-12 text-primary mx-auto mb-4 opacity-70" />
          <p className="text-muted-foreground text-sm">Map view is being configured</p>
        </div>
      </Card>
    );
  }

  if (!isLoaded) {
    return (
      <Card className="flex items-center justify-center" style={{ height }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </Card>
    );
  }

  if (propertiesWithCoords.length === 0 && !singleProperty) {
    return (
      <Card className="flex items-center justify-center text-center" style={{ height }}>
        <div className="p-8">
          <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
          <p className="text-muted-foreground">No properties with location data</p>
        </div>
      </Card>
    );
  }

  const mapCenter =
    propertiesWithCoords.length > 0
      ? getPropertyCoordinates(propertiesWithCoords[0]) || center
      : center;

  return (
    <div ref={mapContainerRef} className="relative rounded-lg overflow-hidden" style={{ height }}>
      <Button
        variant="secondary"
        size="icon"
        className="absolute top-2 right-2 z-10"
        onClick={toggleFullscreen}
        data-testid="button-fullscreen-map"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>

      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={mapCenter}
        zoom={zoom}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: false,
        }}
      >
        {propertiesWithCoords.map((property) => {
          const coords = getPropertyCoordinates(property)!;
          return (
            <Marker
              key={property.id}
              position={coords}
              onClick={() => setSelectedProperty(property)}
            />
          );
        })}

        {selectedProperty && showPropertyCards && (
          <InfoWindow
            position={getPropertyCoordinates(selectedProperty)!}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <div className="min-w-48 p-1">
              <h4 className="font-semibold text-sm mb-1">{selectedProperty.title}</h4>
              <p className="text-lg font-bold text-primary mb-1">
                {formatPrice(selectedProperty.price)}
              </p>
              <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                <MapPin className="h-3 w-3" />
                <span>
                  {selectedProperty.locality}, {selectedProperty.city}
                </span>
              </div>
              <div className="flex gap-1 flex-wrap mb-2">
                {selectedProperty.bedrooms && (
                  <Badge variant="outline" className="text-xs">
                    {selectedProperty.bedrooms} BHK
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs">
                  {selectedProperty.area} sqft
                </Badge>
              </div>
              {onPropertyClick && (
                <Button
                  size="sm"
                  className="w-full"
                  onClick={() => onPropertyClick(selectedProperty)}
                  data-testid={`button-view-property-${selectedProperty.id}`}
                >
                  View Details
                </Button>
              )}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}
