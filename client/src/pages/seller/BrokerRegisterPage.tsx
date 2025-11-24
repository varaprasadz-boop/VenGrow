import { useState } from "react";
import { Link } from "wouter";
import { Building2, Upload, ArrowLeft } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

export default function BrokerRegisterPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    firmName: "",
    reraNumber: "",
    yearsOfExperience: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    panNumber: "",
    reraCertificate: null,
    businessCard: null,
    agreeToTerms: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Broker registration:", formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-3xl">
        {/* Logo & Back */}
        <div className="text-center mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">PropConnect</span>
            </a>
          </Link>
          <Link href="/seller/type">
            <a className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
              <ArrowLeft className="h-4 w-4" />
              Back to seller type selection
            </a>
          </Link>
          <h1 className="font-serif font-bold text-3xl mb-2">
            Broker/Agent Registration
          </h1>
          <p className="text-muted-foreground">
            Register as a verified real estate broker
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
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    data-testid="input-phone"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="firmName">Firm/Agency Name *</Label>
                  <Input
                    id="firmName"
                    placeholder="Real Estate Pro"
                    value={formData.firmName}
                    onChange={(e) =>
                      setFormData({ ...formData, firmName: e.target.value })
                    }
                    data-testid="input-firm"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Professional Details */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Professional Details</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                </div>

                <div className="space-y-2">
                  <Label htmlFor="yearsOfExperience">Years of Experience *</Label>
                  <Input
                    id="yearsOfExperience"
                    type="number"
                    placeholder="5"
                    value={formData.yearsOfExperience}
                    onChange={(e) =>
                      setFormData({ ...formData, yearsOfExperience: e.target.value })
                    }
                    data-testid="input-experience"
                    required
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
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
              </div>
            </div>

            {/* Office Address */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Office Address</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Street Address *</Label>
                  <Textarea
                    id="address"
                    rows={3}
                    placeholder="Office number, Building, Street"
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    data-testid="textarea-address"
                    required
                  />
                </div>

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
                  </div>

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
                  </div>

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
                  </div>
                </div>
              </div>
            </div>

            {/* Documents */}
            <div>
              <h2 className="font-semibold text-lg mb-4">Verification Documents</h2>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>RERA Certificate *</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-1">Upload RERA certificate</p>
                    <p className="text-xs text-muted-foreground mb-3">PDF, JPG, PNG up to 5MB</p>
                    <Button type="button" variant="outline" size="sm" data-testid="button-upload-rera">
                      Choose File
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Business Card (Optional)</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate active-elevate-2 cursor-pointer">
                    <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                    <p className="text-sm mb-1">Upload business card or visiting card</p>
                    <p className="text-xs text-muted-foreground mb-3">JPG, PNG up to 2MB</p>
                    <Button type="button" variant="outline" size="sm" data-testid="button-upload-card">
                      Choose File
                    </Button>
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
                  I confirm that I hold a valid RERA registration and all information provided is accurate
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
