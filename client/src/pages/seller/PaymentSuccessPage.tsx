import { Link } from "wouter";
import { Building2, CheckCircle, Download, ArrowRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PaymentSuccessPage() {
  const transaction = {
    id: "TXN-20251124-001",
    date: "November 24, 2025, 10:30 AM",
    package: "Premium",
    amount: 2999,
    gst: 539,
    total: 3538,
    paymentMethod: "UPI",
    validUntil: "December 24, 2025",
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">PropConnect</span>
            </a>
          </Link>
        </div>

        <Card className="p-8 text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
          </div>

          <h1 className="font-serif font-bold text-3xl mb-3">
            Payment Successful!
          </h1>
          <p className="text-muted-foreground mb-8">
            Your {transaction.package} package is now active
          </p>

          {/* Transaction Details */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Transaction Details</h3>
              <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                Completed
              </Badge>
            </div>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono">{transaction.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span>{transaction.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span className="font-medium">{transaction.package}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Payment Method</span>
                <span>{transaction.paymentMethod}</span>
              </div>

              <Separator />

              <div className="flex justify-between">
                <span className="text-muted-foreground">Package Amount</span>
                <span>₹{transaction.amount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{transaction.gst}</span>
              </div>

              <Separator />

              <div className="flex justify-between font-semibold text-base">
                <span>Total Paid</span>
                <span className="text-primary">₹{transaction.total}</span>
              </div>
            </div>
          </div>

          {/* Package Info */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3">Your Package is Active</h3>
            <div className="space-y-2 text-sm">
              <p className="text-muted-foreground">
                You can now create up to <strong>20 property listings</strong> with your Premium package
              </p>
              <p className="text-muted-foreground">
                Valid until: <strong>{transaction.validUntil}</strong>
              </p>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Link href="/seller/dashboard" className="flex-1">
              <Button className="w-full" data-testid="button-dashboard">
                Go to Dashboard
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            <Button variant="outline" className="flex-1" data-testid="button-invoice">
              <Download className="h-4 w-4 mr-2" />
              Download Invoice
            </Button>
          </div>

          <p className="text-sm text-muted-foreground">
            A confirmation email with your invoice has been sent to your registered email address
          </p>
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need help? <Link href="/contact"><a className="text-primary hover:underline">Contact our support team</a></Link>
          </p>
        </div>
      </div>
    </div>
  );
}
