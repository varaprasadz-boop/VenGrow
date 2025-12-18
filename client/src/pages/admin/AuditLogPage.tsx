import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, Shield, AlertTriangle, Info, RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { AuditLog } from "@shared/schema";

export default function AuditLogPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: logs = [], isLoading, isError, refetch } = useQuery<AuditLog[]>({
    queryKey: ["/api/admin/audit-logs"],
  });

  const getSeverity = (action: string): string => {
    const criticalActions = ["deleted", "removed", "banned", "suspended"];
    const warningActions = ["rejected", "updated", "modified", "changed"];
    
    const actionLower = action.toLowerCase();
    if (criticalActions.some(a => actionLower.includes(a))) return "critical";
    if (warningActions.some(a => actionLower.includes(a))) return "warning";
    return "info";
  };

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
    let filtered = logs.map(log => ({
      ...log,
      severity: getSeverity(log.action),
    }));
    
    if (filter !== "all") {
      filtered = filtered.filter((l) => l.severity === filter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (l) =>
          l.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
          l.entityType.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (l.entityId || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredLogs = filterLogs();
  const criticalCount = logs.filter(l => getSeverity(l.action) === "critical").length;
  const warningCount = logs.filter(l => getSeverity(l.action) === "warning").length;
  const infoCount = logs.filter(l => getSeverity(l.action) === "info").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-48 mb-2" />
            <Skeleton className="h-6 w-64 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mb-6" />
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-32 w-full mb-3" />
            ))}
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Audit Logs</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the audit log data.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">Audit Log</h1>
              <p className="text-muted-foreground">
                Complete audit trail of all admin actions
              </p>
            </div>
            <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Events</p>
              <p className="text-3xl font-bold" data-testid="text-total-events">{logs.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Critical</p>
              <p className="text-3xl font-bold text-red-600" data-testid="text-critical-count">
                {criticalCount}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Warnings</p>
              <p className="text-3xl font-bold text-yellow-600" data-testid="text-warning-count">
                {warningCount}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Info</p>
              <p className="text-3xl font-bold text-blue-600" data-testid="text-info-count">
                {infoCount}
              </p>
            </Card>
          </div>

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

          {filteredLogs.length === 0 ? (
            <div className="text-center py-16">
              <Shield className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No logs found</h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "No audit logs to display"}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredLogs.map((log) => (
                <Card key={log.id} className="p-6" data-testid={`card-log-${log.id}`}>
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      {getSeverityIcon(log.severity)}
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1 flex-wrap">
                            <h3 className="font-semibold">{log.action}</h3>
                            {getSeverityBadge(log.severity)}
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                            <span>
                              <strong>Entity:</strong> {log.entityType}
                            </span>
                            {log.entityId && (
                              <>
                                <span>•</span>
                                <span>
                                  <strong>ID:</strong> {log.entityId.substring(0, 8)}...
                                </span>
                              </>
                            )}
                            {log.ipAddress && (
                              <>
                                <span>•</span>
                                <span>
                                  <strong>IP:</strong> {log.ipAddress}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {format(new Date(log.createdAt), "MMM d, yyyy, h:mm:ss a")}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
