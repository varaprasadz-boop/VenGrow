import { useState, useEffect } from "react";
import { useParams } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { Property } from "@shared/schema";

interface SEOSettings {
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string;
}

export default function PropertySEOPage() {
  const params = useParams();
  const propertyId = params.id;
  const { toast } = useToast();
  const [seoTitle, setSeoTitle] = useState("");
  const [seoDescription, setSeoDescription] = useState("");
  const [seoKeywords, setSeoKeywords] = useState("");

  const { data: property, isLoading: propertyLoading } = useQuery<Property>({
    queryKey: [`/api/properties/${propertyId}`],
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (property) {
      setSeoTitle((property as any).seoTitle || property.title || "");
      setSeoDescription((property as any).seoDescription || property.description || "");
      setSeoKeywords((property as any).seoKeywords || "");
    }
  }, [property]);

  const saveSEOMutation = useMutation({
    mutationFn: async (data: SEOSettings) => {
      return apiRequest("PATCH", `/api/properties/${propertyId}/seo`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${propertyId}`] });
      toast({ title: "SEO settings saved successfully" });
    },
    onError: () => {
      toast({ title: "Failed to save SEO settings", variant: "destructive" });
    },
  });

  const handleSave = () => {
    if (!propertyId) {
      toast({ title: "Property ID is missing", variant: "destructive" });
      return;
    }
    saveSEOMutation.mutate({
      seoTitle,
      seoDescription,
      seoKeywords,
    });
  };

  const calculateSEOScore = () => {
    let score = 0;
    if (seoTitle && seoTitle.length >= 30 && seoTitle.length <= 60) score += 30;
    else if (seoTitle) score += 15;
    if (seoDescription && seoDescription.length >= 120 && seoDescription.length <= 160) score += 30;
    else if (seoDescription) score += 15;
    if (seoKeywords) score += 20;
    if (property && (property as any).images && (property as any).images.length >= 5) score += 20;
    return Math.min(100, score);
  };

  const seoScore = calculateSEOScore();
  const scoreColor = seoScore >= 80 ? "text-green-600" : seoScore >= 60 ? "text-yellow-600" : "text-red-600";
  const scoreBadge = seoScore >= 80 ? "Good" : seoScore >= 60 ? "Fair" : "Needs Improvement";

  if (propertyLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96 mb-8" />
          <Skeleton className="h-64 mb-8" />
          <Skeleton className="h-12 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Search className="h-8 w-8 text-primary" />
              SEO Settings
            </h1>
            <p className="text-muted-foreground">
              Optimize your listing for search engines
            </p>
          </div>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Meta Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">SEO Title</Label>
                <Input
                  id="title"
                  value={seoTitle}
                  onChange={(e) => setSeoTitle(e.target.value)}
                  data-testid="input-seo-title"
                  maxLength={60}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoTitle.length}/60 characters (30-60 recommended)
                </p>
              </div>
              <div>
                <Label htmlFor="description">SEO Description</Label>
                <Textarea
                  id="description"
                  value={seoDescription}
                  onChange={(e) => setSeoDescription(e.target.value)}
                  rows={3}
                  data-testid="input-seo-description"
                  maxLength={160}
                />
                <p className="text-xs text-muted-foreground mt-1">
                  {seoDescription.length}/160 characters (120-160 recommended)
                </p>
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  value={seoKeywords}
                  onChange={(e) => setSeoKeywords(e.target.value)}
                  placeholder="Comma-separated keywords"
                  data-testid="input-keywords"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">SEO Score</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className={`text-5xl font-bold ${scoreColor}`}>{seoScore}</div>
              <div>
                <Badge className={`mb-2 ${
                  seoScore >= 80 
                    ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                    : seoScore >= 60
                    ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"
                    : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"
                }`}>
                  {scoreBadge}
                </Badge>
                <p className="text-sm text-muted-foreground">
                  {seoScore >= 80 
                    ? "Your listing is well-optimized"
                    : seoScore >= 60
                    ? "Your listing could use some improvements"
                    : "Your listing needs significant optimization"}
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className={seoTitle && seoTitle.length >= 30 && seoTitle.length <= 60 ? "text-green-600" : "text-yellow-600"}>
                  {seoTitle && seoTitle.length >= 30 && seoTitle.length <= 60 ? "✓" : "!"}
                </span>
                <span>Title length is {seoTitle && seoTitle.length >= 30 && seoTitle.length <= 60 ? "optimal" : "not optimal"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={seoDescription && seoDescription.length >= 120 && seoDescription.length <= 160 ? "text-green-600" : "text-yellow-600"}>
                  {seoDescription && seoDescription.length >= 120 && seoDescription.length <= 160 ? "✓" : "!"}
                </span>
                <span>Description length is {seoDescription && seoDescription.length >= 120 && seoDescription.length <= 160 ? "optimal" : "not optimal"}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className={seoKeywords ? "text-green-600" : "text-yellow-600"}>
                  {seoKeywords ? "✓" : "!"}
                </span>
                <span>{seoKeywords ? "Keywords added" : "Add keywords for better SEO"}</span>
              </div>
            </div>
          </Card>

          <Button 
            className="w-full" 
            size="lg" 
            data-testid="button-save"
            onClick={handleSave}
            disabled={saveSEOMutation.isPending}
          >
            {saveSEOMutation.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save SEO Settings"
            )}
          </Button>
        </div>
      </main>
    );
}
