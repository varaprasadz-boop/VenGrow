import { useState, useEffect, lazy, Suspense, useCallback, useMemo } from "react";
import { useLocation } from "wouter";
import { useQuery, useMutation } from "@tanstack/react-query";

import { Card } from "@/components/ui/card";
import { ObjectUploader } from "@/components/ObjectUploader";
import { useAuth } from "@/hooks/useAuth";

const LocationPicker = lazy(() => import("@/components/LocationPicker"));
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import type { UploadResult } from "@uppy/core";
import type { Project } from "@shared/schema";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  ArrowLeft,
  Upload,
  X,
  Image as ImageIcon,
  MapPin,
  Bed,
  Bath,
  Maximize,
  CheckCircle,
  Phone,
  Mail,
  AlertCircle,
  Home,
  Loader2,
  Save,
  Building2,
} from "lucide-react";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

interface PropertyFormData {
  propertyType: string;
  transactionType: string;
  title: string;
  description: string;
  price: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  locality: string;
  latitude: string;
  longitude: string;
  bedrooms: string;
  bathrooms: string;
  balconies: string;
  floor: string;
  totalFloors: string;
  area: string;
  facing: string;
  furnishing: string;
  ageOfProperty: string;
  possessionStatus: string;
  amenities: string[];
  highlights: string[];
  photos: { url: string; caption: string; isPrimary: boolean }[];
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  agreedToTerms: boolean;
  verifiedInfo: boolean;
  projectId: string;
}

const STEPS = [
  { id: 1, title: "Basic Info", description: "Property type & location" },
  { id: 2, title: "Details", description: "Rooms & specifications" },
  { id: 3, title: "Photos", description: "Upload images" },
  { id: 4, title: "Review", description: "Contact & submit" },
];

const AMENITIES_LIST = [
  "Swimming Pool",
  "Gym",
  "Garden",
  "Power Backup",
  "Lift",
  "24/7 Security",
  "Children's Play Area",
  "Club House",
  "Intercom",
  "Gas Pipeline",
  "Park",
  "Water Storage",
  "CCTV Surveillance",
  "Covered Parking",
  "Visitor Parking",
  "Fire Safety",
  "Rainwater Harvesting",
  "Solar Panels",
  "WiFi Connectivity",
  "Indoor Games",
];

const HIGHLIGHTS_LIST = [
  "Corner Property",
  "Sea View",
  "Garden View",
  "Near Metro",
  "Near School",
  "Near Hospital",
  "Near Market",
  "Gated Community",
  "Well Ventilated",
  "Vastu Compliant",
  "Prime Location",
  "Near IT Hub",
];

const INDIAN_STATES = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand", "Karnataka",
  "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur", "Meghalaya", "Mizoram",
  "Nagaland", "Odisha", "Punjab", "Rajasthan", "Sikkim", "Tamil Nadu",
  "Telangana", "Tripura", "Uttar Pradesh", "Uttarakhand", "West Bengal",
  "Delhi", "Chandigarh", "Puducherry"
];

export default function CreatePropertyPage() {
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { user } = useAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<PropertyFormData>({
    propertyType: "",
    transactionType: "",
    title: "",
    description: "",
    price: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    locality: "",
    latitude: "",
    longitude: "",
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floor: "",
    totalFloors: "",
    area: "",
    facing: "",
    furnishing: "",
    ageOfProperty: "",
    possessionStatus: "",
    amenities: [],
    highlights: [],
    photos: [],
    contactName: "",
    contactPhone: "",
    contactEmail: "",
    agreedToTerms: false,
    verifiedInfo: false,
    projectId: "",
  });

  const { data: canCreateData, isLoading: checkingLimit } = useQuery<{
    canCreate: boolean;
    reason?: string;
  }>({
    queryKey: ["/api/subscriptions/can-create-listing"],
  });

  const canHaveProjects = user?.sellerType && ["builder", "broker"].includes(user.sellerType);

  const { data: sellerProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/projects/my-projects"],
    enabled: canHaveProjects,
  });

  const liveProjects = useMemo(() => {
    return sellerProjects.filter(p => p.status === "live");
  }, [sellerProjects]);

  const { data: subscriptionData, isLoading: loadingSubscription } = useQuery<{
    subscription?: { id: string; listingsUsed: number };
    package?: { name: string; listingLimit: number };
  }>({
    queryKey: ["/api/subscriptions/current"],
  });

  const { data: authData } = useQuery<{
    user?: {
      id: string;
      firstName?: string;
      lastName?: string;
      username?: string;
      email?: string;
      phone?: string;
    };
  }>({
    queryKey: ["/api/auth/me"],
  });

  useEffect(() => {
    const user = authData?.user;
    if (user) {
      setFormData(prev => ({
        ...prev,
        contactName: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.username || "",
        contactPhone: user.phone || "",
        contactEmail: user.email || "",
      }));
    }
  }, [authData]);

  const createPropertyMutation = useMutation({
    mutationFn: async (data: Record<string, unknown>) => {
      const response = await apiRequest("POST", "/api/properties", data);
      return response.json();
    },
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/can-create-listing"] });
        queryClient.invalidateQueries({ queryKey: ["/api/subscriptions/current"] });
        queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
        toast({
          title: "Property Created",
          description: "Your property listing has been saved as draft. Submit it for review when ready.",
        });
        navigate(`/seller/properties/${result.property.id}`);
      } else {
        throw new Error(result.message || "Failed to create property");
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const updateField = (field: keyof PropertyFormData, value: string | string[] | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: "amenities" | "highlights", item: string) => {
    const current = formData[field];
    const updated = current.includes(item)
      ? current.filter(i => i !== item)
      : [...current, item];
    updateField(field, updated);
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(
          formData.propertyType &&
          formData.transactionType &&
          formData.title &&
          formData.price &&
          formData.address &&
          formData.city &&
          formData.state
        );
      case 2:
        return !!(
          formData.area &&
          (formData.propertyType === "plot" || (formData.bedrooms && formData.bathrooms))
        );
      case 3:
        return true;
      case 4:
        return !!(
          formData.contactName &&
          formData.contactPhone &&
          formData.contactEmail &&
          formData.agreedToTerms &&
          formData.verifiedInfo
        );
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, 4));
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields before proceeding.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSubmit = async () => {
    if (!validateStep(4)) {
      toast({
        title: "Missing Information",
        description: "Please complete all required fields and agreements.",
        variant: "destructive",
      });
      return;
    }

    const propertyData = {
      title: formData.title,
      description: formData.description,
      propertyType: formData.propertyType,
      transactionType: formData.transactionType,
      price: parseInt(formData.price) || 0,
      pricePerSqft: formData.area ? Math.round(parseInt(formData.price) / parseInt(formData.area)) : null,
      area: parseInt(formData.area) || 0,
      bedrooms: parseInt(formData.bedrooms) || null,
      bathrooms: parseInt(formData.bathrooms) || null,
      balconies: parseInt(formData.balconies) || null,
      floor: parseInt(formData.floor) || null,
      totalFloors: parseInt(formData.totalFloors) || null,
      facing: formData.facing || null,
      furnishing: formData.furnishing || null,
      ageOfProperty: parseInt(formData.ageOfProperty) || null,
      possessionStatus: formData.possessionStatus || null,
      address: formData.address,
      locality: formData.locality || null,
      city: formData.city,
      state: formData.state,
      pincode: formData.pincode || null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      amenities: formData.amenities,
      highlights: formData.highlights,
      projectId: formData.projectId || null,
    };

    createPropertyMutation.mutate(propertyData);
  };

  const formatPrice = (price: string): string => {
    const num = parseInt(price);
    if (isNaN(num)) return "₹0";
    if (num >= 10000000) return `₹${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹${(num / 100000).toFixed(2)} L`;
    return `₹${num.toLocaleString("en-IN")}`;
  };

  if (checkingLimit || loadingSubscription) {
    return (

        <main className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p>Checking your subscription...</p>
          </div>
        </main>
    );
  }

  if (!canCreateData?.canCreate) {
    return (

        <main className="flex-1">
          <div className="max-w-2xl mx-auto px-4 py-16">
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Listing Limit Reached</AlertTitle>
              <AlertDescription>
                {subscriptionData?.subscription 
                  ? `You've used ${subscriptionData.subscription.listingsUsed} of ${subscriptionData.package?.listingLimit} listings in your ${subscriptionData.package?.name} plan.`
                  : "You don't have an active subscription."}
              </AlertDescription>
            </Alert>
            <Card className="p-8 text-center">
              <Home className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
              <h1 className="text-2xl font-bold mb-2">Upgrade Your Plan</h1>
              <p className="text-muted-foreground mb-6">
                To create more property listings, please upgrade to a higher package.
              </p>
              <div className="flex gap-4 justify-center">
                <Button variant="outline" onClick={() => navigate("/seller/dashboard")}>
                  Back to Dashboard
                </Button>
                <Button onClick={() => navigate("/seller/packages")}>
                  View Packages
                </Button>
              </div>
            </Card>
          </div>
        </main>
    );
  }

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Progress Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Create New Listing</h1>
              {subscriptionData?.subscription && (
                <Badge variant="outline">
                  {subscriptionData.subscription.listingsUsed}/{subscriptionData.package?.listingLimit} listings used
                </Badge>
              )}
            </div>

            <div className="flex items-center gap-2 mb-2">
              {STEPS.map((step, index) => (
                <div key={step.id} className="flex items-center flex-1">
                  <div
                    className={`h-10 w-10 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                      currentStep >= step.id
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle className="h-5 w-5" />
                    ) : (
                      step.id
                    )}
                  </div>
                  {index < STEPS.length - 1 && (
                    <div
                      className={`h-1 flex-1 mx-2 transition-colors ${
                        currentStep > step.id ? "bg-primary" : "bg-muted"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="flex justify-between text-sm">
              {STEPS.map(step => (
                <div key={step.id} className="text-center flex-1">
                  <p className={currentStep >= step.id ? "font-medium" : "text-muted-foreground"}>
                    {step.title}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <Card className="p-8">
              <h2 className="font-serif font-bold text-xl mb-6">
                Property Basic Information
              </h2>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="propertyType">Property Type *</Label>
                    <Select
                      value={formData.propertyType}
                      onValueChange={(value) => updateField("propertyType", value)}
                    >
                      <SelectTrigger id="propertyType" data-testid="select-property-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment">Apartment</SelectItem>
                        <SelectItem value="villa">Villa</SelectItem>
                        <SelectItem value="independent_house">Independent House</SelectItem>
                        <SelectItem value="commercial">Commercial</SelectItem>
                        <SelectItem value="plot">Plot/Land</SelectItem>
                        <SelectItem value="penthouse">Penthouse</SelectItem>
                        <SelectItem value="studio">Studio</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="transactionType">Transaction Type *</Label>
                    <Select
                      value={formData.transactionType}
                      onValueChange={(value) => updateField("transactionType", value)}
                    >
                      <SelectTrigger id="transactionType" data-testid="select-transaction-type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sale">For Sale</SelectItem>
                        <SelectItem value="rent">For Rent</SelectItem>
                        <SelectItem value="lease">For Lease</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {canHaveProjects && formData.transactionType === "sale" && liveProjects.length > 0 && (
                  <div className="space-y-2">
                    <Label htmlFor="projectId" className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Link to Project (Optional)
                    </Label>
                    <Select
                      value={formData.projectId}
                      onValueChange={(value) => updateField("projectId", value === "none" ? "" : value)}
                    >
                      <SelectTrigger id="projectId" data-testid="select-project">
                        <SelectValue placeholder="Select a project to link this property" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">No project (standalone listing)</SelectItem>
                        {liveProjects.map((project) => (
                          <SelectItem key={project.id} value={project.id}>
                            {project.name} - {project.city}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      Link this property to one of your projects. Properties linked to projects appear on the project page.
                    </p>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="title">Property Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Luxury 3BHK Apartment in Prime Location"
                    value={formData.title}
                    onChange={(e) => updateField("title", e.target.value)}
                    data-testid="input-title"
                  />
                  <p className="text-xs text-muted-foreground">
                    A catchy title helps attract more buyers
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Property Description</Label>
                  <Textarea
                    id="description"
                    rows={5}
                    placeholder="Describe your property, its features, amenities, and what makes it special..."
                    value={formData.description}
                    onChange={(e) => updateField("description", e.target.value)}
                    data-testid="textarea-description"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="price">Price *</Label>
                  <div className="flex items-center gap-3">
                    <span className="text-xl font-bold">₹</span>
                    <Input
                      id="price"
                      type="number"
                      placeholder={formData.transactionType === "rent" ? "45000" : "8500000"}
                      value={formData.price}
                      onChange={(e) => updateField("price", e.target.value)}
                      data-testid="input-price"
                    />
                    {formData.transactionType === "rent" && (
                      <span className="text-muted-foreground whitespace-nowrap">/month</span>
                    )}
                  </div>
                  {formData.price && (
                    <p className="text-sm text-primary font-medium">
                      {formatPrice(formData.price)}
                    </p>
                  )}
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Location Details</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="address">Street Address *</Label>
                      <Textarea
                        id="address"
                        rows={2}
                        placeholder="Building name, street, area"
                        value={formData.address}
                        onChange={(e) => updateField("address", e.target.value)}
                        data-testid="textarea-address"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="locality">Locality</Label>
                        <Input
                          id="locality"
                          placeholder="e.g., Bandra West"
                          value={formData.locality}
                          onChange={(e) => updateField("locality", e.target.value)}
                          data-testid="input-locality"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city">City *</Label>
                        <Input
                          id="city"
                          placeholder="e.g., Mumbai"
                          value={formData.city}
                          onChange={(e) => updateField("city", e.target.value)}
                          data-testid="input-city"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="state">State *</Label>
                        <Select
                          value={formData.state}
                          onValueChange={(value) => updateField("state", value)}
                        >
                          <SelectTrigger id="state" data-testid="select-state">
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {INDIAN_STATES.map(state => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="pincode">PIN Code</Label>
                        <Input
                          id="pincode"
                          placeholder="400001"
                          maxLength={6}
                          value={formData.pincode}
                          onChange={(e) => updateField("pincode", e.target.value.replace(/\D/g, ""))}
                          data-testid="input-pincode"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 mt-4">
                      <Label className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        Pin Location on Map
                      </Label>
                      <p className="text-sm text-muted-foreground mb-3">
                        Pinning your property's exact location helps buyers find it more easily
                      </p>
                      <Suspense fallback={
                        <div className="h-[300px] bg-muted rounded-lg flex items-center justify-center">
                          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
                        </div>
                      }>
                        <LocationPicker
                          latitude={formData.latitude ? parseFloat(formData.latitude) : undefined}
                          longitude={formData.longitude ? parseFloat(formData.longitude) : undefined}
                          onLocationChange={(lat, lng) => {
                            updateField("latitude", lat.toString());
                            updateField("longitude", lng.toString());
                          }}
                          defaultCity={formData.city || "Mumbai"}
                          height="300px"
                        />
                      </Suspense>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 2: Property Details */}
          {currentStep === 2 && (
            <Card className="p-8">
              <h2 className="font-serif font-bold text-xl mb-6">
                Property Specifications
              </h2>

              <div className="space-y-6">
                {formData.propertyType !== "plot" && (
                  <>
                    <div>
                      <h3 className="font-semibold mb-4">Room Configuration</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="bedrooms">Bedrooms *</Label>
                          <Select
                            value={formData.bedrooms}
                            onValueChange={(value) => updateField("bedrooms", value)}
                          >
                            <SelectTrigger id="bedrooms" data-testid="select-bedrooms">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1 BHK</SelectItem>
                              <SelectItem value="2">2 BHK</SelectItem>
                              <SelectItem value="3">3 BHK</SelectItem>
                              <SelectItem value="4">4 BHK</SelectItem>
                              <SelectItem value="5">5+ BHK</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="bathrooms">Bathrooms *</Label>
                          <Select
                            value={formData.bathrooms}
                            onValueChange={(value) => updateField("bathrooms", value)}
                          >
                            <SelectTrigger id="bathrooms" data-testid="select-bathrooms">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3</SelectItem>
                              <SelectItem value="4">4</SelectItem>
                              <SelectItem value="5">5+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="balconies">Balconies</Label>
                          <Select
                            value={formData.balconies}
                            onValueChange={(value) => updateField("balconies", value)}
                          >
                            <SelectTrigger id="balconies" data-testid="select-balconies">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="0">0</SelectItem>
                              <SelectItem value="1">1</SelectItem>
                              <SelectItem value="2">2</SelectItem>
                              <SelectItem value="3">3+</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />
                  </>
                )}

                <div>
                  <h3 className="font-semibold mb-4">Area Details</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="area">
                        {formData.propertyType === "plot" ? "Plot Area" : "Carpet Area"} (sq ft) *
                      </Label>
                      <Input
                        id="area"
                        type="number"
                        placeholder="1200"
                        value={formData.area}
                        onChange={(e) => updateField("area", e.target.value)}
                        data-testid="input-area"
                      />
                    </div>

                    {formData.area && formData.price && (
                      <div className="space-y-2">
                        <Label>Price per sq ft</Label>
                        <p className="text-lg font-semibold text-primary py-2">
                          ₹{Math.round(parseInt(formData.price) / parseInt(formData.area)).toLocaleString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {formData.propertyType !== "plot" && (
                  <>
                    <Separator />

                    <div>
                      <h3 className="font-semibold mb-4">Floor & Facing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="floor">Floor Number</Label>
                          <Input
                            id="floor"
                            type="number"
                            placeholder="3"
                            value={formData.floor}
                            onChange={(e) => updateField("floor", e.target.value)}
                            data-testid="input-floor"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="totalFloors">Total Floors</Label>
                          <Input
                            id="totalFloors"
                            type="number"
                            placeholder="10"
                            value={formData.totalFloors}
                            onChange={(e) => updateField("totalFloors", e.target.value)}
                            data-testid="input-total-floors"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="facing">Facing</Label>
                          <Select
                            value={formData.facing}
                            onValueChange={(value) => updateField("facing", value)}
                          >
                            <SelectTrigger id="facing" data-testid="select-facing">
                              <SelectValue placeholder="Select" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="north">North</SelectItem>
                              <SelectItem value="south">South</SelectItem>
                              <SelectItem value="east">East</SelectItem>
                              <SelectItem value="west">West</SelectItem>
                              <SelectItem value="north-east">North-East</SelectItem>
                              <SelectItem value="north-west">North-West</SelectItem>
                              <SelectItem value="south-east">South-East</SelectItem>
                              <SelectItem value="south-west">South-West</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="furnishing">Furnishing</Label>
                        <Select
                          value={formData.furnishing}
                          onValueChange={(value) => updateField("furnishing", value)}
                        >
                          <SelectTrigger id="furnishing" data-testid="select-furnishing">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="unfurnished">Unfurnished</SelectItem>
                            <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                            <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="ageOfProperty">Age of Property (years)</Label>
                        <Select
                          value={formData.ageOfProperty}
                          onValueChange={(value) => updateField("ageOfProperty", value)}
                        >
                          <SelectTrigger id="ageOfProperty" data-testid="select-age">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0">New Construction</SelectItem>
                            <SelectItem value="1">Less than 1 year</SelectItem>
                            <SelectItem value="3">1-3 years</SelectItem>
                            <SelectItem value="5">3-5 years</SelectItem>
                            <SelectItem value="10">5-10 years</SelectItem>
                            <SelectItem value="15">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="possessionStatus">Possession Status</Label>
                        <Select
                          value={formData.possessionStatus}
                          onValueChange={(value) => updateField("possessionStatus", value)}
                        >
                          <SelectTrigger id="possessionStatus" data-testid="select-possession">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="ready">Ready to Move</SelectItem>
                            <SelectItem value="under_construction">Under Construction</SelectItem>
                            <SelectItem value="upcoming">Upcoming Project</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </>
                )}

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Amenities</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {AMENITIES_LIST.map((amenity) => (
                      <div key={amenity} className="flex items-center space-x-2">
                        <Checkbox
                          id={`amenity-${amenity}`}
                          checked={formData.amenities.includes(amenity)}
                          onCheckedChange={() => toggleArrayItem("amenities", amenity)}
                          data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/\s/g, "-")}`}
                        />
                        <Label
                          htmlFor={`amenity-${amenity}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {amenity}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold mb-4">Highlights</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {HIGHLIGHTS_LIST.map((highlight) => (
                      <div key={highlight} className="flex items-center space-x-2">
                        <Checkbox
                          id={`highlight-${highlight}`}
                          checked={formData.highlights.includes(highlight)}
                          onCheckedChange={() => toggleArrayItem("highlights", highlight)}
                          data-testid={`checkbox-highlight-${highlight.toLowerCase().replace(/\s/g, "-")}`}
                        />
                        <Label
                          htmlFor={`highlight-${highlight}`}
                          className="text-sm font-normal cursor-pointer"
                        >
                          {highlight}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}

          {/* Step 3: Photos */}
          {currentStep === 3 && (
            <Card className="p-8">
              <h2 className="font-serif font-bold text-xl mb-2">
                Upload Photos
              </h2>
              <p className="text-muted-foreground mb-6">
                Add high-quality photos to attract more buyers
              </p>

              <div className="space-y-6">
                <div className="flex flex-col items-center justify-center border-2 border-dashed border-muted-foreground/25 rounded-lg p-12 text-center">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                    <Upload className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">Upload Property Photos</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    PNG, JPG up to 10MB each (max 20 photos)
                  </p>
                  <ObjectUploader
                    maxNumberOfFiles={20}
                    maxFileSize={10485760}
                    allowedFileTypes={["image/*"]}
                    onGetUploadParameters={async () => {
                      const response = await apiRequest("POST", "/api/objects/upload");
                      const data = await response.json();
                      return {
                        method: "PUT" as const,
                        url: data.uploadURL,
                      };
                    }}
                    onComplete={(result: UploadResult<Record<string, unknown>, Record<string, unknown>>) => {
                      if (result.successful && result.successful.length > 0) {
                        const newPhotos = result.successful.map((file, index) => ({
                          url: file.uploadURL || "",
                          caption: "",
                          isPrimary: formData.photos.length === 0 && index === 0,
                        }));
                        updateField("photos", [...formData.photos, ...newPhotos] as unknown as string[]);
                        toast({
                          title: "Photos uploaded",
                          description: `Successfully uploaded ${result.successful.length} photo(s)`,
                        });
                      }
                      if (result.failed && result.failed.length > 0) {
                        toast({
                          title: "Some uploads failed",
                          description: `${result.failed.length} photo(s) failed to upload`,
                          variant: "destructive",
                        });
                      }
                    }}
                    buttonVariant="default"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Select Photos
                  </ObjectUploader>
                </div>

                {formData.photos.length > 0 && (
                  <div>
                    <h3 className="font-semibold mb-3">Uploaded Photos ({formData.photos.length})</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {formData.photos.map((photo, index) => (
                        <div
                          key={index}
                          className="relative aspect-square rounded-lg border overflow-hidden group"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || `Photo ${index + 1}`}
                            className="w-full h-full object-cover"
                          />
                          <Button
                            variant="destructive"
                            size="icon"
                            className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => {
                              const updated = formData.photos.filter((_, i) => i !== index);
                              updateField("photos", updated as unknown as string[]);
                            }}
                            data-testid={`button-remove-photo-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                          {index === 0 && (
                            <div className="absolute bottom-2 left-2">
                              <Badge>Cover Photo</Badge>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <Alert>
                  <ImageIcon className="h-4 w-4" />
                  <AlertTitle>Photo Tips</AlertTitle>
                  <AlertDescription>
                    Include photos of all rooms, kitchen, bathrooms, and outdoor areas.
                    Good lighting and multiple angles help attract more buyers.
                  </AlertDescription>
                </Alert>
              </div>
            </Card>
          )}

          {/* Step 4: Review & Submit */}
          {currentStep === 4 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 space-y-6">
                <Card className="p-8">
                  <h2 className="font-serif font-bold text-xl mb-6">
                    Contact Information
                  </h2>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="contactName">Contact Name *</Label>
                      <Input
                        id="contactName"
                        placeholder="Your name"
                        value={formData.contactName}
                        onChange={(e) => updateField("contactName", e.target.value)}
                        data-testid="input-contact-name"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone *</Label>
                      <div className="flex gap-2">
                        <Input className="w-20" value="+91" disabled />
                        <Input
                          id="contactPhone"
                          placeholder="98765 43210"
                          value={formData.contactPhone}
                          onChange={(e) => updateField("contactPhone", e.target.value)}
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
                        value={formData.contactEmail}
                        onChange={(e) => updateField("contactEmail", e.target.value)}
                        data-testid="input-contact-email"
                      />
                    </div>

                    <Separator className="my-6" />

                    <div className="space-y-4">
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="verifiedInfo"
                          checked={formData.verifiedInfo}
                          onCheckedChange={(checked) => updateField("verifiedInfo", !!checked)}
                          data-testid="checkbox-verified"
                        />
                        <Label htmlFor="verifiedInfo" className="text-sm font-normal cursor-pointer">
                          I verify that all the information provided is accurate and true
                        </Label>
                      </div>

                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id="agreedToTerms"
                          checked={formData.agreedToTerms}
                          onCheckedChange={(checked) => updateField("agreedToTerms", !!checked)}
                          data-testid="checkbox-terms"
                        />
                        <Label htmlFor="agreedToTerms" className="text-sm font-normal cursor-pointer">
                          I agree to the Terms & Conditions and Privacy Policy
                        </Label>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Preview Card */}
              <div className="lg:col-span-1">
                <Card className="p-6 sticky top-4">
                  <h3 className="font-semibold mb-4">Property Preview</h3>

                  <div className="space-y-4">
                    <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                      {formData.photos.length > 0 ? (
                        <img
                          src={formData.photos[0].url}
                          alt="Cover"
                          className="w-full h-full object-cover rounded-lg"
                        />
                      ) : (
                        <span className="text-sm text-muted-foreground">No photos yet</span>
                      )}
                    </div>

                    <div>
                      <div className="flex items-start gap-2 mb-2">
                        <h4 className="font-semibold line-clamp-2">
                          {formData.title || "Property Title"}
                        </h4>
                        <Badge>{formData.transactionType === "rent" ? "For Rent" : formData.transactionType === "lease" ? "For Lease" : "For Sale"}</Badge>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-3">
                        <MapPin className="h-4 w-4" />
                        <span className="line-clamp-1">
                          {formData.locality ? `${formData.locality}, ` : ""}{formData.city || "City"}, {formData.state || "State"}
                        </span>
                      </div>
                      <p className="text-2xl font-bold font-serif text-primary mb-4">
                        {formData.price ? formatPrice(formData.price) : "₹0"}
                        {formData.transactionType === "rent" && <span className="text-sm font-normal">/month</span>}
                      </p>
                    </div>

                    <Separator />

                    {formData.propertyType !== "plot" && (
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                          <Bed className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-medium">{formData.bedrooms || "-"}</span>
                          <span className="text-xs text-muted-foreground">Beds</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                          <Bath className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-medium">{formData.bathrooms || "-"}</span>
                          <span className="text-xs text-muted-foreground">Baths</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-muted/50 rounded-lg">
                          <Maximize className="h-4 w-4 text-muted-foreground mb-1" />
                          <span className="font-medium">{formData.area || "-"}</span>
                          <span className="text-xs text-muted-foreground">sqft</span>
                        </div>
                      </div>
                    )}

                    {formData.amenities.length > 0 && (
                      <div>
                        <p className="text-sm font-medium mb-2">Key Features:</p>
                        <div className="flex flex-wrap gap-2">
                          {formData.amenities.slice(0, 4).map((amenity) => (
                            <Badge key={amenity} variant="secondary" className="text-xs">
                              {amenity}
                            </Badge>
                          ))}
                          {formData.amenities.length > 4 && (
                            <Badge variant="outline" className="text-xs">
                              +{formData.amenities.length - 4} more
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}

                    <Separator />

                    <div>
                      <p className="text-sm font-medium mb-2">Contact:</p>
                      <div className="space-y-2 text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Phone className="h-4 w-4" />
                          <span>{formData.contactPhone || "Phone number"}</span>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Mail className="h-4 w-4" />
                          <span className="truncate">{formData.contactEmail || "Email"}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between mt-8">
            {currentStep === 1 ? (
              <Button
                variant="outline"
                onClick={() => navigate("/seller/dashboard")}
                data-testid="button-cancel"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Cancel
              </Button>
            ) : (
              <Button
                variant="outline"
                onClick={handleBack}
                data-testid="button-back"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
            )}

            {currentStep < 4 ? (
              <Button onClick={handleNext} data-testid="button-next">
                Next: {STEPS[currentStep]?.title}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={createPropertyMutation.isPending || !formData.agreedToTerms || !formData.verifiedInfo}
                data-testid="button-submit"
              >
                {createPropertyMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4 mr-2" />
                    Create Listing
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </main>
  );
}
