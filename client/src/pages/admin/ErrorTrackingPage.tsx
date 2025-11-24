import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorTrackingPage() {
  const errors = [
    {
      id: "1",
      type: "TypeError",
      message: "Cannot read property 'map' of undefined",
      file: "PropertyList.tsx:45",
      occurrences: 12,
      lastSeen: "2 min ago",
      status: "new",
    },
    {
      id: "2",
      type: "NetworkError",
      message: "Failed to fetch property data",
      file: "api/properties.ts:23",
      occurrences: 5,
      lastSeen: "1 hour ago",
      status: "resolved",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "new":
        return (
          <Badge variant="destructive">New</Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Resolved
          </Badge>
        );
      default:
        return <Badge>{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <AlertTriangle className="h-8 w-8 text-primary" />
              Error Tracking
            </h1>
            <p className="text-muted-foreground">
              Monitor application errors and exceptions
            </p>
          </div>

          <div className="space-y-4">
            {errors.map((error) => (
              <Card key={error.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <code className="text-sm px-2 py-1 bg-muted rounded font-mono">
                        {error.type}
                      </code>
                      {getStatusBadge(error.status)}
                    </div>
                    <p className="font-semibold text-lg mb-2">{error.message}</p>
                    <p className="text-sm text-muted-foreground mb-3">
                      at {error.file}
                    </p>
                    <div className="flex items-center gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Occurrences: </span>
                        <span className="font-semibold">{error.occurrences}</span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Last seen: </span>
                        <span className="font-semibold">{error.lastSeen}</span>
                      </div>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-view-${error.id}`}
                  >
                    View Details
                  </Button>
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
