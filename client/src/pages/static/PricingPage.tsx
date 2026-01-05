import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star } from "lucide-react";

export default function PricingPage() {
  const plans = [
    {
      id: "basic",
      name: "Basic",
      price: "₹999",
      duration: "/month",
      description: "Perfect for individual sellers",
      popular: false,
      features: [
        "5 Property Listings",
        "30 Days Validity",
        "Basic Support",
        "Standard Visibility",
        "Property Analytics",
      ],
      notIncluded: [
        "Featured Listings",
        "Priority Support",
        "Advanced Analytics",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: "₹2,499",
      duration: "/month",
      description: "Most popular for growing agencies",
      popular: true,
      features: [
        "20 Property Listings",
        "60 Days Validity",
        "5 Featured Listings",
        "Priority Support",
        "Advanced Analytics",
        "Unlimited Inquiries",
        "Boost Visibility",
        "Email & SMS Alerts",
      ],
      notIncluded: ["API Access", "Custom Branding"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground">
              Choose the perfect plan for your property listing needs
            </p>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {plans.map((plan) => (
                <Card
                  key={plan.id}
                  className={`p-8 relative ${
                    plan.popular ? "border-primary border-2" : ""
                  }`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                      <Badge className="bg-primary text-primary-foreground px-4 py-1">
                        <Star className="h-3 w-3 mr-1 inline" />
                        Most Popular
                      </Badge>
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="font-serif font-bold text-2xl mb-2">
                      {plan.name}
                    </h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {plan.description}
                    </p>
                    <div className="mb-4">
                      <span className="text-5xl font-bold font-serif text-primary">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">
                        {plan.duration}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-8">
                    {plan.features.map((feature, index) => (
                      <div key={index} className="flex items-start gap-3">
                        <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 mt-0.5">
                          <Check className="h-3 w-3 text-green-600" />
                        </div>
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                    {plan.notIncluded.map((feature, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-3 text-muted-foreground"
                      >
                        <div className="p-1 rounded-full bg-muted mt-0.5">
                          <Check className="h-3 w-3" />
                        </div>
                        <span className="text-sm line-through">{feature}</span>
                      </div>
                    ))}
                  </div>

                  <Button
                    className="w-full"
                    variant={plan.popular ? "default" : "outline"}
                    data-testid={`button-select-${plan.id}`}
                  >
                    Get Started
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              {[
                {
                  q: "Can I upgrade or downgrade my plan?",
                  a: "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
                },
                {
                  q: "What payment methods do you accept?",
                  a: "We accept all major payment methods including Credit/Debit Cards, UPI, Net Banking, and Wallets through Razorpay.",
                },
                {
                  q: "Is there a refund policy?",
                  a: "Yes, we offer a 7-day money-back guarantee if you're not satisfied with our service.",
                },
              ].map((faq, index) => (
                <Card key={index} className="p-6">
                  <h3 className="font-semibold mb-2">{faq.q}</h3>
                  <p className="text-muted-foreground">{faq.a}</p>
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
