import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, Building2, Layers, ChevronRight } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { PropertyCategory, PropertySubcategory } from "@shared/schema";

const categoryFilters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search categories..." },
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

const subcategoryFilters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search subcategories..." },
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
  const [activeTab, setActiveTab] = useState("categories");
  const [editingCategory, setEditingCategory] = useState<PropertyCategory | null>(null);
  const [editingSubcategory, setEditingSubcategory] = useState<PropertySubcategory | null>(null);
  const [isCategoryDialogOpen, setIsCategoryDialogOpen] = useState(false);
  const [isSubcategoryDialogOpen, setIsSubcategoryDialogOpen] = useState(false);
  
  const [categoryForm, setCategoryForm] = useState({
    name: "", slug: "", icon: "", description: "", 
    allowedTransactionTypes: ["sale", "rent", "lease"] as string[],
    hasProjectStage: false, isActive: true, sortOrder: 0
  });
  
  const [subcategoryForm, setSubcategoryForm] = useState({
    categoryId: "", name: "", slug: "", 
    applicableFor: ["sale", "rent", "lease"] as string[],
    isActive: true, sortOrder: 0
  });

  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading: categoriesLoading, refetch: refetchCategories } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/admin/property-categories"],
  });

  const { data: subcategories = [], isLoading: subcategoriesLoading, refetch: refetchSubcategories } = useQuery<PropertySubcategory[]>({
    queryKey: ["/api/admin/property-subcategories"],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (data: typeof categoryForm) => {
      const res = await apiRequest("POST", "/api/admin/property-categories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-categories"] });
      setIsCategoryDialogOpen(false);
      resetCategoryForm();
      toast({ title: "Category created successfully" });
    },
    onError: () => toast({ title: "Failed to create category", variant: "destructive" }),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof categoryForm }) => {
      const res = await apiRequest("PUT", `/api/admin/property-categories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-categories"] });
      setIsCategoryDialogOpen(false);
      setEditingCategory(null);
      resetCategoryForm();
      toast({ title: "Category updated successfully" });
    },
    onError: () => toast({ title: "Failed to update category", variant: "destructive" }),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/property-categories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-categories"] });
      toast({ title: "Category deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete category", variant: "destructive" }),
  });

  const createSubcategoryMutation = useMutation({
    mutationFn: async (data: typeof subcategoryForm) => {
      const res = await apiRequest("POST", "/api/admin/property-subcategories", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-subcategories"] });
      setIsSubcategoryDialogOpen(false);
      resetSubcategoryForm();
      toast({ title: "Subcategory created successfully" });
    },
    onError: () => toast({ title: "Failed to create subcategory", variant: "destructive" }),
  });

  const updateSubcategoryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof subcategoryForm }) => {
      const res = await apiRequest("PUT", `/api/admin/property-subcategories/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-subcategories"] });
      setIsSubcategoryDialogOpen(false);
      setEditingSubcategory(null);
      resetSubcategoryForm();
      toast({ title: "Subcategory updated successfully" });
    },
    onError: () => toast({ title: "Failed to update subcategory", variant: "destructive" }),
  });

  const deleteSubcategoryMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/property-subcategories/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-subcategories"] });
      toast({ title: "Subcategory deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete subcategory", variant: "destructive" }),
  });

  const resetCategoryForm = () => {
    setCategoryForm({ 
      name: "", slug: "", icon: "", description: "", 
      allowedTransactionTypes: ["sale", "rent", "lease"],
      hasProjectStage: false, isActive: true, sortOrder: 0 
    });
  };

  const resetSubcategoryForm = () => {
    setSubcategoryForm({ 
      categoryId: "", name: "", slug: "", 
      applicableFor: ["sale", "rent", "lease"],
      isActive: true, sortOrder: 0 
    });
  };

  const openEditCategoryDialog = (category: PropertyCategory) => {
    setEditingCategory(category);
    setCategoryForm({
      name: category.name,
      slug: category.slug,
      icon: category.icon || "",
      description: category.description || "",
      allowedTransactionTypes: category.allowedTransactionTypes || ["sale", "rent", "lease"],
      hasProjectStage: category.hasProjectStage ?? false,
      isActive: category.isActive ?? true,
      sortOrder: category.sortOrder || 0,
    });
    setIsCategoryDialogOpen(true);
  };

  const openEditSubcategoryDialog = (subcategory: PropertySubcategory) => {
    setEditingSubcategory(subcategory);
    setSubcategoryForm({
      categoryId: subcategory.categoryId,
      name: subcategory.name,
      slug: subcategory.slug,
      applicableFor: subcategory.applicableFor || ["sale", "rent", "lease"],
      isActive: subcategory.isActive ?? true,
      sortOrder: subcategory.sortOrder || 0,
    });
    setIsSubcategoryDialogOpen(true);
  };

  const handleCategorySubmit = () => {
    if (editingCategory) {
      updateCategoryMutation.mutate({ id: editingCategory.id, data: categoryForm });
    } else {
      createCategoryMutation.mutate(categoryForm);
    }
  };

  const handleSubcategorySubmit = () => {
    if (editingSubcategory) {
      updateSubcategoryMutation.mutate({ id: editingSubcategory.id, data: subcategoryForm });
    } else {
      createSubcategoryMutation.mutate(subcategoryForm);
    }
  };

  const categoryColumns: ColumnConfig<PropertyCategory>[] = [
    {
      key: "name",
      header: "Category",
      render: (category) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
            <Layers className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium">{category.name}</p>
            <p className="text-sm text-muted-foreground">/{category.slug}</p>
          </div>
        </div>
      ),
    },
    { 
      key: "description", 
      header: "Description",
      render: (category) => (
        <span className="text-muted-foreground truncate max-w-[200px] block">
          {category.description || "-"}
        </span>
      )
    },
    {
      key: "hasProjectStage",
      header: "Project Stage",
      render: (category) => (
        <span className={category.hasProjectStage ? "text-primary" : "text-muted-foreground"}>
          {category.hasProjectStage ? "Yes" : "No"}
        </span>
      )
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "isActive",
      header: "Status",
      render: (category) => <StatusBadge active={category.isActive ?? true} />,
    },
  ];

  const subcategoryColumns: ColumnConfig<PropertySubcategory>[] = [
    {
      key: "name",
      header: "Subcategory",
      render: (sub) => {
        const parentCategory = categories.find(c => c.id === sub.categoryId);
        return (
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded bg-muted flex items-center justify-center">
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="font-medium">{sub.name}</p>
              <p className="text-sm text-muted-foreground">{parentCategory?.name || "Unknown"}</p>
            </div>
          </div>
        );
      },
    },
    { 
      key: "slug", 
      header: "Slug",
      render: (sub) => (
        <span className="text-muted-foreground">/{sub.slug}</span>
      )
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "isActive",
      header: "Status",
      render: (sub) => <StatusBadge active={sub.isActive ?? true} />,
    },
  ];

  const categoryFilterFn = (category: PropertyCategory, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      category.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      category.slug.toLowerCase().includes(filters.search.toLowerCase());
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && category.isActive) ||
      (filters.status === "inactive" && !category.isActive);
    
    return searchMatch && statusMatch;
  };

  const subcategoryFilterFn = (sub: PropertySubcategory, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      sub.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      sub.slug.toLowerCase().includes(filters.search.toLowerCase());
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && sub.isActive) ||
      (filters.status === "inactive" && !sub.isActive);
    
    return searchMatch && statusMatch;
  };

  const isCategoryMutating = createCategoryMutation.isPending || updateCategoryMutation.isPending;
  const isSubcategoryMutating = createSubcategoryMutation.isPending || updateSubcategoryMutation.isPending;

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Property Categories"
            description="Manage property categories and subcategories"
          />

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="categories" data-testid="tab-categories">
                Categories ({categories.length})
              </TabsTrigger>
              <TabsTrigger value="subcategories" data-testid="tab-subcategories">
                Subcategories ({subcategories.length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="categories">
              <AdminDataTable
                data={categories}
                columns={categoryColumns}
                filters={categoryFilters}
                isLoading={categoriesLoading}
                onRefresh={refetchCategories}
                onAddNew={() => { setEditingCategory(null); resetCategoryForm(); setIsCategoryDialogOpen(true); }}
                addNewLabel="Add Category"
                emptyMessage="No categories found."
                getRowKey={(category) => category.id}
                filterFn={categoryFilterFn}
                actions={(category) => (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => openEditCategoryDialog(category)} data-testid={`button-edit-category-${category.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteCategoryMutation.mutate(category.id)}
                      disabled={deleteCategoryMutation.isPending}
                      data-testid={`button-delete-category-${category.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              />
            </TabsContent>

            <TabsContent value="subcategories">
              <AdminDataTable
                data={subcategories}
                columns={subcategoryColumns}
                filters={subcategoryFilters}
                isLoading={subcategoriesLoading}
                onRefresh={refetchSubcategories}
                onAddNew={() => { setEditingSubcategory(null); resetSubcategoryForm(); setIsSubcategoryDialogOpen(true); }}
                addNewLabel="Add Subcategory"
                emptyMessage="No subcategories found."
                getRowKey={(sub) => sub.id}
                filterFn={subcategoryFilterFn}
                actions={(sub) => (
                  <>
                    <Button variant="ghost" size="icon" onClick={() => openEditSubcategoryDialog(sub)} data-testid={`button-edit-subcategory-${sub.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      onClick={() => deleteSubcategoryMutation.mutate(sub.id)}
                      disabled={deleteSubcategoryMutation.isPending}
                      data-testid={`button-delete-subcategory-${sub.id}`}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </>
                )}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={isCategoryDialogOpen} onOpenChange={setIsCategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingCategory ? "Edit Category" : "Add New Category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cat-name">Name</Label>
              <Input
                id="cat-name"
                value={categoryForm.name}
                onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g., Apartments"
                data-testid="input-category-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-slug">URL Slug</Label>
              <Input
                id="cat-slug"
                value={categoryForm.slug}
                onChange={(e) => setCategoryForm({ ...categoryForm, slug: e.target.value })}
                placeholder="e.g., apartments"
                data-testid="input-category-slug"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cat-icon">Icon</Label>
                <Input
                  id="cat-icon"
                  value={categoryForm.icon}
                  onChange={(e) => setCategoryForm({ ...categoryForm, icon: e.target.value })}
                  placeholder="e.g., Building2"
                  data-testid="input-category-icon"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cat-order">Sort Order</Label>
                <Input
                  id="cat-order"
                  type="number"
                  value={categoryForm.sortOrder}
                  onChange={(e) => setCategoryForm({ ...categoryForm, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-category-order"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="cat-description">Description</Label>
              <Textarea
                id="cat-description"
                value={categoryForm.description}
                onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })}
                placeholder="Brief description"
                rows={2}
                data-testid="input-category-description"
              />
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Switch
                  id="cat-active"
                  checked={categoryForm.isActive}
                  onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, isActive: checked })}
                  data-testid="switch-category-active"
                />
                <Label htmlFor="cat-active">Active</Label>
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="cat-projectstage"
                  checked={categoryForm.hasProjectStage}
                  onCheckedChange={(checked) => setCategoryForm({ ...categoryForm, hasProjectStage: checked })}
                  data-testid="switch-category-projectstage"
                />
                <Label htmlFor="cat-projectstage">Has Project Stage</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCategoryDialogOpen(false)} data-testid="button-cancel-category">
              Cancel
            </Button>
            <Button onClick={handleCategorySubmit} disabled={isCategoryMutating} data-testid="button-save-category">
              {isCategoryMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingCategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isSubcategoryDialogOpen} onOpenChange={setIsSubcategoryDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingSubcategory ? "Edit Subcategory" : "Add New Subcategory"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="sub-category">Parent Category</Label>
              <Select
                value={subcategoryForm.categoryId}
                onValueChange={(value) => setSubcategoryForm({ ...subcategoryForm, categoryId: value })}
              >
                <SelectTrigger id="sub-category" data-testid="select-parent-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-name">Name</Label>
              <Input
                id="sub-name"
                value={subcategoryForm.name}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                placeholder="e.g., Studio Apartments"
                data-testid="input-subcategory-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-slug">URL Slug</Label>
              <Input
                id="sub-slug"
                value={subcategoryForm.slug}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, slug: e.target.value })}
                placeholder="e.g., studio-apartments"
                data-testid="input-subcategory-slug"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="sub-order">Sort Order</Label>
              <Input
                id="sub-order"
                type="number"
                value={subcategoryForm.sortOrder}
                onChange={(e) => setSubcategoryForm({ ...subcategoryForm, sortOrder: parseInt(e.target.value) || 0 })}
                data-testid="input-subcategory-order"
              />
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="sub-active"
                checked={subcategoryForm.isActive}
                onCheckedChange={(checked) => setSubcategoryForm({ ...subcategoryForm, isActive: checked })}
                data-testid="switch-subcategory-active"
              />
              <Label htmlFor="sub-active">Active</Label>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsSubcategoryDialogOpen(false)} data-testid="button-cancel-subcategory">
              Cancel
            </Button>
            <Button onClick={handleSubcategorySubmit} disabled={isSubcategoryMutating} data-testid="button-save-subcategory">
              {isSubcategoryMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingSubcategory ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
