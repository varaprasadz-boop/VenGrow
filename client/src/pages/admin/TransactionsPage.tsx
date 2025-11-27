import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
  CreditCard,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { Payment } from "@shared/schema";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function TransactionsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: payments = [], isLoading, isError, refetch } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const filterTransactions = () => {
    let filtered = payments;
    if (selectedTab !== "all") {
      filtered = filtered.filter((t) => t.status === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredTransactions = filterTransactions();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string; icon: typeof CheckCircle }> = {
      completed: {
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        label: "Completed",
        icon: CheckCircle,
      },
      pending: {
        className: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500",
        label: "Pending",
        icon: Clock,
      },
      failed: {
        className: "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500",
        label: "Failed",
        icon: XCircle,
      },
      refunded: {
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500",
        label: "Refunded",
        icon: RefreshCw,
      },
    };
    return variants[status] || variants.pending;
  };

  const totalRevenue = payments
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.amount, 0);

  const completedCount = payments.filter((t) => t.status === "completed").length;
  const pendingCount = payments.filter((t) => t.status === "pending").length;
  const failedCount = payments.filter((t) => t.status === "failed").length;
  const refundedCount = payments.filter((t) => t.status === "refunded").length;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-10 w-full mb-6" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-36 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Transactions</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading transaction data. Please try again.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Transactions
              </h1>
              <p className="text-muted-foreground">
                View and manage all payment transactions
              </p>
            </div>
            <Button data-testid="button-export">
              <Download className="h-4 w-4 mr-2" />
              Export Report
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold font-serif text-primary">
                {formatCurrency(totalRevenue)}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold font-serif">
                {completedCount}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold font-serif">
                {pendingCount}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Failed</p>
              <p className="text-3xl font-bold font-serif">
                {failedCount}
              </p>
            </Card>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({payments.length})
              </TabsTrigger>
              <TabsTrigger value="completed" data-testid="tab-completed">
                Completed ({completedCount})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({pendingCount})
              </TabsTrigger>
              <TabsTrigger value="failed" data-testid="tab-failed">
                Failed ({failedCount})
              </TabsTrigger>
              <TabsTrigger value="refunded" data-testid="tab-refunded">
                Refunded ({refundedCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredTransactions.length === 0 ? (
                <div className="text-center py-16">
                  <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} transactions`}
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredTransactions.map((txn) => {
                    const statusInfo = getStatusBadge(txn.status);
                    const StatusIcon = statusInfo.icon;
                    const gst = Math.round(txn.amount * 0.18);
                    const total = txn.amount + gst;
                    return (
                      <Card key={txn.id} className="p-6" data-testid={`card-txn-${txn.id}`}>
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          <div className="flex-1 space-y-4">
                            <div>
                              <div className="flex items-center flex-wrap gap-3 mb-2">
                                <h3 className="font-semibold text-lg font-mono">
                                  {txn.razorpayPaymentId || `TXN-${txn.id.slice(0, 8)}`}
                                </h3>
                                <Badge className={statusInfo.className}>
                                  <StatusIcon className="h-3 w-3 mr-1" />
                                  {statusInfo.label}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-3 text-sm">
                                <span className="text-muted-foreground">
                                  Package ID: <strong>{txn.packageId || "N/A"}</strong>
                                </span>
                                <span>•</span>
                                <span className="text-muted-foreground capitalize">
                                  {txn.paymentMethod || "Online"}
                                </span>
                                <span>•</span>
                                <span className="text-muted-foreground">
                                  {format(new Date(txn.createdAt), "MMM d, yyyy, h:mm a")}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-6 text-sm">
                              <div>
                                <span className="text-muted-foreground">Amount: </span>
                                <span className="font-medium">{formatCurrency(txn.amount)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">GST (18%): </span>
                                <span className="font-medium">{formatCurrency(gst)}</span>
                              </div>
                              <div>
                                <span className="text-muted-foreground">Total: </span>
                                <span className="font-medium text-primary">{formatCurrency(total)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2">
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              data-testid={`button-view-${txn.id}`}
                            >
                              <Eye className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">View</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              data-testid={`button-download-${txn.id}`}
                            >
                              <Download className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Invoice</span>
                            </Button>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
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
