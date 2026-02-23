import { useState } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminDataTable, AdminPageHeader, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Copy, Trash2, Loader2, Upload, FormInput } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { FormTemplate } from "@shared/schema";

const filters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search form templates..." },
  {
    key: "sellerType",
    label: "Seller Type",
    type: "select",
    options: [
      { value: "individual", label: "Individual" },
      { value: "broker", label: "Broker" },
      { value: "builder", label: "Builder" },
    ],
  },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "draft", label: "Draft" },
      { value: "published", label: "Published" },
      { value: "archived", label: "Archived" },
    ],
  },
];

function StatusBadge({ status }: { status: string }) {
  const variant = status === "published" ? "default" : status === "draft" ? "secondary" : "outline";
  return <Badge variant={variant} data-testid={`badge-status-${status}`}>{status.charAt(0).toUpperCase() + status.slice(1)}</Badge>;
}

export default function FormBuilderPage() {
  const [, navigate] = useLocation();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [formName, setFormName] = useState("");
  const [sellerType, setSellerType] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, refetch } = useQuery<FormTemplate[]>({
    queryKey: ["/api/admin/form-templates"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { name: string; sellerType: string }) => {
      const res = await apiRequest("POST", "/api/admin/form-templates", data);
      return res.json();
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-templates"] });
      setIsCreateOpen(false);
      setFormName("");
      setSellerType("");
      toast({ title: "Form template created" });
      if (data?.id) {
        navigate(`/admin/form-builder/${data.id}`);
      }
    },
    onError: () => toast({ title: "Failed to create form template", variant: "destructive" }),
  });

  const cloneMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/form-templates/${id}/clone`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-templates"] });
      toast({ title: "Form template cloned" });
    },
    onError: () => toast({ title: "Failed to clone template", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/form-templates/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-templates"] });
      toast({ title: "Form template archived" });
    },
    onError: () => toast({ title: "Failed to archive template", variant: "destructive" }),
  });

  const publishMutation = useMutation({
    mutationFn: async (id: string) => {
      const res = await apiRequest("POST", `/api/admin/form-templates/${id}/publish`);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/form-templates"] });
      toast({ title: "Form template published" });
    },
    onError: () => toast({ title: "Failed to publish template", variant: "destructive" }),
  });

  const columns: ColumnConfig<FormTemplate>[] = [
    {
      key: "name",
      header: "Form Name",
      render: (template) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
            <FormInput className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium" data-testid={`text-name-${template.id}`}>{template.name}</p>
            <p className="text-sm text-muted-foreground capitalize">{template.sellerType}</p>
          </div>
        </div>
      ),
    },
    {
      key: "sellerType",
      header: "Seller Type",
      render: (template) => (
        <Badge variant="outline" className="capitalize" data-testid={`badge-seller-type-${template.id}`}>
          {template.sellerType}
        </Badge>
      ),
    },
    {
      key: "version",
      header: "Version",
      render: (template) => (
        <span data-testid={`text-version-${template.id}`}>v{template.version}</span>
      ),
    },
    {
      key: "status",
      header: "Status",
      render: (template) => <StatusBadge status={template.status} />,
    },
    {
      key: "updatedAt",
      header: "Last Updated",
      render: (template) => (
        <span className="text-muted-foreground" data-testid={`text-updated-${template.id}`}>
          {template.updatedAt ? new Date(template.updatedAt).toLocaleDateString() : "-"}
        </span>
      ),
    },
  ];

  const filterFn = (template: FormTemplate, filterVals: Record<string, string>) => {
    const searchMatch =
      !filterVals.search ||
      template.name.toLowerCase().includes(filterVals.search.toLowerCase());
    const sellerMatch =
      !filterVals.sellerType ||
      filterVals.sellerType === "all" ||
      template.sellerType === filterVals.sellerType;
    const statusMatch =
      !filterVals.status ||
      filterVals.status === "all" ||
      template.status === filterVals.status;
    return searchMatch && sellerMatch && statusMatch;
  };

  const handleCreate = () => {
    if (!formName.trim() || !sellerType) return;
    createMutation.mutate({ name: formName.trim(), sellerType });
  };

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Property Form Builder"
            description="Create and manage dynamic property listing forms for different seller types"
          />

          <AdminDataTable
            data={templates}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            onRefresh={refetch}
            onAddNew={() => setIsCreateOpen(true)}
            addNewLabel="Create New Form"
            emptyMessage="No form templates found. Create your first form template."
            getRowKey={(template) => template.id}
            filterFn={filterFn}
            actions={(template) => (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => navigate(`/admin/form-builder/${template.id}`)}
                  data-testid={`button-edit-${template.id}`}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => cloneMutation.mutate(template.id)}
                  disabled={cloneMutation.isPending}
                  data-testid={`button-clone-${template.id}`}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                {template.status === "draft" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => publishMutation.mutate(template.id)}
                    disabled={publishMutation.isPending}
                    data-testid={`button-publish-${template.id}`}
                  >
                    <Upload className="h-4 w-4 text-green-600" />
                  </Button>
                )}
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => deleteMutation.mutate(template.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${template.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          />
        </div>
      </main>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Form Template</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="form-name">Form Name</Label>
              <Input
                id="form-name"
                value={formName}
                onChange={(e) => setFormName(e.target.value)}
                placeholder="e.g., Individual Seller Form"
                data-testid="input-form-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="seller-type">Seller Type</Label>
              <Select value={sellerType} onValueChange={setSellerType}>
                <SelectTrigger id="seller-type" data-testid="select-seller-type">
                  <SelectValue placeholder="Select seller type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="individual">Individual</SelectItem>
                  <SelectItem value="broker">Broker</SelectItem>
                  <SelectItem value="builder">Builder</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsCreateOpen(false)} data-testid="button-cancel-create">
              Cancel
            </Button>
            <Button
              onClick={handleCreate}
              disabled={createMutation.isPending || !formName.trim() || !sellerType}
              data-testid="button-confirm-create"
            >
              {createMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              Create Form
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
