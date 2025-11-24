import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Search, Home, FileText, Key, CheckCircle } from "lucide-react";

export default function BuyerGuidePage() {
  const steps = [
    {
      icon: Search,
      title: "Search & Shortlist",
      description: "Browse properties that match your requirements",
      tips: [
        "Use filters to narrow down options",
        "Save properties to favorites for comparison",
        "Set up alerts for new listings",
      ],
    },
    {
      icon: Home,
      title: "Visit Properties",
      description: "Schedule site visits to inspect shortlisted properties",
      tips: [
        "Visit during different times of day",
        "Check water supply and electricity",
        "Inspect common areas and amenities",
      ],
    },
    {
      icon: FileText,
      title: "Verify Documents",
      description: "Ensure all property documents are in order",
      tips: [
        "Verify ownership title",
        "Check building approvals",
        "Confirm tax payments are up to date",
      ],
    },
    {
      icon: Key,
      title: "Close the Deal",
      description: "Negotiate and complete the purchase",
      tips: [
        "Get legal advice before signing",
        "Negotiate price and terms",
        "Complete registration formalities",
      ],
    },
  ];

  const checklist = [
    "Budget finalized",
    "Location preferences defined",
    "Property type decided",
    "Home loan pre-approval obtained",
    "Legal advisor consulted",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Complete Buyer's Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Everything you need to know about buying property in India
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              The Property Buying Process
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
                            <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
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

        {/* Checklist */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <h2 className="font-serif font-bold text-2xl mb-6 text-center">
                Pre-Purchase Checklist
              </h2>
              <div className="space-y-3">
                {checklist.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-lg"
                  >
                    <div className="w-6 h-6 rounded border-2 border-muted-foreground" />
                    <span className="font-medium">{item}</span>
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
