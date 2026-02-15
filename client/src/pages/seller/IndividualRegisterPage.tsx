import { useState, useRef } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Upload, ArrowLeft, Loader2, X, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StateSelect, CitySelect, PinCodeInput, PhoneInput } from "@/components/ui/location-select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";

export default function IndividualRegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated } = useAuth();
  const isAttachFlow = isAuthenticated;
  const [isLoading, setIsLoading] = useState(false);
  const [propertyDocumentUrl, setPropertyDocumentUrl] = useState<string | null>(null);
  const [propertyDocumentName, setPropertyDocumentName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panNumber: "",
    aadharNumber: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required";
    }

    if (!isAttachFlow) {
      if (!formData.email.trim()) {
        newErrors.email = "Email is required";
      } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
        newErrors.email = "Invalid email format";
      }
      if (!formData.password) {
        newErrors.password = "Password is required";
      } else if (formData.password.length < 8) {
        newErrors.password = "Password must be at least 8 characters";
      }
      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = "Passwords do not match";
      }
    }

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.state) {
      newErrors.state = "State is required";
    }

    if (!formData.city) {
      newErrors.city = "City is required";
    }

    // PIN code is optional - only validate format if provided
    if (formData.pincode && !/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "PIN code must be 6 digits";
    }

    if (!formData.panNumber) {
      newErrors.panNumber = "PAN number is required";
    } else if (!/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/.test(formData.panNumber.toUpperCase())) {
      newErrors.panNumber = "Invalid PAN format (e.g., ABCDE1234F)";
    }

    if (!formData.aadharNumber) {
      newErrors.aadharNumber = "Aadhar number is required";
    } else if (!/^\d{12}$/.test(formData.aadharNumber.replace(/\D/g, ""))) {
      newErrors.aadharNumber = "Aadhar number must be 12 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleFileUpload = async (results: any) => {
    // Handle both array format (legacy) and object format (Uppy UploadResult)
    const successful = Array.isArray(results) ? results : (results?.successful || []);
    if (successful.length === 0) return;
    
    const file = successful[0];
    setPropertyDocumentUrl(file.url);
    setPropertyDocumentName(file.name);
    toast({ title: "Document uploaded successfully" });
  };

  const handleRemoveDocument = () => {
    setPropertyDocumentUrl(null);
    setPropertyDocumentName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      toast({
        title: "Please fix the errors",
        description: "Some fields have errors. Please check and try again.",
        variant: "destructive",
      });
      return;
    }

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms not accepted",
        description: "Please accept the terms and conditions",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const nameParts = formData.fullName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      if (isAttachFlow) {
        const response = await apiRequest("POST", "/api/seller/attach", {
          sellerType: "individual",
          phone: formData.phone.replace(/\D/g, ""),
          panNumber: formData.panNumber.toUpperCase(),
          aadharNumber: formData.aadharNumber.replace(/\D/g, ""),
          address: formData.address.trim(),
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          propertyDocumentUrl,
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Failed to add seller profile");
        }
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        toast({
          title: "Seller profile added",
          description: "Your seller registration is pending approval. You can switch between Buyer and Seller from the header.",
        });
        setLocation("/seller/approval-pending");
        return;
      }

      const response = await apiRequest("POST", "/api/seller/register", {
        sellerType: "individual",
        email: formData.email.trim(),
        password: formData.password,
        firstName,
        lastName,
        phone: formData.phone.replace(/\D/g, ""),
        panNumber: formData.panNumber.toUpperCase(),
        aadharNumber: formData.aadharNumber.replace(/\D/g, ""),
        address: formData.address.trim(),
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        propertyDocumentUrl,
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your registration is pending admin approval.",
        });
        setLocation("/seller/approval-pending");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || "Registration failed");
      }
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-3xl">
        {/* Logo & Back */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </a>
          </Link>
          <Link href="/seller/type">
            <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to seller type selection
            </a>
          </Link>
          <h1 className="font-serif font-bold text-3xl mb-2">
            Individual Owner Registration
          </h1>
          <p className="text-muted-foreground">
            Complete your profile to start listing properties
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    placeholder="Your full name"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                    data-testid="input-fullname"
                    required
                    className={errors.fullName ? "border-destructive" : ""}
                  />
                  {errors.fullName && (
                    <p className="text-sm text-destructive">{errors.fullName}</p>
                  )}
                </div>

                {!isAttachFlow && (
                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      data-testid="input-email"
                      required
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && (
                      <p className="text-sm text-destructive">{errors.email}</p>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <PhoneInput
                    value={formData.phone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                    data-testid="input-phone"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

                {!isAttachFlow && (
                  <>
                    <div className="space-y-2">
                      <Label htmlFor="password">Password *</Label>
                      <Input
                        id="password"
                        type="password"
                        placeholder="Create a password (min 8 characters)"
                        value={formData.password}
                        onChange={(e) =>
                          setFormData({ ...formData, password: e.target.value })
                        }
                        data-testid="input-password"
                        required
                        className={errors.password ? "border-destructive" : ""}
                      />
                      {errors.password && (
                        <p className="text-sm text-destructive">{errors.password}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password *</Label>
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="Confirm your password"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({ ...formData, confirmPassword: e.target.value })
                        }
                        data-testid="input-confirm-password"
                        required
                        className={errors.confirmPassword ? "border-destructive" : ""}
                      />
                      {errors.confirmPassword && (
                        <p className="text-sm text-destructive">{errors.confirmPassword}</p>
                      )}
                    </div>
                  </>
                )}

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <StateSelect
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value, city: "" })
                    }
                    data-testid="select-state"
                  />
                  {errors.state && (
                    <p className="text-sm text-destructive">{errors.state}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Address */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="House/Flat number, Building, Street"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    data-testid="textarea-address"
                    required
                    className={errors.address ? "border-destructive" : ""}
                  />
                  {errors.address && (
                    <p className="text-sm text-destructive">{errors.address}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <CitySelect
                      value={formData.city}
                      onValueChange={(value) =>
                        setFormData({ ...formData, city: value })
                      }
                      stateValue={formData.state}
                      data-testid="select-city"
                    />
                    {errors.city && (
                      <p className="text-sm text-destructive">{errors.city}</p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code (Optional)</Label>
                    <PinCodeInput
                      value={formData.pincode}
                      onValueChange={(value) =>
                        setFormData({ ...formData, pincode: value })
                      }
                      data-testid="input-pincode"
                    />
                    {errors.pincode && (
                      <p className="text-sm text-destructive">{errors.pincode}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Verification Documents */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Verification Documents</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    placeholder="ABCDE1234F"
                    value={formData.panNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, panNumber: e.target.value.toUpperCase() })
                    }
                    data-testid="input-pan"
                    required
                    maxLength={10}
                    className={errors.panNumber ? "border-destructive" : ""}
                  />
                  {errors.panNumber && (
                    <p className="text-sm text-destructive">{errors.panNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                  <Input
                    id="aadharNumber"
                    placeholder="1234 5678 9012"
                    value={formData.aadharNumber}
                    onChange={(e) => {
                      const value = e.target.value.replace(/\D/g, "").slice(0, 12);
                      setFormData({ ...formData, aadharNumber: value });
                    }}
                    data-testid="input-aadhar"
                    required
                    maxLength={12}
                    className={errors.aadharNumber ? "border-destructive" : ""}
                  />
                  {errors.aadharNumber && (
                    <p className="text-sm text-destructive">{errors.aadharNumber}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="propertyDocument">Property Document (Optional)</Label>
                <div className="flex items-center gap-2">
                  <ObjectUploader
                    bucket="seller-documents"
                    prefix="individual/"
                    onComplete={handleFileUpload}
                    maxFiles={1}
                    accept="image/*,.pdf"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </ObjectUploader>
                  {propertyDocumentUrl && (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <span className="text-sm text-muted-foreground">{propertyDocumentName || "Document uploaded"}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={handleRemoveDocument}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-3 p-4 border rounded-lg">
              <Checkbox
                id="terms"
                checked={formData.agreeToTerms}
                onCheckedChange={(checked) =>
                  setFormData({ ...formData, agreeToTerms: checked as boolean })
                }
                data-testid="checkbox-terms"
              />
              <div className="flex-1">
                <Label htmlFor="terms" className="cursor-pointer">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
                <p className="text-xs text-muted-foreground mt-1">
                  By registering, you confirm that all provided information is accurate
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link href="/seller/type">
                <Button type="button" variant="outline" className="flex-1" data-testid="button-cancel" disabled={isLoading}>
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={!formData.agreeToTerms || isLoading} data-testid="button-submit">
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  "Submit Registration"
                )}
              </Button>
            </div>
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered? <Link href="/login"><a className="text-primary hover:underline">Login here</a></Link>
        </p>
      </div>
    </div>
  );
}
