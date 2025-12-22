import { useState } from "react";
import { Link } from "wouter";
import { Building2, Upload, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function BuilderRegisterPage() {
  const [formData, setFormData] = useState({
    companyName: "",
    email: "",
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
    incorporationCertificate: null,
    reraCertificate: null,
    companyProfile: null,
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Builder registration:", formData);
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
            
          
        
      

            {/* Documents */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Verification Documents</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Certificate of Incorporation *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-1">Upload incorporation certificate</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF up to 5MB</p>
                    <Button type="button" variant="outline" size="sm" data-testid="button-upload-inc">
                      Choose File
                    </Button>
            
          

                <div className="space-y-2">
                  <Label>RERA Certificate *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-1">Upload RERA certificate</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF up to 5MB</p>
                    <Button type="button" variant="outline" size="sm" data-testid="button-upload-rera">
                      Choose File
                    </Button>
            
          

                <div className="space-y-2">
                  <Label>Company Profile (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-1">Upload company profile or brochure</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF up to 10MB</p>
                    <Button type="button" variant="outline" size="sm" data-testid="button-upload-profile">
                      Choose File
                    </Button>
            
          
        
      

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
        
      

            {/* Submit */}
            <div className="flex gap-3 pt-4">
              <Link href="/seller/type">
                <Button type="button" variant="outline" className="flex-1" data-testid="button-cancel">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={!formData.agreeToTerms} data-testid="button-submit">
                Submit Registration
              </Button>
      
          </form>
        </Card>

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already registered? <Link href="/login"><a className="text-primary hover:underline">Login here</a></Link>
        </p>

    </div>
  );
}
