import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import InvoicePreview, { downloadInvoiceAsPDF } from "@/components/InvoicePreview";
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
import type { Package, SellerProfile, User } from "@shared/schema";

interface Invoice {
  id: string;
  invoiceNumber: string;
  sellerId: string;
  packageId: string;
  amount: number;
  status: string;
  paymentMethod: string;
  transactionId: string | null;
  createdAt: string;
}

function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0";
  }
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
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: invoices = [], isLoading, isError, refetch } = useQuery<Invoice[]>({
    queryKey: ["/api/admin/invoices"],
  });

  // Fetch all sellers to map sellerId to seller name
  const { data: sellers = [] } = useQuery<SellerProfile[]>({
    queryKey: ["/api/sellers"],
  });

  // Fetch all users to get seller emails
  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  // Fetch all packages to map packageId to package name
  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  // Fetch invoice settings
  const { data: invoiceSettings = null } = useQuery<any>({
    queryKey: ["/api/admin/invoice-settings"],
  });

  // Create maps for seller, user, and package lookups
  const sellerMap = useMemo(() => {
    const map = new Map<string, SellerProfile>();
    sellers.forEach(seller => {
      map.set(seller.id, seller);
    });
    return map;
  }, [sellers]);

  const userMap = useMemo(() => {
    const map = new Map<string, User>();
    users.forEach(user => {
      map.set(user.id, user);
    });
    return map;
  }, [users]);

  const packageMap = useMemo(() => {
    const map = new Map<string, string>();
    packages.forEach(pkg => {
      map.set(pkg.id, pkg.name);
    });
    return map;
  }, [packages]);

  const filteredInvoices = invoices.filter(invoice => {
    const seller = sellerMap.get(invoice.sellerId);
    const sellerName = seller?.companyName || "Unknown";
    const sellerUser = seller ? userMap.get(seller.userId) : null;
    const sellerEmail = sellerUser?.email || "";
    
    const matchesSearch = 
      (invoice.invoiceNumber || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      sellerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sellerEmail.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "paid" && invoice.status === "completed") ||
      (statusFilter === "pending" && invoice.status !== "completed");

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(inv => inv.status === "completed" && inv.amount != null)
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  const pendingAmount = invoices
    .filter(inv => inv.status !== "completed" && inv.amount != null)
    .reduce((sum, inv) => sum + (inv.amount || 0), 0);

  if (isLoading) {
    return (
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
    );
  }

  if (isError) {
    return (
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
    );
  }

  return (
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
                  <p className="text-2xl font-bold">{invoices.filter(i => i.status === "completed").length}</p>
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

            <div className="border rounded-lg overflow-x-auto">
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
                      <TableCell colSpan={7} className="text-center py-16">
                        <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-xl mb-2">No Invoices Found</h3>
                        <p className="text-muted-foreground">
                          {searchQuery || statusFilter !== "all"
                            ? "Try adjusting your search or filter criteria"
                            : "No invoices have been created yet."}
                        </p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredInvoices.map((invoice) => {
                      const seller = sellerMap.get(invoice.sellerId);
                      const sellerName = seller?.companyName || "Unknown Seller";
                      const sellerUser = seller ? userMap.get(seller.userId) : null;
                      const sellerEmail = sellerUser?.email || "";
                      
                      return (
                        <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                          <TableCell>
                            <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
                          </TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">{sellerName}</p>
                              <p className="text-sm text-muted-foreground">{sellerEmail || invoice.sellerId}</p>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{packageMap.get(invoice.packageId) || "Unknown Package"}</Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div>
                              <p className="font-semibold">{formatPrice(invoice.amount ?? 0)}</p>
                              <p className="text-xs text-muted-foreground">
                                Payment: {invoice.paymentMethod || "N/A"}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell className="text-center">
                            {invoice.createdAt ? format(new Date(invoice.createdAt), "MMM d, yyyy") : "N/A"}
                          </TableCell>
                          <TableCell className="text-center">
                            {invoice.status === "completed" ? (
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
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                data-testid={`button-view-${invoice.id}`}
                                onClick={() => {
                                  // Fetch full invoice details with seller info
                                  const fullInvoice = {
                                    ...invoice,
                                    seller: sellerUser ? {
                                      firstName: sellerUser.firstName || undefined,
                                      lastName: sellerUser.lastName || undefined,
                                      email: sellerUser.email || undefined,
                                      phone: sellerUser.phone || undefined,
                                    } : undefined,
                                    package: packages.find(p => p.id === invoice.packageId) || undefined,
                                  };
                                  setPreviewInvoice(fullInvoice);
                                  setIsPreviewOpen(true);
                                }}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {invoice.status === "completed" && (
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  data-testid={`button-download-${invoice.id}`}
                                  onClick={() => {
                                    const fullInvoice = {
                                      ...invoice,
                                      seller: sellerUser ? {
                                        firstName: sellerUser.firstName || undefined,
                                        lastName: sellerUser.lastName || undefined,
                                        email: sellerUser.email || undefined,
                                        phone: sellerUser.phone || undefined,
                                      } : undefined,
                                      package: packages.find(p => p.id === invoice.packageId) || undefined,
                                    };
                                    downloadInvoiceAsPDF(fullInvoice, invoiceSettings);
                                  }}
                                >
                                  <Download className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>

        <InvoicePreview
          invoice={previewInvoice}
          settings={invoiceSettings}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
      </main>
    );
}
