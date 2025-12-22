import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, MapPin } from "lucide-react";
import type { PopularCity } from "@shared/schema";

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh"
];

const filters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search cities..." },
  { 
    key: "state", 
    label: "State", 
    type: "select",
    options: INDIAN_STATES.map(s => ({ value: s, label: s }))
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]
  }
];

export default function PopularCitiesPage() {
  const [editingCity, setEditingCity] = useState<PopularCity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", slug: "", state: "", imageUrl: "", propertyCount: 0, isActive: true, sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cities = [], isLoading, isError, refetch } = useQuery<PopularCity[]>({
    queryKey: ["/api/admin/popular-cities"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/popular-cities", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popular-cities"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "City created successfully" });
    },
    onError: () => toast({ title: "Failed to create city", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/popular-cities/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popular-cities"] });
      setIsDialogOpen(false);
      setEditingCity(null);
      resetForm();
      toast({ title: "City updated successfully" });
    },
    onError: () => toast({ title: "Failed to update city", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/popular-cities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popular-cities"] });
      toast({ title: "City deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete city", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", state: "", imageUrl: "", propertyCount: 0, isActive: true, sortOrder: 0 });
  };

  const openEditDialog = (city: PopularCity) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      slug: city.slug,
      state: city.state || "",
      imageUrl: city.imageUrl || "",
      propertyCount: city.propertyCount || 0,
      isActive: city.isActive ?? true,
      sortOrder: city.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingCity(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingCity) {
      updateMutation.mutate({ id: editingCity.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<PopularCity>[] = [
    {
      key: "name",
      header: "City",
      render: (city) => (
        <div className="flex items-center gap-3">
          {city.imageUrl ? (
            <img src={city.imageUrl} alt={city.name} className="h-10 w-10 rounded object-cover" />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
              <MapPin className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{city.name}</p>
            <p className="text-sm text-muted-foreground">/{city.slug}</p>
          </div>
        </div>
      ),
    },
    { key: "state", header: "State" },
    { 
      key: "propertyCount", 
      header: "Properties",
      render: (city) => <span>{city.propertyCount || 0}</span>
    },
    { 
      key: "sortOrder", 
      header: "Order",
      render: (city) => <span>{city.sortOrder || 0}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (city) => <StatusBadge active={city.isActive ?? true} />,
    },
  ];

  const filterFn = (city: PopularCity, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      city.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      city.slug.toLowerCase().includes(filters.search.toLowerCase());
    
    const stateMatch = !filters.state || filters.state === "all" || city.state === filters.state;
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && city.isActive) ||
      (filters.status === "inactive" && !city.isActive);
    
    return searchMatch && stateMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Popular Cities"
            description="Manage featured cities displayed on the homepage"
          />

          <AdminDataTable
            data={cities}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add City"
            emptyMessage="No cities found. Add your first city to get started."
            getRowKey={(city) => city.id}
            filterFn={filterFn}
            actions={(city) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(city)} data-testid={`button-edit-${city.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(city.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${city.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          />
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCity ? "Edit City" : "Add New City"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">City Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g., Mumbai"
                data-testid="input-city-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., mumbai"
                data-testid="input-city-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state">State</Label>
              <Input
                id="state"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                placeholder="e.g., Maharashtra"
                data-testid="input-city-state"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                data-testid="input-city-image"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="propertyCount">Property Count</Label>
                <Input
                  id="propertyCount"
                  type="number"
                  value={formData.propertyCount}
                  onChange={(e) => setFormData({ ...formData, propertyCount: parseInt(e.target.value) || 0 })}
                  data-testid="input-city-count"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-city-order"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-city-active"
              />
              <Label htmlFor="isActive">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating} data-testid="button-save">
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCity ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
