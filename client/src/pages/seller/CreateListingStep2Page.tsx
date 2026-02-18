import { useState, useEffect, useMemo } from "react";
import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowRight, ArrowLeft, AlertCircle } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PropertyCategory } from "@shared/schema";
import type { JvDetailsType } from "@shared/schema";

const amenitiesList = [
  "Swimming Pool",
  "Gym",
  "Garden",
  "Power Backup",
  "Lift",
  "Security",
  "Play Area",
  "Club House",
  "Intercom",
  "Gas Pipeline",
  "Park",
  "Water Storage",
];

const defaultJvDetails = (): JvDetailsType => ({
  common: {},
  developmentType: undefined,
});

export default function CreateListingStep2Page() {
  const [, navigate] = useLocation();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const [step1Data, setStep1Data] = useState<any>(null);
  const { data: categories = [] } = useQuery<PropertyCategory[]>({
    queryKey: ["/api/property-categories"],
  });
  const selectedCategory = useMemo(
    () => (step1Data?.categoryId ? categories.find((c) => c.id === step1Data.categoryId) : null),
    [categories, step1Data?.categoryId]
  );
  const isJv = selectedCategory?.slug === "joint-venture";

  const [formData, setFormData] = useState({
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    floorNumber: "",
    totalFloors: "",
    carpetArea: "",
    builtUpArea: "",
    plotArea: "",
    facing: "",
    furnishing: "",
    parking: "",
    ageOfProperty: "",
    possessionStatus: "",
    expectedPossessionDate: "",
    isNewConstruction: false,
    amenities: [] as string[],
  });

  const [jvFormData, setJvFormData] = useState<JvDetailsType>(defaultJvDetails);

  // Check for Step 1 data and auth
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
      const savedData = localStorage.getItem("createListingStep1");
      if (!savedData) {
        toast({
          title: "Missing Data",
          description: "Please complete Step 1 first.",
          variant: "destructive",
        });
        navigate("/seller/listings/create/step1");
        return;
      }
      setStep1Data(JSON.parse(savedData));
    } catch (error) {
      console.error("Error loading step 1 data:", error);
      navigate("/seller/listings/create/step1");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  // Load saved JV step2 data when step1 is JV
  useEffect(() => {
    if (!step1Data || !isJv) return;
    try {
      const saved2 = localStorage.getItem("createListingStep2");
      if (saved2) {
        const parsed = JSON.parse(saved2);
        if (parsed?.isJv && parsed?.jvDetails) {
          setJvFormData({ ...defaultJvDetails(), ...parsed.jvDetails, common: { ...parsed.jvDetails?.common } });
        }
      }
    } catch (_) {}
  }, [step1Data, isJv]);

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
  };

  const updateJvCommon = (key: keyof NonNullable<JvDetailsType["common"]>, value: unknown) => {
    setJvFormData((prev) => ({
      ...prev,
      common: { ...prev.common, [key]: value },
    }));
  };
  const updateJv = <K extends keyof JvDetailsType>(key: K, value: JvDetailsType[K]) => {
    setJvFormData((prev) => ({ ...prev, [key]: value }));
  };

  const validateJvForm = (): string | null => {
    const c = jvFormData.common;
    if (!c?.locality?.trim()) return "Locality is required.";
    if (!c?.city?.trim()) return "City is required.";
    if (!c?.landArea?.trim()) return "Land area is required.";
    if (!c?.plotDimensions?.trim()) return "Plot dimensions is required.";
    if (!c?.roadWidth?.trim()) return "Road width is required.";
    if (c?.cornerPlot === undefined) return "Please select Corner Plot (Yes/No).";
    if (!c?.facing?.trim()) return "Facing is required.";
    if (c?.titleClear === undefined) return "Title Clear is required.";
    if (!c?.landUseZoning?.trim()) return "Land use zoning is required.";
    if (!c?.conversionStatus?.trim()) return "Conversion status is required.";
    if (c?.encumbranceFree === undefined) return "Encumbrance free is required.";
    if (c?.govtApprovalsAvailable === undefined) return "Govt approvals available is required.";
    if (c?.readyForDevelopment === undefined) return "Ready for development is required.";
    if (c?.existingStructure === undefined) return "Existing structure is required.";
    if (!jvFormData.jvType) return "JV type is required.";
    if (jvFormData.landownerExpectationPercent == null || jvFormData.landownerExpectationPercent === undefined) return "Landowner expectation (%) is required.";
    if (jvFormData.developerExpectationPercent == null || jvFormData.developerExpectationPercent === undefined) return "Developer expectation (%) is required.";
    if (!jvFormData.developmentType) return "Development type is required.";
    return null;
  };

  const handleNext = () => {
    if (isJv) {
      const err = validateJvForm();
      if (err) {
        toast({ title: "Validation", description: err, variant: "destructive" });
        return;
      }
      localStorage.setItem("createListingStep2", JSON.stringify({ isJv: true, jvDetails: jvFormData }));
    } else {
      localStorage.setItem("createListingStep2", JSON.stringify({ ...formData, isJv: false }));
    }
    navigate("/seller/listings/create/step3");
  };

  // Show loading state while checking auth and step data
  if (authLoading || !step1Data) {
    return (
      <main className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto" />
          <p className="mt-2 text-muted-foreground">Loading...</p>
        </div>
      </main>
    );
  }

  return (
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
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                3
              </div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">
                4
              </div>
            </div>
            <p className="text-sm text-muted-foreground">Step 2 of 4: Property Details</p>
          </div>

          <Card className="p-8">
            <h1 className="font-serif font-bold text-2xl mb-6">
              {isJv ? "Joint Venture / Development Details" : "Property Specifications"}
            </h1>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              {isJv ? (
                <>
                  {/* JV Common section */}
                  <div>
                    <h3 className="font-semibold mb-4">Location & Land Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Near by Landmark (optional)</Label>
                        <Input value={jvFormData.common?.nearbyLandmark ?? ""} onChange={(e) => updateJvCommon("nearbyLandmark", e.target.value)} placeholder="e.g. near highway" />
                      </div>
                      <div className="space-y-2">
                        <Label>Area in Locality (optional)</Label>
                        <Input value={jvFormData.common?.areaInLocality ?? ""} onChange={(e) => updateJvCommon("areaInLocality", e.target.value)} />
                      </div>
                      <div className="space-y-2">
                        <Label>Locality *</Label>
                        <Input value={jvFormData.common?.locality ?? ""} onChange={(e) => updateJvCommon("locality", e.target.value)} placeholder="e.g. Bandra West" required />
                      </div>
                      <div className="space-y-2">
                        <Label>City *</Label>
                        <Input value={jvFormData.common?.city ?? ""} onChange={(e) => updateJvCommon("city", e.target.value)} placeholder="e.g. Mumbai" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Land Area (sq ft / acres) *</Label>
                        <Input value={jvFormData.common?.landArea ?? ""} onChange={(e) => updateJvCommon("landArea", e.target.value)} placeholder="e.g. 5000" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Plot Dimensions *</Label>
                        <Input value={jvFormData.common?.plotDimensions ?? ""} onChange={(e) => updateJvCommon("plotDimensions", e.target.value)} placeholder="e.g. 50 x 100 ft" />
                      </div>
                      <div className="space-y-2">
                        <Label>Road Width *</Label>
                        <Input value={jvFormData.common?.roadWidth ?? ""} onChange={(e) => updateJvCommon("roadWidth", e.target.value)} placeholder="e.g. 30 ft" required />
                      </div>
                      <div className="space-y-2">
                        <Label>Corner Plot *</Label>
                        <Select value={jvFormData.common?.cornerPlot === true ? "yes" : jvFormData.common?.cornerPlot === false ? "no" : ""} onValueChange={(v) => updateJvCommon("cornerPlot", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Facing *</Label>
                        <Select value={jvFormData.common?.facing ?? ""} onValueChange={(v) => updateJvCommon("facing", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="north">North</SelectItem><SelectItem value="south">South</SelectItem><SelectItem value="east">East</SelectItem><SelectItem value="west">West</SelectItem>
                            <SelectItem value="north-east">North-East</SelectItem><SelectItem value="north-west">North-West</SelectItem><SelectItem value="south-east">South-East</SelectItem><SelectItem value="south-west">South-West</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Title Clear (Yes/No) *</Label>
                        <Select value={jvFormData.common?.titleClear === true ? "yes" : jvFormData.common?.titleClear === false ? "no" : ""} onValueChange={(v) => updateJvCommon("titleClear", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Land Use Zoning *</Label>
                        <Select value={jvFormData.common?.landUseZoning ?? ""} onValueChange={(v) => updateJvCommon("landUseZoning", v)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent>
                            <SelectItem value="residential">Residential</SelectItem><SelectItem value="commercial">Commercial</SelectItem><SelectItem value="mixed">Mixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Conversion Status (if agricultural) *</Label>
                        <Input value={jvFormData.common?.conversionStatus ?? ""} onChange={(e) => updateJvCommon("conversionStatus", e.target.value)} placeholder="e.g. Converted / NA" />
                      </div>
                      <div className="space-y-2">
                        <Label>Encumbrance Free (Yes/No) *</Label>
                        <Select value={jvFormData.common?.encumbranceFree === true ? "yes" : jvFormData.common?.encumbranceFree === false ? "no" : ""} onValueChange={(v) => updateJvCommon("encumbranceFree", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Govt Approvals Available (Yes/No) *</Label>
                        <Select value={jvFormData.common?.govtApprovalsAvailable === true ? "yes" : jvFormData.common?.govtApprovalsAvailable === false ? "no" : ""} onValueChange={(v) => updateJvCommon("govtApprovalsAvailable", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Ready for Development (Yes/No) *</Label>
                        <Select value={jvFormData.common?.readyForDevelopment === true ? "yes" : jvFormData.common?.readyForDevelopment === false ? "no" : ""} onValueChange={(v) => updateJvCommon("readyForDevelopment", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Existing Structure (Yes/No) *</Label>
                        <Select value={jvFormData.common?.existingStructure === true ? "yes" : jvFormData.common?.existingStructure === false ? "no" : ""} onValueChange={(v) => updateJvCommon("existingStructure", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Vacant Possession (Yes/No)</Label>
                        <Select value={jvFormData.common?.vacantPossession === true ? "yes" : jvFormData.common?.vacantPossession === false ? "no" : ""} onValueChange={(v) => updateJvCommon("vacantPossession", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Timeline Preference</Label>
                        <Input value={jvFormData.common?.timelinePreference ?? ""} onChange={(e) => updateJvCommon("timelinePreference", e.target.value)} placeholder="e.g. 6 months" />
                      </div>
                    </div>
                  </div>

                  {/* JV section */}
                  <div>
                    <h3 className="font-semibold mb-4">Joint Venture</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>JV Type *</Label>
                        <Select value={jvFormData.jvType ?? ""} onValueChange={(v) => updateJv("jvType", v === "revenue_share" ? "revenue_share" : v === "built_up_share" ? "built_up_share" : undefined)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="revenue_share">Revenue Share</SelectItem><SelectItem value="built_up_share">Built-up Share</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Landowner Expectation (%) *</Label>
                        <Input type="number" min={0} max={100} value={jvFormData.landownerExpectationPercent ?? ""} onChange={(e) => updateJv("landownerExpectationPercent", e.target.value === "" ? undefined : Number(e.target.value))} placeholder="e.g. 40" />
                      </div>
                      <div className="space-y-2">
                        <Label>Developer Expectation (%) *</Label>
                        <Input type="number" min={0} max={100} value={jvFormData.developerExpectationPercent ?? ""} onChange={(e) => updateJv("developerExpectationPercent", e.target.value === "" ? undefined : Number(e.target.value))} placeholder="e.g. 60" />
                      </div>
                      <div className="space-y-2">
                        <Label>Open to Negotiation (Yes/No)</Label>
                        <Select value={jvFormData.openToNegotiation === true ? "yes" : jvFormData.openToNegotiation === false ? "no" : ""} onValueChange={(v) => updateJv("openToNegotiation", v === "yes")}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        <Label>Preferred Developer Profile</Label>
                        <Select value={jvFormData.preferredDeveloperProfile ?? ""} onValueChange={(v) => updateJv("preferredDeveloperProfile", v === "local" ? "local" : v === "national" ? "national" : null)}>
                          <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                          <SelectContent><SelectItem value="local">Local</SelectItem><SelectItem value="national">National</SelectItem></SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>

                  {/* Development type */}
                  <div>
                    <h3 className="font-semibold mb-4">Development Type</h3>
                    <Select value={jvFormData.developmentType ?? ""} onValueChange={(v) => updateJv("developmentType", v as JvDetailsType["developmentType"])}>
                      <SelectTrigger className="max-w-xs"><SelectValue placeholder="Select type" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="apartment_construction">Apartment Construction</SelectItem>
                        <SelectItem value="plotted_development">Plotted Development</SelectItem>
                        <SelectItem value="villa_construction">Villa Construction</SelectItem>
                        <SelectItem value="commercial_construction">Commercial Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Type-specific: Apartment */}
                  {jvFormData.developmentType === "apartment_construction" && (
                    <div>
                      <h3 className="font-semibold mb-4">Apartment Construction</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>FSI / FAR Available</Label>
                          <Input value={jvFormData.apartmentConstruction?.fsiFarAvailable ?? ""} onChange={(e) => setJvFormData((p) => ({ ...p, apartmentConstruction: { ...p.apartmentConstruction, fsiFarAvailable: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Approx Build-up Potential</Label>
                          <Input value={jvFormData.apartmentConstruction?.approxBuildUpPotential ?? ""} onChange={(e) => setJvFormData((p) => ({ ...p, apartmentConstruction: { ...p.apartmentConstruction, approxBuildUpPotential: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Expected Segment</Label>
                          <Select value={jvFormData.apartmentConstruction?.expectedSegment ?? ""} onValueChange={(v) => setJvFormData((p) => ({ ...p, apartmentConstruction: { ...p.apartmentConstruction, expectedSegment: v } }))}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="affordable">Affordable</SelectItem><SelectItem value="mid">Mid</SelectItem><SelectItem value="premium">Premium</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type-specific: Plotted */}
                  {jvFormData.developmentType === "plotted_development" && (
                    <div>
                      <h3 className="font-semibold mb-4">Plotted Development</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Expected No. of Plots</Label>
                          <Input value={jvFormData.plottedDevelopment?.expectedNoOfPlots ?? ""} onChange={(e) => setJvFormData((p) => ({ ...p, plottedDevelopment: { ...p.plottedDevelopment, expectedNoOfPlots: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Gated Layout (Yes/No)</Label>
                          <Select value={jvFormData.plottedDevelopment?.gatedLayout === true ? "yes" : jvFormData.plottedDevelopment?.gatedLayout === false ? "no" : ""} onValueChange={(v) => setJvFormData((p) => ({ ...p, plottedDevelopment: { ...p.plottedDevelopment, gatedLayout: v === "yes" } }))}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type-specific: Villa */}
                  {jvFormData.developmentType === "villa_construction" && (
                    <div>
                      <h3 className="font-semibold mb-4">Villa Construction</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Villa Size Range</Label>
                          <Input value={jvFormData.villaConstruction?.villaSizeRange ?? ""} onChange={(e) => setJvFormData((p) => ({ ...p, villaConstruction: { ...p.villaConstruction, villaSizeRange: e.target.value } }))} placeholder="e.g. 2000-3000 sq ft" />
                        </div>
                        <div className="space-y-2">
                          <Label>Gated Community (Yes/No)</Label>
                          <Select value={jvFormData.villaConstruction?.gatedCommunity === true ? "yes" : jvFormData.villaConstruction?.gatedCommunity === false ? "no" : ""} onValueChange={(v) => setJvFormData((p) => ({ ...p, villaConstruction: { ...p.villaConstruction, gatedCommunity: v === "yes" } }))}>
                            <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                            <SelectContent><SelectItem value="yes">Yes</SelectItem><SelectItem value="no">No</SelectItem></SelectContent>
                          </Select>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Type-specific: Commercial */}
                  {jvFormData.developmentType === "commercial_construction" && (
                    <div>
                      <h3 className="font-semibold mb-4">Commercial Construction</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label>Office / Retail / Mixed-Use</Label>
                          <Input value={jvFormData.commercialConstruction?.officeRetailMixedUse ?? ""} onChange={(e) => setJvFormData((p) => ({ ...p, commercialConstruction: { ...p.commercialConstruction, officeRetailMixedUse: e.target.value } }))} />
                        </div>
                        <div className="space-y-2">
                          <Label>Total Built-up Potential</Label>
                          <Input value={jvFormData.commercialConstruction?.totalBuiltUpPotential ?? ""} onChange={(e) => setJvFormData((p) => ({ ...p, commercialConstruction: { ...p.commercialConstruction, totalBuiltUpPotential: e.target.value } }))} />
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex justify-between pt-6">
                    <Link href="/seller/listings/create/step1">
                      <Button variant="outline" type="button"><ArrowLeft className="h-4 w-4 mr-2" /> Back</Button>
                    </Link>
                    <Button type="submit" data-testid="button-next">Next: Photos & Videos <ArrowRight className="h-4 w-4 ml-2" /></Button>
                  </div>
                </>
              ) : (
                <>
              {/* Room Details */}
              <div>
                <h3 className="font-semibold mb-4">Room Configuration</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
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
                        <SelectItem value="4">4 BHK</SelectItem>
                        <SelectItem value="5">5+ BHK</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bathrooms">Bathrooms *</Label>
                    <Select
                      value={formData.bathrooms}
                      onValueChange={(value) =>
                        setFormData({ ...formData, bathrooms: value })
                      }
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
                      onValueChange={(value) =>
                        setFormData({ ...formData, balconies: value })
                      }
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

              {/* Area Details */}
              <div>
                <h3 className="font-semibold mb-4">Area Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="carpetArea">Carpet Area (sq ft) *</Label>
                    <Input
                      id="carpetArea"
                      type="number"
                      placeholder="1200"
                      value={formData.carpetArea}
                      onChange={(e) =>
                        setFormData({ ...formData, carpetArea: e.target.value })
                      }
                      data-testid="input-carpet-area"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="builtUpArea">Built-up Area (sq ft)</Label>
                    <Input
                      id="builtUpArea"
                      type="number"
                      placeholder="1500"
                      value={formData.builtUpArea}
                      onChange={(e) =>
                        setFormData({ ...formData, builtUpArea: e.target.value })
                      }
                      data-testid="input-builtup-area"
                    />
                  </div>
                </div>
              </div>

              {/* Floor Details */}
              <div>
                <h3 className="font-semibold mb-4">Floor & Facing</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="floorNumber">Floor Number *</Label>
                    <Input
                      id="floorNumber"
                      type="number"
                      placeholder="3"
                      value={formData.floorNumber}
                      onChange={(e) =>
                        setFormData({ ...formData, floorNumber: e.target.value })
                      }
                      data-testid="input-floor-number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="totalFloors">Total Floors</Label>
                    <Input
                      id="totalFloors"
                      type="number"
                      placeholder="10"
                      value={formData.totalFloors}
                      onChange={(e) =>
                        setFormData({ ...formData, totalFloors: e.target.value })
                      }
                      data-testid="input-total-floors"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="facing">Facing *</Label>
                    <Select
                      value={formData.facing}
                      onValueChange={(value) =>
                        setFormData({ ...formData, facing: value })
                      }
                    >
                      <SelectTrigger id="facing" data-testid="select-facing">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="north">North</SelectItem>
                        <SelectItem value="south">South</SelectItem>
                        <SelectItem value="east">East</SelectItem>
                        <SelectItem value="west">West</SelectItem>
                        <SelectItem value="northeast">North-East</SelectItem>
                        <SelectItem value="northwest">North-West</SelectItem>
                        <SelectItem value="southeast">South-East</SelectItem>
                        <SelectItem value="southwest">South-West</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Furnishing & Parking */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="furnishing">Furnishing *</Label>
                  <Select
                    value={formData.furnishing}
                    onValueChange={(value) =>
                      setFormData({ ...formData, furnishing: value })
                    }
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
                  <Label htmlFor="parking">Parking *</Label>
                  <Select
                    value={formData.parking}
                    onValueChange={(value) =>
                      setFormData({ ...formData, parking: value })
                    }
                  >
                    <SelectTrigger id="parking" data-testid="select-parking">
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="0">No Parking</SelectItem>
                      <SelectItem value="1">1 Covered</SelectItem>
                      <SelectItem value="2">2 Covered</SelectItem>
                      <SelectItem value="open">Open Parking</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Possession Status & Property Age */}
              <div>
                <h3 className="font-semibold mb-4">Possession & Construction Status</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="possessionStatus">Possession Status *</Label>
                    <Select
                      value={formData.possessionStatus}
                      onValueChange={(value) =>
                        setFormData({ ...formData, possessionStatus: value })
                      }
                    >
                      <SelectTrigger id="possessionStatus" data-testid="select-possession-status">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ready-to-move">Ready to Move</SelectItem>
                        <SelectItem value="under-construction">Under Construction</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {formData.possessionStatus === "under-construction" && (
                    <div className="space-y-2">
                      <Label htmlFor="expectedPossessionDate">Expected Possession Date</Label>
                      <Input
                        id="expectedPossessionDate"
                        type="month"
                        value={formData.expectedPossessionDate}
                        onChange={(e) =>
                          setFormData({ ...formData, expectedPossessionDate: e.target.value })
                        }
                        data-testid="input-expected-possession-date"
                      />
                    </div>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="ageOfProperty">Property Age *</Label>
                    <Select
                      value={formData.ageOfProperty}
                      onValueChange={(value) =>
                        setFormData({ ...formData, ageOfProperty: value })
                      }
                    >
                      <SelectTrigger id="ageOfProperty" data-testid="select-property-age">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New Construction</SelectItem>
                        <SelectItem value="0-1">Less than 1 year</SelectItem>
                        <SelectItem value="1-5">1-5 years</SelectItem>
                        <SelectItem value="5-10">5-10 years</SelectItem>
                        <SelectItem value="10+">10+ years</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* New Construction Toggle */}
                <div className="flex items-center space-x-3 mt-4 p-4 border rounded-lg bg-muted/30">
                  <Checkbox
                    id="isNewConstruction"
                    checked={formData.isNewConstruction}
                    onCheckedChange={(checked) =>
                      setFormData({ ...formData, isNewConstruction: checked === true })
                    }
                    data-testid="checkbox-new-construction"
                  />
                  <div>
                    <Label
                      htmlFor="isNewConstruction"
                      className="font-medium cursor-pointer"
                    >
                      This is a New Construction property
                    </Label>
                    <p className="text-xs text-muted-foreground mt-1">
                      Check this if the property is a newly built project from a developer/builder
                    </p>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h3 className="font-semibold mb-4">Amenities</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {amenitiesList.map((amenity) => (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Checkbox
                        id={amenity}
                        checked={formData.amenities.includes(amenity)}
                        onCheckedChange={() => toggleAmenity(amenity)}
                        data-testid={`checkbox-${amenity.toLowerCase().replace(/\s/g, "-")}`}
                      />
                      <Label
                        htmlFor={amenity}
                        className="text-sm font-normal cursor-pointer"
                      >
                        {amenity}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between pt-6">
                <Link href="/seller/listings/create/step1">
                  <Button variant="outline" type="button" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back
                  </Button>
                </Link>
                <Button type="submit" data-testid="button-next">
                  Next: Photos & Videos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
                </>
              )}
            </form>
          </Card>
        </div>
    </main>
  );
}
