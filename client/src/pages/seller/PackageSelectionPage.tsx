import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { format, differenceInDays } from "date-fns";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Crown, Zap, Star, Calendar, Package as PackageIcon, AlertTriangle } from "lucide-react";
import type { Package, SellerSubscription } from "@shared/schema";

interface CurrentSubscriptionResponse {
  success: boolean;
  subscription: SellerSubscription | null;
  package: Package | null;
  sellerType?: string;
  usage?: {
    listingsUsed: number;
    listingLimit: number;
    remainingListings: number;
    featuredUsed: number;
    featuredLimit: number;
  };
}

export default function PackageSelectionPage() {
  const { data: currentSubData, isLoading: isLoadingSubscription } = useQuery<CurrentSubscriptionResponse>({
    queryKey: ["/api/subscriptions/current"],
  });

  const sellerType = currentSubData?.sellerType;

  const { data: packages = [], isLoading } = useQuery<Package[]>({
    queryKey: ["/api/packages", { sellerType: sellerType || undefined }],
    enabled: !!sellerType,
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

  const currentSubscription = currentSubData?.subscription;
  const currentPackage = currentSubData?.package;
  const usage = currentSubData?.usage;

  const getDaysRemaining = () => {
    if (!currentSubscription?.endDate) return 0;
    return differenceInDays(new Date(currentSubscription.endDate), new Date());
  };

  const daysRemaining = getDaysRemaining();
  const isExpiringSoon = daysRemaining <= 7 && daysRemaining > 0;
  const isExpired = daysRemaining <= 0;

  return (
    <main className="flex-1">
        <section className="py-8 bg-gradient-to-b from-primary/5 to-background">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Seller Packages</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
              {currentSubscription ? "My Package" : "Choose Your Perfect Plan"}
            </h1>
            <p className="text-lg text-muted-foreground">
              {currentSubscription 
                ? "Manage your current subscription and upgrade when needed"
                : "Select a package that fits your property listing needs"}
            </p>
          </div>
        </section>

        {isLoadingSubscription ? (
          <section className="py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-6">
                <Skeleton className="h-8 w-48 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </Card>
            </div>
          </section>
        ) : currentSubscription && currentPackage ? (
          <section className="py-8">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className={`p-6 ${isExpired ? 'border-destructive' : isExpiringSoon ? 'border-orange-500 dark:border-orange-400' : 'border-primary'}`}>
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="p-2 rounded-full bg-primary/10">
                        <PackageIcon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-serif font-bold text-2xl" data-testid="text-current-package-name">
                          {currentPackage.name}
                        </h2>
                        <Badge variant={isExpired ? "destructive" : isExpiringSoon ? "secondary" : "default"}>
                          {isExpired ? "Expired" : "Active"}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">Expires:</span>
                        <span className="font-medium" data-testid="text-expiry-date">
                          {currentSubscription.endDate 
                            ? format(new Date(currentSubscription.endDate), "dd MMM yyyy")
                            : "N/A"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        {isExpired ? (
                          <Badge variant="destructive" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            Subscription expired
                          </Badge>
                        ) : isExpiringSoon ? (
                          <Badge variant="secondary" className="gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {daysRemaining} days remaining
                          </Badge>
                        ) : (
                          <span className="text-green-600 font-medium">
                            {daysRemaining} days remaining
                          </span>
                        )}
                      </div>
                    </div>

                    {usage && (
                      <div className="space-y-3">
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-muted-foreground">Listings Used</span>
                            <span className="font-medium" data-testid="text-listings-usage">
                              {usage.listingsUsed} / {usage.listingLimit}
                            </span>
                          </div>
                          <Progress 
                            value={(usage.listingsUsed / usage.listingLimit) * 100} 
                            className="h-2"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            {usage.remainingListings} listings remaining
                          </p>
                        </div>
                        {usage.featuredLimit > 0 && (
                          <div>
                            <div className="flex justify-between text-sm mb-1">
                              <span className="text-muted-foreground">Featured Listings</span>
                              <span className="font-medium">
                                {usage.featuredUsed} / {usage.featuredLimit}
                              </span>
                            </div>
                            <Progress 
                              value={(usage.featuredUsed / usage.featuredLimit) * 100} 
                              className="h-2"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2 md:min-w-[140px]">
                    <Link href="/seller/packages/buy">
                      <Button className="w-full" data-testid="button-upgrade-package">
                        {isExpired ? "Renew Package" : "Upgrade"}
                      </Button>
                    </Link>
                    <Link href="/seller/subscription-history">
                      <Button variant="outline" className="w-full" data-testid="button-view-history">
                        View History
                      </Button>
                    </Link>
                  </div>
                </div>
              </Card>
            </div>
          </section>
        ) : null}

        <section className="py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {currentSubscription && (
              <h2 className="font-serif font-bold text-3xl mb-8 text-center">
                {isExpired ? "Renew Your Package" : "Upgrade Your Package"}
              </h2>
            )}
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
                        <li className="flex items-center gap-2 text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 flex-shrink-0" />
                          {pkg.featuredListings} featured listing slots
                        </li>
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
                              {pkg.featuredListings} featured listings
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
