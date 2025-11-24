import { Building, Home, LandPlot, Store } from "lucide-react";
import { Card } from "@/components/ui/card";

interface Category {
  icon: React.ReactNode;
  title: string;
  count: number;
  onClick?: () => void;
}

export default function CategorySection() {
  const categories: Category[] = [
    {
      icon: <Building className="h-8 w-8" />,
      title: "Apartments",
      count: 5420,
    },
    {
      icon: <Home className="h-8 w-8" />,
      title: "Villas",
      count: 1230,
    },
    {
      icon: <LandPlot className="h-8 w-8" />,
      title: "Plots & Land",
      count: 890,
    },
    {
      icon: <Store className="h-8 w-8" />,
      title: "Commercial",
      count: 650,
    },
  ];

  const handleCategoryClick = (title: string) => {
    console.log(`Category clicked: ${title}`);
  };

  return (
    <section className="py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
            Browse by Property Type
          </h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Find your perfect property from our diverse range of listings across India
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category, index) => (
            <Card
              key={index}
              className="p-6 text-center space-y-3 hover-elevate active-elevate-2 cursor-pointer transition-all group"
              onClick={() => handleCategoryClick(category.title)}
              data-testid={`card-category-${category.title.toLowerCase().replace(/\s/g, '-')}`}
            >
              <div className="inline-flex p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                {category.icon}
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-1">{category.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {category.count.toLocaleString()} properties
                </p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
