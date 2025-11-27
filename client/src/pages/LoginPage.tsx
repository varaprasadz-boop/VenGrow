import { Link } from "wouter";
import { Building2, Shield, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGoogle } from "react-icons/si";

export default function LoginPage() {
  const handleGoogleLogin = () => {
    window.location.href = "/api/login";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden md:block space-y-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-10 w-10 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome Back!</h1>
            <p className="text-muted-foreground">
              Sign in to access your account and continue your property journey.
            </p>
          </div>

          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Verified Properties</h3>
                <p className="text-sm text-muted-foreground">
                  All properties are verified by our team for authenticity
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Trusted Sellers</h3>
                <p className="text-sm text-muted-foreground">
                  Connect with verified individual sellers, brokers, and builders
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                <TrendingUp className="h-5 w-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold">Market Insights</h3>
                <p className="text-sm text-muted-foreground">
                  Get real-time property analytics and market trends
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <Building2 className="h-10 w-10 text-primary" />
                <span className="font-serif font-bold text-2xl">VenGrow</span>
              </Link>
            </div>
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>
              Use your Google account to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base"
              onClick={handleGoogleLogin}
              data-testid="button-google-login"
            >
              <SiGoogle className="h-5 w-5 mr-3" />
              Continue with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure login
                </span>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By continuing, you agree to our{" "}
              <Link href="/terms" className="text-primary hover:underline">
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link href="/privacy" className="text-primary hover:underline">
                Privacy Policy
              </Link>
            </p>

            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link href="/register" className="text-primary font-medium hover:underline" data-testid="link-register">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                For sellers and brokers, you'll be redirected to complete your profile after login.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
