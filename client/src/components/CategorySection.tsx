import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import * as Icons from "lucide-react";
import type { PropertyTypeManaged } from "@shared/schema";

interface SiteSetting {
  key: string;
  value: string | null;
}

export default function CategorySection() {
  const { data: propertyTypes = [], isLoading } = useQuery<PropertyTypeManaged[]>({
    queryKey: ["/api/property-types"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const getSettingValue = (key: string): string | null => {
    const setting = siteSettings.find(s => s.key === key);
    return setting?.value || null;
  };

  const sectionTitle = getSettingValue("category_section_title");
  const sectionSubtitle = getSettingValue("category_section_subtitle");
  const propertyCountSuffix = getSettingValue("category_property_count_suffix");

  const activeCategories = propertyTypes.filter(pt => pt.isActive).slice(0, 4);

  if (isLoading || settingsLoading) {
    return (
      <section className="py-16" data-testid="section-categories">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
        {(sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-12">
            {sectionTitle && (
              <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-muted-foreground max-w-2xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {activeCategories.map((category) => {
            const IconComponent = category.icon ? (Icons as any)[category.icon] : null;
            return (
              <Link 
                key={category.id} 
                href={`/listings?propertyType=${category.slug}`}
              >
                <Card
                  className="p-6 text-center space-y-3 hover-elevate active-elevate-2 cursor-pointer transition-all group"
                  data-testid={`card-category-${category.slug}`}
                >
                  {IconComponent && (
                    <div className="inline-flex p-4 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      <IconComponent className="h-8 w-8" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{category.name}</h3>
                    {propertyCountSuffix && category.propertyCount !== undefined && (
                      <p className="text-sm text-muted-foreground">
                        {category.propertyCount.toLocaleString()} {propertyCountSuffix}
                      </p>
                    )}
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
