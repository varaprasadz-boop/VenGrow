import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle } from "lucide-react";

export default function PackagesPage() {
  const packages = [
    {
      name: "Basic",
      price: 999,
      duration: "month",
      maxListings: 5,
      features: [
        "5 active listings",
        "30 days listing duration",
        "Standard placement in search results",
        "Basic property analytics",
        "Email support",
        "Property photos (up to 10 per listing)",
      ],
      isPopular: false,
    },
    {
      name: "Premium",
      price: 2999,
      duration: "month",
      maxListings: 20,
      features: [
        "20 active listings",
        "60 days listing duration",
        "Priority placement in search results",
        "Featured badge on listings",
        "Full analytics dashboard",
        "Email & chat support",
        "Property photos (up to 20 per listing)",
        "Video tour upload",
        "Social media sharing tools",
      ],
      isPopular: true,
    },
    {
      name: "Featured",
      price: 9999,
      duration: "month",
      maxListings: "Unlimited",
      features: [
        "Unlimited active listings",
        "90 days listing duration",
        "Top homepage placement",
        "Premium verified badge",
        "Advanced analytics & insights",
        "Priority 24/7 support",
        "Dedicated account manager",
        "Property photos (unlimited per listing)",
        "Video tour & 360° view upload",
        "Featured on social media",
        "Custom branding options",
      ],
      isPopular: false,
    },
  ];

  const features = [
    "List properties with photos and detailed descriptions",
    "Receive inquiries directly from interested buyers",
    "Track property views and engagement",
    "Manage all listings from one dashboard",
    "Secure payment through Razorpay",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Pricing Plans</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-4">
              Choose Your Perfect Package
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Select the plan that best fits your property listing needs. All plans include our core features.
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {packages.map((pkg) => (
                <PackageCard key={pkg.name} {...pkg} />
              ))}
            </div>

            {/* Features Included */}
            <div className="max-w-3xl mx-auto">
              <h2 className="font-serif font-bold text-2xl text-center mb-8">
                All Packages Include
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {features.map((feature, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <CheckCircle className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-muted-foreground">{feature}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl text-center mb-12">
              Frequently Asked Questions
            </h2>
            <div className="space-y-6">
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">Can I upgrade or downgrade my package?</h3>
                <p className="text-muted-foreground">
                  Yes, you can change your package at any time. Upgrades take effect immediately, and downgrades apply from your next billing cycle.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">What happens if I exceed my listing limit?</h3>
                <p className="text-muted-foreground">
                  You'll need to either upgrade to a higher package or remove some existing listings before adding new ones.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">Is there a refund policy?</h3>
                <p className="text-muted-foreground">
                  Yes, we offer a 7-day money-back guarantee. If you're not satisfied with our service, contact support for a full refund.
                </p>
              </div>
              <div className="bg-background p-6 rounded-lg border">
                <h3 className="font-semibold mb-2">How long do listings stay active?</h3>
                <p className="text-muted-foreground">
                  Listing duration depends on your package: 30 days for Basic, 60 days for Premium, and 90 days for Featured. You can renew at any time.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="font-serif font-bold text-3xl mb-4">
              Ready to Start Listing?
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Join thousands of successful sellers on PropConnect
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" data-testid="button-get-started">
                Get Started Now
              </Button>
              <Button variant="outline" size="lg" data-testid="button-contact-sales">
                Contact Sales
              </Button>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
