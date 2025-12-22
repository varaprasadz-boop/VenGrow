import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { FileText, Search } from "lucide-react";

export default function AuditLogsPage() {
  const logs = [
    {
      id: "1",
      timestamp: "Nov 24, 2025 10:30 AM",
      user: "admin@propconnect.com",
      action: "User Approved",
      target: "Seller: Raj Properties",
      ipAddress: "192.168.1.1",
      type: "approval",
    },
    {
      id: "2",
      timestamp: "Nov 24, 2025 10:15 AM",
      user: "admin@propconnect.com",
      action: "Listing Moderated",
      target: "Property: #12345",
      ipAddress: "192.168.1.1",
      type: "moderation",
    },
    {
      id: "3",
      timestamp: "Nov 24, 2025 09:45 AM",
      user: "superadmin@propconnect.com",
      action: "Settings Updated",
      target: "Payment Settings",
      ipAddress: "10.0.0.5",
      type: "settings",
    },
  ];

  const getTypeBadge = (type: string) => {
    const badges: Record<string, { label: string; className: string }> = {
      approval: {
        label: "Approval",
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
      },
      moderation: {
        label: "Moderation",
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
      },
      settings: {
        label: "Settings",
        className: "bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500",
      },
    };
    const badge = badges[type] || badges.settings;
    return <Badge className={badge.className}>{badge.label}</Badge>;
  };

  return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <FileText className="h-8 w-8 text-primary" />
              Audit Logs
            </h1>
            <p className="text-muted-foreground">
              Track all administrative actions and system changes
            </p>
          </div>

          {/* Search */}
          <Card className="p-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search logs by user, action, or target..."
                className="pl-10"
                data-testid="input-search"
              />
            </div>
          </Card>

          {/* Logs */}
          <div className="space-y-3">
            {logs.map((log) => (
              <Card key={log.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{log.action}</h3>
                      {getTypeBadge(log.type)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-3">
                      {log.target}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span>{log.user}</span>
                      <span>•</span>
                      <span>IP: {log.ipAddress}</span>
                      <span>•</span>
                      <span>{log.timestamp}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
    );
}
