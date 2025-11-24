import { Link } from "wouter";
import { Building2, Shield, CreditCard, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";

export default function PaymentPage() {
  const selectedPackage = {
    name: "Premium",
    price: 2999,
    duration: "month",
    listings: 20,
    features: [
      "Up to 20 property listings",
      "Featured badge on listings",
      "Priority email & phone support",
      "60-day listing validity",
      "Advanced analytics & insights",
    ],
  };

  const gstAmount = Math.round(selectedPackage.price * 0.18);
  const totalAmount = selectedPackage.price + gstAmount;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-4xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">PropConnect</span>
            </a>
          </Link>
          <h1 className="font-serif font-bold text-3xl mb-2">
            Complete Your Payment
          </h1>
          <p className="text-muted-foreground">
            Secure payment powered by Razorpay
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Summary */}
          <Card className="lg:col-span-2 p-8">
            <h2 className="font-semibold text-xl mb-6">Payment Details</h2>

            {/* Package Details */}
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg">{selectedPackage.name} Package</h3>
                    <Badge>Most Popular</Badge>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monthly subscription • {selectedPackage.listings} listings
                  </p>
                </div>
                <p className="font-semibold text-lg">₹{selectedPackage.price}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Package Includes:</p>
                <ul className="space-y-2">
                  {selectedPackage.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="my-6" />

            {/* Price Breakdown */}
            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package Price</span>
                <span>₹{selectedPackage.price}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{gstAmount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{totalAmount}</span>
              </div>
            </div>

            {/* Payment Method */}
            <div className="mb-6">
              <h3 className="font-semibold mb-4">Payment Method</h3>
              <Card className="p-4 border-2 border-primary">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <CreditCard className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <p className="font-medium">Pay with Razorpay</p>
                    <p className="text-xs text-muted-foreground">
                      Credit/Debit Card, UPI, Net Banking, Wallets
                    </p>
                  </div>
                  <Badge variant="outline" className="bg-green-50 dark:bg-green-900/10">
                    Secure
                  </Badge>
                </div>
              </Card>
            </div>

            {/* Security Note */}
            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg mb-6">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-1">
                  Secure Payment
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-500">
                  Your payment information is encrypted and secure. We never store your card details.
                </p>
              </div>
            </div>

            {/* CTA */}
            <div className="flex gap-3">
              <Link href="/seller/packages" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="button-back">
                  Back to Packages
                </Button>
              </Link>
              <Button className="flex-1" size="lg" data-testid="button-pay">
                Pay ₹{totalAmount}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding, you agree to our{" "}
              <Link href="/terms">
                <a className="text-primary hover:underline">Terms of Service</a>
              </Link>{" "}
              and{" "}
              <Link href="/refund">
                <a className="text-primary hover:underline">Refund Policy</a>
              </Link>
            </p>
          </Card>

          {/* Summary Sidebar */}
          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listings</span>
                  <span className="font-medium">{selectedPackage.listings}</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Contact our support team if you have any questions about packages or payments
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-contact">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
