import { useState } from "react";
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
import { Edit, Trash2, Loader2, Image, ExternalLink } from "lucide-react";

interface HeroSlide {
  id: string;
  title: string;
  subtitle: string;
  imageUrl: string;
  buttonText: string;
  buttonLink: string;
  overlayOpacity: number;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

const filters: FilterConfig[] = [
  { key: "search", label: "Title", type: "search", placeholder: "Search slides..." },
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

export default function HeroSlidesPage() {
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    subtitle: "",
    imageUrl: "",
    buttonText: "",
    buttonLink: "",
    overlayOpacity: 50,
    isActive: true,
    sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: slides = [], isLoading, isError, refetch } = useQuery<HeroSlide[]>({
    queryKey: ["/api/admin/hero-slides"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/hero-slides", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-slides"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Slide created successfully" });
    },
    onError: () => toast({ title: "Failed to create slide", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/hero-slides/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-slides"] });
      setIsDialogOpen(false);
      setEditingSlide(null);
      resetForm();
      toast({ title: "Slide updated successfully" });
    },
    onError: () => toast({ title: "Failed to update slide", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/hero-slides/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/hero-slides"] });
      toast({ title: "Slide deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete slide", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      subtitle: "",
      imageUrl: "",
      buttonText: "",
      buttonLink: "",
      overlayOpacity: 50,
      isActive: true,
      sortOrder: 0
    });
  };

  const openEditDialog = (slide: HeroSlide) => {
    setEditingSlide(slide);
    setFormData({
      title: slide.title,
      subtitle: slide.subtitle || "",
      imageUrl: slide.imageUrl || "",
      buttonText: slide.buttonText || "",
      buttonLink: slide.buttonLink || "",
      overlayOpacity: slide.overlayOpacity || 50,
      isActive: slide.isActive ?? true,
      sortOrder: slide.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingSlide(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingSlide) {
      updateMutation.mutate({ id: editingSlide.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<HeroSlide>[] = [
    {
      key: "title",
      header: "Slide",
      render: (slide) => (
        <div className="flex items-center gap-3">
          {slide.imageUrl ? (
            <img src={slide.imageUrl} alt={slide.title} className="h-12 w-20 rounded object-cover" />
          ) : (
            <div className="h-12 w-20 rounded bg-muted flex items-center justify-center">
              <Image className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium line-clamp-1">{slide.title}</p>
            <p className="text-sm text-muted-foreground line-clamp-1">{slide.subtitle}</p>
          </div>
        </div>
      ),
    },
    {
      key: "buttonText",
      header: "CTA Button",
      render: (slide) => slide.buttonText ? (
        <div className="flex items-center gap-1 text-sm">
          <span>{slide.buttonText}</span>
          {slide.buttonLink && <ExternalLink className="h-3 w-3 text-muted-foreground" />}
        </div>
      ) : <span className="text-muted-foreground">-</span>
    },
    {
      key: "overlayOpacity",
      header: "Overlay",
      render: (slide) => <span>{slide.overlayOpacity || 50}%</span>
    },
    { 
      key: "sortOrder", 
      header: "Order",
      render: (slide) => <span>{slide.sortOrder || 0}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (slide) => <StatusBadge active={slide.isActive ?? true} />,
    },
  ];

  const filterFn = (slide: HeroSlide, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      slide.title.toLowerCase().includes(filters.search.toLowerCase()) ||
      (slide.subtitle && slide.subtitle.toLowerCase().includes(filters.search.toLowerCase()));
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && slide.isActive) ||
      (filters.status === "inactive" && !slide.isActive);
    
    return searchMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Hero Slides"
            description="Manage homepage hero banner slides, images, and text"
          />

          <AdminDataTable
            data={slides}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Slide"
            emptyMessage="No hero slides found. Add your first slide to get started."
            getRowKey={(s) => s.id}
            filterFn={filterFn}
            actions={(slide) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(slide)} data-testid={`button-edit-${slide.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(slide.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${slide.id}`}
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
            <DialogTitle>{editingSlide ? "Edit Slide" : "Add New Slide"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., Find Your Dream Property"
                data-testid="input-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="subtitle">Subtitle</Label>
              <Textarea
                id="subtitle"
                value={formData.subtitle}
                onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                placeholder="e.g., Discover verified properties across India"
                rows={2}
                data-testid="input-subtitle"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Background Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                data-testid="input-image-url"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buttonText">Button Text</Label>
                <Input
                  id="buttonText"
                  value={formData.buttonText}
                  onChange={(e) => setFormData({ ...formData, buttonText: e.target.value })}
                  placeholder="e.g., Browse Properties"
                  data-testid="input-button-text"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="buttonLink">Button Link</Label>
                <Input
                  id="buttonLink"
                  value={formData.buttonLink}
                  onChange={(e) => setFormData({ ...formData, buttonLink: e.target.value })}
                  placeholder="/listings"
                  data-testid="input-button-link"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="overlayOpacity">Overlay Opacity (%)</Label>
                <Input
                  id="overlayOpacity"
                  type="number"
                  min={0}
                  max={100}
                  value={formData.overlayOpacity}
                  onChange={(e) => setFormData({ ...formData, overlayOpacity: parseInt(e.target.value) || 50 })}
                  data-testid="input-overlay-opacity"
                />
              </div>
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
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-active"
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
              {editingSlide ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
