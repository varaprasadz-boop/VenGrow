import { useState, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Building2, Shield, CreditCard, CheckCircle, AlertCircle, Loader2, Sparkles, Lock } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import type { Package, User } from "@shared/schema";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);
  const [razorpayLoaded, setRazorpayLoaded] = useState(false);
  const [dummyPaymentProgress, setDummyPaymentProgress] = useState(0);
  const [dummyPaymentStep, setDummyPaymentStep] = useState("");
  
  // Card form state for dummy payment
  const [cardNumber, setCardNumber] = useState("");
  const [expiryMonth, setExpiryMonth] = useState("");
  const [expiryYear, setExpiryYear] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardName, setCardName] = useState("");

  const urlParams = new URLSearchParams(window.location.search);
  const packageId = urlParams.get("package");

  const { data: user } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: packages = [], isLoading: packagesLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const { data: razorpayStatus, isLoading: statusLoading } = useQuery<{ configured: boolean; keyId: string; dummyMode: boolean }>({
    queryKey: ["/api/razorpay/status"],
  });

  const selectedPackage = packages.find(p => p.id === packageId);

  useEffect(() => {
    if (typeof window !== "undefined" && !window.Razorpay) {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.async = true;
      script.onload = () => setRazorpayLoaded(true);
      document.body.appendChild(script);
    } else {
      setRazorpayLoaded(true);
    }
  }, []);

  const createOrderMutation = useMutation({
    mutationFn: async (data: { packageId: string; amount: number; userId: string }) => {
      const response = await apiRequest("POST", "/api/razorpay/orders", data);
      return response.json();
    },
  });

  const verifyPaymentMutation = useMutation({
    mutationFn: async (data: {
      razorpay_order_id: string;
      razorpay_payment_id: string;
      razorpay_signature: string;
      paymentId: string;
    }) => {
      const response = await apiRequest("POST", "/api/razorpay/verify", data);
      return response.json();
    },
  });
  
  // Dummy payment mutation (for testing without Razorpay)
  const dummyPaymentMutation = useMutation({
    mutationFn: async (data: {
      cardNumber: string;
      expiryMonth: string;
      expiryYear: string;
      cvv: string;
      packageId: string;
      userId: string;
    }) => {
      const response = await apiRequest("POST", "/api/payments/dummy", data);
      return response.json();
    },
  });

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "");
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || "";
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    if (parts.length) {
      return parts.join(" ");
    } else {
      return value;
    }
  };

  const simulateDummyPayment = async (orderData: any, paymentId: string) => {
    const steps = [
      { progress: 20, message: "Initializing payment gateway..." },
      { progress: 40, message: "Connecting to bank..." },
      { progress: 60, message: "Processing transaction..." },
      { progress: 80, message: "Verifying payment..." },
      { progress: 100, message: "Payment confirmed!" },
    ];

    for (const step of steps) {
      setDummyPaymentProgress(step.progress);
      setDummyPaymentStep(step.message);
      await new Promise(resolve => setTimeout(resolve, 600));
    }

    const dummyPaymentId = `pay_dummy_${Date.now()}`;
    const dummySignature = `sig_dummy_${Date.now()}`;

    const verifyResult = await verifyPaymentMutation.mutateAsync({
      razorpay_order_id: orderData.orderId,
      razorpay_payment_id: dummyPaymentId,
      razorpay_signature: dummySignature,
      paymentId: paymentId,
    });

    if (verifyResult.success) {
      toast({
        title: "Payment Successful!",
        description: "Your subscription is now active. (Demo Mode)",
      });
      setTimeout(() => setLocation("/seller/dashboard"), 1000);
    }
  };

  // Handle dummy card payment (when Razorpay is not configured)
  const handleDummyPayment = async () => {
    if (!selectedPackage) {
      toast({
        title: "Error",
        description: "No package selected. Please go back and select a package.",
        variant: "destructive",
      });
      return;
    }
    
    if (!user) {
      toast({
        title: "Authentication Required",
        description: "Please log in to complete your purchase.",
        variant: "destructive",
      });
      setTimeout(() => setLocation("/login"), 1500);
      return;
    }
    
    // Basic validation
    if (!cardNumber || cardNumber.replace(/\s/g, "").length < 16) {
      toast({
        title: "Invalid Card Number",
        description: "Please enter a valid 16-digit card number. For testing, use: 4111-1111-1111-1111",
        variant: "destructive",
      });
      return;
    }
    
    if (!expiryMonth || !expiryYear) {
      toast({
        title: "Invalid Expiry Date",
        description: "Please enter a valid expiry date.",
        variant: "destructive",
      });
      return;
    }
    
    if (!cvv || cvv.length < 3) {
      toast({
        title: "Invalid CVV",
        description: "Please enter a valid CVV.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    setDummyPaymentProgress(0);
    
    // Simulate progress
    const steps = [
      { progress: 20, message: "Validating card details..." },
      { progress: 40, message: "Connecting to payment gateway..." },
      { progress: 60, message: "Processing transaction..." },
      { progress: 80, message: "Verifying payment..." },
    ];
    
    for (const step of steps) {
      setDummyPaymentProgress(step.progress);
      setDummyPaymentStep(step.message);
      await new Promise(resolve => setTimeout(resolve, 400));
    }

    try {
      const result = await dummyPaymentMutation.mutateAsync({
        cardNumber: cardNumber.replace(/\s/g, ""),
        expiryMonth,
        expiryYear,
        cvv,
        packageId: selectedPackage.id,
        userId: user.id,
      });

      if (result.success) {
        setDummyPaymentProgress(100);
        setDummyPaymentStep("Payment confirmed!");
        await new Promise(resolve => setTimeout(resolve, 500));
        
        toast({
          title: "Payment Successful!",
          description: `Your ${selectedPackage.name} package has been activated.`,
        });
        
        setTimeout(() => setLocation("/seller/dashboard"), 1500);
      } else {
        setIsProcessing(false);
        setDummyPaymentProgress(0);
        toast({
          title: "Payment Failed",
          description: result.message || "Please try again.",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      setIsProcessing(false);
      setDummyPaymentProgress(0);
      toast({
        title: "Payment Failed",
        description: error.message || "Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePayment = async () => {
    if (!selectedPackage || !user || !razorpayStatus?.keyId) return;

    setIsProcessing(true);
    setDummyPaymentProgress(0);
    setDummyPaymentStep("");

    try {
      const gstAmount = Math.round(selectedPackage.price * 0.18);
      const totalAmount = selectedPackage.price + gstAmount;

      const orderData = await createOrderMutation.mutateAsync({
        packageId: selectedPackage.id,
        amount: totalAmount,
        userId: user.id,
      });

      if (razorpayStatus.dummyMode) {
        await simulateDummyPayment(orderData, orderData.paymentId);
        return;
      }

      const options = {
        key: razorpayStatus.keyId,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "VenGrow",
        description: `${selectedPackage.name} Package - Monthly Subscription`,
        order_id: orderData.orderId,
        handler: async function (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) {
          try {
            const verifyResult = await verifyPaymentMutation.mutateAsync({
              ...response,
              paymentId: orderData.paymentId,
            });

            if (verifyResult.success) {
              toast({
                title: "Payment Successful!",
                description: "Your subscription is now active.",
              });
              setLocation("/seller/dashboard");
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if the amount was deducted.",
              variant: "destructive",
            });
          }
        },
        prefill: {
          email: user.email || "",
          contact: user.phone || "",
        },
        theme: {
          color: "#16a34a",
        },
        modal: {
          ondismiss: function () {
            setIsProcessing(false);
          },
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error: any) {
      toast({
        title: "Failed to Create Order",
        description: error.message || "Please try again later.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };

  const isLoading = packagesLoading || statusLoading;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-4xl">
          <div className="text-center mb-8">
            <Skeleton className="h-8 w-32 mx-auto mb-6" />
            <Skeleton className="h-10 w-64 mx-auto mb-2" />
            <Skeleton className="h-6 w-48 mx-auto" />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="lg:col-span-2 h-96" />
            <Skeleton className="h-64" />
          </div>
        </div>
      </div>
    );
  }

  if (!packageId || !selectedPackage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
          <h1 className="font-serif font-bold text-2xl mb-2">Package Not Found</h1>
          <p className="text-muted-foreground mb-4">
            Please select a package to proceed with payment.
          </p>
          <Link href="/seller/packages">
            <Button data-testid="button-select-package">
              Select a Package
            </Button>
          </Link>
        </Card>
      </div>
    );
  }

  // Determine if we're using dummy payment mode
  const useDummyPayment = !razorpayStatus?.configured;

  // Show processing animation for dummy payment
  if (isProcessing && dummyPaymentProgress > 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <Card className="p-8 text-center max-w-md w-full">
          <div className="mb-6">
            <div className="relative w-24 h-24 mx-auto mb-4">
              <div className="absolute inset-0 rounded-full border-4 border-muted" />
              {dummyPaymentProgress === 100 ? (
                <CheckCircle className="absolute inset-0 m-auto h-12 w-12 text-green-600" />
              ) : (
                <CreditCard className="absolute inset-0 m-auto h-10 w-10 text-muted-foreground animate-pulse" />
              )}
            </div>
            {dummyPaymentProgress === 100 && <Sparkles className="h-6 w-6 text-primary mx-auto mb-2" />}
          </div>
          <h2 className="font-serif font-bold text-2xl mb-2">
            {dummyPaymentProgress === 100 ? "Payment Complete!" : "Processing Payment"}
          </h2>
          <p className="text-muted-foreground mb-6">
            {dummyPaymentStep}
          </p>
          <Progress value={dummyPaymentProgress} className="mb-4" />
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Shield className="h-4 w-4" />
            <span>{useDummyPayment ? "Test Mode - No actual charges" : "Secure Payment"}</span>
          </div>
          {useDummyPayment && (
            <Badge variant="outline" className="mt-4">
              Test Payment
            </Badge>
          )}
        </Card>
      </div>
    );
  }

  const gstAmount = Math.round(selectedPackage.price * 0.18);
  const totalAmount = selectedPackage.price + gstAmount;

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <Link href="/">
            <span className="inline-flex items-center gap-2 mb-6 cursor-pointer" data-testid="link-home">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </span>
          </Link>
          <h1 className="font-serif font-bold text-3xl mb-2">
            Complete Your Payment
          </h1>
          <p className="text-muted-foreground">
            {useDummyPayment 
              ? "Test mode - Use test card for demo" 
              : "Secure payment powered by Razorpay"}
          </p>
          {useDummyPayment && (
            <Badge variant="secondary" className="mt-2">Test Mode</Badge>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 p-8">
            <h2 className="font-semibold text-xl mb-6">Payment Details</h2>

            <div className="mb-6">
              <div className="flex items-start justify-between mb-4 flex-wrap gap-2">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <h3 className="font-semibold text-lg">{selectedPackage.name} Package</h3>
                    {selectedPackage.isPopular && <Badge>Most Popular</Badge>}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Monthly subscription - {selectedPackage.listingLimit} listings
                  </p>
                </div>
                <p className="font-semibold text-lg">₹{selectedPackage.price.toLocaleString("en-IN")}</p>
              </div>

              <div className="bg-muted/50 rounded-lg p-4">
                <p className="text-sm font-medium mb-2">Package Includes:</p>
                <ul className="space-y-2">
                  {(selectedPackage.features as string[])?.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="space-y-3 mb-6">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Package Price</span>
                <span>₹{selectedPackage.price.toLocaleString("en-IN")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">GST (18%)</span>
                <span>₹{gstAmount.toLocaleString("en-IN")}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-semibold text-lg">
                <span>Total Amount</span>
                <span>₹{totalAmount.toLocaleString("en-IN")}</span>
              </div>
            </div>

            {useDummyPayment ? (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Card Details</h3>
                <div className="p-4 bg-yellow-50 dark:bg-yellow-900/10 border border-yellow-200 dark:border-yellow-800 rounded-lg mb-4">
                  <div className="flex items-start gap-2">
                    <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-yellow-900 dark:text-yellow-200">Test Mode</p>
                      <p className="text-xs text-yellow-700 dark:text-yellow-300">
                        Use test card <span className="font-mono font-semibold">4111 1111 1111 1111</span> with any future expiry and CVV
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="cardName">Cardholder Name</Label>
                    <Input
                      id="cardName"
                      placeholder="Name on card"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      data-testid="input-card-name"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="cardNumber">Card Number</Label>
                    <div className="relative">
                      <Input
                        id="cardNumber"
                        placeholder="4111 1111 1111 1111"
                        value={cardNumber}
                        onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                        maxLength={19}
                        className="pr-10"
                        data-testid="input-card-number"
                      />
                      <CreditCard className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="expiryMonth">Month</Label>
                      <Input
                        id="expiryMonth"
                        placeholder="MM"
                        value={expiryMonth}
                        onChange={(e) => setExpiryMonth(e.target.value.replace(/\D/g, "").slice(0, 2))}
                        maxLength={2}
                        data-testid="input-expiry-month"
                      />
                    </div>
                    <div>
                      <Label htmlFor="expiryYear">Year</Label>
                      <Input
                        id="expiryYear"
                        placeholder="YYYY"
                        value={expiryYear}
                        onChange={(e) => setExpiryYear(e.target.value.replace(/\D/g, "").slice(0, 4))}
                        maxLength={4}
                        data-testid="input-expiry-year"
                      />
                    </div>
                    <div>
                      <Label htmlFor="cvv">CVV</Label>
                      <div className="relative">
                        <Input
                          id="cvv"
                          placeholder="123"
                          type="password"
                          value={cvv}
                          onChange={(e) => setCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          maxLength={4}
                          className="pr-10"
                          data-testid="input-cvv"
                        />
                        <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="mb-6">
                <h3 className="font-semibold mb-4">Payment Method</h3>
                <Card className="p-4 border-2 border-primary">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <CreditCard className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">Pay with Razorpay</p>
                      <p className="text-xs text-muted-foreground">
                        Credit/Debit Card, UPI, Net Banking, Wallets
                      </p>
                    </div>
                    <Badge variant="outline" className="bg-green-50 dark:bg-green-900/10">
                      Secure
                    </Badge>
                  </div>
                </Card>
              </div>
            )}

            <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg mb-6">
              <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
              <div className="flex-1">
                <p className="text-sm font-medium text-blue-900 dark:text-blue-400 mb-1">
                  {useDummyPayment ? "Test Payment" : "Secure Payment"}
                </p>
                <p className="text-xs text-blue-700 dark:text-blue-500">
                  {useDummyPayment 
                    ? "This is a test environment. No actual charges will be made."
                    : "Your payment information is encrypted and secure. We never store your card details."}
                </p>
              </div>
            </div>

            <div className="flex gap-3 flex-wrap">
              <Link href="/seller/packages" className="flex-1">
                <Button variant="outline" className="w-full" data-testid="button-back">
                  Back to Packages
                </Button>
              </Link>
              <Button
                className="flex-1"
                size="lg"
                onClick={useDummyPayment ? handleDummyPayment : handlePayment}
                disabled={isProcessing || (!useDummyPayment && !razorpayLoaded)}
                data-testid="button-pay"
              >
                {isProcessing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Processing...
                  </>
                ) : (
                  `Pay ₹${totalAmount.toLocaleString("en-IN")}`
                )}
              </Button>
            </div>

            <p className="text-xs text-center text-muted-foreground mt-4">
              By proceeding, you agree to our{" "}
              <Link href="/terms">
                <span className="text-primary hover:underline cursor-pointer">Terms of Service</span>
              </Link>{" "}
              and{" "}
              <Link href="/refund">
                <span className="text-primary hover:underline cursor-pointer">Refund Policy</span>
              </Link>
            </p>
          </Card>

          <div className="space-y-6">
            <Card className="p-6">
              <h3 className="font-semibold mb-4">Order Summary</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Package</span>
                  <span className="font-medium">{selectedPackage.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Billing</span>
                  <span className="font-medium">Monthly</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Listings</span>
                  <span className="font-medium">{selectedPackage.listingLimit}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Validity</span>
                  <span className="font-medium">{selectedPackage.duration} days</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{totalAmount.toLocaleString("en-IN")}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold mb-4">Need Help?</h3>
              <div className="space-y-3 text-sm">
                <p className="text-muted-foreground">
                  Contact our support team if you have any questions about packages or payments
                </p>
                <Link href="/contact">
                  <Button variant="outline" size="sm" className="w-full" data-testid="button-contact">
                    Contact Support
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
