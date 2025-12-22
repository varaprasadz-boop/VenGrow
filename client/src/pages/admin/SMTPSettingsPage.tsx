import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Mail,
  Save,
  RefreshCw,
  AlertCircle,
  Send,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface SMTPSettings {
  host: string | null;
  port: number;
  username: string | null;
  password: string | null;
  fromEmail: string | null;
  fromName: string | null;
  encryption: string;
  enableEmailNotifications: boolean;
}

export default function SMTPSettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<SMTPSettings>({
    host: "",
    port: 587,
    username: "",
    password: "",
    fromEmail: "",
    fromName: "VenGrow",
    encryption: "tls",
    enableEmailNotifications: true,
  });

  const { data: settings, isLoading, isError, refetch } = useQuery<SMTPSettings>({
    queryKey: ["/api/admin/settings/smtp"],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: SMTPSettings) => {
      return apiRequest("PUT", "/api/admin/settings/smtp", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/settings/smtp"] });
      toast({ title: "Settings Saved", description: "SMTP settings have been updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to save settings.", variant: "destructive" });
    },
  });

  const testMutation = useMutation({
    mutationFn: async () => {
      return apiRequest("POST", "/api/admin/settings/smtp/test");
    },
    onSuccess: () => {
      toast({ title: "Test Email Sent", description: "Check your inbox for the test email." });
    },
    onError: () => {
      toast({ title: "Test Failed", description: "Failed to send test email.", variant: "destructive" });
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
              <Mail className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">SMTP Settings</h1>
              <p className="text-muted-foreground">Configure email delivery settings</p>
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <Card className="p-6">
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="host">SMTP Host</Label>
                    <Input
                      id="host"
                      value={formData.host || ""}
                      onChange={(e) => setFormData({ ...formData, host: e.target.value })}
                      placeholder="smtp.example.com"
                      data-testid="input-host"
                    />
                  </div>
                  <div>
                    <Label htmlFor="port">SMTP Port</Label>
                    <Input
                      id="port"
                      type="number"
                      value={formData.port}
                      onChange={(e) => setFormData({ ...formData, port: parseInt(e.target.value) })}
                      data-testid="input-port"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      value={formData.username || ""}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="SMTP username"
                      data-testid="input-username"
                    />
                  </div>
                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password || ""}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      placeholder="SMTP password"
                      data-testid="input-password"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="fromEmail">From Email</Label>
                    <Input
                      id="fromEmail"
                      type="email"
                      value={formData.fromEmail || ""}
                      onChange={(e) => setFormData({ ...formData, fromEmail: e.target.value })}
                      placeholder="noreply@example.com"
                      data-testid="input-from-email"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fromName">From Name</Label>
                    <Input
                      id="fromName"
                      value={formData.fromName || ""}
                      onChange={(e) => setFormData({ ...formData, fromName: e.target.value })}
                      placeholder="VenGrow"
                      data-testid="input-from-name"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label>Enable Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Send automated email notifications
                    </p>
                  </div>
                  <Switch
                    checked={formData.enableEmailNotifications}
                    onCheckedChange={(checked) => setFormData({ ...formData, enableEmailNotifications: checked })}
                    data-testid="switch-notifications"
                  />
                </div>

                <div className="flex justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => testMutation.mutate()}
                    disabled={testMutation.isPending}
                    data-testid="button-test"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Send Test Email
                  </Button>
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
