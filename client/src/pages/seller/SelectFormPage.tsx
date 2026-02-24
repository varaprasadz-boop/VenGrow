import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Building2, Home, MapPin, Landmark, TreePine, Briefcase, Users, Handshake, Star, ArrowLeft } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

interface FormTemplateItem {
  id: string;
  name: string;
  sellerType: string;
  version: number;
  status: string;
  categoryId: string | null;
  categoryName: string | null;
  categoryIcon: string | null;
  categorySlug: string | null;
  showPreviewBeforeSubmit: boolean;
  allowSaveDraft: boolean;
}

const categoryIconMap: Record<string, typeof Building2> = {
  apartment: Building2,
  villa: Home,
  plot: MapPin,
  independent_house: Landmark,
  farmhouse: TreePine,
  commercial: Briefcase,
  pg_co_living: Users,
  joint_venture: Handshake,
  new_projects: Star,
  penthouse: Building2,
};

function getCategoryIcon(slug: string | null | undefined) {
  if (!slug) return Building2;
  return categoryIconMap[slug] || Building2;
}

export default function SelectFormPage() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  const sellerType = user?.sellerType || "individual";

  const { data: templates = [], isLoading } = useQuery<FormTemplateItem[]>({
    queryKey: ["/api/form-templates", { sellerType }],
    queryFn: async () => {
      const res = await fetch(`/api/form-templates?sellerType=${sellerType}`);
      if (!res.ok) throw new Error("Failed to load form templates");
      return res.json();
    },
    enabled: isAuthenticated && !!sellerType,
  });

  useEffect(() => {
    if (!isLoading && templates.length === 1) {
      const t = templates[0];
      localStorage.setItem("selectedFormTemplateId", t.id);
      localStorage.setItem("selectedFormTemplateName", t.name);
      if (t.categoryId) {
        localStorage.setItem("selectedFormTemplateCategoryId", t.categoryId);
      }
      navigate("/seller/listings/create/step1");
    }
  }, [isLoading, templates, navigate]);

  const handleSelect = (template: FormTemplateItem) => {
    setSelectedId(template.id);
  };

  const handleContinue = () => {
    const template = templates.find(t => t.id === selectedId);
    if (!template) return;

    localStorage.removeItem("createListingStep1");
    localStorage.removeItem("createListingStep2");
    localStorage.removeItem("createListingStep3");
    localStorage.removeItem("createListingRequestFeatured");

    localStorage.setItem("selectedFormTemplateId", template.id);
    localStorage.setItem("selectedFormTemplateName", template.name);
    if (template.categoryId) {
      localStorage.setItem("selectedFormTemplateCategoryId", template.categoryId);
    }
    navigate("/seller/listings/create/step1");
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (templates.length === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6">
        <Card className="p-8 text-center">
          <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Forms Available</h2>
          <p className="text-muted-foreground mb-6">
            There are no listing forms configured for your seller type. Please contact support.
          </p>
          <Button variant="outline" onClick={() => navigate("/seller/dashboard")} data-testid="button-back-dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <Button variant="ghost" size="icon" onClick={() => navigate("/seller/dashboard")} data-testid="button-back">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Select Property Type</h1>
        </div>
        <p className="text-muted-foreground ml-10">
          Choose the type of property you want to list. Each form is tailored with the right fields for that category.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {templates.map((template) => {
          const IconComponent = getCategoryIcon(template.categorySlug);
          const isSelected = selectedId === template.id;

          return (
            <Card
              key={template.id}
              className={`p-5 cursor-pointer transition-colors ${
                isSelected
                  ? "ring-2 ring-primary border-primary"
                  : "hover-elevate"
              }`}
              onClick={() => handleSelect(template)}
              data-testid={`card-template-${template.id}`}
            >
              <div className="flex flex-col items-center text-center gap-3">
                <div className={`p-3 rounded-md ${isSelected ? "bg-primary/10" : "bg-muted"}`}>
                  <IconComponent className={`h-8 w-8 ${isSelected ? "text-primary" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{template.categoryName || template.name}</h3>
                  {template.categoryName && template.categoryName !== template.name && (
                    <p className="text-xs text-muted-foreground mt-1">{template.name}</p>
                  )}
                </div>
                {template.version > 1 && (
                  <Badge variant="secondary">v{template.version}</Badge>
                )}
              </div>
            </Card>
          );
        })}
      </div>

      <div className="mt-8 flex justify-end">
        <Button
          onClick={handleContinue}
          disabled={!selectedId}
          data-testid="button-continue"
        >
          Continue
        </Button>
      </div>
    </div>
  );
}
