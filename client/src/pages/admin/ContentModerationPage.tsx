import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertTriangle, CheckCircle, XCircle, Flag } from "lucide-react";

export default function ContentModerationPage() {
  const [selectedTab, setSelectedTab] = useState("pending");

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

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

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
                            >
                              View Content
                            </Button>
                            <Button
                              size="sm"
                              data-testid={`button-approve-${report.id}`}
                            >
                              <CheckCircle className="h-4 w-4 mr-2" />
                              Approve
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              data-testid={`button-remove-${report.id}`}
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
      </main>

      <Footer />
    </div>
  );
}
