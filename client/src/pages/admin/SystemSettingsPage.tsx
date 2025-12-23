import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Save, RefreshCw, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface GeneralSettings {
  siteName: string;
  siteTagline: string;
  contactEmail: string;
  contactPhone: string;
  aboutUs: string;
  enableRegistration: boolean;
  enableSellerApproval: boolean;
  enableListingModeration: boolean;
  enableEmailNotifications: boolean;
  enableSMSNotifications: boolean;
  maintenanceMode: boolean;
  googleAnalyticsId: string;
  razorpayKey: string;
  googleMapsKey: string;
}

export default function SystemSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<GeneralSettings>({
    siteName: "VenGrow",
    siteTagline: "Find Your Dream Property",
    contactEmail: "support@vengrow.com",
    contactPhone: "+91 98765 43210",
    aboutUs: "",
    enableRegistration: true,
    enableSellerApproval: true,
    enableListingModeration: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false,
    googleAnalyticsId: "",
    razorpayKey: "",
    googleMapsKey: "",
  });

  const { data: loadedSettings, isLoading, isError, refetch } = useQuery<GeneralSettings>({
    queryKey: ["/api/admin/settings/general"],
  });

  useEffect(() => {
    if (loadedSettings) {
      setSettings(loadedSettings);
    }
  }, [loadedSettings]);

  const saveMutation = useMutation({
    mutationFn: async (data: GeneralSettings) => {
      const res = await apiRequest("PUT", "/api/admin/settings/general", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/general"] });
      toast({ title: "Settings Saved", description: "General settings have been updated." });
    },
    onError: (error: Error) => {
      console.error("Error saving general settings:", error);
      toast({ title: "Error", description: error.message || "Failed to save settings.", variant: "destructive" });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(settings);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <form onSubmit={handleSubmit}>
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="font-serif font-bold text-3xl mb-2">
                  System Settings
                </h1>
                <p className="text-muted-foreground">
                  Configure platform settings and preferences
                </p>
              </div>
              <Button type="submit" disabled={saveMutation.isPending} data-testid="button-save">
                {saveMutation.isPending ? (
                  <><RefreshCw className="h-4 w-4 mr-2 animate-spin" />Saving...</>
                ) : (
                  <><Save className="h-4 w-4 mr-2" />Save Changes</>
                )}
              </Button>
            </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general" data-testid="tab-general">
                General
              </TabsTrigger>
              <TabsTrigger value="features" data-testid="tab-features">
                Features
              </TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="advanced" data-testid="tab-advanced">
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      data-testid="input-site-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteTagline">Site Tagline</Label>
                    <Input
                      id="siteTagline"
                      value={settings.siteTagline}
                      onChange={(e) =>
                        setSettings({ ...settings, siteTagline: e.target.value })
                      }
                      data-testid="input-site-tagline"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          setSettings({ ...settings, contactEmail: e.target.value })
                        }
                        data-testid="input-contact-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={settings.contactPhone}
                        onChange={(e) =>
                          setSettings({ ...settings, contactPhone: e.target.value })
                        }
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutUs">About Us</Label>
                    <Textarea
                      id="aboutUs"
                      rows={6}
                      placeholder="Tell users about your platform..."
                      value={settings.aboutUs}
                      onChange={(e) =>
                        setSettings({ ...settings, aboutUs: e.target.value })
                      }
                      data-testid="textarea-about-us"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">User Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register on the platform
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableRegistration}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableRegistration: checked })
                      }
                      data-testid="switch-registration"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Seller Approval</h3>
                      <p className="text-sm text-muted-foreground">
                        Require admin approval for new seller registrations
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSellerApproval}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableSellerApproval: checked })
                      }
                      data-testid="switch-seller-approval"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Listing Moderation</h3>
                      <p className="text-sm text-muted-foreground">
                        Require admin approval for new property listings
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableListingModeration}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableListingModeration: checked,
                        })
                      }
                      data-testid="switch-listing-moderation"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications to users
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableEmailNotifications: checked,
                        })
                      }
                      data-testid="switch-email-notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">SMS Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Send SMS notifications to users
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSMSNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableSMSNotifications: checked,
                        })
                      }
                      data-testid="switch-sms-notifications"
                    />
                  </div>

                </div>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 text-destructive">
                        Maintenance Mode
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Put the platform in maintenance mode. Only admins can access.
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, maintenanceMode: checked })
                      }
                      data-testid="switch-maintenance-mode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      placeholder="UA-XXXXXXXXX-X"
                      value={settings.googleAnalyticsId}
                      onChange={(e) =>
                        setSettings({ ...settings, googleAnalyticsId: e.target.value })
                      }
                      data-testid="input-google-analytics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razorpayKey">Razorpay API Key</Label>
                    <Input
                      id="razorpayKey"
                      type="password"
                      placeholder="rzp_live_XXXXXXXXXXXXXXX"
                      value={settings.razorpayKey}
                      onChange={(e) =>
                        setSettings({ ...settings, razorpayKey: e.target.value })
                      }
                      data-testid="input-razorpay-key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleMapsKey">Google Maps API Key</Label>
                    <Input
                      id="googleMapsKey"
                      type="password"
                      placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      value={settings.googleMapsKey}
                      onChange={(e) =>
                        setSettings({ ...settings, googleMapsKey: e.target.value })
                      }
                      data-testid="input-google-maps-key"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
          </form>
        </div>
      </main>
    );
}
