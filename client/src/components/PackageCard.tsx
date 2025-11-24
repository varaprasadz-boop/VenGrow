import { Check } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface PackageCardProps {
  name: string;
  price: number;
  duration: string;
  maxListings: number | string;
  features: string[];
  isPopular?: boolean;
  onSelect?: () => void;
}

export default function PackageCard({
  name,
  price,
  duration,
  maxListings,
  features,
  isPopular = false,
  onSelect,
}: PackageCardProps) {
  const handleSelect = () => {
    onSelect?.();
    console.log(`Package selected: ${name}`);
  };

  return (
    <Card
      className={`relative overflow-hidden hover-elevate active-elevate-2 transition-all ${
        isPopular ? 'border-primary shadow-lg' : ''
      }`}
      data-testid={`card-package-${name.toLowerCase()}`}
    >
      {isPopular && (
        <div className="absolute top-0 right-0">
          <Badge className="rounded-none rounded-bl-lg bg-primary">
            Popular
          </Badge>
        </div>
      )}

      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="font-serif font-bold text-2xl">{name}</h3>
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-bold text-primary">₹{price.toLocaleString('en-IN')}</span>
            <span className="text-muted-foreground">/{duration}</span>
          </div>
          <p className="text-sm text-muted-foreground">
            Up to {maxListings === "Unlimited" ? "unlimited" : maxListings} listings
          </p>
        </div>

        {/* Features */}
        <ul className="space-y-3">
          {features.map((feature, index) => (
            <li key={index} className="flex items-start gap-2 text-sm">
              <Check className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>{feature}</span>
            </li>
          ))}
        </ul>

        {/* CTA Button */}
        <Button
          className="w-full"
          variant={isPopular ? "default" : "outline"}
          onClick={handleSelect}
          data-testid={`button-select-${name.toLowerCase()}`}
        >
          Select {name}
        </Button>
      </div>
    </Card>
  );
}
