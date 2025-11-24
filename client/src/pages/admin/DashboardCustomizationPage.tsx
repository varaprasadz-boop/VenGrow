import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Layout, Eye, EyeOff } from "lucide-react";

export default function DashboardCustomizationPage() {
  const widgets = [
    {
      id: "revenue",
      name: "Revenue Overview",
      description: "Total revenue and trends",
      enabled: true,
      position: 1,
    },
    {
      id: "users",
      name: "User Statistics",
      description: "Active users and growth",
      enabled: true,
      position: 2,
    },
    {
      id: "listings",
      name: "Property Listings",
      description: "Total listings and status",
      enabled: true,
      position: 3,
    },
    {
      id: "approvals",
      name: "Pending Approvals",
      description: "Sellers awaiting approval",
      enabled: true,
      position: 4,
    },
    {
      id: "moderation",
      name: "Content Moderation Queue",
      description: "Properties pending moderation",
      enabled: false,
      position: 5,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Layout className="h-8 w-8 text-primary" />
              Dashboard Customization
            </h1>
            <p className="text-muted-foreground">
              Customize your admin dashboard layout
            </p>
          </div>

          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <p className="text-sm">
              Enable or disable widgets to customize your dashboard view. Changes
              are saved automatically.
            </p>
          </Card>

          <div className="space-y-4">
            {widgets.map((widget) => (
              <Card key={widget.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {widget.enabled ? (
                        <Eye className="h-5 w-5 text-green-600" />
                      ) : (
                        <EyeOff className="h-5 w-5 text-muted-foreground" />
                      )}
                      <h3 className="font-semibold text-lg">{widget.name}</h3>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {widget.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Switch
                      defaultChecked={widget.enabled}
                      data-testid={`switch-${widget.id}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-8" size="lg" data-testid="button-save">
            Save Layout
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
