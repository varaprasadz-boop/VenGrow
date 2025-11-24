import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Home, DollarSign, FileText, Key, CheckCircle } from "lucide-react";

export default function FirstTimeBuyerPage() {
  const steps = [
    {
      icon: DollarSign,
      title: "Set Your Budget",
      tips: ["Calculate affordability", "Consider down payment", "Factor in additional costs"],
    },
    {
      icon: Home,
      title: "Choose Location",
      tips: ["Research neighborhoods", "Check connectivity", "Evaluate amenities"],
    },
    {
      icon: FileText,
      title: "Get Pre-Approved",
      tips: ["Check credit score", "Gather documents", "Apply for pre-approval"],
    },
    {
      icon: Key,
      title: "Make an Offer",
      tips: ["Negotiate wisely", "Inspect property", "Finalize paperwork"],
    },
  ];

  const mistakes = [
    "Skipping property inspection",
    "Not verifying legal documents",
    "Overlooking hidden costs",
    "Buying without visiting",
    "Ignoring location research",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              First-Time Home Buyer Guide
            </h1>
            <p className="text-xl text-muted-foreground">
              Essential tips for buying your first property in India
            </p>
          </div>
        </div>

        {/* Steps */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Your Home Buying Journey
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {steps.map((step, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4 mb-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <step.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-serif font-bold text-xl mb-3">
                        {step.title}
                      </h3>
                      <ul className="space-y-2">
                        {step.tips.map((tip, tipIndex) => (
                          <li key={tipIndex} className="flex items-start gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
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

        {/* Common Mistakes */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <h2 className="font-serif font-bold text-2xl mb-6 text-center">
                Common Mistakes to Avoid
              </h2>
              <div className="space-y-3">
                {mistakes.map((mistake, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-4 border rounded-lg"
                  >
                    <span className="text-red-600 text-xl">✗</span>
                    <span className="font-medium">{mistake}</span>
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
