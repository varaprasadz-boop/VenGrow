import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Eye, Users, Clock } from "lucide-react";

export default function PropertyBoostPage() {
  const property = {
    id: "123",
    title: "Luxury 3BHK Apartment",
    location: "Bandra West, Mumbai",
    currentViews: 145,
    currentInquiries: 8,
  };

  const boostPlans = [
    {
      id: "basic",
      name: "Basic Boost",
      duration: "7 days",
      price: "₹999",
      features: ["Top search results", "2x visibility", "+50% inquiries"],
    },
    {
      id: "premium",
      name: "Premium Boost",
      duration: "15 days",
      price: "₹1,799",
      features: ["Featured listing", "4x visibility", "+100% inquiries", "Social media promotion"],
      popular: true,
    },
    {
      id: "ultimate",
      name: "Ultimate Boost",
      duration: "30 days",
      price: "₹2,999",
      features: ["Homepage banner", "6x visibility", "+150% inquiries", "Priority support"],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <TrendingUp className="h-8 w-8 text-primary" />
              Boost Your Property
            </h1>
            <p className="text-muted-foreground">
              Increase visibility and get more inquiries
            </p>
          </div>

          {/* Current Stats */}
          <div className="grid grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Eye className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{property.currentViews}</p>
                  <p className="text-sm text-muted-foreground">Current Views</p>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Users className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{property.currentInquiries}</p>
                  <p className="text-sm text-muted-foreground">Total Inquiries</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Boost Plans */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {boostPlans.map((plan) => (
              <Card
                key={plan.id}
                className={`p-8 ${plan.popular ? "border-primary border-2" : ""}`}
              >
                {plan.popular && (
                  <Badge className="mb-4">Most Popular</Badge>
                )}
                <h3 className="font-serif font-bold text-2xl mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-4xl font-bold text-primary">{plan.price}</span>
                  <span className="text-muted-foreground">/{plan.duration}</span>
                </div>

                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <span className="text-green-600 mt-1">✓</span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  className="w-full"
                  variant={plan.popular ? "default" : "outline"}
                  data-testid={`button-boost-${plan.id}`}
                >
                  Boost Now
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
