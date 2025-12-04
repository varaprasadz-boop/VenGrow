import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Users, Target, Award, TrendingUp, Settings, Building } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import * as Icons from "lucide-react";

interface PlatformStats {
  active_listings: string;
  registered_users: string;
  properties_sold: string;
  verified_sellers: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  imageUrl: string;
  bio?: string;
  linkedinUrl?: string;
  sortOrder: number;
  isActive: boolean;
}

interface CompanyValue {
  id: string;
  title: string;
  description: string;
  icon: string;
  sortOrder: number;
  isActive: boolean;
}

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
}

interface SiteSetting {
  key: string;
  value: string | null;
}

const getIcon = (iconName: string) => {
  const IconComponent = (Icons as any)[iconName] || Building;
  return IconComponent;
};

export default function AboutPage() {
  const { data: statsData, isLoading: statsLoading } = useQuery<PlatformStats>({
    queryKey: ["/api/platform-stats"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: teamMembers = [], isLoading: teamLoading } = useQuery<TeamMember[]>({
    queryKey: ["/api/team-members"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: companyValues = [], isLoading: valuesLoading } = useQuery<CompanyValue[]>({
    queryKey: ["/api/company-values"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: pageContent, isLoading: pageLoading } = useQuery<StaticPage>({
    queryKey: ["/api/static-pages", "about"],
    staleTime: 5 * 60 * 1000,
  });

  const { data: siteSettings = [] } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const getSettingValue = (key: string): string | null => {
    const setting = siteSettings.find(s => s.key === key);
    return setting?.value || null;
  };

  const displayValues = companyValues.filter(v => v.isActive).sort((a, b) => a.sortOrder - b.sortOrder);
  const displayTeam = teamMembers.filter(m => m.isActive).sort((a, b) => a.sortOrder - b.sortOrder);

  const stats = statsData ? [
    { value: statsData.active_listings, label: getSettingValue("stats_listings_label") },
    { value: statsData.registered_users, label: getSettingValue("stats_users_label") },
    { value: statsData.properties_sold, label: getSettingValue("stats_sold_label") },
    { value: statsData.verified_sellers, label: getSettingValue("stats_sellers_label") },
  ].filter(s => s.label) : [];

  const hasPageContent = pageContent?.title || pageContent?.content;
  const hasValues = displayValues.length > 0;
  const hasTeam = displayTeam.length > 0;
  const hasStats = stats.length > 0;

  const valuesTitle = getSettingValue("about_values_title");
  const valuesSubtitle = getSettingValue("about_values_subtitle");
  const teamTitle = getSettingValue("about_team_title");
  const teamSubtitle = getSettingValue("about_team_subtitle");
  const ctaTitle = getSettingValue("about_cta_title");
  const ctaSubtitle = getSettingValue("about_cta_subtitle");

  if (pageLoading || valuesLoading || teamLoading) {
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
        </main>
        <Footer />
      </div>
    );
  }

  if (!hasPageContent && !hasValues && !hasTeam && !hasStats) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">About</Badge>
              <Card className="p-8 text-center max-w-md mx-auto mt-8">
                <Settings className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">Page Not Configured</h2>
                <p className="text-muted-foreground text-sm">
                  Configure About page content, team members, and company values in the Admin Panel.
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
        {hasPageContent && (
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background" data-testid="section-about-hero">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">About</Badge>
              {pageContent?.title && (
                <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6" data-testid="text-about-title">
                  {pageContent.title}
                </h1>
              )}
              {pageContent?.content && (
                <p className="text-lg text-muted-foreground" data-testid="text-about-description">
                  {pageContent.content}
                </p>
              )}
            </div>
          </section>
        )}

        {hasStats && (
          <section className="py-16" data-testid="section-about-stats">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6" data-testid="grid-about-stats">
                {stats.map((stat, index) => (
                  <Card key={index} className="p-6 text-center" data-testid={`card-about-stat-${index}`}>
                    <p className="text-3xl font-bold font-serif text-primary mb-2">
                      {stat.value}
                    </p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {hasValues && (
          <section className="py-16 bg-muted/30" data-testid="section-about-values">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {(valuesTitle || valuesSubtitle) && (
                <div className="text-center mb-12">
                  {valuesTitle && <h2 className="font-serif font-bold text-3xl mb-4">{valuesTitle}</h2>}
                  {valuesSubtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{valuesSubtitle}</p>}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="grid-about-values">
                {displayValues.map((value) => {
                  const IconComponent = getIcon(value.icon);
                  return (
                    <Card key={value.id} className="p-6 text-center" data-testid={`card-value-${value.id}`}>
                      <div className="inline-flex p-4 rounded-lg bg-primary/10 mb-4">
                        <IconComponent className="h-8 w-8 text-primary" />
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{value.title}</h3>
                      <p className="text-sm text-muted-foreground">
                        {value.description}
                      </p>
                    </Card>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {hasTeam && (
          <section className="py-16" data-testid="section-about-team">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              {(teamTitle || teamSubtitle) && (
                <div className="text-center mb-12">
                  {teamTitle && <h2 className="font-serif font-bold text-3xl mb-4">{teamTitle}</h2>}
                  {teamSubtitle && <p className="text-muted-foreground max-w-2xl mx-auto">{teamSubtitle}</p>}
                </div>
              )}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8" data-testid="grid-about-team">
                {displayTeam.map((member) => (
                  <Card key={member.id} className="p-6 text-center" data-testid={`card-team-${member.id}`}>
                    <Avatar className="h-24 w-24 mx-auto mb-4">
                      {member.imageUrl && <AvatarImage src={member.imageUrl} alt={member.name} />}
                      <AvatarFallback className="text-2xl bg-primary/10 text-primary">
                        {member.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <h3 className="font-semibold text-lg mb-1" data-testid={`text-team-name-${member.id}`}>
                      {member.name}
                    </h3>
                    <p className="text-sm text-muted-foreground">{member.role}</p>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        )}

        {(ctaTitle || ctaSubtitle) && (
          <section className="py-16 bg-primary text-primary-foreground" data-testid="section-about-cta">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              {ctaTitle && <h2 className="font-serif font-bold text-3xl mb-4">{ctaTitle}</h2>}
              {ctaSubtitle && <p className="text-lg mb-8 opacity-90">{ctaSubtitle}</p>}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/register">
                  <Button size="lg" variant="secondary" className="font-semibold" data-testid="button-get-started">
                    Get Started
                  </Button>
                </Link>
                <Link href="/contact">
                  <Button size="lg" variant="outline" className="font-semibold border-primary-foreground text-primary-foreground hover:bg-primary-foreground/10" data-testid="button-contact-us">
                    Contact Us
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}
