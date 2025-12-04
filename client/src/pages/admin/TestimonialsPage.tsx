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
import { Edit, Trash2, Loader2, Quote, Star } from "lucide-react";

interface Testimonial {
  id: string;
  customerName: string;
  customerRole: string;
  customerImage: string;
  content: string;
  rating: number;
  location: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

const filters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search testimonials..." },
  {
    key: "rating",
    label: "Rating",
    type: "select",
    options: [
      { value: "5", label: "5 Stars" },
      { value: "4", label: "4 Stars" },
      { value: "3", label: "3 Stars" },
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

export default function TestimonialsPage() {
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerName: "",
    customerRole: "",
    customerImage: "",
    content: "",
    rating: 5,
    location: "",
    isActive: true,
    sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: testimonials = [], isLoading, isError, refetch } = useQuery<Testimonial[]>({
    queryKey: ["/api/admin/testimonials"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/testimonials", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Testimonial created successfully" });
    },
    onError: () => toast({ title: "Failed to create testimonial", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/testimonials/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      setIsDialogOpen(false);
      setEditingTestimonial(null);
      resetForm();
      toast({ title: "Testimonial updated successfully" });
    },
    onError: () => toast({ title: "Failed to update testimonial", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/testimonials/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/testimonials"] });
      toast({ title: "Testimonial deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete testimonial", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      customerName: "",
      customerRole: "",
      customerImage: "",
      content: "",
      rating: 5,
      location: "",
      isActive: true,
      sortOrder: 0
    });
  };

  const openEditDialog = (testimonial: Testimonial) => {
    setEditingTestimonial(testimonial);
    setFormData({
      customerName: testimonial.customerName,
      customerRole: testimonial.customerRole || "",
      customerImage: testimonial.customerImage || "",
      content: testimonial.content,
      rating: testimonial.rating || 5,
      location: testimonial.location || "",
      isActive: testimonial.isActive ?? true,
      sortOrder: testimonial.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingTestimonial(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingTestimonial) {
      updateMutation.mutate({ id: editingTestimonial.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const renderStars = (rating: number) => (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted-foreground'}`}
        />
      ))}
    </div>
  );

  const columns: ColumnConfig<Testimonial>[] = [
    {
      key: "customerName",
      header: "Customer",
      render: (testimonial) => (
        <div className="flex items-center gap-3">
          {testimonial.customerImage ? (
            <img src={testimonial.customerImage} alt={testimonial.customerName} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <Quote className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{testimonial.customerName}</p>
            <p className="text-sm text-muted-foreground">{testimonial.customerRole}</p>
          </div>
        </div>
      ),
    },
    {
      key: "content",
      header: "Testimonial",
      render: (testimonial) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{testimonial.content}</p>
      )
    },
    {
      key: "rating",
      header: "Rating",
      render: (testimonial) => renderStars(testimonial.rating || 5)
    },
    {
      key: "location",
      header: "Location",
      render: (testimonial) => <span className="text-sm">{testimonial.location || "-"}</span>
    },
    { 
      key: "sortOrder", 
      header: "Order",
      render: (testimonial) => <span>{testimonial.sortOrder || 0}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (testimonial) => <StatusBadge active={testimonial.isActive ?? true} />,
    },
  ];

  const filterFn = (testimonial: Testimonial, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      testimonial.customerName.toLowerCase().includes(filters.search.toLowerCase()) ||
      testimonial.content.toLowerCase().includes(filters.search.toLowerCase());
    
    const ratingMatch = !filters.rating || filters.rating === "all" || 
      testimonial.rating === parseInt(filters.rating);
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && testimonial.isActive) ||
      (filters.status === "inactive" && !testimonial.isActive);
    
    return searchMatch && ratingMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Testimonials"
            description="Manage customer testimonials displayed on the homepage"
          />

          <AdminDataTable
            data={testimonials}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Testimonial"
            emptyMessage="No testimonials found. Add your first testimonial to get started."
            getRowKey={(t) => t.id}
            filterFn={filterFn}
            actions={(testimonial) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(testimonial)} data-testid={`button-edit-${testimonial.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(testimonial.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${testimonial.id}`}
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
            <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add New Testimonial"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="customerName">Customer Name</Label>
              <Input
                id="customerName"
                value={formData.customerName}
                onChange={(e) => setFormData({ ...formData, customerName: e.target.value })}
                placeholder="e.g., Rajesh Kumar"
                data-testid="input-customer-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerRole">Role / Title</Label>
              <Input
                id="customerRole"
                value={formData.customerRole}
                onChange={(e) => setFormData({ ...formData, customerRole: e.target.value })}
                placeholder="e.g., First-time Homebuyer"
                data-testid="input-customer-role"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="customerImage">Profile Image URL</Label>
              <Input
                id="customerImage"
                value={formData.customerImage}
                onChange={(e) => setFormData({ ...formData, customerImage: e.target.value })}
                placeholder="https://..."
                data-testid="input-customer-image"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="content">Testimonial Content</Label>
              <Textarea
                id="content"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                placeholder="Write the customer's testimonial..."
                rows={4}
                data-testid="input-content"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="rating">Rating (1-5)</Label>
                <Input
                  id="rating"
                  type="number"
                  min={1}
                  max={5}
                  value={formData.rating}
                  onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) || 5 })}
                  data-testid="input-rating"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  placeholder="e.g., Mumbai"
                  data-testid="input-location"
                />
              </div>
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
              {editingTestimonial ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
