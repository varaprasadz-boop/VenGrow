import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Flag } from "lucide-react";

export default function FeatureFlagsPage() {
  const features = [
    {
      id: "chat",
      name: "Real-time Chat",
      description: "Enable real-time messaging between buyers and sellers",
      enabled: true,
      environment: "production",
    },
    {
      id: "video-tours",
      name: "Virtual Video Tours",
      description: "Allow virtual property tours via video call",
      enabled: true,
      environment: "production",
    },
    {
      id: "ai-recommendations",
      name: "AI Property Recommendations",
      description: "ML-powered property suggestions for buyers",
      enabled: false,
      environment: "beta",
    },
    {
      id: "bulk-upload",
      name: "Bulk Property Upload",
      description: "Allow sellers to upload multiple properties at once",
      enabled: false,
      environment: "development",
    },
    {
      id: "advanced-filters",
      name: "Advanced Search Filters",
      description: "Additional filtering options for property search",
      enabled: true,
      environment: "production",
    },
  ];

  const getEnvironmentBadge = (env: string) => {
    switch (env) {
      case "production":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Production
          </Badge>
        );
      case "beta":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Beta
          </Badge>
        );
      case "development":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            Development
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Flag className="h-8 w-8 text-primary" />
              Feature Flags
            </h1>
            <p className="text-muted-foreground">
              Control platform features and experiments
            </p>
          </div>

          <div className="space-y-4">
            {features.map((feature) => (
              <Card key={feature.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{feature.name}</h3>
                      {getEnvironmentBadge(feature.environment)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                  <Switch
                    id={feature.id}
                    defaultChecked={feature.enabled}
                    data-testid={`switch-${feature.id}`}
                  />
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
