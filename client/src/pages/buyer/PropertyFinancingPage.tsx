import { useState } from "react";
import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calculator, TrendingUp } from "lucide-react";

export default function PropertyFinancingPage() {
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const calculateEMI = () => {
    const P = loanAmount;
    const r = interestRate / 12 / 100;
    const n = tenure * 12;
    const emi = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Property Financing
            </h1>
            <p className="text-muted-foreground">
              Calculate EMI and explore financing options
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calculator */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  EMI Calculator
                </h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="loan-amount">
                      Loan Amount: ₹{(loanAmount / 100000).toFixed(1)} L
                    </Label>
                    <input
                      id="loan-amount"
                      type="range"
                      min="1000000"
                      max="50000000"
                      step="100000"
                      value={loanAmount}
                      onChange={(e) => setLoanAmount(Number(e.target.value))}
                      className="w-full"
                      data-testid="slider-amount"
                    />
                  </div>

                  <div>
                    <Label htmlFor="interest-rate">
                      Interest Rate: {interestRate}%
                    </Label>
                    <input
                      id="interest-rate"
                      type="range"
                      min="6"
                      max="15"
                      step="0.1"
                      value={interestRate}
                      onChange={(e) => setInterestRate(Number(e.target.value))}
                      className="w-full"
                      data-testid="slider-rate"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tenure">Loan Tenure: {tenure} years</Label>
                    <input
                      id="tenure"
                      type="range"
                      min="5"
                      max="30"
                      step="1"
                      value={tenure}
                      onChange={(e) => setTenure(Number(e.target.value))}
                      className="w-full"
                      data-testid="slider-tenure"
                    />
                  </div>
                </div>
              </Card>

              {/* Breakdown */}
              <Card className="p-8 mt-6">
                <h3 className="font-semibold text-lg mb-6">Payment Breakdown</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Principal Amount</span>
                    <span className="font-semibold">
                      ₹{(loanAmount / 100000).toFixed(1)} L
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-semibold">
                      ₹{(totalInterest / 100000).toFixed(1)} L
                    </span>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <span className="font-semibold">Total Payment</span>
                    <span className="font-semibold text-lg">
                      ₹{(totalPayment / 100000).toFixed(1)} L
                    </span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Result */}
            <div className="lg:col-span-1">
              <Card className="p-8 sticky top-8 bg-gradient-to-br from-primary/5 to-primary/10">
                <h3 className="font-semibold mb-6">Your Monthly EMI</h3>
                <p className="text-5xl font-bold font-serif text-primary mb-6">
                  ₹{(emi / 1000).toFixed(1)}K
                </p>
                <p className="text-sm text-muted-foreground mb-6">
                  Per month for {tenure} years
                </p>
                <Button className="w-full" data-testid="button-apply">
                  Apply for Loan
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
