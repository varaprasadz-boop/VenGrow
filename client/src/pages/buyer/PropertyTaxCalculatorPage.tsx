import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, Info } from "lucide-react";

export default function PropertyTaxCalculatorPage() {
  const [propertyValue, setPropertyValue] = useState(8500000);
  const [state, setState] = useState("Maharashtra");

  const stampDutyRate = 5;
  const registrationFee = 1;

  const stampDuty = (propertyValue * stampDutyRate) / 100;
  const registration = (propertyValue * registrationFee) / 100;
  const totalTax = stampDuty + registration;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Calculator className="h-8 w-8 text-primary" />
              Property Tax Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate stamp duty and registration charges
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="font-semibold text-lg mb-6">Property Details</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="property-value">
                      Property Value: ₹{(propertyValue / 100000).toFixed(1)} L
                    </Label>
                    <input
                      id="property-value"
                      type="range"
                      min="1000000"
                      max="100000000"
                      step="100000"
                      value={propertyValue}
                      onChange={(e) => setPropertyValue(Number(e.target.value))}
                      className="w-full"
                      data-testid="slider-value"
                    />
                  </div>

                  <div>
                    <Label htmlFor="state">State</Label>
                    <select
                      id="state"
                      className="w-full px-4 py-2 border rounded-lg"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      data-testid="select-state"
                    >
                      <option value="Maharashtra">Maharashtra</option>
                      <option value="Karnataka">Karnataka</option>
                      <option value="Delhi">Delhi</option>
                      <option value="Tamil Nadu">Tamil Nadu</option>
                    </select>
                  </div>
                </div>
              </Card>

              {/* Breakdown */}
              <Card className="p-8 mt-6">
                <h3 className="font-semibold text-lg mb-6">Tax Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Stamp Duty</p>
                      <p className="text-xs text-muted-foreground">
                        {stampDutyRate}% of property value
                      </p>
                    </div>
                    <p className="text-xl font-bold">
                      ₹{(stampDuty / 100000).toFixed(2)} L
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-muted rounded-lg">
                    <div>
                      <p className="font-medium">Registration Fee</p>
                      <p className="text-xs text-muted-foreground">
                        {registrationFee}% of property value
                      </p>
                    </div>
                    <p className="text-xl font-bold">
                      ₹{(registration / 100000).toFixed(2)} L
                    </p>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-primary/10 rounded-lg border border-primary/20">
                    <div>
                      <p className="font-semibold text-lg">Total Tax</p>
                      <p className="text-xs text-muted-foreground">
                        Stamp Duty + Registration
                      </p>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{(totalTax / 100000).toFixed(2)} L
                    </p>
                  </div>
                </div>
              </Card>
            </div>

            {/* Info Card */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <div className="flex items-start gap-3 mb-4">
                  <Info className="h-5 w-5 text-primary mt-0.5" />
                  <h3 className="font-semibold">Important Notes</h3>
                </div>
                <ul className="space-y-3 text-sm text-muted-foreground">
                  <li>• Rates vary by state and property type</li>
                  <li>• Women buyers may get discounts in some states</li>
                  <li>• Additional charges may apply</li>
                  <li>• Consult a legal expert for accurate calculations</li>
                  <li>• This is an estimated calculation</li>
                </ul>

                <Button className="w-full mt-6" data-testid="button-consult">
                  Consult Expert
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
