import { Link } from "wouter";
import { Building2, XCircle, AlertCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function ApprovalRejectedPage() {
  const rejectionReasons = [
    "Incomplete or unclear documentation",
    "RERA certificate could not be verified",
    "Information mismatch between documents",
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
        </div>

        <Card className="p-8">
          <div className="text-center mb-8">
            <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <XCircle className="h-12 w-12 text-red-600" />
            </div>

            <h1 className="font-serif font-bold text-3xl mb-3">
              Application Not Approved
            </h1>
            <p className="text-muted-foreground">
              Unfortunately, we couldn't approve your seller account at this time.
            </p>
          </div>

          {/* Rejection Reasons */}
          <div className="bg-destructive/5 border border-destructive/20 rounded-lg p-6 mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <h3 className="font-semibold">Reasons for Rejection</h3>
            </div>
            <ul className="space-y-2 text-sm">
              {rejectionReasons.map((reason, index) => (
                <li key={index} className="flex items-start gap-2">
                  <span className="text-destructive mt-1">•</span>
                  <span className="text-muted-foreground">{reason}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* What You Can Do */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <h3 className="font-semibold mb-3">What you can do next</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Review and correct the issues mentioned above</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Ensure all documents are clear, complete, and valid</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Submit a new application with corrected information</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Contact support if you need clarification</span>
              </li>
            </ul>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link href="/seller/type" className="flex-1">
              <Button className="w-full" data-testid="button-reapply">
                Submit New Application
              </Button>
            </Link>
            <Link href="/contact" className="flex-1">
              <Button variant="outline" className="w-full" data-testid="button-contact">
                Contact Support
              </Button>
            </Link>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link href="/">
            <a className="text-sm text-muted-foreground hover:text-foreground">
              Return to Homepage
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
