import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import {
  CreditCard,
  Save,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  AlertTriangle,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface RazorpaySettings {
  keyId: string | null;
  keySecret: string | null;
  webhookSecret: string | null;
  testMode: boolean;
  isConfigured: boolean;
}

export default function RazorpaySettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<RazorpaySettings>({
    keyId: "",
    keySecret: "",
    webhookSecret: "",
    testMode: true,
    isConfigured: false,
  });

  const { data: settings, isLoading, isError, refetch } = useQuery<RazorpaySettings>({
    queryKey: ["/api/admin/settings/razorpay"],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: RazorpaySettings) => {
      return apiRequest("PUT", "/api/admin/settings/razorpay", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/razorpay"] });
      toast({ title: "Settings Saved", description: "Payment gateway settings have been updated." });
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
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <div>
                <h1 className="font-serif font-bold text-3xl">Payment Gateway</h1>
                <p className="text-muted-foreground">Configure Razorpay integration</p>
              </div>
            </div>
            {formData.isConfigured ? (
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                <CheckCircle className="h-3 w-3 mr-1" />
                Configured
              </Badge>
            ) : (
              <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                <AlertTriangle className="h-3 w-3 mr-1" />
                Not Configured
              </Badge>
            )}
          </div>

          {!formData.isConfigured && (
            <Card className="p-4 mb-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/30">
              <div className="flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <div>
                  <p className="font-medium text-yellow-800 dark:text-yellow-500">
                    Razorpay Not Configured
                  </p>
                  <p className="text-sm text-yellow-700 dark:text-yellow-600">
                    The platform is using a dummy payment gateway for testing. Configure Razorpay to accept real payments.
                  </p>
                </div>
              </div>
            </Card>
          )}

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="space-y-6">
                <div>
                  <Label htmlFor="keyId">Razorpay Key ID</Label>
                  <Input
                    id="keyId"
                    value={formData.keyId || ""}
                    onChange={(e) => setFormData({ ...formData, keyId: e.target.value })}
                    placeholder="rzp_live_xxxxxxxxxx"
                    data-testid="input-key-id"
                  />
                </div>

                <div>
                  <Label htmlFor="keySecret">Razorpay Key Secret</Label>
                  <Input
                    id="keySecret"
                    type="password"
                    value={formData.keySecret || ""}
                    onChange={(e) => setFormData({ ...formData, keySecret: e.target.value })}
                    placeholder="Enter your Razorpay key secret"
                    data-testid="input-key-secret"
                  />
                </div>

                <div>
                  <Label htmlFor="webhookSecret">Webhook Secret (Optional)</Label>
                  <Input
                    id="webhookSecret"
                    type="password"
                    value={formData.webhookSecret || ""}
                    onChange={(e) => setFormData({ ...formData, webhookSecret: e.target.value })}
                    placeholder="Enter your webhook secret"
                    data-testid="input-webhook-secret"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Required for automated payment confirmation
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Test Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use Razorpay test environment
                    </p>
                  </div>
                  <Switch
                    checked={formData.testMode}
                    onCheckedChange={(checked) => setFormData({ ...formData, testMode: checked })}
                    data-testid="switch-test-mode"
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
