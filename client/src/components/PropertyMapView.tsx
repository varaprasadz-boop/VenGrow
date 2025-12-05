import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Bed, Bath, Square, MapPin, ExternalLink } from "lucide-react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

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

const defaultIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-8 h-8 bg-primary rounded-full shadow-lg flex items-center justify-center text-white font-bold text-xs">
      ₹
    </div>
  </div>`,
  className: "custom-marker-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const featuredIcon = L.divIcon({
  html: `<div class="relative flex items-center justify-center">
    <div class="absolute w-10 h-10 bg-yellow-500 rounded-full shadow-lg flex items-center justify-center text-white font-bold text-sm animate-pulse">
      ★
    </div>
  </div>`,
  className: "custom-marker-icon",
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

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

function MapBoundsUpdater({ properties }: { properties: PropertyMarker[] }) {
  const map = useMap();

  useEffect(() => {
    if (properties.length > 0) {
      const bounds = L.latLngBounds(
        properties.map((p) => [p.lat, p.lng])
      );
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 13 });
    }
  }, [properties, map]);

  return null;
}

function PropertyPopup({ property }: { property: PropertyMarker }) {
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
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  const defaultCenter: [number, number] = [20.5937, 78.9629];

  const validProperties = properties.filter(
    (p) => typeof p.lat === "number" && typeof p.lng === "number"
  );

  const center: [number, number] =
    validProperties.length > 0
      ? [validProperties[0].lat, validProperties[0].lng]
      : defaultCenter;

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
      <style>
        {`
          .custom-marker-icon {
            background: transparent !important;
            border: none !important;
          }
          .leaflet-popup-content-wrapper {
            padding: 0 !important;
            border-radius: 8px !important;
            overflow: hidden !important;
          }
          .leaflet-popup-content {
            margin: 0 !important;
            width: auto !important;
          }
          .leaflet-popup-tip {
            background: white !important;
          }
        `}
      </style>
      <MapContainer
        center={center}
        zoom={10}
        style={{ height: "100%", width: "100%", minHeight: "500px" }}
        className="z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapBoundsUpdater properties={validProperties} />
        {validProperties.map((property) => (
          <Marker
            key={property.id}
            position={[property.lat, property.lng]}
            icon={property.isFeatured ? featuredIcon : defaultIcon}
            eventHandlers={{
              click: () => setSelectedProperty(property.id),
            }}
          >
            <Popup>
              <PropertyPopup property={property} />
            </Popup>
          </Marker>
        ))}
      </MapContainer>

      <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg px-3 py-2 text-xs text-muted-foreground">
        {validProperties.length} properties shown on map
      </div>
    </div>
  );
}
