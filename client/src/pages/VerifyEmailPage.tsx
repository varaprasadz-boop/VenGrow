import { Link } from "wouter";
import { Building2, Mail, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">PropConnect</span>
            </a>
          </Link>
        </div>

        <Card className="p-8 text-center">
          <div className="inline-flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 dark:bg-blue-900/20 mb-6">
            <Mail className="h-12 w-12 text-blue-600" />
          </div>

          <h1 className="font-serif font-bold text-3xl mb-3">
            Check Your Email
          </h1>
          <p className="text-muted-foreground mb-8">
            We've sent a verification link to<br />
            <strong className="text-foreground">john@example.com</strong>
          </p>

          <div className="bg-muted/50 rounded-lg p-6 mb-8">
            <div className="flex items-start gap-3 mb-4">
              <CheckCircle className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-left">
                <p className="font-medium mb-1">Next Steps:</p>
                <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                  <li>Open the email we sent you</li>
                  <li>Click on the verification link</li>
                  <li>Complete your profile setup</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Button className="w-full" data-testid="button-open-email">
              Open Email App
            </Button>
            <p className="text-sm text-muted-foreground">
              Didn't receive the email?{" "}
              <button className="text-primary hover:underline" data-testid="button-resend">
                Resend verification link
              </button>
            </p>
          </div>
        </Card>

        <div className="text-center mt-6">
          <Link href="/login">
            <a className="text-sm text-muted-foreground hover:text-foreground">
              Back to Login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
