import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { ArrowRight, ArrowLeft, Upload, X, Image as ImageIcon } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
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

function isValidYouTubeUrl(url: string): boolean {
  if (!url) return true;
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
  ];
  return patterns.some(pattern => pattern.test(url));
}

export default function CreateListingStep3Page() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [photos, setPhotos] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState("");
  const [dataValidated, setDataValidated] = useState(false);
  const [dynamicValues, setDynamicValues] = useState<Record<string, unknown>>({});
  const { toast } = useToast();

  const { data: formTemplate, isLoading: templateLoading } = useQuery<FormTemplateDef>({
    queryKey: ["/api/seller/form-template"],
    enabled: isAuthenticated,
  });

  const stage3Sections = useMemo(() => {
    if (!formTemplate?.sections) return [];
    return formTemplate.sections
      .filter((s) => s.stage === 3)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((s) => ({
        ...s,
        fields: [...s.fields].sort((a, b) => a.sortOrder - b.sortOrder),
      }));
  }, [formTemplate]);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    if (!authLoading && isAuthenticated) {
      const step1Data = localStorage.getItem("createListingStep1");
      const step2Data = localStorage.getItem("createListingStep2");

      if (!step1Data || !step2Data) {
        toast({
          title: "Missing Data",
          description: "Please complete previous steps first.",
          variant: "destructive",
        });
        navigate("/seller/listings/create/step1");
        return;
      }
      setDataValidated(true);
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (!dataValidated) return;
    try {
      const saved3 = localStorage.getItem("createListingStep3");
      if (saved3) {
        const parsed = JSON.parse(saved3);
        if (parsed && typeof parsed === "object") {
          if (parsed.photos) setPhotos(parsed.photos);
          if (parsed.youtubeVideoUrl) setVideoUrl(parsed.youtubeVideoUrl);
          if (parsed.dynamicFields && typeof parsed.dynamicFields === "object") {
            setDynamicValues(parsed.dynamicFields);
          }
        }
      }
    } catch (_) {}
  }, [dataValidated]);

  if (authLoading || !dataValidated || templateLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  const handlePhotoUpload = () => {
    console.log("Photo upload triggered");
    setPhotos([...photos, "photo-placeholder.jpg"]);
  };

  const removePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleDynamicFieldChange = (fieldKey: string, value: unknown) => {
    setDynamicValues((prev) => ({ ...prev, [fieldKey]: value }));
  };

  const handleNext = () => {
    if (videoUrl && !isValidYouTubeUrl(videoUrl)) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube link or leave the field empty.",
        variant: "destructive",
      });
      return;
    }

    if (stage3Sections.length > 0) {
      const requiredFields = stage3Sections.flatMap((s) => s.fields.filter((f) => f.isRequired));
      for (const field of requiredFields) {
        const val = dynamicValues[field.fieldKey];
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

    localStorage.setItem("createListingStep3", JSON.stringify({
      photos,
      youtubeVideoUrl: videoUrl,
      dynamicFields: dynamicValues,
    }));
    navigate("/seller/listings/create/step4");
  };

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Step 3 of 4: Photos & Media</p>
          </div>

          <Card className="p-8">
            <h1 className="font-serif font-bold text-2xl mb-2">
              Upload Photos & Videos
            </h1>
            <p className="text-muted-foreground mb-8">
              Add high-quality photos and videos to attract more buyers
            </p>

            <form className="space-y-8">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <Label className="text-base">Property Photos *</Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload at least 5 photos. Maximum 20 photos allowed.
                    </p>
                  </div>
                  <span className="text-sm text-muted-foreground">
                    {photos.length}/20
                  </span>
                </div>

                <div
                  onClick={handlePhotoUpload}
                  className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center cursor-pointer hover-elevate active-elevate-2 mb-6"
                  data-testid="button-upload-photos"
                >
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Click to upload photos</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PNG, JPG up to 10MB each
                  </p>
                </div>

                {photos.length > 0 && (
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {photos.map((photo, index) => (
                      <div
                        key={index}
                        className="relative aspect-square rounded-lg border overflow-hidden group"
                      >
                        <div className="absolute inset-0 bg-muted flex items-center justify-center">
                          <ImageIcon className="h-8 w-8 text-muted-foreground" />
                        </div>
                        <Button
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removePhoto(index)}
                          data-testid={`button-remove-photo-${index}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        {index === 0 && (
                          <div className="absolute bottom-2 left-2">
                            <span className="text-xs bg-primary text-primary-foreground px-2 py-1 rounded">
                              Cover Photo
                            </span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}

                <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                  <p className="text-sm text-blue-900 dark:text-blue-400">
                    <strong>Photo Tips:</strong> Include photos of all rooms, kitchen, bathrooms, and outdoor areas. Good lighting and multiple angles help attract more buyers.
                  </p>
                </div>
              </div>

              <div>
                <Label className="text-base">YouTube Video (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add a YouTube video link to showcase your property with a virtual tour or walkthrough
                </p>

                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-4 rounded-lg border">
                    <div className="h-12 w-12 flex-shrink-0 flex items-center justify-center rounded-lg bg-red-100 dark:bg-red-900/20">
                      <svg className="h-6 w-6 text-red-600" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                      </svg>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Paste YouTube link (e.g., https://youtube.com/watch?v=...)"
                        className="w-full px-4 py-2 border rounded-lg text-sm"
                        value={videoUrl}
                        onChange={(e) => setVideoUrl(e.target.value)}
                        data-testid="input-youtube-url"
                      />
                      {videoUrl && !isValidYouTubeUrl(videoUrl) && (
                        <p className="text-xs text-destructive mt-1">
                          Please enter a valid YouTube URL
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="p-4 bg-muted/50 rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      <strong>Supported formats:</strong> youtube.com/watch?v=, youtu.be/, youtube.com/embed/
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label className="text-base">Virtual Tour Link (Optional)</Label>
                <p className="text-sm text-muted-foreground mt-1 mb-4">
                  Add a 360° virtual tour link if available
                </p>
                <input
                  type="text"
                  placeholder="Enter virtual tour URL"
                  className="w-full px-4 py-2 border rounded-lg"
                  data-testid="input-virtual-tour"
                />
              </div>

              {stage3Sections.length > 0 && (
                <div className="pt-4" data-testid="dynamic-stage3-sections">
                  <DynamicFormRenderer
                    sections={stage3Sections}
                    values={dynamicValues}
                    onChange={handleDynamicFieldChange}
                    showSectionHeaders={true}
                  />
                </div>
              )}

              <div className="flex justify-between pt-6">
                <Link href="/seller/listings/create/step2">
                  <Button variant="outline" type="button" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Button
                  type="button"
                  data-testid="button-next"
                  onClick={handleNext}
                >
                  Next: Contact & Preview
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
    </main>
  );
}
