import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
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
  Trash2,
  Loader2,
} from "lucide-react";
import type { Package as PackageType } from "@shared/schema";

interface SubscriptionPackage extends PackageType {
  durationDays?: number;
  premiumSupport?: boolean;
}

function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

const sellerTypeOptions = [
  { value: "individual", label: "Individual" },
  { value: "broker", label: "Channel Partner / Broker" },
  { value: "builder", label: "Builder / Corporate" },
];

const planTierOptions = [
  { value: "Basic", label: "Basic" },
  { value: "Pro", label: "Pro" },
  { value: "Premium", label: "Premium" },
];

export default function PackagesPage() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<SubscriptionPackage | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [packageToDelete, setPackageToDelete] = useState<SubscriptionPackage | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    sellerType: "individual" as "individual" | "broker" | "builder",
    planTier: "Basic" as "Basic" | "Pro" | "Premium",
    price: 0,
    duration: 30,
    listingLimit: 3,
    featuredListings: 0,
    isPopular: false,
    isActive: true,
  });

  const { data: packages = [], isLoading, isError, refetch } = useQuery<SubscriptionPackage[]>({
    queryKey: ["/api/admin/packages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/packages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setAddDialogOpen(false);
      resetForm();
      toast({ title: "Package created successfully" });
    },
    onError: () => toast({ title: "Failed to create package", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/packages/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setAddDialogOpen(false);
      setEditingPackage(null);
      resetForm();
      toast({ title: "Package updated successfully" });
    },
    onError: () => toast({ title: "Failed to update package", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/packages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/packages"] });
      queryClient.invalidateQueries({ queryKey: ["/api/packages"] });
      setDeleteDialogOpen(false);
      setPackageToDelete(null);
      toast({ title: "Package deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete package", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      sellerType: "individual",
      planTier: "Basic",
      price: 0,
      duration: 30,
      listingLimit: 3,
      featuredListings: 0,
      isPopular: false,
      isActive: true,
    });
  };

  const handleAddPackage = () => {
    resetForm();
    setEditingPackage(null);
    setAddDialogOpen(true);
  };

  const handleEditPackage = (pkg: SubscriptionPackage) => {
    setFormData({
      name: pkg.name,
      description: pkg.description || "",
      sellerType: pkg.sellerType,
      planTier: pkg.planTier as "Basic" | "Pro" | "Premium",
      price: pkg.price,
      duration: pkg.duration,
      listingLimit: pkg.listingLimit,
      featuredListings: pkg.featuredListings,
      isPopular: pkg.isPopular,
      isActive: pkg.isActive,
    });
    setEditingPackage(pkg);
    setAddDialogOpen(true);
  };

  const handleDeletePackage = (pkg: SubscriptionPackage) => {
    setPackageToDelete(pkg);
    setDeleteDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingPackage) {
      updateMutation.mutate({ id: editingPackage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  // Group packages by sellerType
  const packagesBySellerType = packages.reduce((acc, pkg) => {
    const key = pkg.sellerType;
    if (!acc[key]) {
      acc[key] = [];
    }
    acc[key].push(pkg);
    return acc;
  }, {} as Record<string, SubscriptionPackage[]>);

  const getSellerTypeLabel = (sellerType: string) => {
    return sellerTypeOptions.find(opt => opt.value === sellerType)?.label || sellerType;
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

  const isMutating = createMutation.isPending || updateMutation.isPending;

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

        {/* Group packages by seller type */}
        {Object.entries(packagesBySellerType).map(([sellerType, sellerPackages]) => (
          <div key={sellerType} className="mb-12">
            <h2 className="font-serif font-bold text-2xl mb-6">
              {getSellerTypeLabel(sellerType)}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sellerPackages.map((pkg) => (
                <Card
                  key={pkg.id}
                  className={`p-6 relative flex flex-col ${pkg.isPopular ? 'ring-2 ring-primary' : ''}`}
                  data-testid={`card-package-${pkg.id}`}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-2.5 right-3 z-10">
                      <Badge className="bg-primary text-primary-foreground text-xs font-semibold shadow-sm flex items-center gap-1 px-2 py-0.5">
                        <Star className="h-3 w-3 fill-current" />
                        <span>Most Popular</span>
                      </Badge>
                    </div>
                  )}
                  <div className="text-center mb-6">
                    <h3 className="font-bold text-xl mb-2">{pkg.name}</h3>
                    <Badge variant="secondary" className="mb-2">{pkg.planTier}</Badge>
                    <div className="text-3xl font-bold text-primary mt-2">
                      {pkg.price === 0 ? "Free" : formatPrice(pkg.price)}
                    </div>
                    {pkg.price > 0 && (
                      <p className="text-sm text-muted-foreground">+ GST</p>
                    )}
                  </div>

                  <div className="space-y-3 mb-6 flex-grow">
                    <div className="flex items-center gap-2 text-sm">
                      <Building className="h-4 w-4 text-muted-foreground" />
                      <span>{pkg.listingLimit} Listings</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span>{pkg.duration} Days</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Star className="h-4 w-4 text-yellow-500" />
                      <span>{pkg.featuredListings} Featured Listings</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-auto pt-4 border-t">
                    <Badge variant={pkg.isActive ? "default" : "secondary"}>
                      {pkg.isActive ? "Active" : "Inactive"}
                    </Badge>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditPackage(pkg)}
                        data-testid={`button-edit-${pkg.id}`}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeletePackage(pkg)}
                        data-testid={`button-delete-${pkg.id}`}
                        className="h-8 w-8 p-0"
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {packages.length === 0 && (
          <div className="text-center py-12">
            <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h3 className="text-lg font-semibold mb-2">No packages found</h3>
            <p className="text-muted-foreground mb-4">Get started by creating your first package</p>
            <Button onClick={handleAddPackage}>
              <Plus className="h-4 w-4 mr-2" />
              Add Package
            </Button>
          </div>
        )}
      </div>

      {/* Add/Edit Package Dialog */}
      <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPackage ? "Edit Package" : "Add New Package"}</DialogTitle>
            <DialogDescription>
              {editingPackage
                ? "Update package details"
                : "Create a new subscription package for sellers"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sellerType">Seller Type *</Label>
                <Select
                  value={formData.sellerType}
                  onValueChange={(value) =>
                    setFormData({ ...formData, sellerType: value as typeof formData.sellerType })
                  }
                >
                  <SelectTrigger id="sellerType">
                    <SelectValue placeholder="Select seller type" />
                  </SelectTrigger>
                  <SelectContent>
                    {sellerTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="planTier">Plan Tier *</Label>
                <Select
                  value={formData.planTier}
                  onValueChange={(value) =>
                    setFormData({ ...formData, planTier: value as typeof formData.planTier })
                  }
                >
                  <SelectTrigger id="planTier">
                    <SelectValue placeholder="Select plan tier" />
                  </SelectTrigger>
                  <SelectContent>
                    {planTierOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Package Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Individual Basic"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Package description..."
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">Price (₹) *</Label>
                <Input
                  id="price"
                  type="number"
                  value={formData.price}
                  onChange={(e) =>
                    setFormData({ ...formData, price: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (Days) *</Label>
                <Input
                  id="duration"
                  type="number"
                  value={formData.duration}
                  onChange={(e) =>
                    setFormData({ ...formData, duration: parseInt(e.target.value) || 30 })
                  }
                  min="1"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="listingLimit">Listing Limit *</Label>
                <Input
                  id="listingLimit"
                  type="number"
                  value={formData.listingLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, listingLimit: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="featuredListings">Featured Listings *</Label>
                <Input
                  id="featuredListings"
                  type="number"
                  value={formData.featuredListings}
                  onChange={(e) =>
                    setFormData({ ...formData, featuredListings: parseInt(e.target.value) || 0 })
                  }
                  min="0"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPopular"
                  checked={formData.isPopular}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isPopular: checked })
                  }
                />
                <Label htmlFor="isPopular">Mark as Popular</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) =>
                    setFormData({ ...formData, isActive: checked })
                  }
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating}>
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPackage ? "Update Package" : "Create Package"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the package "{packageToDelete?.name}".
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => packageToDelete && deleteMutation.mutate(packageToDelete.id)}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleteMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}