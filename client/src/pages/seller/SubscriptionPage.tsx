import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Calendar,
  CreditCard,
  Download,
  RefreshCw,
  CheckCircle,
  AlertCircle,
  Package,
} from "lucide-react";
import { format, differenceInDays } from "date-fns";
import type { SellerSubscription, Package as PackageType, Property, Payment } from "@shared/schema";

interface SubscriptionWithPackage extends SellerSubscription {
  package?: PackageType;
}

export default function SubscriptionPage() {
  const { data: subscription, isLoading: subscriptionLoading } = useQuery<SubscriptionWithPackage>({
    queryKey: ["/api/subscriptions/current"],
  });

  const handleDownloadInvoice = (payment: Payment) => {
    const subtotal = payment.amount || 0;
    const gstAmount = Math.round(subtotal * 0.18);
    const cgst = Math.round(gstAmount / 2);
    const sgst = Math.round(gstAmount / 2);
    const total = subtotal + gstAmount;
    const status = payment.status === 'completed' ? 'Paid' : 'Pending';
    const invoiceNumber = payment.razorpayOrderId || `INV-${payment.id.slice(0, 8).toUpperCase()}`;
    
    const invoiceHTML = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Invoice ${invoiceNumber}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: Arial, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; background: #fff; }
    .header { display: flex; justify-content: space-between; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 2px solid #e5e7eb; }
    .company { }
    .company img { max-width: 200px; height: auto; margin-bottom: 10px; }
    .company h1 { color: #0ea5e9; margin: 0; font-size: 28px; }
    .invoice-info { text-align: right; }
    .invoice-info h2 { margin: 0 0 10px 0; }
    .status { display: inline-block; padding: 4px 12px; border-radius: 4px; font-size: 12px; }
    .status-paid { background: #dcfce7; color: #166534; }
    .status-pending { background: #fef9c3; color: #854d0e; }
    .section { margin: 20px 0; }
    .grid { display: flex; justify-content: space-between; }
    .grid-item { flex: 1; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #e5e7eb; padding: 12px; text-align: left; }
    th { background: #f9fafb; }
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
      <img src="/vengrow-logo.png" alt="VenGrow Logo" />
      <h1>VenGrow</h1>
    </div>
    <div class="invoice-info">
      <h2>TAX INVOICE</h2>
      <p style="font-family: monospace; font-size: 18px;">${invoiceNumber}</p>
      <span class="status ${status === 'Paid' ? 'status-paid' : 'status-pending'}">${status}</span>
    </div>
  </div>
  <div class="section grid">
    <div class="grid-item">
      <strong>Bill To:</strong>
      <p>Subscription Payment</p>
    </div>
    <div class="grid-item" style="text-align: right;">
      <p>Invoice Date: ${format(new Date(payment.createdAt), "MMM dd, yyyy")}</p>
    </div>
  </div>
  <table>
    <thead>
      <tr>
        <th>Description</th>
        <th>SAC Code</th>
        <th style="text-align: right;">Amount</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>Subscription Package Payment</td>
        <td>997221</td>
        <td style="text-align: right;">₹${subtotal.toLocaleString('en-IN')}</td>
      </tr>
    </tbody>
  </table>
  <div class="totals">
    <div class="row"><span>Subtotal:</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
    <div class="row"><span>CGST @ 9%:</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>
    <div class="row"><span>SGST @ 9%:</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>
    <div class="row total"><span>Total:</span><span>₹${total.toLocaleString('en-IN')}</span></div>
  </div>
  <div class="terms">
    <p><strong>Terms & Conditions:</strong></p>
    <p>1. Payment once made is non-refundable.</p>
    <p>2. Invoice valid for accounting & GST purposes.</p>
    <p>3. Any disputes subject to Bangalore jurisdiction.</p>
  </div>
</body>
</html>
    `;
    
    const blob = new Blob([invoiceHTML], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `invoice-${invoiceNumber}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const { data: properties = [], isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/properties"],
  });

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/me/payments"],
  });

  const isLoading = subscriptionLoading || propertiesLoading || paymentsLoading;

  const activeListings = properties.filter((p) => p.status === "active").length;
  const listingLimit = subscription?.package?.listingLimit || 5;
  const daysLeft = subscription?.endDate
    ? Math.max(0, differenceInDays(new Date(subscription.endDate), new Date()))
    : 0;
  const isActive = subscription?.isActive && daysLeft > 0;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Subscription Management
            </h1>
            <p className="text-muted-foreground">
              Manage your package and billing
            </p>
          </div>

          {isLoading ? (
            <div className="space-y-8">
              <Card className="p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="space-y-4">
                    <Skeleton className="h-8 w-48" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-64" />
                    <Skeleton className="h-4 w-56" />
                  </div>
                  <div className="space-y-3">
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                </div>
              </Card>
            </div>
          ) : !subscription ? (
            <Card className="p-8 text-center">
              <Package className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-serif font-bold text-2xl mb-2">No Active Subscription</h2>
              <p className="text-muted-foreground mb-6">
                Choose a package to start listing your properties
              </p>
              <Link href="/seller/packages">
                <Button size="lg" data-testid="button-choose-package">
                  Choose a Package
                </Button>
              </Link>
            </Card>
          ) : (
            <>
              <Card className="p-6 mb-8">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div>
                    <div className="flex items-center gap-3 mb-3">
                      <h2 className="font-serif font-bold text-2xl">
                        {subscription.package?.name || "Basic"} Plan
                      </h2>
                      {isActive ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Active
                        </Badge>
                      ) : (
                        <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Expired
                        </Badge>
                      )}
                    </div>
                    <p className="text-3xl font-bold text-primary mb-4">
                      ₹{formatPrice(subscription.package?.price || 0)}/{subscription.package?.duration || 30} days
                    </p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span>Started: {format(new Date(subscription.startDate), "MMM d, yyyy")}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <RefreshCw className="h-4 w-4" />
                        <span>
                          {isActive
                            ? `Expires: ${format(new Date(subscription.endDate), "MMM d, yyyy")} (${daysLeft} days left)`
                            : `Expired on ${format(new Date(subscription.endDate), "MMM d, yyyy")}`}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-3">
                    <Link href="/seller/packages">
                      <Button variant="outline" data-testid="button-change-plan">
                        {isActive ? "Change Plan" : "Renew Subscription"}
                      </Button>
                    </Link>
                  </div>
                </div>

                <div className="mt-6 pt-6 border-t">
                  <h3 className="font-semibold mb-4">Package Usage</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm">Property Listings</span>
                        <span className="text-sm font-medium">
                          {activeListings} / {listingLimit}
                        </span>
                      </div>
                      <div className="h-2 bg-muted rounded-full overflow-hidden">
                        <div
                          className={`h-full ${
                            activeListings >= listingLimit ? "bg-red-500" : "bg-primary"
                          }`}
                          style={{
                            width: `${Math.min(100, (activeListings / listingLimit) * 100)}%`,
                          }}
                        />
                      </div>
                      {activeListings >= listingLimit && (
                        <p className="text-xs text-red-600 mt-2">
                          You've reached your listing limit. Upgrade your plan to add more properties.
                        </p>
                      )}
                    </div>
                    {subscription.package?.featuredListings && subscription.package.featuredListings > 0 && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm">Featured Listing Slots</span>
                          <span className="text-sm font-medium">
                            {subscription.package?.featuredListings || 0} available
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </Card>

              <Card className="p-6 mb-8">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold">Payment Method</h3>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => window.open("mailto:support@vengrow.com?subject=Update Payment Method", "_blank")}
                    data-testid="button-update-payment"
                  >
                    Update
                  </Button>
                </div>
                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="p-3 rounded-lg bg-muted">
                    <CreditCard className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="font-medium">Razorpay Payments</p>
                    <p className="text-sm text-muted-foreground">UPI, Cards, Net Banking & Wallets</p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h3 className="font-semibold mb-6">Billing History</h3>
                {payments.length === 0 ? (
                  <div className="text-center py-8">
                    <CreditCard className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No payment history yet</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {payments.map((payment) => (
                      <div
                        key={payment.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1">
                            <p className="font-medium">{payment.razorpayPaymentId || payment.id.slice(0, 8)}</p>
                            <Badge
                              className={
                                payment.status === "completed"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500"
                                  : payment.status === "pending"
                                  ? "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500"
                                  : "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500"
                              }
                            >
                              {payment.status === "completed" ? "Paid" : payment.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{format(new Date(payment.createdAt), "MMM d, yyyy")}</span>
                            <span>•</span>
                            <span>{payment.currency || "INR"}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <p className="font-semibold text-lg">₹{formatPrice(payment.amount)}</p>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDownloadInvoice(payment)}
                            data-testid={`button-download-${payment.id}`}
                          >
                            <Download className="h-4 w-4 mr-2" />
                            Invoice
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </>
          )}
        </div>
      </main>
    );
}
