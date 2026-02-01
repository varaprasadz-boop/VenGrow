import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, Loader2 } from "lucide-react";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const DEFAULT_PREFS = {
  newInquiry: true,
  messages: true,
  listingApproved: true,
  payment: true,
  weeklyReport: false,
  marketing: false,
  urgentInquirySms: true,
  bookingSms: true,
  paymentSms: false,
  pushEnabled: true,
};

type NotificationPrefs = typeof DEFAULT_PREFS;

const emailPreferences = [
  { id: "newInquiry" as const, label: "New Inquiries", description: "Get notified when someone inquires about your property" },
  { id: "messages" as const, label: "New Messages", description: "Notifications for new chat messages" },
  { id: "listingApproved" as const, label: "Listing Approvals", description: "When your property listing is approved or rejected" },
  { id: "payment" as const, label: "Payment Confirmations", description: "Receipts and payment status updates" },
  { id: "weeklyReport" as const, label: "Weekly Performance Report", description: "Summary of your listings' performance" },
  { id: "marketing" as const, label: "Marketing & Promotions", description: "Special offers and platform updates" },
];

const smsPreferences = [
  { id: "urgentInquirySms" as const, label: "Urgent Inquiries", description: "High-priority leads via SMS" },
  { id: "bookingSms" as const, label: "Property Visit Bookings", description: "When someone books a property tour" },
  { id: "paymentSms" as const, label: "Payment Alerts", description: "Transaction notifications via SMS" },
];

export default function NotificationPreferencesPage() {
  const { toast } = useToast();
  const [prefs, setPrefs] = useState<NotificationPrefs>(DEFAULT_PREFS);

  const { data, isLoading } = useQuery<NotificationPrefs>({
    queryKey: ["/api/me/seller-notification-preferences"],
    queryFn: async () => {
      const res = await fetch("/api/me/seller-notification-preferences", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch preferences");
      return res.json();
    },
  });

  useEffect(() => {
    if (data) setPrefs({ ...DEFAULT_PREFS, ...data });
  }, [data]);

  const saveMutation = useMutation({
    mutationFn: async (payload: Partial<NotificationPrefs>) => {
      return apiRequest("PATCH", "/api/me/seller-notification-preferences", payload);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-notification-preferences"] });
      toast({ title: "Preferences saved", description: "Your notification preferences have been updated." });
    },
    onError: () => {
      toast({ title: "Failed to save preferences", variant: "destructive" });
    },
  });

  const handleSave = () => {
    saveMutation.mutate(prefs);
  };

  const setPref = (key: keyof NotificationPrefs, value: boolean) => {
    setPrefs((prev) => ({ ...prev, [key]: value }));
  };

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-2" />
          <Skeleton className="h-6 w-48 mb-8" />
          <Skeleton className="h-64 w-full mb-6" />
          <Skeleton className="h-48 w-full" />
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="font-serif font-bold text-3xl mb-2">
            Notification Preferences
          </h1>
          <p className="text-muted-foreground">
            Choose how you want to be notified
          </p>
        </div>

        <div className="space-y-6">
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Email Notifications
            </h3>
            <div className="space-y-6">
              {emailPreferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-center justify-between pb-6 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <Label htmlFor={pref.id} className="font-medium">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={pref.id}
                    checked={prefs[pref.id]}
                    onCheckedChange={(checked) => setPref(pref.id, checked)}
                    data-testid={`switch-email-${pref.id}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">SMS Notifications</h3>
            <div className="space-y-6">
              {smsPreferences.map((pref) => (
                <div
                  key={pref.id}
                  className="flex items-center justify-between pb-6 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <Label htmlFor={`sms-${pref.id}`} className="font-medium">
                      {pref.label}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {pref.description}
                    </p>
                  </div>
                  <Switch
                    id={`sms-${pref.id}`}
                    checked={prefs[pref.id]}
                    onCheckedChange={(checked) => setPref(pref.id, checked)}
                    data-testid={`switch-sms-${pref.id}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Push Notifications</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="push-enabled" className="font-medium">
                    Enable Push Notifications
                  </Label>
                  <p className="text-sm text-muted-foreground mt-1">
                    Receive instant notifications on your device
                  </p>
                </div>
                <Switch
                  id="push-enabled"
                  checked={prefs.pushEnabled}
                  onCheckedChange={(checked) => setPref("pushEnabled", checked)}
                  data-testid="switch-push-enabled"
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
            Save Preferences
          </Button>
        </div>
      </div>
    </main>
  );
}
