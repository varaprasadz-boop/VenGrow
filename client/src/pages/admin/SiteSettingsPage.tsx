import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminDataTable, AdminPageHeader, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, Settings, Copy, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { SiteSetting } from "@shared/schema";

const SETTING_TYPES = ["text", "textarea", "number", "boolean", "json", "url", "email", "phone"];

const filters: FilterConfig[] = [
  { key: "search", label: "Key/Label", type: "search", placeholder: "Search settings..." },
  { 
    key: "type", 
    label: "Type", 
    type: "select",
    options: SETTING_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))
  },
  { 
    key: "group", 
    label: "Group", 
    type: "select",
    options: [
      { value: "general", label: "General" },
      { value: "contact", label: "Contact" },
      { value: "social", label: "Social" },
      { value: "seo", label: "SEO" },
      { value: "branding", label: "Branding" },
    ]
  }
];

export default function SiteSettingsPage() {
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    key: "", value: "", label: "", type: "text", description: "", category: "general"
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: settings = [], isLoading, isError, refetch } = useQuery<SiteSetting[]>({
    queryKey: ["/api/admin/site-settings"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/site-settings", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Setting created successfully" });
    },
    onError: () => toast({ title: "Failed to create setting", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/site-settings/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      setIsDialogOpen(false);
      setEditingSetting(null);
      resetForm();
      toast({ title: "Setting updated successfully" });
    },
    onError: () => toast({ title: "Failed to update setting", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/site-settings/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      toast({ title: "Setting deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete setting", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ key: "", value: "", label: "", type: "text", description: "", category: "general" });
  };

  const openEditDialog = (setting: SiteSetting) => {
    setEditingSetting(setting);
    setFormData({
      key: setting.key,
      value: setting.value || "",
      label: setting.label || "",
      type: setting.type || "text",
      description: setting.description || "",
      category: setting.category || "general",
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSetting(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingSetting) {
      updateMutation.mutate({ id: editingSetting.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const copyKey = (key: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const columns: ColumnConfig<SiteSetting>[] = [
    {
      key: "key",
      header: "Key",
      render: (setting) => (
        <div className="flex items-center gap-2">
          <code className="text-sm bg-muted px-2 py-1 rounded font-mono">{setting.key}</code>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-6 w-6"
            onClick={() => copyKey(setting.key)}
            data-testid={`button-copy-${setting.id}`}
          >
            {copiedKey === setting.key ? (
              <Check className="h-3 w-3 text-green-500" />
            ) : (
              <Copy className="h-3 w-3" />
            )}
          </Button>
        </div>
      ),
    },
    { 
      key: "label", 
      header: "Label",
      render: (setting) => <span className="font-medium">{setting.label || setting.key}</span>
    },
    { 
      key: "value", 
      header: "Value",
      render: (setting) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {setting.value?.substring(0, 50) || "-"}{(setting.value?.length || 0) > 50 ? "..." : ""}
        </span>
      )
    },
    { 
      key: "type", 
      header: "Type",
      render: (setting) => (
        <Badge variant="secondary" className="capitalize">{setting.type || "text"}</Badge>
      )
    },
    { 
      key: "category", 
      header: "Category",
      render: (setting) => (
        <span className="capitalize">{setting.category || "general"}</span>
      )
    },
  ];

  const filterFn = (setting: SiteSetting, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      setting.key.toLowerCase().includes(filters.search.toLowerCase()) ||
      (setting.label || "").toLowerCase().includes(filters.search.toLowerCase());
    
    const typeMatch = !filters.type || filters.type === "all" || setting.type === filters.type;
    const categoryMatch = !filters.group || filters.group === "all" || setting.category === filters.group;
    
    return searchMatch && typeMatch && categoryMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Site Settings"
            description="Manage global site configuration and settings"
          />

          <AdminDataTable
            data={settings}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Setting"
            emptyMessage="No site settings found."
            getRowKey={(setting) => setting.id}
            filterFn={filterFn}
            actions={(setting) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(setting)} data-testid={`button-edit-${setting.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(setting.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${setting.id}`}
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
            <DialogTitle>{editingSetting ? "Edit Setting" : "Add New Setting"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="key">Key</Label>
              <Input
                id="key"
                value={formData.key}
                onChange={(e) => setFormData({ ...formData, key: e.target.value.toLowerCase().replace(/\s+/g, "_") })}
                placeholder="e.g., site_name"
                disabled={!!editingSetting}
                data-testid="input-setting-key"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., Site Name"
                data-testid="input-setting-label"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select value={formData.type} onValueChange={(v) => setFormData({ ...formData, type: v })}>
                  <SelectTrigger data-testid="select-setting-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {SETTING_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger data-testid="select-setting-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="general">General</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="social">Social</SelectItem>
                    <SelectItem value="seo">SEO</SelectItem>
                    <SelectItem value="branding">Branding</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="value">Value</Label>
              {formData.type === "textarea" || formData.type === "json" ? (
                <Textarea
                  id="value"
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter value..."
                  rows={4}
                  data-testid="input-setting-value"
                />
              ) : (
                <Input
                  id="value"
                  type={formData.type === "number" ? "number" : "text"}
                  value={formData.value}
                  onChange={(e) => setFormData({ ...formData, value: e.target.value })}
                  placeholder="Enter value..."
                  data-testid="input-setting-value"
                />
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description (optional)</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Brief description of this setting"
                data-testid="input-setting-description"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating} data-testid="button-save">
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingSetting ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
