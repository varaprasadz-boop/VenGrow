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
  Star,
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { PropertyCategory, PropertySubcategory, JvDetailsType } from "@shared/schema";
import { validateEmail, validatePhone, cleanPhone, normalizeEmail } from "@/utils/validation";
import { PhoneInput } from "@/components/ui/location-select";

interface Step1Data {
  categoryId: string;
  subcategoryId: string;
  projectStage: string;
  transactionType: string;
  title: string;
  description: string;
  price: string;
  area: string;
  areaUnit: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  areaInLocality: string;
  nearbyLandmark: string;
  projectSocietyName: string;
  projectId: string;
  pricePerSqft?: string;
  latitude?: string;
  longitude?: string;
}

interface Step2Data {
  isJv?: boolean;
  jvDetails?: JvDetailsType;
  categorySlug?: string;
  bedrooms?: string;
  bathrooms?: string;
  balconies?: string;
  area?: string;
  carpetArea?: string;
  superBuiltUpArea?: string;
  plotArea?: string;
  floorNumber?: string;
  floor?: string;
  totalFloors?: string;
  facing?: string;
  flooring?: string;
  furnishing?: string;
  carParkingCount?: string;
  maintenanceCharges?: string;
  overlookingType?: string;
  totalFlats?: string;
  flatsOnFloor?: string;
  isResale?: string;
  possessionStatus?: string;
  expectedPossessionDate?: string;
  ageOfProperty?: string;
  numberOfLifts?: string;
  amenities?: string[];
  landArea?: string;
  roomSizes?: { room: string; size: string }[];
  isCornerProperty?: string;
  roadWidthFeet?: string;
  totalVillas?: string;
  liftsAvailable?: string;
  plotLength?: string;
  plotBreadth?: string;
  isCornerPlot?: string;
  roadWidthPlotMeters?: string;
  floorAllowedConstruction?: string;
  clubHouseAvailable?: string;
  newProjectFloorPlans?: { superBuiltUpArea: string; carpetArea: string; bhk: string; bathrooms: string; balconies: string; totalPrice: string }[];
  pgSharingPricing?: { type: string; rent: string; deposit: string }[];
  pgFacilities?: string[];
  pgRules?: string[];
  pgServices?: string[];
  pgCctv?: string;
  pgBiometricEntry?: string;
  pgSecurityGuard?: string;
  pgFoodProvided?: string;
  pgNonVegProvided?: string;
  pgNoticePeriod?: string;
}

interface Step3Data {
  photoCount?: number;
  photoNames?: string[];
  photos?: string[];
  youtubeVideoUrl: string;
  virtualTourUrl?: string;
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
  const [requestFeatured, setRequestFeatured] = useState(false);

  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  interface SubscriptionResponse {
    success: boolean;
    subscription: any;
    package: any;
    usage?: {
      featuredUsed: number;
      featuredLimit: number;
    };
  }

  const { data: subscriptionData } = useQuery<SubscriptionResponse>({
    queryKey: ["/api/subscriptions/current"],
    enabled: isAuthenticated,
  });

  const featuredLimit = subscriptionData?.usage?.featuredLimit ?? 0;
  const featuredUsed = subscriptionData?.usage?.featuredUsed ?? 0;
  const featuredRemaining = Math.max(0, featuredLimit - featuredUsed);
  const canRequestFeatured = featuredRemaining > 0;

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

      const savedFeatured = localStorage.getItem("createListingRequestFeatured");
      if (savedFeatured === "true") {
        setRequestFeatured(true);
      }

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

  const getPropertyType = (categoryId: string, subcategoryId: string | null): "apartment" | "villa" | "plot" | "commercial" | "farmhouse" | "penthouse" | "independent_house" | "pg_co_living" | "new_projects" | "joint_venture" => {
    const category = categories.find(c => c.id === categoryId);
    const subcategory = subcategoryId ? allSubcategories.find(s => s.id === subcategoryId) : null;
    
    if (!category) return "apartment";
    
    const categorySlug = category.slug;
    const subcategorySlug = subcategory?.slug || "";
    
    if (subcategorySlug === "penthouse") return "penthouse";
    if (subcategorySlug === "farm-house" || subcategorySlug === "farmhouse") return "farmhouse";
    
    switch (categorySlug) {
      case "apartments":
      case "apartment":
        return "apartment";
      case "villas":
      case "villa":
        return "villa";
      case "plots":
      case "plot":
        return "plot";
      case "commercial":
        return "commercial";
      case "joint-venture":
        return "joint_venture";
      case "independent-house":
      case "independent-houses":
        return "independent_house";
      case "new-projects":
      case "new-project":
        return "new_projects";
      case "pg-hostel":
      case "pg":
      case "hostel":
        return "pg_co_living";
      case "ultra-luxury":
        return "penthouse";
      default:
        return "apartment";
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
      localStorage.removeItem("createListingRequestFeatured");

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

    // Validate email format
    if (!validateEmail(contactData.contactEmail.trim())) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address for contact email.",
        variant: "destructive",
      });
      return;
    }

    // Validate phone format
    if (!validatePhone(contactData.contactPhone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit Indian mobile number starting with 6-9.",
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

    const isJvListing = step2Data.isJv === true && step2Data.jvDetails;

    const parseIntOr = (val: string | undefined | null, fallback: null | number = null) => {
      if (!val) return fallback;
      const n = parseInt(val, 10);
      return isNaN(n) ? fallback : n;
    };

    const propertyData: Record<string, unknown> = {
      title: step1Data.title,
      description: step1Data.description,
      propertyType: getPropertyType(step1Data.categoryId, step1Data.subcategoryId || null),
      transactionType: step1Data.transactionType as "sale" | "rent" | "lease",
      categoryId: step1Data.categoryId,
      subcategoryId: step1Data.subcategoryId,
      projectStage: step1Data.projectStage || null,
      projectId: step1Data.projectId || null,
      price: parseInt(step1Data.price) || 0,
      area: parseInt(step1Data.area) || 0,
      areaUnit: step1Data.areaUnit || "sqft",
      pricePerSqft: parseIntOr(step1Data.pricePerSqft),
      address: step1Data.address || "",
      city: step1Data.city,
      state: step1Data.state,
      pincode: step1Data.pincode,
      locality: step1Data.locality,
      areaInLocality: step1Data.areaInLocality || null,
      nearbyLandmark: step1Data.nearbyLandmark || null,
      projectSocietyName: step1Data.projectSocietyName || null,
      latitude: step1Data.latitude ? parseFloat(step1Data.latitude) : null,
      longitude: step1Data.longitude ? parseFloat(step1Data.longitude) : null,
      youtubeVideoUrl: step3Data.youtubeVideoUrl || null,
      images: step3Data.photoNames || step3Data.photos || [],
      contactName: contactData.contactName.trim(),
      contactPhone: cleanPhone(contactData.contactPhone),
      contactEmail: normalizeEmail(contactData.contactEmail),
      contactWhatsapp: contactData.whatsappNumber || null,
      requestFeatured: requestFeatured,
    };

    if (isJvListing && step2Data.jvDetails) {
      const jv = step2Data.jvDetails;
      const landArea = jv.common?.landArea ? parseInt(String(jv.common.landArea), 10) : undefined;
      propertyData.area = propertyData.area || (!isNaN(landArea as number) ? landArea : 0);
      propertyData.jvDetails = jv;
    } else {
      propertyData.bedrooms = parseIntOr(step2Data.bedrooms);
      propertyData.bathrooms = parseIntOr(step2Data.bathrooms);
      propertyData.balconies = parseIntOr(step2Data.balconies);
      propertyData.superBuiltUpArea = parseIntOr(step2Data.superBuiltUpArea);
      propertyData.carpetArea = parseIntOr(step2Data.carpetArea);
      propertyData.floor = parseIntOr(step2Data.floorNumber || step2Data.floor);
      propertyData.totalFloors = parseIntOr(step2Data.totalFloors);
      propertyData.facing = step2Data.facing || null;
      propertyData.flooring = step2Data.flooring || null;
      propertyData.furnishing = step2Data.furnishing || null;
      propertyData.carParkingCount = parseIntOr(step2Data.carParkingCount);
      propertyData.maintenanceCharges = parseIntOr(step2Data.maintenanceCharges);
      propertyData.overlookingType = step2Data.overlookingType || null;
      propertyData.totalFlats = parseIntOr(step2Data.totalFlats);
      propertyData.flatsOnFloor = parseIntOr(step2Data.flatsOnFloor);
      propertyData.isResale = step2Data.isResale === "resale" ? true : step2Data.isResale === "new" ? false : null;
      propertyData.possessionStatus = step2Data.possessionStatus || null;
      propertyData.ageOfProperty = parseIntOr(step2Data.ageOfProperty);
      propertyData.numberOfLifts = parseIntOr(step2Data.numberOfLifts);
      propertyData.amenities = step2Data.amenities || [];
      propertyData.landArea = parseIntOr(step2Data.landArea);
      propertyData.roomSizes = step2Data.roomSizes || null;
      propertyData.isCornerProperty = step2Data.isCornerProperty === "yes" ? true : step2Data.isCornerProperty === "no" ? false : null;
      propertyData.roadWidthFeet = parseIntOr(step2Data.roadWidthFeet);
      propertyData.totalVillas = parseIntOr(step2Data.totalVillas);
      propertyData.liftsAvailable = step2Data.liftsAvailable === "yes" ? true : step2Data.liftsAvailable === "no" ? false : null;
      propertyData.plotLength = parseIntOr(step2Data.plotLength);
      propertyData.plotBreadth = parseIntOr(step2Data.plotBreadth);
      propertyData.isCornerPlot = step2Data.isCornerPlot === "yes" ? true : step2Data.isCornerPlot === "no" ? false : null;
      propertyData.roadWidthPlotMeters = parseIntOr(step2Data.roadWidthPlotMeters);
      propertyData.floorAllowedConstruction = parseIntOr(step2Data.floorAllowedConstruction);
      propertyData.clubHouseAvailable = step2Data.clubHouseAvailable === "yes" ? true : step2Data.clubHouseAvailable === "no" ? false : null;
      if (step2Data.newProjectFloorPlans && step2Data.newProjectFloorPlans.length > 0) {
        propertyData.newProjectFloorPlans = step2Data.newProjectFloorPlans.map(fp => ({
          superBuiltUpArea: parseIntOr(fp.superBuiltUpArea, 0),
          carpetArea: parseIntOr(fp.carpetArea, 0),
          bhk: parseIntOr(fp.bhk, 0),
          bathrooms: parseIntOr(fp.bathrooms, 0),
          balconies: parseIntOr(fp.balconies, 0),
          totalPrice: parseIntOr(fp.totalPrice, 0),
        }));
      }
      if (step2Data.pgSharingPricing) {
        const pricingWithValues = step2Data.pgSharingPricing.filter(p => p.rent || p.deposit);
        if (pricingWithValues.length > 0) {
          propertyData.pgSharingPricing = pricingWithValues.map(p => ({
            type: p.type,
            rent: parseIntOr(p.rent, 0) as number,
            deposit: parseIntOr(p.deposit, 0) as number,
          }));
        }
      }
      propertyData.pgFacilities = step2Data.pgFacilities || null;
      propertyData.pgRules = step2Data.pgRules || null;
      propertyData.pgServices = step2Data.pgServices || null;
      propertyData.pgCctv = step2Data.pgCctv === "yes" ? true : step2Data.pgCctv === "no" ? false : null;
      propertyData.pgBiometricEntry = step2Data.pgBiometricEntry === "yes" ? true : step2Data.pgBiometricEntry === "no" ? false : null;
      propertyData.pgSecurityGuard = step2Data.pgSecurityGuard === "yes" ? true : step2Data.pgSecurityGuard === "no" ? false : null;
      propertyData.pgFoodProvided = step2Data.pgFoodProvided === "yes" ? true : step2Data.pgFoodProvided === "no" ? false : null;
      propertyData.pgNonVegProvided = step2Data.pgNonVegProvided === "yes" ? true : step2Data.pgNonVegProvided === "no" ? false : null;
      propertyData.pgNoticePeriod = step2Data.pgNoticePeriod || null;
    }

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
                    <PhoneInput
                      value={cleanPhone(contactData.contactPhone)}
                      onValueChange={(v) => setContactData({ ...contactData, contactPhone: v })}
                      data-testid="input-contact-phone"
                    />
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

                  {canRequestFeatured && (
                    <>
                      <Separator />
                      <div className="space-y-3">
                        <div className="flex items-start space-x-3">
                          <Checkbox
                            id="requestFeatured"
                            checked={requestFeatured}
                            onCheckedChange={(checked) => {
                              const val = checked === true;
                              setRequestFeatured(val);
                              localStorage.setItem("createListingRequestFeatured", val ? "true" : "false");
                            }}
                            data-testid="checkbox-request-featured"
                          />
                          <div className="space-y-1">
                            <Label
                              htmlFor="requestFeatured"
                              className="text-sm font-medium cursor-pointer flex items-center gap-2"
                            >
                              <Star className="h-4 w-4 text-amber-500" />
                              Add to Featured Listings
                            </Label>
                            <p className="text-xs text-muted-foreground">
                              Your listing will be highlighted in the Featured section after admin approval.
                              You have {featuredRemaining} of {featuredLimit} featured slot{featuredLimit !== 1 ? "s" : ""} remaining.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

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
                    {(step3Data.photoCount || step3Data.photos?.length || 0) > 0 ? (
                      <span className="text-sm text-muted-foreground">
                        {step3Data.photoCount || step3Data.photos?.length || 0} Photo(s) Uploaded
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
                      {step2Data.isJv && step2Data.jvDetails && (
                        <Badge variant="secondary" className="text-xs">Joint Venture</Badge>
                      )}
                      {!step2Data.isJv && step2Data.possessionStatus && (
                        <Badge variant="outline" className="text-xs" data-testid="badge-possession">
                          {step2Data.possessionStatus}
                        </Badge>
                      )}
                      {!step2Data.isJv && step2Data.furnishing && (
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
                    {step1Data.latitude && step1Data.longitude && (
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-3" data-testid="text-coordinates">
                        <span>Map: {parseFloat(step1Data.latitude).toFixed(6)}, {parseFloat(step1Data.longitude).toFixed(6)}</span>
                      </div>
                    )}
                    <p className="text-2xl font-bold font-serif text-primary mb-4" data-testid="preview-price">
                      {formatPrice(step1Data.price)}
                      {(step1Data.transactionType === "rent" || step1Data.transactionType === "lease") && (
                        <span className="text-lg font-normal">/month</span>
                      )}
                    </p>
                  </div>

                  <Separator />

                  {step2Data.isJv && step2Data.jvDetails ? (
                    <div className="space-y-3">
                      <p className="text-sm font-medium">Joint Venture</p>
                      <div className="text-sm space-y-1">
                        <p><span className="text-muted-foreground">Type:</span> {step2Data.jvDetails.jvType === "revenue_share" ? "Revenue Share" : step2Data.jvDetails.jvType === "built_up_share" ? "Built-up Share" : "—"}</p>
                        <p><span className="text-muted-foreground">Landowner:</span> {step2Data.jvDetails.landownerExpectationPercent != null ? `${step2Data.jvDetails.landownerExpectationPercent}%` : "—"}</p>
                        <p><span className="text-muted-foreground">Developer:</span> {step2Data.jvDetails.developerExpectationPercent != null ? `${step2Data.jvDetails.developerExpectationPercent}%` : "—"}</p>
                        <p><span className="text-muted-foreground">Development:</span> {step2Data.jvDetails.developmentType?.replace(/_/g, " ") ?? "—"}</p>
                        {step2Data.jvDetails.common?.landArea && (
                          <p><span className="text-muted-foreground">Land area:</span> {step2Data.jvDetails.common.landArea}</p>
                        )}
                        {step2Data.jvDetails.common?.locality && (
                          <p><span className="text-muted-foreground">Locality:</span> {step2Data.jvDetails.common.locality}</p>
                        )}
                      </div>
                    </div>
                  ) : (
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
                    {(step1Data.area || step2Data.carpetArea || step2Data.superBuiltUpArea) && (
                      <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                        <Maximize className="h-4 w-4 text-muted-foreground mb-1" />
                        <span className="font-medium">{step1Data.area || step2Data.carpetArea || step2Data.superBuiltUpArea}</span>
                        <span className="text-xs text-muted-foreground">{step1Data.areaUnit || "sqft"}</span>
                      </div>
                    )}
                  </div>
                  )}

                  {!step2Data.isJv && (
                    <div className="space-y-2 text-sm">
                      {step1Data.projectSocietyName && (
                        <p><span className="text-muted-foreground">Project:</span> {step1Data.projectSocietyName}</p>
                      )}
                      {step1Data.pricePerSqft && (
                        <p><span className="text-muted-foreground">Per sqft:</span> Rs. {parseInt(step1Data.pricePerSqft).toLocaleString("en-IN")}</p>
                      )}
                      {step2Data.facing && (
                        <p><span className="text-muted-foreground">Facing:</span> {step2Data.facing}</p>
                      )}
                      {step2Data.furnishing && (
                        <p><span className="text-muted-foreground">Furnishing:</span> {step2Data.furnishing}</p>
                      )}
                      {step2Data.possessionStatus && (
                        <p><span className="text-muted-foreground">Possession:</span> {step2Data.possessionStatus}</p>
                      )}
                      {step2Data.plotLength && step2Data.plotBreadth && (
                        <p><span className="text-muted-foreground">Plot:</span> {step2Data.plotLength} x {step2Data.plotBreadth} ft</p>
                      )}
                      {step2Data.landArea && (
                        <p><span className="text-muted-foreground">Land Area:</span> {step2Data.landArea} sq ft</p>
                      )}
                    </div>
                  )}

                  {!step2Data.isJv && step2Data.amenities && step2Data.amenities.length > 0 && (
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

                  {!step2Data.isJv && step2Data.pgFacilities && step2Data.pgFacilities.length > 0 && (
                    <div>
                      <p className="text-sm font-medium mb-2">PG Facilities:</p>
                      <div className="grid grid-cols-2 gap-2">
                        {step2Data.pgFacilities.slice(0, 6).map((facility, index) => (
                          <div key={index} className="flex items-center gap-2 text-xs">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            <span>{facility}</span>
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
