import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle,
  Phone,
  Mail,
} from "lucide-react";

export default function CreateListingStep4Page() {
  const propertyData = {
    title: "Luxury 3BHK Apartment in Prime Location",
    location: "Bandra West, Mumbai, Maharashtra",
    price: "₹85 L",
    type: "Apartment",
    bedrooms: 3,
    bathrooms: 2,
    area: 1200,
    features: ["Swimming Pool", "Gym", "Garden", "Security"],
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>
            <p className="text-sm text-muted-foreground">
              Step 4 of 4: Contact Details & Preview
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contact Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8">
                <h2 className="font-serif font-bold text-2xl mb-6">
                  Contact Information
                </h2>

                <form className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      placeholder="Your name"
                      defaultValue="Prestige Estates"
                      data-testid="input-contact-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactPhone">Contact Phone *</Label>
                    <div className="flex gap-2">
                      <Input
                        className="w-24"
                        defaultValue="+91"
                        disabled
                      />
                      <Input
                        id="contactPhone"
                        placeholder="98765 43210"
                        defaultValue="98765 43210"
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactEmail">Contact Email *</Label>
                    <Input
                      id="contactEmail"
                      type="email"
                      placeholder="your@email.com"
                      defaultValue="contact@prestige.com"
                      data-testid="input-contact-email"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="whatsapp">WhatsApp Number (Optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        className="w-24"
                        defaultValue="+91"
                        disabled
                      />
                      <Input
                        id="whatsapp"
                        placeholder="98765 43210"
                        data-testid="input-whatsapp"
                      />
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Buyers can contact you directly on WhatsApp
                    </p>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <Checkbox id="verified" data-testid="checkbox-verified" />
                      <div className="space-y-1">
                        <Label
                          htmlFor="verified"
                          className="text-sm font-normal cursor-pointer"
                        >
                          I verify that all the information provided is accurate and true
                        </Label>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <Checkbox id="terms" data-testid="checkbox-terms" />
                      <div className="space-y-1">
                        <Label
                          htmlFor="terms"
                          className="text-sm font-normal cursor-pointer"
                        >
                          I agree to the{" "}
                          <Link href="/terms">
                            <a className="text-primary hover:underline">
                              Terms & Conditions
                            </a>
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy">
                            <a className="text-primary hover:underline">
                              Privacy Policy
                            </a>
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </div>
                </form>
              </Card>

              {/* Navigation */}
              <div className="flex gap-3">
                <Link href="/seller/create-listing/step3" className="flex-1">
                  <Button variant="outline" className="w-full" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Button className="flex-1" size="lg" data-testid="button-submit">
                  Submit for Review
                </Button>
              </div>
            </div>

            {/* Preview */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Property Preview</h3>

                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Cover Photo</span>
                  </div>

                  <div>
                    <div className="flex items-start gap-2 mb-2">
                      <h4 className="font-semibold line-clamp-2">
                        {propertyData.title}
                      </h4>
                      <Badge>For Sale</Badge>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">{propertyData.location}</span>
                    </div>
                    <p className="text-2xl font-bold font-serif text-primary mb-4">
                      {propertyData.price}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                      <Bed className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{propertyData.bedrooms}</span>
                      <span className="text-xs text-muted-foreground">Beds</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                      <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{propertyData.bathrooms}</span>
                      <span className="text-xs text-muted-foreground">Baths</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                      <Maximize className="h-4 w-4 text-muted-foreground mb-1" />
                      <span className="font-medium">{propertyData.area}</span>
                      <span className="text-xs text-muted-foreground">sqft</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-sm font-medium mb-2">Key Features:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {propertyData.features.map((feature, index) => (
                        <div key={index} className="flex items-center gap-2 text-xs">
                          <CheckCircle className="h-3 w-3 text-green-600" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Contact:</p>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Phone className="h-4 w-4" />
                        <span>+91 98765 43210</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Mail className="h-4 w-4" />
                        <span className="truncate">contact@prestige.com</span>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
