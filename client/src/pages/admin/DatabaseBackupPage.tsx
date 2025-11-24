import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Database, Download, RefreshCw, CheckCircle } from "lucide-react";

export default function DatabaseBackupPage() {
  const backups = [
    {
      id: "1",
      name: "Daily Backup - Nov 24",
      size: "2.4 GB",
      createdAt: "Nov 24, 2025 02:00 AM",
      type: "Automated",
      status: "completed",
    },
    {
      id: "2",
      name: "Daily Backup - Nov 23",
      size: "2.3 GB",
      createdAt: "Nov 23, 2025 02:00 AM",
      type: "Automated",
      status: "completed",
    },
    {
      id: "3",
      name: "Manual Backup - Before Migration",
      size: "2.2 GB",
      createdAt: "Nov 20, 2025 10:30 AM",
      type: "Manual",
      status: "completed",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
                <Database className="h-8 w-8 text-primary" />
                Database Backups
              </h1>
              <p className="text-muted-foreground">
                Manage and restore database backups
              </p>
            </div>
            <Button data-testid="button-create-backup">
              <RefreshCw className="h-4 w-4 mr-2" />
              Create Backup Now
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Database className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Total Backups</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">2.4 GB</p>
                  <p className="text-sm text-muted-foreground">Latest Size</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <RefreshCw className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">Daily</p>
                  <p className="text-sm text-muted-foreground">Auto Backup</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Backup Schedule */}
          <Card className="p-6 mb-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-4">Backup Schedule</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Automatic backups run daily at 2:00 AM IST. Backups are retained for
              30 days.
            </p>
            <Button variant="outline" size="sm" data-testid="button-edit-schedule">
              Edit Schedule
            </Button>
          </Card>

          {/* Backup List */}
          <div className="space-y-4">
            {backups.map((backup) => (
              <Card key={backup.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{backup.name}</h3>
                      <Badge
                        variant={backup.type === "Automated" ? "default" : "outline"}
                      >
                        {backup.type}
                      </Badge>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        {backup.status}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span>Size: {backup.size}</span>
                      <span>•</span>
                      <span>Created: {backup.createdAt}</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${backup.id}`}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-restore-${backup.id}`}
                    >
                      Restore
                    </Button>
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
