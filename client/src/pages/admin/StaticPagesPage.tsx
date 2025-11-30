import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable, AdminPageHeader, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, FileText, Eye } from "lucide-react";
import type { StaticPage } from "@shared/schema";

const FOOTER_SECTIONS = ["company", "legal", "resources", "support"];

const filters: FilterConfig[] = [
  { key: "search", label: "Title/Slug", type: "search", placeholder: "Search pages..." },
  {
    key: "showIn",
    label: "Display",
    type: "select",
    options: [
      { value: "header", label: "In Header" },
      { value: "footer", label: "In Footer" },
      { value: "both", label: "Both" },
      { value: "none", label: "Hidden" },
    ]
  },
  {
    key: "footerSection",
    label: "Footer Section",
    type: "select",
    options: FOOTER_SECTIONS.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))
  }
];

export default function StaticPagesPage() {
  const [editingPage, setEditingPage] = useState<StaticPage | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", slug: "", content: "", metaTitle: "", metaDescription: "", 
    showInHeader: false, showInFooter: false, footerSection: "", sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: pages = [], isLoading, isError, refetch } = useQuery<StaticPage[]>({
    queryKey: ["/api/admin/static-pages"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/static-pages", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/static-pages"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Page created successfully" });
    },
    onError: () => toast({ title: "Failed to create page", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/static-pages/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/static-pages"] });
      setIsDialogOpen(false);
      setEditingPage(null);
      resetForm();
      toast({ title: "Page updated successfully" });
    },
    onError: () => toast({ title: "Failed to update page", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/static-pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/static-pages"] });
      toast({ title: "Page deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete page", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ 
      title: "", slug: "", content: "", metaTitle: "", metaDescription: "", 
      showInHeader: false, showInFooter: false, footerSection: "", sortOrder: 0 
    });
  };

  const openEditDialog = (page: StaticPage) => {
    setEditingPage(page);
    setFormData({
      title: page.title,
      slug: page.slug,
      content: page.content || "",
      metaTitle: page.metaTitle || "",
      metaDescription: page.metaDescription || "",
      showInHeader: page.showInHeader ?? false,
      showInFooter: page.showInFooter ?? false,
      footerSection: page.footerSection || "",
      sortOrder: page.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingPage(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingPage) {
      updateMutation.mutate({ id: editingPage.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<StaticPage>[] = [
    {
      key: "title",
      header: "Page",
      render: (page) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
            <FileText className="h-5 w-5 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium">{page.title}</p>
            <p className="text-sm text-muted-foreground">/{page.slug}</p>
          </div>
        </div>
      ),
    },
    { 
      key: "display", 
      header: "Display",
      render: (page) => (
        <div className="flex gap-1">
          {page.showInHeader && <Badge variant="secondary">Header</Badge>}
          {page.showInFooter && <Badge variant="secondary">Footer</Badge>}
          {!page.showInHeader && !page.showInFooter && <span className="text-muted-foreground">-</span>}
        </div>
      )
    },
    { 
      key: "content", 
      header: "Content",
      render: (page) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {page.content?.substring(0, 50) || "-"}{(page.content?.length || 0) > 50 ? "..." : ""}
        </span>
      )
    },
    { key: "sortOrder", header: "Order" },
  ];

  const filterFn = (page: StaticPage, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      page.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      page.slug.toLowerCase().includes(filters.search.toLowerCase());
    
    let showMatch = true;
    if (filters.showIn && filters.showIn !== "all") {
      if (filters.showIn === "header") showMatch = page.showInHeader === true;
      else if (filters.showIn === "footer") showMatch = page.showInFooter === true;
      else if (filters.showIn === "both") showMatch = page.showInHeader === true && page.showInFooter === true;
      else if (filters.showIn === "none") showMatch = !page.showInHeader && !page.showInFooter;
    }
    
    const sectionMatch = !filters.footerSection || filters.footerSection === "all" || 
      page.footerSection === filters.footerSection;
    
    return searchMatch && showMatch && sectionMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Static Pages"
            description="Manage About, Terms, Privacy and other static content pages"
          />

          <AdminDataTable
            data={pages}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Page"
            emptyMessage="No static pages found."
            getRowKey={(page) => page.id}
            filterFn={filterFn}
            actions={(page) => (
              <>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => window.open(`/${page.slug}`, "_blank")}
                  data-testid={`button-preview-${page.id}`}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(page)} data-testid={`button-edit-${page.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(page.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${page.id}`}
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
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingPage ? "Edit Page" : "Add New Page"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  placeholder="e.g., About Us"
                  data-testid="input-page-title"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">URL Slug</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="e.g., about-us"
                  data-testid="input-page-slug"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="footerSection">Footer Section</Label>
                <Input
                  id="footerSection"
                  value={formData.footerSection}
                  onChange={(e) => setFormData({ ...formData, footerSection: e.target.value })}
                  placeholder="e.g., legal, company"
                  data-testid="input-page-section"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-page-order"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Content (HTML)</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Enter page content (HTML supported)..."
                rows={10}
                className="font-mono text-sm"
                data-testid="input-page-content"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaTitle">Meta Title (SEO)</Label>
              <Input
                id="metaTitle"
                value={formData.metaTitle}
                onChange={(e) => setFormData({ ...formData, metaTitle: e.target.value })}
                placeholder="SEO title for search engines"
                data-testid="input-page-metatitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="metaDescription">Meta Description (SEO)</Label>
              <Textarea
                id="metaDescription"
                value={formData.metaDescription}
                onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                placeholder="SEO description for search engines"
                rows={2}
                data-testid="input-page-metadesc"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="showInHeader"
                  checked={formData.showInHeader}
                  onCheckedChange={(checked) => setFormData({ ...formData, showInHeader: checked })}
                  data-testid="switch-page-header"
                />
                <Label htmlFor="showInHeader">Show in Header</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="showInFooter"
                  checked={formData.showInFooter}
                  onCheckedChange={(checked) => setFormData({ ...formData, showInFooter: checked })}
                  data-testid="switch-page-footer"
                />
                <Label htmlFor="showInFooter">Show in Footer</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating} data-testid="button-save">
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingPage ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
