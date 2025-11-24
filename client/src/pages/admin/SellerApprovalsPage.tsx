import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  FileText,
  Building2,
  User,
  Briefcase,
} from "lucide-react";

export default function SellerApprovalsPage() {
  const [selectedTab, setSelectedTab] = useState("pending");

  const approvals = [
    {
      id: "SA-001",
      sellerName: "Prestige Constructions Pvt Ltd",
      sellerType: "Builder",
      email: "info@prestige.com",
      phone: "+91 22 1234 5678",
      submittedDate: "Nov 24, 2025",
      documentsCount: 5,
      reraNumber: "RERA123456789",
      status: "pending",
      icon: Building2,
    },
    {
      id: "SA-002",
      sellerName: "Rahul Sharma",
      sellerType: "Individual",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      submittedDate: "Nov 23, 2025",
      documentsCount: 3,
      status: "pending",
      icon: User,
    },
    {
      id: "SA-003",
      sellerName: "Real Estate Pro",
      sellerType: "Broker",
      email: "contact@realestatepro.com",
      phone: "+91 98456 78901",
      submittedDate: "Nov 22, 2025",
      documentsCount: 4,
      reraNumber: "RERA987654321",
      status: "approved",
      icon: Briefcase,
    },
    {
      id: "SA-004",
      sellerName: "Elite Properties",
      sellerType: "Broker",
      email: "info@elite.com",
      phone: "+91 98123 45678",
      submittedDate: "Nov 21, 2025",
      documentsCount: 4,
      reraNumber: "RERA456789123",
      status: "rejected",
      rejectionReason: "RERA certificate could not be verified",
      icon: Briefcase,
    },
  ];

  const filterApprovals = () => {
    return approvals.filter((a) => a.status === selectedTab);
  };

  const filteredApprovals = filterApprovals();

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Seller Approvals
            </h1>
            <p className="text-muted-foreground">
              Review and approve seller registrations
            </p>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({approvals.filter((a) => a.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="approved" data-testid="tab-approved">
                Approved ({approvals.filter((a) => a.status === "approved").length})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                Rejected ({approvals.filter((a) => a.status === "rejected").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filteredApprovals.map((approval) => {
                  const Icon = approval.icon;
                  return (
                    <Card key={approval.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        {/* Seller Info */}
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-start gap-3 mb-3">
                              <div className="p-3 rounded-lg bg-primary/10">
                                <Icon className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {approval.sellerName}
                                  </h3>
                                  {approval.status === "pending" && (
                                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                                      <Clock className="h-3 w-3 mr-1" />
                                      Pending
                                    </Badge>
                                  )}
                                  {approval.status === "approved" && (
                                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                                      <CheckCircle className="h-3 w-3 mr-1" />
                                      Approved
                                    </Badge>
                                  )}
                                  {approval.status === "rejected" && (
                                    <Badge variant="destructive">
                                      <XCircle className="h-3 w-3 mr-1" />
                                      Rejected
                                    </Badge>
                                  )}
                                </div>
                                <Badge variant="outline" className="mb-3">
                                  {approval.sellerType}
                                </Badge>
                                <div className="space-y-1 text-sm text-muted-foreground">
                                  <p>{approval.email}</p>
                                  <p>{approval.phone}</p>
                                  {approval.reraNumber && (
                                    <p>RERA: {approval.reraNumber}</p>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />
                              <span>{approval.documentsCount} documents</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Clock className="h-4 w-4 text-muted-foreground" />
                              <span>Submitted {approval.submittedDate}</span>
                            </div>
                          </div>

                          {approval.rejectionReason && (
                            <div className="p-4 bg-destructive/5 border border-destructive/20 rounded-lg">
                              <p className="text-sm text-destructive">
                                <strong>Rejection Reason:</strong> {approval.rejectionReason}
                              </p>
                            </div>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex lg:flex-col gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 lg:flex-none"
                            data-testid={`button-view-${approval.id}`}
                          >
                            <Eye className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">View Details</span>
                          </Button>
                          {approval.status === "pending" && (
                            <>
                              <Button
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-approve-${approval.id}`}
                              >
                                <CheckCircle className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Approve</span>
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-reject-${approval.id}`}
                              >
                                <XCircle className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Reject</span>
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>

              {filteredApprovals.length === 0 && (
                <div className="text-center py-16">
                  <FileText className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No {selectedTab} approvals
                  </h3>
                  <p className="text-muted-foreground">
                    There are currently no {selectedTab} seller registrations
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
