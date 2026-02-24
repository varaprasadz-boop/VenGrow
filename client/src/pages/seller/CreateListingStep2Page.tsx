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
import { ArrowRight, ArrowLeft, AlertCircle, Plus, Trash2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import type { PropertyCategory } from "@shared/schema";
import type { JvDetailsType } from "@shared/schema";

const expandedAmenitiesList = [
  "Air Conditioned", "Banquet Hall", "Bar/Lounge", "Cafeteria/Food Court",
  "Club House", "Concierge Services", "Conference Room", "DTH Television Facility",
  "Doorman", "Fingerprint Access", "Fireplace", "Full Glass Wall",
  "Golf Course", "Gymnasium", "Health club with Steam/Jacuzzi", "Helipad",
  "Hilltop", "House help accommodation", "Intercom Facility", "Internet/Wi-Fi Connectivity",
  "Island Kitchen Layout", "Jogging and Strolling Track", "Laundry Service", "Lift",
  "Maintenance Staff", "Outdoor Tennis Courts", "Park", "Piped Gas",
  "Power Back Up", "Private Garage", "Private Terrace/Garden", "Private Jacuzzi",
  "Private Pool", "RO Water System", "Rain Water Harvesting", "Reserved Parking",
  "Sea Facing", "Security", "Service/Goods Lift", "Sky Villa",
  "Skydeck", "Skyline View", "Smart Home", "Swimming Pool",
  "Theme Based Architecture", "Vaastu Compliant", "Visitor Parking", "Waste Disposal",
  "Water Front", "Water Storage", "Wine Cellar", "Wrap Around Balcony",
];

const facingOptions = [
  { value: "north", label: "North" },
  { value: "south", label: "South" },
  { value: "east", label: "East" },
  { value: "west", label: "West" },
  { value: "north-east", label: "North-East" },
  { value: "north-west", label: "North-West" },
  { value: "south-east", label: "South-East" },
  { value: "south-west", label: "South-West" },
];

const flooringOptions = [
  { value: "marble", label: "Marble" },
  { value: "vitrified", label: "Vitrified Tiles" },
  { value: "wooden", label: "Wooden" },
  { value: "granite", label: "Granite" },
  { value: "ceramic", label: "Ceramic Tiles" },
  { value: "mosaic", label: "Mosaic" },
  { value: "concrete", label: "Concrete" },
  { value: "stone", label: "Stone" },
  { value: "other", label: "Other" },
];

const overlookingOptions = [
  { value: "garden", label: "Garden" },
  { value: "pool", label: "Pool" },
  { value: "road", label: "Road" },
  { value: "not_available", label: "Not Available" },
];

const pgFacilitiesList = [
  "Geyser", "Washrooms", "Cupboard", "TV", "AC", "Cot", "Mattress", "Side Table", "Air Cooler",
];

const pgRulesList = [
  "Veg Only", "No Smoking", "Drinking alcohol not allowed",
  "Entry of opposite gender not allowed", "Guardian not allowed",
];

const pgServicesList = ["Laundry", "Room Cleaning", "Warden"];

const defaultJvDetails = (): JvDetailsType => ({
  common: {},
  developmentType: undefined,
});

function getCategorySlug(categories: PropertyCategory[], categoryId: string): string {
  const cat = categories.find(c => c.id === categoryId);
  return cat?.slug || "";
}

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
  const categorySlug = selectedCategory?.slug || "";
  const isJv = categorySlug === "joint-venture";
  const transactionType = step1Data?.transactionType || "sale";

  const [formData, setFormData] = useState({
    bedrooms: "",
    bathrooms: "",
    balconies: "",
    superBuiltUpArea: "",
    carpetArea: "",
    facing: "",
    floorNumber: "",
    totalFloors: "",
    flooring: "",
    carParkingCount: "",
    maintenanceCharges: "",
    overlookingType: "",
    furnishing: "",
    totalFlats: "",
    flatsOnFloor: "",
    isResale: "",
    possessionStatus: "",
    expectedPossessionDate: "",
    ageOfProperty: "",
    numberOfLifts: "",
    amenities: [] as string[],
    landArea: "",
    roomSizes: [] as { room: string; size: string }[],
    isCornerProperty: "",
    roadWidthFeet: "",
    totalVillas: "",
    liftsAvailable: "",
    plotLength: "",
    plotBreadth: "",
    isCornerPlot: "",
    roadWidthPlotMeters: "",
    floorAllowedConstruction: "",
    clubHouseAvailable: "",
    newProjectFloorPlans: [{ superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" }] as { superBuiltUpArea: string; carpetArea: string; bhk: string; bathrooms: string; balconies: string; totalPrice: string }[],
    pgSharingPricing: [
      { type: "single", rent: "", deposit: "" },
      { type: "two", rent: "", deposit: "" },
      { type: "three", rent: "", deposit: "" },
      { type: "four", rent: "", deposit: "" },
    ] as { type: string; rent: string; deposit: string }[],
    pgFacilities: [] as string[],
    pgRules: [] as string[],
    pgServices: [] as string[],
    pgCctv: "",
    pgBiometricEntry: "",
    pgSecurityGuard: "",
    pgFoodProvided: "",
    pgNonVegProvided: "",
    pgNoticePeriod: "",
    monthlyRent: "",
    leaseAmount: "",
    securityDeposit: "",
    lockInPeriod: "",
    availableFrom: "",
    tenantsPreferred: "",
    nonVegetarians: "",
    withPets: "",
    bachelors: "",
    ageOfBuilding: "",
    soilType: "",
    fencing: "",
    waterSource: "",
    titleClear: "",
    farmHouseAvailable: "",
    approachRoadType: "",
    widthOfRoad: "",
    distanceFromNearestTown: "",
  });

  const [jvFormData, setJvFormData] = useState<JvDetailsType>(defaultJvDetails);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast({ title: "Authentication Required", description: "Please log in to continue.", variant: "destructive" });
      navigate("/login");
      return;
    }
    try {
      const savedData = localStorage.getItem("createListingStep1");
      if (!savedData) {
        toast({ title: "Missing Data", description: "Please complete Step 1 first.", variant: "destructive" });
        navigate("/seller/listings/create/step1");
        return;
      }
      setStep1Data(JSON.parse(savedData));
    } catch (error) {
      console.error("Error loading step 1 data:", error);
      navigate("/seller/listings/create/step1");
    }
  }, [authLoading, isAuthenticated, navigate, toast]);

  useEffect(() => {
    if (!step1Data) return;
    try {
      const saved2 = localStorage.getItem("createListingStep2");
      if (saved2) {
        const parsed = JSON.parse(saved2);
        if (parsed?.isJv && parsed?.jvDetails) {
          setJvFormData({ ...defaultJvDetails(), ...parsed.jvDetails, common: { ...parsed.jvDetails?.common } });
        } else if (!parsed?.isJv) {
          setFormData(prev => ({ ...prev, ...parsed }));
        }
      }
    } catch (_) {}
  }, [step1Data]);

  const toggleListItem = (field: "amenities" | "pgFacilities" | "pgRules" | "pgServices", item: string) => {
    setFormData(prev => {
      const list = prev[field] as string[];
      return {
        ...prev,
        [field]: list.includes(item) ? list.filter(a => a !== item) : [...list, item],
      };
    });
  };

  const updateFloorPlan = (index: number, key: string, value: string) => {
    setFormData(prev => {
      const plans = [...prev.newProjectFloorPlans];
      plans[index] = { ...plans[index], [key]: value };
      return { ...prev, newProjectFloorPlans: plans };
    });
  };

  const addFloorPlan = () => {
    if (formData.newProjectFloorPlans.length >= 4) return;
    setFormData(prev => ({
      ...prev,
      newProjectFloorPlans: [...prev.newProjectFloorPlans, { superBuiltUpArea: "", carpetArea: "", bhk: "", bathrooms: "", balconies: "", totalPrice: "" }],
    }));
  };

  const removeFloorPlan = (index: number) => {
    if (formData.newProjectFloorPlans.length <= 1) return;
    setFormData(prev => ({
      ...prev,
      newProjectFloorPlans: prev.newProjectFloorPlans.filter((_, i) => i !== index),
    }));
  };

  const updateSharingPricing = (index: number, key: "rent" | "deposit", value: string) => {
    setFormData(prev => {
      const pricing = [...prev.pgSharingPricing];
      pricing[index] = { ...pricing[index], [key]: value };
      return { ...prev, pgSharingPricing: pricing };
    });
  };

  const updateRoomSize = (index: number, key: "room" | "size", value: string) => {
    setFormData(prev => {
      const sizes = [...prev.roomSizes];
      sizes[index] = { ...sizes[index], [key]: value };
      return { ...prev, roomSizes: sizes };
    });
  };

  useEffect(() => {
    if (!categorySlug || categorySlug === "joint-venture" || categorySlug === "pg-hostel" || categorySlug === "plots" || categorySlug === "commercial" || categorySlug === "new-projects") return;
    const bedroomVal = formData.bedrooms;
    if (!bedroomVal) return;
    const rooms: { room: string; size: string }[] = [];
    if (bedroomVal === "studio") {
      const studioExisting = formData.roomSizes.find(r => r.room === "Studio Room");
      rooms.push({ room: "Studio Room", size: studioExisting?.size || "" });
    } else if (bedroomVal === "0") {
      const roomExisting = formData.roomSizes.find(r => r.room === "Room");
      rooms.push({ room: "Room", size: roomExisting?.size || "" });
    } else {
      const bhkCount = parseInt(bedroomVal) || 0;
      for (let i = 1; i <= bhkCount; i++) {
        const existing = formData.roomSizes.find(r => r.room === `Bedroom ${i}`);
        rooms.push({ room: `Bedroom ${i}`, size: existing?.size || "" });
      }
    }
    const livingExisting = formData.roomSizes.find(r => r.room === "Living Room");
    rooms.push({ room: "Living Room", size: livingExisting?.size || "" });
    const kitchenExisting = formData.roomSizes.find(r => r.room === "Kitchen");
    rooms.push({ room: "Kitchen", size: kitchenExisting?.size || "" });
    if (JSON.stringify(rooms) !== JSON.stringify(formData.roomSizes)) {
      setFormData(prev => ({ ...prev, roomSizes: rooms }));
    }
  }, [formData.bedrooms, categorySlug]);

  const updateJvCommon = (key: keyof NonNullable<JvDetailsType["common"]>, value: unknown) => {
    setJvFormData((prev) => ({ ...prev, common: { ...prev.common, [key]: value } }));
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
      localStorage.setItem("createListingStep2", JSON.stringify({ ...formData, isJv: false, categorySlug }));
    }
    navigate("/seller/listings/create/step3");
  };

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

  const renderBHKSelect = (includeRK = false) => (
    <div className="space-y-2">
      <Label>No. of BHK *</Label>
      <Select value={formData.bedrooms} onValueChange={(v) => setFormData({ ...formData, bedrooms: v })}>
        <SelectTrigger data-testid="select-bedrooms"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {includeRK && <SelectItem value="0">1 RK</SelectItem>}
          <SelectItem value="studio">Studio</SelectItem>
          <SelectItem value="1">1 BHK</SelectItem>
          <SelectItem value="2">2 BHK</SelectItem>
          <SelectItem value="3">3 BHK</SelectItem>
          <SelectItem value="4">4 BHK</SelectItem>
          <SelectItem value="5">5+ BHK</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderBathroomsSelect = () => (
    <div className="space-y-2">
      <Label>No. of Bathrooms *</Label>
      <Select value={formData.bathrooms} onValueChange={(v) => setFormData({ ...formData, bathrooms: v })}>
        <SelectTrigger data-testid="select-bathrooms"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const renderBalconiesSelect = () => (
    <div className="space-y-2">
      <Label>No. of Balconies</Label>
      <Select value={formData.balconies} onValueChange={(v) => setFormData({ ...formData, balconies: v })}>
        <SelectTrigger data-testid="select-balconies"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {[0,1,2,3].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const renderAreaFields = (showLandArea = false) => (
    <>
      {showLandArea && (
        <div className="space-y-2">
          <Label>Land Area (sq ft)</Label>
          <Input type="number" placeholder="e.g., 2400" value={formData.landArea} onChange={(e) => setFormData({ ...formData, landArea: e.target.value })} data-testid="input-land-area" />
        </div>
      )}
      <div className="space-y-2">
        <Label>Super Built Up Area (sq ft)</Label>
        <Input type="number" placeholder="e.g., 1500" value={formData.superBuiltUpArea} onChange={(e) => setFormData({ ...formData, superBuiltUpArea: e.target.value })} data-testid="input-super-built-up-area" />
      </div>
      <div className="space-y-2">
        <Label>Carpet Area (sq ft)</Label>
        <Input type="number" placeholder="e.g., 1200" value={formData.carpetArea} onChange={(e) => setFormData({ ...formData, carpetArea: e.target.value })} data-testid="input-carpet-area" />
      </div>
    </>
  );

  const renderFacingSelect = () => (
    <div className="space-y-2">
      <Label>Facing</Label>
      <Select value={formData.facing} onValueChange={(v) => setFormData({ ...formData, facing: v })}>
        <SelectTrigger data-testid="select-facing"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {facingOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const renderFlooringSelect = () => (
    <div className="space-y-2">
      <Label>Flooring Type</Label>
      <Select value={formData.flooring} onValueChange={(v) => setFormData({ ...formData, flooring: v })}>
        <SelectTrigger data-testid="select-flooring"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {flooringOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const renderParkingSelect = () => (
    <div className="space-y-2">
      <Label>No. of Car Parking</Label>
      <Select value={formData.carParkingCount} onValueChange={(v) => setFormData({ ...formData, carParkingCount: v })}>
        <SelectTrigger data-testid="select-car-parking"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {[0,1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const renderMaintenanceInput = () => (
    <div className="space-y-2">
      <Label>Maintenance Charges (Rs./month)</Label>
      <Input type="number" placeholder="e.g., 3000" value={formData.maintenanceCharges} onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value })} data-testid="input-maintenance-charges" />
    </div>
  );

  const renderOverlookingSelect = () => (
    <div className="space-y-2">
      <Label>Overlooking</Label>
      <Select value={formData.overlookingType} onValueChange={(v) => setFormData({ ...formData, overlookingType: v })}>
        <SelectTrigger data-testid="select-overlooking"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          {overlookingOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
        </SelectContent>
      </Select>
    </div>
  );

  const renderFurnishingSelect = () => (
    <div className="space-y-2">
      <Label>Furnishing Status</Label>
      <Select value={formData.furnishing} onValueChange={(v) => setFormData({ ...formData, furnishing: v })}>
        <SelectTrigger data-testid="select-furnishing"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="fully-furnished">Fully Furnished</SelectItem>
          <SelectItem value="semi-furnished">Semi Furnished</SelectItem>
          <SelectItem value="unfurnished">Unfurnished</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderResaleSelect = () => (
    <div className="space-y-2">
      <Label>New Property or Resale</Label>
      <Select value={formData.isResale} onValueChange={(v) => setFormData({ ...formData, isResale: v })}>
        <SelectTrigger data-testid="select-resale"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="new">New Property</SelectItem>
          <SelectItem value="resale">Resale</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderPossessionFields = () => (
    <>
      <div className="space-y-2">
        <Label>Possession Status</Label>
        <Select value={formData.possessionStatus} onValueChange={(v) => setFormData({ ...formData, possessionStatus: v })}>
          <SelectTrigger data-testid="select-possession-status"><SelectValue placeholder="Select" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="under-construction">Under Construction</SelectItem>
            <SelectItem value="ready-to-move">Ready to Move</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {formData.possessionStatus === "under-construction" && (
        <div className="space-y-2">
          <Label>When is the Possession?</Label>
          <Input type="month" value={formData.expectedPossessionDate} onChange={(e) => setFormData({ ...formData, expectedPossessionDate: e.target.value })} data-testid="input-expected-possession-date" />
        </div>
      )}
      {formData.possessionStatus === "ready-to-move" && (
        <div className="space-y-2">
          <Label>Age of Building</Label>
          <Select value={formData.ageOfProperty} onValueChange={(v) => setFormData({ ...formData, ageOfProperty: v })}>
            <SelectTrigger data-testid="select-age-of-property"><SelectValue placeholder="Select" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="0-1">Less than 1 year</SelectItem>
              <SelectItem value="1-3">1-3 years</SelectItem>
              <SelectItem value="3-5">3-5 years</SelectItem>
              <SelectItem value="5-10">5-10 years</SelectItem>
              <SelectItem value="10+">10+ years</SelectItem>
            </SelectContent>
          </Select>
        </div>
      )}
    </>
  );

  const renderAmenities = () => (
    <div>
      <h3 className="font-semibold mb-4">Amenities</h3>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {expandedAmenitiesList.map((amenity) => (
          <div key={amenity} className="flex items-center space-x-2">
            <Checkbox
              id={`amenity-${amenity}`}
              checked={formData.amenities.includes(amenity)}
              onCheckedChange={() => toggleListItem("amenities", amenity)}
              data-testid={`checkbox-amenity-${amenity.toLowerCase().replace(/[\s\/]/g, "-")}`}
            />
            <Label htmlFor={`amenity-${amenity}`} className="text-sm font-normal cursor-pointer">{amenity}</Label>
          </div>
        ))}
      </div>
    </div>
  );

  const renderRoomSizes = () => {
    if (formData.roomSizes.length === 0) return null;
    return (
      <div>
        <h3 className="font-semibold mb-4">Room Sizes</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {formData.roomSizes.map((rs, i) => (
            <div key={i} className="flex items-center gap-2">
              <Label className="w-28 text-sm shrink-0">{rs.room}</Label>
              <Input placeholder="e.g., 12x14 ft" value={rs.size} onChange={(e) => updateRoomSize(i, "size", e.target.value)} data-testid={`input-room-size-${i}`} />
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderAgeOfBuilding = () => (
    <div className="space-y-2">
      <Label>Age of the Building</Label>
      <Select value={formData.ageOfBuilding} onValueChange={(v) => setFormData({ ...formData, ageOfBuilding: v })}>
        <SelectTrigger data-testid="select-age-of-building"><SelectValue placeholder="Select" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="0-1">Less than 1 year</SelectItem>
          <SelectItem value="1-3">1-3 years</SelectItem>
          <SelectItem value="3-5">3-5 years</SelectItem>
          <SelectItem value="5-10">5-10 years</SelectItem>
          <SelectItem value="10+">10+ years</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  const renderRentLeaseFields = () => {
    const isRent = transactionType === "rent";
    const isLease = transactionType === "lease";
    if (!isRent && !isLease) return null;

    return (
      <>
        <div>
          <h3 className="font-semibold mb-4">{isRent ? "Rent Details" : "Lease Details"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {isRent && (
              <div className="space-y-2">
                <Label>Monthly Rent (Rs.) *</Label>
                <Input type="number" placeholder="e.g., 25000" value={formData.monthlyRent} onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })} data-testid="input-monthly-rent" />
              </div>
            )}
            {isLease && (
              <div className="space-y-2">
                <Label>Lease Amount (Rs.) *</Label>
                <Input type="number" placeholder="e.g., 500000" value={formData.leaseAmount} onChange={(e) => setFormData({ ...formData, leaseAmount: e.target.value })} data-testid="input-lease-amount" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Security Deposit (Rs.)</Label>
              <Input type="number" placeholder="e.g., 50000" value={formData.securityDeposit} onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })} data-testid="input-security-deposit" />
            </div>
            <div className="space-y-2">
              <Label>Lock-in Period</Label>
              <Select value={formData.lockInPeriod} onValueChange={(v) => setFormData({ ...formData, lockInPeriod: v })}>
                <SelectTrigger data-testid="select-lock-in-period"><SelectValue placeholder="Select months" /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,18,24,36].map(n => <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "month" : "months"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Available From</Label>
              <Input type="date" value={formData.availableFrom} onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })} data-testid="input-available-from" />
            </div>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-4">Tenant Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Tenants Preferred</Label>
              <Select value={formData.tenantsPreferred} onValueChange={(v) => setFormData({ ...formData, tenantsPreferred: v })}>
                <SelectTrigger data-testid="select-tenants-preferred"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="family">Family</SelectItem>
                  <SelectItem value="bachelor">Bachelor</SelectItem>
                  <SelectItem value="company">Company</SelectItem>
                  <SelectItem value="any">Anyone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Non-vegetarians</Label>
              <Select value={formData.nonVegetarians} onValueChange={(v) => setFormData({ ...formData, nonVegetarians: v })}>
                <SelectTrigger data-testid="select-non-vegetarians"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="doesnt-matter">Doesn't Matter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>With Pets</Label>
              <Select value={formData.withPets} onValueChange={(v) => setFormData({ ...formData, withPets: v })}>
                <SelectTrigger data-testid="select-with-pets"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="doesnt-matter">Doesn't Matter</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Bachelors</Label>
              <Select value={formData.bachelors} onValueChange={(v) => setFormData({ ...formData, bachelors: v })}>
                <SelectTrigger data-testid="select-bachelors"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                  <SelectItem value="doesnt-matter">Doesn't Matter</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </>
    );
  };

  const renderApartmentForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Room Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderBHKSelect()}
          {renderBathroomsSelect()}
          {renderBalconiesSelect()}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Area Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderAreaFields()}
        </div>
      </div>

      {renderRoomSizes()}

      <div>
        <h3 className="font-semibold mb-4">Property Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderFacingSelect()}
          <div className="space-y-2">
            <Label>Floor Number</Label>
            <Input type="number" placeholder="e.g., 5" value={formData.floorNumber} onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })} data-testid="input-floor-number" />
          </div>
          {renderFlooringSelect()}
          {renderParkingSelect()}
          {renderMaintenanceInput()}
          {renderOverlookingSelect()}
          {renderFurnishingSelect()}
        </div>
      </div>

      {renderRentLeaseFields()}

      <div>
        <h3 className="font-semibold mb-4">Building Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Total Flats</Label>
            <Input type="number" placeholder="e.g., 200" value={formData.totalFlats} onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value })} data-testid="input-total-flats" />
          </div>
          <div className="space-y-2">
            <Label>Total Floors</Label>
            <Select value={formData.totalFloors} onValueChange={(v) => setFormData({ ...formData, totalFloors: v })}>
              <SelectTrigger data-testid="select-total-floors"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Flats on Floor</Label>
            <Select value={formData.flatsOnFloor} onValueChange={(v) => setFormData({ ...formData, flatsOnFloor: v })}>
              <SelectTrigger data-testid="select-flats-on-floor"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {transactionType === "sale" && renderResaleSelect()}
          {renderAgeOfBuilding()}
          <div className="space-y-2">
            <Label>No. of Lifts</Label>
            <Select value={formData.numberOfLifts} onValueChange={(v) => setFormData({ ...formData, numberOfLifts: v })}>
              <SelectTrigger data-testid="select-lifts"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {[0,1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {transactionType === "sale" && (
        <div>
          <h3 className="font-semibold mb-4">Possession & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderPossessionFields()}
          </div>
        </div>
      )}

      {renderAmenities()}
    </>
  );

  const renderVillaForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Room Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderBHKSelect()}
          {renderBathroomsSelect()}
          {renderBalconiesSelect()}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Area Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderAreaFields(true)}
        </div>
      </div>

      {renderRoomSizes()}

      <div>
        <h3 className="font-semibold mb-4">Property Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderFacingSelect()}
          {renderFlooringSelect()}
          {renderParkingSelect()}
          {renderMaintenanceInput()}
          {renderOverlookingSelect()}
          {renderFurnishingSelect()}
        </div>
      </div>

      {renderRentLeaseFields()}

      <div>
        <h3 className="font-semibold mb-4">Villa Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Total Villas</Label>
            <Input type="number" placeholder="e.g., 50" value={formData.totalVillas} onChange={(e) => setFormData({ ...formData, totalVillas: e.target.value })} data-testid="input-total-villas" />
          </div>
          <div className="space-y-2">
            <Label>Total Floors</Label>
            <Select value={formData.totalFloors} onValueChange={(v) => setFormData({ ...formData, totalFloors: v })}>
              <SelectTrigger data-testid="select-total-floors"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Is Corner Property?</Label>
            <Select value={formData.isCornerProperty} onValueChange={(v) => setFormData({ ...formData, isCornerProperty: v })}>
              <SelectTrigger data-testid="select-corner-property"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Width of Road (in Feet)</Label>
            <Input type="number" placeholder="e.g., 30" value={formData.roadWidthFeet} onChange={(e) => setFormData({ ...formData, roadWidthFeet: e.target.value })} data-testid="input-road-width-feet" />
          </div>
          {transactionType === "sale" && renderResaleSelect()}
          {renderAgeOfBuilding()}
          <div className="space-y-2">
            <Label>Lifts Available?</Label>
            <Select value={formData.liftsAvailable} onValueChange={(v) => setFormData({ ...formData, liftsAvailable: v })}>
              <SelectTrigger data-testid="select-lifts-available"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {transactionType === "sale" && (
        <div>
          <h3 className="font-semibold mb-4">Possession & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderPossessionFields()}
          </div>
        </div>
      )}

      {renderAmenities()}
    </>
  );

  const renderPlotsForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Plot Dimensions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Plot Length (ft)</Label>
            <Input type="number" placeholder="e.g., 40" value={formData.plotLength} onChange={(e) => setFormData({ ...formData, plotLength: e.target.value })} data-testid="input-plot-length" />
          </div>
          <div className="space-y-2">
            <Label>Plot Breadth (ft)</Label>
            <Input type="number" placeholder="e.g., 60" value={formData.plotBreadth} onChange={(e) => setFormData({ ...formData, plotBreadth: e.target.value })} data-testid="input-plot-breadth" />
          </div>
          <div className="space-y-2">
            <Label>Is Corner Plot?</Label>
            <Select value={formData.isCornerPlot} onValueChange={(v) => setFormData({ ...formData, isCornerPlot: v })}>
              <SelectTrigger data-testid="select-corner-plot"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {renderFacingSelect()}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Plot Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {transactionType === "sale" && (
            <div className="space-y-2">
              <Label>Floor Allowed for Construction</Label>
              <Input type="number" placeholder="e.g., 4" value={formData.floorAllowedConstruction} onChange={(e) => setFormData({ ...formData, floorAllowedConstruction: e.target.value })} data-testid="input-floor-allowed" />
            </div>
          )}
          {transactionType === "rent" && (
            <div className="space-y-2">
              <Label>Floor Number</Label>
              <Input type="number" placeholder="e.g., 2" value={formData.floorNumber} onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })} data-testid="input-floor-number" />
            </div>
          )}
          {renderMaintenanceInput()}
          <div className="space-y-2">
            <Label>Width of Road Facing Plot (meters)</Label>
            <Input type="number" placeholder="e.g., 12" value={formData.roadWidthPlotMeters} onChange={(e) => setFormData({ ...formData, roadWidthPlotMeters: e.target.value })} data-testid="input-road-width-plot" />
          </div>
          {renderOverlookingSelect()}
          {transactionType === "sale" && renderResaleSelect()}
          <div className="space-y-2">
            <Label>Club House Available?</Label>
            <Select value={formData.clubHouseAvailable} onValueChange={(v) => setFormData({ ...formData, clubHouseAvailable: v })}>
              <SelectTrigger data-testid="select-club-house"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {(transactionType === "rent" || transactionType === "lease") && (
        <div>
          <h3 className="font-semibold mb-4">{transactionType === "rent" ? "Rent Details" : "Lease Details"}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {transactionType === "rent" && (
              <div className="space-y-2">
                <Label>Monthly Rent (Rs.)</Label>
                <Input type="number" placeholder="e.g., 25000" value={formData.monthlyRent} onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })} data-testid="input-monthly-rent" />
              </div>
            )}
            {transactionType === "lease" && (
              <div className="space-y-2">
                <Label>Lease Amount (Rs.)</Label>
                <Input type="number" placeholder="e.g., 500000" value={formData.leaseAmount} onChange={(e) => setFormData({ ...formData, leaseAmount: e.target.value })} data-testid="input-lease-amount" />
              </div>
            )}
            <div className="space-y-2">
              <Label>Security Deposit (Rs.)</Label>
              <Input type="number" placeholder="e.g., 50000" value={formData.securityDeposit} onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value })} data-testid="input-security-deposit" />
            </div>
            <div className="space-y-2">
              <Label>Lock-in Period (months)</Label>
              <Select value={formData.lockInPeriod} onValueChange={(v) => setFormData({ ...formData, lockInPeriod: v })}>
                <SelectTrigger data-testid="select-lock-in-period"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  {[1,2,3,4,5,6,7,8,9,10,11,12,18,24,36].map(n => <SelectItem key={n} value={String(n)}>{n} {n === 1 ? "month" : "months"}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Available From</Label>
              <Input type="date" value={formData.availableFrom} onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value })} data-testid="input-available-from" />
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderIndependentHouseForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Room Configuration</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderBHKSelect(true)}
          {renderBathroomsSelect()}
          {renderBalconiesSelect()}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Area Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderAreaFields()}
        </div>
      </div>

      {renderRoomSizes()}

      <div>
        <h3 className="font-semibold mb-4">Property Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderFacingSelect()}
          <div className="space-y-2">
            <Label>Floor Number</Label>
            <Input type="number" placeholder="e.g., 2" value={formData.floorNumber} onChange={(e) => setFormData({ ...formData, floorNumber: e.target.value })} data-testid="input-floor-number" />
          </div>
          {renderFlooringSelect()}
          {renderParkingSelect()}
          {renderMaintenanceInput()}
          {renderOverlookingSelect()}
          {renderFurnishingSelect()}
        </div>
      </div>

      {renderRentLeaseFields()}

      <div>
        <h3 className="font-semibold mb-4">Building Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Total Units</Label>
            <Input type="number" placeholder="e.g., 10" value={formData.totalFlats} onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value })} data-testid="input-total-units" />
          </div>
          <div className="space-y-2">
            <Label>Total Floors</Label>
            <Select value={formData.totalFloors} onValueChange={(v) => setFormData({ ...formData, totalFloors: v })}>
              <SelectTrigger data-testid="select-total-floors"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 10 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          {transactionType === "sale" && renderResaleSelect()}
          {renderAgeOfBuilding()}
        </div>
      </div>

      {transactionType === "sale" && (
        <div>
          <h3 className="font-semibold mb-4">Possession & Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {renderPossessionFields()}
          </div>
        </div>
      )}
    </>
  );

  const renderNewProjectsForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Floor Plans</h3>
        <p className="text-sm text-muted-foreground mb-4">Add up to 4 different floor plan configurations for this project.</p>
        {formData.newProjectFloorPlans.map((plan, index) => (
          <Card key={index} className="p-4 mb-4">
            <div className="flex items-center justify-between mb-3">
              <h4 className="font-medium">Floor Plan {index + 1}</h4>
              {formData.newProjectFloorPlans.length > 1 && (
                <Button variant="ghost" size="icon" onClick={() => removeFloorPlan(index)} data-testid={`button-remove-plan-${index}`}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label>Super Built Up Area (sq ft)</Label>
                <Input type="number" placeholder="1500" value={plan.superBuiltUpArea} onChange={(e) => updateFloorPlan(index, "superBuiltUpArea", e.target.value)} data-testid={`input-plan-sba-${index}`} />
              </div>
              <div className="space-y-2">
                <Label>Carpet Area (sq ft)</Label>
                <Input type="number" placeholder="1200" value={plan.carpetArea} onChange={(e) => updateFloorPlan(index, "carpetArea", e.target.value)} data-testid={`input-plan-carpet-${index}`} />
              </div>
              <div className="space-y-2">
                <Label>BHK</Label>
                <Select value={plan.bhk} onValueChange={(v) => updateFloorPlan(index, "bhk", v)}>
                  <SelectTrigger data-testid={`select-plan-bhk-${index}`}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n} BHK</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Bathrooms</Label>
                <Select value={plan.bathrooms} onValueChange={(v) => updateFloorPlan(index, "bathrooms", v)}>
                  <SelectTrigger data-testid={`select-plan-bath-${index}`}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {[1,2,3,4,5].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Balconies</Label>
                <Select value={plan.balconies} onValueChange={(v) => updateFloorPlan(index, "balconies", v)}>
                  <SelectTrigger data-testid={`select-plan-balcony-${index}`}><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent>
                    {[0,1,2,3].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Total Price (Rs.)</Label>
                <Input type="number" placeholder="8500000" value={plan.totalPrice} onChange={(e) => updateFloorPlan(index, "totalPrice", e.target.value)} data-testid={`input-plan-price-${index}`} />
              </div>
            </div>
          </Card>
        ))}
        {formData.newProjectFloorPlans.length < 4 && (
          <Button variant="outline" type="button" onClick={addFloorPlan} data-testid="button-add-floor-plan">
            <Plus className="h-4 w-4 mr-2" /> Add Floor Plan
          </Button>
        )}
      </div>

      <div>
        <h3 className="font-semibold mb-4">Project Features</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {renderFacingSelect()}
          {renderFlooringSelect()}
          {renderParkingSelect()}
          {renderMaintenanceInput()}
          <div className="space-y-2">
            <Label>Total Flats</Label>
            <Input type="number" placeholder="e.g., 200" value={formData.totalFlats} onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value })} data-testid="input-total-flats" />
          </div>
          <div className="space-y-2">
            <Label>Total Floors</Label>
            <Select value={formData.totalFloors} onValueChange={(v) => setFormData({ ...formData, totalFloors: v })}>
              <SelectTrigger data-testid="select-total-floors"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 50 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Flats on Floor</Label>
            <Select value={formData.flatsOnFloor} onValueChange={(v) => setFormData({ ...formData, flatsOnFloor: v })}>
              <SelectTrigger data-testid="select-flats-on-floor"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {Array.from({ length: 20 }, (_, i) => i + 1).map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>No. of Lifts</Label>
            <Select value={formData.numberOfLifts} onValueChange={(v) => setFormData({ ...formData, numberOfLifts: v })}>
              <SelectTrigger data-testid="select-lifts"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                {[0,1,2,3,4,5,6].map(n => <SelectItem key={n} value={String(n)}>{n}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Possession & Status</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {renderPossessionFields()}
        </div>
      </div>

      {renderAmenities()}
    </>
  );

  const renderFarmLandForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Land Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Land Area (sq.ft.)</Label>
            <Input type="number" placeholder="e.g., 5000" value={formData.landArea} onChange={(e) => setFormData({ ...formData, landArea: e.target.value })} data-testid="input-farm-land-area" />
          </div>
          {(transactionType === "rent" || transactionType === "lease") && (
            <>
              <div className="space-y-2">
                <Label>Plot Length (ft.)</Label>
                <Input type="number" placeholder="e.g., 100" value={formData.plotLength} onChange={(e) => setFormData({ ...formData, plotLength: e.target.value })} data-testid="input-farm-plot-length" />
              </div>
              <div className="space-y-2">
                <Label>Plot Breadth (ft.)</Label>
                <Input type="number" placeholder="e.g., 50" value={formData.plotBreadth} onChange={(e) => setFormData({ ...formData, plotBreadth: e.target.value })} data-testid="input-farm-plot-breadth" />
              </div>
            </>
          )}
          <div className="space-y-2">
            <Label>Fencing</Label>
            <Select value={formData.fencing} onValueChange={(v) => setFormData({ ...formData, fencing: v })}>
              <SelectTrigger data-testid="select-farm-fencing"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {transactionType === "sale" && (
        <div>
          <h3 className="font-semibold mb-4">Soil & Water Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Soil Type</Label>
              <Select value={formData.soilType} onValueChange={(v) => setFormData({ ...formData, soilType: v })}>
                <SelectTrigger data-testid="select-farm-soil-type"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="red">Red</SelectItem>
                  <SelectItem value="black">Black</SelectItem>
                  <SelectItem value="sandy">Sandy</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Water Source</Label>
              <Select value={formData.waterSource} onValueChange={(v) => setFormData({ ...formData, waterSource: v })}>
                <SelectTrigger data-testid="select-farm-water-source"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="borewell">Borewell</SelectItem>
                  <SelectItem value="open_well">Open Well</SelectItem>
                  <SelectItem value="canal">Canal</SelectItem>
                  <SelectItem value="river">River</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {transactionType === "sale" && (
        <div>
          <h3 className="font-semibold mb-4">Property Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Title Clear</Label>
              <Select value={formData.titleClear} onValueChange={(v) => setFormData({ ...formData, titleClear: v })}>
                <SelectTrigger data-testid="select-farm-title-clear"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Farm House Available</Label>
              <Select value={formData.farmHouseAvailable} onValueChange={(v) => setFormData({ ...formData, farmHouseAvailable: v })}>
                <SelectTrigger data-testid="select-farm-house-available"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      )}

      {transactionType === "sale" && (
        <div>
          <h3 className="font-semibold mb-4">Road & Access</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Approach Road Type</Label>
              <Select value={formData.approachRoadType} onValueChange={(v) => setFormData({ ...formData, approachRoadType: v })}>
                <SelectTrigger data-testid="select-farm-road-type"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="mud">Mud</SelectItem>
                  <SelectItem value="tar">Tar</SelectItem>
                  <SelectItem value="concrete">Concrete</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Width of the Road (meters)</Label>
              <Input type="number" placeholder="e.g., 6" value={formData.widthOfRoad} onChange={(e) => setFormData({ ...formData, widthOfRoad: e.target.value })} data-testid="input-farm-road-width" />
            </div>
            <div className="space-y-2">
              <Label>Distance from Nearest Town (km)</Label>
              <Input type="number" placeholder="e.g., 5" value={formData.distanceFromNearestTown} onChange={(e) => setFormData({ ...formData, distanceFromNearestTown: e.target.value })} data-testid="input-farm-distance-town" />
            </div>
          </div>
        </div>
      )}

      {(transactionType === "rent" || transactionType === "lease") && (
        <div>
          <h3 className="font-semibold mb-4">Property Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Clubhouse</Label>
              <Select value={formData.clubHouseAvailable} onValueChange={(v) => setFormData({ ...formData, clubHouseAvailable: v })}>
                <SelectTrigger data-testid="select-farm-clubhouse"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Is Corner Plot</Label>
              <Select value={formData.isCornerPlot} onValueChange={(v) => setFormData({ ...formData, isCornerPlot: v })}>
                <SelectTrigger data-testid="select-farm-corner-plot"><SelectValue placeholder="Select" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="yes">Yes</SelectItem>
                  <SelectItem value="no">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {renderFacingSelect()}
            <div className="space-y-2">
              <Label>Floor Allowed for Construction</Label>
              <Input type="number" placeholder="e.g., 3" value={formData.floorAllowedConstruction} onChange={(e) => setFormData({ ...formData, floorAllowedConstruction: e.target.value })} data-testid="input-farm-floor-allowed" />
            </div>
            {renderMaintenanceInput()}
            <div className="space-y-2">
              <Label>Width of Road Facing the Plot (meters)</Label>
              <Input type="number" placeholder="e.g., 12" value={formData.roadWidthPlotMeters} onChange={(e) => setFormData({ ...formData, roadWidthPlotMeters: e.target.value })} data-testid="input-farm-road-width-plot" />
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderCommercialForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Commercial Property Details</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label>Available Area (sq.ft.)</Label>
            <Input type="number" placeholder="e.g., 1500" value={formData.superBuiltUpArea} onChange={(e) => setFormData({ ...formData, superBuiltUpArea: e.target.value })} data-testid="input-available-area-commercial" />
          </div>
          {renderFacingSelect()}
          <div className="space-y-2">
            <Label>Width of Road Facing the Plot (meters)</Label>
            <Input type="number" placeholder="e.g., 12" value={formData.roadWidthPlotMeters} onChange={(e) => setFormData({ ...formData, roadWidthPlotMeters: e.target.value })} data-testid="input-road-width-commercial" />
          </div>
        </div>
      </div>

      {(transactionType === "rent" || transactionType === "lease") && (
        <div>
          <h3 className="font-semibold mb-4">Rental Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label>Monthly Rent (Rs.)</Label>
              <Input type="number" placeholder="e.g., 50000" value={formData.monthlyRent} onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })} data-testid="input-monthly-rent-commercial" />
            </div>
          </div>
        </div>
      )}
    </>
  );

  const renderPGForm = () => (
    <>
      <div>
        <h3 className="font-semibold mb-4">Sharing & Pricing</h3>
        <p className="text-sm text-muted-foreground mb-4">Set rent and deposit for each sharing type available.</p>
        <div className="space-y-4">
          {formData.pgSharingPricing.map((sharing, index) => (
            <div key={sharing.type} className="grid grid-cols-3 gap-4 items-end">
              <div className="space-y-2">
                <Label>{sharing.type === "single" ? "Single Sharing" : sharing.type === "two" ? "Two Sharing" : sharing.type === "three" ? "Three Sharing" : "Four Sharing"}</Label>
              </div>
              <div className="space-y-2">
                <Label>Rent (Rs./month)</Label>
                <Input type="number" placeholder="e.g., 8000" value={sharing.rent} onChange={(e) => updateSharingPricing(index, "rent", e.target.value)} data-testid={`input-pg-rent-${sharing.type}`} />
              </div>
              <div className="space-y-2">
                <Label>Deposit (Rs.)</Label>
                <Input type="number" placeholder="e.g., 16000" value={sharing.deposit} onChange={(e) => updateSharingPricing(index, "deposit", e.target.value)} data-testid={`input-pg-deposit-${sharing.type}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Facilities</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {pgFacilitiesList.map((facility) => (
            <div key={facility} className="flex items-center space-x-2">
              <Checkbox
                id={`facility-${facility}`}
                checked={formData.pgFacilities.includes(facility)}
                onCheckedChange={() => toggleListItem("pgFacilities", facility)}
                data-testid={`checkbox-facility-${facility.toLowerCase().replace(/\s/g, "-")}`}
              />
              <Label htmlFor={`facility-${facility}`} className="text-sm font-normal cursor-pointer">{facility}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Rules</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {pgRulesList.map((rule) => (
            <div key={rule} className="flex items-center space-x-2">
              <Checkbox
                id={`rule-${rule}`}
                checked={formData.pgRules.includes(rule)}
                onCheckedChange={() => toggleListItem("pgRules", rule)}
                data-testid={`checkbox-rule-${rule.toLowerCase().replace(/\s/g, "-")}`}
              />
              <Label htmlFor={`rule-${rule}`} className="text-sm font-normal cursor-pointer">{rule}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Safety & Security</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>CCTV Coverage</Label>
            <Select value={formData.pgCctv} onValueChange={(v) => setFormData({ ...formData, pgCctv: v })}>
              <SelectTrigger data-testid="select-pg-cctv"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Biometric Entry</Label>
            <Select value={formData.pgBiometricEntry} onValueChange={(v) => setFormData({ ...formData, pgBiometricEntry: v })}>
              <SelectTrigger data-testid="select-pg-biometric"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Security Guard</Label>
            <Select value={formData.pgSecurityGuard} onValueChange={(v) => setFormData({ ...formData, pgSecurityGuard: v })}>
              <SelectTrigger data-testid="select-pg-security"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Services</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {pgServicesList.map((service) => (
            <div key={service} className="flex items-center space-x-2">
              <Checkbox
                id={`service-${service}`}
                checked={formData.pgServices.includes(service)}
                onCheckedChange={() => toggleListItem("pgServices", service)}
                data-testid={`checkbox-service-${service.toLowerCase().replace(/\s/g, "-")}`}
              />
              <Label htmlFor={`service-${service}`} className="text-sm font-normal cursor-pointer">{service}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="font-semibold mb-4">Food & Notice</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Food Provided</Label>
            <Select value={formData.pgFoodProvided} onValueChange={(v) => setFormData({ ...formData, pgFoodProvided: v })}>
              <SelectTrigger data-testid="select-pg-food"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Non Veg Provided</Label>
            <Select value={formData.pgNonVegProvided} onValueChange={(v) => setFormData({ ...formData, pgNonVegProvided: v })}>
              <SelectTrigger data-testid="select-pg-nonveg"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="yes">Yes</SelectItem>
                <SelectItem value="no">No</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Notice Period</Label>
            <Select value={formData.pgNoticePeriod} onValueChange={(v) => setFormData({ ...formData, pgNoticePeriod: v })}>
              <SelectTrigger data-testid="select-pg-notice"><SelectValue placeholder="Select" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="1_week">1 Week</SelectItem>
                <SelectItem value="15_days">15 Days</SelectItem>
                <SelectItem value="1_month">1 Month</SelectItem>
                <SelectItem value="2_months">2 Months</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
    </>
  );

  const renderJvForm = () => (
    <>
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
                {facingOptions.map(o => <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>)}
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
    </>
  );

  const renderCategoryForm = () => {
    switch (categorySlug) {
      case "apartment":
      case "apartments":
        return renderApartmentForm();
      case "villa":
      case "villas":
        return renderVillaForm();
      case "plots":
      case "plot":
        return renderPlotsForm();
      case "independent-house":
      case "independent-houses":
        return renderIndependentHouseForm();
      case "new-projects":
      case "new-project":
        return renderNewProjectsForm();
      case "commercial":
        return renderCommercialForm();
      case "farm-land":
      case "farmland":
        return renderFarmLandForm();
      case "pg-hostel":
      case "pg":
      case "hostel":
        return renderPGForm();
      case "joint-venture":
        return renderJvForm();
      default:
        return renderApartmentForm();
    }
  };

  const getCategoryTitle = () => {
    switch (categorySlug) {
      case "apartment":
      case "apartments":
        return "Apartment Details";
      case "villa":
      case "villas":
        return "Villa Details";
      case "plots":
      case "plot":
        return "Plot Details";
      case "independent-house":
      case "independent-houses":
        return "Independent House Details";
      case "new-projects":
      case "new-project":
        return "New Project Details";
      case "commercial":
        return "Commercial Property Details";
      case "farm-land":
      case "farmland":
        return "Farm Land Details";
      case "pg-hostel":
      case "pg":
      case "hostel":
        return "PG / Hostel Details";
      case "joint-venture":
        return "Joint Venture / Development Details";
      default:
        return "Property Specifications";
    }
  };

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">1</div>
              <div className="h-1 flex-1 bg-primary"></div>
              <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">2</div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">3</div>
              <div className="h-1 flex-1 bg-muted"></div>
              <div className="h-8 w-8 rounded-full bg-muted text-muted-foreground flex items-center justify-center text-sm font-bold">4</div>
            </div>
            <p className="text-sm text-muted-foreground">Step 2 of 4: {getCategoryTitle()}</p>
          </div>

          <Card className="p-8">
            <h1 className="font-serif font-bold text-2xl mb-6">{getCategoryTitle()}</h1>

            <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
              {renderCategoryForm()}

              <div className="flex justify-between pt-6">
                <Link href="/seller/listings/create/step1">
                  <Button variant="outline" type="button" data-testid="button-back">
                    <ArrowLeft className="h-4 w-4 mr-2" /> Back
                  </Button>
                </Link>
                <Button type="submit" data-testid="button-next">
                  Next: Photos & Videos <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
    </main>
  );
}
