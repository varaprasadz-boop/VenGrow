import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Settings, Building } from "lucide-react";
import * as Icons from "lucide-react";

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface HowItWorksStep {
  id: string;
  title: string;
  description: string;
  icon: string;
  stepType: "buyer" | "seller";
  sortOrder: number;
  isActive: boolean;
}

interface HowItWorksFeature {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName] || Building;
  return IconComponent;
};

export default function HowItWorksPage() {
  const { data: pageContent, isLoading: pageLoading } = useQuery<StaticPage>({
    queryKey: ["/api/static-pages", "how-it-works"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: stepsData = [], isLoading: stepsLoading } = useQuery<HowItWorksStep[]>({
    queryKey: ["/api/how-it-works-steps"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: featuresData = [], isLoading: featuresLoading } = useQuery<HowItWorksFeature[]>({
    queryKey: ["/api/how-it-works-features"],
    staleTime: 5 * 60 * 1000,
  });

  const buyerSteps = stepsData
    .filter(s => s.stepType === "buyer" && s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const sellerSteps = stepsData
    .filter(s => s.stepType === "seller" && s.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const features = featuresData
    .filter(f => f.isActive)
    .sort((a, b) => a.sortOrder - b.sortOrder);

  const hasContent = pageContent?.title || pageContent?.content;
  const hasSteps = buyerSteps.length > 0 || sellerSteps.length > 0;
  const hasFeatures = features.length > 0;

  const StepSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[1, 2, 3, 4].map(i => (
        <Skeleton key={i} className="h-48 w-full rounded-lg" />
      ))}
    </div>
  );

  if (pageLoading || stepsLoading || featuresLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Skeleton className="h-8 w-32 mx-auto mb-4" />
              <Skeleton className="h-12 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-full mx-auto" />
            </div>
          </section>
          <section className="py-16">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <StepSkeleton />
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasContent && !hasSteps && !hasFeatures) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">How It Works</Badge>
              <Card className="p-8 text-center max-w-md mx-auto mt-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">Page Not Configured</h2>
                <p className="text-muted-foreground text-sm">
                  Configure How It Works content, steps, and features in the Admin Panel.
                </p>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        {hasContent && (
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background" data-testid="section-how-hero">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">How It Works</Badge>
              {pageContent?.title && (
                <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6" data-testid="text-how-title">
                  {pageContent.title}
                </h1>
              )}
              {pageContent?.content && (
                <p className="text-lg text-muted-foreground" data-testid="text-how-description">
                  {pageContent.content}
                </p>
              )}
            </div>
          </section>
        )}

        {buyerSteps.length > 0 && (
          <section className="py-16" data-testid="section-buyer-steps">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" data-testid="grid-buyer-steps">
                {buyerSteps.map((step, index) => {
                  const Icon = getIcon(step.icon);
                  return (
                    <Card key={step.id} className="p-6 text-center relative" data-testid={`card-buyer-step-${index + 1}`}>
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
                <Link href="/listings">
                  <Button size="lg" data-testid="button-start-searching">
                    Browse Properties
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {sellerSteps.length > 0 && (
          <section className="py-16 bg-muted/30" data-testid="section-seller-steps">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8" data-testid="grid-seller-steps">
                {sellerSteps.map((step, index) => {
                  const Icon = getIcon(step.icon);
                  return (
                    <Card key={step.id} className="p-6 text-center relative" data-testid={`card-seller-step-${index + 1}`}>
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
                <Link href="/seller/type">
                  <Button size="lg" data-testid="button-become-seller">
                    Start Selling
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}

        {features.length > 0 && (
          <section className="py-16" data-testid="section-features">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" data-testid="grid-features">
                {features.map((feature, index) => {
                  const Icon = getIcon(feature.icon);
                  return (
                    <Card key={feature.id} className="p-6" data-testid={`card-feature-${index + 1}`}>
                      <div className="flex items-start gap-3">
                        <div className="p-2 rounded-lg bg-primary/10 mt-1">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                          <p className="text-sm text-muted-foreground">
                            {feature.description}
                          </p>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
