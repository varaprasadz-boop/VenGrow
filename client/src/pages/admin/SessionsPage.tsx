import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users } from "lucide-react";

export default function SessionsPage() {
  const sessions = [
    {
      id: "1",
      user: "user@example.com",
      role: "Buyer",
      device: "Chrome on Windows",
      ip: "103.25.x.x",
      location: "Mumbai, India",
      startTime: "2 hours ago",
      status: "active",
    },
    {
      id: "2",
      user: "seller@example.com",
      role: "Seller",
      device: "Safari on Mac",
      ip: "103.26.x.x",
      location: "Delhi, India",
      startTime: "5 hours ago",
      status: "active",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Users className="h-8 w-8 text-primary" />
              Active Sessions
            </h1>
            <p className="text-muted-foreground">
              Monitor user sessions and activity
            </p>
          </div>

          <div className="space-y-4">
            {sessions.map((session) => (
              <Card key={session.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{session.user}</h3>
                      <Badge variant="outline">{session.role}</Badge>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        {session.status}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground">Device</p>
                        <p className="font-medium">{session.device}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">IP Address</p>
                        <p className="font-medium font-mono">{session.ip}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Location</p>
                        <p className="font-medium">{session.location}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground">Started</p>
                        <p className="font-medium">{session.startTime}</p>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-end-${session.id}`}
                  >
                    End Session
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
}
