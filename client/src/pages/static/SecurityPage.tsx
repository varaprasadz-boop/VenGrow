import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Shield, Lock, Eye, AlertTriangle } from "lucide-react";

export default function SecurityPage() {
  const measures = [
    {
      icon: Shield,
      title: "Data Encryption",
      description:
        "All data transmitted between you and our servers is encrypted using industry-standard SSL/TLS protocols.",
    },
    {
      icon: Lock,
      title: "Secure Authentication",
      description:
        "We use OAuth 2.0 for secure login and never store your passwords in plain text.",
    },
    {
      icon: Eye,
      title: "Privacy Protection",
      description:
        "Your personal information is never shared with third parties without your explicit consent.",
    },
    {
      icon: AlertTriangle,
      title: "Fraud Detection",
      description:
        "Advanced algorithms monitor for suspicious activities and protect against fraudulent listings.",
    },
  ];

  const bestPractices = [
    "Use a strong, unique password for your account",
    "Enable two-factor authentication when available",
    "Never share your login credentials with anyone",
    "Be cautious of phishing emails or suspicious links",
    "Verify property details before making any payment",
    "Report suspicious listings or users immediately",
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
              Your Security is Our Priority
            </h1>
            <p className="text-xl text-muted-foreground">
              We implement industry-leading security measures to protect your data
            </p>
          </div>
        </div>

        {/* Security Measures */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              How We Protect You
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {measures.map((measure, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                      <measure.icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {measure.title}
                      </h3>
                      <p className="text-muted-foreground">{measure.description}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Best Practices */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Security Best Practices
            </h2>
            <Card className="p-8">
              <ul className="space-y-4">
                {bestPractices.map((practice, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <div className="p-1.5 rounded-full bg-primary/20 flex-shrink-0 mt-0.5">
                      <Shield className="h-4 w-4 text-primary" />
                    </div>
                    <span>{practice}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>

        {/* Certifications */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-8">
              Trusted & Certified
            </h2>
            <p className="text-muted-foreground mb-12 max-w-2xl mx-auto">
              Our security practices are regularly audited and certified by
              independent third-party organizations
            </p>
            <div className="grid grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="p-8">
                  <div className="aspect-square bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-muted-foreground">Certification {i}</span>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
