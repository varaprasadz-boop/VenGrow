import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle,
  Phone,
  Mail,
  Loader2,
  AlertCircle,
  Building2,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PropertyCategory, PropertySubcategory } from "@shared/schema";

interface Step1Data {
  categoryId: string;
  subcategoryId: string;
  projectStage: string;
  transactionType: string;
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  projectId: string;
}

interface Step2Data {
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  area: string;
  floor: string;
  totalFloors: string;
  facing: string;
  furnishing: string;
  possessionStatus: string;
  ageOfProperty: string;
  amenities: string[];
}

interface Step3Data {
  photos: string[];
  youtubeVideoUrl: string;
}

export default function CreateListingStep4Page() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [step1Data, setStep1Data] = useState<Step1Data | null>(null);
  const [step2Data, setStep2Data] = useState<Step2Data | null>(null);
  const [step3Data, setStep3Data] = useState<Step3Data | null>(null);
  const [dataLoaded, setDataLoaded] = useState(false);

  const [contactData, setContactData] = useState({
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    whatsappNumber: "",
  });

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [verifiedInfo, setVerifiedInfo] = useState(false);

  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const { data: allSubcategories = [] } = useQuery<PropertySubcategory[]>({
    queryKey: ["/api/property-subcategories"],
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to continue.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    try {
      const saved1 = localStorage.getItem("createListingStep1");
      const saved2 = localStorage.getItem("createListingStep2");
      const saved3 = localStorage.getItem("createListingStep3");

      if (!saved1 || !saved2 || !saved3) {
        toast({
          title: "Missing Data",
          description: "Please complete all previous steps first.",
          variant: "destructive",
        });
        navigate("/seller/listings/create/step1");
        return;
      }

      setStep1Data(JSON.parse(saved1));
      setStep2Data(JSON.parse(saved2));
      setStep3Data(JSON.parse(saved3));
      setDataLoaded(true);

      if (user) {
        setContactData({
          contactName: user.name || "",
          contactPhone: user.phone || "",
          contactEmail: user.email || "",
          whatsappNumber: "",
        });
      }
    } catch (error) {
      console.error("Error loading listing data:", error);
      toast({
        title: "Error",
        description: "Failed to load listing data. Please start over.",
        variant: "destructive",
      });
      navigate("/seller/listings/create/step1");
    }
  }, [authLoading, isAuthenticated, user, navigate, toast]);

  const getCategoryName = (id: string) => {
    const category = categories.find(c => c.id === id);
    return category?.name || "Unknown";
  };

  const getSubcategoryName = (id: string) => {
    const subcategory = allSubcategories.find(s => s.id === id);
    return subcategory?.name || "Unknown";
  };

  // Map category and subcategory to property type enum value
  const getPropertyType = (categoryId: string, subcategoryId: string | null): "apartment" | "villa" | "plot" | "commercial" | "farmhouse" | "penthouse" => {
    const category = categories.find(c => c.id === categoryId);
    const subcategory = subcategoryId ? allSubcategories.find(s => s.id === subcategoryId) : null;
    
    if (!category) return "apartment"; // Default fallback
    
    const categorySlug = category.slug;
    const subcategorySlug = subcategory?.slug || "";
    
    // Check subcategory first for special cases
    if (subcategorySlug === "penthouse") {
      return "penthouse";
    }
    if (subcategorySlug === "farm-house" || subcategorySlug === "farmhouse") {
      return "farmhouse";
    }
    
    // Map based on category slug
    switch (categorySlug) {
      case "apartments":
        return "apartment";
      case "villas":
        return "villa";
      case "plots":
        return "plot";
      case "commercial":
        return "commercial";
      case "independent-house":
        return "villa"; // Independent house maps to villa
      case "new-projects":
        return "apartment"; // New projects default to apartment
      case "ultra-luxury":
        return "penthouse"; // Ultra luxury defaults to penthouse
      default:
        return "apartment"; // Default fallback
    }
  };

  const formatPrice = (price: string) => {
    const num = parseInt(price);
    if (isNaN(num)) return "₹ --";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  const createListingMutation = useMutation({
    mutationFn: async (data: any) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: (data) => {
      localStorage.removeItem("createListingStep1");
      localStorage.removeItem("createListingStep2");
      localStorage.removeItem("createListingStep3");

      queryClient.invalidateQueries({ queryKey: ["/api/seller/properties"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/current"] });
      queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/can-create-listing"] });

      toast({
        title: "Listing Submitted",
        description: "Your property has been submitted for review. You'll be notified once approved.",
      });

      navigate("/seller/dashboard");
    },
    onError: (error: any) => {
      console.error("Error creating listing:", error);
      toast({
        title: "Submission Failed",
        description: error.message || "Failed to create listing. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!termsAccepted || !verifiedInfo) {
      toast({
        title: "Please Accept Terms",
        description: "You must verify the information and accept the terms to continue.",
        variant: "destructive",
      });
      return;
    }

    if (!contactData.contactName || !contactData.contactPhone || !contactData.contactEmail) {
      toast({
        title: "Contact Required",
        description: "Please fill in all required contact fields.",
        variant: "destructive",
      });
      return;
    }

    if (!step1Data || !step2Data || !step3Data) {
      toast({
        title: "Error",
        description: "Missing listing data. Please start over.",
        variant: "destructive",
      });
      return;
    }

    const propertyData = {
      title: step1Data.title,
      description: step1Data.description,
      propertyType: getPropertyType(step1Data.categoryId, step1Data.subcategoryId || null),
      transactionType: step1Data.transactionType as "sale" | "rent" | "lease",
      categoryId: step1Data.categoryId,
      subcategoryId: step1Data.subcategoryId,
      projectStage: step1Data.projectStage || null,
      projectId: step1Data.projectId || null,
      price: parseInt(step1Data.price) || 0,
      area: parseInt(step2Data.area) || 0,
      bedrooms: step2Data.bedrooms ? parseInt(step2Data.bedrooms) : null,
      bathrooms: step2Data.bathrooms ? parseInt(step2Data.bathrooms) : null,
      balconies: step2Data.balconies ? parseInt(step2Data.balconies) : null,
      floor: step2Data.floor ? parseInt(step2Data.floor) : null,
      totalFloors: step2Data.totalFloors ? parseInt(step2Data.totalFloors) : null,
      facing: step2Data.facing || null,
      furnishing: step2Data.furnishing || null,
      ageOfProperty: step2Data.ageOfProperty ? parseInt(step2Data.ageOfProperty) : null,
      possessionStatus: step2Data.possessionStatus || null,
      amenities: step2Data.amenities || [],
      address: step1Data.address,
      city: step1Data.city,
      state: step1Data.state,
      pincode: step1Data.pincode,
      locality: step1Data.locality,
      youtubeVideoUrl: step3Data.youtubeVideoUrl || null,
      images: step3Data.photos || [],
      contactName: contactData.contactName,
      contactPhone: contactData.contactPhone,
      contactEmail: contactData.contactEmail,
      contactWhatsapp: contactData.whatsappNumber || null,
    };

    createListingMutation.mutate(propertyData);
  };

  if (authLoading || !dataLoaded) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!step1Data || !step2Data || !step3Data) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <Card className="p-8 text-center max-w-md">
          <AlertCircle className="h-16 w-16 text-destructive mx-auto mb-4" />
          <h2 className="text-xl font-bold mb-2">Missing Data</h2>
          <p className="text-muted-foreground mb-4">
            Please complete all previous steps before accessing this page.
          </p>
          <Link href="/seller/listings/create/step1">
            <Button>Start Over</Button>
          </Link>
        </Card>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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
              Step 4 of 4: Contact Details & Review
            </p>
          </div>

          {createListingMutation.isError && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to submit listing. Please check your information and try again.
              </AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-8">
                <h2 className="font-serif font-bold text-2xl mb-6">
                  Contact Information
                </h2>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="contactName">Contact Name *</Label>
                    <Input
                      id="contactName"
                      placeholder="Your name"
                      value={contactData.contactName}
                      onChange={(e) => setContactData({ ...contactData, contactName: e.target.value })}
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
                        value={contactData.contactPhone}
                        onChange={(e) => setContactData({ ...contactData, contactPhone: e.target.value })}
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
                      value={contactData.contactEmail}
                      onChange={(e) => setContactData({ ...contactData, contactEmail: e.target.value })}
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
                        value={contactData.whatsappNumber}
                        onChange={(e) => setContactData({ ...contactData, whatsappNumber: e.target.value })}
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
                      <Checkbox 
                        id="verified" 
                        checked={verifiedInfo}
                        onCheckedChange={(checked) => setVerifiedInfo(checked === true)}
                        data-testid="checkbox-verified" 
                      />
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
                      <Checkbox 
                        id="terms" 
                        checked={termsAccepted}
                        onCheckedChange={(checked) => setTermsAccepted(checked === true)}
                        data-testid="checkbox-terms" 
                      />
                      <div className="space-y-1">
                        <Label
                          htmlFor="terms"
                          className="text-sm font-normal cursor-pointer"
                        >
                          I agree to the{" "}
                          <Link href="/terms">
                            <span className="text-primary hover:underline">
                              Terms & Conditions
                            </span>
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy">
                            <span className="text-primary hover:underline">
                              Privacy Policy
                            </span>
                          </Link>
                        </Label>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>

              <div className="flex gap-3">
                <Link href="/seller/listings/create/step3" className="flex-1">
                  <Button variant="outline" className="w-full" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Button 
                  className="flex-1" 
                  size="lg" 
                  onClick={handleSubmit}
                  disabled={createListingMutation.isPending || !termsAccepted || !verifiedInfo}
                  data-testid="button-submit"
                >
                  {createListingMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    "Submit for Review"
                  )}
                </Button>
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Property Preview</h3>

                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    {step3Data.photos.length > 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {step3Data.photos.length} Photo(s) Uploaded
                      </span>
                    ) : (
                      <Building2 className="h-12 w-12 text-muted-foreground" />
                    )}
                  </div>

                  <div>
                    <div className="flex flex-wrap items-start gap-2 mb-2">
                      <h4 className="font-semibold line-clamp-2 flex-1" data-testid="preview-title">
                        {step1Data.title}
                      </h4>
                      <Badge data-testid="badge-transaction-type">
                        {step1Data.transactionType === "sale" ? "For Sale" : 
                         step1Data.transactionType === "lease" ? "For Lease" : "For Rent"}
                      </Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      {step1Data.locality && (
                        <Badge variant="secondary" className="text-xs" data-testid="badge-locality">
                          {step1Data.locality}
                        </Badge>
                      )}
                      {step2Data.possessionStatus && (
                        <Badge variant="outline" className="text-xs" data-testid="badge-possession">
                          {step2Data.possessionStatus}
                        </Badge>
                      )}
                      {step2Data.furnishing && (
                        <Badge variant="outline" className="text-xs" data-testid="badge-furnishing">
                          {step2Data.furnishing}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                      <MapPin className="h-4 w-4" />
                      <span className="line-clamp-1">
                        {[step1Data.locality, step1Data.city, step1Data.state].filter(Boolean).join(", ")}
                      </span>
                    </div>
                    <p className="text-2xl font-bold font-serif text-primary mb-4" data-testid="preview-price">
                      {formatPrice(step1Data.price)}
                      {(step1Data.transactionType === "rent" || step1Data.transactionType === "lease") && (
                        <span className="text-lg font-normal">/month</span>
                      )}
                    </p>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-3 gap-3 text-sm">
                    {step2Data.bedrooms && (
                      <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                        <Bed className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="font-medium">{step2Data.bedrooms}</span>
                        <span className="text-xs text-muted-foreground">Beds</span>
                      </div>
                    )}
                    {step2Data.bathrooms && (
                      <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                        <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="font-medium">{step2Data.bathrooms}</span>
                        <span className="text-xs text-muted-foreground">Baths</span>
                      </div>
                    )}
                    {step2Data.area && (
                      <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                        <Maximize className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="font-medium">{step2Data.area}</span>
                        <span className="text-xs text-muted-foreground">sqft</span>
                      </div>
                    )}
                  </div>

                  {step2Data.amenities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">Key Features:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {step2Data.amenities.slice(0, 6).map((amenity, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{amenity}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Contact:</p>
                    <div className="space-y-2 text-sm">
                      {contactData.contactPhone && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>+91 {contactData.contactPhone}</span>
                        </div>
                      )}
                      {contactData.contactEmail && (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{contactData.contactEmail}</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
    </main>
  );
}
