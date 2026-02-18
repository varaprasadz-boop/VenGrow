import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import type { Property } from "@shared/schema";
import {
  MEASUREMENT_UNITS,
  FLOORING_OPTIONS,
  VIEW_OPTIONS,
  TENANTS_PREFERRED_OPTIONS,
  LOCK_IN_MONTHS_OPTIONS,
  NEGOTIABLE_OPTIONS,
} from "@/constants/property-options";

interface AdminPropertyEditDialogProps {
  property: Property | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdminPropertyEditDialog({ property, open, onOpenChange }: AdminPropertyEditDialogProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<Property>>({});

  useEffect(() => {
    if (property && property.id) {
      setFormData({
        title: property.title || "",
        description: property.description || "",
        propertyType: property.propertyType || "",
        transactionType: property.transactionType || "",
        price: property.price || 0,
        pricePerSqft: property.pricePerSqft || undefined,
        area: property.area || 0,
        areaUnit: (property as { areaUnit?: string }).areaUnit || "Sq-ft",
        flooring: (property as { flooring?: string }).flooring || undefined,
        bedrooms: property.bedrooms || undefined,
        bathrooms: property.bathrooms || undefined,
        balconies: property.balconies || undefined,
        floor: property.floor || undefined,
        totalFloors: property.totalFloors || undefined,
        facing: property.facing || "",
        furnishing: property.furnishing || "",
        ageOfProperty: property.ageOfProperty || undefined,
        possessionStatus: property.possessionStatus || "",
        address: property.address || "",
        locality: property.locality || "",
        city: property.city || "",
        state: property.state || "",
        pincode: property.pincode || "",
        latitude: property.latitude ? String(property.latitude) : "",
        longitude: property.longitude ? String(property.longitude) : "",
        amenities: property.amenities || [],
        highlights: property.highlights || [],
        youtubeVideoUrl: property.youtubeVideoUrl || "",
        status: property.status || "draft",
        workflowStatus: property.workflowStatus || "draft",
        isVerified: property.isVerified || false,
        isFeatured: property.isFeatured || false,
        slug: property.slug || "",
        nearbyLandmark: (property as any).nearbyLandmark || "",
        superBuiltUpArea: (property as any).superBuiltUpArea ?? undefined,
        carParkingCount: (property as any).carParkingCount ?? undefined,
        maintenanceCharges: (property as any).maintenanceCharges ?? undefined,
        viewType: (property as any).viewType || "",
        numberOfLifts: (property as any).numberOfLifts ?? undefined,
        isNegotiable: (property as any).isNegotiable ?? undefined,
        securityDeposit: (property as any).securityDeposit ?? undefined,
        lockInMonths: (property as any).lockInMonths ?? undefined,
        tenantsPreferred: (property as any).tenantsPreferred || "",
        negotiableRent: (property as any).negotiableRent || "",
        brokerageBothSides: (property as any).brokerageBothSides || "",
        disclosure: (property as any).disclosure || "",
        isResale: (property as any).isResale ?? undefined,
        totalFlats: (property as any).totalFlats ?? undefined,
        flatsOnFloor: (property as any).flatsOnFloor ?? undefined,
        totalVillas: (property as any).totalVillas ?? undefined,
        isCornerProperty: (property as any).isCornerProperty ?? undefined,
        roadWidthFeet: (property as any).roadWidthFeet ?? undefined,
        liftsAvailable: (property as any).liftsAvailable ?? undefined,
        availableFrom: (property as any).availableFrom || "",
        plotLength: (property as any).plotLength ?? undefined,
        plotBreadth: (property as any).plotBreadth ?? undefined,
        isCornerPlot: (property as any).isCornerPlot ?? undefined,
        roadWidthPlotMeters: (property as any).roadWidthPlotMeters ?? undefined,
        clubHouseAvailable: (property as any).clubHouseAvailable ?? undefined,
        floorAllowedConstruction: (property as any).floorAllowedConstruction ?? undefined,
        soilType: (property as any).soilType || "",
        fencing: (property as any).fencing ?? undefined,
        waterSource: (property as any).waterSource || "",
        titleClear: (property as any).titleClear ?? undefined,
        farmHouse: (property as any).farmHouse ?? undefined,
        approachRoadType: (property as any).approachRoadType || "",
        distanceFromNearestTown: (property as any).distanceFromNearestTown || "",
        farmProjectName: (property as any).farmProjectName || "",
      });
    }
  }, [property]);

  const updateMutation = useMutation({
    mutationFn: async (data: Partial<Property>) => {
      if (!property || !property.id) {
        console.error("AdminPropertyEditDialog: Property or ID missing", { property, hasId: !!property?.id });
        throw new Error("Property not found or property ID is missing");
      }
      
      console.log("AdminPropertyEditDialog: Updating property", { propertyId: property.id, data });
      const response = await apiRequest("PATCH", `/api/properties/${property.id}`, data);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("AdminPropertyEditDialog: Update failed", { 
          status: response.status, 
          statusText: response.statusText,
          error: errorData 
        });
        throw new Error(errorData.error || `Failed to update property: ${response.status} ${response.statusText}`);
      }
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/properties/${property?.id}`] });
      queryClient.invalidateQueries({ queryKey: ["/api/properties"] });
      toast({
        title: "Property updated successfully",
        description: "The property has been updated.",
      });
      onOpenChange(false);
    },
    onError: (error: any) => {
      toast({
        title: "Failed to update property",
        description: error?.message || "Please try again",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!property || !property.id) {
      toast({
        title: "Error",
        description: "Property ID is missing. Cannot update property.",
        variant: "destructive",
      });
      return;
    }

    // Convert string numbers to actual numbers
    const submitData: any = {
      ...formData,
      price: formData.price ? Number(formData.price) : undefined,
      pricePerSqft: formData.pricePerSqft ? Number(formData.pricePerSqft) : undefined,
      area: formData.area ? Number(formData.area) : undefined,
      areaUnit: (formData as { areaUnit?: string }).areaUnit || undefined,
      flooring: (formData as { flooring?: string }).flooring || undefined,
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
      balconies: formData.balconies ? Number(formData.balconies) : undefined,
      floor: formData.floor ? Number(formData.floor) : undefined,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
      ageOfProperty: formData.ageOfProperty ? Number(formData.ageOfProperty) : undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude as any) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude as any) : undefined,
      superBuiltUpArea: (formData as any).superBuiltUpArea ? Number((formData as any).superBuiltUpArea) : undefined,
      carParkingCount: (formData as any).carParkingCount != null ? Number((formData as any).carParkingCount) : undefined,
      maintenanceCharges: (formData as any).maintenanceCharges ? Number((formData as any).maintenanceCharges) : undefined,
      numberOfLifts: (formData as any).numberOfLifts != null ? Number((formData as any).numberOfLifts) : undefined,
      securityDeposit: (formData as any).securityDeposit ? Number((formData as any).securityDeposit) : undefined,
      lockInMonths: (formData as any).lockInMonths != null ? Number((formData as any).lockInMonths) : undefined,
      isResale: (formData as any).isResale,
      totalFlats: (formData as any).totalFlats != null ? Number((formData as any).totalFlats) : undefined,
      flatsOnFloor: (formData as any).flatsOnFloor != null ? Number((formData as any).flatsOnFloor) : undefined,
      totalVillas: (formData as any).totalVillas != null ? Number((formData as any).totalVillas) : undefined,
      isCornerProperty: (formData as any).isCornerProperty,
      roadWidthFeet: (formData as any).roadWidthFeet != null ? Number((formData as any).roadWidthFeet) : undefined,
      liftsAvailable: (formData as any).liftsAvailable,
      availableFrom: (formData as any).availableFrom?.trim() || undefined,
      plotLength: (formData as any).plotLength != null ? Number((formData as any).plotLength) : undefined,
      plotBreadth: (formData as any).plotBreadth != null ? Number((formData as any).plotBreadth) : undefined,
      isCornerPlot: (formData as any).isCornerPlot,
      roadWidthPlotMeters: (formData as any).roadWidthPlotMeters != null ? Number((formData as any).roadWidthPlotMeters) : undefined,
      clubHouseAvailable: (formData as any).clubHouseAvailable,
      floorAllowedConstruction: (formData as any).floorAllowedConstruction != null ? Number((formData as any).floorAllowedConstruction) : undefined,
      soilType: (formData as any).soilType || undefined,
      fencing: (formData as any).fencing,
      waterSource: (formData as any).waterSource || undefined,
      titleClear: (formData as any).titleClear,
      farmHouse: (formData as any).farmHouse,
      approachRoadType: (formData as any).approachRoadType || undefined,
      distanceFromNearestTown: (formData as any).distanceFromNearestTown || undefined,
      farmProjectName: (formData as any).farmProjectName || undefined,
    };

    // Remove empty strings
    Object.keys(submitData).forEach((key) => {
      if (submitData[key] === "" || submitData[key] === null) {
        delete submitData[key];
      }
    });

    updateMutation.mutate(submitData);
  };

  if (!property || !property.id) {
    console.error("AdminPropertyEditDialog: Property or property.id is missing", property);
    return null;
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Property (Admin)</DialogTitle>
          <DialogDescription>
            Edit any property field. Changes will be applied immediately.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            {/* Basic Information */}
            <div className="space-y-2">
              <Label htmlFor="title">Title *</Label>
              <Input
                id="title"
                value={formData.title || ""}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="slug">Slug</Label>
              <Input
                id="slug"
                value={formData.slug || ""}
                onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="propertyType">Property Type *</Label>
              <Select
                value={formData.propertyType || ""}
                onValueChange={(value) => setFormData({ ...formData, propertyType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select property type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="apartment">Apartment</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="independent_house">Independent House</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="farmhouse">Farmhouse</SelectItem>
                  <SelectItem value="penthouse">Penthouse</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="transactionType">Transaction Type *</Label>
              <Select
                value={formData.transactionType || ""}
                onValueChange={(value) => setFormData({ ...formData, transactionType: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select transaction type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="sale">Sale</SelectItem>
                  <SelectItem value="rent">Rent</SelectItem>
                  <SelectItem value="lease">Lease</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="price">Price *</Label>
              <Input
                id="price"
                type="number"
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pricePerSqft">Price per Sqft</Label>
              <Input
                id="pricePerSqft"
                type="number"
                value={formData.pricePerSqft || ""}
                onChange={(e) => setFormData({ ...formData, pricePerSqft: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="area">Area ({(formData as { areaUnit?: string }).areaUnit || "Sq-ft"}) *</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ""}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="areaUnit">Measuring in</Label>
              <Select
                value={(formData as { areaUnit?: string }).areaUnit || "Sq-ft"}
                onValueChange={(value) => setFormData({ ...formData, areaUnit: value } as Partial<Property>)}
              >
                <SelectTrigger id="areaUnit">
                  <SelectValue placeholder="Select unit" />
                </SelectTrigger>
                <SelectContent>
                  {MEASUREMENT_UNITS.map((unit) => (
                    <SelectItem key={unit} value={unit}>
                      {unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="flooring">Flooring</Label>
              <Select
                value={(formData as { flooring?: string }).flooring || "none"}
                onValueChange={(value) => setFormData({ ...formData, flooring: value === "none" ? undefined : value } as Partial<Property>)}
              >
                <SelectTrigger id="flooring">
                  <SelectValue placeholder="Select flooring" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {FLOORING_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>
                      {opt}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <Label htmlFor="address">Address *</Label>
              <Input
                id="address"
                value={formData.address || ""}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="locality">Locality</Label>
              <Input
                id="locality"
                value={formData.locality || ""}
                onChange={(e) => setFormData({ ...formData, locality: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="city">City *</Label>
              <Input
                id="city"
                value={formData.city || ""}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">State *</Label>
              <Input
                id="state"
                value={formData.state || ""}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="pincode">Pincode</Label>
              <Input
                id="pincode"
                value={formData.pincode || ""}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
              />
            </div>

            {/* Property Details */}
            <div className="space-y-2">
              <Label htmlFor="bedrooms">Bedrooms</Label>
              <Input
                id="bedrooms"
                type="number"
                value={formData.bedrooms || ""}
                onChange={(e) => setFormData({ ...formData, bedrooms: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="bathrooms">Bathrooms</Label>
              <Input
                id="bathrooms"
                type="number"
                value={formData.bathrooms || ""}
                onChange={(e) => setFormData({ ...formData, bathrooms: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="balconies">Balconies</Label>
              <Input
                id="balconies"
                type="number"
                value={formData.balconies || ""}
                onChange={(e) => setFormData({ ...formData, balconies: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="floor">Floor</Label>
              <Input
                id="floor"
                type="number"
                value={formData.floor || ""}
                onChange={(e) => setFormData({ ...formData, floor: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalFloors">Total Floors</Label>
              <Input
                id="totalFloors"
                type="number"
                value={formData.totalFloors || ""}
                onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="facing">Facing</Label>
              <Input
                id="facing"
                value={formData.facing || ""}
                onChange={(e) => setFormData({ ...formData, facing: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="furnishing">Furnishing</Label>
              <Select
                value={formData.furnishing || ""}
                onValueChange={(value) => setFormData({ ...formData, furnishing: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select furnishing" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="furnished">Furnished</SelectItem>
                  <SelectItem value="semi-furnished">Semi-Furnished</SelectItem>
                  <SelectItem value="unfurnished">Unfurnished</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ageOfProperty">Age of Property (years)</Label>
              <Input
                id="ageOfProperty"
                type="number"
                value={formData.ageOfProperty || ""}
                onChange={(e) => setFormData({ ...formData, ageOfProperty: Number(e.target.value) })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="possessionStatus">Possession Status</Label>
              <Input
                id="possessionStatus"
                value={formData.possessionStatus || ""}
                onChange={(e) => setFormData({ ...formData, possessionStatus: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="youtubeVideoUrl">YouTube Video URL</Label>
              <Input
                id="youtubeVideoUrl"
                value={formData.youtubeVideoUrl || ""}
                onChange={(e) => setFormData({ ...formData, youtubeVideoUrl: e.target.value })}
              />
            </div>

            {/* Coordinates */}
            <div className="space-y-2">
              <Label htmlFor="latitude">Latitude</Label>
              <Input
                id="latitude"
                type="number"
                step="any"
                value={formData.latitude || ""}
                onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="longitude">Longitude</Label>
              <Input
                id="longitude"
                type="number"
                step="any"
                value={formData.longitude || ""}
                onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
              />
            </div>

            {/* Additional (Property Posting Details) */}
            <div className="space-y-2">
              <Label htmlFor="nearbyLandmark">Nearby Landmark</Label>
              <Input
                id="nearbyLandmark"
                value={(formData as any).nearbyLandmark || ""}
                onChange={(e) => setFormData({ ...formData, nearbyLandmark: e.target.value } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="superBuiltUpArea">Super Built-up Area</Label>
              <Input
                id="superBuiltUpArea"
                type="number"
                value={(formData as any).superBuiltUpArea ?? ""}
                onChange={(e) => setFormData({ ...formData, superBuiltUpArea: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="carParkingCount">Car Parking Count</Label>
              <Input
                id="carParkingCount"
                type="number"
                min={0}
                value={(formData as any).carParkingCount ?? ""}
                onChange={(e) => setFormData({ ...formData, carParkingCount: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="maintenanceCharges">Maintenance Charges (₹/month)</Label>
              <Input
                id="maintenanceCharges"
                type="number"
                value={(formData as any).maintenanceCharges ?? ""}
                onChange={(e) => setFormData({ ...formData, maintenanceCharges: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="viewType">View</Label>
              <Select
                value={(formData as any).viewType || ""}
                onValueChange={(value) => setFormData({ ...formData, viewType: value } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select view" />
                </SelectTrigger>
                <SelectContent>
                  {VIEW_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="numberOfLifts">No. of Lifts</Label>
              <Input
                id="numberOfLifts"
                type="number"
                min={0}
                value={(formData as any).numberOfLifts ?? ""}
                onChange={(e) => setFormData({ ...formData, numberOfLifts: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label>Price Negotiable (Sale)</Label>
              <Select
                value={(formData as any).isNegotiable === true ? "true" : (formData as any).isNegotiable === false ? "false" : ""}
                onValueChange={(value) => setFormData({ ...formData, isNegotiable: value === "true" ? true : value === "false" ? false : undefined } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="true">Yes</SelectItem>
                  <SelectItem value="false">No</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>New property or Resale (Sale)</Label>
              <Select
                value={(formData as any).isResale === true ? "resale" : (formData as any).isResale === false ? "new" : ""}
                onValueChange={(value) => setFormData({ ...formData, isResale: value === "resale" ? true : value === "new" ? false : undefined } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New property</SelectItem>
                  <SelectItem value="resale">Resale</SelectItem>
                </SelectContent>
              </Select>
            </div>
            {formData.propertyType === "apartment" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalFlats">Total Flats (Sale)</Label>
                  <Input
                    id="totalFlats"
                    type="number"
                    min={1}
                    value={(formData as any).totalFlats ?? ""}
                    onChange={(e) => setFormData({ ...formData, totalFlats: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="flatsOnFloor">Flats on the Floor (Sale)</Label>
                  <Input
                    id="flatsOnFloor"
                    type="number"
                    min={1}
                    value={(formData as any).flatsOnFloor ?? ""}
                    onChange={(e) => setFormData({ ...formData, flatsOnFloor: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
              </>
            )}
            {formData.propertyType === "villa" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalVillas">Total Villas</Label>
                  <Input
                    id="totalVillas"
                    type="number"
                    min={1}
                    value={(formData as any).totalVillas ?? ""}
                    onChange={(e) => setFormData({ ...formData, totalVillas: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isCornerProperty">Corner Property</Label>
                  <Select
                    value={(formData as any).isCornerProperty === true ? "yes" : (formData as any).isCornerProperty === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, isCornerProperty: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roadWidthFeet">Width of road facing the Villa (ft)</Label>
                  <Input
                    id="roadWidthFeet"
                    type="number"
                    min={0}
                    value={(formData as any).roadWidthFeet ?? ""}
                    onChange={(e) => setFormData({ ...formData, roadWidthFeet: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liftsAvailable">Lifts Available</Label>
                  <Select
                    value={(formData as any).liftsAvailable === true ? "yes" : (formData as any).liftsAvailable === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, liftsAvailable: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {formData.propertyType === "independent_house" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="totalVillasIH">Total Units</Label>
                  <Input
                    id="totalVillasIH"
                    type="number"
                    min={1}
                    value={(formData as any).totalVillas ?? ""}
                    onChange={(e) => setFormData({ ...formData, totalVillas: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isCornerPropertyIH">Corner Property</Label>
                  <Select
                    value={(formData as any).isCornerProperty === true ? "yes" : (formData as any).isCornerProperty === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, isCornerProperty: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roadWidthFeetIH">Width of road (ft)</Label>
                  <Input
                    id="roadWidthFeetIH"
                    type="number"
                    min={0}
                    value={(formData as any).roadWidthFeet ?? ""}
                    onChange={(e) => setFormData({ ...formData, roadWidthFeet: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="liftsAvailableIH">Lifts Available</Label>
                  <Select
                    value={(formData as any).liftsAvailable === true ? "yes" : (formData as any).liftsAvailable === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, liftsAvailable: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}
            {formData.propertyType === "plot" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="plotLength">Plot Length</Label>
                  <Input
                    id="plotLength"
                    type="number"
                    min={1}
                    value={(formData as any).plotLength ?? ""}
                    onChange={(e) => setFormData({ ...formData, plotLength: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="plotBreadth">Plot Breadth</Label>
                  <Input
                    id="plotBreadth"
                    type="number"
                    min={1}
                    value={(formData as any).plotBreadth ?? ""}
                    onChange={(e) => setFormData({ ...formData, plotBreadth: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="isCornerPlot">Corner Plot</Label>
                  <Select
                    value={(formData as any).isCornerPlot === true ? "yes" : (formData as any).isCornerPlot === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, isCornerPlot: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="roadWidthPlotMeters">Road width (m)</Label>
                  <Input
                    id="roadWidthPlotMeters"
                    type="number"
                    min={0}
                    value={(formData as any).roadWidthPlotMeters ?? ""}
                    onChange={(e) => setFormData({ ...formData, roadWidthPlotMeters: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clubHouseAvailable">Club House Available</Label>
                  <Select
                    value={(formData as any).clubHouseAvailable === true ? "yes" : (formData as any).clubHouseAvailable === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, clubHouseAvailable: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="floorAllowedConstruction">Floor allowed for Construction</Label>
                  <Input
                    id="floorAllowedConstruction"
                    type="number"
                    min={0}
                    value={(formData as any).floorAllowedConstruction ?? ""}
                    onChange={(e) => setFormData({ ...formData, floorAllowedConstruction: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
              </>
            )}
            {formData.propertyType === "commercial" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="roadWidthFeetComm">Width of Road (ft)</Label>
                  <Input
                    id="roadWidthFeetComm"
                    type="number"
                    min={0}
                    value={(formData as any).roadWidthFeet ?? ""}
                    onChange={(e) => setFormData({ ...formData, roadWidthFeet: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
                  />
                </div>
              </>
            )}
            {formData.propertyType === "farmhouse" && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="soilType">Soil Type</Label>
                  <Select
                    value={(formData as any).soilType || ""}
                    onValueChange={(value) => setFormData({ ...formData, soilType: value } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="red">Red</SelectItem>
                      <SelectItem value="black">Black</SelectItem>
                      <SelectItem value="sandy">Sandy</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="fencing">Fencing</Label>
                  <Select
                    value={(formData as any).fencing === true ? "yes" : (formData as any).fencing === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, fencing: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="waterSource">Water Source</Label>
                  <Select
                    value={(formData as any).waterSource || ""}
                    onValueChange={(value) => setFormData({ ...formData, waterSource: value } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="borewell">Borewell</SelectItem>
                      <SelectItem value="open_well">Open Well</SelectItem>
                      <SelectItem value="canal">Canal</SelectItem>
                      <SelectItem value="river">River</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="titleClear">Title Clear</Label>
                  <Select
                    value={(formData as any).titleClear === true ? "yes" : (formData as any).titleClear === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, titleClear: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmHouse">Farm House</Label>
                  <Select
                    value={(formData as any).farmHouse === true ? "yes" : (formData as any).farmHouse === false ? "no" : ""}
                    onValueChange={(value) => setFormData({ ...formData, farmHouse: value === "yes" ? true : value === "no" ? false : undefined } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="yes">Yes</SelectItem>
                      <SelectItem value="no">No</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="approachRoadType">Approach Road Type</Label>
                  <Select
                    value={(formData as any).approachRoadType || ""}
                    onValueChange={(value) => setFormData({ ...formData, approachRoadType: value } as Partial<Property>)}
                  >
                    <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="mud">Mud</SelectItem>
                      <SelectItem value="tar">Tar</SelectItem>
                      <SelectItem value="concrete">Concrete</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="distanceFromNearestTown">Distance from Nearest Town</Label>
                  <Input
                    id="distanceFromNearestTown"
                    value={(formData as any).distanceFromNearestTown ?? ""}
                    onChange={(e) => setFormData({ ...formData, distanceFromNearestTown: e.target.value } as Partial<Property>)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="farmProjectName">Farm Project Name</Label>
                  <Input
                    id="farmProjectName"
                    value={(formData as any).farmProjectName ?? ""}
                    onChange={(e) => setFormData({ ...formData, farmProjectName: e.target.value } as Partial<Property>)}
                  />
                </div>
              </>
            )}
            <div className="space-y-2">
              <Label htmlFor="availableFrom">Available From (Rent/Lease)</Label>
              <Input
                id="availableFrom"
                placeholder="immediate or YYYY-MM-DD"
                value={(formData as any).availableFrom ?? ""}
                onChange={(e) => setFormData({ ...formData, availableFrom: e.target.value } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="securityDeposit">Security Deposit (₹)</Label>
              <Input
                id="securityDeposit"
                type="number"
                value={(formData as any).securityDeposit ?? ""}
                onChange={(e) => setFormData({ ...formData, securityDeposit: e.target.value ? Number(e.target.value) : undefined } as Partial<Property>)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lockInMonths">Lock-in (months)</Label>
              <Select
                value={(formData as any).lockInMonths != null ? String((formData as any).lockInMonths) : ""}
                onValueChange={(value) => setFormData({ ...formData, lockInMonths: value ? Number(value) : undefined } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {LOCK_IN_MONTHS_OPTIONS.map((m) => (
                    <SelectItem key={m} value={String(m)}>{m} months</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="tenantsPreferred">Tenants Preferred</Label>
              <Select
                value={(formData as any).tenantsPreferred || ""}
                onValueChange={(value) => setFormData({ ...formData, tenantsPreferred: value } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {TENANTS_PREFERRED_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Negotiable Rent</Label>
              <Select
                value={(formData as any).negotiableRent || ""}
                onValueChange={(value) => setFormData({ ...formData, negotiableRent: value } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {NEGOTIABLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Brokerage Both Sides</Label>
              <Select
                value={(formData as any).brokerageBothSides || ""}
                onValueChange={(value) => setFormData({ ...formData, brokerageBothSides: value } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {NEGOTIABLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Disclosure</Label>
              <Select
                value={(formData as any).disclosure || ""}
                onValueChange={(value) => setFormData({ ...formData, disclosure: value } as Partial<Property>)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select" />
                </SelectTrigger>
                <SelectContent>
                  {NEGOTIABLE_OPTIONS.map((opt) => (
                    <SelectItem key={opt} value={opt}>{opt}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Status Fields (Admin Only) */}
            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "draft"}
                onValueChange={(value) => setFormData({ ...formData, status: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="pending_approval">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="expired">Expired</SelectItem>
                  <SelectItem value="sold">Sold</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="workflowStatus">Workflow Status</Label>
              <Select
                value={formData.workflowStatus || "draft"}
                onValueChange={(value) => setFormData({ ...formData, workflowStatus: value as any })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="draft">Draft</SelectItem>
                  <SelectItem value="submitted">Submitted</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="live">Live</SelectItem>
                  <SelectItem value="needs_reapproval">Needs Reapproval</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows={4}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex gap-6">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isVerified"
                checked={formData.isVerified || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isVerified: !!checked })}
              />
              <Label htmlFor="isVerified">Verified</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isFeatured"
                checked={formData.isFeatured || false}
                onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
              />
              <Label htmlFor="isFeatured">Featured</Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateMutation.isPending}>
              {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
