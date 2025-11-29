import { useQuery } from "@tanstack/react-query";
import { Building2, Users, Home, CheckCircle, Loader2 } from "lucide-react";

interface PlatformStats {
  active_listings: string;
  registered_users: string;
  properties_sold: string;
  verified_sellers: string;
}

const iconMap: Record<string, React.ReactNode> = {
  active_listings: <Building2 className="h-8 w-8 text-primary" />,
  registered_users: <Users className="h-8 w-8 text-primary" />,
  properties_sold: <Home className="h-8 w-8 text-primary" />,
  verified_sellers: <CheckCircle className="h-8 w-8 text-primary" />,
};

const labelMap: Record<string, string> = {
  active_listings: "Active Listings",
  registered_users: "Registered Users",
  properties_sold: "Properties Sold",
  verified_sellers: "Verified Sellers",
};

export default function StatsSection() {
  const { data: stats, isLoading } = useQuery<PlatformStats>({
    queryKey: ["/api/platform-stats"],
  });

  const defaultStats: PlatformStats = {
    active_listings: "10,000+",
    registered_users: "50,000+",
    properties_sold: "5,000+",
    verified_sellers: "1,000+",
  };

  const displayStats = stats || defaultStats;

  const statItems = [
    { key: "active_listings", value: displayStats.active_listings },
    { key: "registered_users", value: displayStats.registered_users },
    { key: "properties_sold", value: displayStats.properties_sold },
    { key: "verified_sellers", value: displayStats.verified_sellers },
  ];

  if (isLoading) {
    return (
      <section className="py-16 bg-muted/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {statItems.map((stat, index) => (
            <div
              key={stat.key}
              className="text-center space-y-3"
              data-testid={`stat-${stat.key}`}
            >
              <div className="flex justify-center">{iconMap[stat.key]}</div>
              <div>
                <p className="text-3xl font-bold font-serif text-foreground" data-testid={`stat-value-${stat.key}`}>
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{labelMap[stat.key]}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
