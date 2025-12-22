import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react";

export default function JobQueuePage() {
  const stats = [
    { label: "Pending", count: 23, color: "yellow" },
    { label: "Processing", count: 5, color: "blue" },
    { label: "Completed", count: 1234, color: "green" },
    { label: "Failed", count: 12, color: "red" },
  ];

  const jobs = [
    {
      id: "1",
      type: "email.send",
      status: "processing",
      createdAt: "2 min ago",
      attempts: 1,
    },
    {
      id: "2",
      type: "property.sync",
      status: "pending",
      createdAt: "5 min ago",
      attempts: 0,
    },
    {
      id: "3",
      type: "image.optimize",
      status: "failed",
      createdAt: "10 min ago",
      attempts: 3,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "processing":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            <RefreshCw className="h-3 w-3 mr-1 animate-spin" />
            Processing
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "failed":
        return (
          <Badge variant="destructive">
            <XCircle className="h-3 w-3 mr-1" />
            Failed
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Background Job Queue
            </h1>
            <p className="text-muted-foreground">
              Monitor and manage background tasks
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 text-center">
                <p className="text-3xl font-bold mb-1">{stat.count}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </Card>
            ))}
          </div>

          {/* Jobs */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-xl">Recent Jobs</h2>
              <Button variant="outline" size="sm" data-testid="button-refresh">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
            </div>
            <div className="space-y-3">
              {jobs.map((job) => (
                <Card key={job.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <code className="text-sm px-2 py-1 bg-muted rounded font-mono">
                          {job.type}
                        </code>
                        {getStatusBadge(job.status)}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Created {job.createdAt}</span>
                        <span>•</span>
                        <span>Attempts: {job.attempts}</span>
                      </div>
                    </div>
                    {job.status === "failed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-retry-${job.id}`}
                      >
                        Retry
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>
    );
}
