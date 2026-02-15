import { useState } from "react";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, PiggyBank, Home } from "lucide-react";

export default function BudgetCalculatorPage() {
  const [income, setIncome] = useState(100000);
  const [savings, setSavings] = useState(500000);
  const [loanAmount, setLoanAmount] = useState(5000000);
  const [interestRate, setInterestRate] = useState(8.5);
  const [tenure, setTenure] = useState(20);

  const calculateEMI = () => {
    const monthlyRate = interestRate / 12 / 100;
    const months = tenure * 12;
    const emi =
      (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, months)) /
      (Math.pow(1 + monthlyRate, months) - 1);
    return Math.round(emi);
  };

  const emi = calculateEMI();
  const totalPayment = emi * tenure * 12;
  const totalInterest = totalPayment - loanAmount;
  const maxBudget = savings + loanAmount;
  const monthlyInvestment = income * 0.4;

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Budget Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate your home buying budget and EMI
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Input Form */}
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6">
                <h3 className="font-semibold mb-6 flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-primary" />
                  Your Financial Details
                </h3>

                <div className="space-y-6">
                  {/* Monthly Income */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Monthly Income</Label>
                      <span className="font-semibold">
                        ₹{income.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={[income]}
                      onValueChange={([value]) => setIncome(value)}
                      min={20000}
                      max={500000}
                      step={5000}
                      data-testid="slider-income"
                    />
                  </div>

                  {/* Savings */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Current Savings (Down Payment)</Label>
                      <span className="font-semibold">
                        ₹{savings.toLocaleString()}
                      </span>
                    </div>
                    <Slider
                      value={[savings]}
                      onValueChange={([value]) => setSavings(value)}
                      min={100000}
                      max={5000000}
                      step={50000}
                      data-testid="slider-savings"
                    />
                  </div>

                  {/* Loan Amount */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Loan Amount Required</Label>
                      <span className="font-semibold">
                        ₹{(loanAmount / 100000).toFixed(1)} L
                      </span>
                    </div>
                    <Slider
                      value={[loanAmount]}
                      onValueChange={([value]) => setLoanAmount(value)}
                      min={500000}
                      max={20000000}
                      step={100000}
                      data-testid="slider-loan"
                    />
                  </div>

                  {/* Interest Rate */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Interest Rate (% per annum)</Label>
                      <span className="font-semibold">{interestRate}%</span>
                    </div>
                    <Slider
                      value={[interestRate]}
                      onValueChange={([value]) => setInterestRate(value)}
                      min={6}
                      max={12}
                      step={0.1}
                      data-testid="slider-interest"
                    />
                  </div>

                  {/* Tenure */}
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <Label>Loan Tenure (Years)</Label>
                      <span className="font-semibold">{tenure} years</span>
                    </div>
                    <Slider
                      value={[tenure]}
                      onValueChange={([value]) => setTenure(value)}
                      min={5}
                      max={30}
                      step={1}
                      data-testid="slider-tenure"
                    />
                  </div>
                </div>
              </Card>
            </div>

            {/* Results */}
            <div className="lg:col-span-1 space-y-6">
              <Card className="p-6 bg-gradient-to-br from-primary/5 to-primary/10">
                <h3 className="font-semibold mb-6">Your Budget Summary</h3>
                <div className="space-y-4">
                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Home className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Maximum Budget
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{(maxBudget / 100000).toFixed(1)} L
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Calculator className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Monthly EMI
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{emi.toLocaleString()}
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <PiggyBank className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Total Interest
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{(totalInterest / 100000).toFixed(1)} L
                    </p>
                  </div>

                  <div className="p-4 bg-white dark:bg-gray-900 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-primary" />
                      <span className="text-sm text-muted-foreground">
                        Total Payment
                      </span>
                    </div>
                    <p className="text-2xl font-bold text-primary">
                      ₹{(totalPayment / 100000).toFixed(1)} L
                    </p>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4">Quick Tips</h4>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Keep EMI under 40% of monthly income</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Higher down payment = Lower EMI</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="text-primary">•</span>
                    <span>Shorter tenure = Less total interest</span>
                  </li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
