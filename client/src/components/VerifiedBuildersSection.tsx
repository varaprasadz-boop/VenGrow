import { Link } from "wouter";
import { BadgeCheck, Building2, ArrowRight, Settings } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";

interface VerifiedBuilder {
  id: string;
  companyName: string;
  logoUrl: string;
  propertyCount: number;
  slug?: string;
  isVerified?: boolean;
  isActive?: boolean;
}

interface SiteSetting {
  key: string;
  value: string | null;
}

export default function VerifiedBuildersSection() {
  const { data: builders = [], isLoading } = useQuery<VerifiedBuilder[]>({
    queryKey: ["/api/verified-builders"],
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

  const badgeText = getSettingValue("builders_badge_text");
  const sectionTitle = getSettingValue("builders_section_title");
  const sectionSubtitle = getSettingValue("builders_section_subtitle");
  const verifiedBadge = getSettingValue("builders_verified_badge");
  const propertiesSuffix = getSettingValue("builders_properties_suffix");
  const viewAllText = getSettingValue("builders_view_all_text");
  const viewAllUrl = getSettingValue("builders_view_all_url");
  const builderUrlPattern = getSettingValue("builders_url_pattern");
  const emptyTitle = getSettingValue("builders_empty_title");
  const emptyDescription = getSettingValue("builders_empty_description");
  const adminPromptTitle = getSettingValue("admin_config_prompt_title");
  const adminPromptDescription = getSettingValue("admin_config_prompt_description");
  const urlMissingTitle = getSettingValue("builders_url_missing_title");
  const urlMissingDescription = getSettingValue("builders_url_missing_description");

  const activeBuilders = builders.filter(b => b.isActive !== false).slice(0, 6);

  if (isLoading || settingsLoading) {
    return (
      <section className="py-16 bg-muted/30" data-testid="section-verified-builders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <Skeleton key={i} className="h-32 w-full rounded-lg" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const renderAdminPrompt = (title: string | null, description: string | null) => {
    if (!title && !description) return null;
    return (
      <section className="py-16 bg-muted/30" data-testid="section-verified-builders">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card className="p-8 text-center max-w-md mx-auto">
            <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            {title && <h3 className="font-semibold text-lg mb-2">{title}</h3>}
            {description && <p className="text-muted-foreground text-sm">{description}</p>}
          </Card>
        </div>
      </section>
    );
  };

  if (!activeBuilders.length) {
    const promptTitle = emptyTitle || adminPromptTitle;
    const promptDescription = emptyDescription || adminPromptDescription;
    return renderAdminPrompt(promptTitle, promptDescription);
  }

  const isValidUrlPattern = builderUrlPattern && 
    (builderUrlPattern.includes("{slug}") || builderUrlPattern.includes("{id}"));

  if (!isValidUrlPattern) {
    const promptTitle = urlMissingTitle || adminPromptTitle;
    const promptDescription = urlMissingDescription || adminPromptDescription;
    return renderAdminPrompt(promptTitle, promptDescription);
  }

  return (
    <section className="py-16 bg-muted/30" data-testid="section-verified-builders">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(badgeText || sectionTitle || sectionSubtitle) && (
          <div className="text-center mb-12">
            {badgeText && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
                <BadgeCheck className="h-5 w-5" />
                <span className="text-sm font-medium">{badgeText}</span>
              </div>
            )}
            {sectionTitle && (
              <h2 className="font-serif font-bold text-3xl sm:text-4xl mb-4">
                {sectionTitle}
              </h2>
            )}
            {sectionSubtitle && (
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                {sectionSubtitle}
              </p>
            )}
          </div>
        )}

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6" data-testid="grid-verified-builders">
          {activeBuilders.map((builder) => {
            const builderUrl = builderUrlPattern
              .replace("{slug}", builder.slug || builder.id)
              .replace("{id}", builder.id);
              
            return (
              <Link 
                key={builder.id} 
                href={builderUrl}
                data-testid={`link-builder-${builder.id}`}
              >
                <Card 
                  className="p-6 h-full hover-elevate active-elevate-2 cursor-pointer transition-all group text-center"
                  data-testid={`card-builder-${builder.id}`}
                >
                  <div className="flex flex-col items-center justify-center h-full gap-3">
                    {builder.logoUrl ? (
                      <img 
                        src={builder.logoUrl} 
                        alt={builder.companyName}
                        className="h-16 w-16 object-contain"
                        data-testid={`img-builder-logo-${builder.id}`}
                      />
                    ) : (
                      <div 
                        className="h-16 w-16 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors"
                        data-testid={`placeholder-builder-logo-${builder.id}`}
                      >
                        <Building2 className="h-8 w-8" />
                      </div>
                    )}
                    
                    <div>
                      <p 
                        className="font-semibold text-sm line-clamp-2"
                        data-testid={`text-builder-name-${builder.id}`}
                      >
                        {builder.companyName}
                      </p>
                      {propertiesSuffix && (
                        <p 
                          className="text-xs text-muted-foreground mt-1"
                          data-testid={`text-builder-count-${builder.id}`}
                        >
                          {builder.propertyCount} {propertiesSuffix}
                        </p>
                      )}
                    </div>

                    {verifiedBadge && (
                      <div className="flex items-center gap-1 text-primary" data-testid={`badge-verified-${builder.id}`}>
                        <BadgeCheck className="h-4 w-4" />
                        <span className="text-xs font-medium">{verifiedBadge}</span>
                      </div>
                    )}
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {viewAllText && viewAllUrl && (
          <div className="text-center mt-10">
            <Link href={viewAllUrl}>
              <Button variant="outline" size="lg" data-testid="button-view-all-builders">
                {viewAllText}
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
