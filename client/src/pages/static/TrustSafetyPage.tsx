import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, CheckCircle, Lock, Eye, AlertTriangle } from "lucide-react";

export default function TrustSafetyPage() {
  const safetyMeasures = [
    {
      icon: CheckCircle,
      title: "Verified Listings",
      description:
        "All property listings are manually verified by our team to ensure authenticity.",
    },
    {
      icon: Shield,
      title: "Seller Verification",
      description:
        "Mandatory KYC and document verification for all sellers before listing.",
    },
    {
      icon: Lock,
      title: "Secure Payments",
      description:
        "All transactions processed through encrypted payment gateway with buyer protection.",
    },
    {
      icon: Eye,
      title: "Fraud Detection",
      description:
        "AI-powered monitoring system to detect and prevent fraudulent activities.",
    },
  ];

  const safetyTips = [
    "Always visit the property in person before making any payment",
    "Verify property documents with local authorities",
    "Never share financial information through unverified channels",
    "Report suspicious listings or users immediately",
    "Use our secure messaging system for all communications",
    "Request proper identification from sellers and agents",
    "Get property valuation done by certified professionals",
    "Read and understand all terms before signing agreements",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-primary/20 mb-6">
              <Shield className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Trust & Safety
            </h1>
            <p className="text-xl text-muted-foreground">
              Your security is our top priority. Learn how we protect you
            </p>
          </div>
        </div>

        {/* Safety Measures */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              How We Keep You Safe
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {safetyMeasures.map((measure, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <measure.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {measure.title}
                      </h3>
                      <p className="text-muted-foreground">
                        {measure.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Safety Tips */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Safety Tips for Buyers & Sellers
            </h2>
            <Card className="p-8">
              <ul className="space-y-4">
                {safetyTips.map((tip, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0 mt-0.5">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    </div>
                    <span>{tip}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Report Issues */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex p-4 rounded-full bg-red-100 dark:bg-red-900/20 mb-6">
              <AlertTriangle className="h-8 w-8 text-red-600" />
            </div>
            <h2 className="font-serif font-bold text-3xl mb-4">
              Report Safety Concerns
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              If you encounter any suspicious activity or safety concerns, please
              report it immediately
            </p>
            <Card className="p-8 text-left max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Safety Hotline (24/7)
                  </p>
                  <p className="font-medium text-lg">+91 22 1800 5555</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <p className="font-medium text-lg">safety@propconnect.com</p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
