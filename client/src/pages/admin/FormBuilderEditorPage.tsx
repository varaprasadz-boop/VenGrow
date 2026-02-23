import { useState, useCallback } from "react";
import { useParams, useLocation } from "wouter";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IconPicker } from "@/components/IconPicker";
import { DynamicIcon } from "@/components/DynamicIcon";
import type { FormTemplate, FormSection, FormField, PropertyCategory } from "@shared/schema";
import {
  Save, Upload, Copy, ArrowLeft, Lock, Plus, Trash2, Edit, ChevronDown, ChevronRight,
  Loader2, Image, FileText, Settings, Layout, X,
} from "lucide-react";

type TemplateWithData = FormTemplate & {
  sections?: (FormSection & { fields?: FormField[] })[];
};

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "numeric", label: "Numeric" },
  { value: "alphanumeric", label: "Alphanumeric" },
  { value: "textarea", label: "Textarea" },
  { value: "checkbox", label: "Checkbox" },
  { value: "dropdown", label: "Dropdown" },
  { value: "radio", label: "Radio" },
  { value: "date", label: "Date" },
  { value: "file_upload", label: "File Upload" },
  { value: "map", label: "Map" },
];

const DISPLAY_STYLES = [
  { value: "default", label: "Default" },
  { value: "grid", label: "Grid" },
  { value: "checklist", label: "Checklist" },
];

const DEFAULT_FIELDS = [
  { label: "Transaction Type", fieldKey: "transactionType", fieldType: "dropdown", icon: "ArrowUpDown", isRequired: true },
  { label: "Category", fieldKey: "category", fieldType: "dropdown", icon: "LayoutGrid", isRequired: true },
  { label: "Subcategory", fieldKey: "subcategory", fieldType: "dropdown", icon: "List", isRequired: true },
  { label: "Title", fieldKey: "title", fieldType: "text", icon: "FileText", isRequired: true },
  { label: "Description", fieldKey: "description", fieldType: "textarea", icon: "FileText", isRequired: true },
  { label: "City", fieldKey: "city", fieldType: "text", icon: "MapPin", isRequired: true },
  { label: "State", fieldKey: "state", fieldType: "dropdown", icon: "Map", isRequired: true },
  { label: "Address", fieldKey: "address", fieldType: "text", icon: "Navigation", isRequired: true },
];

function StatusBadge({ status }: { status: string }) {
  if (status === "published") return <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" data-testid="badge-template-status">{status}</Badge>;
  if (status === "draft") return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200" data-testid="badge-template-status">{status}</Badge>;
  return <Badge variant="secondary" data-testid="badge-template-status">{status}</Badge>;
}

interface FieldDialogState {
  open: boolean;
  sectionId: string;
  editingField?: FormField;
}

interface SectionDialogState {
  open: boolean;
  stage: number;
  editingSection?: FormSection;
}

const initialFieldForm = {
  label: "",
  fieldType: "text" as string,
  icon: "",
  placeholder: "",
  isRequired: false,
  validationRules: {} as Record<string, unknown>,
  displayStyle: "default",
  options: [] as string[],
  fileConfig: { maxFiles: 5, maxSizeMB: 10, allowedTypes: ["image/*"] } as { maxFiles: number; maxSizeMB: number; allowedTypes: string[] },
};

const initialSectionForm = {
  name: "",
  icon: "",
  showInFilters: false,
};

export default function FormBuilderEditorPage() {
  const params = useParams<{ id: string }>();
  const id = params.id!;
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [formName, setFormName] = useState("");
  const [nameInitialized, setNameInitialized] = useState(false);
  const [activeTab, setActiveTab] = useState("basic-info");

  const [fieldDialog, setFieldDialog] = useState<FieldDialogState>({ open: false, sectionId: "" });
  const [fieldForm, setFieldForm] = useState(initialFieldForm);
  const [newOption, setNewOption] = useState("");

  const [sectionDialog, setSectionDialog] = useState<SectionDialogState>({ open: false, stage: 2 });
  const [sectionForm, setSectionForm] = useState(initialSectionForm);

  const [reviewSettings, setReviewSettings] = useState({
    showPreviewBeforeSubmit: true,
    allowSaveDraft: true,
    autoApproval: false,
    termsText: "",
    seoMetaTitle: "",
    seoMetaDescription: "",
  });
  const [reviewInitialized, setReviewInitialized] = useState(false);

  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set());

  const { data: template, isLoading } = useQuery<TemplateWithData>({
    queryKey: ["/api/admin/form-templates", id],
    enabled: !!id,
  });

  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const categoryName = template?.categoryId
    ? categories.find((c) => c.id === template.categoryId)?.name ?? ""
    : "";

  if (template && !nameInitialized) {
    setFormName(template.name);
    setNameInitialized(true);
  }

  if (template && !reviewInitialized) {
    setReviewSettings({
      showPreviewBeforeSubmit: template.showPreviewBeforeSubmit ?? true,
      allowSaveDraft: template.allowSaveDraft ?? true,
      autoApproval: template.autoApproval ?? false,
      termsText: template.termsText ?? "",
      seoMetaTitle: template.seoMetaTitle ?? "",
      seoMetaDescription: template.seoMetaDescription ?? "",
    });
    setReviewInitialized(true);
  }

  const invalidate = useCallback(() => {
    queryClient.invalidateQueries({ queryKey: ["/api/admin/form-templates", id] });
    queryClient.invalidateQueries({ queryKey: ["/api/admin/form-templates"] });
  }, [queryClient, id]);

  const saveMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const res = await apiRequest("PUT", `/api/admin/form-templates/${id}`, data);
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Template saved" }); },
    onError: () => toast({ title: "Failed to save", variant: "destructive" }),
  });

  const publishMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/form-templates/${id}/publish`);
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Template published" }); },
    onError: () => toast({ title: "Failed to publish", variant: "destructive" }),
  });

  const cloneMutation = useMutation({
    mutationFn: async () => {
      const res = await apiRequest("POST", `/api/admin/form-templates/${id}/clone`);
      return res.json();
    },
    onSuccess: (data: { id: string }) => {
      invalidate();
      toast({ title: "Template cloned" });
      if (data?.id) navigate(`/admin/form-builder/${data.id}`);
    },
    onError: () => toast({ title: "Failed to clone", variant: "destructive" }),
  });

  const addFieldMutation = useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: Record<string, unknown> }) => {
      const res = await apiRequest("POST", `/api/admin/form-sections/${sectionId}/fields`, data);
      return res.json();
    },
    onSuccess: () => { invalidate(); setFieldDialog({ open: false, sectionId: "" }); setFieldForm(initialFieldForm); toast({ title: "Field added" }); },
    onError: () => toast({ title: "Failed to add field", variant: "destructive" }),
  });

  const updateFieldMutation = useMutation({
    mutationFn: async ({ fieldId, data }: { fieldId: string; data: Record<string, unknown> }) => {
      const res = await apiRequest("PUT", `/api/admin/form-fields/${fieldId}`, data);
      return res.json();
    },
    onSuccess: () => { invalidate(); setFieldDialog({ open: false, sectionId: "" }); setFieldForm(initialFieldForm); toast({ title: "Field updated" }); },
    onError: () => toast({ title: "Failed to update field", variant: "destructive" }),
  });

  const deleteFieldMutation = useMutation({
    mutationFn: async (fieldId: string) => {
      await apiRequest("DELETE", `/api/admin/form-fields/${fieldId}`);
    },
    onSuccess: () => { invalidate(); toast({ title: "Field deleted" }); },
    onError: () => toast({ title: "Failed to delete field", variant: "destructive" }),
  });

  const addSectionMutation = useMutation({
    mutationFn: async ({ stage, data }: { stage: number; data: Record<string, unknown> }) => {
      const res = await apiRequest("POST", `/api/admin/form-templates/${id}/sections`, { ...data, stage });
      return res.json();
    },
    onSuccess: () => { invalidate(); setSectionDialog({ open: false, stage: 2 }); setSectionForm(initialSectionForm); toast({ title: "Section added" }); },
    onError: () => toast({ title: "Failed to add section", variant: "destructive" }),
  });

  const updateSectionMutation = useMutation({
    mutationFn: async ({ sectionId, data }: { sectionId: string; data: Record<string, unknown> }) => {
      const res = await apiRequest("PUT", `/api/admin/form-sections/${sectionId}`, data);
      return res.json();
    },
    onSuccess: () => { invalidate(); setSectionDialog({ open: false, stage: 2 }); setSectionForm(initialSectionForm); toast({ title: "Section updated" }); },
    onError: () => toast({ title: "Failed to update section", variant: "destructive" }),
  });

  const deleteSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      await apiRequest("DELETE", `/api/admin/form-sections/${sectionId}`);
    },
    onSuccess: () => { invalidate(); toast({ title: "Section deleted" }); },
    onError: () => toast({ title: "Failed to delete section", variant: "destructive" }),
  });

  const duplicateSectionMutation = useMutation({
    mutationFn: async (sectionId: string) => {
      const res = await apiRequest("POST", `/api/admin/form-sections/${sectionId}/duplicate`);
      return res.json();
    },
    onSuccess: () => { invalidate(); toast({ title: "Section duplicated" }); },
    onError: () => toast({ title: "Failed to duplicate section", variant: "destructive" }),
  });

  const toggleFieldRequired = useMutation({
    mutationFn: async ({ fieldId, isRequired }: { fieldId: string; isRequired: boolean }) => {
      const res = await apiRequest("PUT", `/api/admin/form-fields/${fieldId}`, { isRequired });
      return res.json();
    },
    onSuccess: () => invalidate(),
    onError: () => toast({ title: "Failed to update field", variant: "destructive" }),
  });

  const getStageSections = (stage: number) =>
    (template?.sections ?? []).filter((s) => s.stage === stage).sort((a, b) => a.sortOrder - b.sortOrder);

  const openAddField = (sectionId: string) => {
    setFieldForm(initialFieldForm);
    setFieldDialog({ open: true, sectionId });
  };

  const openEditField = (field: FormField) => {
    setFieldForm({
      label: field.label,
      fieldType: field.fieldType,
      icon: field.icon ?? "",
      placeholder: field.placeholder ?? "",
      isRequired: field.isRequired,
      validationRules: (field.validationRules as Record<string, unknown>) ?? {},
      displayStyle: field.displayStyle ?? "default",
      options: (field.options as string[]) ?? [],
      fileConfig: (field.fileConfig as { maxFiles: number; maxSizeMB: number; allowedTypes: string[] }) ?? { maxFiles: 5, maxSizeMB: 10, allowedTypes: ["image/*"] },
    });
    setFieldDialog({ open: true, sectionId: field.sectionId, editingField: field });
  };

  const openAddSection = (stage: number) => {
    setSectionForm(initialSectionForm);
    setSectionDialog({ open: true, stage });
  };

  const openEditSection = (section: FormSection) => {
    setSectionForm({
      name: section.name,
      icon: section.icon ?? "",
      showInFilters: section.showInFilters,
    });
    setSectionDialog({ open: true, stage: section.stage, editingSection: section });
  };

  const handleSaveField = () => {
    const fieldKey = fieldForm.label.toLowerCase().replace(/\s+/g, "_").replace(/[^a-z0-9_]/g, "");
    const data: Record<string, unknown> = {
      label: fieldForm.label,
      fieldKey,
      fieldType: fieldForm.fieldType,
      icon: fieldForm.icon || null,
      placeholder: fieldForm.placeholder || null,
      isRequired: fieldForm.isRequired,
      displayStyle: fieldForm.displayStyle,
    };
    if (Object.keys(fieldForm.validationRules).length > 0) data.validationRules = fieldForm.validationRules;
    if (["dropdown", "radio", "checkbox"].includes(fieldForm.fieldType) && fieldForm.options.length > 0) {
      data.options = fieldForm.options;
    }
    if (fieldForm.fieldType === "file_upload") data.fileConfig = fieldForm.fileConfig;

    if (fieldDialog.editingField) {
      updateFieldMutation.mutate({ fieldId: fieldDialog.editingField.id, data });
    } else {
      addFieldMutation.mutate({ sectionId: fieldDialog.sectionId, data });
    }
  };

  const handleSaveSection = () => {
    const data: Record<string, unknown> = {
      name: sectionForm.name,
      icon: sectionForm.icon || null,
      showInFilters: sectionForm.showInFilters,
    };
    if (sectionDialog.editingSection) {
      updateSectionMutation.mutate({ sectionId: sectionDialog.editingSection.id, data });
    } else {
      addSectionMutation.mutate({ stage: sectionDialog.stage, data });
    }
  };

  const handleSaveTemplate = () => {
    saveMutation.mutate({ name: formName, ...reviewSettings });
  };

  const addOption = () => {
    if (newOption.trim()) {
      setFieldForm((prev) => ({ ...prev, options: [...prev.options, newOption.trim()] }));
      setNewOption("");
    }
  };

  const removeOption = (index: number) => {
    setFieldForm((prev) => ({ ...prev, options: prev.options.filter((_, i) => i !== index) }));
  };

  const toggleSection = (sectionId: string) => {
    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(sectionId)) next.delete(sectionId);
      else next.add(sectionId);
      return next;
    });
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  if (!template) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <p className="text-muted-foreground">Template not found.</p>
        <Button variant="outline" onClick={() => navigate("/admin/form-builder")} className="mt-4" data-testid="button-back">
          <ArrowLeft className="h-4 w-4 mr-2" /> Back
        </Button>
      </div>
    );
  }

  const renderFieldRow = (field: FormField, isDefault: boolean) => (
    <div key={field.id} className="flex items-center gap-3 p-3 border rounded-md" data-testid={`field-row-${field.id}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        {isDefault && <Lock className="h-4 w-4 text-muted-foreground shrink-0" />}
        {field.icon && <DynamicIcon name={field.icon} className="h-4 w-4 text-muted-foreground shrink-0" />}
        <span className="font-medium truncate" data-testid={`text-field-label-${field.id}`}>{field.label}</span>
        <Badge variant="outline" className="shrink-0">{field.fieldType}</Badge>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Label htmlFor={`req-${field.id}`} className="text-xs text-muted-foreground">Required</Label>
        <Switch
          id={`req-${field.id}`}
          checked={field.isRequired}
          onCheckedChange={(checked) => toggleFieldRequired.mutate({ fieldId: field.id, isRequired: checked })}
          data-testid={`switch-required-${field.id}`}
        />
        {!isDefault && (
          <>
            <Button variant="ghost" size="icon" onClick={() => openEditField(field)} data-testid={`button-edit-field-${field.id}`}>
              <Edit className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => deleteFieldMutation.mutate(field.id)} disabled={deleteFieldMutation.isPending} data-testid={`button-delete-field-${field.id}`}>
              <Trash2 className="h-4 w-4 text-destructive" />
            </Button>
          </>
        )}
      </div>
    </div>
  );

  const renderDefaultFieldRow = (df: typeof DEFAULT_FIELDS[0]) => (
    <div key={df.fieldKey} className="flex items-center gap-3 p-3 border rounded-md" data-testid={`default-field-${df.fieldKey}`}>
      <div className="flex items-center gap-2 flex-1 min-w-0">
        <Lock className="h-4 w-4 text-muted-foreground shrink-0" />
        <DynamicIcon name={df.icon} className="h-4 w-4 text-muted-foreground shrink-0" />
        <span className="font-medium truncate">{df.label}</span>
        <Badge variant="outline" className="shrink-0">{df.fieldType}</Badge>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <Label className="text-xs text-muted-foreground">Required</Label>
        <Switch checked={df.isRequired} disabled data-testid={`switch-default-required-${df.fieldKey}`} />
      </div>
    </div>
  );

  const renderSectionCard = (section: FormSection & { fields?: FormField[] }, showFieldManagement = true) => {
    const isExpanded = expandedSections.has(section.id);
    const fields = (section.fields ?? []).sort((a, b) => a.sortOrder - b.sortOrder);

    return (
      <Card key={section.id} data-testid={`section-card-${section.id}`}>
        <Collapsible open={isExpanded} onOpenChange={() => toggleSection(section.id)}>
          <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
            <CollapsibleTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 p-0 h-auto font-semibold" data-testid={`button-toggle-section-${section.id}`}>
                {isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                {section.icon && <DynamicIcon name={section.icon} className="h-4 w-4" />}
                <span data-testid={`text-section-name-${section.id}`}>{section.name}</span>
              </Button>
            </CollapsibleTrigger>
            <div className="flex items-center gap-2 flex-wrap">
              {section.showInFilters && <Badge variant="secondary" className="shrink-0">Show in Filters</Badge>}
              {section.isDefault && <Badge variant="outline" className="shrink-0">Default</Badge>}
              {!section.isDefault && (
                <>
                  <Button variant="ghost" size="icon" onClick={() => openEditSection(section)} data-testid={`button-edit-section-${section.id}`}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => duplicateSectionMutation.mutate(section.id)} disabled={duplicateSectionMutation.isPending} data-testid={`button-duplicate-section-${section.id}`}>
                    <Copy className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => deleteSectionMutation.mutate(section.id)} disabled={deleteSectionMutation.isPending} data-testid={`button-delete-section-${section.id}`}>
                    <Trash2 className="h-4 w-4 text-destructive" />
                  </Button>
                </>
              )}
            </div>
          </CardHeader>
          <CollapsibleContent>
            <CardContent className="space-y-3">
              {fields.map((field) => renderFieldRow(field, field.isDefault))}
              {fields.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">No fields in this section yet.</p>
              )}
              {showFieldManagement && (
                <Button variant="outline" className="w-full" onClick={() => openAddField(section.id)} data-testid={`button-add-field-${section.id}`}>
                  <Plus className="h-4 w-4 mr-2" /> Add Field
                </Button>
              )}
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>
    );
  };

  const stage1Sections = getStageSections(1);
  const stage2Sections = getStageSections(2);
  const stage3Sections = getStageSections(3);

  return (
    <main className="flex-1 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/admin/form-builder")} data-testid="button-back-to-list">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Edit Form Template</h1>
        </div>

        <Card>
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex-1 min-w-[200px]">
                <Label htmlFor="template-name" className="text-xs text-muted-foreground mb-1 block">Form Name</Label>
                <Input
                  id="template-name"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  data-testid="input-template-name"
                />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Badge variant="outline" className="capitalize" data-testid="badge-seller-type">Seller Type: {template.sellerType}</Badge>
                {categoryName && (
                  <Badge variant="outline" data-testid="badge-category">Category: {categoryName}</Badge>
                )}
                <Badge variant="secondary" data-testid="badge-version">v{template.version}</Badge>
                <StatusBadge status={template.status} />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <Button onClick={handleSaveTemplate} disabled={saveMutation.isPending} data-testid="button-save-template">
                  {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Save className="h-4 w-4 mr-2" />}
                  Save
                </Button>
                <Button variant="outline" onClick={() => publishMutation.mutate()} disabled={publishMutation.isPending} data-testid="button-publish-template">
                  {publishMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Upload className="h-4 w-4 mr-2" />}
                  Publish
                </Button>
                <Button variant="outline" onClick={() => cloneMutation.mutate()} disabled={cloneMutation.isPending} data-testid="button-clone-template">
                  {cloneMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Copy className="h-4 w-4 mr-2" />}
                  Clone
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full justify-start gap-1 flex-wrap">
            <TabsTrigger value="basic-info" data-testid="tab-basic-info">
              <Layout className="h-4 w-4 mr-1" /> Basic Info
            </TabsTrigger>
            <TabsTrigger value="details" data-testid="tab-details">
              <Settings className="h-4 w-4 mr-1" /> Details
            </TabsTrigger>
            <TabsTrigger value="photos" data-testid="tab-photos">
              <Image className="h-4 w-4 mr-1" /> Photos & Media
            </TabsTrigger>
            <TabsTrigger value="review" data-testid="tab-review">
              <FileText className="h-4 w-4 mr-1" /> Review Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="basic-info" className="space-y-4 mt-4">
            <div className="space-y-3">
              <h3 className="text-lg font-semibold">Default Fields</h3>
              {DEFAULT_FIELDS.map(renderDefaultFieldRow)}
            </div>

            {stage1Sections.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold">Custom Fields</h3>
                {stage1Sections.map((section) => {
                  const customFields = (section.fields ?? []).filter((f) => !f.isDefault).sort((a, b) => a.sortOrder - b.sortOrder);
                  return customFields.map((field) => renderFieldRow(field, false));
                })}
              </div>
            )}

            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                const s1 = stage1Sections[0];
                if (s1) openAddField(s1.id);
                else toast({ title: "No Stage 1 section found. Create one first.", variant: "destructive" });
              }}
              data-testid="button-add-custom-field-stage1"
            >
              <Plus className="h-4 w-4 mr-2" /> Add Custom Field
            </Button>
          </TabsContent>

          <TabsContent value="details" className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">Detail Sections</h3>
              <Button onClick={() => openAddSection(2)} data-testid="button-add-section-stage2">
                <Plus className="h-4 w-4 mr-2" /> Add Section
              </Button>
            </div>
            {stage2Sections.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No detail sections yet. Add your first section.</p>
            )}
            {stage2Sections.map((section) => renderSectionCard(section as FormSection & { fields?: FormField[] }))}
          </TabsContent>

          <TabsContent value="photos" className="space-y-4 mt-4">
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <h3 className="text-lg font-semibold">Media Sections</h3>
              <Button onClick={() => openAddSection(3)} data-testid="button-add-section-stage3">
                <Plus className="h-4 w-4 mr-2" /> Add Section
              </Button>
            </div>
            {stage3Sections.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-8">No media sections yet. Add your first section.</p>
            )}
            {stage3Sections.map((section) => renderSectionCard(section as FormSection & { fields?: FormField[] }))}
          </TabsContent>

          <TabsContent value="review" className="space-y-6 mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Submission Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Show Preview Before Submit</Label>
                    <p className="text-sm text-muted-foreground">Allow sellers to preview their listing before final submission</p>
                  </div>
                  <Switch
                    checked={reviewSettings.showPreviewBeforeSubmit}
                    onCheckedChange={(v) => setReviewSettings((p) => ({ ...p, showPreviewBeforeSubmit: v }))}
                    data-testid="switch-show-preview"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Allow Save as Draft</Label>
                    <p className="text-sm text-muted-foreground">Let sellers save incomplete listings as drafts</p>
                  </div>
                  <Switch
                    checked={reviewSettings.allowSaveDraft}
                    onCheckedChange={(v) => setReviewSettings((p) => ({ ...p, allowSaveDraft: v }))}
                    data-testid="switch-allow-draft"
                  />
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <Label>Auto Approval</Label>
                    <p className="text-sm text-muted-foreground">Automatically approve submitted listings without admin review</p>
                  </div>
                  <Switch
                    checked={reviewSettings.autoApproval}
                    onCheckedChange={(v) => setReviewSettings((p) => ({ ...p, autoApproval: v }))}
                    data-testid="switch-auto-approval"
                  />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Terms & Conditions</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={reviewSettings.termsText}
                  onChange={(e) => setReviewSettings((p) => ({ ...p, termsText: e.target.value }))}
                  placeholder="Enter terms and conditions text that sellers must agree to..."
                  rows={6}
                  data-testid="textarea-terms"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>SEO Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="seo-title">Meta Title</Label>
                  <Input
                    id="seo-title"
                    value={reviewSettings.seoMetaTitle}
                    onChange={(e) => setReviewSettings((p) => ({ ...p, seoMetaTitle: e.target.value }))}
                    placeholder="SEO meta title"
                    data-testid="input-seo-title"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seo-description">Meta Description</Label>
                  <Textarea
                    id="seo-description"
                    value={reviewSettings.seoMetaDescription}
                    onChange={(e) => setReviewSettings((p) => ({ ...p, seoMetaDescription: e.target.value }))}
                    placeholder="SEO meta description"
                    rows={3}
                    data-testid="textarea-seo-description"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={fieldDialog.open} onOpenChange={(open) => { if (!open) { setFieldDialog({ open: false, sectionId: "" }); setFieldForm(initialFieldForm); } }}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{fieldDialog.editingField ? "Edit Field" : "Add New Field"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Label</Label>
              <Input value={fieldForm.label} onChange={(e) => setFieldForm((p) => ({ ...p, label: e.target.value }))} placeholder="Field label" data-testid="input-field-label" />
            </div>
            <div className="space-y-2">
              <Label>Field Type</Label>
              <Select value={fieldForm.fieldType} onValueChange={(v) => setFieldForm((p) => ({ ...p, fieldType: v }))}>
                <SelectTrigger data-testid="select-field-type"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {FIELD_TYPES.map((ft) => <SelectItem key={ft.value} value={ft.value}>{ft.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <IconPicker value={fieldForm.icon} onChange={(v) => setFieldForm((p) => ({ ...p, icon: v }))} />
            </div>
            <div className="space-y-2">
              <Label>Placeholder</Label>
              <Input value={fieldForm.placeholder} onChange={(e) => setFieldForm((p) => ({ ...p, placeholder: e.target.value }))} placeholder="Placeholder text" data-testid="input-field-placeholder" />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label>Required</Label>
              <Switch checked={fieldForm.isRequired} onCheckedChange={(v) => setFieldForm((p) => ({ ...p, isRequired: v }))} data-testid="switch-field-required" />
            </div>
            <div className="space-y-2">
              <Label>Display Style</Label>
              <Select value={fieldForm.displayStyle} onValueChange={(v) => setFieldForm((p) => ({ ...p, displayStyle: v }))}>
                <SelectTrigger data-testid="select-display-style"><SelectValue /></SelectTrigger>
                <SelectContent>
                  {DISPLAY_STYLES.map((ds) => <SelectItem key={ds.value} value={ds.value}>{ds.label}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>

            {["dropdown", "radio", "checkbox"].includes(fieldForm.fieldType) && (
              <div className="space-y-2">
                <Label>Options</Label>
                <div className="space-y-2">
                  {fieldForm.options.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input value={opt} readOnly className="flex-1" data-testid={`input-option-${idx}`} />
                      <Button variant="ghost" size="icon" onClick={() => removeOption(idx)} data-testid={`button-remove-option-${idx}`}>
                        <X className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input value={newOption} onChange={(e) => setNewOption(e.target.value)} placeholder="Add option" onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addOption(); } }} data-testid="input-new-option" />
                    <Button variant="outline" size="icon" onClick={addOption} data-testid="button-add-option">
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {fieldForm.fieldType === "file_upload" && (
              <div className="space-y-3">
                <Label>File Configuration</Label>
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label className="text-xs">Max Files</Label>
                    <Input type="number" value={fieldForm.fileConfig.maxFiles} onChange={(e) => setFieldForm((p) => ({ ...p, fileConfig: { ...p.fileConfig, maxFiles: parseInt(e.target.value) || 1 } }))} data-testid="input-max-files" />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Max Size (MB)</Label>
                    <Input type="number" value={fieldForm.fileConfig.maxSizeMB} onChange={(e) => setFieldForm((p) => ({ ...p, fileConfig: { ...p.fileConfig, maxSizeMB: parseInt(e.target.value) || 1 } }))} data-testid="input-max-size" />
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Allowed Types (comma-separated)</Label>
                  <Input value={fieldForm.fileConfig.allowedTypes.join(", ")} onChange={(e) => setFieldForm((p) => ({ ...p, fileConfig: { ...p.fileConfig, allowedTypes: e.target.value.split(",").map((s) => s.trim()).filter(Boolean) } }))} placeholder="image/*, application/pdf" data-testid="input-allowed-types" />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label>Validation Rules (JSON)</Label>
              <Input
                value={JSON.stringify(fieldForm.validationRules)}
                onChange={(e) => {
                  try { setFieldForm((p) => ({ ...p, validationRules: JSON.parse(e.target.value) })); } catch { /* ignore invalid json */ }
                }}
                placeholder='{"min": 0, "max": 100}'
                data-testid="input-validation-rules"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setFieldDialog({ open: false, sectionId: "" }); setFieldForm(initialFieldForm); }} data-testid="button-cancel-field">Cancel</Button>
            <Button onClick={handleSaveField} disabled={!fieldForm.label.trim() || addFieldMutation.isPending || updateFieldMutation.isPending} data-testid="button-save-field">
              {(addFieldMutation.isPending || updateFieldMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {fieldDialog.editingField ? "Update Field" : "Add Field"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={sectionDialog.open} onOpenChange={(open) => { if (!open) { setSectionDialog({ open: false, stage: 2 }); setSectionForm(initialSectionForm); } }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{sectionDialog.editingSection ? "Edit Section" : "Add New Section"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Section Name</Label>
              <Input value={sectionForm.name} onChange={(e) => setSectionForm((p) => ({ ...p, name: e.target.value }))} placeholder="Section name" data-testid="input-section-name" />
            </div>
            <div className="space-y-2">
              <Label>Icon</Label>
              <IconPicker value={sectionForm.icon} onChange={(v) => setSectionForm((p) => ({ ...p, icon: v }))} />
            </div>
            <div className="flex items-center justify-between gap-4">
              <Label>Show in Filters</Label>
              <Switch checked={sectionForm.showInFilters} onCheckedChange={(v) => setSectionForm((p) => ({ ...p, showInFilters: v }))} data-testid="switch-show-in-filters" />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => { setSectionDialog({ open: false, stage: 2 }); setSectionForm(initialSectionForm); }} data-testid="button-cancel-section">Cancel</Button>
            <Button onClick={handleSaveSection} disabled={!sectionForm.name.trim() || addSectionMutation.isPending || updateSectionMutation.isPending} data-testid="button-save-section">
              {(addSectionMutation.isPending || updateSectionMutation.isPending) && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {sectionDialog.editingSection ? "Update Section" : "Add Section"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </main>
  );
}
