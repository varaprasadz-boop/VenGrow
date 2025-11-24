import { Link } from "wouter";
import { Building2, User, Briefcase, Building } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SellerTypePage() {
  const sellerTypes = [
    {
      type: "individual",
      title: "Individual Owner",
      description: "I own a property and want to sell or rent it directly",
      icon: User,
      features: [
        "List your own properties",
        "No brokerage fees",
        "Direct communication with buyers",
        "Simple verification process",
      ],
    },
    {
      type: "broker",
      title: "Broker/Agent",
      description: "I'm a real estate broker representing multiple clients",
      icon: Briefcase,
      features: [
        "List multiple client properties",
        "Professional broker badge",
        "Advanced listing tools",
        "RERA verification",
      ],
    },
    {
      type: "builder",
      title: "Builder/Developer",
      description: "I'm a construction company with new projects to showcase",
      icon: Building,
      features: [
        "Showcase entire projects",
        "Bulk listing capabilities",
        "Premium branding options",
        "Project completion tracking",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-6xl">
        {/* Logo */}
        <div className="text-center mb-12">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-4">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">PropConnect</span>
            </a>
          </Link>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl mb-3">
            Choose Your Seller Type
          </h1>
          <p className="text-muted-foreground text-lg">
            Select the option that best describes you
          </p>
        </div>

        {/* Seller Type Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {sellerTypes.map((seller) => {
            const Icon = seller.icon;
            return (
              <Card
                key={seller.type}
                className="p-8 hover-elevate active-elevate-2 cursor-pointer transition-all group"
                data-testid={`card-${seller.type}`}
              >
                <div className="text-center mb-6">
                  <div className="inline-flex p-6 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-4">
                    <Icon className="h-10 w-10" />
                  </div>
                  <h2 className="font-serif font-bold text-2xl mb-2">
                    {seller.title}
                  </h2>
                  <p className="text-muted-foreground">
                    {seller.description}
                  </p>
                </div>

                <ul className="space-y-3 mb-8">
                  {seller.features.map((feature, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Link href={`/seller/register/${seller.type}`}>
                  <Button className="w-full" data-testid={`button-select-${seller.type}`}>
                    Continue as {seller.title.split("/")[0]}
                  </Button>
                </Link>
              </Card>
            );
          })}
        </div>

        {/* Back Link */}
        <div className="text-center mt-8">
          <Link href="/login">
            <a className="text-sm text-muted-foreground hover:text-foreground">
              Already have an account? Login
            </a>
          </Link>
        </div>
      </div>
    </div>
  );
}
