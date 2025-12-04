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
import { Edit, Trash2, Loader2, Building2, BadgeCheck } from "lucide-react";

interface VerifiedBuilder {
  id: string;
  companyName: string;
  slug: string;
  logoUrl: string;
  description: string;
  propertyCount: number;
  establishedYear: number;
  website: string;
  isVerified: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

const filters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search builders..." },
  {
    key: "verified",
    label: "Verification",
    type: "select",
    options: [
      { value: "verified", label: "Verified" },
      { value: "unverified", label: "Unverified" },
    ]
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

export default function VerifiedBuildersPage() {
  const [editingBuilder, setEditingBuilder] = useState<VerifiedBuilder | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    slug: "",
    logoUrl: "",
    description: "",
    propertyCount: 0,
    establishedYear: new Date().getFullYear(),
    website: "",
    isVerified: true,
    isActive: true,
    sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: builders = [], isLoading, isError, refetch } = useQuery<VerifiedBuilder[]>({
    queryKey: ["/api/admin/verified-builders"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/verified-builders", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verified-builders"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Builder created successfully" });
    },
    onError: () => toast({ title: "Failed to create builder", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/verified-builders/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verified-builders"] });
      setIsDialogOpen(false);
      setEditingBuilder(null);
      resetForm();
      toast({ title: "Builder updated successfully" });
    },
    onError: () => toast({ title: "Failed to update builder", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/verified-builders/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verified-builders"] });
      toast({ title: "Builder deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete builder", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      companyName: "",
      slug: "",
      logoUrl: "",
      description: "",
      propertyCount: 0,
      establishedYear: new Date().getFullYear(),
      website: "",
      isVerified: true,
      isActive: true,
      sortOrder: 0
    });
  };

  const openEditDialog = (builder: VerifiedBuilder) => {
    setEditingBuilder(builder);
    setFormData({
      companyName: builder.companyName,
      slug: builder.slug || "",
      logoUrl: builder.logoUrl || "",
      description: builder.description || "",
      propertyCount: builder.propertyCount || 0,
      establishedYear: builder.establishedYear || new Date().getFullYear(),
      website: builder.website || "",
      isVerified: builder.isVerified ?? true,
      isActive: builder.isActive ?? true,
      sortOrder: builder.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBuilder(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingBuilder) {
      updateMutation.mutate({ id: editingBuilder.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<VerifiedBuilder>[] = [
    {
      key: "companyName",
      header: "Builder",
      render: (builder) => (
        <div className="flex items-center gap-3">
          {builder.logoUrl ? (
            <img src={builder.logoUrl} alt={builder.companyName} className="h-10 w-10 rounded object-contain bg-white p-1" />
          ) : (
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
              <Building2 className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{builder.companyName}</p>
              {builder.isVerified && <BadgeCheck className="h-4 w-4 text-blue-500" />}
            </div>
            <p className="text-sm text-muted-foreground">/{builder.slug}</p>
          </div>
        </div>
      ),
    },
    {
      key: "propertyCount",
      header: "Properties",
      render: (builder) => <span>{builder.propertyCount || 0}</span>
    },
    {
      key: "establishedYear",
      header: "Established",
      render: (builder) => <span>{builder.establishedYear || "-"}</span>
    },
    {
      key: "website",
      header: "Website",
      render: (builder) => builder.website ? (
        <a href={builder.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
          Visit
        </a>
      ) : <span className="text-muted-foreground">-</span>
    },
    { 
      key: "sortOrder", 
      header: "Order",
      render: (builder) => <span>{builder.sortOrder || 0}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (builder) => <StatusBadge active={builder.isActive ?? true} />,
    },
  ];

  const filterFn = (builder: VerifiedBuilder, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      builder.companyName.toLowerCase().includes(filters.search.toLowerCase());
    
    const verifiedMatch = !filters.verified || filters.verified === "all" ||
      (filters.verified === "verified" && builder.isVerified) ||
      (filters.verified === "unverified" && !builder.isVerified);
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && builder.isActive) ||
      (filters.status === "inactive" && !builder.isActive);
    
    return searchMatch && verifiedMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Verified Builders"
            description="Manage verified builders and developers displayed on the homepage"
          />

          <AdminDataTable
            data={builders}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Builder"
            emptyMessage="No builders found. Add your first verified builder to get started."
            getRowKey={(b) => b.id}
            filterFn={filterFn}
            actions={(builder) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(builder)} data-testid={`button-edit-${builder.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(builder.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${builder.id}`}
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
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingBuilder ? "Edit Builder" : "Add New Builder"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  companyName: e.target.value,
                  slug: e.target.value.toLowerCase().replace(/\s+/g, "-")
                })}
                placeholder="e.g., Prestige Group"
                data-testid="input-company-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="slug">URL Slug</Label>
              <Input
                id="slug"
                value={formData.slug}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                placeholder="e.g., prestige-group"
                data-testid="input-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="logoUrl">Logo URL</Label>
              <Input
                id="logoUrl"
                value={formData.logoUrl}
                onChange={(e) => setFormData({ ...formData, logoUrl: e.target.value })}
                placeholder="https://..."
                data-testid="input-logo-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of the builder..."
                rows={3}
                data-testid="input-description"
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
                  data-testid="input-property-count"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="establishedYear">Established Year</Label>
                <Input
                  id="establishedYear"
                  type="number"
                  value={formData.establishedYear}
                  onChange={(e) => setFormData({ ...formData, establishedYear: parseInt(e.target.value) || new Date().getFullYear() })}
                  data-testid="input-established-year"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://..."
                data-testid="input-website"
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-sort-order"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isVerified"
                  checked={formData.isVerified}
                  onCheckedChange={(checked) => setFormData({ ...formData, isVerified: checked })}
                  data-testid="switch-verified"
                />
                <Label htmlFor="isVerified">Verified</Label>
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-active"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating} data-testid="button-save">
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingBuilder ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
