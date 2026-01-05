import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Upload, ArrowLeft, Loader2, X, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StateSelect, CitySelect, PinCodeInput } from "@/components/ui/location-select";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { ObjectUploader } from "@/components/ObjectUploader";

export default function BuilderRegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [incorporationCertificateUrl, setIncorporationCertificateUrl] = useState<string | null>(null);
  const [incorporationCertificateName, setIncorporationCertificateName] = useState<string | null>(null);
  const [reraCertificateUrl, setReraCertificateUrl] = useState<string | null>(null);
  const [reraCertificateName, setReraCertificateName] = useState<string | null>(null);
  const [companyProfileUrl, setCompanyProfileUrl] = useState<string | null>(null);
  const [companyProfileName, setCompanyProfileName] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
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

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^[6-9]\d{9}$/.test(formData.phone.replace(/\D/g, ""))) {
      newErrors.phone = "Invalid phone number";
    }

    if (!formData.cinNumber.trim()) {
      newErrors.cinNumber = "CIN number is required";
    }

    if (!formData.gstNumber.trim()) {
      newErrors.gstNumber = "GST number is required";
    } else if (!/^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/.test(formData.gstNumber.toUpperCase())) {
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

    if (!formData.pincode) {
      newErrors.pincode = "PIN code is required";
    } else if (!/^\d{6}$/.test(formData.pincode)) {
      newErrors.pincode = "PIN code must be 6 digits";
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }

    if (!incorporationCertificateUrl) {
      newErrors.incorporationCertificate = "Certificate of Incorporation is required";
    }

    if (!reraCertificateUrl) {
      newErrors.reraCertificate = "RERA certificate is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleIncorporationUpload = async (results: any) => {
    // Handle both array format (legacy) and object format (Uppy UploadResult)
    const successful = Array.isArray(results) ? results : (results?.successful || []);
    if (successful.length === 0) return;
    const file = successful[0];
    setIncorporationCertificateUrl(file.url);
    setIncorporationCertificateName(file.name);
    toast({ title: "Incorporation certificate uploaded successfully" });
  };

  const handleReraUpload = async (results: any) => {
    // Handle both array format (legacy) and object format (Uppy UploadResult)
    const successful = Array.isArray(results) ? results : (results?.successful || []);
    if (successful.length === 0) return;
    const file = successful[0];
    setReraCertificateUrl(file.url);
    setReraCertificateName(file.name);
    toast({ title: "RERA certificate uploaded successfully" });
  };

  const handleCompanyProfileUpload = async (results: any) => {
    // Handle both array format (legacy) and object format (Uppy UploadResult)
    const successful = Array.isArray(results) ? results : (results?.successful || []);
    if (successful.length === 0) return;
    const file = successful[0];
    setCompanyProfileUrl(file.url);
    setCompanyProfileName(file.name);
    toast({ title: "Company profile uploaded successfully" });
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

      const response = await apiRequest("POST", "/api/seller/register", {
        sellerType: "builder",
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
        incorporationCertificateUrl,
        reraCertificateUrl,
        companyProfileUrl,
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
            Builder/Developer Registration
          </h1>
          <p className="text-muted-foreground">
            Register your construction company to showcase projects
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">
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
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 22 1234 5678"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    data-testid="input-phone"
                    required
                    className={errors.phone ? "border-destructive" : ""}
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
                  <Label htmlFor="cinNumber">CIN Number *</Label>
                  <Input
                    id="cinNumber"
                    placeholder="U12345MH2010PTC123456"
                    value={formData.cinNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, cinNumber: e.target.value.toUpperCase() })
                    }
                    data-testid="input-cin"
                    required
                    className={errors.cinNumber ? "border-destructive" : ""}
                  />
                  {errors.cinNumber && (
                    <p className="text-sm text-destructive">{errors.cinNumber}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number *</Label>
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
                    <Label htmlFor="pincode">PIN Code *</Label>
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

            {/* Documents */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Verification Documents</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Certificate of Incorporation *</Label>
                  <div className="flex items-center gap-2">
                    <ObjectUploader
                      bucket="seller-documents"
                      prefix="builder/incorporation/"
                      onComplete={handleIncorporationUpload}
                      maxFiles={1}
                      accept=".pdf"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Certificate
                    </ObjectUploader>
                    {incorporationCertificateUrl && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">{incorporationCertificateName || "Certificate uploaded"}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setIncorporationCertificateUrl(null);
                            setIncorporationCertificateName(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  {errors.incorporationCertificate && (
                    <p className="text-sm text-destructive">{errors.incorporationCertificate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>RERA Certificate *</Label>
                  <div className="flex items-center gap-2">
                    <ObjectUploader
                      bucket="seller-documents"
                      prefix="builder/rera/"
                      onComplete={handleReraUpload}
                      maxFiles={1}
                      accept="image/*,.pdf"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload RERA Certificate
                    </ObjectUploader>
                    {reraCertificateUrl && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">{reraCertificateName || "RERA Certificate uploaded"}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setReraCertificateUrl(null);
                            setReraCertificateName(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
                    )}
                  </div>
                  {errors.reraCertificate && (
                    <p className="text-sm text-destructive">{errors.reraCertificate}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Company Profile (Optional)</Label>
                  <div className="flex items-center gap-2">
                    <ObjectUploader
                      bucket="seller-documents"
                      prefix="builder/profile/"
                      onComplete={handleCompanyProfileUpload}
                      maxFiles={1}
                      accept=".pdf"
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Upload Company Profile
                    </ObjectUploader>
                    {companyProfileUrl && (
                      <>
                        <CheckCircle className="h-4 w-4 text-green-600" />
                        <span className="text-sm text-muted-foreground">{companyProfileName || "Company Profile uploaded"}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6"
                          onClick={() => {
                            setCompanyProfileUrl(null);
                            setCompanyProfileName(null);
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </>
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
                  I confirm that the company is duly registered and all information provided is accurate
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
