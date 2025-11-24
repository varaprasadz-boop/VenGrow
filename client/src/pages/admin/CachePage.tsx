import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Trash2 } from "lucide-react";

export default function CachePage() {
  const cacheStats = [
    { key: "property_listings", size: "2.4 MB", entries: 1234, hitRate: "94%" },
    { key: "user_sessions", size: "512 KB", entries: 456, hitRate: "98%" },
    { key: "search_results", size: "1.8 MB", entries: 890, hitRate: "89%" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              Cache Management
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage application cache
            </p>
          </div>

          <div className="space-y-4 mb-8">
            {cacheStats.map((cache, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <code
                        className="text-sm px-2 py-1 bg-muted rounded font-mono"
                        data-testid={`text-cache-key-${index}`}
                      >
                        {cache.key}
                      </code>
                      <Badge
                        className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                        data-testid={`badge-hit-rate-${index}`}
                      >
                        {cache.hitRate} hit rate
                      </Badge>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div>
                        <span className="text-muted-foreground">Size: </span>
                        <span
                          className="font-semibold"
                          data-testid={`text-cache-size-${index}`}
                        >
                          {cache.size}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Entries: </span>
                        <span
                          className="font-semibold"
                          data-testid={`text-cache-entries-${index}`}
                        >
                          {cache.entries}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-clear-${index}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Clear
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Button variant="destructive" size="lg" data-testid="button-clear-all">
            <Trash2 className="h-4 w-4 mr-2" />
            Clear All Cache
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
