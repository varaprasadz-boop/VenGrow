import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { AlertTriangle, CheckCircle, XCircle, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function ContentModerationPage() {
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("pending");
  const [selectedReport, setSelectedReport] = useState<any>(null);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const reports = [
    {
      id: "RPT-001",
      type: "listing",
      reportedContent: "Luxury 3BHK Apartment - Fake images used",
      reportedBy: "Rahul Sharma",
      reason: "Misleading Information",
      status: "pending",
      priority: "high",
      date: "Nov 24, 2025",
    },
    {
      id: "RPT-002",
      type: "review",
      reportedContent: "Negative review with inappropriate language",
      reportedBy: "Priya Patel",
      reason: "Inappropriate Content",
      status: "pending",
      priority: "medium",
      date: "Nov 23, 2025",
    },
    {
      id: "RPT-003",
      type: "listing",
      reportedContent: "Commercial space with incorrect pricing",
      reportedBy: "Amit Kumar",
      reason: "Spam/Scam",
      status: "resolved",
      priority: "low",
      date: "Nov 22, 2025",
      action: "Listing removed",
    },
  ];

  const getPriorityBadge = (priority: string) => {
    switch (priority) {
      case "high":
        return <Badge variant="destructive">High Priority</Badge>;
      case "medium":
        return <Badge variant="outline">Medium</Badge>;
      case "low":
        return <Badge variant="outline">Low</Badge>;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Pending Review
          </Badge>
        );
      case "resolved":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Resolved
          </Badge>
        );
      default:
        return null;
    }
  };

  const filterReports = () => {
    if (selectedTab === "all") return reports;
    return reports.filter((r) => r.status === selectedTab);
  };

  const handleViewContent = (report: any) => {
    setSelectedReport(report);
    setViewDialogOpen(true);
  };

  const handleApprove = (reportId: string) => {
    if (confirm("Are you sure you want to approve this content? This will mark the report as resolved.")) {
      toast({
        title: "Content Approved",
        description: `Report ${reportId} has been approved and marked as resolved.`,
      });
      // In a real implementation, this would call an API to update the report status
    }
  };

  const handleRemove = (reportId: string) => {
    if (confirm("Are you sure you want to remove this content? This action cannot be undone.")) {
      toast({
        title: "Content Removed",
        description: `Content from report ${reportId} has been removed.`,
        variant: "destructive",
      });
      // In a real implementation, this would call an API to remove the content
    }
  };

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Content Moderation
            </h1>
            <p className="text-muted-foreground">
              Review and moderate reported content
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <AlertTriangle className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {reports.filter((r) => r.status === "pending").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {reports.filter((r) => r.status === "resolved").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Resolved</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {reports.filter((r) => r.priority === "high").length}
                  </p>
                  <p className="text-sm text-muted-foreground">High Priority</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Reports List */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({reports.length})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({reports.filter((r) => r.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="resolved" data-testid="tab-resolved">
                Resolved ({reports.filter((r) => r.status === "resolved").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filterReports().map((report) => (
                  <Card key={report.id} className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-lg bg-muted">
                        <Flag className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-semibold">{report.id}</h3>
                              {getStatusBadge(report.status)}
                              {getPriorityBadge(report.priority)}
                            </div>
                            <p className="text-sm mb-2">{report.reportedContent}</p>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>
                                <strong>Reported by:</strong> {report.reportedBy}
                              </span>
                              <span>•</span>
                              <span>
                                <strong>Reason:</strong> {report.reason}
                              </span>
                              <span>•</span>
                              <span>{report.date}</span>
                            </div>
                          </div>
                        </div>

                        {report.status === "resolved" && report.action && (
                          <div className="p-3 bg-green-50 dark:bg-green-900/10 border border-green-200 dark:border-green-900/20 rounded-lg mb-4">
                            <p className="text-sm text-green-900 dark:text-green-400">
                              <strong>Action taken:</strong> {report.action}
                            </p>
                          </div>
                        )}

                        {report.status === "pending" && (
                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              data-testid={`button-view-${report.id}`}
                              onClick={() => handleViewContent(report)}
                            >
                              View Content
                            </Button>
                            <Button
                              size="sm"
                              data-testid={`button-approve-${report.id}`}
                              onClick={() => handleApprove(report.id)}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              data-testid={`button-remove-${report.id}`}
                              onClick={() => handleRemove(report.id)}
                            >
                              <XCircle className="h-4 w-4 mr-2" />
                              Remove Content
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>

        {/* View Content Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Report Details</DialogTitle>
              <DialogDescription>
                Review the reported content and take appropriate action
              </DialogDescription>
            </DialogHeader>
            {selectedReport && (
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Report ID: {selectedReport.id}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{selectedReport.reportedContent}</p>
                  <div className="space-y-2 text-sm">
                    <div>
                      <strong>Reported by:</strong> {selectedReport.reportedBy}
                    </div>
                    <div>
                      <strong>Reason:</strong> {selectedReport.reason}
                    </div>
                    <div>
                      <strong>Date:</strong> {selectedReport.date}
                    </div>
                    <div>
                      <strong>Type:</strong> {selectedReport.type}
                    </div>
                  </div>
                </div>
                <div className="flex justify-end gap-2 pt-4 border-t">
                  <Button variant="outline" onClick={() => setViewDialogOpen(false)}>
                    Close
                  </Button>
                  <Button onClick={() => {
                    handleApprove(selectedReport.id);
                    setViewDialogOpen(false);
                  }}>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button variant="destructive" onClick={() => {
                    handleRemove(selectedReport.id);
                    setViewDialogOpen(false);
                  }}>
                    <XCircle className="h-4 w-4 mr-2" />
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    );
}
