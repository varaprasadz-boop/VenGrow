import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, ExternalLink, Link as LinkIcon } from "lucide-react";
import type { NavigationLink } from "@shared/schema";

const SECTIONS = ["main", "quick_links", "for_sellers", "legal"];

const filters: FilterConfig[] = [
  { key: "search", label: "Label/URL", type: "search", placeholder: "Search links..." },
  { 
    key: "section", 
    label: "Section", 
    type: "select",
    options: SECTIONS.map(s => ({ value: s, label: s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) }))
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Visible" },
      { value: "inactive", label: "Hidden" },
    ]
  }
];

export default function NavigationLinksPage() {
  const [editingLink, setEditingLink] = useState<NavigationLink | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    label: "", url: "", section: "quick_links", sortOrder: 0, isActive: true, icon: "", openInNewTab: false
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: links = [], isLoading, isError, refetch } = useQuery<NavigationLink[]>({
    queryKey: ["/api/admin/navigation-links"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/navigation-links", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation-links"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Link created successfully" });
    },
    onError: () => toast({ title: "Failed to create link", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/navigation-links/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation-links"] });
      setIsDialogOpen(false);
      setEditingLink(null);
      resetForm();
      toast({ title: "Link updated successfully" });
    },
    onError: () => toast({ title: "Failed to update link", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/navigation-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation-links"] });
      toast({ title: "Link deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete link", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ label: "", url: "", section: "quick_links", sortOrder: 0, isActive: true, icon: "", openInNewTab: false });
  };

  const openEditDialog = (link: NavigationLink) => {
    setEditingLink(link);
    setFormData({
      label: link.label,
      url: link.url,
      section: link.section,
      sortOrder: link.sortOrder || 0,
      isActive: link.isActive ?? true,
      icon: link.icon || "",
      openInNewTab: link.openInNewTab ?? false,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingLink(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingLink) {
      updateMutation.mutate({ id: editingLink.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<NavigationLink>[] = [
    {
      key: "label",
      header: "Label",
      render: (link) => (
        <div className="flex items-center gap-2">
          <LinkIcon className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{link.label}</span>
        </div>
      ),
    },
    { 
      key: "url", 
      header: "URL",
      render: (link) => (
        <div className="flex items-center gap-1">
          <span className="text-muted-foreground truncate max-w-[200px]">{link.url}</span>
          {link.openInNewTab && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
        </div>
      )
    },
    { 
      key: "section", 
      header: "Section",
      render: (link) => (
        <span className="capitalize">{link.section.replace(/_/g, " ")}</span>
      )
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "isActive",
      header: "Status",
      render: (link) => <StatusBadge active={link.isActive ?? true} activeLabel="Active" inactiveLabel="Inactive" />,
    },
  ];

  const filterFn = (link: NavigationLink, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      link.label.toLowerCase().includes(filters.search.toLowerCase()) ||
      link.url.toLowerCase().includes(filters.search.toLowerCase());
    
    const sectionMatch = !filters.section || filters.section === "all" || link.section === filters.section;
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && link.isActive) ||
      (filters.status === "inactive" && !link.isActive);
    
    return searchMatch && sectionMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Navigation Links"
            description="Manage header and footer navigation links"
          />

          <AdminDataTable
            data={links}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Link"
            emptyMessage="No navigation links found."
            getRowKey={(link) => link.id}
            filterFn={filterFn}
            actions={(link) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(link)} data-testid={`button-edit-${link.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(link.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${link.id}`}
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
            <DialogTitle>{editingLink ? "Edit Link" : "Add New Link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="label">Label</Label>
              <Input
                id="label"
                value={formData.label}
                onChange={(e) => setFormData({ ...formData, label: e.target.value })}
                placeholder="e.g., About Us"
                data-testid="input-link-label"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={formData.url}
                onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                placeholder="e.g., /about or https://..."
                data-testid="input-link-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="section">Section</Label>
              <Select value={formData.section} onValueChange={(v) => setFormData({ ...formData, section: v })}>
                <SelectTrigger data-testid="select-link-section">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SECTIONS.map((section) => (
                    <SelectItem key={section} value={section}>
                      {section.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase())}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="icon">Icon (optional)</Label>
                <Input
                  id="icon"
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  placeholder="e.g., home"
                  data-testid="input-link-icon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-link-order"
                />
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-link-active"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="openInNewTab"
                  checked={formData.openInNewTab}
                  onCheckedChange={(checked) => setFormData({ ...formData, openInNewTab: checked })}
                  data-testid="switch-link-newtab"
                />
                <Label htmlFor="openInNewTab">Open in New Tab</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating} data-testid="button-save">
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingLink ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
