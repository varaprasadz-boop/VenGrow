import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Download,
  FileText,
  TrendingUp,
  Users,
  Building,
  DollarSign,
  Calendar,
} from "lucide-react";

export default function ReportsPage() {
  const reports = [
    {
      id: "1",
      title: "User Growth Report",
      description: "Monthly user acquisition and retention metrics",
      icon: Users,
      frequency: "Monthly",
      lastGenerated: "Nov 1, 2025",
      fileSize: "2.4 MB",
    },
    {
      id: "2",
      title: "Revenue Report",
      description: "Package sales and transaction summary",
      icon: DollarSign,
      frequency: "Monthly",
      lastGenerated: "Nov 1, 2025",
      fileSize: "1.8 MB",
    },
    {
      id: "3",
      title: "Property Listings Report",
      description: "Active, pending, and sold properties analysis",
      icon: Building,
      frequency: "Weekly",
      lastGenerated: "Nov 20, 2025",
      fileSize: "3.2 MB",
    },
    {
      id: "4",
      title: "Performance Analytics",
      description: "Platform usage and engagement metrics",
      icon: TrendingUp,
      frequency: "Weekly",
      lastGenerated: "Nov 20, 2025",
      fileSize: "4.1 MB",
    },
  ];

  const customReports = [
    {
      name: "Seller Performance",
      dateRange: "Oct 1 - Oct 31, 2025",
      status: "ready",
    },
    {
      name: "Regional Analysis",
      dateRange: "Oct 1 - Oct 31, 2025",
      status: "processing",
    },
    {
      name: "Category Breakdown",
      dateRange: "Sep 1 - Sep 30, 2025",
      status: "ready",
    },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Reports & Analytics
              </h1>
              <p className="text-muted-foreground">
                Download and analyze platform reports
              </p>
            </div>
            <Button data-testid="button-generate">
              <FileText className="h-4 w-4 mr-2" />
              Generate Custom Report
            </Button>
          </div>

          {/* Automated Reports */}
          <div className="mb-8">
            <h2 className="font-semibold text-xl mb-6">Automated Reports</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {reports.map((report) => (
                <Card key={report.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <report.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold mb-1">{report.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4">
                        {report.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground mb-4">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <span>{report.frequency}</span>
                        </div>
                        <span>•</span>
                        <span>Last: {report.lastGenerated}</span>
                        <span>•</span>
                        <span>{report.fileSize}</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="w-full"
                        data-testid={`button-download-${report.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Download Report
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Custom Reports */}
          <div>
            <h2 className="font-semibold text-xl mb-6">Custom Reports</h2>
            <Card className="p-6">
              <div className="space-y-4">
                {customReports.map((report, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border rounded-lg"
                  >
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">{report.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {report.dateRange}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      {report.status === "ready" ? (
                        <>
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                            Ready
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            data-testid={`button-download-custom-${index}`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Download
                          </Button>
                        </>
                      ) : (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
                          Processing...
                        </Badge>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    );
}
