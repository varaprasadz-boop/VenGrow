import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useLocation } from "wouter";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { DynamicIcon } from "@/components/DynamicIcon";
import { FileText } from "lucide-react";

interface FormTemplate {
  id: string;
  name: string;
  sellerType: string;
  categoryId: string | null;
  version: number;
  status: string;
  category: {
    id: string;
    name: string;
    icon: string | null;
  } | null;
}

export default function SelectFormPage() {
  const [, setLocation] = useLocation();

  const { data: templates = [], isLoading } = useQuery<FormTemplate[]>({
    queryKey: ["/api/seller/form-templates"],
  });

  useEffect(() => {
    if (!isLoading && templates.length === 1) {
      const template = templates[0];
      localStorage.setItem("createListingFormTemplateId", template.id);
      localStorage.setItem("createListingCategoryId", template.categoryId || "");
      localStorage.removeItem("createListingStep1");
      localStorage.removeItem("createListingStep2");
      localStorage.removeItem("createListingStep3");
      setLocation("/seller/create-listing/step1");
    }
  }, [isLoading, templates, setLocation]);

  const handleSelectTemplate = (template: FormTemplate) => {
    localStorage.setItem("createListingFormTemplateId", template.id);
    localStorage.setItem("createListingCategoryId", template.categoryId || "");
    localStorage.removeItem("createListingStep1");
    localStorage.removeItem("createListingStep2");
    localStorage.removeItem("createListingStep3");
    setLocation("/seller/create-listing/step1");
  };

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <Skeleton className="h-9 w-64 mb-2" />
          <Skeleton className="h-5 w-96" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="p-6">
              <div className="flex flex-col items-center gap-3">
                <Skeleton className="h-12 w-12 rounded-full" />
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-48" />
                <Skeleton className="h-5 w-16" />
              </div>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Select Property Type</h1>
          <p className="text-muted-foreground mt-1">Choose the type of property you want to list</p>
        </div>
        <div className="text-center py-16" data-testid="text-no-forms">
          <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">
            No property forms are available for your account type. Please contact the admin.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight" data-testid="text-page-title">Select Property Type</h1>
        <p className="text-muted-foreground mt-1">Choose the type of property you want to list</p>
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {templates.map((template) => (
          <Card
            key={template.id}
            className="hover-elevate cursor-pointer"
            onClick={() => handleSelectTemplate(template)}
            data-testid={`card-form-template-${template.id}`}
          >
            <CardContent className="flex flex-col items-center text-center gap-3 p-6">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center">
                {template.category?.icon ? (
                  <DynamicIcon name={template.category.icon} className="h-6 w-6 text-muted-foreground" />
                ) : (
                  <FileText className="h-6 w-6 text-muted-foreground" />
                )}
              </div>
              <h3 className="text-lg font-semibold" data-testid={`text-category-name-${template.id}`}>
                {template.category?.name || "Uncategorized"}
              </h3>
              <p className="text-sm text-muted-foreground" data-testid={`text-form-name-${template.id}`}>
                {template.name}
              </p>
              <Badge variant="secondary" className="text-xs" data-testid={`badge-version-${template.id}`}>
                v{template.version}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
