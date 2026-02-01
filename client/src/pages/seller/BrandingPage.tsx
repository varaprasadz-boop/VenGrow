import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Palette, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { SellerProfile } from "@shared/schema";

export default function BrandingPage() {
  const { toast } = useToast();
  const [companyName, setCompanyName] = useState("");
  const [description, setDescription] = useState("");
  const [website, setWebsite] = useState("");

  const { data: profile, isLoading } = useQuery<SellerProfile>({
    queryKey: ["/api/me/seller-profile"],
    queryFn: async () => {
      const res = await fetch("/api/me/seller-profile", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch profile");
      return res.json();
    },
  });

  useEffect(() => {
    if (profile) {
      setCompanyName(profile.companyName || "");
      setDescription(profile.description || "");
      setWebsite(profile.website || "");
    }
  }, [profile]);

  const saveMutation = useMutation({
    mutationFn: async (data: { companyName?: string; description?: string; website?: string }) => {
      return apiRequest("PATCH", "/api/me/seller-profile", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-profile"] });
      toast({ title: "Profile updated", description: "Your seller profile has been saved." });
    },
    onError: () => {
      toast({ title: "Failed to update profile", variant: "destructive" });
    },
  });

  const handleSave = () => {
    saveMutation.mutate({
      companyName: companyName.trim() || undefined,
      description: description.trim() || undefined,
      website: website.trim() || undefined,
    });
  };

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-48 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
            <Palette className="h-8 w-8 text-primary" />
            Profile Branding
          </h1>
          <p className="text-muted-foreground">
            Customize your seller profile appearance
          </p>
        </div>

        <Card className="p-8 mb-8">
          <h3 className="font-semibold text-lg mb-6">Profile Information</h3>
          <div className="space-y-6">
            <div>
              <Label htmlFor="company-name">Company Name</Label>
              <Input
                id="company-name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                data-testid="input-company-name"
              />
            </div>
            <div>
              <Label htmlFor="description">About Us</Label>
              <Textarea
                id="description"
                placeholder="Tell buyers about your business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                data-testid="textarea-description"
              />
            </div>
          </div>
        </Card>

        <Card className="p-8 mb-8">
          <h3 className="font-semibold text-lg mb-6">Social Links</h3>
          <div className="space-y-4">
            <div>
              <Label htmlFor="website">Website URL</Label>
              <Input
                id="website"
                placeholder="https://example.com"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                data-testid="input-website"
              />
            </div>
          </div>
        </Card>

        <Button
          className="w-full"
          size="lg"
          data-testid="button-save"
          onClick={handleSave}
          disabled={saveMutation.isPending}
        >
          {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
          Save Branding
        </Button>
      </div>
    </main>
  );
}
