import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, Crown, Zap, Star } from "lucide-react";
import type { Package } from "@shared/schema";

export default function PackageSelectionPage() {
  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages"],
  });

  const activePackages = packages.filter(p => p.isActive);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-IN").format(price);
  };

  const getPackageIcon = (name: string) => {
    const lowerName = name.toLowerCase();
    if (lowerName.includes("featured") || lowerName.includes("premium")) return Crown;
    if (lowerName.includes("pro") || lowerName.includes("advanced")) return Zap;
    return Star;
  };

  const comparison = [
    { feature: "Listing Validity", key: "duration" },
    { feature: "Featured Badge", key: "featuredListings" },
    { feature: "Priority Support", key: "priority" },
    { feature: "Advanced Analytics", key: "analytics" },
    { feature: "Virtual Tour Support", key: "virtualTour" },
    { feature: "Social Media Promotion", key: "socialMedia" },
  ];

  return (
    <main className="flex-1">
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

        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="p-6">
                    <Skeleton className="h-8 w-32 mb-4" />
                    <Skeleton className="h-12 w-40 mb-6" />
                    <div className="space-y-3">
                      {[1, 2, 3, 4, 5].map((j) => (
                        <Skeleton key={j} className="h-4 w-full" />
                      ))}
                    </div>
                    <Skeleton className="h-10 w-full mt-6" />
                  </Card>
                ))}
              </div>
            ) : activePackages.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-muted-foreground">No packages available at the moment.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                {activePackages.map((pkg) => {
                  const PackageIcon = getPackageIcon(pkg.name);
                  return (
                    <Card
                      key={pkg.id}
                      className={`p-6 relative ${
                        pkg.isPopular ? "border-primary shadow-lg scale-105" : ""
                      }`}
                    >
                      {pkg.isPopular && (
                        <Badge className="absolute -top-3 left-1/2 -translate-x-1/2">
                          Most Popular
                        </Badge>
                      )}
                      <div className="text-center mb-6">
                        <div className="inline-flex p-3 rounded-full bg-primary/10 mb-4">
                          <PackageIcon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-serif font-bold text-2xl mb-2">{pkg.name}</h3>
                        <div className="flex items-baseline justify-center gap-1">
                          <span className="text-3xl font-bold">₹{formatPrice(pkg.price)}</span>
                          <span className="text-muted-foreground">/{pkg.duration} days</span>
                        </div>
                      </div>

                      <ul className="space-y-3 mb-6">
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          Up to {pkg.listingLimit} property listings
                        </li>
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {pkg.duration}-day listing validity
                        </li>
                        {pkg.featuredListings > 0 && (
                          <li className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            {pkg.featuredListings} featured listing slots
                          </li>
                        )}
                        {pkg.features?.map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm">
                            <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {pkg.description && (
                          <li className="flex items-center gap-2 text-sm text-muted-foreground">
                            {pkg.description}
                          </li>
                        )}
                      </ul>

                      <Link href={`/seller/payment?package=${pkg.id}`}>
                        <Button
                          className="w-full"
                          variant={pkg.isPopular ? "default" : "outline"}
                          data-testid={`button-select-${pkg.id}`}
                        >
                          Select Plan
                        </Button>
                      </Link>
                    </Card>
                  );
                })}
              </div>
            )}

            {!isLoading && activePackages.length > 0 && (
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
                          {activePackages.map((pkg) => (
                            <th
                              key={pkg.id}
                              className={`text-center p-4 font-semibold ${
                                pkg.isPopular ? "bg-primary/5" : ""
                              }`}
                            >
                              <div className="flex flex-col items-center gap-1">
                                <span>{pkg.name}</span>
                                {pkg.isPopular && (
                                  <Badge variant="default" className="text-xs">
                                    Popular
                                  </Badge>
                                )}
                              </div>
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b">
                          <td className="p-4 text-sm">Property Listings</td>
                          {activePackages.map((pkg) => (
                            <td
                              key={pkg.id}
                              className={`p-4 text-center text-sm ${
                                pkg.isPopular ? "bg-primary/5" : ""
                              }`}
                            >
                              {pkg.listingLimit} listings
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm">Listing Validity</td>
                          {activePackages.map((pkg) => (
                            <td
                              key={pkg.id}
                              className={`p-4 text-center text-sm ${
                                pkg.isPopular ? "bg-primary/5" : ""
                              }`}
                            >
                              {pkg.duration} days
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm">Featured Listings</td>
                          {activePackages.map((pkg) => (
                            <td
                              key={pkg.id}
                              className={`p-4 text-center text-sm ${
                                pkg.isPopular ? "bg-primary/5" : ""
                              }`}
                            >
                              {pkg.featuredListings > 0 ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b">
                          <td className="p-4 text-sm">Priority Support</td>
                          {activePackages.map((pkg) => (
                            <td
                              key={pkg.id}
                              className={`p-4 text-center text-sm ${
                                pkg.isPopular ? "bg-primary/5" : ""
                              }`}
                            >
                              {pkg.features?.includes("priority_support") ||
                              pkg.features?.includes("Priority Support") ? (
                                <CheckCircle className="h-5 w-5 text-green-600 mx-auto" />
                              ) : (
                                <span className="text-muted-foreground">—</span>
                              )}
                            </td>
                          ))}
                        </tr>
                        <tr className="border-b last:border-0">
                          <td className="p-4 text-sm">Price</td>
                          {activePackages.map((pkg) => (
                            <td
                              key={pkg.id}
                              className={`p-4 text-center text-sm font-semibold ${
                                pkg.isPopular ? "bg-primary/5" : ""
                              }`}
                            >
                              ₹{formatPrice(pkg.price)}
                            </td>
                          ))}
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </Card>
              </div>
            )}

            <div className="mt-16 max-w-3xl mx-auto">
              <h2 className="font-serif font-bold text-3xl mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-6">
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Can I upgrade my plan later?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can upgrade to a higher plan at any time. The remaining balance from
                    your current plan will be adjusted.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">What happens when my plan expires?</h3>
                  <p className="text-sm text-muted-foreground">
                    Your listings will be automatically deactivated. You can renew your plan to
                    reactivate them.
                  </p>
                </Card>
                <Card className="p-6">
                  <h3 className="font-semibold mb-2">Can I cancel my subscription?</h3>
                  <p className="text-sm text-muted-foreground">
                    Yes, you can cancel anytime. Your plan will remain active until the end of the
                    billing period.
                  </p>
                </Card>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
}
