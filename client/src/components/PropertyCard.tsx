import { useState } from "react";
import { useLocation } from "wouter";
import { Heart, MapPin, Bed, Bath, Maximize, CheckCircle2, Home } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { getPropertyUrl } from "@/lib/property-utils";

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
  subcategory?: string;
  projectStage?: "pre_launch" | "launch" | "under_construction" | "ready_to_move";
  isFeatured?: boolean;
  isVerified?: boolean;
  isNewConstruction?: boolean;
  furnishing?: "Unfurnished" | "Semi-Furnished" | "Fully Furnished";
  ageOfProperty?: string;
  sellerType: "Individual" | "Broker" | "Builder";
  transactionType: "Sale" | "Lease" | "Rent";
  slug?: string | null;
  city?: string;
  onFavoriteClick?: (id: string) => void;
  onClick?: (id: string) => void;
}

const projectStageLabels: Record<string, string> = {
  pre_launch: "Pre-launch",
  launch: "Launch",
  under_construction: "Under Construction",
  ready_to_move: "Ready to Move",
};

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
  subcategory,
  projectStage,
  isFeatured = false,
  isVerified = false,
  isNewConstruction = false,
  furnishing,
  ageOfProperty,
  sellerType,
  transactionType,
  slug,
  city,
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
    // Use slug-based URL for better SEO
    const propertyUrl = getPropertyUrl({ id, title, city, slug });
    setLocation(propertyUrl);
  };

  const formatPrice = (amount: number) => {
    if (amount >= 10000000) {
      return `₹${(amount / 10000000).toFixed(2)} Cr`;
    } else if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(2)} L`;
    }
    return `₹${amount.toLocaleString('en-IN')}`;
  };

  // Determine if we should show placeholder
  const hasValidImage = imageUrl && imageUrl.trim() !== '' && !imageUrl.includes('placeholder');
  const displayImage = hasValidImage ? imageUrl : undefined;

  return (
    <Card
      className="group overflow-hidden hover-elevate active-elevate-2 cursor-pointer transition-all"
      onClick={handleCardClick}
      data-testid={`card-property-${id}`}
    >
      {/* Image Section */}
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {displayImage ? (
          <>
            <img
              src={displayImage}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Hide image and show placeholder on error
                e.currentTarget.style.display = 'none';
                const placeholder = e.currentTarget.nextElementSibling as HTMLElement;
                if (placeholder) {
                  placeholder.style.display = 'flex';
                }
              }}
            />
            <div 
              className="image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50 hidden"
            >
              <div className="text-center">
                <Home className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
                <p className="text-xs text-muted-foreground/70">No Image Available</p>
              </div>
            </div>
          </>
        ) : (
          <div 
            className="image-placeholder absolute inset-0 flex items-center justify-center bg-gradient-to-br from-muted to-muted/50"
          >
            <div className="text-center">
              <Home className="h-12 w-12 text-muted-foreground/50 mx-auto mb-2" />
              <p className="text-xs text-muted-foreground/70">No Image Available</p>
            </div>
          </div>
        )}
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-0" />
        
        {/* Top Bar - Badges Left, Favorite Right */}
        <div className="absolute top-3 left-3 right-3 z-10 flex items-start justify-between">
          {/* Badges - Left */}
          <div className="flex flex-wrap gap-1.5 max-w-[70%]">
            {isFeatured && (
              <Badge className="bg-primary text-primary-foreground border-primary-border text-xs">
                Featured
              </Badge>
            )}
            <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-xs">
              For {transactionType}
            </Badge>
            {isNewConstruction && (
              <Badge variant="secondary" className="bg-blue-500/90 text-white backdrop-blur-sm text-xs" data-testid={`badge-new-${id}`}>
                New
              </Badge>
            )}
            {projectStage && (
              <Badge variant="secondary" className="bg-amber-500/90 text-white backdrop-blur-sm text-xs" data-testid={`badge-stage-${id}`}>
                {projectStageLabels[projectStage]}
              </Badge>
            )}
          </div>

          {/* Favorite Button - Right */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 bg-white/95 hover:bg-white shadow-md rounded-full border border-gray-200/50 flex-shrink-0 ml-2"
            onClick={handleFavoriteClick}
            data-testid={`button-favorite-${id}`}
          >
            <Heart
              className={`h-5 w-5 transition-colors ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-700 hover:text-red-500'}`}
            />
          </Button>
        </div>

        {/* Price - Bottom Overlay */}
        <div className="absolute bottom-3 left-3 right-3">
          <p className="text-white font-bold text-2xl font-serif drop-shadow-lg">
            {formatPrice(price)}
            {(transactionType === "Rent" || transactionType === "Lease") && <span className="text-lg">/month</span>}
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
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t">
          <div className="flex flex-wrap items-center gap-1.5">
            <Badge variant="outline" className="text-xs" data-testid={`badge-seller-${id}`}>
              {sellerType}
            </Badge>
            {isVerified && (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            )}
            {furnishing && (
              <Badge variant="secondary" className="text-xs" data-testid={`badge-furnishing-${id}`}>
                {furnishing}
              </Badge>
            )}
            {ageOfProperty && (
              <Badge variant="outline" className="text-xs text-muted-foreground" data-testid={`badge-age-${id}`}>
                {ageOfProperty}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1.5">
            <Badge variant="secondary" className="text-xs">
              {propertyType}
            </Badge>
            {subcategory && (
              <Badge variant="outline" className="text-xs text-muted-foreground" data-testid={`badge-subcategory-${id}`}>
                {subcategory}
              </Badge>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
