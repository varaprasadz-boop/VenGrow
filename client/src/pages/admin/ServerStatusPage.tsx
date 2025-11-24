import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Server } from "lucide-react";

export default function ServerStatusPage() {
  const servers = [
    {
      id: "web-1",
      type: "Web Server",
      status: "online",
      cpu: "45%",
      memory: "62%",
      uptime: "99.98%",
    },
    {
      id: "db-1",
      type: "Database",
      status: "online",
      cpu: "38%",
      memory: "71%",
      uptime: "99.99%",
    },
    {
      id: "cache-1",
      type: "Cache",
      status: "online",
      cpu: "12%",
      memory: "34%",
      uptime: "100%",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "online":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Online
          </Badge>
        );
      case "offline":
        return <Badge variant="destructive">Offline</Badge>;
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
              <Server className="h-8 w-8 text-primary" />
              Server Status
            </h1>
            <p className="text-muted-foreground">
              Monitor infrastructure health
            </p>
          </div>

          <div className="space-y-4">
            {servers.map((server) => (
              <Card key={server.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{server.type}</h3>
                      {getStatusBadge(server.status)}
                    </div>
                    <code className="text-xs px-2 py-1 bg-muted rounded font-mono">
                      {server.id}
                    </code>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-6">
                  <div>
                    <p className="text-sm text-muted-foreground mb-2">CPU Usage</p>
                    <p className="text-2xl font-bold">{server.cpu}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: server.cpu }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Memory</p>
                    <p className="text-2xl font-bold">{server.memory}</p>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: server.memory }}
                      />
                    </div>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground mb-2">Uptime</p>
                    <p className="text-2xl font-bold text-green-600">
                      {server.uptime}
                    </p>
                  </div>
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
