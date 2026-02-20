import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Upload, ArrowLeft, Image, FileText, X, Loader2, CheckCircle } from "lucide-react";
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
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useAuth } from "@/hooks/useAuth";
import { useAuthStore } from "@/stores/authStore";
import { queryClient } from "@/lib/queryClient";

export default function CorporateRegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const { isAuthenticated, refetch: refetchAuth } = useAuth();
  const setUser = useAuthStore((s) => s.setUser);
  const setActiveDashboard = useAuthStore((s) => s.setActiveDashboard);
  const isAttachFlow = isAuthenticated;
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [brochureUrl, setBrochureUrl] = useState<string | null>(null);
  const [brochureName, setBrochureName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    website: "",
    cinNumber: "",
    gstNumber: "",
    reraNumber: "",
    establishedYear: "",
    completedProjects: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    agreeToTerms: false,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.companyName.trim()) {
      newErrors.companyName = "Company name is required";
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

    // CIN number is optional

    if (formData.gstNumber.trim() && !/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
      newErrors.gstNumber = "Invalid GST format (e.g., 22AAAAA0000A1Z5)";
    }

    if (!formData.reraNumber.trim()) {
      newErrors.reraNumber = "RERA registration number is required";
    }

    if (!formData.establishedYear) {
      newErrors.establishedYear = "Year established is required";
    } else {
      const year = parseInt(formData.establishedYear);
      const currentYear = new Date().getFullYear();
      if (year < 1900 || year > currentYear) {
        newErrors.establishedYear = `Year must be between 1900 and ${currentYear}`;
      }
    }

    if (!formData.completedProjects) {
      newErrors.completedProjects = "Number of completed projects is required";
    } else if (parseInt(formData.completedProjects) < 0) {
      newErrors.completedProjects = "Must be a positive number";
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

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!logoUrl) {
      newErrors.logo = "Company logo is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const LOGO_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const BROCHURE_MAX_SIZE_BYTES = 5 * 1024 * 1024; // 5MB
  const LOGO_DIMENSIONS = { width: 512, height: 512 };

  const handleLogoUpload = async (results: any) => {
    const successful = Array.isArray(results) ? results : (results?.successful || []);
    if (successful.length === 0) return;
    const file = successful[0];
    const logoUrlFromUpload = file.url || file.source || file.uploadURL;
    if (!logoUrlFromUpload) {
      toast({ title: "Upload failed", description: "No image URL received.", variant: "destructive" });
      return;
    }
    if (file.size && file.size > LOGO_MAX_SIZE_BYTES) {
      toast({ title: "Logo too large", description: "Logo must be 5MB or less.", variant: "destructive" });
      return;
    }
    // Show preview immediately so user sees the uploaded logo
    setLogoPreview(logoUrlFromUpload);
    setLogoUrl(logoUrlFromUpload);

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      if (img.naturalWidth !== LOGO_DIMENSIONS.width || img.naturalHeight !== LOGO_DIMENSIONS.height) {
        setLogoUrl(null);
        setLogoPreview(null);
        toast({
          title: "Invalid logo dimensions",
          description: `Logo must be exactly ${LOGO_DIMENSIONS.width}×${LOGO_DIMENSIONS.height} pixels.`,
          variant: "destructive",
        });
        return;
      }
      toast({ title: "Logo uploaded successfully" });
    };
    img.onerror = () => {
      // Keep preview visible; dimension check failed (e.g. CORS). User can still see and submit; server may validate.
      toast({
        title: "Could not verify dimensions",
        description: "Logo preview is shown. Use 512×512 px to avoid rejection.",
        variant: "default",
      });
    };
    img.src = logoUrlFromUpload;
  };

  const handleBrochureUpload = async (results: any) => {
    const successful = Array.isArray(results) ? results : (results?.successful || []);
    if (successful.length === 0) return;
    const file = successful[0];
    if (file.size && file.size > BROCHURE_MAX_SIZE_BYTES) {
      toast({ title: "Brochure too large", description: "Brochure must be 5MB or less.", variant: "destructive" });
      return;
    }
    setBrochureUrl(file.url);
    setBrochureName(file.name);
    toast({ title: "Brochure uploaded successfully" });
  };

  const removeLogo = () => {
    setLogoUrl(null);
    setLogoPreview(null);
  };

  const removeBrochure = () => {
    setBrochureUrl(null);
    setBrochureName(null);
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
      const nameParts = formData.companyName.trim().split(" ");
      const firstName = nameParts[0] || "";
      const lastName = nameParts.slice(1).join(" ") || "";

      if (isAttachFlow) {
        const response = await apiRequest("POST", "/api/seller/attach", {
          sellerType: "builder",
          phone: formData.phone.replace(/\D/g, ""),
          companyName: formData.companyName.trim(),
          cinNumber: formData.cinNumber.trim(),
          gstNumber: formData.gstNumber?.trim() ? formData.gstNumber.toUpperCase() : undefined,
          reraNumber: formData.reraNumber.trim(),
          website: formData.website.trim() || undefined,
          address: formData.address.trim(),
          city: formData.city,
          state: formData.state,
          pincode: formData.pincode,
          logoUrl,
          brochureUrl,
        });
        if (!response.ok) {
          const err = await response.json();
          throw new Error(err.message || "Failed to add seller profile");
        }
        const data = await response.json();
        if (data.user) {
          const roles = Array.isArray(data.user.roles) ? data.user.roles : (data.user.role ? [data.user.role] : []);
          setUser({ ...data.user, roles });
          setActiveDashboard("seller");
        }
        await queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        await refetchAuth();
        toast({
          title: "Seller profile added",
          description: "Your corporate registration is pending approval. You can switch between Buyer and Seller from the header.",
        });
        setLocation("/seller/approval-pending");
        return;
      }

      const response = await apiRequest("POST", "/api/seller/register", {
        sellerType: "builder", // Corporate is treated as builder
        email: formData.email.trim(),
        password: formData.password,
        firstName,
        lastName,
        phone: formData.phone.replace(/\D/g, ""),
        companyName: formData.companyName.trim(),
        cinNumber: formData.cinNumber.trim(),
        gstNumber: formData.gstNumber.toUpperCase(),
        reraNumber: formData.reraNumber.trim(),
        website: formData.website.trim() || undefined,
        address: formData.address.trim(),
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        logoUrl,
        brochureUrl,
      });

      if (response.ok) {
        toast({
          title: "Registration Successful",
          description: "Your corporate registration is pending admin approval.",
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
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-8">
      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-serif font-bold text-2xl">VenGrow</span>
          </Link>
          <Link href="/seller/type" className="flex items-center justify-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="h-4 w-4" />
            Back to seller type selection
          </Link>
          <h1 className="font-serif font-bold text-3xl mb-2">
            Corporate/Builder Registration
          </h1>
          <p className="text-muted-foreground">
            Register your company to showcase projects and get featured as a Verified Builder
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Company Branding Section */}
            <div>
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Company Branding
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Company Logo Upload */}
                <div className="space-y-2">
                  <Label>Company Logo *</Label>
                  <div className="flex flex-wrap items-start gap-4">
                    <ObjectUploader
                      bucket="seller-documents"
                      prefix="corporate/logo/"
                      onComplete={handleLogoUpload}
                      maxFiles={1}
                      accept="image/*"
                      maxFileSize={5 * 1024 * 1024}
                      autoCloseOnSuccess={false}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Logo
                    </ObjectUploader>
                    {logoPreview && (
                      <div className="flex items-center gap-2 flex-wrap">
                        <div className="relative shrink-0">
                          <Avatar className="h-20 w-20 rounded-full border-2 border-muted flex">
                            <AvatarImage src={logoPreview} alt="Logo preview" className="object-cover" />
                            <AvatarFallback className="bg-muted">
                              <Image className="h-8 w-8 text-muted-foreground" />
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="absolute h-6 w-6 min-w-6 rounded-full border-2 border-background bg-muted-foreground text-background hover:bg-foreground shadow z-10"
                            style={{ position: "absolute", top: 0, right: 0, left: "auto", bottom: "auto" }}
                            onClick={removeLogo}
                            aria-label="Remove logo"
                          >
                            <X className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                        <div className="flex items-center gap-1.5 text-sm text-muted-foreground">
                          <CheckCircle className="h-4 w-4 text-green-600 shrink-0" />
                          <span>Logo uploaded</span>
                        </div>
                      </div>
                    )}
                  </div>
                  {errors.logo && (
                    <p className="text-sm text-destructive">{errors.logo}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Max 5MB, 512×512 px. Displayed on the Verified Builders section.
                  </p>
                </div>

                {/* Company Brochure Upload - PDF only */}
                <div className="space-y-2">
                  <Label>Company Brochure (PDF only)</Label>
                  <div className="flex items-center gap-2">
                    <ObjectUploader
                      bucket="seller-documents"
                      prefix="corporate/brochure/"
                      onComplete={handleBrochureUpload}
                      maxFiles={1}
                      accept=".pdf,application/pdf"
                      maxFileSize={5 * 1024 * 1024}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Brochure
                    </ObjectUploader>
                    {brochureUrl && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">{brochureName || "Brochure uploaded"}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={removeBrochure}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    PDF only, max 5MB. Buyers can download this brochure from your profile.
                  </p>
                </div>
              </div>
            </div>

            {/* Company Information */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Company Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="companyName">Company Name *</Label>
                  <Input
                    id="companyName"
                    placeholder="Prestige Constructions Pvt Ltd"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    data-testid="input-company"
                    required
                    className={errors.companyName ? "border-destructive" : ""}
                  />
                  {errors.companyName && (
                    <p className="text-sm text-destructive">{errors.companyName}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Official Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="info@company.com"
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

                <div className="space-y-2">
                  <Label htmlFor="phone">Official Phone *</Label>
                  <PhoneInput
                    value={formData.phone.replace(/\D/g, "")}
                    onValueChange={(v) =>
                      setFormData({ ...formData, phone: v })
                    }
                    error={errors.phone}
                    data-testid="input-phone"
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>

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

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="website">Company Website (Optional)</Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://www.company.com"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    data-testid="input-website"
                  />
                </div>
              </div>
            </div>

            {/* Legal & Registration Details */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Legal & Registration Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="cinNumber">CIN Number</Label>
                  <Input
                    id="cinNumber"
                    placeholder="U12345MH2010PTC123456"
                    value={formData.cinNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cinNumber: e.target.value.toUpperCase() })
                    }
                    data-testid="input-cin"
                    className={errors.cinNumber ? "border-destructive" : ""}
                  />
                  {errors.cinNumber && (
                    <p className="text-sm text-destructive">{errors.cinNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number (optional)</Label>
                  <Input
                    id="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, gstNumber: e.target.value.toUpperCase() })
                    }
                    data-testid="input-gst"
                    required
                    maxLength={15}
                    className={errors.gstNumber ? "border-destructive" : ""}
                  />
                  {errors.gstNumber && (
                    <p className="text-sm text-destructive">{errors.gstNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reraNumber">RERA Registration Number *</Label>
                  <Input
                    id="reraNumber"
                    placeholder="RERA123456789"
                    value={formData.reraNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, reraNumber: e.target.value })
                    }
                    data-testid="input-rera"
                    required
                    className={errors.reraNumber ? "border-destructive" : ""}
                  />
                  {errors.reraNumber && (
                    <p className="text-sm text-destructive">{errors.reraNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Year Established *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    placeholder="2010"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={formData.establishedYear}
                    onChange={(e) =>
                      setFormData({ ...formData, establishedYear: e.target.value })
                    }
                    data-testid="input-year"
                    required
                    className={errors.establishedYear ? "border-destructive" : ""}
                  />
                  {errors.establishedYear && (
                    <p className="text-sm text-destructive">{errors.establishedYear}</p>
                  )}
                </div>

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="completedProjects">Number of Completed Projects *</Label>
                  <Input
                    id="completedProjects"
                    type="number"
                    placeholder="25"
                    min="0"
                    value={formData.completedProjects}
                    onChange={(e) =>
                      setFormData({ ...formData, completedProjects: e.target.value })
                    }
                    data-testid="input-projects"
                    required
                    className={errors.completedProjects ? "border-destructive" : ""}
                  />
                  {errors.completedProjects && (
                    <p className="text-sm text-destructive">{errors.completedProjects}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Office Address */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Registered Office Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="Building, Street, Area"
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

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
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
                  I confirm that the company is duly registered and all information provided is accurate. 
                  My registration will be reviewed by admin before activation.
                </p>
              </div>
            </div>

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link href="/seller/type" className="flex-1">
                <Button type="button" variant="outline" className="w-full" data-testid="button-cancel">
                  Cancel
                </Button>
              </Link>
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={!formData.agreeToTerms || isLoading}
                data-testid="button-submit"
              >
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
          Already registered? <Link href="/login" className="text-primary hover:underline">Login here</Link>
        </p>
      </div>
    </div>
  );
}
