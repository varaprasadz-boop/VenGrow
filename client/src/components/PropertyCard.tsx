import { useState } from "react";
import { useLocation } from "wouter";
import { Heart, MapPin, Bed, Bath, Maximize, CheckCircle2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface PropertyCardProps {
  id: string;
  title: string;
  price: number;
  location: string;
  imageUrl: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  propertyType: string;
  isFeatured?: boolean;
  isVerified?: boolean;
  sellerType: "Individual" | "Broker" | "Builder";
  transactionType: "Sale" | "Rent";
  onFavoriteClick?: (id: string) => void;
  onClick?: (id: string) => void;
}

export default function PropertyCard({
  id,
  title,
  price,
  location,
  imageUrl,
  bedrooms,
  bathrooms,
  area,
  propertyType,
  isFeatured = false,
  isVerified = false,
  sellerType,
  transactionType,
  onFavoriteClick,
  onClick,
}: PropertyCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [, setLocation] = useLocation();

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorited(!isFavorited);
    onFavoriteClick?.(id);
  };

  const handleCardClick = () => {
    onClick?.(id);
    setLocation(`/property/${id}`);
  };

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  return (
    <Card
      className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={handleCardClick}
      data-testid={`card-property-${id}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Badges */}
        <div className="absolute top-3 left-3 flex gap-2">
          {isFeatured && (
            <Badge className="bg-primary text-primary-foreground border-primary-border">
              Featured
            </Badge>
          )}
          <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm">
            For {transactionType}
          </Badge>
        </div>

        {/* Favorite Button */}
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 bg-background/90 backdrop-blur-sm hover:bg-background"
          onClick={handleFavoriteClick}
          data-testid={`button-favorite-${id}`}
        >
          <Heart
            className={`h-5 w-5 ${isFavorited ? 'fill-red-500 text-red-500' : ''}`}
          />
        </Button>

        {/* Price - Bottom Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-2xl font-serif drop-shadow-lg">
            {formatPrice(price)}
            {transactionType === "Rent" && <span className="text-lg">/month</span>}
          </p>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-4 space-y-3">
        {/* Title & Location */}
        <div>
          <h3 className="font-semibold text-lg line-clamp-1 mb-1" data-testid={`text-title-${id}`}>
            {title}
          </h3>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{location}</span>
          </div>
        </div>

        {/* Specs */}
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          {bedrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bed className="h-4 w-4" />
              <span>{bedrooms} BHK</span>
            </div>
          )}
          {bathrooms !== undefined && (
            <div className="flex items-center gap-1">
              <Bath className="h-4 w-4" />
              <span>{bathrooms}</span>
            </div>
          )}
          <div className="flex items-center gap-1">
            <Maximize className="h-4 w-4" />
            <span>{area} sq.ft</span>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between pt-2 border-t">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="text-xs">
              {sellerType}
            </Badge>
            {isVerified && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
          </div>
          <Badge variant="secondary" className="text-xs">
            {propertyType}
          </Badge>
        </div>
      </div>
    </Card>
  );
}
