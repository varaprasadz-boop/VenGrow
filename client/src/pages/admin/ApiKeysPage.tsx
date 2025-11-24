import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Key, Plus, Copy, Eye, EyeOff } from "lucide-react";
import { useState } from "react";

export default function ApiKeysPage() {
  const [showKeys, setShowKeys] = useState<{ [key: string]: boolean }>({});

  const apiKeys = [
    {
      id: "1",
      name: "Production API Key",
      key: "pk_live_51234567890abcdef",
      created: "Nov 1, 2025",
      lastUsed: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      name: "Development API Key",
      key: "pk_test_51234567890abcdef",
      created: "Oct 15, 2025",
      lastUsed: "1 day ago",
      status: "active",
    },
    {
      id: "3",
      name: "Legacy API Key",
      key: "pk_old_51234567890abcdef",
      created: "Sep 1, 2025",
      lastUsed: "30 days ago",
      status: "inactive",
    },
  ];

  const maskKey = (key: string) => {
    return key.substring(0, 15) + "•".repeat(20);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                API Keys
              </h1>
              <p className="text-muted-foreground">
                Manage API keys for third-party integrations
              </p>
            </div>
            <Button data-testid="button-create">
              <Plus className="h-4 w-4 mr-2" />
              Create API Key
            </Button>
          </div>

          <div className="space-y-4">
            {apiKeys.map((apiKey) => (
              <Card key={apiKey.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <Key className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{apiKey.name}</h3>
                        {apiKey.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="outline">Inactive</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-3 mb-3">
                        <code className="text-sm font-mono bg-muted px-3 py-1 rounded">
                          {showKeys[apiKey.id] ? apiKey.key : maskKey(apiKey.key)}
                        </code>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() =>
                            setShowKeys({
                              ...showKeys,
                              [apiKey.id]: !showKeys[apiKey.id],
                            })
                          }
                          data-testid={`button-toggle-${apiKey.id}`}
                        >
                          {showKeys[apiKey.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          data-testid={`button-copy-${apiKey.id}`}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="flex gap-4 text-xs text-muted-foreground">
                        <span>Created: {apiKey.created}</span>
                        <span>Last used: {apiKey.lastUsed}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  {apiKey.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-deactivate-${apiKey.id}`}
                    >
                      Deactivate
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-delete-${apiKey.id}`}
                  >
                    Delete
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">Security Best Practices</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Never commit API keys to version control</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Rotate keys regularly and deactivate unused keys</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Use different keys for development and production</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
