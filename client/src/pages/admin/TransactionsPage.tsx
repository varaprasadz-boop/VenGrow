import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Search,
  Download,
  Eye,
  RefreshCw,
  CheckCircle,
  XCircle,
  Clock,
} from "lucide-react";

export default function TransactionsPage() {
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  const transactions = [
    {
      id: "TXN-001",
      seller: "Prestige Estates",
      package: "Premium",
      amount: 2999,
      gst: 539,
      total: 3538,
      paymentMethod: "UPI",
      date: "Nov 24, 2025, 10:30 AM",
      status: "completed",
    },
    {
      id: "TXN-002",
      seller: "DLF Properties",
      package: "Featured",
      amount: 9999,
      gst: 1799,
      total: 11798,
      paymentMethod: "Credit Card",
      date: "Nov 24, 2025, 09:15 AM",
      status: "completed",
    },
    {
      id: "TXN-003",
      seller: "Real Estate Pro",
      package: "Basic",
      amount: 999,
      gst: 179,
      total: 1178,
      paymentMethod: "Debit Card",
      date: "Nov 23, 2025, 05:45 PM",
      status: "refunded",
    },
    {
      id: "TXN-004",
      seller: "John Smith",
      package: "Premium",
      amount: 2999,
      gst: 539,
      total: 3538,
      paymentMethod: "Net Banking",
      date: "Nov 23, 2025, 02:30 PM",
      status: "pending",
    },
    {
      id: "TXN-005",
      seller: "Elite Properties",
      package: "Premium",
      amount: 2999,
      gst: 539,
      total: 3538,
      paymentMethod: "UPI",
      date: "Nov 22, 2025, 11:20 AM",
      status: "failed",
    },
  ];

  const filterTransactions = () => {
    let filtered = transactions;
    if (selectedTab !== "all") {
      filtered = filtered.filter((t) => t.status === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (t) =>
          t.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
          t.seller.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredTransactions = filterTransactions();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string; icon: any }> = {
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
    return variants[status] || variants.completed;
  };

  const totalRevenue = transactions
    .filter((t) => t.status === "completed")
    .reduce((sum, t) => sum + t.total, 0);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
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

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Total Revenue</p>
              <p className="text-3xl font-bold font-serif text-primary">
                ₹{totalRevenue.toLocaleString("en-IN")}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Completed</p>
              <p className="text-3xl font-bold font-serif">
                {transactions.filter((t) => t.status === "completed").length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Pending</p>
              <p className="text-3xl font-bold font-serif">
                {transactions.filter((t) => t.status === "pending").length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-1">Failed</p>
              <p className="text-3xl font-bold font-serif">
                {transactions.filter((t) => t.status === "failed").length}
              </p>
            </Card>
          </div>

          {/* Search */}
          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by transaction ID or seller..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Tabs */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({transactions.length})
              </TabsTrigger>
              <TabsTrigger value="completed" data-testid="tab-completed">
                Completed ({transactions.filter((t) => t.status === "completed").length})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({transactions.filter((t) => t.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="failed" data-testid="tab-failed">
                Failed ({transactions.filter((t) => t.status === "failed").length})
              </TabsTrigger>
              <TabsTrigger value="refunded" data-testid="tab-refunded">
                Refunded ({transactions.filter((t) => t.status === "refunded").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filteredTransactions.map((txn) => {
                  const statusInfo = getStatusBadge(txn.status);
                  const StatusIcon = statusInfo.icon;
                  return (
                    <Card key={txn.id} className="p-6">
                      <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                        <div className="flex-1 space-y-4">
                          <div>
                            <div className="flex items-center flex-wrap gap-3 mb-2">
                              <h3 className="font-semibold text-lg font-mono">
                                {txn.id}
                              </h3>
                              <Badge className={statusInfo.className}>
                                <StatusIcon className="h-3 w-3 mr-1" />
                                {statusInfo.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {txn.seller}
                            </p>
                            <div className="flex flex-wrap items-center gap-3 text-sm">
                              <span className="text-muted-foreground">
                                Package: <strong>{txn.package}</strong>
                              </span>
                              <span>•</span>
                              <span className="text-muted-foreground">
                                {txn.paymentMethod}
                              </span>
                              <span>•</span>
                              <span className="text-muted-foreground">{txn.date}</span>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-6 text-sm">
                            <div>
                              <span className="text-muted-foreground">Amount: </span>
                              <span className="font-medium">₹{txn.amount}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">GST: </span>
                              <span className="font-medium">₹{txn.gst}</span>
                            </div>
                            <div>
                              <span className="text-muted-foreground">Total: </span>
                              <span className="font-medium text-primary">₹{txn.total}</span>
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

              {filteredTransactions.length === 0 && (
                <div className="text-center py-16">
                  <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No transactions found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : `No ${selectedTab} transactions`}
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
