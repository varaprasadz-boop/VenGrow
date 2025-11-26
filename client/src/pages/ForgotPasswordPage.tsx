import { useState } from "react";
import { Link } from "wouter";
import { Building2, Mail, ArrowLeft, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Password reset requested for:", email);
    setSubmitted(true);
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
          <p className="text-muted-foreground">Reset your password</p>
        </div>

        <Card className="p-6 sm:p-8">
          {!submitted ? (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2 text-center">
                <h1 className="font-serif font-bold text-2xl">Forgot Password?</h1>
                <p className="text-sm text-muted-foreground">
                  Enter your email address and we'll send you a link to reset your password
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="your@email.com"
                    className="pl-10"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    data-testid="input-email"
                    required
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" data-testid="button-send-reset-link">
                Send Reset Link
              </Button>

              <div className="text-center">
                <Link href="/login">
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" data-testid="link-back-to-login">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </a>
                </Link>
              </div>
            </form>
          ) : (
            <div className="space-y-6 text-center py-4">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-green-100 dark:bg-green-900/20">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <div className="space-y-2">
                <h2 className="font-serif font-bold text-2xl">Check Your Email</h2>
                <p className="text-muted-foreground">
                  We've sent a password reset link to <strong>{email}</strong>
                </p>
                <p className="text-sm text-muted-foreground">
                  Please check your inbox and click the link to reset your password
                </p>
              </div>

              <div className="space-y-3 pt-4">
                <p className="text-sm text-muted-foreground">
                  Didn't receive the email?{" "}
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-primary hover:underline"
                    data-testid="button-resend"
                  >
                    Resend
                  </button>
                </p>
                <Link href="/login">
                  <a className="inline-flex items-center gap-2 text-sm text-primary hover:underline" data-testid="link-back-to-login-2">
                    <ArrowLeft className="h-4 w-4" />
                    Back to Login
                  </a>
                </Link>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
