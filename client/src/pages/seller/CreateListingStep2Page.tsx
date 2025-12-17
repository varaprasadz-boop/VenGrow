import { useState } from "react";
import { Link, useLocation } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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
import { ArrowRight, ArrowLeft } from "lucide-react";

export default function CreateListingStep2Page() {
  const [, navigate] = useLocation();
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

  const toggleAmenity = (amenity: string) => {
    setFormData({
      ...formData,
      amenities: formData.amenities.includes(amenity)
        ? formData.amenities.filter((a) => a !== amenity)
        : [...formData.amenities, amenity],
    });
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
              Property Specifications
            </h1>

            <form className="space-y-6">
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
                <Button 
                  type="button" 
                  data-testid="button-next"
                  onClick={() => {
                    localStorage.setItem("createListingStep2", JSON.stringify(formData));
                    navigate("/seller/listings/create/step3");
                  }}
                >
                  Next: Photos & Videos
                  <ArrowRight className="h-4 w-4 ml-2" />
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
