import { Link } from "wouter";
import { Building2, Clock, CheckCircle, Mail, Phone } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function ApprovalPendingPage() {
  const verificationSteps = [
    { step: "Application Submitted", status: "completed" },
    { step: "Document Verification", status: "in_progress" },
    { step: "RERA Validation", status: "pending" },
    { step: "Final Approval", status: "pending" },
  ];

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
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-yellow-100 dark:bg-yellow-900/20 mb-6">
            <Clock className="h-12 w-12 text-yellow-600" />
          </div>

          <h1 className="font-serif font-bold text-3xl mb-3">
            Verification in Progress
          </h1>
          <p className="text-muted-foreground mb-8">
            Your seller account is being reviewed by our team. This usually takes 24-48 hours.
          </p>

          {/* Verification Steps */}
          <div className="mb-8">
            <div className="space-y-4">
              {verificationSteps.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center gap-4 p-4 border rounded-lg"
                >
                  <div className="flex-1 text-left">
                    <p className="font-medium">{item.step}</p>
                  </div>
                  {item.status === "completed" && (
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Completed
                    </Badge>
                  )}
                  {item.status === "in_progress" && (
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                      <Clock className="h-3 w-3 mr-1" />
                      In Progress
                    </Badge>
                  )}
                  {item.status === "pending" && (
                    <Badge variant="outline">
                      Pending
                    </Badge>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* What Happens Next */}
          <div className="bg-muted/50 rounded-lg p-6 mb-8 text-left">
            <h3 className="font-semibold mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>Our team will verify your documents and credentials</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>You'll receive an email once verification is complete</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-1">•</span>
                <span>After approval, you can select a package and start listing</span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="border-t pt-6">
            <p className="text-sm text-muted-foreground mb-4">
              Need help or have questions?
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" size="sm" data-testid="button-email">
                <Mail className="h-4 w-4 mr-2" />
                support@propconnect.in
              </Button>
              <Button variant="outline" size="sm" data-testid="button-phone">
                <Phone className="h-4 w-4 mr-2" />
                +91 1800-123-4567
              </Button>
            </div>
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
