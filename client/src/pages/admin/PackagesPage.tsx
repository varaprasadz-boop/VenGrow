import { useQuery, useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import {
  Package,
  Plus,
  Edit,
  CheckCircle,
  RefreshCw,
  AlertCircle,
  Star,
  IndianRupee,
  Calendar,
  Building,
} from "lucide-react";
interface SubscriptionPackage {
  id: string;
  name: string;
  price: number;
  listingLimit: number;
  durationDays: number;
  featuredListings: number;
  premiumSupport: boolean;
  isActive: boolean;
  isPopular: boolean;
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function PackagesPage() {
  const { toast } = useToast();
  const [addDialogOpen, setAddDialogOpen] = useState(false);

  const { data: packages = [], isLoading, isError, refetch } = useQuery<SubscriptionPackage[]>({
    queryKey: ["/api/packages"],
  });

  const handleAddPackage = () => {
    setAddDialogOpen(true);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-64 w-full" />
              ))}
            </div>
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Packages</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-3xl">Subscription Packages</h1>
                <p className="text-muted-foreground">Manage seller subscription tiers</p>
              </div>
            </div>
            <Button data-testid="button-add-package" onClick={handleAddPackage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {packages.map((pkg) => (
              <Card key={pkg.id} className={`p-6 relative ${pkg.isPopular ? 'ring-2 ring-primary' : ''}`} data-testid={`card-package-${pkg.id}`}>
                {pkg.isPopular && (
                  <Badge className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-primary">
                    <Star className="h-3 w-3 mr-1" />
                    Most Popular
                  </Badge>
                )}
                <div className="text-center mb-6">
                  <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-primary">
                    {pkg.price === 0 ? "Free" : formatPrice(pkg.price)}
                  </div>
                  {pkg.price > 0 && (
                    <p className="text-sm text-muted-foreground">+ GST</p>
                  )}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-2 text-sm">
                    <Building className="h-4 w-4 text-muted-foreground" />
                    <span>{pkg.listingLimit} Listings</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <span>{pkg.durationDays} Days</span>
                  </div>
                  {pkg.featuredListings > 0 && (
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{pkg.featuredListings} Featured Listings</span>
                    </div>
                  )}
                  {pkg.premiumSupport && (
                    <div className="flex items-center gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span>Premium Support</span>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <Badge variant={pkg.isActive ? "default" : "secondary"}>
                    {pkg.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Button variant="ghost" size="sm" data-testid={`button-edit-${pkg.id}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Add Package Dialog */}
        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Package</DialogTitle>
              <DialogDescription>
                Create a new subscription package for sellers
              </DialogDescription>
            </DialogHeader>
            <div className="py-4">
              <p className="text-muted-foreground">
                Package creation form will be implemented here. This feature is coming soon.
              </p>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={() => {
                toast({
                  title: "Coming Soon",
                  description: "Package creation feature is under development.",
                });
                setAddDialogOpen(false);
              }}>
                Create Package
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    );
}
