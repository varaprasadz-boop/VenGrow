import { useQuery, useMutation } from "@tanstack/react-query";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Receipt,
  Search,
  Download,
  Eye,
  IndianRupee,
  CheckCircle,
  Clock,
  RefreshCw,
  AlertCircle,
  Settings,
  Building2,
  CreditCard,
  FileText,
  X,
  Printer,
} from "lucide-react";
import { format } from "date-fns";
import type { Package, SellerProfile, User } from "@shared/schema";
import { exportToCSV, formatIndianPrice } from "@/lib/utils";

interface Invoice {
  id: string;
  invoiceNumber: string;
  sellerId: string;
  userId: string | null;
  subscriptionId: string | null;
  paymentId: string | null;
  packageId: string;
  subtotal: number;
  gstRate: number;
  gstAmount: number;
  totalAmount: number;
  companyDetails: {
    name?: string;
    address?: string;
    gstin?: string;
    pan?: string;
    state?: string;
    pinCode?: string;
  } | null;
  sellerDetails: {
    name?: string;
    email?: string;
    phone?: string;
    address?: string;
    gstin?: string;
  } | null;
  packageDetails: {
    name?: string;
    duration?: number;
    listingsAllowed?: number;
  } | null;
  pdfUrl: string | null;
  invoiceDate: string | null;
  dueDate: string | null;
  paidAt: string | null;
  createdAt: string;
  cgstAmount: number | null;
  sgstAmount: number | null;
  placeOfSupply: string | null;
  sacCode: string | null;
  paymentMode: string | null;
  status?: string;
  amount?: number;
  paymentMethod?: string;
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

function InvoicePreviewDialog({ 
  invoice, 
  open, 
  onOpenChange,
  sellerName,
  sellerEmail,
  packageName,
  invoiceSettings
}: { 
  invoice: Invoice | null; 
  open: boolean; 
  onOpenChange: (open: boolean) => void;
  sellerName: string;
  sellerEmail: string;
  packageName: string;
  invoiceSettings?: any;
}) {
  const logoUrl = invoiceSettings?.logo || invoice?.companyDetails?.logo || null;

  const handlePrint = () => {
    if (!invoice) return;
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      const subtotal = invoice.subtotal || invoice.amount || 0;
      const cgst = invoice.cgstAmount || (invoice.gstAmount ? invoice.gstAmount / 2 : 0);
      const sgst = invoice.sgstAmount || (invoice.gstAmount ? invoice.gstAmount / 2 : 0);
      const total = invoice.totalAmount || (subtotal + cgst + sgst);
      const status = invoice.paidAt || invoice.status === 'completed' ? 'Paid' : 'Pending';
      
      printWindow.document.write(`
        <html>
          <head>
            <title>Invoice ${invoice.invoiceNumber}</title>
            <style>
              body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
              .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
              .company { }
              .company img { max-width: 200px; height: auto; margin-bottom: 10px; display: block; }
              .company h1 { color: #0ea5e9; margin: 0; font-size: 28px; }
              .invoice-info { text-align: right; }
              .invoice-info h2 { margin: 0 0 10px 0; }
              .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
              .status-paid { background: #dcfce7; color: #166534; }
              .status-pending { background: #fef9c3; color: #854d0e; }
              .section { margin: 20px 0; }
              .grid { display: flex; justify-content: space-between; }
              .grid-item { flex: 1; }
              table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb; }
              th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
              th { background: #f9fafb; font-weight: 600; }
              th.text-center, td.text-center { text-align: center; }
              th.text-right, td.text-right { text-align: right; }
              .totals { width: 300px; margin-left: auto; }
              .totals .row { display: flex; justify-content: space-between; padding: 8px 0; }
              .totals .total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; margin-top: 8px; padding-top: 12px; }
              .terms { margin-top: 40px; font-size: 12px; color: #6b7280; }
            </style>
          </head>
          <body>
            <div class="header">
              <div class="company">
                ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" onerror="this.style.display='none'" />` : ''}
                <h1>${invoice.companyDetails?.companyName || 'VenGrow Real Estate'}</h1>
                ${invoice.companyDetails?.address ? `<p>${invoice.companyDetails.address}</p>` : ''}
                ${invoice.companyDetails?.state ? `<p>${invoice.companyDetails.state} - ${invoice.companyDetails.pinCode || ''}</p>` : ''}
                ${invoice.companyDetails?.gstin ? `<p>GSTIN: ${invoice.companyDetails.gstin}</p>` : ''}
              </div>
              <div class="invoice-info">
                <h2>TAX INVOICE</h2>
                <p style="font-family: monospace; font-size: 18px;">${invoice.invoiceNumber}</p>
                <span class="status ${status === 'Paid' ? 'status-paid' : 'status-pending'}">${status}</span>
              </div>
            </div>
            <div class="section grid">
              <div class="grid-item">
                <strong>Bill To:</strong>
                <p>${invoice.sellerDetails?.name || sellerName}</p>
                <p>${invoice.sellerDetails?.email || sellerEmail}</p>
                ${invoice.sellerDetails?.phone ? `<p>${invoice.sellerDetails.phone}</p>` : ''}
                ${invoice.sellerDetails?.gstin ? `<p>GSTIN: ${invoice.sellerDetails.gstin}</p>` : ''}
              </div>
              <div class="grid-item" style="text-align: right;">
                <p>Invoice Date: ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : new Date(invoice.createdAt).toLocaleDateString()}</p>
                ${invoice.placeOfSupply ? `<p>Place of Supply: ${invoice.placeOfSupply}</p>` : ''}
              </div>
            </div>
            <table>
              <thead>
                <tr>
                  <th>Description</th>
                  <th class="text-center">SAC Code</th>
                  <th class="text-right">Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>${invoice.packageDetails?.name || packageName} Package<br><small>Subscription for ${invoice.packageDetails?.duration || 30} days</small></td>
                  <td class="text-center">${invoice.sacCode || '997221'}</td>
                  <td class="text-right">₹${subtotal.toLocaleString('en-IN')}</td>
                </tr>
              </tbody>
            </table>
            <div class="totals">
              <div class="row"><span>Subtotal:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
              <div class="row"><span>CGST @ 9%:</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>
              <div class="row"><span>SGST @ 9%:</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>
              <div class="row total"><span>Total:</span><span>₹${total.toLocaleString('en-IN')}</span></div>
            </div>
            ${invoice.paymentMode ? `<p style="margin-top: 20px;">Payment Mode: ${invoice.paymentMode}</p>` : ''}
            <div class="terms">
              <p><strong>Terms & Conditions:</strong></p>
              <p>1. Payment once made is non-refundable.</p>
              <p>2. Invoice valid for accounting & GST purposes.</p>
              <p>3. Any disputes subject to Bangalore jurisdiction.</p>
            </div>
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleDownload = () => {
    if (!invoice) return;
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    } else {
      // Create downloadable HTML with logo
      const subtotal = invoice.subtotal || invoice.amount || 0;
      const cgst = invoice.cgstAmount || (invoice.gstAmount ? invoice.gstAmount / 2 : 0);
      const sgst = invoice.sgstAmount || (invoice.gstAmount ? invoice.gstAmount / 2 : 0);
      const total = invoice.totalAmount || (subtotal + cgst + sgst);
      const status = invoice.paidAt || invoice.status === 'completed' ? 'Paid' : 'Pending';
      const logoUrlToUse = logoUrl || invoice.companyDetails?.logo || null;
      
      const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .company { }
    .company img { max-width: 200px; height: auto; margin-bottom: 10px; display: block; }
    .company h1 { color: #0ea5e9; margin: 0; font-size: 28px; }
    .invoice-info { text-align: right; }
    .invoice-info h2 { margin: 0 0 10px 0; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
    .status-paid { background: #dcfce7; color: #166534; }
    .status-pending { background: #fef9c3; color: #854d0e; }
    .section { margin: 20px 0; }
    .grid { display: flex; justify-content: space-between; }
    .grid-item { flex: 1; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; border: 1px solid #e5e7eb; }
    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    th { background: #f9fafb; font-weight: 600; }
    th.text-center, td.text-center { text-align: center; }
    th.text-right, td.text-right { text-align: right; }
    .totals { width: 300px; margin-left: auto; }
    .totals .row { display: flex; justify-content: space-between; padding: 8px 0; }
    .totals .total { font-weight: bold; font-size: 18px; border-top: 2px solid #000; margin-top: 8px; padding-top: 12px; }
    .terms { margin-top: 40px; font-size: 12px; color: #6b7280; }
    @media print { body { padding: 0; } }
  </style>
</head>
<body>
  <div class="header">
    <div class="company">
      ${logoUrlToUse ? `<img src="${logoUrlToUse}" alt="Company Logo" onerror="this.style.display='none'" />` : ''}
      <h1>${invoice.companyDetails?.companyName || 'VenGrow Real Estate'}</h1>
      ${invoice.companyDetails?.address ? `<p>${invoice.companyDetails.address}</p>` : ''}
      ${invoice.companyDetails?.state ? `<p>${invoice.companyDetails.state} - ${invoice.companyDetails.pinCode || ''}</p>` : ''}
      ${invoice.companyDetails?.gstin ? `<p>GSTIN: ${invoice.companyDetails.gstin}</p>` : ''}
    </div>
    <div class="invoice-info">
      <h2>TAX INVOICE</h2>
      <p style="font-family: monospace; font-size: 18px;">${invoice.invoiceNumber}</p>
      <span class="status ${status === 'Paid' ? 'status-paid' : 'status-pending'}">${status}</span>
    </div>
  </div>
  <div class="section grid">
    <div class="grid-item">
      <strong>Bill To:</strong>
      <p>${invoice.sellerDetails?.name || sellerName}</p>
      <p>${invoice.sellerDetails?.email || sellerEmail}</p>
      ${invoice.sellerDetails?.phone ? `<p>${invoice.sellerDetails.phone}</p>` : ''}
      ${invoice.sellerDetails?.gstin ? `<p>GSTIN: ${invoice.sellerDetails.gstin}</p>` : ''}
    </div>
    <div class="grid-item" style="text-align: right;">
      <p>Invoice Date: ${invoice.invoiceDate ? new Date(invoice.invoiceDate).toLocaleDateString() : new Date(invoice.createdAt).toLocaleDateString()}</p>
      ${invoice.placeOfSupply ? `<p>Place of Supply: ${invoice.placeOfSupply}</p>` : ''}
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th class="text-center">SAC Code</th>
        <th class="text-right">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>${invoice.packageDetails?.name || packageName} Package<br><small>Subscription for ${invoice.packageDetails?.duration || 30} days</small></td>
        <td class="text-center">${invoice.sacCode || '997221'}</td>
        <td class="text-right">₹${subtotal.toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="row"><span>Subtotal:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div class="row"><span>CGST @ 9%:</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>
    <div class="row"><span>SGST @ 9%:</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>
    <div class="row total"><span>Total:</span><span>₹${total.toLocaleString('en-IN')}</span></div>
  </div>
  ${invoice.paymentMode ? `<p style="margin-top: 20px;">Payment Mode: ${invoice.paymentMode}</p>` : ''}
  <div class="terms">
    <p><strong>Terms & Conditions:</strong></p>
    <p>1. Payment once made is non-refundable.</p>
    <p>2. Invoice valid for accounting & GST purposes.</p>
    <p>3. Any disputes subject to Bangalore jurisdiction.</p>
  </div>
</body>
</html>
      `;
      
      const blob = new Blob([invoiceHTML], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `VenGrow-Invoice-${invoice.invoiceNumber}.html`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  if (!open) return null;

  const status = invoice ? (invoice.paidAt || invoice.status === 'completed' ? 'Paid' : 'Pending') : '';
  const subtotal = invoice ? (invoice.subtotal || invoice.amount || 0) : 0;
  const cgst = invoice ? (invoice.cgstAmount || (invoice.gstAmount ? invoice.gstAmount / 2 : 0)) : 0;
  const sgst = invoice ? (invoice.sgstAmount || (invoice.gstAmount ? invoice.gstAmount / 2 : 0)) : 0;
  const total = invoice ? (invoice.totalAmount || (subtotal + cgst + sgst)) : 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        {invoice ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between">
                <span>Invoice Preview</span>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={handlePrint} data-testid="button-print-invoice">
                    <Printer className="h-4 w-4 mr-1" />
                    Print
                  </Button>
                  <Button variant="outline" size="sm" onClick={handleDownload} data-testid="button-download-invoice">
                    <Download className="h-4 w-4 mr-1" />
                    Download
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-6 p-4 border rounded-lg bg-white dark:bg-card">
          <div className="flex justify-between items-start">
            <div>
              <img 
                src="/VenGrow.png" 
                alt="VenGrow Logo" 
                className="h-16 mb-4 object-contain"
              />
              {invoice.companyDetails?.address && (
                <p className="text-sm">{invoice.companyDetails.address}</p>
              )}
              {invoice.companyDetails?.state && invoice.companyDetails?.pinCode && (
                <p className="text-sm">{invoice.companyDetails.state} - {invoice.companyDetails.pinCode}</p>
              )}
              {invoice.companyDetails?.gstin && (
                <p className="text-sm">GSTIN: {invoice.companyDetails.gstin}</p>
              )}
            </div>
            <div className="text-right">
              <h3 className="text-xl font-bold">TAX INVOICE</h3>
              <p className="font-mono text-lg">{invoice.invoiceNumber}</p>
              <Badge variant={status === 'Paid' ? 'default' : 'secondary'} className={status === 'Paid' ? 'bg-green-100 text-green-800' : ''}>
                {status}
              </Badge>
            </div>
          </div>

          <Separator />

          <div className="grid grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-sm text-muted-foreground mb-2">Bill To:</h4>
              <p className="font-medium">{invoice.sellerDetails?.name || sellerName}</p>
              <p className="text-sm">{invoice.sellerDetails?.email || sellerEmail}</p>
              {invoice.sellerDetails?.phone && <p className="text-sm">{invoice.sellerDetails.phone}</p>}
              {invoice.sellerDetails?.address && <p className="text-sm">{invoice.sellerDetails.address}</p>}
              {invoice.sellerDetails?.gstin && <p className="text-sm">GSTIN: {invoice.sellerDetails.gstin}</p>}
            </div>
            <div className="text-right">
              <div className="space-y-1">
                <p className="text-sm"><span className="text-muted-foreground">Invoice Date:</span> {invoice.invoiceDate ? format(new Date(invoice.invoiceDate), 'MMM d, yyyy') : format(new Date(invoice.createdAt), 'MMM d, yyyy')}</p>
                {invoice.dueDate && <p className="text-sm"><span className="text-muted-foreground">Due Date:</span> {format(new Date(invoice.dueDate), 'MMM d, yyyy')}</p>}
                {invoice.paidAt && <p className="text-sm"><span className="text-muted-foreground">Paid On:</span> {format(new Date(invoice.paidAt), 'MMM d, yyyy')}</p>}
                {invoice.placeOfSupply && <p className="text-sm"><span className="text-muted-foreground">Place of Supply:</span> {invoice.placeOfSupply}</p>}
              </div>
            </div>
          </div>

          <div className="border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>Description</TableHead>
                  <TableHead className="text-center">SAC Code</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell>
                    <div>
                      <p className="font-medium">{invoice.packageDetails?.name || packageName} Package</p>
                      <p className="text-sm text-muted-foreground">
                        Subscription for {invoice.packageDetails?.duration || 30} days
                        {invoice.packageDetails?.listingsAllowed && ` - ${invoice.packageDetails.listingsAllowed} listings`}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-center font-mono">{invoice.sacCode || '997221'}</TableCell>
                  <TableCell className="text-right">{formatIndianPrice(subtotal)}</TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </div>

          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>{formatIndianPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>CGST @ 9%:</span>
                <span>{formatIndianPrice(cgst)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>SGST @ 9%:</span>
                <span>{formatIndianPrice(sgst)}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total:</span>
                <span>{formatIndianPrice(total)}</span>
              </div>
            </div>
          </div>

          {invoice.paymentMode && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <CreditCard className="h-4 w-4" />
              <span>Payment Mode: {invoice.paymentMode}</span>
            </div>
          )}

          <Separator />

          <div className="text-xs text-muted-foreground space-y-1">
            <p className="font-semibold">Terms & Conditions:</p>
            <p>1. Payment once made is non-refundable.</p>
            <p>2. Invoice valid for accounting & GST purposes.</p>
            <p>3. Any disputes subject to Bangalore jurisdiction.</p>
          </div>
        </div>
          </>
        ) : (
          <div className="flex items-center justify-center p-8">
            <p className="text-muted-foreground">Loading invoice...</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function InvoicesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const { data: invoices = [], isLoading, isError, refetch } = useQuery<Invoice[]>({
    queryKey: ["/api/admin/invoices"],
  });

  const { data: sellers = [] } = useQuery<SellerProfile[]>({
    queryKey: ["/api/sellers"],
  });

  const { data: users = [] } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

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

    const status = invoice.paidAt || invoice.status === "completed" ? "paid" : "pending";
    const matchesStatus = statusFilter === "all" || statusFilter === status;

    return matchesSearch && matchesStatus;
  });

  const totalRevenue = invoices
    .filter(inv => (inv.paidAt || inv.status === "completed") && (inv.totalAmount != null || inv.amount != null))
    .reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);

  const pendingAmount = invoices
    .filter(inv => !inv.paidAt && inv.status !== "completed" && (inv.totalAmount != null || inv.amount != null))
    .reduce((sum, inv) => sum + (inv.totalAmount || inv.amount || 0), 0);

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPreviewOpen(true);
  };

  const handleDownloadInvoice = (invoice: Invoice) => {
    if (invoice.pdfUrl) {
      window.open(invoice.pdfUrl, '_blank');
    } else {
      setSelectedInvoice(invoice);
      setPreviewOpen(true);
    }
  };

  const handleExportAll = () => {
    const exportData = filteredInvoices.map(invoice => {
      const seller = sellerMap.get(invoice.sellerId);
      const sellerUser = seller ? userMap.get(seller.userId) : null;
      return {
        invoiceNumber: invoice.invoiceNumber,
        sellerName: seller?.companyName || "Unknown",
        sellerEmail: sellerUser?.email || "",
        package: packageMap.get(invoice.packageId) || "Unknown",
        subtotal: invoice.subtotal || invoice.amount || 0,
        cgst: invoice.cgstAmount || 0,
        sgst: invoice.sgstAmount || 0,
        total: invoice.totalAmount || invoice.amount || 0,
        sacCode: invoice.sacCode || "997221",
        placeOfSupply: invoice.placeOfSupply || "",
        paymentMode: invoice.paymentMode || invoice.paymentMethod || "",
        status: invoice.paidAt || invoice.status === "completed" ? "Paid" : "Pending",
        invoiceDate: invoice.invoiceDate || invoice.createdAt,
        paidAt: invoice.paidAt || "",
      };
    });

    exportToCSV(exportData, `invoices_export_${format(new Date(), 'yyyy-MM-dd')}`, [
      { key: 'invoiceNumber', header: 'Invoice Number' },
      { key: 'sellerName', header: 'Seller Name' },
      { key: 'sellerEmail', header: 'Seller Email' },
      { key: 'package', header: 'Package' },
      { key: 'subtotal', header: 'Subtotal' },
      { key: 'cgst', header: 'CGST' },
      { key: 'sgst', header: 'SGST' },
      { key: 'total', header: 'Total Amount' },
      { key: 'sacCode', header: 'SAC Code' },
      { key: 'placeOfSupply', header: 'Place of Supply' },
      { key: 'paymentMode', header: 'Payment Mode' },
      { key: 'status', header: 'Status' },
      { key: 'invoiceDate', header: 'Invoice Date' },
      { key: 'paidAt', header: 'Paid At' },
    ]);
  };

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

  const getSellerInfo = (invoice: Invoice) => {
    const seller = sellerMap.get(invoice.sellerId);
    const sellerUser = seller ? userMap.get(seller.userId) : null;
    return {
      name: seller?.companyName || "Unknown Seller",
      email: sellerUser?.email || "",
    };
  };

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
            <Button variant="outline" onClick={handleExportAll} data-testid="button-export">
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
        </div>

        <Card className="p-6">
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
