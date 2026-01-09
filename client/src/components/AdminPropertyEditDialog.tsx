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
      bedrooms: formData.bedrooms ? Number(formData.bedrooms) : undefined,
      bathrooms: formData.bathrooms ? Number(formData.bathrooms) : undefined,
      balconies: formData.balconies ? Number(formData.balconies) : undefined,
      floor: formData.floor ? Number(formData.floor) : undefined,
      totalFloors: formData.totalFloors ? Number(formData.totalFloors) : undefined,
      ageOfProperty: formData.ageOfProperty ? Number(formData.ageOfProperty) : undefined,
      latitude: formData.latitude ? parseFloat(formData.latitude as any) : undefined,
      longitude: formData.longitude ? parseFloat(formData.longitude as any) : undefined,
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
                  <SelectItem value="house">House</SelectItem>
                  <SelectItem value="villa">Villa</SelectItem>
                  <SelectItem value="plot">Plot</SelectItem>
                  <SelectItem value="commercial">Commercial</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="shop">Shop</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="industrial">Industrial</SelectItem>
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
              <Label htmlFor="area">Area (sqft) *</Label>
              <Input
                id="area"
                type="number"
                value={formData.area || ""}
                onChange={(e) => setFormData({ ...formData, area: Number(e.target.value) })}
                required
              />
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
