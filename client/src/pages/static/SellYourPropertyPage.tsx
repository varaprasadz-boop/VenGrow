import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Home, Users, TrendingUp, CheckCircle } from "lucide-react";

export default function SellYourPropertyPage() {
  const benefits = [
    "Reach 500,000+ active buyers",
    "Professional photography included",
    "Dedicated relationship manager",
    "Smart pricing recommendations",
    "Verified buyer inquiries only",
    "Detailed analytics dashboard",
  ];

  const steps = [
    {
      number: "1",
      title: "List Your Property",
      description: "Fill in property details and upload photos",
    },
    {
      number: "2",
      title: "Get Verified",
      description: "Quick verification process within 24 hours",
    },
    {
      number: "3",
      title: "Start Receiving Inquiries",
      description: "Connect with genuine, verified buyers",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="seller" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-20">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-6">
              Sell Your Property Faster
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Connect with serious buyers and close deals quickly
            </p>
            <Button size="lg" data-testid="button-get-started">
              Get Started for Free
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Why Sell With Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="p-2 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                  </div>
                  <p className="font-medium">{benefit}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* How It Works */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              How It Works
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {steps.map((step) => (
                <Card key={step.number} className="p-8 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-white text-2xl font-bold mb-4">
                    {step.number}
                  </div>
                  <h3 className="font-semibold text-xl mb-3">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-12 text-center bg-gradient-to-br from-primary/5 to-primary/10">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Ready to Sell Your Property?
              </h2>
              <p className="text-lg text-muted-foreground mb-8">
                Join 50,000+ sellers who trust VenGrow
              </p>
              <Button size="lg" data-testid="button-start-listing">
                List Your Property Now
              </Button>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
