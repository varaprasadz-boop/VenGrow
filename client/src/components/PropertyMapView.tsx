import { useState, useCallback, useEffect } from "react";
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from "@react-google-maps/api";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bed, Bath, Square, MapPin, ExternalLink, Loader2 } from "lucide-react";

const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || "";

interface PropertyMarker {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl?: string;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  propertyType?: string;
  lat: number;
  lng: number;
  transactionType?: "Sale" | "Lease" | "Rent";
  isVerified?: boolean;
  isFeatured?: boolean;
}

interface PropertyMapViewProps {
  properties: PropertyMarker[];
  className?: string;
}

const mapContainerStyle = {
  width: "100%",
  height: "100%",
  minHeight: "500px",
};

const defaultCenter = { lat: 20.5937, lng: 78.9629 };

function formatPrice(price: number, isRent: boolean = false): string {
  if (isRent) {
    return `₹${price.toLocaleString("en-IN")}/mo`;
  }
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  if (price >= 100000) {
    return `₹${(price / 100000).toFixed(2)} L`;
  }
  return `₹${price.toLocaleString("en-IN")}`;
}

function PropertyInfoContent({ property }: { property: PropertyMarker }) {
  const isRentOrLease = property.transactionType === "Rent" || property.transactionType === "Lease";

  return (
    <Card className="w-64 overflow-hidden border-0 shadow-none">
      {property.imageUrl && (
        <div className="relative h-32 w-full">
          <img
            src={property.imageUrl}
            alt={property.title}
            className="w-full h-full object-cover"
          />
          {property.isFeatured && (
            <Badge className="absolute top-2 left-2 bg-yellow-500">Featured</Badge>
          )}
          {property.isVerified && (
            <Badge className="absolute top-2 right-2 bg-green-600">Verified</Badge>
          )}
        </div>
      )}
      <div className="p-3">
        <h3 className="font-semibold text-sm line-clamp-2 mb-1">{property.title}</h3>
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-2">
          <MapPin className="h-3 w-3" />
          {property.location}
        </div>
        <p className="text-primary font-bold mb-2">
          {formatPrice(property.price, isRentOrLease)}
        </p>
        <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
          {property.bedrooms && (
            <span className="flex items-center gap-1">
              <Bed className="h-3 w-3" />
              {property.bedrooms}
            </span>
          )}
          {property.bathrooms && (
            <span className="flex items-center gap-1">
              <Bath className="h-3 w-3" />
              {property.bathrooms}
            </span>
          )}
          {property.area && (
            <span className="flex items-center gap-1">
              <Square className="h-3 w-3" />
              {property.area} sq.ft
            </span>
          )}
        </div>
        <Link href={`/property/${property.id}`}>
          <Button 
            size="sm" 
            className="w-full"
            data-testid={`button-map-view-property-${property.id}`}
          >
            View Details
            <ExternalLink className="h-3 w-3 ml-1" />
          </Button>
        </Link>
      </div>
    </Card>
  );
}

export default function PropertyMapView({ properties, className = "" }: PropertyMapViewProps) {
  const [selectedProperty, setSelectedProperty] = useState<PropertyMarker | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const { isLoaded, loadError } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
  });

  const validProperties = properties.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number" && !isNaN(p.lat) && !isNaN(p.lng)
  );

  const center = validProperties.length > 0
    ? { lat: validProperties[0].lat, lng: validProperties[0].lng }
    : defaultCenter;

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  useEffect(() => {
    if (map && validProperties.length > 0) {
      const bounds = new google.maps.LatLngBounds();
      validProperties.forEach((property) => {
        bounds.extend({ lat: property.lat, lng: property.lng });
      });
      map.fitBounds(bounds, { top: 50, right: 50, bottom: 50, left: 50 });
    }
  }, [map, validProperties]);

  if (loadError) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`} style={{ minHeight: "500px" }}>
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-destructive mb-4" />
          <h3 className="font-semibold mb-2">Failed to Load Map</h3>
          <p className="text-sm text-muted-foreground">
            There was an error loading Google Maps
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`} style={{ minHeight: "500px" }}>
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (validProperties.length === 0) {
    return (
      <div className={`flex items-center justify-center bg-muted rounded-lg ${className}`} style={{ minHeight: "500px" }}>
        <div className="text-center">
          <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h3 className="font-semibold mb-2">No Properties to Display</h3>
          <p className="text-sm text-muted-foreground">
            Properties with location data will appear on this map
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative rounded-lg overflow-hidden ${className}`} 
      style={{ minHeight: "500px" }}
      data-testid="map-container"
    >
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={10}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          streetViewControl: false,
          mapTypeControl: true,
          fullscreenControl: true,
        }}
      >
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={{ lat: property.lat, lng: property.lng }}
            onClick={() => setSelectedProperty(property)}
            icon={property.isFeatured ? {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Ccircle cx='20' cy='20' r='18' fill='%23eab308' stroke='%23fff' stroke-width='2'/%3E%3Ctext x='20' y='26' text-anchor='middle' fill='%23fff' font-size='18' font-weight='bold'%3E★%3C/text%3E%3C/svg%3E",
              scaledSize: new google.maps.Size(40, 40),
            } : {
              url: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Ccircle cx='16' cy='16' r='14' fill='%2316a34a' stroke='%23fff' stroke-width='2'/%3E%3Ctext x='16' y='21' text-anchor='middle' fill='%23fff' font-size='12' font-weight='bold'%3E₹%3C/text%3E%3C/svg%3E",
              scaledSize: new google.maps.Size(32, 32),
            }}
          />
        ))}

        {selectedProperty && (
          <InfoWindow
            position={{ lat: selectedProperty.lat, lng: selectedProperty.lng }}
            onCloseClick={() => setSelectedProperty(null)}
          >
            <PropertyInfoContent property={selectedProperty} />
          </InfoWindow>
        )}
      </GoogleMap>

      <div className="absolute bottom-4 left-4 z-10 bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground">
        {validProperties.length} properties shown on map
      </div>
    </div>
  );
}
