import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { CheckCircle, Shield } from "lucide-react";

export default function ReraCompliancePage() {
  const benefits = [
    "Transparent property transactions",
    "Verified project information",
    "Timely project delivery",
    "Accountability of developers",
    "Buyer grievance redressal",
    "Standardized agreements",
  ];

  const compliance = [
    {
      title: "All Projects Registered",
      description: "Every property on our platform is RERA registered and verified",
    },
    {
      title: "Document Verification",
      description: "We verify all RERA documents before listing properties",
    },
    {
      title: "Regular Updates",
      description: "Project status updated regularly as per RERA requirements",
    },
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
              100% RERA Compliant
            </h1>
            <p className="text-xl text-muted-foreground">
              All properties verified and compliant with Real Estate Regulatory
              Authority
            </p>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Why RERA Matters
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <CheckCircle className="h-6 w-6 text-green-600 mt-1 flex-shrink-0" />
                  <p className="font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Our Compliance */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Our RERA Compliance
            </h2>
            <div className="space-y-6">
              {compliance.map((item, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-3 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0">
                      <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{item.title}</h3>
                      <p className="text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Card className="p-12 bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Questions About RERA?
              </h2>
              <p className="text-muted-foreground mb-8">
                Our team is here to help you understand RERA compliance
              </p>
              <a
                href="/contact"
                className="text-primary font-semibold hover:underline"
              >
                Contact Us →
              </a>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
