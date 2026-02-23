import { useState, useMemo, useEffect } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
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
import { StateSelect, CitySelect, PinCodeInput, PriceInput } from "@/components/ui/location-select";
import { ArrowRight, ArrowLeft, Loader2, Building2, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PropertyCategory, PropertySubcategory, Project } from "@shared/schema";

const projectStages = [
  { value: "pre_launch", label: "Pre-launch" },
  { value: "launch", label: "Launch" },
  { value: "under_construction", label: "Under Construction" },
  { value: "ready_to_move", label: "Ready to Move" },
];

const areaUnits = [
  { value: "sqft", label: "Sq. Ft." },
  { value: "sqm", label: "Sq. M." },
  { value: "sqyd", label: "Sq. Yd." },
  { value: "acres", label: "Acres" },
  { value: "hectares", label: "Hectares" },
  { value: "guntha", label: "Guntha" },
  { value: "bigha", label: "Bigha" },
  { value: "marla", label: "Marla" },
  { value: "kanal", label: "Kanal" },
  { value: "cent", label: "Cent" },
];

export default function CreateListingStep1Page() {
  const [, navigate] = useLocation();
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    categoryId: "",
    subcategoryId: "",
    projectStage: "",
    transactionType: "",
    title: "",
    description: "",
    price: "",
    area: "",
    areaUnit: "sqft",
    address: "",
    city: "",
    state: "",
    pincode: "",
    locality: "",
    areaInLocality: "",
    nearbyLandmark: "",
    projectSocietyName: "",
    projectId: "",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to create a listing.",
        variant: "destructive",
      });
      navigate("/login");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  const canHaveProjects = user?.sellerType && ["builder", "broker"].includes(user.sellerType);

  interface CanCreateResponse {
    success: boolean;
    canCreate: boolean;
    message?: string;
    remainingListings?: number;
  }

  const { data: canCreateData, isLoading: quotaLoading, error: quotaError } = useQuery<CanCreateResponse>({
    queryKey: ["/api/subscriptions/can-create-listing"],
    enabled: isAuthenticated,
  });

  const { data: categories = [], isLoading: categoriesLoading, error: categoriesError } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });

  const { data: allSubcategories = [], error: subcategoriesError } = useQuery<PropertySubcategory[]>({
    queryKey: ["/api/property-subcategories"],
  });

  const { data: sellerProjects = [] } = useQuery<Project[]>({
    queryKey: ["/api/seller/projects"],
    enabled: canHaveProjects,
  });

  const canCreateListing = canCreateData?.canCreate ?? false;
  const remainingListings = canCreateData?.remainingListings ?? 0;

  const liveProjects = useMemo(() => {
    return sellerProjects.filter(p => p.status === "live");
  }, [sellerProjects]);

  const selectedCategory = useMemo(() => {
    return categories.find(c => c.id === formData.categoryId);
  }, [categories, formData.categoryId]);

  const filteredSubcategories = useMemo(() => {
    if (!formData.categoryId) return [];
    return allSubcategories.filter(sub => sub.categoryId === formData.categoryId);
  }, [allSubcategories, formData.categoryId]);

  const allowedTransactionTypes = useMemo(() => {
    if (!selectedCategory) return ["sale", "rent", "lease"];
    return selectedCategory.allowedTransactionTypes || ["sale", "rent", "lease"];
  }, [selectedCategory]);

  const priceLabel = useMemo(() => {
    if (formData.transactionType === "rent") return "Monthly Rent";
    if (formData.transactionType === "lease") return "Lease Amount";
    return "Expected Price";
  }, [formData.transactionType]);

  const pricePerSqft = useMemo(() => {
    const price = parseInt(formData.price);
    const area = parseInt(formData.area);
    if (!price || !area || area === 0) return "";
    return Math.round(price / area).toString();
  }, [formData.price, formData.area]);

  const handleCategoryChange = (value: string) => {
    const category = categories.find(c => c.id === value);
    const allowed = category?.allowedTransactionTypes || ["sale", "rent", "lease"];
    const currentTxnStillAllowed = allowed.includes(formData.transactionType);
    setFormData({ 
      ...formData, 
      categoryId: value, 
      subcategoryId: "", 
      projectStage: "",
      transactionType: currentTxnStillAllowed ? formData.transactionType : (allowed[0] || "sale"),
    });
  };

  const isFormValid = useMemo(() => {
    if (!formData.categoryId || !formData.transactionType || !formData.title || !formData.price || !formData.city || !formData.state) {
      return false;
    }
    if (filteredSubcategories.length > 0 && !formData.subcategoryId) {
      return false;
    }
    if (selectedCategory?.hasProjectStage && !formData.projectStage) {
      return false;
    }
    return true;
  }, [formData, filteredSubcategories, selectedCategory]);

  const handleNext = () => {
    if (!isFormValid) return;
    const dataToSave = {
      ...formData,
      pricePerSqft: pricePerSqft || "",
    };
    localStorage.setItem("createListingStep1", JSON.stringify(dataToSave));
    navigate("/seller/listings/create/step2");
  };

  if (authLoading || quotaLoading) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  if (!canCreateListing && canCreateData) {
    return (
      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Card className="p-8 text-center">
            <AlertCircle className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
            <h1 className="font-serif font-bold text-2xl mb-4">Listing Quota Exhausted</h1>
            <p className="text-muted-foreground mb-6">
              {canCreateData.message || "You've used all your available listing slots. Upgrade your package to create more listings."}
            </p>
            <div className="flex gap-4 justify-center">
              <Link href="/seller/dashboard">
                <Button variant="outline">Back to Dashboard</Button>
              </Link>
              <Link href="/seller/packages/buy">
                <Button>Upgrade Package</Button>
              </Link>
            </div>
          </Card>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {remainingListings <= 2 && remainingListings > 0 && (
            <Alert className="mb-6 border-yellow-500 bg-yellow-50 dark:bg-yellow-900/20">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <AlertDescription className="text-yellow-800 dark:text-yellow-200">
                You have {remainingListings} listing{remainingListings === 1 ? '' : 's'} remaining in your current package.{' '}
                <Link href="/seller/packages/buy" className="underline font-medium">
                  Upgrade now
                </Link>
              </AlertDescription>
            </Alert>
          )}

          {(categoriesError || subcategoriesError || quotaError) && (
            <Alert variant="destructive" className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Failed to load some data. Please refresh the page or try again later.
              </AlertDescription>
            </Alert>
          )}

          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
                1
              </div>
              <div className="h-1 flex-1 bg-muted">
                <div className="h-full w-0 bg-primary"></div>
              </div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                2
              </div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Step 1 of 4: Basic Information</p>
          </div>

          <Card className="p-8">
            <h1 className="font-serif font-bold text-2xl mb-6">
              Property Basic Information
            </h1>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type *</Label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transactionType: value })
                    }
                  >
                    <SelectTrigger id="transactionType" data-testid="select-transaction-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      {allowedTransactionTypes.includes("sale") && (
                        <SelectItem value="sale">For Sale</SelectItem>
                      )}
                      {allowedTransactionTypes.includes("lease") && (
                        <SelectItem value="lease">For Lease</SelectItem>
                      )}
                      {allowedTransactionTypes.includes("rent") && (
                        <SelectItem value="rent">For Rent</SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="category">Property Category *</Label>
                  {categoriesLoading ? (
                    <div className="h-10 flex items-center justify-center border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <Select
                      value={formData.categoryId}
                      onValueChange={handleCategoryChange}
                    >
                      <SelectTrigger id="category" data-testid="select-category">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
              </div>

              {formData.categoryId && filteredSubcategories.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="subcategory">Subcategory *</Label>
                    <Select
                      value={formData.subcategoryId}
                      onValueChange={(value) =>
                        setFormData({ ...formData, subcategoryId: value })
                      }
                    >
                      <SelectTrigger id="subcategory" data-testid="select-subcategory">
                        <SelectValue placeholder="Select subcategory" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredSubcategories.map((sub) => (
                          <SelectItem key={sub.id} value={sub.id}>
                            {sub.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {selectedCategory?.hasProjectStage && (
                    <div className="space-y-2">
                      <Label htmlFor="projectStage">Project Stage *</Label>
                      <Select
                        value={formData.projectStage}
                        onValueChange={(value) =>
                          setFormData({ ...formData, projectStage: value })
                        }
                      >
                        <SelectTrigger id="projectStage" data-testid="select-project-stage">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                        <SelectContent>
                          {projectStages.map((stage) => (
                            <SelectItem key={stage.value} value={stage.value}>
                              {stage.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              )}

              {canHaveProjects && formData.transactionType === "sale" && liveProjects.length > 0 && (
                <div className="space-y-2">
                  <Label htmlFor="projectId" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" />
                    Link to Project (Optional)
                  </Label>
                  <Select
                    value={formData.projectId}
                    onValueChange={(value) =>
                      setFormData({ ...formData, projectId: value === "none" ? "" : value })
                    }
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
                <Label htmlFor="projectSocietyName">Project / Society Name</Label>
                <Input
                  id="projectSocietyName"
                  placeholder="e.g., Green Valley Apartments, Sunshine Society"
                  value={formData.projectSocietyName}
                  onChange={(e) =>
                    setFormData({ ...formData, projectSocietyName: e.target.value })
                  }
                  data-testid="input-project-society-name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">Property Title *</Label>
                <Input
                  id="title"
                  placeholder="e.g., Luxury 3BHK Apartment in Prime Location"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
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
                  rows={4}
                  placeholder="Describe your property, its features, amenities, and what makes it special..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  data-testid="textarea-description"
                />
              </div>

              <div>
                <h3 className="font-semibold mb-4">Price & Area</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="price">{priceLabel} *</Label>
                    <div className="flex items-center gap-2">
                      <div className="flex-1">
                        <PriceInput
                          value={formData.price}
                          onValueChange={(value) =>
                            setFormData({ ...formData, price: value })
                          }
                          placeholder={formData.transactionType === "rent" || formData.transactionType === "lease" ? "45000" : "8500000"}
                          data-testid="input-price"
                        />
                      </div>
                      {(formData.transactionType === "rent" || formData.transactionType === "lease") && (
                        <span className="text-muted-foreground whitespace-nowrap">/month</span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="area">Area *</Label>
                    <div className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          id="area"
                          type="number"
                          placeholder="e.g., 1200"
                          value={formData.area}
                          onChange={(e) =>
                            setFormData({ ...formData, area: e.target.value })
                          }
                          data-testid="input-area"
                        />
                      </div>
                      <Select
                        value={formData.areaUnit}
                        onValueChange={(value) =>
                          setFormData({ ...formData, areaUnit: value })
                        }
                      >
                        <SelectTrigger className="w-[120px]" data-testid="select-area-unit">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {areaUnits.map((unit) => (
                            <SelectItem key={unit.value} value={unit.value}>
                              {unit.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {pricePerSqft && (
                    <div className="space-y-2">
                      <Label>Per Sq.ft Price (Auto-calculated)</Label>
                      <div className="h-9 flex items-center px-3 border rounded-md bg-muted/50 text-muted-foreground" data-testid="text-price-per-sqft">
                        Rs. {parseInt(pricePerSqft).toLocaleString("en-IN")} / sq.ft
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-4">Location Details</h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                      <Label htmlFor="locality">Locality *</Label>
                      <Input
                        id="locality"
                        placeholder="e.g., Bandra West"
                        value={formData.locality}
                        onChange={(e) =>
                          setFormData({ ...formData, locality: e.target.value })
                        }
                        data-testid="input-locality"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="areaInLocality">Area in Locality</Label>
                      <Input
                        id="areaInLocality"
                        placeholder="e.g., Sector 5, Phase 2"
                        value={formData.areaInLocality}
                        onChange={(e) =>
                          setFormData({ ...formData, areaInLocality: e.target.value })
                        }
                        data-testid="input-area-in-locality"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="nearbyLandmark">Nearby Landmark</Label>
                      <Input
                        id="nearbyLandmark"
                        placeholder="e.g., Near City Mall, Opposite Metro Station"
                        value={formData.nearbyLandmark}
                        onChange={(e) =>
                          setFormData({ ...formData, nearbyLandmark: e.target.value })
                        }
                        data-testid="input-nearby-landmark"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code</Label>
                      <PinCodeInput
                        value={formData.pincode}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pincode: value })
                        }
                        data-testid="input-pincode"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Street Address</Label>
                    <Textarea
                      id="address"
                      rows={2}
                      placeholder="Building name, street, area"
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      data-testid="textarea-address"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-6">
                <Link href="/seller/dashboard">
                  <Button variant="outline" type="button" data-testid="button-cancel">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Cancel
                  </Button>
                </Link>
                <Button onClick={handleNext} type="button" disabled={!isFormValid} data-testid="button-next">
                  Next: Property Details
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
    </main>
  );
}
