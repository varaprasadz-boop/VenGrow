import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Check, Users, TrendingUp, Home, Store, Eye, EyeOff, Mail, Lock, Phone, User, ArrowRight, ArrowLeft } from "lucide-react";
import vengrowLogo from "@assets/image_1765269036042.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SiGoogle } from "react-icons/si";

type Intent = "buyer" | "seller" | null;
type Step = "intent" | "buyer-form" | "seller-package";

export default function RegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [step, setStep] = useState<Step>("intent");
  const [intent, setIntent] = useState<Intent>(null);
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignup = () => {
    window.location.href = "/api/login";
  };

  const handleIntentSelect = (selectedIntent: Intent) => {
    setIntent(selectedIntent);
    if (selectedIntent === "buyer") {
      setStep("buyer-form");
    } else if (selectedIntent === "seller") {
      setLocation("/seller/type");
    }
  };

  const handleBuyerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    if (phone && !/^[6-9]\d{9}$/.test(phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit Indian mobile number.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        email,
        password,
        firstName,
        lastName,
        phone,
        intent: "buyer",
      });
      const data = await response.json();
      
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        toast({
          title: "Welcome to VenGrow!",
          description: "Your account has been created successfully.",
        });
        setLocation("/buyer/dashboard");
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const buyerBenefits = [
    "Browse thousands of verified properties",
    "Save favorites and get alerts",
    "Connect directly with sellers",
    "Access market insights and trends",
  ];

  const sellerBenefits = [
    "List properties to millions of buyers",
    "Get verified seller badge",
    "Access analytics dashboard",
    "Multiple package options available",
  ];

  // Intent Selection Step
  if (step === "intent") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
        <div className="w-full max-w-3xl">
          <div className="text-center mb-8">
            <Link href="/" className="inline-block mb-4">
              <img 
                src={vengrowLogo} 
                alt="VenGrow - Verified Property Market" 
                className="h-12 object-contain"
              />
            </Link>
            <h1 className="text-3xl font-bold mb-2">Welcome to VenGrow</h1>
            <p className="text-muted-foreground">
              India's trusted property marketplace. Tell us what brings you here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Buyer Option */}
            <Card 
              className="cursor-pointer hover-elevate transition-all border-2 hover:border-primary"
              onClick={() => handleIntentSelect("buyer")}
              data-testid="card-intent-buyer"
            >
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Home className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">I want to Browse, Rent, Lease or Buy</CardTitle>
                <CardDescription>
                  Find your perfect property from thousands of verified listings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {buyerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" data-testid="button-select-buyer">
                  Continue as Buyer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Seller Option */}
            <Card 
              className="cursor-pointer hover-elevate transition-all border-2 hover:border-primary"
              onClick={() => handleIntentSelect("seller")}
              data-testid="card-intent-seller"
            >
              <CardHeader className="text-center">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Store className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-xl">I want to Sell, Lease or Rent my Property</CardTitle>
                <CardDescription>
                  List your properties and connect with millions of buyers
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {sellerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-6" data-testid="button-select-seller">
                  Continue as Seller
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline" data-testid="link-login">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Buyer Registration Form
  if (step === "buyer-form") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
        <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Benefits */}
          <div className="hidden md:block space-y-6">
            <div>
              <Link href="/" className="inline-block mb-4">
                <img 
                  src={vengrowLogo} 
                  alt="VenGrow - Verified Property Market" 
                  className="h-12 object-contain"
                />
              </Link>
              <h1 className="text-3xl font-bold mb-2">Create Your Buyer Account</h1>
              <p className="text-muted-foreground">
                Start exploring India's trusted property marketplace.
              </p>
            </div>

            <div className="space-y-3">
              {buyerBenefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Check className="h-3.5 w-3.5 text-primary" />
                  </div>
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Form */}
          <Card className="w-full">
            <CardHeader>
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-fit mb-2"
                onClick={() => setStep("intent")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <CardTitle className="text-2xl">Buyer Registration</CardTitle>
              <CardDescription>
                Create your free account to get started
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Google Signup */}
              <Button 
                variant="outline" 
                className="w-full"
                onClick={handleGoogleSignup}
                data-testid="button-google-signup"
              >
                <SiGoogle className="h-4 w-4 mr-2" />
                Sign up with Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <Separator className="w-full" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">
                    Or register with email
                  </span>
                </div>
              </div>

              <form onSubmit={handleBuyerRegistration} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        className="pl-10"
                        required
                        data-testid="input-first-name"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      required
                      data-testid="input-last-name"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number (10 digits)</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      type="tel"
                      placeholder="Enter 10-digit mobile number"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))}
                      className="pl-10"
                      required
                      data-testid="input-phone"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Indian mobile number starting with 6-9</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10"
                      required
                      data-testid="input-password"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-0 top-0 h-full px-3"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="pl-10"
                      required
                      data-testid="input-confirm-password"
                    />
                  </div>
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading}
                  data-testid="button-register"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                      Creating account...
                    </span>
                  ) : (
                    "Create Account"
                  )}
                </Button>
              </form>

              <p className="text-center text-xs text-muted-foreground">
                By signing up, you agree to our{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // Seller Package Selection - Redirect to packages page
  if (step === "seller-package") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
        <div className="w-full max-w-2xl">
          <Card>
            <CardHeader className="text-center">
              <Button 
                variant="ghost" 
                size="sm" 
                className="w-fit mb-2"
                onClick={() => setStep("intent")}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Store className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-2xl">Choose Your Seller Package</CardTitle>
              <CardDescription>
                Select a package that fits your needs. Different packages offer different listing limits and features.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="bg-muted/50 rounded-lg p-4">
                <h3 className="font-semibold mb-2">Why choose a package?</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    List properties based on your package limit
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Get featured listings for more visibility
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Access analytics and insights
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-primary" />
                    Priority support for premium packages
                  </li>
                </ul>
              </div>

              <div className="flex flex-col gap-4">
                <Link href="/packages">
                  <Button className="w-full" size="lg" data-testid="button-view-packages">
                    View Available Packages
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </Link>
                
                <Button 
                  variant="outline" 
                  onClick={handleGoogleSignup}
                  data-testid="button-google-seller-signup"
                >
                  <SiGoogle className="h-4 w-4 mr-2" />
                  Continue with Google first
                </Button>
              </div>

              <p className="text-center text-sm text-muted-foreground">
                You can select a package after signing up. All new listings require admin approval before going live.
              </p>
            </CardContent>
          </Card>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
