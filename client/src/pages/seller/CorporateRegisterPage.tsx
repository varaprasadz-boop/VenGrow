import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Building2, Upload, ArrowLeft, Image, FileText, X } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";

export default function CorporateRegisterPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
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
    companyLogo: null as File | null,
    companyBrochure: null as File | null,
    agreeToTerms: false,
  });

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Logo must be less than 2MB",
          variant: "destructive",
        });
        return;
      }
      setFormData({ ...formData, companyLogo: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBrochureChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Brochure must be less than 10MB",
          variant: "destructive",
        });
        return;
      }
      if (file.type !== "application/pdf") {
        toast({
          title: "Invalid file type",
          description: "Please upload a PDF file",
          variant: "destructive",
        });
        return;
      }
      setFormData({ ...formData, companyBrochure: file });
      setBrochureName(file.name);
    }
  };

  const removeLogo = () => {
    setFormData({ ...formData, companyLogo: null });
    setLogoPreview(null);
  };

  const removeBrochure = () => {
    setFormData({ ...formData, companyBrochure: null });
    setBrochureName(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast({
        title: "Passwords don't match",
        description: "Please make sure your passwords match.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      toast({
        title: "Registration Submitted",
        description: "Your corporate registration is pending admin approval.",
      });
      setLocation("/seller/approval-pending");
    } catch (error) {
      toast({
        title: "Registration Failed",
        description: "Something went wrong. Please try again.",
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
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer relative">
                    {logoPreview ? (
                      <div className="relative">
                        <img 
                          src={logoPreview} 
                          alt="Company logo preview" 
                          className="h-24 w-24 mx-auto object-contain rounded-lg"
                        />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={removeLogo}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <p className="text-sm text-muted-foreground mt-2">Logo uploaded</p>
                
                    ) : (
                      <>
                        <Image className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm mb-1">Upload company logo</p>
                        <p className="text-xs text-muted-foreground mb-3">PNG, JPG up to 2MB (Square recommended)</p>
                        <input
                          type="file"
                          accept="image/png,image/jpeg,image/jpg"
                          onChange={handleLogoChange}
                          className="hidden"
                          id="logo-upload"
                          data-testid="input-logo-upload"
                        />
                        <Label htmlFor="logo-upload">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>Choose Logo</span>
                          </Button>
                        </Label>
                      </>
                    )}
            
                  <p className="text-xs text-muted-foreground">
                    This logo will be displayed on the Verified Builders section
                  </p>
          

                {/* Company Brochure Upload */}
                <div className="space-y-2">
                  <Label>Company Brochure (PDF)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer relative">
                    {brochureName ? (
                      <div className="relative">
                        <FileText className="h-12 w-12 mx-auto mb-2 text-primary" />
                        <p className="text-sm font-medium truncate max-w-[200px] mx-auto">{brochureName}</p>
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute -top-2 -right-2 h-6 w-6"
                          onClick={removeBrochure}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <p className="text-xs text-muted-foreground mt-1">PDF uploaded</p>
                
                    ) : (
                      <>
                        <FileText className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                        <p className="text-sm mb-1">Upload company brochure</p>
                        <p className="text-xs text-muted-foreground mb-3">PDF up to 10MB</p>
                        <input
                          type="file"
                          accept="application/pdf"
                          onChange={handleBrochureChange}
                          className="hidden"
                          id="brochure-upload"
                          data-testid="input-brochure-upload"
                        />
                        <Label htmlFor="brochure-upload">
                          <Button type="button" variant="outline" size="sm" asChild>
                            <span>Choose Brochure</span>
                          </Button>
                        </Label>
                      </>
                    )}
            
                  <p className="text-xs text-muted-foreground">
                    Buyers can download this brochure from your profile
                  </p>
          
        
      

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
                  />
          

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
                  />
          

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
                  />
          

                <div className="space-y-2">
                  <Label htmlFor="password">Password *</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    data-testid="input-password"
                    required
                  />
          

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
                  />
          

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
                      setFormData({ ...formData, cinNumber: e.target.value })
                    }
                    data-testid="input-cin"
                    required
                  />
          

                <div className="space-y-2">
                  <Label htmlFor="gstNumber">GST Number *</Label>
                  <Input
                    id="gstNumber"
                    placeholder="22AAAAA0000A1Z5"
                    value={formData.gstNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, gstNumber: e.target.value })
                    }
                    data-testid="input-gst"
                    required
                  />
          

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
                  />
          

                <div className="space-y-2">
                  <Label htmlFor="establishedYear">Year Established *</Label>
                  <Input
                    id="establishedYear"
                    type="number"
                    placeholder="2010"
                    value={formData.establishedYear}
                    onChange={(e) =>
                      setFormData({ ...formData, establishedYear: e.target.value })
                    }
                    data-testid="input-year"
                    required
                  />
          

                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="completedProjects">Number of Completed Projects *</Label>
                  <Input
                    id="completedProjects"
                    type="number"
                    placeholder="25"
                    value={formData.completedProjects}
                    onChange={(e) =>
                      setFormData({ ...formData, completedProjects: e.target.value })
                    }
                    data-testid="input-projects"
                    required
                  />
          
        
      

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
                  />
          

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) =>
                        setFormData({ ...formData, city: e.target.value })
                      }
                      data-testid="input-city"
                      required
                    />
            

                  <div className="space-y-2">
                    <Label htmlFor="state">State *</Label>
                    <Input
                      id="state"
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={(e) =>
                        setFormData({ ...formData, state: e.target.value })
                      }
                      data-testid="input-state"
                      required
                    />
            

                  <div className="space-y-2">
                    <Label htmlFor="pincode">PIN Code *</Label>
                    <Input
                      id="pincode"
                      placeholder="400001"
                      value={formData.pincode}
                      onChange={(e) =>
                        setFormData({ ...formData, pincode: e.target.value })
                      }
                      data-testid="input-pincode"
                      required
                    />
            
          
        
      

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
                {isLoading ? "Submitting..." : "Submit Registration"}
              </Button>
      
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered? <Link href="/login" className="text-primary hover:underline">Login here</Link>
        </p>

    </div>
  );
}
