import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Filter } from "lucide-react";
import { exportToCSV } from "@/lib/utils";

export default function LogsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const logs = [
    {
      id: "1",
      level: "info",
      message: "User login successful",
      user: "user@example.com",
      timestamp: "2025-11-24 10:30:25",
      ip: "192.168.1.1",
    },
    {
      id: "2",
      level: "warning",
      message: "Multiple failed login attempts detected",
      user: "suspicious@example.com",
      timestamp: "2025-11-24 10:28:15",
      ip: "192.168.1.100",
    },
    {
      id: "3",
      level: "error",
      message: "Payment gateway connection timeout",
      user: "system",
      timestamp: "2025-11-24 10:15:42",
      ip: "N/A",
    },
    {
      id: "4",
      level: "info",
      message: "New property listing created",
      user: "seller@example.com",
      timestamp: "2025-11-24 10:00:12",
      ip: "192.168.1.50",
    },
  ];

  const getLevelBadge = (level: string) => {
    switch (level) {
      case "info":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            INFO
          </Badge>
        );
      case "warning":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            WARNING
          </Badge>
        );
      case "error":
        return <Badge variant="destructive">ERROR</Badge>;
      default:
        return null;
    }
  };

  const handleExport = () => {
    const filteredLogs = searchQuery 
      ? logs.filter(l => l.message.toLowerCase().includes(searchQuery.toLowerCase()) || l.user.toLowerCase().includes(searchQuery.toLowerCase()))
      : logs;
    exportToCSV(filteredLogs, `system_logs_${new Date().toISOString().split('T')[0]}`, [
      { key: 'id', header: 'ID' },
      { key: 'level', header: 'Level' },
      { key: 'message', header: 'Message' },
      { key: 'user', header: 'User' },
      { key: 'timestamp', header: 'Timestamp' },
      { key: 'ip', header: 'IP Address' },
    ]);
  };

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                System Logs
              </h1>
              <p className="text-muted-foreground">
                Monitor application activity and errors
              </p>
            </div>
            <Button variant="outline" onClick={handleExport} data-testid="button-download">
              <Download className="h-4 w-4 mr-2" />
              Export Logs
            </Button>
          </div>

          {/* Filters */}
          <Card className="p-4 mb-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search logs..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  data-testid="input-search"
                />
              </div>
              <Button variant="outline" data-testid="button-filter">
                <Filter className="h-4 w-4 mr-2" />
                Filter
              </Button>
            </div>
          </Card>

          {/* Logs Table */}
          <Card className="p-6">
            <div className="space-y-4">
              {logs.map((log) => (
                <div
                  key={log.id}
                  className="flex items-start justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {getLevelBadge(log.level)}
                      <span className="text-xs text-muted-foreground font-mono">
                        {log.timestamp}
                      </span>
                    </div>
                    <p className="font-medium mb-1">{log.message}</p>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>User: {log.user}</span>
                      <span>IP: {log.ip}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
}
