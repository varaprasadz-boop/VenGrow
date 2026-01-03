import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, X } from "lucide-react";
import { format } from "date-fns";

interface Invoice {
  id: string;
  invoiceNumber: string;
  sellerId?: string;
  seller?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
  };
  packageId?: string;
  package?: {
    name?: string;
  };
  amount: number;
  status: string;
  paymentMethod?: string;
  transactionId?: string | null;
  createdAt: string;
}

interface InvoiceSettings {
  companyName?: string;
  companyAddress?: string;
  companyState?: string;
  companyPin?: string;
  gstin?: string;
  pan?: string;
  logo?: string | null;
  footerText?: string;
  bankDetails?: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolder?: string;
    branch?: string;
  };
  sacCode?: string;
  termsAndConditions?: string;
}

interface InvoicePreviewProps {
  invoice: Invoice | null;
  settings: InvoiceSettings | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function formatPrice(amount: number | undefined | null): string {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return "₹0";
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function downloadInvoiceAsPDF(invoice: Invoice, settings: InvoiceSettings | null) {
  const logoUrl = (settings as any)?.logo || "/vengrow-logo.png";
  
  // Calculate GST (assuming 18% GST)
  const gstRate = 0.18;
  const amountWithoutGST = invoice.amount / (1 + gstRate);
  const gstAmount = invoice.amount - amountWithoutGST;

  const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoice.invoiceNumber}</title>
  <style>
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
      color: #333;
      line-height: 1.6;
      padding: 40px;
      background: #fff;
    }
    .invoice-container {
      max-width: 800px;
      margin: 0 auto;
      background: #fff;
      border: 1px solid #e5e7eb;
      padding: 40px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 40px;
      padding-bottom: 20px;
      border-bottom: 2px solid #e5e7eb;
    }
    .logo-section {
      flex: 1;
    }
    .logo-section img {
      max-width: 200px;
      height: auto;
      margin-bottom: 10px;
    }
    .invoice-info {
      text-align: right;
    }
    .invoice-title {
      font-size: 32px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 10px;
    }
    .invoice-number {
      font-size: 18px;
      color: #6b7280;
      font-weight: 600;
    }
    .company-details {
      margin-bottom: 30px;
    }
    .company-name {
      font-size: 20px;
      font-weight: bold;
      color: #1f2937;
      margin-bottom: 8px;
    }
    .company-address {
      color: #6b7280;
      font-size: 14px;
      line-height: 1.8;
    }
    .bill-to {
      margin-bottom: 30px;
    }
    .section-title {
      font-size: 14px;
      font-weight: 600;
      color: #9ca3af;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      margin-bottom: 10px;
    }
    .bill-to-content {
      color: #1f2937;
      font-size: 15px;
      line-height: 1.8;
    }
    .invoice-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 30px;
      border: 1px solid #e5e7eb;
    }
    .invoice-table th {
      background: #f9fafb;
      padding: 12px;
      text-align: left;
      font-weight: 600;
      color: #374151;
      border: 1px solid #e5e7eb;
      font-size: 14px;
    }
    .invoice-table th.text-center {
      text-align: center;
    }
    .invoice-table th.text-right {
      text-align: right;
    }
    .invoice-table td {
      padding: 12px;
      border: 1px solid #e5e7eb;
      color: #1f2937;
    }
    .invoice-table tr:last-child td {
      border-bottom: 1px solid #e5e7eb;
    }
    .text-center {
      text-align: center;
    }
    .text-right {
      text-align: right;
    }
    .text-bold {
      font-weight: 600;
    }
    .totals {
      margin-top: 20px;
      margin-left: auto;
      width: 300px;
    }
    .total-row {
      display: flex;
      justify-content: space-between;
      padding: 8px 0;
      font-size: 15px;
    }
    .total-row.grand-total {
      border-top: 2px solid #e5e7eb;
      margin-top: 10px;
      padding-top: 15px;
      font-size: 18px;
      font-weight: bold;
      color: #1f2937;
    }
    .footer {
      margin-top: 50px;
      padding-top: 30px;
      border-top: 1px solid #e5e7eb;
      font-size: 13px;
      color: #6b7280;
      line-height: 1.8;
    }
    .terms {
      margin-top: 20px;
      white-space: pre-line;
    }
    .bank-details {
      margin-top: 20px;
    }
    @media print {
      body {
        padding: 0;
      }
      .invoice-container {
        border: none;
        padding: 20px;
      }
    }
  </style>
</head>
<body>
  <div class="invoice-container">
    <div class="header">
      <div class="logo-section">
        ${logoUrl ? `<img src="${logoUrl}" alt="Company Logo" onerror="this.style.display='none'" />` : ''}
        <div class="company-details">
          <div class="company-name">${settings?.companyName || "VenGrow Real Estate Pvt. Ltd."}</div>
          <div class="company-address">
            ${settings?.companyAddress || ""}<br>
            ${settings?.companyState || "Karnataka"}${settings?.companyPin ? ` - ${settings.companyPin}` : ""}<br>
            ${settings?.gstin ? `GSTIN: ${settings.gstin}` : ""}<br>
            ${settings?.pan ? `PAN: ${settings.pan}` : ""}
          </div>
        </div>
      </div>
      <div class="invoice-info">
        <div class="invoice-title">INVOICE</div>
        <div class="invoice-number">${invoice.invoiceNumber}</div>
        <div style="margin-top: 20px; color: #6b7280; font-size: 14px;">
          Date: ${format(new Date(invoice.createdAt), "dd MMM yyyy")}<br>
          Status: <span style="color: ${invoice.status === "completed" ? "#10b981" : "#f59e0b"}">${invoice.status.toUpperCase()}</span>
        </div>
      </div>
    </div>

    <div class="bill-to">
      <div class="section-title">Bill To</div>
      <div class="bill-to-content">
        ${invoice.seller?.firstName || ""} ${invoice.seller?.lastName || ""}<br>
        ${invoice.seller?.email || ""}<br>
        ${invoice.seller?.phone || ""}
      </div>
    </div>

    <table class="invoice-table">
      <thead>
        <tr>
          <th>Description</th>
          <th class="text-center">SAC Code</th>
          <th class="text-right">Amount</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>
            <div class="text-bold">${invoice.package?.name || "Package Purchase"}</div>
            <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">
              Payment Method: ${invoice.paymentMethod || "Online"}
            </div>
          </td>
          <td class="text-center">${settings?.sacCode || "997221"}</td>
          <td class="text-right">${formatPrice(amountWithoutGST)}</td>
        </tr>
      </tbody>
    </table>

    <div class="totals">
      <div class="total-row">
        <span>Subtotal:</span>
        <span>${formatPrice(amountWithoutGST)}</span>
      </div>
      <div class="total-row">
        <span>GST (18%):</span>
        <span>${formatPrice(gstAmount)}</span>
      </div>
      <div class="total-row grand-total">
        <span>Total:</span>
        <span>${formatPrice(invoice.amount)}</span>
      </div>
    </div>

    ${settings?.bankDetails?.bankName ? `
    <div class="bank-details">
      <div class="section-title">Bank Details</div>
      <div style="color: #1f2937; font-size: 14px; line-height: 1.8;">
        Bank: ${settings.bankDetails.bankName}<br>
        Account Number: ${settings.bankDetails.accountNumber}<br>
        IFSC: ${settings.bankDetails.ifscCode}<br>
        Account Holder: ${settings.bankDetails.accountHolder}<br>
        Branch: ${settings.bankDetails.branch}
      </div>
    </div>
    ` : ""}

    <div class="footer">
      ${settings?.footerText ? `<div>${settings.footerText}</div>` : ""}
      ${settings?.termsAndConditions ? `
      <div class="terms">
        <div class="section-title">Terms & Conditions</div>
        ${settings.termsAndConditions}
      </div>
      ` : ""}
      <div style="margin-top: 30px; text-align: center; color: #9ca3af;">
        Thank you for your business!
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // Create blob and download
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

export default function InvoicePreview({ invoice, settings, open, onOpenChange }: InvoicePreviewProps) {
  if (!invoice) return null;

  const logoUrl = (settings as any)?.logo || "/vengrow-logo.png";
  const gstRate = 0.18;
  const amountWithoutGST = invoice.amount / (1 + gstRate);
  const gstAmount = invoice.amount - amountWithoutGST;

  const handleDownload = () => {
    downloadInvoiceAsPDF(invoice, settings);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Invoice Preview</DialogTitle>
        </DialogHeader>
        <div className="space-y-6">
          {/* Invoice Header */}
          <div className="flex justify-between items-start border-b pb-6">
            <div className="flex-1">
              {logoUrl && (
                <img 
                  src={logoUrl} 
                  alt="Company Logo" 
                  className="h-16 mb-4 object-contain"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              )}
              <div>
                <h3 className="text-xl font-bold text-gray-900">
                  {settings?.companyName || "VenGrow Real Estate Pvt. Ltd."}
                </h3>
                <div className="text-sm text-gray-600 mt-2 space-y-1">
                  {settings?.companyAddress && <div>{settings.companyAddress}</div>}
                  <div>
                    {settings?.companyState || "Karnataka"}
                    {settings?.companyPin && ` - ${settings.companyPin}`}
                  </div>
                  {settings?.gstin && <div>GSTIN: {settings.gstin}</div>}
                  {settings?.pan && <div>PAN: {settings.pan}</div>}
                </div>
              </div>
            </div>
            <div className="text-right">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">INVOICE</h1>
              <div className="text-lg font-semibold text-gray-700">{invoice.invoiceNumber}</div>
              <div className="text-sm text-gray-600 mt-4 space-y-1">
                <div>Date: {format(new Date(invoice.createdAt), "dd MMM yyyy")}</div>
                <div>
                  Status:{" "}
                  <span className={`font-semibold ${
                    invoice.status === "completed" ? "text-green-600" : "text-yellow-600"
                  }`}>
                    {invoice.status.toUpperCase()}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bill To */}
          <div>
            <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
              Bill To
            </div>
            <div className="text-gray-900">
              {invoice.seller?.firstName || ""} {invoice.seller?.lastName || ""}
              {invoice.seller?.email && (
                <>
                  <br />
                  {invoice.seller.email}
                </>
              )}
              {invoice.seller?.phone && (
                <>
                  <br />
                  {invoice.seller.phone}
                </>
              )}
            </div>
          </div>

          {/* Invoice Table */}
          <div className="border rounded-lg overflow-hidden">
            <table className="w-full border-collapse border border-gray-300">
              <thead className="bg-gray-50">
                <tr>
                  <th className="border border-gray-300 px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase">
                    Description
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-center text-xs font-semibold text-gray-700 uppercase">
                    SAC Code
                  </th>
                  <th className="border border-gray-300 px-4 py-3 text-right text-xs font-semibold text-gray-700 uppercase">
                    Amount
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 px-4 py-4">
                    <div className="font-semibold text-gray-900">
                      {invoice.package?.name || "Package Purchase"}
                    </div>
                    <div className="text-sm text-gray-500 mt-1">
                      Payment Method: {invoice.paymentMethod || "Online"}
                    </div>
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-center text-gray-700">
                    {settings?.sacCode || "997221"}
                  </td>
                  <td className="border border-gray-300 px-4 py-4 text-right font-semibold text-gray-900">
                    {formatPrice(amountWithoutGST)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-80 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span>{formatPrice(amountWithoutGST)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>GST (18%):</span>
                <span>{formatPrice(gstAmount)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span>{formatPrice(invoice.amount)}</span>
              </div>
            </div>
          </div>

          {/* Bank Details */}
          {settings?.bankDetails?.bankName && (
            <div className="border-t pt-4">
              <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                Bank Details
              </div>
              <div className="text-sm text-gray-700 space-y-1">
                <div>Bank: {settings.bankDetails.bankName}</div>
                <div>Account Number: {settings.bankDetails.accountNumber}</div>
                <div>IFSC: {settings.bankDetails.ifscCode}</div>
                <div>Account Holder: {settings.bankDetails.accountHolder}</div>
                <div>Branch: {settings.bankDetails.branch}</div>
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="border-t pt-4 text-sm text-gray-600">
            {settings?.footerText && (
              <div className="mb-4">{settings.footerText}</div>
            )}
            {settings?.termsAndConditions && (
              <div>
                <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
                  Terms & Conditions
                </div>
                <div className="whitespace-pre-line">{settings.termsAndConditions}</div>
              </div>
            )}
            <div className="text-center mt-6 text-gray-500">
              Thank you for your business!
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-2 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Download Invoice
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
