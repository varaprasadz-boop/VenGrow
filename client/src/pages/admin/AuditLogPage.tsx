import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Shield, AlertTriangle, Info } from "lucide-react";

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const logs = [
    {
      id: "1",
      timestamp: "Nov 24, 2025, 10:30:15 AM",
      user: "admin@propconnect.com",
      action: "Approved Listing",
      resource: "Listing #1234",
      ipAddress: "103.25.45.67",
      severity: "info",
      details: "Approved listing: Luxury 3BHK Apartment",
    },
    {
      id: "2",
      timestamp: "Nov 24, 2025, 09:15:42 AM",
      user: "admin@propconnect.com",
      action: "Updated System Settings",
      resource: "Email Configuration",
      ipAddress: "103.25.45.67",
      severity: "warning",
      details: "Changed SMTP settings for notification emails",
    },
    {
      id: "3",
      timestamp: "Nov 23, 2025, 05:45:33 PM",
      user: "admin@propconnect.com",
      action: "Deleted User",
      resource: "User #5678",
      ipAddress: "103.25.45.68",
      severity: "critical",
      details: "Permanently deleted user account due to ToS violation",
    },
    {
      id: "4",
      timestamp: "Nov 23, 2025, 02:30:18 PM",
      user: "moderator@propconnect.com",
      action: "Rejected Listing",
      resource: "Listing #9012",
      ipAddress: "103.25.45.69",
      severity: "info",
      details: "Rejected listing due to inappropriate content",
    },
  ];

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case "critical":
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />;
      case "info":
        return <Info className="h-5 w-5 text-blue-600" />;
      default:
        return <Shield className="h-5 w-5" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    switch (severity) {
      case "critical":
        return <Badge variant="destructive">Critical</Badge>;
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Warning
          </Badge>
        );
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            Info
          </Badge>
        );
      default:
        return null;
    }
  };

  const filterLogs = () => {
    let filtered = logs;
    if (filter !== "all") {
      filtered = filtered.filter((l) => l.severity === filter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.resource.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Audit Log</h1>
            <p className="text-muted-foreground">
              Complete audit trail of all admin actions
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Events</p>
              <p className="text-3xl font-bold">{logs.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Critical</p>
              <p className="text-3xl font-bold text-red-600">
                {logs.filter((l) => l.severity === "critical").length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Warnings</p>
              <p className="text-3xl font-bold text-yellow-600">
                {logs.filter((l) => l.severity === "warning").length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Info</p>
              <p className="text-3xl font-bold text-blue-600">
                {logs.filter((l) => l.severity === "info").length}
              </p>
            </Card>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search audit logs..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-filter">
                <SelectValue placeholder="Filter by severity" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Severities</SelectItem>
                <SelectItem value="critical">Critical</SelectItem>
                <SelectItem value="warning">Warning</SelectItem>
                <SelectItem value="info">Info</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Logs */}
          <div className="space-y-3">
            {filterLogs().map((log) => (
              <Card key={log.id} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-muted">
                    {getSeverityIcon(log.severity)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-1">
                          <h3 className="font-semibold">{log.action}</h3>
                          {getSeverityBadge(log.severity)}
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          {log.details}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <span>
                            <strong>User:</strong> {log.user}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>Resource:</strong> {log.resource}
                          </span>
                          <span>•</span>
                          <span>
                            <strong>IP:</strong> {log.ipAddress}
                          </span>
                        </div>
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      {log.timestamp}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {filterLogs().length === 0 && (
            <div className="text-center py-16">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No logs found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "No audit logs to display"}
              </p>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
