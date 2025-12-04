import { Building, Home, LandPlot, Store, Loader2 } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";

interface PropertyType {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  propertyCount?: number;
  isActive: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  apartment: <Building className="h-8 w-8" />,
  villa: <Home className="h-8 w-8" />,
  plot: <LandPlot className="h-8 w-8" />,
  commercial: <Store className="h-8 w-8" />,
  building: <Building className="h-8 w-8" />,
  home: <Home className="h-8 w-8" />,
  land: <LandPlot className="h-8 w-8" />,
  store: <Store className="h-8 w-8" />,
};

export default function CategorySection() {
  const { data: propertyTypes = [], isLoading } = useQuery<PropertyType[]>({
    queryKey: ["/api/property-types"],
    staleTime: 5 * 60 * 1000,
  });

  const activeCategories = propertyTypes.filter(pt => pt.isActive).slice(0, 4);

  const getIcon = (category: PropertyType) => {
    const iconKey = category.icon?.toLowerCase() || category.slug.toLowerCase();
    return iconMap[iconKey] || <Building className="h-8 w-8" />;
  };

  if (isLoading) {
    return (
      <section className="py-16" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <Skeleton className="h-10 w-72 mx-auto mb-4" />
            <Skeleton className="h-6 w-96 mx-auto" />
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-36 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (!activeCategories.length) {
    return null;
  }

  return (
    <section className="py-16" data-testid="section-categories">
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
          {activeCategories.map((category) => (
            <Link 
              key={category.id} 
              href={`/listings?propertyType=${category.slug}`}
            >
              <Card
                className="p-6 text-center space-y-3 hover-elevate active-elevate-2 cursor-pointer transition-all group"
                data-testid={`card-category-${category.slug}`}
              >
                <div className="inline-flex p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  {getIcon(category)}
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {(category.propertyCount || 0).toLocaleString()} properties
                  </p>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
