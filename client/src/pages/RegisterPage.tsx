import { Link } from "wouter";
import { Building2, Shield, Check, Users, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { SiGoogle } from "react-icons/si";

export default function RegisterPage() {
  const handleGoogleSignup = () => {
    window.location.href = "/api/login";
  };

  const benefits = [
    "Browse thousands of verified properties",
    "Save favorites and get alerts",
    "Connect directly with sellers",
    "Access market insights and trends",
    "Schedule property visits online",
    "Compare properties side by side",
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
      <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
        {/* Left Side - Benefits */}
        <div className="hidden md:block space-y-6">
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-10 w-10 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </Link>
            <h1 className="text-3xl font-bold mb-2">Join VenGrow Today</h1>
            <p className="text-muted-foreground">
              Create your free account and start exploring India's trusted property marketplace.
            </p>
          </div>

          <div className="space-y-3">
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Check className="h-3.5 w-3.5 text-primary" />
                </div>
                <span className="text-sm">{benefit}</span>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground">
              Want to sell properties?{" "}
              <Link href="/seller/type" className="text-primary font-medium hover:underline">
                Register as a Seller
              </Link>
            </p>
          </div>
        </div>

        {/* Right Side - Register Card */}
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4 md:hidden">
              <Link href="/" className="inline-flex items-center gap-2">
                <Building2 className="h-10 w-10 text-primary" />
                <span className="font-serif font-bold text-2xl">VenGrow</span>
              </Link>
            </div>
            <CardTitle className="text-2xl">Create Account</CardTitle>
            <CardDescription>
              Sign up with your Google account to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <Button 
              variant="outline" 
              className="w-full h-12 text-base"
              onClick={handleGoogleSignup}
              data-testid="button-google-signup"
            >
              <SiGoogle className="h-5 w-5 mr-3" />
              Sign up with Google
            </Button>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-card px-2 text-muted-foreground">
                  Secure signup
                </span>
              </div>
            </div>

            <div className="space-y-4 text-center">
              <div className="flex items-center justify-center gap-6 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Shield className="h-4 w-4" />
                  <span>Secure</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>Free</span>
                </div>
                <div className="flex items-center gap-1">
                  <TrendingUp className="h-4 w-4" />
                  <span>Trusted</span>
                </div>
              </div>
            </div>

            <p className="text-center text-sm text-muted-foreground">
              By signing up, you agree to our{" "}
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
                Already have an account?{" "}
                <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
                  Sign in
                </Link>
              </p>
            </div>

            <div className="pt-4 border-t md:hidden">
              <p className="text-xs text-muted-foreground text-center">
                Want to sell properties?{" "}
                <Link href="/seller/type" className="text-primary hover:underline">
                  Register as a Seller
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
