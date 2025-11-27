import { useEffect, useRef, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Maximize2, Minimize2 } from "lucide-react";
import type { Property } from "@shared/schema";
import "leaflet/dist/leaflet.css";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const customIcon = new L.Icon({
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface PropertyMapProps {
  properties?: Property[];
  center?: [number, number];
  zoom?: number;
  height?: string;
  showPropertyCards?: boolean;
  onPropertyClick?: (property: Property) => void;
  singleProperty?: boolean;
}

function ChangeView({ center, zoom }: { center: [number, number]; zoom: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);
  return null;
}

export default function PropertyMap({
  properties = [],
  center = [19.076, 72.8777],
  zoom = 11,
  height = "400px",
  showPropertyCards = true,
  onPropertyClick,
  singleProperty = false,
}: PropertyMapProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const mapContainerRef = useRef<HTMLDivElement>(null);

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

  const getPropertyCoordinates = (property: Property): [number, number] | null => {
    const lat = property.latitude ? parseFloat(String(property.latitude)) : null;
    const lng = property.longitude ? parseFloat(String(property.longitude)) : null;
    if (lat && lng && !isNaN(lat) && !isNaN(lng)) {
      return [lat, lng];
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
        className="absolute top-2 right-2 z-[1000]"
        onClick={toggleFullscreen}
        data-testid="button-fullscreen-map"
      >
        {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
      </Button>

      <MapContainer
        center={mapCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <ChangeView center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {propertiesWithCoords.map((property) => {
          const coords = getPropertyCoordinates(property)!;
          return (
            <Marker key={property.id} position={coords} icon={customIcon}>
              {showPropertyCards && (
                <Popup>
                  <div className="min-w-48 p-1">
                    <h4 className="font-semibold text-sm mb-1">{property.title}</h4>
                    <p className="text-lg font-bold text-primary mb-1">
                      {formatPrice(property.price)}
                    </p>
                    <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
                      <MapPin className="h-3 w-3" />
                      <span>
                        {property.locality}, {property.city}
                      </span>
                    </div>
                    <div className="flex gap-1 flex-wrap mb-2">
                      {property.bedrooms && (
                        <Badge variant="outline" className="text-xs">
                          {property.bedrooms} BHK
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {property.area} sqft
                      </Badge>
                    </div>
                    {onPropertyClick && (
                      <Button
                        size="sm"
                        className="w-full"
                        onClick={() => onPropertyClick(property)}
                        data-testid={`button-view-property-${property.id}`}
                      >
                        View Details
                      </Button>
                    )}
                  </div>
                </Popup>
              )}
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
}
