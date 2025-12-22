import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { HardDrive, Trash2, RotateCw } from "lucide-react";

export default function CacheManagementPage() {
  const caches = [
    {
      id: "1",
      name: "Property Listings Cache",
      size: "245 MB",
      entries: 15234,
      hitRate: "95.2%",
      lastCleared: "2 days ago",
    },
    {
      id: "2",
      name: "User Session Cache",
      size: "89 MB",
      entries: 8765,
      hitRate: "98.5%",
      lastCleared: "1 day ago",
    },
    {
      id: "3",
      name: "Search Results Cache",
      size: "156 MB",
      entries: 12456,
      hitRate: "87.3%",
      lastCleared: "3 hours ago",
    },
    {
      id: "4",
      name: "Image Thumbnails Cache",
      size: "512 MB",
      entries: 25678,
      hitRate: "92.7%",
      lastCleared: "1 week ago",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Cache Management
              </h1>
              <p className="text-muted-foreground">
                Monitor and manage application caches
              </p>
            </div>
            <Button variant="outline" data-testid="button-clear-all">
              <Trash2 className="h-4 w-4 mr-2" />
              Clear All Caches
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <HardDrive className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">1.0 GB</p>
                  <p className="text-sm text-muted-foreground">Total Size</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <RotateCw className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">93.4%</p>
                  <p className="text-sm text-muted-foreground">Avg Hit Rate</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <HardDrive className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">62K</p>
                  <p className="text-sm text-muted-foreground">Total Entries</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Cache List */}
          <div className="space-y-4">
            {caches.map((cache) => (
              <Card key={cache.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-3">{cache.name}</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Size</p>
                        <p className="font-medium">{cache.size}</p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Entries</p>
                        <p className="font-medium">
                          {cache.entries.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">Hit Rate</p>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          {cache.hitRate}
                        </Badge>
                      </div>
                      <div>
                        <p className="text-xs text-muted-foreground mb-1">
                          Last Cleared
                        </p>
                        <p className="font-medium text-sm">{cache.lastCleared}</p>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-refresh-${cache.id}`}
                    >
                      <RotateCw className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-clear-${cache.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
}
