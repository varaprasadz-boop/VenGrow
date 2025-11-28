import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Share2,
  Save,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { SiFacebook, SiInstagram, SiX, SiLinkedin, SiYoutube } from "react-icons/si";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SocialSettings {
  facebookUrl: string | null;
  instagramUrl: string | null;
  twitterUrl: string | null;
  linkedinUrl: string | null;
  youtubeUrl: string | null;
}

export default function SocialSettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SocialSettings>({
    facebookUrl: "",
    instagramUrl: "",
    twitterUrl: "",
    linkedinUrl: "",
    youtubeUrl: "",
  });

  const { data: settings, isLoading, isError, refetch } = useQuery<SocialSettings>({
    queryKey: ["/api/admin/settings/social"],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SocialSettings) => {
      return apiRequest("PUT", "/api/admin/settings/social", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/social"] });
      toast({ title: "Settings Saved", description: "Social media links have been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Settings</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Share2 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Social Media Links</h1>
              <p className="text-muted-foreground">Configure social media presence</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="facebookUrl" className="flex items-center gap-2">
                    <SiFacebook className="h-4 w-4 text-blue-600" />
                    Facebook
                  </Label>
                  <Input
                    id="facebookUrl"
                    value={formData.facebookUrl || ""}
                    onChange={(e) => setFormData({ ...formData, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/yourpage"
                    data-testid="input-facebook"
                  />
                </div>

                <div>
                  <Label htmlFor="instagramUrl" className="flex items-center gap-2">
                    <SiInstagram className="h-4 w-4 text-pink-600" />
                    Instagram
                  </Label>
                  <Input
                    id="instagramUrl"
                    value={formData.instagramUrl || ""}
                    onChange={(e) => setFormData({ ...formData, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/yourpage"
                    data-testid="input-instagram"
                  />
                </div>

                <div>
                  <Label htmlFor="twitterUrl" className="flex items-center gap-2">
                    <SiX className="h-4 w-4 text-foreground" />
                    X (Twitter)
                  </Label>
                  <Input
                    id="twitterUrl"
                    value={formData.twitterUrl || ""}
                    onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                    placeholder="https://twitter.com/yourhandle"
                    data-testid="input-twitter"
                  />
                </div>

                <div>
                  <Label htmlFor="linkedinUrl" className="flex items-center gap-2">
                    <SiLinkedin className="h-4 w-4 text-blue-700" />
                    LinkedIn
                  </Label>
                  <Input
                    id="linkedinUrl"
                    value={formData.linkedinUrl || ""}
                    onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                    placeholder="https://linkedin.com/company/yourcompany"
                    data-testid="input-linkedin"
                  />
                </div>

                <div>
                  <Label htmlFor="youtubeUrl" className="flex items-center gap-2">
                    <SiYoutube className="h-4 w-4 text-red-600" />
                    YouTube
                  </Label>
                  <Input
                    id="youtubeUrl"
                    value={formData.youtubeUrl || ""}
                    onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@yourchannel"
                    data-testid="input-youtube"
                  />
                </div>

                <div className="flex justify-end">
                  <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save">
                    {saveMutation.isPending ? (
                      <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                    ) : (
                      <><Save className="h-4 w-4 mr-2" />Save Settings</>
                    )}
                  </Button>
                </div>
              </div>
            </Card>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
