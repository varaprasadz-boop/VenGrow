import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Eye, Target, Zap, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

interface PromotionPackage {
  id: string;
  name: string;
  price: number;
  duration: number; // days
  features: string[];
  popular?: boolean;
}

export default function PropertyPromotionPage() {
  const params = useParams();
  const propertyId = params.id;
  const { toast } = useToast();

  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const promotionPurchaseMutation = useMutation({
    mutationFn: async (packageId: string) => {
      return apiRequest("POST", `/api/properties/${propertyId}/promote`, { packageId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      toast({ title: "Promotion purchased successfully!" });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: () => {
      toast({ title: "Failed to purchase promotion", variant: "destructive" });
    },
  });

  const promotionPackages: PromotionPackage[] = [
    {
      id: "featured",
      name: "Featured Listing",
      price: 999,
      duration: 7,
      features: [
        "Top position in search results",
        "Homepage featured section",
        "3x more visibility",
        "Premium badge",
      ],
      popular: false,
    },
    {
      id: "spotlight",
      name: "Spotlight",
      price: 2499,
      duration: 15,
      features: [
        "All Featured Listing benefits",
        "Social media promotion",
        "Email newsletter feature",
        "5x more visibility",
        "Priority support",
      ],
      popular: true,
    },
    {
      id: "premium-plus",
      name: "Premium Plus",
      price: 4999,
      duration: 30,
      features: [
        "All Spotlight benefits",
        "Dedicated account manager",
        "Professional photography",
        "Virtual tour creation",
        "10x more visibility",
        "Guaranteed inquiries",
      ],
      popular: false,
    },
  ];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  const handleSelectPackage = (pkg: PromotionPackage) => {
    if (!propertyId) {
      toast({ title: "Property ID is missing", variant: "destructive" });
      return;
    }
    promotionPurchaseMutation.mutate(pkg.id);
  };

  if (propertyLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-48 mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const activePromotions: any[] = []; // TODO: Fetch from API

  return (
    <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Promotion
            </h1>
            <p className="text-muted-foreground">
              Boost your property visibility and get more inquiries
            </p>
          </div>

          {/* Active Promotions */}
          {activePromotions.length > 0 && (
            <div className="mb-12">
              <h2 className="font-semibold text-xl mb-6">Active Promotions</h2>
              {activePromotions.map((promo) => (
                <Card key={promo.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{promo.property}</h3>
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                          <Zap className="h-3 w-3 mr-1" />
                          {promo.package}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {promo.startDate} - {promo.endDate}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Eye className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Views</span>
                      </div>
                      <p className="text-2xl font-bold">{promo.views}</p>
                    </div>
                    <div className="p-4 bg-muted rounded-lg">
                      <div className="flex items-center gap-2 mb-1">
                        <Target className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Inquiries</span>
                      </div>
                      <p className="text-2xl font-bold">{promo.inquiries}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}

          {/* Promotion Packages */}
          <div>
            <h2 className="font-semibold text-xl mb-6">Promotion Packages</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {promotionPackages.map((pkg, index) => (
                <Card
                  key={index}
                  className={`p-8 relative ${
                    pkg.popular ? "border-primary border-2" : ""
                  }`}
                >
                  {pkg.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="font-serif font-bold text-2xl mb-2">
                      {pkg.name}
                    </h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold font-serif text-primary">
                        {formatPrice(pkg.price)}
                      </span>
                      <span className="text-muted-foreground">/{pkg.duration} days</span>
                    </div>
                  </div>

                  <div className="space-y-3 mb-8">
                    {pkg.features.map((feature, idx) => (
                      <div key={idx} className="flex items-start gap-2">
                        <TrendingUp className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={pkg.popular ? "default" : "outline"}
                    data-testid={`button-select-${index}`}
                    onClick={() => handleSelectPackage(pkg)}
                    disabled={promotionPurchaseMutation.isPending}
                  >
                    {promotionPurchaseMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Get Started"
                    )}
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
}
