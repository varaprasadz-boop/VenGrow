import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Home, TrendingUp, MapPin, Calculator } from "lucide-react";

export default function HomeValuationPage() {
  const [formData, setFormData] = useState({
    address: "",
    city: "",
    propertyType: "",
    bedrooms: "",
    bathrooms: "",
    area: "",
    age: "",
  });

  const [valuation, setValuation] = useState<number | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setValuation(8500000);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Home Valuation Tool
            </h1>
            <p className="text-muted-foreground">
              Get an instant estimate of your property's market value
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div>
                    <Label htmlFor="address">Property Address *</Label>
                    <Input
                      id="address"
                      placeholder="Enter full address"
                      required
                      value={formData.address}
                      onChange={(e) =>
                        setFormData({ ...formData, address: e.target.value })
                      }
                      data-testid="input-address"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Select
                        value={formData.city}
                        onValueChange={(value) =>
                          setFormData({ ...formData, city: value })
                        }
                      >
                        <SelectTrigger id="city" data-testid="select-city">
                          <SelectValue placeholder="Select city" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="mumbai">Mumbai</SelectItem>
                          <SelectItem value="delhi">Delhi</SelectItem>
                          <SelectItem value="bangalore">Bangalore</SelectItem>
                          <SelectItem value="pune">Pune</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="property-type">Property Type *</Label>
                      <Select
                        value={formData.propertyType}
                        onValueChange={(value) =>
                          setFormData({ ...formData, propertyType: value })
                        }
                      >
                        <SelectTrigger id="property-type" data-testid="select-type">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="villa">Villa</SelectItem>
                          <SelectItem value="house">Independent House</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="bedrooms">Bedrooms *</Label>
                      <Input
                        id="bedrooms"
                        type="number"
                        min="1"
                        required
                        value={formData.bedrooms}
                        onChange={(e) =>
                          setFormData({ ...formData, bedrooms: e.target.value })
                        }
                        data-testid="input-bedrooms"
                      />
                    </div>

                    <div>
                      <Label htmlFor="bathrooms">Bathrooms *</Label>
                      <Input
                        id="bathrooms"
                        type="number"
                        min="1"
                        required
                        value={formData.bathrooms}
                        onChange={(e) =>
                          setFormData({ ...formData, bathrooms: e.target.value })
                        }
                        data-testid="input-bathrooms"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="area">Area (sqft) *</Label>
                      <Input
                        id="area"
                        type="number"
                        min="100"
                        required
                        value={formData.area}
                        onChange={(e) =>
                          setFormData({ ...formData, area: e.target.value })
                        }
                        data-testid="input-area"
                      />
                    </div>

                    <div>
                      <Label htmlFor="age">Property Age (years) *</Label>
                      <Input
                        id="age"
                        type="number"
                        min="0"
                        required
                        value={formData.age}
                        onChange={(e) =>
                          setFormData({ ...formData, age: e.target.value })
                        }
                        data-testid="input-age"
                      />
                    </div>
                  </div>

                  <Button className="w-full" type="submit" data-testid="button-calculate">
                    <Calculator className="h-4 w-4 mr-2" />
                    Get Valuation
                  </Button>
                </form>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-1">
              {valuation ? (
                <div className="space-y-6">
                  <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                    <h3 className="font-semibold mb-4">Estimated Value</h3>
                    <p className="text-4xl font-bold text-primary mb-2">
                      ₹{(valuation / 100000).toFixed(1)} L
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Market value as of today
                    </p>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Value Range</h3>
                    <div className="space-y-3">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Low</p>
                        <p className="font-semibold">
                          ₹{((valuation * 0.9) / 100000).toFixed(1)} L
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">High</p>
                        <p className="font-semibold">
                          ₹{((valuation * 1.1) / 100000).toFixed(1)} L
                        </p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-6">
                    <h3 className="font-semibold mb-4">Next Steps</h3>
                    <div className="space-y-3">
                      <Button className="w-full" variant="outline">
                        <Home className="h-4 w-4 mr-2" />
                        List Your Property
                      </Button>
                      <Button className="w-full" variant="outline">
                        <TrendingUp className="h-4 w-4 mr-2" />
                        Market Analysis
                      </Button>
                    </div>
                  </Card>
                </div>
              ) : (
                <Card className="p-8 text-center">
                  <div className="inline-flex p-4 rounded-full bg-muted mb-4">
                    <Home className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <h3 className="font-semibold mb-2">Get Started</h3>
                  <p className="text-sm text-muted-foreground">
                    Fill in the form to get an instant valuation of your property
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
