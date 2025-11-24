import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Database, Download, Clock, CheckCircle } from "lucide-react";

export default function BackupSettingsPage() {
  const backups = [
    {
      id: "1",
      name: "Daily Backup - Nov 24, 2025",
      size: "2.4 GB",
      date: "Nov 24, 2025, 03:00 AM",
      type: "automatic",
      status: "completed",
    },
    {
      id: "2",
      name: "Daily Backup - Nov 23, 2025",
      size: "2.3 GB",
      date: "Nov 23, 2025, 03:00 AM",
      type: "automatic",
      status: "completed",
    },
    {
      id: "3",
      name: "Manual Backup - Pre-Update",
      size: "2.3 GB",
      date: "Nov 20, 2025, 10:30 AM",
      type: "manual",
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
              <h1 className="font-serif font-bold text-3xl mb-2">
                Backup & Restore
              </h1>
              <p className="text-muted-foreground">
                Manage database backups and restoration
              </p>
            </div>
            <Button data-testid="button-create-backup">
              <Database className="h-4 w-4 mr-2" />
              Create Backup
            </Button>
          </div>

          {/* Settings */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Backup Settings</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="auto-backup">Automatic Backups</Label>
                  <p className="text-sm text-muted-foreground">
                    Create daily backups automatically
                  </p>
                </div>
                <Switch id="auto-backup" defaultChecked data-testid="switch-auto-backup" />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Backup Schedule</Label>
                  <p className="text-sm text-muted-foreground">
                    Daily at 3:00 AM IST
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change Schedule
                </Button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Retention Period</Label>
                  <p className="text-sm text-muted-foreground">
                    Keep backups for 30 days
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Change Period
                </Button>
              </div>
            </div>
          </Card>

          {/* Backup History */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Backup History</h3>
            <div className="space-y-4">
              {backups.map((backup) => (
                <div
                  key={backup.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-muted">
                      <Database className="h-5 w-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1">
                        <h4 className="font-medium">{backup.name}</h4>
                        {backup.type === "automatic" ? (
                          <Badge variant="outline">
                            <Clock className="h-3 w-3 mr-1" />
                            Auto
                          </Badge>
                        ) : (
                          <Badge variant="outline">Manual</Badge>
                        )}
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          {backup.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{backup.size}</span>
                        <span>•</span>
                        <span>{backup.date}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-download-${backup.id}`}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      size="sm"
                      data-testid={`button-restore-${backup.id}`}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
