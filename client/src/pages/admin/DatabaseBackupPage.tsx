import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Database, Download, RefreshCw, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function DatabaseBackupPage() {
  const { toast } = useToast();
  const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
  const [selectedBackup, setSelectedBackup] = useState<any>(null);

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

  const handleCreateBackup = () => {
    if (confirm("Are you sure you want to create a manual backup now? This may take a few minutes.")) {
      toast({
        title: "Backup Started",
        description: "Database backup has been initiated. You will be notified when it completes.",
      });
      // In a real implementation, this would call an API to create a backup
    }
  };

  const handleDownloadBackup = (backup: any) => {
    toast({
      title: "Download Started",
      description: `Downloading backup: ${backup.name}`,
    });
    // In a real implementation, this would trigger a download from the server
  };

  const handleRestoreBackup = (backup: any) => {
    setSelectedBackup(backup);
    setRestoreDialogOpen(true);
  };

  const confirmRestore = () => {
    if (selectedBackup && confirm(`WARNING: This will restore the database to the state of "${selectedBackup.name}". This action cannot be undone. Are you absolutely sure?`)) {
      toast({
        title: "Restore Started",
        description: `Restoring database from backup: ${selectedBackup.name}. This may take several minutes.`,
        variant: "destructive",
      });
      setRestoreDialogOpen(false);
      setSelectedBackup(null);
      // In a real implementation, this would call an API to restore the backup
    }
  };

  const handleEditSchedule = () => {
    toast({
      title: "Edit Schedule",
      description: "Backup schedule configuration is coming soon.",
    });
  };

  return (
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
            <Button data-testid="button-create-backup" onClick={handleCreateBackup}>
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
            <Button variant="outline" size="sm" data-testid="button-edit-schedule" onClick={handleEditSchedule}>
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
                      onClick={() => handleDownloadBackup(backup)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-restore-${backup.id}`}
                      onClick={() => handleRestoreBackup(backup)}
                    >
                      Restore
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Restore Confirmation Dialog */}
        <Dialog open={restoreDialogOpen} onOpenChange={setRestoreDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirm Database Restore
              </DialogTitle>
              <DialogDescription>
                This is a destructive operation that cannot be undone.
              </DialogDescription>
            </DialogHeader>
            {selectedBackup && (
              <div className="space-y-4">
                <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                  <p className="font-semibold mb-2">Warning:</p>
                  <ul className="list-disc list-inside space-y-1 text-sm">
                    <li>All current data will be replaced with data from the backup</li>
                    <li>This action cannot be undone</li>
                    <li>The system may be unavailable during the restore process</li>
                  </ul>
                </div>
                <div>
                  <p className="text-sm mb-1"><strong>Backup:</strong> {selectedBackup.name}</p>
                  <p className="text-sm mb-1"><strong>Size:</strong> {selectedBackup.size}</p>
                  <p className="text-sm"><strong>Created:</strong> {selectedBackup.createdAt}</p>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => {
                    setRestoreDialogOpen(false);
                    setSelectedBackup(null);
                  }}>
                    Cancel
                  </Button>
                  <Button variant="destructive" onClick={confirmRestore}>
                    Confirm Restore
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    );
}
