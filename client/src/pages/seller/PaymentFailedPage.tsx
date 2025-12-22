import { Link } from "wouter";
import { Building2, XCircle, AlertCircle, RefreshCw } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function PaymentFailedPage() {
  const failureDetails = {
    transactionId: "TXN-20251124-002",
    date: "November 24, 2025, 10:35 AM",
    package: "Premium",
    amount: "₹3,538",
    reason: "Payment declined by bank",
  };

  const commonReasons = [
    "Insufficient funds in your account",
    "Incorrect card details or CVV",
    "Transaction declined by your bank",
    "Network or connectivity issues",
    "Card expired or blocked",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-2xl">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </a>
          </Link>
  

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
      

            <h1 className="font-serif font-bold text-3xl mb-3">
              Payment Failed
            </h1>
            <p className="text-muted-foreground">
              We couldn't process your payment at this time
            </p>
    

          {/* Failure Details */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Transaction Failed</h3>
      

            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Transaction ID</span>
                <span className="font-mono">{failureDetails.transactionId}</span>
        
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date & Time</span>
                <span>{failureDetails.date}</span>
        
              <div className="flex justify-between">
                <span className="text-muted-foreground">Package</span>
                <span>{failureDetails.package}</span>
        
              <div className="flex justify-between">
                <span className="text-muted-foreground">Amount</span>
                <span>{failureDetails.amount}</span>
        
              <div className="flex justify-between items-start">
                <span className="text-muted-foreground">Reason</span>
                <span className="text-right text-destructive font-medium">
                  {failureDetails.reason}
                </span>
        
      
    

          {/* Common Reasons */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3">Common Reasons for Failure</h3>
            <ul className="space-y-2 text-sm">
              {commonReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-primary mt-1">•</span>
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
    

          {/* What to Do Next */}
          <div className="bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3">What you can do</h3>
            <ul className="space-y-2 text-sm">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  Check your card details and try again
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  Contact your bank to ensure the transaction is not blocked
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  Try using a different payment method
                </span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span className="text-muted-foreground">
                  Contact our support team if the issue persists
                </span>
              </li>
            </ul>
    

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/seller/payment" className="flex-1">
              <Button className="w-full" data-testid="button-retry">
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="button-support">
                Contact Support
              </Button>
            </Link>
    
        </Card>

        <div className="text-center mt-6">
          <Link href="/seller/packages">
            <a className="text-sm text-muted-foreground hover:text-foreground">
              Back to Packages
            </a>
          </Link>
  

    </div>
  );
}
