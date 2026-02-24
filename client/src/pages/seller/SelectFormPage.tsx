import { useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, Building2, Home, MapPin, TreePine, Landmark, Users, Briefcase, ArrowRight, FileText } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";

const iconMap: Record<string, any> = {
  Building2,
  Home,
  MapPin,
  TreePine,
  Landmark,
  Users,
  Briefcase,
  FileText,
};

function getCategoryIcon(iconName: string | null) {
  if (!iconName) return Building2;
  return iconMap[iconName] || Building2;
}

interface FormTemplateItem {
  id: string;
  name: string;
  sellerType: string;
  status: string;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categorySlug: string | null;
  showPreviewBeforeSubmit: boolean;
  allowSaveDraft: boolean;
  termsText: string | null;
}

export default function SelectFormPage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const sellerType = user?.sellerType || "individual";

  const { data: templates, isLoading } = useQuery<FormTemplateItem[]>({
    queryKey: ["/api/form-templates", sellerType],
    queryFn: async () => {
      const res = await fetch(`/api/form-templates?sellerType=${sellerType}`);
      if (!res.ok) throw new Error("Failed to fetch form templates");
      return res.json();
    },
    enabled: isAuthenticated && !!user,
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [authLoading, isAuthenticated]);

  useEffect(() => {
    if (templates && templates.length === 1) {
      handleSelectTemplate(templates[0]);
    }
  }, [templates]);

  function handleSelectTemplate(template: FormTemplateItem) {
    localStorage.setItem("selectedFormTemplateId", template.id);
    localStorage.setItem("selectedFormTemplateName", template.name);
    if (template.categoryId) {
      localStorage.setItem("selectedFormCategoryId", template.categoryId);
    }
    navigate("/seller/create-listing/step1");
  }

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" data-testid="loading-select-form">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (templates && templates.length === 1) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]" data-testid="loading-auto-redirect">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6" data-testid="select-form-page">
      <div className="space-y-2">
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Select Property Type</h1>
        <p className="text-muted-foreground">
          Choose the type of property you want to list. Each form is tailored with the right fields for that property category.
        </p>
      </div>

      {!templates || templates.length === 0 ? (
        <Card className="p-8 text-center space-y-3">
          <FileText className="h-12 w-12 mx-auto text-muted-foreground" />
          <p className="text-muted-foreground" data-testid="text-no-forms">
            No listing forms are available for your seller type ({sellerType}) at this time.
            Please contact support if you believe this is an error.
          </p>
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3" data-testid="form-template-grid">
          {templates.map((template) => {
            const IconComp = getCategoryIcon(template.categoryIcon);
            return (
              <Card
                key={template.id}
                className="p-5 cursor-pointer hover-elevate transition-all"
                onClick={() => handleSelectTemplate(template)}
                data-testid={`card-form-template-${template.id}`}
              >
                <div className="flex flex-col items-center text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <IconComp className="h-6 w-6 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <h3 className="font-semibold text-sm" data-testid={`text-template-name-${template.id}`}>
                      {template.categoryName || template.name}
                    </h3>
                    {template.categoryName && template.categoryName !== template.name && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{template.name}</p>
                    )}
                  </div>
                  {template.allowSaveDraft && (
                    <Badge variant="secondary" className="text-xs">Draft Saving</Badge>
                  )}
                  <Button variant="ghost" size="sm" className="mt-2 gap-1" data-testid={`button-select-template-${template.id}`}>
                    Select <ArrowRight className="h-3 w-3" />
                  </Button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
