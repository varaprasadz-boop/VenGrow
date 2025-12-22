import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download } from "lucide-react";

export default function DatabasePage() {
  const stats = [
    { label: "Total Records", value: "45,234" },
    { label: "Database Size", value: "2.4 GB" },
    { label: "Tables", value: "18" },
    { label: "Connections", value: "12/100" },
  ];

  const backups = [
    { id: "1", date: "Nov 24, 2025 10:00 AM", size: "2.3 GB", status: "Success" },
    { id: "2", date: "Nov 23, 2025 10:00 AM", size: "2.2 GB", status: "Success" },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Database className="h-8 w-8 text-primary" />
              Database Management
            </h1>
            <p className="text-muted-foreground">
              Monitor database health and backups
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <p className="text-3xl font-bold mb-1" data-testid={`text-stat-value-${index}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground" data-testid={`text-stat-label-${index}`}>
                  {stat.label}
                </p>
              </Card>
            ))}
          </div>

          <Card className="p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-semibold text-lg">Recent Backups</h3>
              <Button variant="outline" size="sm" data-testid="button-backup">
                Create Backup
              </Button>
            </div>
            <div className="space-y-3">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium mb-1" data-testid={`text-backup-date-${backup.id}`}>
                      {backup.date}
                    </p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span data-testid={`text-backup-size-${backup.id}`}>
                        {backup.size}
                      </span>
                      <Badge
                        className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                        data-testid={`badge-backup-status-${backup.id}`}
                      >
                        {backup.status}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-download-${backup.id}`}
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">Warning</h3>
            <p className="text-sm text-muted-foreground">
              Database operations can affect platform performance. Perform backups
              during low-traffic hours.
            </p>
          </Card>
        </div>
      </main>
    );
}
