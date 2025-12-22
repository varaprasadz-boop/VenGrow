
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check, Star, TrendingUp } from "lucide-react";

export default function UpgradeAccountPage() {
  const plans = [
    {
      name: "Basic",
      price: "₹0",
      period: "Free Forever",
      features: [
        "Up to 3 property listings",
        "Basic analytics",
        "Standard support",
        "7-day listing duration",
      ],
      current: true,
    },
    {
      name: "Professional",
      price: "₹999",
      period: "per month",
      features: [
        "Unlimited listings",
        "Advanced analytics",
        "Priority support",
        "30-day listing duration",
        "Featured badge",
        "Lead management tools",
      ],
      popular: true,
    },
    {
      name: "Enterprise",
      price: "₹2,999",
      period: "per month",
      features: [
        "Everything in Professional",
        "Dedicated account manager",
        "Custom branding",
        "API access",
        "White-label solution",
        "Team collaboration tools",
      ],
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl mb-4">
              Upgrade Your Account
            </h1>
            <p className="text-lg text-muted-foreground">
              Unlock premium features and grow your real estate business
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card
                key={index}
                className={`p-8 relative ${
                  plan.popular ? "border-primary border-2" : ""
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-primary text-primary-foreground px-4 py-1">
                      <Star className="h-3 w-3 mr-1" />
                      Most Popular
                    </Badge>
                  </div>
                )}

                {plan.current && (
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500 px-4 py-1">
                      Current Plan
                    </Badge>
                  </div>
                )}

                <div className="text-center mb-8">
                  <h3 className="font-serif font-bold text-2xl mb-2">
                    {plan.name}
                  </h3>
                  <div className="mb-4">
                    <span className="text-5xl font-bold font-serif text-primary">
                      {plan.price}
                    </span>
                    <span className="text-muted-foreground">/{plan.period}</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {plan.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-green-100 dark:bg-green-900/20 flex-shrink-0 mt-0.5">
                        <Check className="h-3 w-3 text-green-600" />
                      </div>
                      <span className="text-sm">{feature}</span>
                    </div>
                  ))}
                </div>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : plan.current ? "outline" : "outline"}
                  disabled={plan.current}
                  data-testid={`button-select-${index}`}
                >
                  {plan.current ? "Current Plan" : `Upgrade to ${plan.name}`}
                </Button>
              </Card>
            ))}
          </div>

          {/* Benefits */}
          <Card className="p-8 mt-12">
            <div className="text-center mb-8">
              <h2 className="font-serif font-bold text-2xl mb-4">
                Why Upgrade?
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  title: "More Visibility",
                  description: "Featured listings get 5x more views than standard ones",
                },
                {
                  title: "Better Leads",
                  description:
                    "Advanced tools help you convert more inquiries into sales",
                },
                {
                  title: "Save Time",
                  description: "Automation features save hours of manual work every week",
                },
              ].map((benefit, index) => (
                <div key={index} className="text-center">
                  <div className="inline-flex p-4 rounded-full bg-primary/10 mb-4">
                    <TrendingUp className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {benefit.description}
                  </p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
  );
}
