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
    address: "",
    city: "",
    state: "",
    pincode: "",
    locality: "",
    projectId: "",
  });

  // Redirect if not authenticated
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

  // Check if seller can create more listings
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
    queryKey: ["/api/projects/my-projects"],
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

  const handleCategoryChange = (value: string) => {
    const category = categories.find(c => c.id === value);
    const allowed = category?.allowedTransactionTypes || ["sale", "rent", "lease"];
    setFormData({ 
      ...formData, 
      categoryId: value, 
      subcategoryId: "", 
      projectStage: "",
      transactionType: allowed[0] || "sale"
    });
  };

  const isFormValid = useMemo(() => {
    if (!formData.categoryId || !formData.transactionType || !formData.title || !formData.price || !formData.city) {
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
    console.log("Step 1 data:", formData);
    localStorage.setItem("createListingStep1", JSON.stringify(formData));
    navigate("/seller/listings/create/step2");
  };

  // Show loading state
  if (authLoading || quotaLoading) {
  return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
  
      </main>
    );
  }

  // Show quota exceeded message
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
      
          </Card>
  
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Quota Warning */}
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

          {/* Error alerts */}
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
        
              <div className="h-1 flex-1 bg-muted">
                <div className="h-full w-0 bg-primary"></div>
        
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                2
        
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                3
        
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
        
      
            <p className="text-sm text-muted-foreground">Step 1 of 4: Basic Information</p>
    

          <Card className="p-8">
            <h1 className="font-serif font-bold text-2xl mb-6">
              Property Basic Information
            </h1>

            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="category">Property Category *</Label>
                  {categoriesLoading ? (
                    <div className="h-10 flex items-center justify-center border rounded-md">
                      <Loader2 className="h-4 w-4 animate-spin" />
              
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
          

                {formData.categoryId && filteredSubcategories.length > 0 && (
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
            
                )}
        

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="transactionType">Transaction Type *</Label>
                  <Select
                    value={formData.transactionType}
                    onValueChange={(value) =>
                      setFormData({ ...formData, transactionType: value })
                    }
                    disabled={!formData.categoryId}
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
          
              )}

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
        

              <div className="space-y-2">
                <Label htmlFor="description">Property Description *</Label>
                <Textarea
                  id="description"
                  rows={6}
                  placeholder="Describe your property, its features, amenities, and what makes it special..."
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  data-testid="textarea-description"
                />
        

              <div className="space-y-2">
                <Label htmlFor="price">Price *</Label>
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
            
                  {(formData.transactionType === "rent" || formData.transactionType === "lease") && (
                    <span className="text-muted-foreground whitespace-nowrap">/month</span>
                  )}
          
        

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
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      data-testid="textarea-address"
                    />
            

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
              

                    <div className="space-y-2">
                      <Label htmlFor="pincode">PIN Code *</Label>
                      <PinCodeInput
                        value={formData.pincode}
                        onValueChange={(value) =>
                          setFormData({ ...formData, pincode: value })
                        }
                        data-testid="input-pincode"
                      />
              
            
          
        

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
        
            </form>
          </Card>
  
    </main>
  );
}
