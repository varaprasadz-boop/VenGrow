import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, TrendingUp, CheckCircle } from "lucide-react";

export default function LoanAssistancePage() {
  const banks = [
    {
      name: "HDFC Bank",
      logo: "",
      interestRate: "8.5%",
      processingFee: "0.5%",
      maxLoan: "₹5 Cr",
      tenure: "Up to 30 years",
    },
    {
      name: "ICICI Bank",
      logo: "",
      interestRate: "8.75%",
      processingFee: "0.5%",
      maxLoan: "₹10 Cr",
      tenure: "Up to 30 years",
    },
    {
      name: "SBI",
      logo: "",
      interestRate: "8.4%",
      processingFee: "0.35%",
      maxLoan: "₹7.5 Cr",
      tenure: "Up to 30 years",
    },
  ];

  const benefits = [
    "Pre-approved loan offers",
    "Competitive interest rates",
    "Quick approval process",
    "Minimal documentation",
    "Dedicated relationship manager",
    "End-to-end assistance",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Home Loan Assistance
            </h1>
            <p className="text-muted-foreground">
              Get the best home loan deals from our partner banks
            </p>
          </div>

          {/* Benefits */}
          <Card className="p-8 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <h3 className="font-semibold text-lg mb-6 text-center">
              Why Choose Our Loan Assistance?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary flex-shrink-0" />
                  <span className="text-sm">{benefit}</span>
                </div>
              ))}
            </div>
          </Card>

          {/* Partner Banks */}
          <div className="mb-12">
            <h2 className="font-semibold text-2xl mb-6">Our Partner Banks</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {banks.map((bank, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-center gap-3 mb-6">
                    <div className="w-16 h-16 rounded-lg bg-muted flex items-center justify-center">
                      <Building2 className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <h3 className="font-semibold text-lg">{bank.name}</h3>
                  </div>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Interest Rate</span>
                      <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                        {bank.interestRate}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Processing Fee</span>
                      <span className="font-medium text-sm">{bank.processingFee}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Max Loan</span>
                      <span className="font-medium text-sm">{bank.maxLoan}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Tenure</span>
                      <span className="font-medium text-sm">{bank.tenure}</span>
                    </div>
                  </div>

                  <Button className="w-full" data-testid={`button-apply-${index}`}>
                    Apply Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>

          {/* CTA */}
          <Card className="p-8 text-center">
            <h3 className="font-serif font-bold text-2xl mb-4">
              Need Help Choosing the Right Loan?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our loan experts will help you find the best deal based on your requirements
            </p>
            <Button size="lg" data-testid="button-expert">
              Talk to an Expert
            </Button>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
