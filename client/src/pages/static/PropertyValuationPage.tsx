import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calculator } from "lucide-react";

export default function PropertyValuationPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
              <Calculator className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Free Property Valuation
            </h1>
            <p className="text-xl text-muted-foreground">
              Get instant market value estimate for your property
            </p>
          </div>
        </div>

        {/* Form */}
        <div className="py-16">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <h2 className="font-serif font-bold text-2xl mb-6">
                Property Details
              </h2>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="location">Property Location</Label>
                  <Input
                    id="location"
                    placeholder="Enter city or locality"
                    data-testid="input-location"
                  />
                </div>

                <div>
                  <Label htmlFor="type">Property Type</Label>
                  <Select>
                    <SelectTrigger id="type" data-testid="select-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="apartment">Apartment</SelectItem>
                      <SelectItem value="villa">Villa</SelectItem>
                      <SelectItem value="plot">Plot</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="bedrooms">Bedrooms</Label>
                    <Input
                      id="bedrooms"
                      type="number"
                      placeholder="2"
                      data-testid="input-bedrooms"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area">Area (sq ft)</Label>
                    <Input
                      id="area"
                      type="number"
                      placeholder="1000"
                      data-testid="input-area"
                    />
                  </div>
                </div>

                <Button className="w-full" size="lg" data-testid="button-calculate">
                  Calculate Property Value
                </Button>
              </div>
            </Card>
          </div>
        </div>

        {/* Info */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                "Enter your property details",
                "Our AI analyzes market data",
                "Get instant valuation report",
              ].map((step, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-primary text-white text-xl font-bold mb-4">
                    {index + 1}
                  </div>
                  <p className="font-medium">{step}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
