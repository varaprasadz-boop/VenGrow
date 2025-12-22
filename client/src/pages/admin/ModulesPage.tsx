import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings } from "lucide-react";

export default function ModulesPage() {
  const modules = [
    {
      id: "chat",
      name: "Real-time Chat",
      description: "Enable buyer-seller messaging",
      enabled: true,
      category: "Communication",
    },
    {
      id: "analytics",
      name: "Advanced Analytics",
      description: "Detailed property performance metrics",
      enabled: true,
      category: "Analytics",
    },
    {
      id: "video-calls",
      name: "Video Calls",
      description: "Virtual property tours via video",
      enabled: false,
      category: "Communication",
    },
    {
      id: "ai-pricing",
      name: "AI Price Recommendations",
      description: "Smart pricing suggestions for sellers",
      enabled: true,
      category: "AI Features",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Settings className="h-8 w-8 text-primary" />
              Platform Modules
            </h1>
            <p className="text-muted-foreground">
              Enable or disable platform features
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((module) => (
              <Card key={module.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{module.name}</h3>
                      <Badge variant="outline">{module.category}</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {module.description}
                    </p>
                  </div>
                  <div className="ml-4">
                    <Switch
                      defaultChecked={module.enabled}
                      data-testid={`switch-${module.id}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 mt-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">Important</h3>
            <p className="text-sm text-muted-foreground">
              Disabling modules will immediately affect all users. Make sure to
              notify users before making changes to critical features.
            </p>
          </Card>
        </div>
      </main>
    );
}
