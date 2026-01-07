import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
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
  Printer,
  ChevronDown,
} from "lucide-react";
import { format } from "date-fns";
import type { Payment, Package } from "@shared/schema";
import { exportToCSV } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { generateSubscriptionInvoicePDF } from "@/utils/invoicePDF";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function TransactionsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTxn, setSelectedTxn] = useState<Payment | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  const { data: payments = [], isLoading, isError, refetch } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    queryFn: async () => {
      const response = await fetch("/api/payments", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });

  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const response = await fetch("/api/packages", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
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

  const handleExport = () => {
    const exportData = filteredTransactions.map(txn => ({
      transactionId: txn.razorpayPaymentId || `TXN-${txn.id.slice(0, 8)}`,
      orderId: txn.razorpayOrderId || "",
      amount: txn.amount,
      estimatedGst: Math.round(txn.amount * 0.18),
      estimatedTotal: txn.amount + Math.round(txn.amount * 0.18),
      status: txn.status,
      paymentMethod: txn.paymentMethod || "Online",
      createdAt: format(new Date(txn.createdAt), "yyyy-MM-dd HH:mm:ss"),
    }));

    exportToCSV(exportData, `transactions_export_${format(new Date(), 'yyyy-MM-dd')}`, [
      { key: 'transactionId', header: 'Transaction ID' },
      { key: 'orderId', header: 'Order ID' },
      { key: 'amount', header: 'Base Amount' },
      { key: 'estimatedGst', header: 'Est. GST (18%)' },
      { key: 'estimatedTotal', header: 'Est. Total' },
      { key: 'status', header: 'Status' },
      { key: 'paymentMethod', header: 'Payment Method' },
      { key: 'createdAt', header: 'Date' },
    ]);
  };

  const handleView = (txn: Payment) => {
    setSelectedTxn(txn);
    setViewOpen(true);
  };

  const handleDownloadInvoice = async (txn: Payment) => {
    try {
      const packageInfo = txn.packageId 
        ? packages.find(p => p.id === txn.packageId)
        : null;

      const invoiceNumber = txn.razorpayOrderId || `INV-${txn.id.slice(0, 8).toUpperCase()}`;
      const invoiceDate = txn.createdAt ? format(new Date(txn.createdAt), "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy");
      
      // Calculate subscription dates (30 days default if no package info)
      const duration = packageInfo?.duration || 30;
      const startDate = txn.createdAt ? format(new Date(txn.createdAt), "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy");
      const endDate = txn.createdAt 
        ? format(new Date(new Date(txn.createdAt).getTime() + duration * 24 * 60 * 60 * 1000), "MMM dd, yyyy")
        : format(new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000), "MMM dd, yyyy");

      await generateSubscriptionInvoicePDF({
        invoiceNumber,
        invoiceDate,
        subscription: {
          packageName: packageInfo?.name || "Package",
          duration: duration,
          startDate,
          endDate,
        },
        payment: {
          amount: txn.amount || 0,
          status: txn.status,
          paymentMethod: txn.paymentMethod || undefined,
          razorpayPaymentId: txn.razorpayPaymentId || undefined,
        },
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      alert('Failed to generate invoice. Please try again.');
    }
  };

  const handlePrintInvoice = async (txn: Payment) => {
    try {
      const packageInfo = txn.packageId 
        ? packages.find(p => p.id === txn.packageId)
        : null;

      const invoiceNumber = txn.razorpayOrderId || `INV-${txn.id.slice(0, 8).toUpperCase()}`;
      const invoiceDate = txn.createdAt ? format(new Date(txn.createdAt), "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy");
      
      // Calculate subscription dates (30 days default if no package info)
      const duration = packageInfo?.duration || 30;
      const startDate = txn.createdAt ? format(new Date(txn.createdAt), "MMM dd, yyyy") : format(new Date(), "MMM dd, yyyy");
      const endDate = txn.createdAt 
        ? format(new Date(new Date(txn.createdAt).getTime() + duration * 24 * 60 * 60 * 1000), "MMM dd, yyyy")
        : format(new Date(new Date().getTime() + duration * 24 * 60 * 60 * 1000), "MMM dd, yyyy");

      // Generate PDF and open in new window for printing
      await generateSubscriptionInvoicePDF({
        invoiceNumber,
        invoiceDate,
        subscription: {
          packageName: packageInfo?.name || "Package",
          duration: duration,
          startDate,
          endDate,
        },
        payment: {
          amount: txn.amount || 0,
          status: txn.status,
          paymentMethod: txn.paymentMethod || undefined,
          razorpayPaymentId: txn.razorpayPaymentId || undefined,
        },
      }, true); // Pass true for print mode
    } catch (error) {
      console.error('Error generating PDF for print:', error);
      alert('Failed to generate invoice for printing. Please try again.');
    }
  };

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
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
    );
  }

  return (
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
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => refetch()} disabled={isLoading} data-testid="button-refresh">
                <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? "animate-spin" : ""}`} />
                Refresh
              </Button>
              <Button onClick={handleExport} data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export Report
              </Button>
            </div>
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
                              onClick={() => handleView(txn)}
                              data-testid={`button-view-${txn.id}`}
                            >
                              <Eye className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">View</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 lg:flex-none"
                                  data-testid={`button-invoice-${txn.id}`}
                                >
                                  <Download className="h-4 w-4 lg:mr-2" />
                                  <span className="hidden lg:inline">Invoice</span>
                                  <ChevronDown className="h-3 w-3 ml-1 hidden lg:inline" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem
                                  onClick={() => handleDownloadInvoice(txn)}
                                  data-testid={`button-download-${txn.id}`}
                                >
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </DropdownMenuItem>
                                <DropdownMenuItem
                                  onClick={() => handlePrintInvoice(txn)}
                                  data-testid={`button-print-${txn.id}`}
                                >
                                  <Printer className="h-4 w-4 mr-2" />
                                  Print
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
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

        <Dialog open={viewOpen} onOpenChange={setViewOpen}>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
            {selectedTxn && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-lg font-semibold">
                    {selectedTxn.razorpayPaymentId || `TXN-${selectedTxn.id.slice(0, 8)}`}
                  </span>
                  <Badge className={getStatusBadge(selectedTxn.status).className}>
                    {getStatusBadge(selectedTxn.status).label}
                  </Badge>
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Order ID</p>
                    <p className="font-mono">{selectedTxn.razorpayOrderId || "N/A"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Payment Method</p>
                    <p className="capitalize">{selectedTxn.paymentMethod || "Online"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Date</p>
                    <p>{format(new Date(selectedTxn.createdAt), "MMM d, yyyy, h:mm a")}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Package ID</p>
                    <p className="font-mono text-xs">{selectedTxn.packageId || "N/A"}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>{formatCurrency(selectedTxn.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">CGST @ 9%</span>
                    <span>{formatCurrency(Math.round(selectedTxn.amount * 0.09))}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">SGST @ 9%</span>
                    <span>{formatCurrency(Math.round(selectedTxn.amount * 0.09))}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span className="text-primary">{formatCurrency(selectedTxn.amount + Math.round(selectedTxn.amount * 0.18))}</span>
                  </div>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button variant="outline" className="flex-1" onClick={() => window.print()}>
                    Print
                  </Button>
                  <Button className="flex-1" onClick={() => setViewOpen(false)}>
                    Close
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </main>
    );
}
