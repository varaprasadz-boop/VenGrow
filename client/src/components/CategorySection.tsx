import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Building2, Home, TreePine, Store, Warehouse, LandPlot } from "lucide-react";

const categories = [
  { 
    name: "Apartments", 
    slug: "apartment",
    icon: Building2,
    count: 2450
  },
  { 
    name: "Villas", 
    slug: "villa",
    icon: Home,
    count: 890
  },
  { 
    name: "Plots", 
    slug: "plot",
    icon: LandPlot,
    count: 1230
  },
  { 
    name: "Commercial", 
    slug: "commercial",
    icon: Store,
    count: 567
  },
  { 
    name: "Farmhouse", 
    slug: "farmhouse",
    icon: TreePine,
    count: 234
  },
  { 
    name: "Warehouse", 
    slug: "warehouse",
    icon: Warehouse,
    count: 189
  },
];

export default function CategorySection() {
  return (
    <section className="py-16" data-testid="section-categories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
            Explore by Property Type
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find the perfect property that matches your needs from our diverse collection
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((category) => {
            const IconComponent = category.icon;
            
            return (
              <Link 
                key={category.slug} 
                href={`/listings?type=${category.slug}`}
              >
                <Card
                  className="p-6 text-center space-y-3 hover-elevate active-elevate-2 cursor-pointer transition-all group"
                  data-testid={`card-category-${category.slug}`}
                >
                  <div className="inline-flex p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                    <IconComponent className="h-8 w-8" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      {category.count.toLocaleString()} Properties
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
