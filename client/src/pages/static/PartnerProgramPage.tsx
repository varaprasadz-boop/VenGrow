import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Handshake, TrendingUp, Users, Award } from "lucide-react";

export default function PartnerProgramPage() {
  const benefits = [
    {
      icon: TrendingUp,
      title: "Revenue Sharing",
      description: "Earn competitive commissions on all successful transactions",
    },
    {
      icon: Users,
      title: "Dedicated Support",
      description: "Get priority support from our partnership team",
    },
    {
      icon: Award,
      title: "Marketing Resources",
      description: "Access to co-branded marketing materials and campaigns",
    },
    {
      icon: Handshake,
      title: "API Access",
      description: "Integrate our platform with your existing systems",
    },
  ];

  const partnerTypes = [
    {
      name: "Real Estate Agency",
      description: "Partner with us to list your properties and expand your reach",
      commission: "Up to 2%",
    },
    {
      name: "Builder/Developer",
      description: "Showcase your projects to millions of potential buyers",
      commission: "Custom plans",
    },
    {
      name: "Technology Partner",
      description: "Integrate our property data into your platform",
      commission: "Revenue share",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Partner with PropConnect
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Join India's fastest-growing real estate platform
            </p>
            <Button size="lg" data-testid="button-apply">
              Apply for Partnership
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Partnership Benefits
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <Card key={index} className="p-6 text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <benefit.icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Partner Types */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Partnership Opportunities
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {partnerTypes.map((type, index) => (
                <Card key={index} className="p-8">
                  <h3 className="font-serif font-bold text-xl mb-3">
                    {type.name}
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    {type.description}
                  </p>
                  <div className="p-3 bg-primary/10 rounded-lg mb-6">
                    <p className="text-sm text-muted-foreground">Commission</p>
                    <p className="font-semibold text-primary">{type.commission}</p>
                  </div>
                  <Button variant="outline" className="w-full">
                    Learn More
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Ready to Partner?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join hundreds of successful partners already working with us
            </p>
            <div className="flex gap-4 justify-center">
              <Button size="lg" data-testid="button-get-started">
                Get Started
              </Button>
              <Button variant="outline" size="lg" data-testid="button-contact">
                Contact Sales
              </Button>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
