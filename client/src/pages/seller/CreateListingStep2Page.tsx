import { useState, useEffect, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, ArrowLeft, AlertCircle, Info } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { DynamicFormRenderer } from "@/components/DynamicFormRenderer";

interface FieldDef {
  id: string;
  label: string;
  fieldKey: string;
  fieldType: string;
  icon?: string | null;
  placeholder?: string | null;
  isRequired: boolean;
  options?: string[] | null;
  validationRules?: { min?: number; max?: number; charLimit?: number; regex?: string } | null;
  sourceType?: string | null;
  linkedFieldKey?: string | null;
  defaultValue?: string | null;
  displayStyle?: string | null;
  sortOrder: number;
}

interface SectionDef {
  id: string;
  name: string;
  icon?: string | null;
  stage: number;
  sortOrder: number;
  fields: FieldDef[];
}

interface FormTemplateDef {
  id: string;
  name: string;
  sections: SectionDef[];
}

export default function CreateListingStep2Page() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [step1Data, setStep1Data] = useState<Record<string, unknown> | null>(null);
  const [formValues, setFormValues] = useState<Record<string, unknown>>({});

  const { data: formTemplate, isLoading: templateLoading } = useQuery<FormTemplateDef>({
    queryKey: ["/api/seller/form-template"],
    enabled: isAuthenticated,
  });

  const stage2Sections = useMemo(() => {
    if (!formTemplate?.sections) return [];
    return formTemplate.sections
      .filter((s) => s.stage === 2)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({
        ...s,
        fields: [...s.fields].sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  }, [formTemplate]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ title: "Authentication Required", description: "Please log in to continue.", variant: "destructive" });
      navigate("/login");
      return;
    }
    try {
      const savedData = localStorage.getItem("createListingStep1");
      if (!savedData) {
        toast({ title: "Missing Data", description: "Please complete Step 1 first.", variant: "destructive" });
        navigate("/seller/listings/create/step1");
        return;
      }
      setStep1Data(JSON.parse(savedData));
    } catch (error) {
      console.error("Error loading step 1 data:", error);
      navigate("/seller/listings/create/step1");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (!step1Data) return;
    try {
      const saved2 = localStorage.getItem("createListingStep2");
      if (saved2) {
        const parsed = JSON.parse(saved2);
        if (parsed && typeof parsed === "object") {
          setFormValues(parsed);
        }
      }
    } catch (_) {}
  }, [step1Data]);

  const handleFieldChange = (fieldKey: string, value: unknown) => {
    setFormValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleNext = () => {
    if (stage2Sections.length > 0) {
      const requiredFields = stage2Sections.flatMap((s) => s.fields.filter((f) => f.isRequired));
      for (const field of requiredFields) {
        const val = formValues[field.fieldKey];
        if (val === undefined || val === null || val === "" || (Array.isArray(val) && val.length === 0)) {
          toast({
            title: "Required Field",
            description: `"${field.label}" is required.`,
            variant: "destructive",
          });
          return;
        }
      }
    }
    localStorage.setItem("createListingStep2", JSON.stringify(formValues));
    navigate("/seller/listings/create/step3");
  };

  const handleBack = () => {
    localStorage.setItem("createListingStep2", JSON.stringify(formValues));
    navigate("/seller/listings/create/step1");
  };

  if (authLoading || !step1Data || templateLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-muted-foreground" data-testid="text-loading">Loading...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <div className="max-w-4xl mx-auto p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold" data-testid="text-page-title">Property Details</h1>
          <p className="text-muted-foreground" data-testid="text-page-subtitle">Step 2 of 4 - Enter property details</p>
          <div className="flex gap-1 mt-3">
            {[1, 2, 3, 4].map((step) => (
              <div
                key={step}
                className={`h-2 flex-1 rounded-full ${step <= 2 ? "bg-primary" : "bg-muted"}`}
                data-testid={`progress-step-${step}`}
              />
            ))}
          </div>
        </div>

        {stage2Sections.length === 0 ? (
          <Card data-testid="card-no-sections">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Info className="h-12 w-12 text-muted-foreground mb-4" />
              <h2 className="text-lg font-semibold mb-2" data-testid="text-no-sections-title">No Additional Details Required</h2>
              <p className="text-muted-foreground text-center max-w-md mb-6" data-testid="text-no-sections-message">
                There are no additional property details to fill in for this listing type. You can proceed to the next step.
              </p>
            </CardContent>
          </Card>
        ) : (
          <DynamicFormRenderer
            sections={stage2Sections}
            values={formValues}
            onChange={handleFieldChange}
            showSectionHeaders={true}
          />
        )}

        <div className="flex items-center justify-between gap-4 mt-8">
          <Button
            variant="outline"
            onClick={handleBack}
            data-testid="button-back"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Step 1
          </Button>
          <Button
            onClick={handleNext}
            data-testid="button-next"
          >
            {stage2Sections.length === 0 ? "Skip to Step 3" : "Continue to Step 3"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </main>
  );
}
