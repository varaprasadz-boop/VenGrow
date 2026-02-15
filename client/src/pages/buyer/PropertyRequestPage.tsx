import { useState } from "react";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, MapPin, Home, DollarSign } from "lucide-react";

export default function PropertyRequestPage() {
  const [formData, setFormData] = useState({
    propertyType: "",
    location: "",
    budget: "",
    bedrooms: "",
    requirements: "",
    contactName: "",
    contactEmail: "",
    contactPhone: "",
  });

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Request a Property
            </h1>
            <p className="text-muted-foreground">
              Can't find what you're looking for? Tell us what you need
            </p>
          </div>

          <Card className="p-8">
            <form className="space-y-6">
              {/* Property Details */}
              <div>
                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                  <Search className="h-5 w-5 text-primary" />
                  Property Requirements
                </h3>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="property-type">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) =>
                        setFormData({ ...formData, propertyType: value })
                      }
                    >
                      <SelectTrigger id="property-type" data-testid="select-type">
                        <SelectValue placeholder="Select property type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="house">Independent House</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Preferred Location *</Label>
                    <Input
                      id="location"
                      placeholder="e.g., Bandra West, Mumbai"
                      value={formData.location}
                      onChange={(e) =>
                        setFormData({ ...formData, location: e.target.value })
                      }
                      data-testid="input-location"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="budget">Budget (₹ Lakhs) *</Label>
                      <Input
                        id="budget"
                        type="number"
                        placeholder="e.g., 50"
                        value={formData.budget}
                        onChange={(e) =>
                          setFormData({ ...formData, budget: e.target.value })
                        }
                        data-testid="input-budget"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <Select
                        value={formData.bedrooms}
                        onValueChange={(value) =>
                          setFormData({ ...formData, bedrooms: value })
                        }
                      >
                        <SelectTrigger id="bedrooms" data-testid="select-bedrooms">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1">1 BHK</SelectItem>
                          <SelectItem value="2">2 BHK</SelectItem>
                          <SelectItem value="3">3 BHK</SelectItem>
                          <SelectItem value="4">4+ BHK</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="requirements">
                      Additional Requirements (Optional)
                    </Label>
                    <Textarea
                      id="requirements"
                      rows={4}
                      placeholder="Describe any specific requirements, amenities, or preferences..."
                      value={formData.requirements}
                      onChange={(e) =>
                        setFormData({ ...formData, requirements: e.target.value })
                      }
                      data-testid="textarea-requirements"
                    />
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div className="pt-6 border-t">
                <h3 className="font-semibold text-lg mb-6">Contact Information</h3>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="contact-name">Full Name *</Label>
                    <Input
                      id="contact-name"
                      placeholder="Your name"
                      value={formData.contactName}
                      onChange={(e) =>
                        setFormData({ ...formData, contactName: e.target.value })
                      }
                      data-testid="input-name"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="contact-email">Email *</Label>
                      <Input
                        id="contact-email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.contactEmail}
                        onChange={(e) =>
                          setFormData({ ...formData, contactEmail: e.target.value })
                        }
                        data-testid="input-email"
                      />
                    </div>

                    <div>
                      <Label htmlFor="contact-phone">Phone *</Label>
                      <Input
                        id="contact-phone"
                        type="tel"
                        placeholder="+91 XXXXX XXXXX"
                        value={formData.contactPhone}
                        onChange={(e) =>
                          setFormData({ ...formData, contactPhone: e.target.value })
                        }
                        data-testid="input-phone"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Button className="w-full" size="lg" data-testid="button-submit">
                Submit Request
              </Button>
            </form>
          </Card>

          {/* Info */}
          <Card className="p-6 mt-8 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
            <h3 className="font-semibold mb-2">What Happens Next?</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>Our team will review your request within 24 hours</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>We'll match your requirements with available properties</span>
              </li>
              <li className="flex gap-2">
                <span className="text-primary">•</span>
                <span>You'll receive personalized recommendations via email</span>
              </li>
            </ul>
          </Card>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
