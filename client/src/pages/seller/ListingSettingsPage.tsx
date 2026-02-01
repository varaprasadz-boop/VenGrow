import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Bell, Eye, Mail, Loader2, RotateCcw } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_SETTINGS = {
  autoApproveInquiries: false,
  emailNotifications: true,
  smsNotifications: true,
  showPhoneNumber: true,
  showEmail: false,
  allowScheduleVisit: true,
  autoResponseEnabled: false,
  weekendAvailability: true,
  autoResponseMessage: "Thank you for your inquiry. I will get back to you within 24 hours.",
  availableFrom: "09:00",
  availableUntil: "18:00",
};

type ListingSettings = typeof DEFAULT_SETTINGS;

export default function ListingSettingsPage() {
  const { toast } = useToast();
  const [settings, setSettings] = useState<ListingSettings>(DEFAULT_SETTINGS);

  const { data, isLoading } = useQuery<ListingSettings>({
    queryKey: ["/api/me/seller-settings"],
    queryFn: async () => {
      const res = await fetch("/api/me/seller-settings", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch settings");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setSettings({ ...DEFAULT_SETTINGS, ...data });
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<ListingSettings>) => {
      return apiRequest("PATCH", "/api/me/seller-settings", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-settings"] });
      toast({ title: "Settings saved", description: "Your listing settings have been updated." });
    },
    onError: () => {
      toast({ title: "Failed to save settings", variant: "destructive" });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(settings);
  };

  const handleResetToDefault = () => {
    setSettings(DEFAULT_SETTINGS);
    saveMutation.mutate(DEFAULT_SETTINGS);
    toast({ title: "Reset to default", description: "Settings have been reset and saved." });
  };

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-64 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl mb-2">
            Listing Settings
          </h1>
          <p className="text-muted-foreground">
            Configure how buyers interact with your listings
          </p>
        </div>

        {/* Visibility Settings */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Visibility Settings
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="show-phone">Show Phone Number</Label>
                <p className="text-sm text-muted-foreground">
                  Display your contact number on listings
                </p>
              </div>
              <Switch
                id="show-phone"
                checked={settings.showPhoneNumber}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, showPhoneNumber: checked })
                }
                data-testid="switch-phone"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="show-email">Show Email Address</Label>
                <p className="text-sm text-muted-foreground">
                  Display your email on listings
                </p>
              </div>
              <Switch
                id="show-email"
                checked={settings.showEmail}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, showEmail: checked })
                }
                data-testid="switch-email"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="schedule-visit">Allow Schedule Visit</Label>
                <p className="text-sm text-muted-foreground">
                  Let buyers book property visits online
                </p>
              </div>
              <Switch
                id="schedule-visit"
                checked={settings.allowScheduleVisit}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, allowScheduleVisit: checked })
                }
                data-testid="switch-schedule"
              />
            </div>
          </div>
        </Card>

        {/* Notification Settings */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Settings
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="email-notif">Email Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive inquiry notifications via email
                </p>
              </div>
              <Switch
                id="email-notif"
                checked={settings.emailNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, emailNotifications: checked })
                }
                data-testid="switch-email-notif"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="sms-notif">SMS Notifications</Label>
                <p className="text-sm text-muted-foreground">
                  Receive inquiry notifications via SMS
                </p>
              </div>
              <Switch
                id="sms-notif"
                checked={settings.smsNotifications}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, smsNotifications: checked })
                }
                data-testid="switch-sms-notif"
              />
            </div>
          </div>
        </Card>

        {/* Auto Response */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Mail className="h-5 w-5 text-primary" />
            Auto Response
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="auto-response">Enable Auto Response</Label>
                <p className="text-sm text-muted-foreground">
                  Automatically send response to new inquiries
                </p>
              </div>
              <Switch
                id="auto-response"
                checked={settings.autoResponseEnabled}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, autoResponseEnabled: checked })
                }
                data-testid="switch-auto-response"
              />
            </div>

            {settings.autoResponseEnabled && (
              <div>
                <Label htmlFor="auto-message">Auto Response Message</Label>
                <textarea
                  id="auto-message"
                  rows={4}
                  className="w-full mt-2 p-3 border rounded-lg bg-background"
                  placeholder="Thank you for your inquiry. I will get back to you within 24 hours..."
                  value={settings.autoResponseMessage}
                  onChange={(e) =>
                    setSettings({ ...settings, autoResponseMessage: e.target.value })
                  }
                  data-testid="textarea-auto-message"
                />
              </div>
            )}
          </div>
        </Card>

        {/* Availability */}
        <Card className="p-6 mb-6">
          <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
            <Settings className="h-5 w-5 text-primary" />
            Availability
          </h3>
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <Label htmlFor="weekend">Weekend Availability</Label>
                <p className="text-sm text-muted-foreground">
                  Available for property visits on weekends
                </p>
              </div>
              <Switch
                id="weekend"
                checked={settings.weekendAvailability}
                onCheckedChange={(checked) =>
                  setSettings({ ...settings, weekendAvailability: checked })
                }
                data-testid="switch-weekend"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-time">Available From</Label>
                <Input
                  id="start-time"
                  type="time"
                  value={settings.availableFrom}
                  onChange={(e) =>
                    setSettings({ ...settings, availableFrom: e.target.value })
                  }
                  data-testid="input-start-time"
                />
              </div>
              <div>
                <Label htmlFor="end-time">Available Until</Label>
                <Input
                  id="end-time"
                  type="time"
                  value={settings.availableUntil}
                  onChange={(e) =>
                    setSettings({ ...settings, availableUntil: e.target.value })
                  }
                  data-testid="input-end-time"
                />
              </div>
            </div>
          </div>
        </Card>

        <div className="flex gap-4">
          <Button
            className="flex-1"
            data-testid="button-save"
            onClick={handleSave}
            disabled={saveMutation.isPending}
          >
            {saveMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
            Save Changes
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            data-testid="button-reset"
            onClick={handleResetToDefault}
            disabled={saveMutation.isPending}
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Reset to Default
          </Button>
        </div>
      </div>
    </main>
  );
}
