import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Building, Home, Store, Factory } from "lucide-react";

export default function PropertyTypeGuidePage() {
  const propertyTypes = [
    {
      icon: Home,
      title: "Apartments/Flats",
      description:
        "Independent units within a multi-story building, offering modern amenities and security.",
      features: [
        "Shared amenities like gym, pool, parking",
        "Maintenance handled by society",
        "Suitable for nuclear families",
        "Good investment value in urban areas",
      ],
      suitableFor: "First-time buyers, young professionals, small families",
    },
    {
      icon: Building,
      title: "Independent Houses/Villas",
      description:
        "Standalone properties offering privacy and complete ownership of land.",
      features: [
        "Complete privacy and control",
        "Own land and garden space",
        "Customizable interiors",
        "No society maintenance fees",
      ],
      suitableFor: "Large families, those seeking privacy, long-term residents",
    },
    {
      icon: Store,
      title: "Commercial Properties",
      description:
        "Office spaces, retail shops, and commercial complexes for business purposes.",
      features: [
        "High rental yields",
        "Strategic locations",
        "Business growth potential",
        "Tax benefits",
      ],
      suitableFor: "Businesses, investors, entrepreneurs",
    },
    {
      icon: Factory,
      title: "Industrial Properties",
      description:
        "Warehouses, factories, and manufacturing units for industrial use.",
      features: [
        "Large spaces",
        "Industrial infrastructure",
        "Connectivity to highways",
        "Long-term leases",
      ],
      suitableFor: "Manufacturers, logistics companies, large businesses",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center mb-12">
            <h1 className="font-serif font-bold text-4xl mb-4">
              Property Type Guide
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Understanding different property types to make an informed decision
            </p>
          </div>

          <div className="space-y-8">
            {propertyTypes.map((type, index) => (
              <Card key={index} className="p-8">
                <div className="flex items-start gap-6">
                  <div className="p-4 rounded-lg bg-primary/10 flex-shrink-0">
                    <type.icon className="h-8 w-8 text-primary" />
                  </div>

                  <div className="flex-1">
                    <h2 className="font-serif font-bold text-2xl mb-3">
                      {type.title}
                    </h2>
                    <p className="text-muted-foreground mb-6">{type.description}</p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <h3 className="font-semibold mb-4">Key Features</h3>
                        <ul className="space-y-2">
                          {type.features.map((feature, idx) => (
                            <li
                              key={idx}
                              className="flex items-start gap-2 text-sm"
                            >
                              <span className="text-primary mt-1">•</span>
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div>
                        <h3 className="font-semibold mb-4">Best Suited For</h3>
                        <p className="text-sm text-muted-foreground">
                          {type.suitableFor}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
