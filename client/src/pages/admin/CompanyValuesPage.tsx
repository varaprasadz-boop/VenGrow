import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, Target, Users, Award, TrendingUp, Shield, Heart, Lightbulb, Zap } from "lucide-react";

interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

const iconOptions = [
  { value: "users", label: "Users", icon: Users },
  { value: "target", label: "Target", icon: Target },
  { value: "award", label: "Award", icon: Award },
  { value: "trending-up", label: "Growth", icon: TrendingUp },
  { value: "shield", label: "Shield", icon: Shield },
  { value: "heart", label: "Heart", icon: Heart },
  { value: "lightbulb", label: "Lightbulb", icon: Lightbulb },
  { value: "zap", label: "Zap", icon: Zap },
];

const getIconComponent = (iconName: string) => {
  const option = iconOptions.find(o => o.value === iconName);
  if (option) {
    const IconComp = option.icon;
    return <IconComp className="h-5 w-5" />;
  }
  return <Target className="h-5 w-5" />;
};

const filters: FilterConfig[] = [
  { key: "search", label: "Title", type: "search", placeholder: "Search values..." },
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

export default function CompanyValuesPage() {
  const [editingValue, setEditingValue] = useState<CompanyValue | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    icon: "target",
    isActive: true,
    sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: values = [], isLoading, isError, refetch } = useQuery<CompanyValue[]>({
    queryKey: ["/api/admin/company-values"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/company-values", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-values"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Value created successfully" });
    },
    onError: () => toast({ title: "Failed to create value", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/company-values/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-values"] });
      setIsDialogOpen(false);
      setEditingValue(null);
      resetForm();
      toast({ title: "Value updated successfully" });
    },
    onError: () => toast({ title: "Failed to update value", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/company-values/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/company-values"] });
      toast({ title: "Value deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete value", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      icon: "target",
      isActive: true,
      sortOrder: 0
    });
  };

  const openEditDialog = (value: CompanyValue) => {
    setEditingValue(value);
    setFormData({
      title: value.title,
      description: value.description || "",
      icon: value.icon || "target",
      isActive: value.isActive ?? true,
      sortOrder: value.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingValue(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingValue) {
      updateMutation.mutate({ id: editingValue.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<CompanyValue>[] = [
    {
      key: "title",
      header: "Value",
      render: (value) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary">
            {getIconComponent(value.icon)}
          </div>
          <div>
            <p className="font-medium">{value.title}</p>
          </div>
        </div>
      ),
    },
    {
      key: "description",
      header: "Description",
      render: (value) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-sm">{value.description}</p>
      )
    },
    {
      key: "icon",
      header: "Icon",
      render: (value) => (
        <span className="text-sm capitalize">{value.icon || "target"}</span>
      )
    },
    { 
      key: "sortOrder", 
      header: "Order",
      render: (value) => <span>{value.sortOrder || 0}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (value) => <StatusBadge active={value.isActive ?? true} />,
    },
  ];

  const filterFn = (value: CompanyValue, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      value.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (value.description && value.description.toLowerCase().includes(filters.search.toLowerCase()));
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && value.isActive) ||
      (filters.status === "inactive" && !value.isActive);
    
    return searchMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Company Values"
            description="Manage company values displayed on the About page"
          />

          <AdminDataTable
            data={values}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Value"
            emptyMessage="No company values found. Add your first value to get started."
            getRowKey={(v) => v.id}
            filterFn={filterFn}
            actions={(value) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(value)} data-testid={`button-edit-${value.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(value.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${value.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          />
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingValue ? "Edit Company Value" : "Add New Company Value"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Customer First"
                data-testid="input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Describe this company value..."
                rows={3}
                data-testid="input-description"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="icon">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData({ ...formData, icon: value })}
              >
                <SelectTrigger data-testid="select-icon">
                  <SelectValue placeholder="Select an icon" />
                </SelectTrigger>
                <SelectContent>
                  {iconOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      <div className="flex items-center gap-2">
                        <option.icon className="h-4 w-4" />
                        <span>{option.label}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
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
              {editingValue ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
