import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { RotateCcw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { differenceInDays, format } from "date-fns";
import type { Property, SellerSubscription, Package, Inquiry } from "@shared/schema";

interface RenewalOption {
  duration: number; // months
  price: number;
  savings?: string;
  popular?: boolean;
}

export default function PropertyRenewalPage() {
  const params = useParams();
  const propertyId = params.id;
  const { toast } = useToast();

  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  const { data: inquiries = [] } = useQuery<Inquiry[]>({
    queryKey: [`/api/properties/${propertyId}/inquiries`],
    enabled: !!propertyId,
  });

  const { data: subscription } = useQuery<SellerSubscription & { package?: Package }>({
    queryKey: ["/api/me/subscription"],
  });

  const renewalMutation = useMutation({
    mutationFn: async (months: number) => {
      return apiRequest("POST", `/api/properties/${propertyId}/renew`, { months });
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/subscription"] });
      toast({ title: "Renewal initiated successfully!" });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      }
    },
    onError: () => {
      toast({ title: "Failed to renew listing", variant: "destructive" });
    },
  });

  const handleRenew = (months: number) => {
    if (!propertyId) {
      toast({ title: "Property ID is missing", variant: "destructive" });
      return;
    }
    renewalMutation.mutate(months);
  };

  const renewalOptions: RenewalOption[] = [
    { duration: 1, price: 999 },
    { duration: 3, price: 2499, savings: "Save ₹500", popular: true },
    { duration: 6, price: 4499, savings: "Save ₹1,500" },
  ];

  const formatPrice = (price: number) => {
    return `₹${price.toLocaleString("en-IN")}`;
  };

  if (propertyLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-48 mb-8" />
          <Skeleton className="h-32 mb-4" />
          <Skeleton className="h-32 mb-4" />
          <Skeleton className="h-32" />
        </div>
      </main>
    );
  }

  const packageName = subscription?.package?.name || "Basic";
  const expiryDate = subscription?.endDate ? new Date(subscription.endDate) : null;
  const daysLeft = expiryDate ? Math.max(0, differenceInDays(expiryDate, new Date())) : 0;
  const views = property?.viewCount || 0;
  const inquiriesCount = inquiries.length;

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <RotateCcw className="h-8 w-8 text-primary" />
              Renew Listing
            </h1>
            <p className="text-muted-foreground">
              Extend your property listing
            </p>
          </div>

          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="font-semibold text-lg mb-1">{property?.title || "Property"}</h3>
                <p className="text-sm text-muted-foreground">
                  Current Package: {packageName}
                </p>
              </div>
              <Badge
                className={
                  daysLeft < 7
                    ? "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"
                    : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"
                }
              >
                {daysLeft} days left
              </Badge>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Total Views</p>
                <p className="font-semibold text-xl">{views.toLocaleString()}</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Inquiries</p>
                <p className="font-semibold text-xl">{inquiriesCount}</p>
              </div>
            </div>
          </Card>

          <div className="space-y-4 mb-8">
            {renewalOptions.map((option, index) => (
              <Card
                key={index}
                className={`p-6 ${
                  option.popular ? "border-primary border-2" : ""
                }`}
              >
                {option.popular && (
                  <Badge className="mb-3">Most Popular</Badge>
                )}
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold text-lg mb-1">
                      {option.duration} Month{option.duration > 1 ? "s" : ""}
                    </h3>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-bold text-primary">
                        {formatPrice(option.price)}
                      </span>
                      {option.savings && (
                        <span className="text-sm text-green-600">
                          {option.savings}
                        </span>
                      )}
                    </div>
                  </div>
                  <Button
                    variant={option.popular ? "default" : "outline"}
                    data-testid={`button-renew-${index}`}
                    onClick={() => handleRenew(option.duration)}
                    disabled={renewalMutation.isPending}
                  >
                    {renewalMutation.isPending ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      "Select"
                    )}
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
