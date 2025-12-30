import { useParams, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { TrendingUp, Eye, Users, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Property, Inquiry } from "@shared/schema";

interface BoostPlan {
  id: string;
  name: string;
  duration: number; // days
  price: number;
  features: string[];
  popular?: boolean;
}

export default function PropertyBoostPage() {
  const params = useParams();
  const [, setLocation] = useLocation();
  const propertyId = params.id;
  const { toast } = useToast();

  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<Inquiry[]>({
    queryKey: [`/api/properties/${propertyId}/inquiries`],
    enabled: !!propertyId,
  });

  const boostPurchaseMutation = useMutation({
    mutationFn: async (planId: string) => {
      return apiRequest("POST", `/api/properties/${propertyId}/boost`, { planId });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      toast({ title: "Boost purchased successfully!" });
      // Redirect to payment if needed
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: () => {
      toast({ title: "Failed to purchase boost", variant: "destructive" });
    },
  });

  const handleBoost = (planId: string) => {
    if (!propertyId) {
      toast({ title: "Property ID is missing", variant: "destructive" });
      return;
    }
    boostPurchaseMutation.mutate(planId);
  };

  const boostPlans: BoostPlan[] = [
    {
      id: "basic",
      name: "Basic Boost",
      duration: 7,
      price: 999,
      features: ["Top search results", "2x visibility", "+50% inquiries"],
    },
    {
      id: "premium",
      name: "Premium Boost",
      duration: 15,
      price: 1799,
      features: ["Featured listing", "4x visibility", "+100% inquiries", "Social media promotion"],
      popular: true,
    },
    {
      id: "ultimate",
      name: "Ultimate Boost",
      duration: 30,
      price: 2999,
      features: ["Homepage banner", "6x visibility", "+150% inquiries", "Priority support"],
    },
  ];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  if (propertyLoading || inquiriesLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Skeleton className="h-24" />
            <Skeleton className="h-24" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-96" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  const currentViews = property?.viewCount || 0;
  const currentInquiries = inquiries.length;
  const propertyTitle = property?.title || "Property";
  const propertyLocation = property 
    ? `${property.locality || ''}, ${property.city}`.replace(/^, /, '')
    : "";

  return (
    <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Boost Your Property
            </h1>
            <p className="text-muted-foreground">
              {propertyTitle} {propertyLocation ? `• ${propertyLocation}` : ''}
            </p>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{currentViews.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Current Views</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{currentInquiries}</p>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Boost Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boostPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 ${plan.popular ? "border-primary border-2" : ""}`}
              >
                {plan.popular && (
                  <Badge className="mb-4">Most Popular</Badge>
                )}
                <h3 className="font-serif font-bold text-2xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-primary">{formatPrice(plan.price)}</span>
                  <span className="text-muted-foreground">/{plan.duration} days</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-boost-${plan.id}`}
                  onClick={() => handleBoost(plan.id)}
                  disabled={boostPurchaseMutation.isPending}
                >
                  {boostPurchaseMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    "Boost Now"
                  )}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
