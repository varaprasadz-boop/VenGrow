import { Link } from "wouter";
import { Building2, CheckCircle, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApprovalApprovedPage() {
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
  

        <Card className="p-8 text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20 mb-6">
            <CheckCircle className="h-12 w-12 text-green-600" />
    

          <h1 className="font-serif font-bold text-3xl mb-3">
            Congratulations! You're Verified
          </h1>
          <p className="text-muted-foreground mb-8">
            Your seller account has been approved. You can now choose a package and start listing properties!
          </p>

          {/* Next Steps */}
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 rounded-lg p-6 mb-8 text-left">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h3 className="font-semibold">Next Steps</h3>
      
            <ol className="space-y-3 text-sm">
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">1</span>
                <span className="text-muted-foreground pt-0.5">Choose a listing package that fits your needs</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">2</span>
                <span className="text-muted-foreground pt-0.5">Complete payment through our secure Razorpay gateway</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 h-6 w-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold">3</span>
                <span className="text-muted-foreground pt-0.5">Start creating property listings and reach thousands of buyers</span>
              </li>
            </ol>
    

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/packages" className="flex-1">
              <Button className="w-full" size="lg" data-testid="button-choose-package">
                Choose Your Package
              </Button>
            </Link>
            <Link href="/seller/dashboard" className="flex-1">
              <Button variant="outline" className="w-full" size="lg" data-testid="button-dashboard">
                Go to Dashboard
              </Button>
            </Link>
    
        </Card>

        <div className="text-center mt-6">
          <p className="text-sm text-muted-foreground">
            Need assistance? <Link href="/contact"><a className="text-primary hover:underline">Contact our support team</a></Link>
          </p>
  

    </div>
  );
}
