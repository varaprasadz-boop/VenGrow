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
import { Edit, Trash2, Loader2, HelpCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { FaqItem } from "@shared/schema";

const FAQ_CATEGORIES = ["general", "buyers", "sellers", "payments", "listings", "account", "legal"];

const filters: FilterConfig[] = [
  { key: "search", label: "Question", type: "search", placeholder: "Search FAQs..." },
  { 
    key: "category", 
    label: "Category", 
    type: "select",
    options: FAQ_CATEGORIES.map(c => ({ value: c, label: c.charAt(0).toUpperCase() + c.slice(1) }))
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

export default function FaqManagementPage() {
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: "", answer: "", category: "general", sortOrder: 0, isActive: true
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: faqs = [], isLoading, isError, refetch } = useQuery<FaqItem[]>({
    queryKey: ["/api/admin/faq-items"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/faq-items", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq-items"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "FAQ created successfully" });
    },
    onError: () => toast({ title: "Failed to create FAQ", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/faq-items/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq-items"] });
      setIsDialogOpen(false);
      setEditingFaq(null);
      resetForm();
      toast({ title: "FAQ updated successfully" });
    },
    onError: () => toast({ title: "Failed to update FAQ", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/faq-items/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/faq-items"] });
      toast({ title: "FAQ deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete FAQ", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({ question: "", answer: "", category: "general", sortOrder: 0, isActive: true });
  };

  const openEditDialog = (faq: FaqItem) => {
    setEditingFaq(faq);
    setFormData({
      question: faq.question,
      answer: faq.answer,
      category: faq.category || "general",
      sortOrder: faq.sortOrder || 0,
      isActive: faq.isActive ?? true,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingFaq(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingFaq) {
      updateMutation.mutate({ id: editingFaq.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<FaqItem>[] = [
    {
      key: "question",
      header: "Question",
      render: (faq) => (
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded bg-muted flex items-center justify-center shrink-0">
            <HelpCircle className="h-5 w-5 text-muted-foreground" />
          </div>
          <div className="min-w-0">
            <p className="font-medium line-clamp-2">{faq.question}</p>
          </div>
        </div>
      ),
    },
    { 
      key: "answer", 
      header: "Answer",
      render: (faq) => (
        <span className="text-muted-foreground truncate max-w-[250px] block">
          {faq.answer.substring(0, 80)}{faq.answer.length > 80 ? "..." : ""}
        </span>
      )
    },
    { 
      key: "category", 
      header: "Category",
      render: (faq) => (
        <Badge variant="secondary" className="capitalize">{faq.category || "general"}</Badge>
      )
    },
    { key: "sortOrder", header: "Order" },
    {
      key: "isActive",
      header: "Status",
      render: (faq) => <StatusBadge active={faq.isActive ?? true} />,
    },
  ];

  const filterFn = (faq: FaqItem, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      faq.question.toLowerCase().includes(filters.search.toLowerCase()) ||
      faq.answer.toLowerCase().includes(filters.search.toLowerCase());
    
    const categoryMatch = !filters.category || filters.category === "all" || faq.category === filters.category;
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && faq.isActive) ||
      (filters.status === "inactive" && !faq.isActive);
    
    return searchMatch && categoryMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="FAQ Management"
            description="Manage frequently asked questions by category"
          />

          <AdminDataTable
            data={faqs}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add FAQ"
            emptyMessage="No FAQs found."
            getRowKey={(faq) => faq.id}
            filterFn={filterFn}
            actions={(faq) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(faq)} data-testid={`button-edit-${faq.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(faq.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${faq.id}`}
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
            <DialogTitle>{editingFaq ? "Edit FAQ" : "Add New FAQ"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="question">Question</Label>
              <Input
                id="question"
                value={formData.question}
                onChange={(e) => setFormData({ ...formData, question: e.target.value })}
                placeholder="e.g., How do I list my property?"
                data-testid="input-faq-question"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="answer">Answer</Label>
              <Textarea
                id="answer"
                value={formData.answer}
                onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
                placeholder="Provide a detailed answer..."
                rows={5}
                data-testid="input-faq-answer"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select value={formData.category} onValueChange={(v) => setFormData({ ...formData, category: v })}>
                  <SelectTrigger data-testid="select-faq-category">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {FAQ_CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
                  data-testid="input-faq-order"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Switch
                id="isActive"
                checked={formData.isActive}
                onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                data-testid="switch-faq-active"
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
              {editingFaq ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
