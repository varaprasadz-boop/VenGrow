import { useState } from "react";
import { Link } from "wouter";
import { Building2, Upload, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { StateSelect, CitySelect, PinCodeInput, PhoneInput } from "@/components/ui/location-select";

export default function IndividualRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panNumber: "",
    aadharNumber: "",
    propertyDocument: null,
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Individual registration:", formData);
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
                  />
                </div>

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
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Phone Number *</Label>
                  <PhoneInput
                    value={formData.phone}
                    onValueChange={(value) =>
                      setFormData({ ...formData, phone: value })
                    }
                    data-testid="input-phone"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="state">State *</Label>
                  <StateSelect
                    value={formData.state}
                    onValueChange={(value) =>
                      setFormData({ ...formData, state: value, city: "" })
                    }
                    data-testid="select-state"
                  />
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
                  />
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
                      setFormData({ ...formData, panNumber: e.target.value })
                    }
                    data-testid="input-pan"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                  <Input
                    id="aadharNumber"
                    placeholder="1234 5678 9012"
                    value={formData.aadharNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, aadharNumber: e.target.value })
                    }
                    data-testid="input-aadhar"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2 mt-4">
                <Label htmlFor="propertyDocument">Property Document (Optional)</Label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center hover-elevate active-elevate-2 cursor-pointer">
                  <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <p className="text-sm mb-2">
                    Upload property ownership documents (Sale Deed, Title Deed, etc.)
                  </p>
                  <p className="text-xs text-muted-foreground mb-4">
                    PDF, JPG, PNG up to 10MB
                  </p>
                  <Button type="button" variant="outline" size="sm" data-testid="button-upload-doc">
                    Choose File
                  </Button>
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
                <Button type="button" variant="outline" className="flex-1" data-testid="button-cancel">
                  Cancel
                </Button>
              </Link>
              <Button type="submit" className="flex-1" disabled={!formData.agreeToTerms} data-testid="button-submit">
                Submit Registration
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
