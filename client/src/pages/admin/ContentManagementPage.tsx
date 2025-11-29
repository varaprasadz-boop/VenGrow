import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  MapPin, Link as LinkIcon, Building2, Settings, 
  Plus, Edit, Trash2, Loader2, 
  FileText, HelpCircle, Flag, AlertCircle
} from "lucide-react";
import type { PopularCity, NavigationLink, PropertyTypeManaged, SiteSetting, FaqItem, StaticPage, Banner } from "@shared/schema";

export default function ContentManagementPage() {
  const [activeTab, setActiveTab] = useState("cities");

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Content Management</h1>
            <p className="text-muted-foreground">
              Manage website content, navigation, and dynamic elements
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 flex flex-wrap gap-1">
              <TabsTrigger value="cities" data-testid="tab-cities">
                <MapPin className="h-4 w-4 mr-2" />
                Cities
              </TabsTrigger>
              <TabsTrigger value="navigation" data-testid="tab-navigation">
                <LinkIcon className="h-4 w-4 mr-2" />
                Navigation
              </TabsTrigger>
              <TabsTrigger value="property-types" data-testid="tab-property-types">
                <Building2 className="h-4 w-4 mr-2" />
                Property Types
              </TabsTrigger>
              <TabsTrigger value="faqs" data-testid="tab-faqs">
                <HelpCircle className="h-4 w-4 mr-2" />
                FAQs
              </TabsTrigger>
              <TabsTrigger value="pages" data-testid="tab-pages">
                <FileText className="h-4 w-4 mr-2" />
                Static Pages
              </TabsTrigger>
              <TabsTrigger value="banners" data-testid="tab-banners">
                <Flag className="h-4 w-4 mr-2" />
                Banners
              </TabsTrigger>
              <TabsTrigger value="settings" data-testid="tab-settings">
                <Settings className="h-4 w-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cities">
              <PopularCitiesTab />
            </TabsContent>

            <TabsContent value="navigation">
              <NavigationLinksTab />
            </TabsContent>

            <TabsContent value="property-types">
              <PropertyTypesTab />
            </TabsContent>

            <TabsContent value="faqs">
              <FaqItemsTab />
            </TabsContent>

            <TabsContent value="pages">
              <StaticPagesTab />
            </TabsContent>

            <TabsContent value="banners">
              <BannersTab />
            </TabsContent>

            <TabsContent value="settings">
              <SiteSettingsTab />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}

function PopularCitiesTab() {
  const [editingCity, setEditingCity] = useState<PopularCity | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "", slug: "", state: "", imageUrl: "", propertyCount: 0, isActive: true, sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: cities = [], isLoading, isError, refetch } = useQuery<PopularCity[]>({
    queryKey: ["/api/admin/popular-cities"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/popular-cities", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popular-cities"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "City created successfully" });
    },
    onError: () => toast({ title: "Failed to create city", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/popular-cities/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popular-cities"] });
      setIsDialogOpen(false);
      setEditingCity(null);
      resetForm();
      toast({ title: "City updated successfully" });
    },
    onError: () => toast({ title: "Failed to update city", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/popular-cities/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/popular-cities"] });
      toast({ title: "City deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete city", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ name: "", slug: "", state: "", imageUrl: "", propertyCount: 0, isActive: true, sortOrder: 0 });
  };

  const openEditDialog = (city: PopularCity) => {
    setEditingCity(city);
    setFormData({
      name: city.name,
      slug: city.slug,
      state: city.state || "",
      imageUrl: city.imageUrl || "",
      propertyCount: city.propertyCount || 0,
      isActive: city.isActive ?? true,
      sortOrder: city.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingCity) {
      updateMutation.mutate({ id: editingCity.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load cities</p>
        <Button onClick={() => refetch()} data-testid="button-retry-cities">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Popular Cities</h3>
          <p className="text-sm text-muted-foreground">Manage cities displayed on homepage and search filters</p>
        </div>
        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) {
            setEditingCity(null);
            resetForm();
          }
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-city"><Plus className="h-4 w-4 mr-2" />Add City</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCity ? "Edit City" : "Add New City"}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city-name">City Name</Label>
                  <Input id="city-name" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} data-testid="input-city-name" />
                </div>
                <div>
                  <Label htmlFor="city-slug">Slug (URL)</Label>
                  <Input id="city-slug" value={formData.slug} onChange={(e) => setFormData({...formData, slug: e.target.value})} data-testid="input-city-slug" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="city-state">State</Label>
                  <Input id="city-state" value={formData.state} onChange={(e) => setFormData({...formData, state: e.target.value})} data-testid="input-city-state" />
                </div>
                <div>
                  <Label htmlFor="property-count">Property Count</Label>
                  <Input id="property-count" type="number" value={formData.propertyCount} onChange={(e) => setFormData({...formData, propertyCount: parseInt(e.target.value) || 0})} data-testid="input-property-count" />
                </div>
              </div>
              <div>
                <Label htmlFor="city-image">Image URL</Label>
                <Input id="city-image" value={formData.imageUrl} onChange={(e) => setFormData({...formData, imageUrl: e.target.value})} data-testid="input-city-image" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="sort-order">Sort Order</Label>
                  <Input id="sort-order" type="number" value={formData.sortOrder} onChange={(e) => setFormData({...formData, sortOrder: parseInt(e.target.value) || 0})} data-testid="input-sort-order" />
                </div>
                <div className="flex items-center gap-2 pt-6">
                  <Switch checked={formData.isActive} onCheckedChange={(checked) => setFormData({...formData, isActive: checked})} data-testid="switch-city-active" />
                  <Label>Active</Label>
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel-city">Cancel</Button>
              <Button onClick={handleSubmit} disabled={createMutation.isPending || updateMutation.isPending} data-testid="button-save-city">
                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                {editingCity ? "Update" : "Create"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : cities.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <MapPin className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No cities added yet. Click "Add City" to create one.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>City</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Properties</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {cities.map((city) => (
              <TableRow key={city.id}>
                <TableCell className="font-medium">{city.name}</TableCell>
                <TableCell>{city.state || "-"}</TableCell>
                <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">{city.slug}</code></TableCell>
                <TableCell>{city.propertyCount || 0}</TableCell>
                <TableCell>
                  <Badge variant={city.isActive ? "default" : "secondary"}>
                    {city.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost" onClick={() => openEditDialog(city)} data-testid={`button-edit-city-${city.id}`}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(city.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-city-${city.id}`}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

function NavigationLinksTab() {
  const { data: links = [], isLoading, isError, refetch } = useQuery<NavigationLink[]>({
    queryKey: ["/api/admin/navigation-links"],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/navigation-links/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/navigation-links"] });
      toast({ title: "Link deleted" });
    },
    onError: () => toast({ title: "Failed to delete link", variant: "destructive" }),
  });

  const groupedLinks = links.reduce((acc, link) => {
    const section = link.section || "other";
    if (!acc[section]) acc[section] = [];
    acc[section].push(link);
    return acc;
  }, {} as Record<string, NavigationLink[]>);

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load navigation links</p>
        <Button onClick={() => refetch()} data-testid="button-retry-links">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Navigation Links</h3>
          <p className="text-sm text-muted-foreground">Manage header and footer navigation links</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : links.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <LinkIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No navigation links found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedLinks).map(([section, sectionLinks]) => (
            <div key={section}>
              <h4 className="font-medium mb-3 capitalize">{section} Links</h4>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Label</TableHead>
                    <TableHead>URL</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sectionLinks.map((link) => (
                    <TableRow key={link.id}>
                      <TableCell className="font-medium">{link.label}</TableCell>
                      <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">{link.url}</code></TableCell>
                      <TableCell>{link.position}</TableCell>
                      <TableCell>
                        <Badge variant={link.isActive ? "default" : "secondary"}>
                          {link.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(link.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-link-${link.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function PropertyTypesTab() {
  const { data: types = [], isLoading, isError, refetch } = useQuery<PropertyTypeManaged[]>({
    queryKey: ["/api/admin/property-types"],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/property-types/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/property-types"] });
      toast({ title: "Property type deleted" });
    },
    onError: () => toast({ title: "Failed to delete property type", variant: "destructive" }),
  });

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load property types</p>
        <Button onClick={() => refetch()} data-testid="button-retry-types">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Property Types</h3>
          <p className="text-sm text-muted-foreground">Manage property type categories</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : types.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Building2 className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No property types found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Icon</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {types.map((type) => (
              <TableRow key={type.id}>
                <TableCell className="font-medium">{type.name}</TableCell>
                <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">{type.slug}</code></TableCell>
                <TableCell>{type.icon || "-"}</TableCell>
                <TableCell>
                  <Badge variant={type.isActive ? "default" : "secondary"}>
                    {type.isActive ? "Active" : "Inactive"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(type.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-type-${type.id}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

function FaqItemsTab() {
  const { data: faqs = [], isLoading, isError, refetch } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq-items"],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/faq-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq-items"] });
      toast({ title: "FAQ deleted" });
    },
    onError: () => toast({ title: "Failed to delete FAQ", variant: "destructive" }),
  });

  const groupedFaqs = faqs.reduce((acc, faq) => {
    const cat = faq.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(faq);
    return acc;
  }, {} as Record<string, FaqItem[]>);

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load FAQs</p>
        <Button onClick={() => refetch()} data-testid="button-retry-faqs">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">FAQ Items</h3>
          <p className="text-sm text-muted-foreground">Manage frequently asked questions</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : faqs.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <HelpCircle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No FAQ items found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(groupedFaqs).map(([category, categoryFaqs]) => (
            <div key={category}>
              <h4 className="font-medium mb-3 capitalize">{category}</h4>
              <div className="space-y-3">
                {categoryFaqs.map((faq) => (
                  <div key={faq.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1">
                        <p className="font-medium">{faq.question}</p>
                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{faq.answer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={faq.isActive ? "default" : "secondary"}>
                          {faq.isActive ? "Active" : "Inactive"}
                        </Badge>
                        <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(faq.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-faq-${faq.id}`}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function StaticPagesTab() {
  const { data: pages = [], isLoading, isError, refetch } = useQuery<StaticPage[]>({
    queryKey: ["/api/admin/static-pages"],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/static-pages/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/static-pages"] });
      toast({ title: "Page deleted" });
    },
    onError: () => toast({ title: "Failed to delete page", variant: "destructive" }),
  });

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load static pages</p>
        <Button onClick={() => refetch()} data-testid="button-retry-pages">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Static Pages</h3>
          <p className="text-sm text-muted-foreground">Manage static content pages (About, Terms, etc.)</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : pages.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No static pages found.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pages.map((page) => (
              <TableRow key={page.id}>
                <TableCell className="font-medium">{page.title}</TableCell>
                <TableCell><code className="text-xs bg-muted px-1 py-0.5 rounded">/{page.slug}</code></TableCell>
                <TableCell>
                  <Badge variant={page.isPublished ? "default" : "secondary"}>
                    {page.isPublished ? "Published" : "Draft"}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(page.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-page-${page.id}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </Card>
  );
}

function BannersTab() {
  const { data: banners = [], isLoading, isError, refetch } = useQuery<Banner[]>({
    queryKey: ["/api/admin/banners"],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/banners/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/banners"] });
      toast({ title: "Banner deleted" });
    },
    onError: () => toast({ title: "Failed to delete banner", variant: "destructive" }),
  });

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load banners</p>
        <Button onClick={() => refetch()} data-testid="button-retry-banners">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h3 className="font-semibold text-lg">Banners</h3>
          <p className="text-sm text-muted-foreground">Manage promotional banners</p>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : banners.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Flag className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No banners found.</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {banners.map((banner) => (
            <div key={banner.id} className="border rounded-lg overflow-hidden">
              {banner.imageUrl && (
                <div className="h-32 bg-muted">
                  <img src={banner.imageUrl} alt={banner.title || "Banner"} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium">{banner.title || banner.name}</h4>
                  <Badge variant={banner.isActive ? "default" : "secondary"}>
                    {banner.isActive ? "Active" : "Inactive"}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-3">{banner.subtitle || "-"}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="outline">{banner.position}</Badge>
                  <Button size="icon" variant="ghost" onClick={() => deleteMutation.mutate(banner.id)} disabled={deleteMutation.isPending} data-testid={`button-delete-banner-${banner.id}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}

function SiteSettingsTab() {
  const { data: settings = [], isLoading, isError, refetch } = useQuery<SiteSetting[]>({
    queryKey: ["/api/admin/site-settings"],
  });
  const queryClient = useQueryClient();
  const { toast } = useToast();

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { value: string } }) => {
      const res = await apiRequest("PUT", `/api/admin/site-settings/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/site-settings"] });
      toast({ title: "Setting updated" });
    },
    onError: () => toast({ title: "Failed to update setting", variant: "destructive" }),
  });

  const groupedSettings = settings.reduce((acc, setting) => {
    const cat = setting.category || "general";
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(setting);
    return acc;
  }, {} as Record<string, SiteSetting[]>);

  if (isError) {
    return (
      <Card className="p-8 text-center">
        <AlertCircle className="h-12 w-12 mx-auto mb-4 text-destructive" />
        <p className="mb-4">Failed to load site settings</p>
        <Button onClick={() => refetch()} data-testid="button-retry-settings">Retry</Button>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Site Settings</h3>
        <p className="text-sm text-muted-foreground">Configure platform-wide settings</p>
      </div>

      {isLoading ? (
        <div className="text-center py-8"><Loader2 className="h-8 w-8 animate-spin mx-auto" /></div>
      ) : settings.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          <Settings className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No site settings found.</p>
        </div>
      ) : (
        <div className="space-y-8">
          {Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <div key={category}>
              <h4 className="font-medium mb-4 capitalize border-b pb-2">{category} Settings</h4>
              <div className="space-y-4">
                {categorySettings.map((setting) => (
                  <div key={setting.id} className="grid grid-cols-3 gap-4 items-start">
                    <div>
                      <Label className="font-medium">{setting.label || setting.key}</Label>
                      {setting.description && (
                        <p className="text-xs text-muted-foreground">{setting.description}</p>
                      )}
                    </div>
                    <div className="col-span-2">
                      {setting.type === "textarea" ? (
                        <Textarea 
                          defaultValue={setting.value || ""}
                          onBlur={(e) => {
                            if (e.target.value !== setting.value) {
                              updateMutation.mutate({ id: setting.id, data: { value: e.target.value } });
                            }
                          }}
                          data-testid={`textarea-setting-${setting.key}`}
                        />
                      ) : setting.type === "boolean" ? (
                        <Switch 
                          defaultChecked={setting.value === "true"}
                          onCheckedChange={(checked) => {
                            updateMutation.mutate({ id: setting.id, data: { value: String(checked) } });
                          }}
                          data-testid={`switch-setting-${setting.key}`}
                        />
                      ) : (
                        <Input 
                          defaultValue={setting.value || ""}
                          onBlur={(e) => {
                            if (e.target.value !== setting.value) {
                              updateMutation.mutate({ id: setting.id, data: { value: e.target.value } });
                            }
                          }}
                          data-testid={`input-setting-${setting.key}`}
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  );
}
