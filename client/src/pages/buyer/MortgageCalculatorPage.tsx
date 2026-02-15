import { useState } from "react";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Calculator, TrendingUp, Calendar, DollarSign } from "lucide-react";

export default function MortgageCalculatorPage() {
  const [values, setValues] = useState({
    propertyPrice: 8500000,
    downPayment: 20,
    loanTenure: 20,
    interestRate: 8.5,
  });

  const loanAmount = values.propertyPrice * (1 - values.downPayment / 100);
  const monthlyRate = values.interestRate / 12 / 100;
  const totalMonths = values.loanTenure * 12;
  const emi =
    (loanAmount * monthlyRate * Math.pow(1 + monthlyRate, totalMonths)) /
    (Math.pow(1 + monthlyRate, totalMonths) - 1);
  const totalPayment = emi * totalMonths;
  const totalInterest = totalPayment - loanAmount;

  const formatCurrency = (value: number) => {
    return `₹${(value / 100000).toFixed(2)} L`;
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Home Loan Calculator
            </h1>
            <p className="text-muted-foreground">
              Calculate your monthly EMI and plan your home loan
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Calculator Form */}
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <Calculator className="h-6 w-6 text-primary" />
                  </div>
                  <h2 className="font-semibold text-xl">Loan Details</h2>
                </div>

                <div className="space-y-6">
                  {/* Property Price */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Property Price</Label>
                      <span className="text-sm font-medium">
                        {formatCurrency(values.propertyPrice)}
                      </span>
                    </div>
                    <Slider
                      value={[values.propertyPrice]}
                      onValueChange={(value) =>
                        setValues({ ...values, propertyPrice: value[0] })
                      }
                      min={1000000}
                      max={50000000}
                      step={100000}
                      data-testid="slider-property-price"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>₹10 L</span>
                      <span>₹5 Cr</span>
                    </div>
                  </div>

                  {/* Down Payment */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Down Payment</Label>
                      <span className="text-sm font-medium">
                        {values.downPayment}% ({formatCurrency(values.propertyPrice * values.downPayment / 100)})
                      </span>
                    </div>
                    <Slider
                      value={[values.downPayment]}
                      onValueChange={(value) =>
                        setValues({ ...values, downPayment: value[0] })
                      }
                      min={10}
                      max={50}
                      step={5}
                      data-testid="slider-down-payment"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>10%</span>
                      <span>50%</span>
                    </div>
                  </div>

                  {/* Loan Tenure */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Loan Tenure</Label>
                      <span className="text-sm font-medium">
                        {values.loanTenure} years
                      </span>
                    </div>
                    <Slider
                      value={[values.loanTenure]}
                      onValueChange={(value) =>
                        setValues({ ...values, loanTenure: value[0] })
                      }
                      min={5}
                      max={30}
                      step={1}
                      data-testid="slider-loan-tenure"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>5 years</span>
                      <span>30 years</span>
                    </div>
                  </div>

                  {/* Interest Rate */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <Label>Interest Rate (p.a.)</Label>
                      <span className="text-sm font-medium">
                        {values.interestRate}%
                      </span>
                    </div>
                    <Slider
                      value={[values.interestRate]}
                      onValueChange={(value) =>
                        setValues({ ...values, interestRate: value[0] })
                      }
                      min={6.5}
                      max={12}
                      step={0.1}
                      data-testid="slider-interest-rate"
                    />
                    <div className="flex justify-between text-xs text-muted-foreground">
                      <span>6.5%</span>
                      <span>12%</span>
                    </div>
                  </div>
                </div>
              </Card>

              {/* Breakdown */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Loan Breakdown</h3>
                <div className="space-y-3">
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Loan Amount</span>
                    <span className="font-semibold">{formatCurrency(loanAmount)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Down Payment</span>
                    <span className="font-semibold">
                      {formatCurrency(values.propertyPrice * values.downPayment / 100)}
                    </span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Total Interest</span>
                    <span className="font-semibold">{formatCurrency(totalInterest)}</span>
                  </div>
                  <div className="flex justify-between p-3 bg-muted/50 rounded-lg">
                    <span className="text-muted-foreground">Total Payment</span>
                    <span className="font-semibold">{formatCurrency(totalPayment)}</span>
                  </div>
                </div>
              </Card>
            </div>

            {/* Results */}
            <div className="space-y-6">
              {/* EMI Card */}
              <Card className="p-8 bg-gradient-to-br from-primary/5 to-primary/10">
                <div className="text-center">
                  <p className="text-muted-foreground mb-2">Monthly EMI</p>
                  <p className="text-5xl font-bold font-serif text-primary mb-6">
                    ₹{Math.round(emi).toLocaleString("en-IN")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    for {values.loanTenure} years at {values.interestRate}% p.a.
                  </p>
                </div>
              </Card>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                      <DollarSign className="h-5 w-5 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Principal</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(loanAmount)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                      <TrendingUp className="h-5 w-5 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Interest</p>
                      <p className="text-lg font-bold">
                        {formatCurrency(totalInterest)}
                      </p>
                    </div>
                  </div>
                </Card>

                <Card className="p-6 col-span-2">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                      <Calendar className="h-5 w-5 text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-muted-foreground">Total Payments</p>
                      <p className="text-lg font-bold">{totalMonths} months</p>
                    </div>
                  </div>
                </Card>
              </div>

              {/* Amortization Chart */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Principal vs Interest</h3>
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Principal Amount</span>
                      <span>{((loanAmount / totalPayment) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-primary"
                        style={{ width: `${(loanAmount / totalPayment) * 100}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2 text-sm">
                      <span>Interest Amount</span>
                      <span>{((totalInterest / totalPayment) * 100).toFixed(1)}%</span>
                    </div>
                    <div className="h-3 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-500"
                        style={{ width: `${(totalInterest / totalPayment) * 100}%` }}
                      />
                    </div>
                  </div>
                </div>
              </Card>

              {/* CTA */}
              <Card className="p-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
                <p className="text-sm text-blue-900 dark:text-blue-400 mb-4">
                  <strong>Ready to apply for a home loan?</strong><br />
                  Connect with our banking partners for the best rates
                </p>
                <Button className="w-full" data-testid="button-apply-loan">
                  Apply for Home Loan
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
