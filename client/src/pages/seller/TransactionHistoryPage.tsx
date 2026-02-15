import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Download, Search, CreditCard, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { format } from "date-fns";
import type { Payment, Package } from "@shared/schema";
import { downloadInvoiceAsPDF } from "@/components/InvoicePreview";
import { exportToCSV } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

function formatCurrency(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function TransactionHistoryPage() {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState("all");

  const { data: payments = [], isLoading, isError, refetch } = useQuery<Payment[]>({
    queryKey: ["/api/me/payments"],
    queryFn: async () => {
      const response = await fetch("/api/me/payments", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch payments");
      return response.json();
    },
  });

  // Fetch invoice settings for PDF generation
  const { data: invoiceSettings = null } = useQuery<any>({
    queryKey: ["/api/admin/invoice-settings"],
    queryFn: async () => {
      const response = await fetch("/api/admin/invoice-settings", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch invoice settings");
      return response.json();
    },
  });

  // Fetch packages to get package names
  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
    queryFn: async () => {
      const response = await fetch("/api/packages", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch packages");
      return response.json();
    },
  });

  // Create a map of packageId to package name
  const packageMap = new Map<string, string>();
  packages.forEach(pkg => {
    packageMap.set(pkg.id, pkg.name);
  });

  // Handler for downloading invoice
  const handleDownloadInvoice = (payment: Payment) => {
    // Calculate GST-inclusive amount (downloadInvoiceAsPDF expects the total with GST included)
    // The payment.amount is the base amount, and the invoice generator back-calculates GST from this
    const gstInclusiveAmount = Math.round(payment.amount * 1.18);
    
    // Create an invoice-like object from the payment
    const invoiceData = {
      id: payment.id,
      invoiceNumber: payment.razorpayPaymentId || `INV-${payment.id.slice(0, 8).toUpperCase()}`,
      amount: gstInclusiveAmount,
      status: payment.status,
      paymentMethod: payment.paymentMethod || "online",
      transactionId: payment.razorpayPaymentId || null,
      createdAt: payment.createdAt instanceof Date ? payment.createdAt.toISOString() : String(payment.createdAt),
      packageId: payment.packageId || undefined,
      package: payment.packageId ? { name: packageMap.get(payment.packageId) || "Package" } : undefined,
    };
    
    downloadInvoiceAsPDF(invoiceData, invoiceSettings);
  };

  const handleExport = () => {
    const exportData = filteredTransactions.map((txn) => ({
      transactionId: txn.razorpayPaymentId || `TXN-${txn.id.slice(0, 8)}`,
      orderId: txn.razorpayOrderId || "",
      amount: txn.amount,
      estimatedGst: Math.round(txn.amount * 0.18),
      estimatedTotal: txn.amount + Math.round(txn.amount * 0.18),
      status: txn.status,
      paymentMethod: txn.paymentMethod || "Online",
      packageName: txn.packageId ? packageMap.get(txn.packageId) || "" : "",
      createdAt: format(new Date(txn.createdAt), "yyyy-MM-dd HH:mm:ss"),
    }));

    exportToCSV(
      exportData,
      `transactions_export_${format(new Date(), "yyyy-MM-dd")}`,
      [
        { key: "transactionId", header: "Transaction ID" },
        { key: "orderId", header: "Order ID" },
        { key: "amount", header: "Base Amount" },
        { key: "estimatedGst", header: "Est. GST (18%)" },
        { key: "estimatedTotal", header: "Est. Total" },
        { key: "status", header: "Status" },
        { key: "paymentMethod", header: "Payment Method" },
        { key: "packageName", header: "Package" },
        { key: "createdAt", header: "Date" },
      ]
    );
    toast({ title: "Export completed" });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Completed
          </Badge>
        );
      case "refunded":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            Refunded
          </Badge>
        );
      case "failed":
        return <Badge variant="destructive">Failed</Badge>;
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  const filterTransactions = () => {
    let filtered = payments;
    if (filter !== "all") {
      filtered = filtered.filter((t) => t.status === filter);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.razorpayPaymentId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.razorpayOrderId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          (t.description || "").toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredTransactions = filterTransactions();

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 w-full" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Transactions</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Transaction History
              </h1>
              <p className="text-muted-foreground">
                View all your payment transactions
              </p>
            </div>
            <Button data-testid="button-export" onClick={handleExport}>
              <Download className="h-4 w-4 mr-2" />
              Export
            </Button>
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or description..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-filter">
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Transactions</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Transactions List */}
          <div className="space-y-4">
            {filteredTransactions.map((transaction) => {
              const gst = Math.round(transaction.amount * 0.18);
              const total = transaction.amount + gst;
              return (
                <Card key={transaction.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold font-mono">
                              {transaction.razorpayPaymentId || `TXN-${transaction.id.slice(0, 8)}`}
                            </h3>
                            {getStatusBadge(transaction.status)}
                          </div>
                          <p className="text-sm text-muted-foreground mb-2">
                            {transaction.description || "Package Subscription"}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              <span>{format(new Date(transaction.createdAt), "MMM d, yyyy")}</span>
                            </div>
                            {transaction.paymentMethod && (
                              <div className="flex items-center gap-1">
                                <CreditCard className="h-4 w-4" />
                                <span className="capitalize">{transaction.paymentMethod}</span>
                              </div>
                            )}
                            {transaction.packageId && (
                              <div className="text-xs">
                                Package ID: {transaction.packageId.slice(0, 8)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 text-sm mb-4">
                        <div>
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-medium">{formatCurrency(transaction.amount)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">GST (18%)</p>
                          <p className="font-medium">{formatCurrency(gst)}</p>
                        </div>
                        <div>
                          <p className="text-muted-foreground">Total</p>
                          <p className="font-semibold text-lg">
                            {formatCurrency(total)}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDownloadInvoice(transaction)}
                        data-testid={`button-download-${transaction.id}`}
                      >
                        <Download className="h-4 w-4 mr-2" />
                        Invoice
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-16">
              <CreditCard className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">
                No transactions found
              </h3>
              <p className="text-muted-foreground">
                {searchQuery
                  ? "Try a different search term"
                  : "No transactions to display"}
              </p>
            </div>
          )}
        </div>
      </main>
  );
}
