import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shield } from "lucide-react";

export default function RateLimitingPage() {
  const endpoints = [
    {
      path: "/api/properties/search",
      limit: 100,
      window: "1 minute",
      status: "active",
    },
    {
      path: "/api/auth/login",
      limit: 5,
      window: "15 minutes",
      status: "active",
    },
    {
      path: "/api/inquiries/create",
      limit: 10,
      window: "1 hour",
      status: "active",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              Rate Limiting
            </h1>
            <p className="text-muted-foreground">
              Configure API rate limits and throttling
            </p>
          </div>

          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">About Rate Limiting</h3>
            <p className="text-sm text-muted-foreground">
              Rate limiting protects your API from abuse by limiting the number of
              requests a user can make within a time window.
            </p>
          </Card>

          <div className="space-y-4">
            {endpoints.map((endpoint, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold font-mono text-sm mb-2">
                      {endpoint.path}
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label>Request Limit</Label>
                        <Input
                          type="number"
                          defaultValue={endpoint.limit}
                          className="mt-1"
                          data-testid={`input-limit-${index}`}
                        />
                      </div>
                      <div>
                        <Label>Time Window</Label>
                        <Input
                          defaultValue={endpoint.window}
                          className="mt-1"
                          data-testid={`input-window-${index}`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <Button className="w-full mt-8" size="lg" data-testid="button-save">
            Save Rate Limits
          </Button>
        </div>
      </main>
    );
}
