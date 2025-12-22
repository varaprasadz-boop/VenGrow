import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Plug, Settings } from "lucide-react";

export default function IntegrationSettingsPage() {
  const integrations = [
    {
      id: "razorpay",
      name: "Razorpay",
      description: "Payment gateway for transactions",
      category: "Payment",
      enabled: true,
      status: "active",
    },
    {
      id: "google-maps",
      name: "Google Maps",
      description: "Location and map services",
      category: "Maps",
      enabled: true,
      status: "active",
    },
    {
      id: "twilio",
      name: "Twilio",
      description: "SMS and notification services",
      category: "Communication",
      enabled: true,
      status: "active",
    },
    {
      id: "sendgrid",
      name: "SendGrid",
      description: "Email delivery service",
      category: "Communication",
      enabled: false,
      status: "inactive",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Active
          </Badge>
        );
      case "inactive":
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return null;
    }
  };

  return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Plug className="h-8 w-8 text-primary" />
              Integration Settings
            </h1>
            <p className="text-muted-foreground">
              Manage third-party integrations and API connections
            </p>
          </div>

          <div className="space-y-4">
            {integrations.map((integration) => (
              <Card key={integration.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{integration.name}</h3>
                      {getStatusBadge(integration.status)}
                      <Badge variant="outline">{integration.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      {integration.description}
                    </p>
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Label htmlFor={`enable-${integration.id}`}>Enabled</Label>
                        <Switch
                          id={`enable-${integration.id}`}
                          defaultChecked={integration.enabled}
                          data-testid={`switch-${integration.id}`}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-configure-${integration.id}`}
                      >
                        <Settings className="h-4 w-4 mr-2" />
                        Configure
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
}
