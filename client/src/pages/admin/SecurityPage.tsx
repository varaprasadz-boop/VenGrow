import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Shield } from "lucide-react";

export default function SecurityPage() {
  const securitySettings = [
    {
      id: "two_factor",
      name: "Two-Factor Authentication",
      description: "Require 2FA for all admin accounts",
      enabled: true,
      critical: true,
    },
    {
      id: "session_timeout",
      name: "Session Timeout",
      description: "Auto-logout after 30 minutes of inactivity",
      enabled: true,
      critical: false,
    },
    {
      id: "ip_whitelist",
      name: "IP Whitelisting",
      description: "Restrict admin access to specific IP addresses",
      enabled: false,
      critical: false,
    },
  ];

  const recentAlerts = [
    {
      id: "1",
      type: "warning",
      message: "Multiple failed login attempts detected",
      time: "2 hours ago",
    },
    {
      id: "2",
      type: "info",
      message: "Security scan completed successfully",
      time: "1 day ago",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Security Settings
            </h1>
            <p className="text-muted-foreground">
              Manage platform security configuration
            </p>
          </div>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Security Features</h3>
            <div className="space-y-4">
              {securitySettings.map((setting) => (
                <div
                  key={setting.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-semibold">{setting.name}</h4>
                      {setting.critical && (
                        <Badge variant="destructive">Critical</Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {setting.description}
                    </p>
                  </div>
                  <Switch
                    defaultChecked={setting.enabled}
                    data-testid={`switch-${setting.id}`}
                  />
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Security Alerts</h3>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div
                  key={alert.id}
                  className="flex items-start gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1">{alert.message}</p>
                    <p className="text-sm text-muted-foreground">{alert.time}</p>
                  </div>
                  <Badge
                    variant={alert.type === "warning" ? "destructive" : "outline"}
                  >
                    {alert.type}
                  </Badge>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
