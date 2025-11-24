import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Shield, Lock, Eye } from "lucide-react";

export default function SecuritySettingsPage() {
  const securitySettings = [
    {
      id: "two-factor",
      title: "Two-Factor Authentication",
      description: "Require 2FA for admin panel access",
      enabled: true,
    },
    {
      id: "ip-whitelist",
      title: "IP Whitelisting",
      description: "Restrict admin access to specific IP addresses",
      enabled: false,
    },
    {
      id: "session-timeout",
      title: "Auto Session Timeout",
      description: "Automatically log out after 30 minutes of inactivity",
      enabled: true,
    },
    {
      id: "login-alerts",
      title: "Login Alerts",
      description: "Email notification for every admin login",
      enabled: true,
    },
    {
      id: "password-policy",
      title: "Strict Password Policy",
      description: "Enforce strong passwords for all users",
      enabled: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Security Settings
            </h1>
            <p className="text-muted-foreground">
              Configure security and access control settings
            </p>
          </div>

          {/* Authentication Settings */}
          <Card className="p-8 mb-8">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Lock className="h-5 w-5 text-primary" />
              Authentication & Access
            </h3>
            <div className="space-y-6">
              {securitySettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-center justify-between pb-6 border-b last:border-0 last:pb-0"
                >
                  <div className="flex-1">
                    <Label htmlFor={setting.id} className="font-medium">
                      {setting.title}
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    id={setting.id}
                    defaultChecked={setting.enabled}
                    data-testid={`switch-${setting.id}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Activity Monitoring */}
          <Card className="p-8">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Activity Monitoring
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Active Sessions</span>
                  <span className="text-2xl font-bold">3</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Administrators currently logged in
                </p>
              </div>

              <div className="p-4 bg-muted rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium">Failed Login Attempts (24h)</span>
                  <span className="text-2xl font-bold">12</span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Unsuccessful login attempts in the last 24 hours
                </p>
              </div>
            </div>

            <Button className="w-full mt-6" variant="outline" data-testid="button-view-logs">
              View Security Logs
            </Button>
          </Card>

          <Button className="w-full mt-8" size="lg" data-testid="button-save">
            Save Settings
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
