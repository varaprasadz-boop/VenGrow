import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Receipt,
  Download,
  Eye,
  IndianRupee,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import type { Package } from "@shared/schema";

interface Invoice {
  id: string;
  invoiceNumber: string;
  sellerId?: string;
  packageId?: string;
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
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function SellerInvoicesPage() {
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: invoices = [], isLoading, isError, refetch } = useQuery<Invoice[]>({
    queryKey: ["/api/seller/invoices"],
  });

  // Fetch current user info
  const { data: currentUser } = useQuery<any>({
    queryKey: ["/api/auth/me"],
  });

  // Fetch all packages to map packageId to package name
  const { data: packages = [] } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  // Fetch invoice settings
  const { data: invoiceSettings = null } = useQuery<any>({
    queryKey: ["/api/admin/invoice-settings"],
  });

  // Create a map of packageId to package name
  const packageMap = useMemo(() => {
    const map = new Map<string, string>();
    packages.forEach(pkg => {
      map.set(pkg.id, pkg.name);
    });
    return map;
  }, [packages]);

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <Skeleton className="h-96 w-full" />
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
          <Button onClick={() => refetch()} data-testid="button-retry">
            <RefreshCw className="h-4 w-4 mr-2" />Retry
          </Button>
        </div>
      </main>
    );
  }

  const totalPaid = invoices
    .filter(i => i.status === "completed" && i.amount != null)
    .reduce((sum, i) => sum + (i.amount || 0), 0);

  return (
    <main className="flex-1 bg-muted/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-8">
          <div className="p-2 rounded-lg bg-primary/10">
            <Receipt className="h-6 w-6 text-primary" />
          </div>
          <div>
            <h1 className="font-serif font-bold text-3xl">My Invoices</h1>
            <p className="text-muted-foreground">View and download your invoices</p>
          </div>
        </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
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
                  <p className="text-2xl font-bold">{formatPrice(totalPaid)}</p>
                  <p className="text-sm text-muted-foreground">Total Paid</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            <div className="border rounded-lg overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Invoice #</TableHead>
                    <TableHead>Package</TableHead>
                    <TableHead className="text-right">Amount</TableHead>
                    <TableHead className="text-center">Date</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-16">
                        <Receipt className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                        <h3 className="font-semibold text-xl mb-2">No Invoices Yet</h3>
                        <p className="text-muted-foreground">You don't have any invoices at the moment.</p>
                      </TableCell>
                    </TableRow>
                  ) : (
                    invoices.map((invoice) => (
                      <TableRow key={invoice.id} data-testid={`row-invoice-${invoice.id}`}>
                        <TableCell>
                          <span className="font-mono font-medium">{invoice.invoiceNumber}</span>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline">{invoice.packageId ? (packageMap.get(invoice.packageId) || "Unknown Package") : "N/A"}</Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div>
                            <p className="font-semibold">{formatPrice(invoice.amount ?? 0)}</p>
                            <p className="text-xs text-muted-foreground">incl. GST</p>
                          </div>
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.createdAt ? format(new Date(invoice.createdAt), "MMM d, yyyy") : "N/A"}
                        </TableCell>
                        <TableCell className="text-center">
                          {invoice.status === "completed" ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                              <CheckCircle className="h-3 w-3 mr-1" />Paid
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                              <Clock className="h-3 w-3 mr-1" />Pending
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
                                const fullInvoice = {
                                  ...invoice,
                                  seller: currentUser ? {
                                    firstName: currentUser.firstName || undefined,
                                    lastName: currentUser.lastName || undefined,
                                    email: currentUser.email || undefined,
                                    phone: currentUser.phone || undefined,
                                  } : undefined,
                                  package: invoice.packageId ? (packages.find(p => p.id === invoice.packageId) || undefined) : undefined,
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
                                    seller: currentUser ? {
                                      firstName: currentUser.firstName || undefined,
                                      lastName: currentUser.lastName || undefined,
                                      email: currentUser.email || undefined,
                                      phone: currentUser.phone || undefined,
                                    } : undefined,
                                    package: invoice.packageId ? (packages.find(p => p.id === invoice.packageId) || undefined) : undefined,
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
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>

        <InvoicePreview
          invoice={previewInvoice}
          settings={invoiceSettings}
          open={isPreviewOpen}
          onOpenChange={setIsPreviewOpen}
        />
        </div>
      </main>
    );
}
