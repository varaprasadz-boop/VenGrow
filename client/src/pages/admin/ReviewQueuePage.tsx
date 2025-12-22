import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  ClipboardList,
  Eye,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Building,
  Users,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Property, SellerProfile } from "@shared/schema";

function formatPrice(amount: number): string {
  if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(2)} Cr`;
  if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} L`;
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function ReviewQueuePage() {
  const { data: pendingProperties = [], isLoading: loadingProps } = useQuery<Property[]>({
    queryKey: ["/api/admin/properties/pending"],
  });

  const { data: pendingSellers = [], isLoading: loadingSellers } = useQuery<SellerProfile[]>({
    queryKey: ["/api/admin/sellers/pending"],
  });

  const isLoading = loadingProps || loadingSellers;

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <ClipboardList className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Review Queue</h1>
              <p className="text-muted-foreground">Items awaiting your review</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Building className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingProperties.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Properties</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingSellers.length}</p>
                  <p className="text-sm text-muted-foreground">Pending Sellers</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <Tabs defaultValue="properties">
              <TabsList className="mb-4">
                <TabsTrigger value="properties" data-testid="tab-properties">
                  Properties ({pendingProperties.length})
                </TabsTrigger>
                <TabsTrigger value="sellers" data-testid="tab-sellers">
                  Sellers ({pendingSellers.length})
                </TabsTrigger>
              </TabsList>

              <TabsContent value="properties">
                {pendingProperties.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="text-muted-foreground">No pending properties</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingProperties.map((property) => (
                      <div
                        key={property.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                        data-testid={`card-property-${property.id}`}
                      >
                        <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium truncate">{property.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {property.city}, {property.state} • {formatPrice(property.price)}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Submitted {formatDistanceToNow(new Date(property.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href={`/property/${property.id}`}>
                            <Button variant="outline" size="sm" data-testid={`button-review-${property.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              <TabsContent value="sellers">
                {pendingSellers.length === 0 ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p className="text-muted-foreground">No pending seller approvals</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingSellers.map((seller) => (
                      <div
                        key={seller.id}
                        className="flex items-center gap-4 p-4 rounded-lg border"
                        data-testid={`card-seller-${seller.id}`}
                      >
                        <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                          <Users className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium">{seller.companyName || "Individual Seller"}</h3>
                          <p className="text-sm text-muted-foreground capitalize">{seller.sellerType}</p>
                          <p className="text-xs text-muted-foreground">
                            Applied {formatDistanceToNow(new Date(seller.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Link href="/admin/seller-approvals">
                            <Button variant="outline" size="sm" data-testid={`button-review-${seller.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </Card>
        </div>
      </main>
    );
}
