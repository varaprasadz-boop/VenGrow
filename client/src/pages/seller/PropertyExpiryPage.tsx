import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertTriangle, Clock, RefreshCw, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { differenceInDays, format } from "date-fns";
import type { Property, SellerSubscription, Package, Inquiry } from "@shared/schema";

interface PropertyWithExpiry extends Property {
  daysLeft?: number;
  expiryDate?: Date;
  inquiries?: Inquiry[];
}

export default function PropertyExpiryPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/properties"],
  });

  const { data: subscription } = useQuery<SellerSubscription & { package?: Package }>({
    queryKey: ["/api/me/subscription"],
  });

  const renewalMutation = useMutation({
    mutationFn: async ({ propertyId, months }: { propertyId: string; months: number }) => {
      return apiRequest("POST", `/api/properties/${propertyId}/renew`, { months });
    },
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/subscription"] });
      toast({ title: "Renewal initiated successfully!" });
      if (data.paymentUrl) {
        window.location.href = data.paymentUrl;
      } else {
        setLocation(`/seller/listings/renew/${variables.propertyId}`);
      }
    },
    onError: () => {
      toast({ title: "Failed to renew listing", variant: "destructive" });
    },
  });

  const reactivateMutation = useMutation({
    mutationFn: async (propertyId: string) => {
      return apiRequest("PATCH", `/api/properties/${propertyId}`, { status: "active" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/properties"] });
      toast({ title: "Property reactivated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to reactivate property", variant: "destructive" });
    },
  });

  const handleRenew = (propertyId: string) => {
    setLocation(`/seller/listings/renew/${propertyId}`);
  };

  const handleRenewAll = () => {
    if (expiringProperties.length === 0) return;
    const firstProperty = expiringProperties[0];
    handleRenew(firstProperty.id);
  };

  const handleReactivate = (propertyId: string) => {
    reactivateMutation.mutate(propertyId);
  };

  // Calculate expiry for each property
  const now = new Date();
  const expiryDate = subscription?.endDate ? new Date(subscription.endDate) : null;
  const daysLeft = expiryDate ? Math.max(0, differenceInDays(expiryDate, now)) : 0;

  const propertiesWithExpiry: PropertyWithExpiry[] = properties.map(p => ({
    ...p,
    daysLeft,
    expiryDate: expiryDate || undefined,
  }));

  const expiringProperties = propertiesWithExpiry.filter(p => 
    p.daysLeft !== undefined && p.daysLeft > 0 && p.daysLeft <= 30 && p.status === "active"
  );

  const expiredProperties = propertiesWithExpiry.filter(p => 
    (p.daysLeft === 0 || p.status === "inactive") && p.workflowStatus !== "draft"
  );

  const isLoading = propertiesLoading;

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-48 mb-4" />
          <Skeleton className="h-48 mb-8" />
          <Skeleton className="h-32 mb-4" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Expiry Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and renew your property listings
            </p>
          </div>

          {/* Expiring Soon */}
          {expiringProperties.length > 0 && (
            <div className="mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="font-semibold text-xl flex items-center gap-2">
                  <Clock className="h-5 w-5 text-orange-600" />
                  Expiring Soon
                </h2>
                {expiringProperties.length > 1 && (
                  <Button variant="outline" onClick={handleRenewAll} data-testid="button-renew-all">
                    Renew All
                  </Button>
                )}
              </div>
              <div className="space-y-4">
                {expiringProperties.map((property) => (
                  <Card key={property.id} className="p-6 border-orange-200 dark:border-orange-900/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {property.title}
                          </h3>
                          <Badge className="bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-500">
                            {property.daysLeft} days left
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {property.locality || ''}, {property.city}
                        </p>
                        <div className="grid grid-cols-3 gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">
                              Views
                            </p>
                            <p className="font-semibold">{(property.viewCount || 0).toLocaleString()}</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">
                              Inquiries
                            </p>
                            <p className="font-semibold">{property.inquiryCount || 0}</p>
                          </div>
                          <div className="p-3 bg-muted rounded-lg">
                            <p className="text-xs text-muted-foreground mb-1">
                              Expires On
                            </p>
                            <p className="font-semibold text-xs">
                              {property.expiryDate ? format(property.expiryDate, "MMM dd, yyyy") : "N/A"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button
                      className="w-full"
                      data-testid={`button-renew-${property.id}`}
                      onClick={() => handleRenew(property.id)}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Renew Listing
                    </Button>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Expired */}
          {expiredProperties.length > 0 && (
            <div>
              <h2 className="font-semibold text-xl mb-4 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                Expired Listings
              </h2>
              <div className="space-y-4">
                {expiredProperties.map((property) => (
                  <Card key={property.id} className="p-6 border-red-200 dark:border-red-900/20 bg-red-50 dark:bg-red-900/5">
                    <div className="flex items-start justify-between">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">
                            {property.title}
                          </h3>
                          <Badge variant="destructive">Expired</Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-4">
                          {property.locality || ''}, {property.city}
                        </p>
                        {property.expiryDate && (
                          <p className="text-xs text-muted-foreground">
                            Expired on {format(property.expiryDate, "MMM dd, yyyy")}
                          </p>
                        )}
                      </div>
                      <Button
                        size="sm"
                        data-testid={`button-reactivate-${property.id}`}
                        onClick={() => handleReactivate(property.id)}
                        disabled={reactivateMutation.isPending}
                      >
                        {reactivateMutation.isPending ? (
                          <>
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                            Processing...
                          </>
                        ) : (
                          "Reactivate"
                        )}
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {expiringProperties.length === 0 && expiredProperties.length === 0 && (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-lg mb-2">No Expiring or Expired Properties</h3>
              <p className="text-muted-foreground">
                All your listings are active and up to date.
              </p>
            </Card>
          )}
        </div>
      </main>
  );
}
