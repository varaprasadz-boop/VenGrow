import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, Building, TrendingUp, Users } from "lucide-react";

export default function PartnershipPage() {
  const partnerTypes = [
    {
      icon: Building,
      title: "Construction Companies",
      description: "Partner with us to list and sell your properties",
      benefits: ["Premium listing features", "Dedicated account manager", "Marketing support"],
    },
    {
      icon: Users,
      title: "Real Estate Agencies",
      description: "Expand your reach with our platform",
      benefits: ["White-label solutions", "Lead generation", "CRM integration"],
    },
    {
      icon: TrendingUp,
      title: "Financial Institutions",
      description: "Offer home loans to our users",
      benefits: ["Direct buyer access", "Co-branding opportunities", "Analytics dashboard"],
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
              <Handshake className="h-12 w-12 text-primary" />
            </div>
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Partner With Us
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join forces to revolutionize the real estate industry
            </p>
            <Button size="lg" data-testid="button-apply">
              Become a Partner
            </Button>
          </div>
        </div>

        {/* Partner Types */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Partnership Opportunities
            </h2>
            <div className="space-y-8">
              {partnerTypes.map((type, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="p-4 rounded-lg bg-primary/10 flex-shrink-0">
                      <type.icon className="h-8 w-8 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-serif font-bold text-2xl mb-3">
                        {type.title}
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        {type.description}
                      </p>
                      <div className="space-y-2">
                        <p className="text-sm font-semibold">Benefits:</p>
                        <ul className="space-y-1">
                          {type.benefits.map((benefit, benefitIndex) => (
                            <li key={benefitIndex} className="flex items-start gap-2 text-sm">
                              <span className="text-primary">•</span>
                              <span>{benefit}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12 text-center">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Ready to Partner?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Let's discuss how we can grow together
              </p>
              <Button size="lg">Schedule a Meeting</Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
