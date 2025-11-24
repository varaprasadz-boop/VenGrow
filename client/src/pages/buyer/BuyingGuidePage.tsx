import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function BuyingGuidePage() {
  const steps = [
    {
      title: "Define Your Requirements",
      description:
        "Determine your budget, preferred location, property type, and must-have amenities.",
      tips: [
        "Create a budget including down payment and monthly EMI",
        "List your top 3-5 preferred locations",
        "Decide between apartment, villa, or independent house",
        "Prioritize amenities (gym, parking, security, etc.)",
      ],
    },
    {
      title: "Search & Shortlist Properties",
      description:
        "Browse listings, attend property visits, and create a shortlist of top choices.",
      tips: [
        "Use filters to narrow down search results",
        "Save favorite properties for easy comparison",
        "Schedule visits for shortlisted properties",
        "Compare at least 3-5 properties before deciding",
      ],
    },
    {
      title: "Verify Property Documents",
      description:
        "Ensure all legal documents are in order before making an offer.",
      tips: [
        "Check property title and ownership documents",
        "Verify RERA registration and approvals",
        "Review building plan approval",
        "Confirm tax payment receipts",
        "Check for any pending dues or legal disputes",
      ],
    },
    {
      title: "Arrange Financing",
      description: "Secure home loan approval and understand all costs involved.",
      tips: [
        "Get pre-approved for a home loan",
        "Compare interest rates from multiple banks",
        "Calculate total cost including registration and stamp duty",
        "Budget for additional costs (legal fees, maintenance deposits)",
      ],
    },
    {
      title: "Make an Offer & Negotiate",
      description:
        "Submit your offer and negotiate the best price and terms.",
      tips: [
        "Research similar properties to determine fair market value",
        "Start with a lower offer than asking price",
        "Be prepared to walk away if terms don't match",
        "Get everything in writing",
      ],
    },
    {
      title: "Complete the Purchase",
      description:
        "Finalize the sale agreement and complete all legal formalities.",
      tips: [
        "Hire a lawyer to review sale agreement",
        "Pay stamp duty and registration fees",
        "Complete property registration",
        "Get possession and handover documents",
        "Update utility connections in your name",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl mb-4">
              Complete Home Buying Guide
            </h1>
            <p className="text-lg text-muted-foreground">
              Step-by-step guide to buying your dream property in India
            </p>
          </div>

          <div className="space-y-8">
            {steps.map((step, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-start gap-4 mb-6">
                  <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                    <span className="text-xl font-bold text-primary">
                      {index + 1}
                    </span>
                  </div>
                  <div className="flex-1">
                    <h2 className="font-serif font-bold text-2xl mb-2">
                      {step.title}
                    </h2>
                    <p className="text-muted-foreground">{step.description}</p>
                  </div>
                </div>

                <div className="pl-16">
                  <h3 className="font-semibold mb-4">Key Points:</h3>
                  <ul className="space-y-3">
                    {step.tips.map((tip, tipIndex) => (
                      <li key={tipIndex} className="flex items-start gap-3">
                        <CheckCircle className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <span className="text-sm">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
