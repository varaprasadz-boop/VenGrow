import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Shield, Plus, Trash2 } from "lucide-react";

export default function WhitelistManagementPage() {
  const whitelistedIPs = [
    {
      id: "1",
      ip: "192.168.1.1",
      description: "Office Network",
      addedBy: "Admin",
      addedDate: "Nov 1, 2025",
      status: "active",
    },
    {
      id: "2",
      ip: "10.0.0.5",
      description: "Dev Team",
      addedBy: "Super Admin",
      addedDate: "Oct 15, 2025",
      status: "active",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Shield className="h-8 w-8 text-primary" />
              IP Whitelist Management
            </h1>
            <p className="text-muted-foreground">
              Control admin panel access by IP address
            </p>
          </div>

          {/* Add New IP */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold mb-4">Add New IP Address</h3>
            <div className="flex gap-4">
              <Input
                placeholder="Enter IP address (e.g., 192.168.1.1)"
                className="flex-1"
                data-testid="input-ip"
              />
              <Input
                placeholder="Description (optional)"
                className="flex-1"
                data-testid="input-description"
              />
              <Button data-testid="button-add">
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </Card>

          {/* Whitelisted IPs */}
          <div className="space-y-4">
            {whitelistedIPs.map((entry) => (
              <Card key={entry.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold font-mono text-lg">{entry.ip}</h3>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        {entry.status}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {entry.description}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>Added by {entry.addedBy}</span>
                      <span>•</span>
                      <span>{entry.addedDate}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-remove-${entry.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          <Card className="p-6 mt-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">Important Security Note</h3>
            <p className="text-sm text-muted-foreground">
              Only add trusted IP addresses. Removing an IP will immediately block
              access from that address. Make sure you don't lock yourself out!
            </p>
          </Card>
        </div>
      </main>
    );
}
