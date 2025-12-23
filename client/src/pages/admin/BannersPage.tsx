import { useState, useRef, type ChangeEvent } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, Flag, ExternalLink, Upload, X } from "lucide-react";
import type { Banner } from "@shared/schema";

const BANNER_TYPES = ["hero", "promotional", "announcement", "sidebar"];

const filters: FilterConfig[] = [
  { key: "search", label: "Title", type: "search", placeholder: "Search banners..." },
  { 
    key: "type", 
    label: "Type", 
    type: "select",
    options: BANNER_TYPES.map(t => ({ value: t, label: t.charAt(0).toUpperCase() + t.slice(1) }))
  },
  {
    key: "scheduleStatus",
    label: "Schedule Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "upcoming", label: "Upcoming" },
      { value: "expired", label: "Expired" },
    ]
  }
];

export default function BannersPage() {
  const [editingBanner, setEditingBanner] = useState<Banner | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    title: "", description: "", imageUrl: "", linkUrl: "", linkText: "",
    bannerType: "hero", startDate: "", endDate: "", isActive: true, sortOrder: 0
  });
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleImageUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formDataUpload = new FormData();
      formDataUpload.append("file", file);
      formDataUpload.append("directory", "public/banners");
      
      const res = await fetch("/api/objects/upload", {
        method: "POST",
        body: formDataUpload,
        credentials: "include",
      });
      
      if (!res.ok) {
        throw new Error("Upload failed");
      }
      
      const data = await res.json();
      setFormData(prev => ({ ...prev, imageUrl: data.url }));
      toast({ title: "Image uploaded successfully" });
    } catch (error) {
      toast({ title: "Failed to upload image", variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast({ title: "Image must be less than 5MB", variant: "destructive" });
        return;
      }
      handleImageUpload(file);
    }
  };

  const removeImage = () => {
    setFormData(prev => ({ ...prev, imageUrl: "" }));
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const { data: banners = [], isLoading, isError, refetch } = useQuery<Banner[]>({
    queryKey: ["/api/admin/banners"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/banners", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Banner created successfully" });
    },
    onError: () => toast({ title: "Failed to create banner", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/banners/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      setIsDialogOpen(false);
      setEditingBanner(null);
      resetForm();
      toast({ title: "Banner updated successfully" });
    },
    onError: () => toast({ title: "Failed to update banner", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete banner", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ 
      title: "", description: "", imageUrl: "", linkUrl: "", linkText: "",
      bannerType: "hero", startDate: "", endDate: "", isActive: true, sortOrder: 0 
    });
  };

  const openEditDialog = (banner: Banner) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      description: banner.description || "",
      imageUrl: banner.imageUrl || "",
      linkUrl: banner.linkUrl || "",
      linkText: banner.linkText || "",
      bannerType: banner.bannerType || "hero",
      startDate: banner.startDate ? new Date(banner.startDate).toISOString().split("T")[0] : "",
      endDate: banner.endDate ? new Date(banner.endDate).toISOString().split("T")[0] : "",
      isActive: banner.isActive ?? true,
      sortOrder: banner.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingBanner(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    const submitData = {
      ...formData,
      startDate: formData.startDate || null,
      endDate: formData.endDate || null,
    };
    if (editingBanner) {
      updateMutation.mutate({ id: editingBanner.id, data: submitData as typeof formData });
    } else {
      createMutation.mutate(submitData as typeof formData);
    }
  };

  const getBannerStatus = (banner: Banner): "active" | "upcoming" | "expired" => {
    if (!banner.isActive) return "expired";
    const now = new Date();
    if (banner.startDate && new Date(banner.startDate) > now) return "upcoming";
    if (banner.endDate && new Date(banner.endDate) < now) return "expired";
    return "active";
  };

  const columns: ColumnConfig<Banner>[] = [
    {
      key: "title",
      header: "Banner",
      render: (banner) => (
        <div className="flex items-center gap-3">
          {banner.imageUrl ? (
            <img src={banner.imageUrl} alt={banner.title} className="h-10 w-16 rounded object-cover" />
          ) : (
            <div className="h-10 w-16 rounded bg-muted flex items-center justify-center">
              <Flag className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{banner.title}</p>
            {banner.linkUrl && (
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <ExternalLink className="h-3 w-3" />
                <span className="truncate max-w-[150px]">{banner.linkUrl}</span>
              </div>
            )}
          </div>
        </div>
      ),
    },
    { 
      key: "bannerType", 
      header: "Type",
      render: (banner) => (
        <Badge variant="secondary" className="capitalize">{banner.bannerType || "hero"}</Badge>
      )
    },
    { 
      key: "schedule", 
      header: "Schedule",
      render: (banner) => {
        const status = getBannerStatus(banner);
        return (
          <div>
            <Badge variant={status === "active" ? "default" : status === "upcoming" ? "secondary" : "outline"}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </Badge>
            {(banner.startDate || banner.endDate) && (
              <p className="text-xs text-muted-foreground mt-1">
                {banner.startDate && new Date(banner.startDate).toLocaleDateString()}
                {banner.startDate && banner.endDate && " - "}
                {banner.endDate && new Date(banner.endDate).toLocaleDateString()}
              </p>
            )}
          </div>
        );
      }
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "isActive",
      header: "Enabled",
      render: (banner) => <StatusBadge active={banner.isActive ?? true} />,
    },
  ];

  const filterFn = (banner: Banner, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      banner.title.toLowerCase().includes(filters.search.toLowerCase());
    
    const typeMatch = !filters.type || filters.type === "all" || banner.bannerType === filters.type;
    
    const bannerScheduleStatus = getBannerStatus(banner);
    const scheduleStatusMatch = !filters.scheduleStatus || filters.scheduleStatus === "all" ||
      filters.scheduleStatus === bannerScheduleStatus;
    
    return searchMatch && typeMatch && scheduleStatusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Banners & Announcements"
            description="Manage promotional banners and platform announcements"
          />

          <AdminDataTable
            data={banners}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Banner"
            emptyMessage="No banners found."
            getRowKey={(banner) => banner.id}
            filterFn={filterFn}
            actions={(banner) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(banner)} data-testid={`button-edit-${banner.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(banner.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${banner.id}`}
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
            <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="e.g., New Year Sale!"
                data-testid="input-banner-title"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Banner description..."
                rows={3}
                data-testid="input-banner-description"
              />
            </div>
            <div className="space-y-2">
              <Label>Banner Image</Label>
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
                data-testid="input-banner-image-file"
              />
              {formData.imageUrl ? (
                <div className="relative">
                  <img
                    src={formData.imageUrl}
                    alt="Banner preview"
                    className="w-full h-32 object-cover rounded-md border"
                    data-testid="img-banner-preview"
                  />
                  <div className="absolute top-2 right-2">
                    <Button
                      type="button"
                      variant="destructive"
                      size="icon"
                      onClick={removeImage}
                      data-testid="button-remove-banner-image"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed rounded-md p-8">
                  <Button
                    type="button"
                    variant="ghost"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    data-testid="button-upload-banner-image"
                  >
                    {isUploading ? (
                      <div className="flex items-center gap-2">
                        <Loader2 className="h-4 w-4 animate-spin" />
                        <span>Uploading...</span>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center gap-2">
                        <Upload className="h-6 w-6 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">Click to upload banner image</span>
                      </div>
                    )}
                  </Button>
                </div>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkUrl">Link URL</Label>
                <Input
                  id="linkUrl"
                  value={formData.linkUrl}
                  onChange={(e) => setFormData({ ...formData, linkUrl: e.target.value })}
                  placeholder="/listings or https://..."
                  data-testid="input-banner-linkurl"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="linkText">Link Text</Label>
                <Input
                  id="linkText"
                  value={formData.linkText}
                  onChange={(e) => setFormData({ ...formData, linkText: e.target.value })}
                  placeholder="e.g., Learn More"
                  data-testid="input-banner-linktext"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bannerType">Banner Type</Label>
                <Select value={formData.bannerType} onValueChange={(v) => setFormData({ ...formData, bannerType: v })}>
                  <SelectTrigger data-testid="select-banner-type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {BANNER_TYPES.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type.charAt(0).toUpperCase() + type.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-banner-order"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="startDate">Start Date</Label>
                <Input
                  id="startDate"
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  data-testid="input-banner-startdate"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="endDate">End Date</Label>
                <Input
                  id="endDate"
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  data-testid="input-banner-enddate"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-banner-active"
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
              {editingBanner ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
