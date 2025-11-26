import { Link } from "wouter";
import { Building2, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function PasswordResetSuccessPage() {
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
          <div className="space-y-6 text-center py-4">
            <div className="inline-flex h-20 w-20 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
              <CheckCircle className="h-10 w-10 text-green-600" />
            </div>

            <div className="space-y-2">
              <h1 className="font-serif font-bold text-2xl">Password Reset Successfully!</h1>
              <p className="text-muted-foreground">
                Your password has been successfully reset. You can now login with your new password.
              </p>
            </div>

            <div className="bg-muted/50 rounded-lg p-4">
              <p className="text-sm text-muted-foreground">
                For security reasons, you'll need to login again with your new password.
              </p>
            </div>

            <Link href="/login">
              <Button className="w-full" data-testid="button-login-now">
                Login Now
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}
