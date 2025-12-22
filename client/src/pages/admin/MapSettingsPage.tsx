import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  MapPin,
  Save,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface MapSettings {
  googleMapsApiKey: string | null;
  defaultLatitude: number;
  defaultLongitude: number;
  defaultZoom: number;
  enableGeocoding: boolean;
  enableStreetView: boolean;
}

export default function MapSettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<MapSettings>({
    googleMapsApiKey: "",
    defaultLatitude: 20.5937,
    defaultLongitude: 78.9629,
    defaultZoom: 5,
    enableGeocoding: true,
    enableStreetView: true,
  });

  const { data: settings, isLoading, isError, refetch } = useQuery<MapSettings>({
    queryKey: ["/api/admin/settings/maps"],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: MapSettings) => {
      return apiRequest("PUT", "/api/admin/settings/maps", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/maps"] });
      toast({ title: "Settings Saved", description: "Map settings have been updated." });
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
              <MapPin className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Map Settings</h1>
              <p className="text-muted-foreground">Configure Google Maps integration</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="googleMapsApiKey">Google Maps API Key</Label>
                  <Input
                    id="googleMapsApiKey"
                    type="password"
                    value={formData.googleMapsApiKey || ""}
                    onChange={(e) => setFormData({ ...formData, googleMapsApiKey: e.target.value })}
                    placeholder="Enter your Google Maps API key"
                    data-testid="input-api-key"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Get your API key from Google Cloud Console
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div>
                    <Label htmlFor="defaultLatitude">Default Latitude</Label>
                    <Input
                      id="defaultLatitude"
                      type="number"
                      step="0.0001"
                      value={formData.defaultLatitude}
                      onChange={(e) => setFormData({ ...formData, defaultLatitude: parseFloat(e.target.value) })}
                      data-testid="input-latitude"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultLongitude">Default Longitude</Label>
                    <Input
                      id="defaultLongitude"
                      type="number"
                      step="0.0001"
                      value={formData.defaultLongitude}
                      onChange={(e) => setFormData({ ...formData, defaultLongitude: parseFloat(e.target.value) })}
                      data-testid="input-longitude"
                    />
                  </div>
                  <div>
                    <Label htmlFor="defaultZoom">Default Zoom Level</Label>
                    <Input
                      id="defaultZoom"
                      type="number"
                      min="1"
                      max="20"
                      value={formData.defaultZoom}
                      onChange={(e) => setFormData({ ...formData, defaultZoom: parseInt(e.target.value) })}
                      data-testid="input-zoom"
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Geocoding</Label>
                      <p className="text-sm text-muted-foreground">
                        Convert addresses to coordinates automatically
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableGeocoding}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableGeocoding: checked })}
                      data-testid="switch-geocoding"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Enable Street View</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow users to see street view on property pages
                      </p>
                    </div>
                    <Switch
                      checked={formData.enableStreetView}
                      onCheckedChange={(checked) => setFormData({ ...formData, enableStreetView: checked })}
                      data-testid="switch-streetview"
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
