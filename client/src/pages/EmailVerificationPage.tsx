import { Link } from "wouter";
import { Building2, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function EmailVerificationPage() {
  const handleResend = () => {
    console.log("Resending verification email");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-2">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </a>
          </Link>
        </div>

        <Card className="p-6 sm:p-8">
          <div className="space-y-6 text-center">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
              <Mail className="h-10 w-10 text-primary" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-2xl">Verify Your Email</h1>
              <p className="text-muted-foreground">
                We've sent a verification link to your email address
              </p>
              <p className="text-sm font-medium">john.doe@example.com</p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4 space-y-2">
              <p className="text-sm font-medium">Next steps:</p>
              <ol className="text-sm text-muted-foreground space-y-1 text-left">
                <li className="flex gap-2">
                  <span>1.</span>
                  <span>Check your email inbox (and spam folder)</span>
                </li>
                <li className="flex gap-2">
                  <span>2.</span>
                  <span>Click the verification link in the email</span>
                </li>
                <li className="flex gap-2">
                  <span>3.</span>
                  <span>Return here to continue</span>
                </li>
              </ol>
            </div>

            <div className="space-y-3 pt-4">
              <p className="text-sm text-muted-foreground">
                Didn't receive the email?
              </p>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleResend}
                data-testid="button-resend-email"
              >
                Resend Verification Email
              </Button>
              <Link href="/login">
                <Button variant="ghost" className="w-full" data-testid="button-back-to-login">
                  Back to Login
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
