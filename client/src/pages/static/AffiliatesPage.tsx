import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Users, TrendingUp, Award } from "lucide-react";

export default function AffiliatesPage() {
  const benefits = [
    {
      icon: DollarSign,
      title: "Attractive Commission",
      description: "Earn up to 20% commission on every successful referral",
    },
    {
      icon: Users,
      title: "Growing Network",
      description: "Join thousands of successful affiliates across India",
    },
    {
      icon: TrendingUp,
      title: "Recurring Revenue",
      description: "Earn commissions on subscription renewals",
    },
    {
      icon: Award,
      title: "Performance Bonuses",
      description: "Top performers get exclusive rewards and incentives",
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
              PropConnect Affiliate Program
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Partner with us and earn attractive commissions
            </p>
            <Button size="lg" data-testid="button-join">
              Join as Affiliate
            </Button>
          </div>
        </div>

        {/* Benefits */}
        <div className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Why Join Our Program?
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

        {/* How It Works */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              How It Works
            </h2>
            <div className="space-y-8">
              {[
                {
                  step: "1",
                  title: "Sign Up",
                  description: "Register for free and get your unique referral link",
                },
                {
                  step: "2",
                  title: "Promote",
                  description: "Share your link on your website, social media, or blog",
                },
                {
                  step: "3",
                  title: "Earn",
                  description: "Get paid for every successful referral that signs up",
                },
              ].map((step, index) => (
                <Card key={index} className="p-8">
                  <div className="flex items-start gap-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-full bg-primary/10 flex-shrink-0">
                      <span className="text-xl font-bold text-primary">
                        {step.step}
                      </span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-xl mb-2">{step.title}</h3>
                      <p className="text-muted-foreground">{step.description}</p>
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
            <h2 className="font-serif font-bold text-3xl mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join our affiliate program today and start earning
            </p>
            <Button size="lg" data-testid="button-signup">
              Sign Up Now
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
