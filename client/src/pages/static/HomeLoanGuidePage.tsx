import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { FileText, DollarSign, CheckCircle, TrendingUp } from "lucide-react";

export default function HomeLoanGuidePage() {
  const steps = [
    {
      icon: FileText,
      title: "Check Eligibility",
      description: "Verify your eligibility based on income, credit score, and employment",
      tips: ["Maintain good credit score (750+)", "Stable employment history", "Low existing debt"],
    },
    {
      icon: DollarSign,
      title: "Compare Loan Offers",
      description: "Research and compare interest rates from different banks",
      tips: ["Compare interest rates", "Check processing fees", "Understand prepayment terms"],
    },
    {
      icon: FileText,
      title: "Submit Documents",
      description: "Prepare and submit required documentation",
      tips: ["Income proof", "Identity and address proof", "Property documents"],
    },
    {
      icon: CheckCircle,
      title: "Loan Approval",
      description: "Bank processes your application and disburses loan",
      tips: ["Property valuation", "Legal verification", "Loan disbursement"],
    },
  ];

  const documents = [
    "PAN Card",
    "Aadhaar Card",
    "Salary Slips (last 3 months)",
    "Bank Statements (last 6 months)",
    "Form 16 or ITR (last 2 years)",
    "Property Documents",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Home Loan Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Complete guide to securing a home loan in India
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Home Loan Process
            </h2>
            <div className="space-y-8">
              {steps.map((step, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex-shrink-0">
                      <div className="flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold">
                        {index + 1}
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <step.icon className="h-6 w-6 text-primary" />
                        <h3 className="font-serif font-bold text-2xl">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-muted-foreground mb-4">
                        {step.description}
                      </p>
                      <ul className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2">
                            <span className="text-primary">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Documents Required */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <h2 className="font-serif font-bold text-2xl mb-6 text-center">
                Required Documents
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-lg"
                  >
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="font-medium">{doc}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
