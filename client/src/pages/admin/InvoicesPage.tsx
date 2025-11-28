import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Receipt,
  Search,
  Download,
  Eye,
  FileText,
  IndianRupee,
  Calendar,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Settings,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";

interface Invoice {
  id: string;
  invoiceNumber: string;
  sellerId: string;
  userId: string;
  subtotal: number;
  gstRate: string;
  gstAmount: number;
  totalAmount: number;
  sellerDetails: {
    name: string;
    email?: string;
    phone?: string;
    gstin?: string;
  };
  packageDetails: {
    name: string;
    duration: number;
  };
  pdfUrl: string | null;
  invoiceDate: string;
  paidAt: string | null;
  createdAt: string;
}

function formatPrice(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const { data: invoices = [], isLoading, isError, refetch } = useQuery<Invoice[]>({
    queryKey: ["/api/admin/invoices"],
  });

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.sellerDetails?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.sellerDetails?.email?.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "paid" && invoice.paidAt) ||
      (statusFilter === "pending" && !invoice.paidAt);

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(inv => inv.paidAt)
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  const pendingAmount = invoices
    .filter(inv => !inv.paidAt)
    .reduce((sum, inv) => sum + inv.totalAmount, 0);

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
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
        <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Invoices</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the invoice data.
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

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Invoice Management
              </h1>
              <p className="text-muted-foreground">
                View and manage all platform invoices
              </p>
            </div>
            <div className="flex gap-2">
              <Link href="/admin/invoice-settings">
                <Button variant="outline" data-testid="button-settings">
                  <Settings className="h-4 w-4 mr-2" />
                  Invoice Settings
                </Button>
              </Link>
              <Button variant="outline" data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export All
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Receipt className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{invoices.length}</p>
                  <p className="text-sm text-muted-foreground">Total Invoices</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <IndianRupee className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(totalRevenue)}</p>
                  <p className="text-sm text-muted-foreground">Total Revenue</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{formatPrice(pendingAmount)}</p>
                  <p className="text-sm text-muted-foreground">Pending Amount</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <CheckCircle className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{invoices.filter(i => i.paidAt).length}</p>
                  <p className="text-sm text-muted-foreground">Paid Invoices</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by invoice number, seller name, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Invoices</SelectItem>
                  <SelectItem value="paid">Paid</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Seller</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No invoices found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => (
                      <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                        <TableCell>
                          <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-medium">{invoice.sellerDetails?.name || "Unknown"}</p>
                            <p className="text-sm text-muted-foreground">{invoice.sellerDetails?.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{invoice.packageDetails?.name}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold">{formatPrice(invoice.totalAmount)}</p>
                            <p className="text-xs text-muted-foreground">
                              incl. GST {invoice.gstRate}%
                            </p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(invoice.invoiceDate), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.paidAt ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />
                              Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                              <Clock className="h-3 w-3 mr-1" />
                              Pending
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button variant="ghost" size="sm" data-testid={`button-view-${invoice.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invoice.pdfUrl && (
                              <Button variant="ghost" size="sm" data-testid={`button-download-${invoice.id}`}>
                                <Download className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
