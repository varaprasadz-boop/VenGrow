import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, Building2 } from "lucide-react";
import type { PropertyTypeManaged } from "@shared/schema";

const filters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search property types..." },
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

export default function PropertyTypesPage() {
  const [editingType, setEditingType] = useState<PropertyTypeManaged | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", slug: "", icon: "", description: "", isActive: true, sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: propertyTypes = [], isLoading, isError, refetch } = useQuery<PropertyTypeManaged[]>({
    queryKey: ["/api/admin/property-types"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/property-types", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-types"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Property type created successfully" });
    },
    onError: () => toast({ title: "Failed to create property type", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/property-types/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-types"] });
      setIsDialogOpen(false);
      setEditingType(null);
      resetForm();
      toast({ title: "Property type updated successfully" });
    },
    onError: () => toast({ title: "Failed to update property type", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/property-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-types"] });
      toast({ title: "Property type deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete property type", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", icon: "", description: "", isActive: true, sortOrder: 0 });
  };

  const openEditDialog = (type: PropertyTypeManaged) => {
    setEditingType(type);
    setFormData({
      name: type.name,
      slug: type.slug,
      icon: type.icon || "",
      description: type.description || "",
      isActive: type.isActive ?? true,
      sortOrder: type.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingType(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingType) {
      updateMutation.mutate({ id: editingType.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<PropertyTypeManaged>[] = [
    {
      key: "name",
      header: "Property Type",
      render: (type) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
            <Building2 className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{type.name}</p>
            <p className="text-sm text-muted-foreground">/{type.slug}</p>
          </div>
        </div>
      ),
    },
    { 
      key: "description", 
      header: "Description",
      render: (type) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {type.description || "-"}
        </span>
      )
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "isActive",
      header: "Status",
      render: (type) => <StatusBadge active={type.isActive ?? true} />,
    },
  ];

  const filterFn = (type: PropertyTypeManaged, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      type.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      type.slug.toLowerCase().includes(filters.search.toLowerCase());
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && type.isActive) ||
      (filters.status === "inactive" && !type.isActive);
    
    return searchMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Property Types"
            description="Manage property type categories and classifications"
          />

          <AdminDataTable
            data={propertyTypes}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Type"
            emptyMessage="No property types found."
            getRowKey={(type) => type.id}
            filterFn={filterFn}
            actions={(type) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(type)} data-testid={`button-edit-${type.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(type.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${type.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          />
        </div>
      </main>

      <Footer />

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingType ? "Edit Property Type" : "Add New Property Type"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g., Apartment"
                data-testid="input-type-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., apartment"
                data-testid="input-type-slug"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., building"
                  data-testid="input-type-icon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-type-order"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this property type"
                rows={3}
                data-testid="input-type-description"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-type-active"
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
              {editingType ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
