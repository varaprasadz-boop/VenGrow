import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  BarChart3,
  Save,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface AnalyticsSettings {
  googleAnalyticsId: string | null;
  facebookPixelId: string | null;
  enableUserTracking: boolean;
  enablePropertyViews: boolean;
  enableConversionTracking: boolean;
}

export default function AnalyticsSettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<AnalyticsSettings>({
    googleAnalyticsId: "",
    facebookPixelId: "",
    enableUserTracking: true,
    enablePropertyViews: true,
    enableConversionTracking: true,
  });

  const { data: settings, isLoading, isError, refetch } = useQuery<AnalyticsSettings>({
    queryKey: ["/api/admin/settings/analytics"],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: AnalyticsSettings) => {
      return apiRequest("PUT", "/api/admin/settings/analytics", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/analytics"] });
      toast({ title: "Settings Saved", description: "Analytics settings have been updated." });
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
      <main className="flex-1 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Settings</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Analytics Settings</h1>
              <p className="text-muted-foreground">Configure tracking and analytics</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="googleAnalyticsId">Google Analytics ID</Label>
                  <Input
                    id="googleAnalyticsId"
                    value={formData.googleAnalyticsId || ""}
                    onChange={(e) => setFormData({ ...formData, googleAnalyticsId: e.target.value })}
                    placeholder="G-XXXXXXXXXX"
                    data-testid="input-ga-id"
                  />
                </div>

                <div>
                  <Label htmlFor="facebookPixelId">Facebook Pixel ID</Label>
                  <Input
                    id="facebookPixelId"
                    value={formData.facebookPixelId || ""}
                    onChange={(e) => setFormData({ ...formData, facebookPixelId: e.target.value })}
                    placeholder="Enter your Facebook Pixel ID"
                    data-testid="input-fb-pixel"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>User Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track user behavior and interactions
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableUserTracking}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableUserTracking: checked })}
                      data-testid="switch-user-tracking"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Property View Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track property page views and engagement
                      </p>
                    </div>
                    <Switch
                      checked={formData.enablePropertyViews}
                      onCheckedChange={(checked) => setFormData({ ...formData, enablePropertyViews: checked })}
                      data-testid="switch-property-views"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Conversion Tracking</Label>
                      <p className="text-sm text-muted-foreground">
                        Track inquiries and payments as conversions
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableConversionTracking}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableConversionTracking: checked })}
                      data-testid="switch-conversion-tracking"
                    />
                  </div>
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
    );
}
