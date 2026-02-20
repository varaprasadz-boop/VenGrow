import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Shield, Check, Users, TrendingUp, Home, Store, Mail, Lock, User, ArrowRight, ArrowLeft, Loader2 } from "lucide-react";
import vengrowLogo from "@assets/VenGrow_Logo_Design_Trasparent_1765381672347.png";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/ui/passwordinput";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { SiGoogle } from "react-icons/si";
import { PhoneInput } from "@/components/ui/location-select";

type Intent = "buyer" | "seller" | null;
type Step = "intent" | "buyer-form" | "seller-form" | "seller-package";

interface FormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
}

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
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [touchedFields, setTouchedFields] = useState<Set<string>>(new Set());

  const handleGoogleSignup = () => {
    setIsGoogleLoading(true);
    window.location.href = "/api/login";
  };

  // Password validation function
  const validatePasswordStrength = (pwd: string): { valid: boolean; message?: string } => {
    if (pwd.length < 8) {
      return { valid: false, message: "Password must be at least 8 characters long" };
    }
    if (!/[A-Z]/.test(pwd)) {
      return { valid: false, message: "Password must contain at least one uppercase letter" };
    }
    if (!/[a-z]/.test(pwd)) {
      return { valid: false, message: "Password must contain at least one lowercase letter" };
    }
    if (!/[0-9]/.test(pwd)) {
      return { valid: false, message: "Password must contain at least one number" };
    }
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) {
      return { valid: false, message: "Password must contain at least one special character" };
    }
    return { valid: true };
  };

  // Email validation
  const validateEmailFormat = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validate individual field
  const validateField = (name: string, value: string): string | undefined => {
    switch (name) {
      case "firstName":
        if (!value.trim()) {
          return "First name is required";
        }
        break;
      case "lastName":
        if (!value.trim()) {
          return "Last name is required";
        }
        break;
      case "email":
        if (!value.trim()) {
          return "Email is required";
        } else if (!validateEmailFormat(value.trim())) {
          return "Please enter a valid email address";
        }
        break;
      case "phone":
        if (!value.trim()) {
          return "Phone number is required";
        } else if (!/^[6-9]\d{9}$/.test(value)) {
          return "Please enter a valid 10-digit Indian mobile number starting with 6-9";
        }
        break;
      case "password":
        if (!value) {
          return "Password is required";
        } else {
          const validation = validatePasswordStrength(value);
          if (!validation.valid) {
            return validation.message;
          }
        }
        break;
      case "confirmPassword":
        if (!value) {
          return "Please confirm your password";
        } else if (value !== password) {
          return "Passwords do not match";
        }
        break;
    }
    return undefined;
  };

  // Handle field blur
  const handleBlur = (fieldName: string) => {
    setTouchedFields((prev) => new Set(prev).add(fieldName));
    const value = fieldName === "firstName" ? firstName :
                  fieldName === "lastName" ? lastName :
                  fieldName === "email" ? email :
                  fieldName === "phone" ? phone :
                  fieldName === "password" ? password :
                  confirmPassword;
    const error = validateField(fieldName, value);
    setErrors((prev) => ({ ...prev, [fieldName]: error }));
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    let isValid = true;

    const fields = [
      { name: "firstName", value: firstName },
      { name: "lastName", value: lastName },
      { name: "email", value: email },
      { name: "phone", value: phone },
      { name: "password", value: password },
      { name: "confirmPassword", value: confirmPassword },
    ];

    fields.forEach(({ name, value }) => {
      const error = validateField(name, value);
      if (error) {
        newErrors[name as keyof FormErrors] = error;
        isValid = false;
      }
    });

    setErrors(newErrors);
    // Mark all fields as touched
    setTouchedFields(new Set(["firstName", "lastName", "email", "phone", "password", "confirmPassword"]));
    return isValid;
  };

  const handleIntentSelect = (selectedIntent: Intent) => {
    setIntent(selectedIntent);
    if (selectedIntent === "buyer") {
      setStep("buyer-form");
    } else if (selectedIntent === "seller") {
      // Redirect directly to seller type selection
      setLocation("/seller/type");
    }
  };

  const handleBuyerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some fields have errors. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        intent: "buyer",
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch {
            // If that fails, use status text
            errorMessage = response.statusText || errorMessage;
          }
        }

        // Map common error messages to user-friendly ones
        const userFriendlyMessages: Record<string, string> = {
          "User with this email already exists": "This email is already registered. Please sign in or use a different email.",
          "Invalid email format": "Please enter a valid email address.",
          "Invalid phone number. Must be 10 digits starting with 6-9": "Please enter a valid 10-digit Indian mobile number.",
          "Password must be at least 8 characters long": "Password must be at least 8 characters long.",
          "Password must contain at least one uppercase letter": "Password must contain at least one uppercase letter.",
          "Password must contain at least one lowercase letter": "Password must contain at least one lowercase letter.",
          "Password must contain at least one number": "Password must contain at least one number.",
          "Password must contain at least one special character": "Password must contain at least one special character.",
        };

        const friendlyMessage = userFriendlyMessages[errorMessage] || errorMessage;

        toast({
          title: "Registration Failed",
          description: friendlyMessage,
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        toast({
          title: "Welcome to VenGrow!",
          description: "Your account has been created successfully.",
        });
        
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        setTouchedFields(new Set());
        
        // Redirect after a brief delay to show success
        setTimeout(() => {
          setLocation("/buyer/dashboard");
        }, 500);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Handle network errors separately
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSellerRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields
    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some fields have errors. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/auth/register", {
        email: email.trim(),
        password,
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        phone: phone.trim(),
        intent: "seller",
      });

      // Check if response is ok before parsing JSON
      if (!response.ok) {
        let errorMessage = "Something went wrong";
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorMessage;
        } catch {
          // If response is not JSON, try to get text
          try {
            const text = await response.text();
            errorMessage = text || errorMessage;
          } catch {
            // If that fails, use status text
            errorMessage = response.statusText || errorMessage;
          }
        }

        // Map common error messages to user-friendly ones
        const userFriendlyMessages: Record<string, string> = {
          "User with this email already exists": "This email is already registered. Please sign in or use a different email.",
          "Invalid email format": "Please enter a valid email address.",
          "Invalid phone number. Must be 10 digits starting with 6-9": "Please enter a valid 10-digit Indian mobile number.",
          "Password must be at least 8 characters long": "Password must be at least 8 characters long.",
          "Password must contain at least one uppercase letter": "Password must contain at least one uppercase letter.",
          "Password must contain at least one lowercase letter": "Password must contain at least one lowercase letter.",
          "Password must contain at least one number": "Password must contain at least one number.",
          "Password must contain at least one special character": "Password must contain at least one special character.",
        };

        const friendlyMessage = userFriendlyMessages[errorMessage] || errorMessage;

        toast({
          title: "Registration Failed",
          description: friendlyMessage,
          variant: "destructive",
        });
        return;
      }

      const data = await response.json();
      
      if (data.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        toast({
          title: "Welcome to VenGrow!",
          description: "Your seller account has been created successfully.",
        });
        
        // Reset form
        setFirstName("");
        setLastName("");
        setEmail("");
        setPhone("");
        setPassword("");
        setConfirmPassword("");
        setErrors({});
        setTouchedFields(new Set());
        
        // Redirect to seller type selection after a brief delay
        setTimeout(() => {
          setLocation("/seller/type");
        }, 500);
      } else {
        toast({
          title: "Registration Failed",
          description: data.message || "Something went wrong",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      // Handle network errors separately
      if (error.name === "TypeError" && error.message.includes("fetch")) {
        toast({
          title: "Network Error",
          description: "Unable to connect to the server. Please check your internet connection and try again.",
          variant: "destructive",
        });
      } else {
        toast({
          title: "Registration Failed",
          description: error.message || "Something went wrong. Please try again.",
          variant: "destructive",
        });
      }
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
      <div className="min-h-screen flex flex-col justify-center bg-muted/30 p-4 py-4 md:py-12 overflow-auto">
        <div className="w-full max-w-3xl mx-auto flex flex-col justify-center min-h-0">
          <div className="text-center mb-4 md:mb-8 shrink-0">
            <Link href="/" className="inline-block mb-2 md:mb-4">
              <img 
                src={vengrowLogo} 
                alt="VenGrow - Verified Property Market" 
                className="h-10 md:h-12 object-contain"
              />
            </Link>
            <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Welcome to VenGrow</h1>
            <p className="text-muted-foreground text-sm md:text-base">
              India's trusted property marketplace. Tell us what brings you here.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-4 md:gap-6 min-h-0">
            {/* Buyer Option */}
            <Card 
              className="cursor-pointer hover-elevate transition-all border-2 hover:border-primary md:flex md:flex-col"
              onClick={() => handleIntentSelect("buyer")}
              data-testid="card-intent-buyer"
            >
              <CardHeader className="text-center p-4 md:p-6 pb-2 md:pb-6">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <Home className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg md:text-xl">I want to Browse, Rent, Lease or Buy</CardTitle>
                <CardDescription className="text-sm">
                  Find your perfect property from thousands of verified listings
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="hidden md:block space-y-2">
                  {buyerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 md:mt-6" data-testid="button-select-buyer">
                  Continue as Buyer
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>

            {/* Seller Option */}
            <Card 
              className="cursor-pointer hover-elevate transition-all border-2 hover:border-primary md:flex md:flex-col"
              onClick={() => handleIntentSelect("seller")}
              data-testid="card-intent-seller"
            >
              <CardHeader className="text-center p-4 md:p-6 pb-2 md:pb-6">
                <div className="h-12 w-12 md:h-16 md:w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2 md:mb-4">
                  <Store className="h-6 w-6 md:h-8 md:w-8 text-primary" />
                </div>
                <CardTitle className="text-lg md:text-xl">I want to Sell, Lease or Rent my Property</CardTitle>
                <CardDescription className="text-sm">
                  List your properties and connect with millions of buyers
                </CardDescription>
              </CardHeader>
              <CardContent className="p-4 pt-0 md:p-6 md:pt-0">
                <div className="hidden md:block space-y-2">
                  {sellerBenefits.map((benefit, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-primary shrink-0" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4 md:mt-6" data-testid="button-select-seller">
                  Continue as Seller
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-4 md:mt-8 shrink-0">
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
                disabled={isGoogleLoading || isLoading}
                data-testid="button-google-signup"
                aria-label="Sign up with Google"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <SiGoogle className="h-4 w-4 mr-2" />
                    Sign up with Google
                  </>
                )}
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
                    <Label htmlFor="firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (touchedFields.has("firstName")) {
                            const error = validateField("firstName", e.target.value);
                            setErrors((prev) => ({ ...prev, firstName: error }));
                          }
                        }}
                        onBlur={() => handleBlur("firstName")}
                        className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                        required
                        data-testid="input-first-name"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "firstName-error" : undefined}
                      />
                    </div>
                    {errors.firstName && touchedFields.has("firstName") && (
                      <p id="firstName-error" className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input
                      id="lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (touchedFields.has("lastName")) {
                          const error = validateField("lastName", e.target.value);
                          setErrors((prev) => ({ ...prev, lastName: error }));
                        }
                      }}
                      onBlur={() => handleBlur("lastName")}
                      className={errors.lastName ? "border-destructive" : ""}
                      required
                      data-testid="input-last-name"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "lastName-error" : undefined}
                    />
                    {errors.lastName && touchedFields.has("lastName") && (
                      <p id="lastName-error" className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touchedFields.has("email")) {
                          const error = validateField("email", e.target.value);
                          setErrors((prev) => ({ ...prev, email: error }));
                        }
                      }}
                      onBlur={() => handleBlur("email")}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      required
                      data-testid="input-email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "email-error" : undefined}
                    />
                  </div>
                  {errors.email && touchedFields.has("email") && (
                    <p id="email-error" className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2" onBlur={() => handleBlur("phone")}>
                  <Label htmlFor="phone">Mobile Number (10 digits) *</Label>
                  <PhoneInput
                    value={phone}
                    onValueChange={(v) => {
                      setPhone(v);
                      if (touchedFields.has("phone")) {
                        const error = validateField("phone", v);
                        setErrors((prev) => ({ ...prev, phone: error }));
                      }
                    }}
                    error={touchedFields.has("phone") ? errors.phone : undefined}
                    data-testid="input-phone"
                  />
                  {errors.phone && touchedFields.has("phone") && (
                    <p id="phone-error" className="text-sm text-destructive">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Indian mobile number starting with 6-9</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" aria-hidden="true" />
                    <PasswordField
                      id="password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touchedFields.has("password")) {
                          const error = validateField("password", e.target.value);
                          setErrors((prev) => ({ ...prev, password: error }));
                        }
                        // Also validate confirm password if it's been touched
                        if (touchedFields.has("confirmPassword") && confirmPassword) {
                          const confirmError = validateField("confirmPassword", confirmPassword);
                          setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
                        }
                      }}
                      onBlur={() => handleBlur("password")}
                      className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                      required
                      data-testid="input-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "password-error password-requirements" : "password-requirements"}
                    />
                  </div>
                  {errors.password && touchedFields.has("password") && (
                    <p id="password-error" className="text-sm text-destructive">{errors.password}</p>
                  )}
                  <div id="password-requirements" className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Password requirements:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li className={password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                      <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>One uppercase letter</li>
                      <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>One lowercase letter</li>
                      <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>One number</li>
                      <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : ""}>One special character</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" aria-hidden="true" />
                    <PasswordField
                      id="confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (touchedFields.has("confirmPassword")) {
                          const error = validateField("confirmPassword", e.target.value);
                          setErrors((prev) => ({ ...prev, confirmPassword: error }));
                        }
                      }}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      required
                      data-testid="input-confirm-password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
                    />
                  </div>
                  {errors.confirmPassword && touchedFields.has("confirmPassword") && (
                    <p id="confirmPassword-error" className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || isGoogleLoading}
                  data-testid="button-register"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
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

  // Seller Registration Form
  if (step === "seller-form") {
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
              <h1 className="text-3xl font-bold mb-2">Create Your Seller Account</h1>
              <p className="text-muted-foreground">
                Start listing properties and connect with buyers.
              </p>
            </div>

            <div className="space-y-3">
              {sellerBenefits.map((benefit, index) => (
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
              <CardTitle className="text-2xl">Seller Registration</CardTitle>
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
                disabled={isGoogleLoading || isLoading}
                data-testid="button-google-seller-signup"
                aria-label="Sign up with Google"
              >
                {isGoogleLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Redirecting...
                  </>
                ) : (
                  <>
                    <SiGoogle className="h-4 w-4 mr-2" />
                    Sign up with Google
                  </>
                )}
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

              <form onSubmit={handleSellerRegistration} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="seller-firstName">First Name *</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                      <Input
                        id="seller-firstName"
                        placeholder="First name"
                        value={firstName}
                        onChange={(e) => {
                          setFirstName(e.target.value);
                          if (touchedFields.has("firstName")) {
                            const error = validateField("firstName", e.target.value);
                            setErrors((prev) => ({ ...prev, firstName: error }));
                          }
                        }}
                        onBlur={() => handleBlur("firstName")}
                        className={`pl-10 ${errors.firstName ? "border-destructive" : ""}`}
                        required
                        data-testid="input-seller-first-name"
                        aria-invalid={!!errors.firstName}
                        aria-describedby={errors.firstName ? "seller-firstName-error" : undefined}
                      />
                    </div>
                    {errors.firstName && touchedFields.has("firstName") && (
                      <p id="seller-firstName-error" className="text-sm text-destructive">{errors.firstName}</p>
                    )}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="seller-lastName">Last Name *</Label>
                    <Input
                      id="seller-lastName"
                      placeholder="Last name"
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        if (touchedFields.has("lastName")) {
                          const error = validateField("lastName", e.target.value);
                          setErrors((prev) => ({ ...prev, lastName: error }));
                        }
                      }}
                      onBlur={() => handleBlur("lastName")}
                      className={errors.lastName ? "border-destructive" : ""}
                      required
                      data-testid="input-seller-last-name"
                      aria-invalid={!!errors.lastName}
                      aria-describedby={errors.lastName ? "seller-lastName-error" : undefined}
                    />
                    {errors.lastName && touchedFields.has("lastName") && (
                      <p id="seller-lastName-error" className="text-sm text-destructive">{errors.lastName}</p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller-email">Email *</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
                    <Input
                      id="seller-email"
                      type="email"
                      placeholder="Enter your email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (touchedFields.has("email")) {
                          const error = validateField("email", e.target.value);
                          setErrors((prev) => ({ ...prev, email: error }));
                        }
                      }}
                      onBlur={() => handleBlur("email")}
                      className={`pl-10 ${errors.email ? "border-destructive" : ""}`}
                      required
                      data-testid="input-seller-email"
                      aria-invalid={!!errors.email}
                      aria-describedby={errors.email ? "seller-email-error" : undefined}
                    />
                  </div>
                  {errors.email && touchedFields.has("email") && (
                    <p id="seller-email-error" className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2" onBlur={() => handleBlur("phone")}>
                  <Label htmlFor="seller-phone">Mobile Number (10 digits) *</Label>
                  <PhoneInput
                    value={phone}
                    onValueChange={(v) => {
                      setPhone(v);
                      if (touchedFields.has("phone")) {
                        const error = validateField("phone", v);
                        setErrors((prev) => ({ ...prev, phone: error }));
                      }
                    }}
                    error={touchedFields.has("phone") ? errors.phone : undefined}
                    data-testid="input-seller-phone"
                  />
                  {errors.phone && touchedFields.has("phone") && (
                    <p id="seller-phone-error" className="text-sm text-destructive">{errors.phone}</p>
                  )}
                  <p className="text-xs text-muted-foreground">Indian mobile number starting with 6-9</p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller-password">Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" aria-hidden="true" />
                    <PasswordField
                      id="seller-password"
                      placeholder="Create a password"
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (touchedFields.has("password")) {
                          const error = validateField("password", e.target.value);
                          setErrors((prev) => ({ ...prev, password: error }));
                        }
                        // Also validate confirm password if it's been touched
                        if (touchedFields.has("confirmPassword") && confirmPassword) {
                          const confirmError = validateField("confirmPassword", confirmPassword);
                          setErrors((prev) => ({ ...prev, confirmPassword: confirmError }));
                        }
                      }}
                      onBlur={() => handleBlur("password")}
                      className={`pl-10 ${errors.password ? "border-destructive" : ""}`}
                      required
                      data-testid="input-seller-password"
                      aria-invalid={!!errors.password}
                      aria-describedby={errors.password ? "seller-password-error seller-password-requirements" : "seller-password-requirements"}
                    />
                  </div>
                  {errors.password && touchedFields.has("password") && (
                    <p id="seller-password-error" className="text-sm text-destructive">{errors.password}</p>
                  )}
                  <div id="seller-password-requirements" className="text-xs text-muted-foreground space-y-1">
                    <p className="font-medium">Password requirements:</p>
                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                      <li className={password.length >= 8 ? "text-green-600" : ""}>At least 8 characters</li>
                      <li className={/[A-Z]/.test(password) ? "text-green-600" : ""}>One uppercase letter</li>
                      <li className={/[a-z]/.test(password) ? "text-green-600" : ""}>One lowercase letter</li>
                      <li className={/[0-9]/.test(password) ? "text-green-600" : ""}>One number</li>
                      <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password) ? "text-green-600" : ""}>One special character</li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="seller-confirmPassword">Confirm Password *</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground z-10" aria-hidden="true" />
                    <PasswordField
                      id="seller-confirmPassword"
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (touchedFields.has("confirmPassword")) {
                          const error = validateField("confirmPassword", e.target.value);
                          setErrors((prev) => ({ ...prev, confirmPassword: error }));
                        }
                      }}
                      onBlur={() => handleBlur("confirmPassword")}
                      className={`pl-10 ${errors.confirmPassword ? "border-destructive" : ""}`}
                      required
                      data-testid="input-seller-confirm-password"
                      aria-invalid={!!errors.confirmPassword}
                      aria-describedby={errors.confirmPassword ? "seller-confirmPassword-error" : undefined}
                    />
                  </div>
                  {errors.confirmPassword && touchedFields.has("confirmPassword") && (
                    <p id="seller-confirmPassword-error" className="text-sm text-destructive">{errors.confirmPassword}</p>
                  )}
                </div>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={isLoading || isGoogleLoading}
                  data-testid="button-seller-register"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating account...
                    </>
                  ) : (
                    "Create Seller Account"
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
