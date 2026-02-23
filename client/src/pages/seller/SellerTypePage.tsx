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
      title: "Channel Partner / Broker Plans",
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
      type: "corporate",
      title: "Builder / Corporate",
      description: "I'm a construction company or developer with projects to showcase",
      icon: Building,
      features: [
        "Company logo & branding display",
        "Upload company brochures (PDF)",
        "Get featured as Verified Builder",
        "Bulk listing capabilities",
      ],
    },
  ];

  return (
    <div className="min-h-screen flex flex-col justify-center bg-muted/30 p-4 py-4 md:py-8 overflow-auto">
      <div className="w-full max-w-6xl mx-auto flex flex-col justify-center min-h-0">
        {/* Logo - compact on mobile */}
        <div className="text-center mb-4 md:mb-12 shrink-0">
          <Link href="/" className="inline-flex items-center mb-2 md:mb-4">
            <img src="/VenGrow.png" alt="VenGrow" className="h-10 md:h-12 w-auto max-w-[180px] object-contain" />
          </Link>
          <h1 className="font-serif font-bold text-2xl md:text-3xl sm:text-4xl mb-1 md:mb-3">
            Choose Your Seller Type
          </h1>
          <p className="text-muted-foreground text-sm md:text-lg">
            Select the option that best describes you
          </p>
        </div>

        {/* Seller Type Cards - compact on mobile, no feature list */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 min-h-0">
          {sellerTypes.map((seller) => {
            const Icon = seller.icon;
            return (
              <Card
                key={seller.type}
                className="p-4 md:p-8 hover-elevate active-elevate-2 cursor-pointer transition-all group"
                data-testid={`card-${seller.type}`}
              >
                <div className="text-center mb-4 md:mb-6">
                  <div className="inline-flex p-4 md:p-6 rounded-full bg-primary/10 group-hover:bg-primary group-hover:text-primary-foreground transition-colors mb-2 md:mb-4">
                    <Icon className="h-8 w-8 md:h-10 md:w-10" />
                  </div>
                  <h2 className="font-serif font-bold text-lg md:text-2xl mb-1 md:mb-2">
                    {seller.title}
                  </h2>
                  <p className="text-muted-foreground text-sm md:text-base">
                    {seller.description}
                  </p>
                </div>

                <ul className="hidden md:block space-y-3 mb-8">
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
        <div className="text-center mt-4 md:mt-8 shrink-0">
          <Link href="/login" className="text-sm text-muted-foreground hover:text-foreground">
            Already have an account? Login
          </Link>
        </div>
      </div>
    </div>
  );
}
