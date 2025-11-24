import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PackageCard from "@/components/PackageCard";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { CheckCircle } from "lucide-react";

export default function PackageSelectionPage() {
  const packages = [
    {
      id: "basic",
      name: "Basic",
      price: 999,
      duration: "month",
      maxListings: 5,
      features: [
        "Up to 5 property listings",
        "Basic property details",
        "Email support",
        "30-day listing validity",
        "Basic analytics",
      ],
    },
    {
      id: "premium",
      name: "Premium",
      price: 2999,
      duration: "month",
      maxListings: 20,
      features: [
        "Up to 20 property listings",
        "Featured badge on listings",
        "Priority email & phone support",
        "60-day listing validity",
        "Advanced analytics & insights",
        "WhatsApp inquiry notifications",
        "Up to 20 photos per listing",
      ],
      isPopular: true,
    },
    {
      id: "featured",
      name: "Featured",
      price: 9999,
      duration: "month",
      maxListings: "Unlimited",
      features: [
        "Unlimited property listings",
        "Featured & verified badges",
        "Dedicated account manager",
        "90-day listing validity",
        "Premium analytics & reports",
        "Priority placement in search",
        "WhatsApp & SMS notifications",
        "Unlimited photos per listing",
        "Virtual tour support",
        "Social media promotion",
      ],
    },
  ];

  const comparison = [
    {
      feature: "Property Listings",
      basic: "5 listings",
      premium: "20 listings",
      featured: "Unlimited",
    },
    {
      feature: "Listing Validity",
      basic: "30 days",
      premium: "60 days",
      featured: "90 days",
    },
    {
      feature: "Photos per Listing",
      basic: "10 photos",
      premium: "20 photos",
      featured: "Unlimited",
    },
    {
      feature: "Featured Badge",
      basic: false,
      premium: true,
      featured: true,
    },
    {
      feature: "Priority Support",
      basic: false,
      premium: true,
      featured: true,
    },
    {
      feature: "Advanced Analytics",
      basic: false,
      premium: true,
      featured: true,
    },
    {
      feature: "Virtual Tour Support",
      basic: false,
      premium: false,
      featured: true,
    },
    {
      feature: "Social Media Promotion",
      basic: false,
      premium: false,
      featured: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Seller Packages</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              Choose Your Perfect Plan
            </h1>
            <p className="text-lg text-muted-foreground">
              Select a package that fits your property listing needs
            </p>
          </div>
        </section>

        {/* Packages */}
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
              {packages.map((pkg) => (
                <PackageCard key={pkg.id} {...pkg} />
              ))}
            </div>

            {/* Comparison Table */}
            <div>
              <h2 className="font-serif font-bold text-3xl mb-8 text-center">
                Detailed Feature Comparison
              </h2>
              <Card className="overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left p-4 font-semibold">Feature</th>
                        <th className="text-center p-4 font-semibold">Basic</th>
                        <th className="text-center p-4 font-semibold bg-primary/5">
                          <div className="flex flex-col items-center gap-1">
                            <span>Premium</span>
                            <Badge variant="default" className="text-xs">Popular</Badge>
                          </div>
                        </th>
                        <th className="text-center p-4 font-semibold">Featured</th>
                      </tr>
                    </thead>
                    <tbody>
                      {comparison.map((row, index) => (
                        <tr key={index} className="border-b last:border-0">
                          <td className="p-4 text-sm">{row.feature}</td>
                          <td className="p-4 text-center text-sm">
                            {typeof row.basic === "boolean" ? (
                              row.basic ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )
                            ) : (
                              row.basic
                            )}
                          </td>
                          <td className="p-4 text-center text-sm bg-primary/5">
                            {typeof row.premium === "boolean" ? (
                              row.premium ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )
                            ) : (
                              row.premium
                            )}
                          </td>
                          <td className="p-4 text-center text-sm">
                            {typeof row.featured === "boolean" ? (
                              row.featured ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )
                            ) : (
                              row.featured
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </div>

            {/* FAQ */}
            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="font-serif font-bold text-3xl mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Can I upgrade my plan later?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can upgrade to a higher plan at any time. The remaining balance from your current plan will be adjusted.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">What happens when my plan expires?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your listings will be automatically deactivated. You can renew your plan to reactivate them.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel anytime. Your plan will remain active until the end of the billing period.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
