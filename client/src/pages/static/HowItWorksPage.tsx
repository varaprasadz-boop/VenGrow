import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  UserPlus,
  Search,
  MessageSquare,
  CheckCircle,
  Building,
  Camera,
  TrendingUp,
  Wallet,
} from "lucide-react";

export default function HowItWorksPage() {
  const buyerSteps = [
    {
      icon: UserPlus,
      title: "Create Account",
      description: "Sign up for free with your email or social media account",
    },
    {
      icon: Search,
      title: "Search Properties",
      description: "Use filters to find properties that match your requirements",
    },
    {
      icon: MessageSquare,
      title: "Contact Sellers",
      description: "Send inquiries and chat directly with verified sellers",
    },
    {
      icon: CheckCircle,
      title: "Close the Deal",
      description: "Schedule visits, negotiate, and finalize your property purchase",
    },
  ];

  const sellerSteps = [
    {
      icon: UserPlus,
      title: "Register & Verify",
      description: "Create seller account and complete verification process",
    },
    {
      icon: Wallet,
      title: "Choose Package",
      description: "Select a listing package that fits your needs",
    },
    {
      icon: Camera,
      title: "Create Listing",
      description: "Add property details, photos, and pricing information",
    },
    {
      icon: TrendingUp,
      title: "Manage & Track",
      description: "Receive inquiries, track analytics, and manage your listings",
    },
  ];

  const features = [
    {
      title: "Verified Sellers",
      description: "All sellers go through thorough verification including document checks and RERA certification for brokers",
    },
    {
      title: "Transparent Pricing",
      description: "No hidden fees. Clear pricing for all services with detailed package breakdowns",
    },
    {
      title: "Direct Communication",
      description: "Connect directly with property owners without intermediaries slowing down the process",
    },
    {
      title: "Advanced Search",
      description: "Filter by location, price, property type, amenities, and save your searches for future updates",
    },
    {
      title: "Secure Payments",
      description: "All transactions processed through Razorpay with industry-standard encryption",
    },
    {
      title: "24/7 Support",
      description: "Our support team is always available to help you with any questions or issues",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">How It Works</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              Simple, Transparent, Effective
            </h1>
            <p className="text-lg text-muted-foreground">
              Whether you're buying or selling, VenGrow makes real estate transactions easy and secure
            </p>
          </div>
        </section>

        {/* For Buyers */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-3xl mb-4">For Buyers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Find your dream property in 4 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {buyerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="p-6 text-center relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4 mt-2">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button size="lg" data-testid="button-start-searching">
                Start Searching Properties
              </Button>
            </div>
          </div>
        </section>

        {/* For Sellers */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-3xl mb-4">For Sellers</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                List your property and reach thousands of buyers
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
              {sellerSteps.map((step, index) => {
                const Icon = step.icon;
                return (
                  <Card key={index} className="p-6 text-center relative">
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <div className="h-8 w-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                    </div>
                    <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4 mt-2">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {step.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            <div className="text-center">
              <Button size="lg" data-testid="button-become-seller">
                Become a Seller
              </Button>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="font-serif font-bold text-3xl mb-4">
                Why Choose VenGrow?
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We provide the tools and support you need for successful real estate transactions
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <Card key={index} className="p-6">
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 mt-1">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 bg-primary text-primary-foreground">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg mb-8 opacity-90">
              Join thousands of satisfied users on VenGrow today
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a href="/register">
                <button className="bg-background text-foreground hover-elevate active-elevate-2 px-8 py-3 rounded-lg font-semibold">
                  Sign Up Now
                </button>
              </a>
              <a href="/contact">
                <button className="border border-primary-foreground hover-elevate active-elevate-2 px-8 py-3 rounded-lg font-semibold">
                  Contact Us
                </button>
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
