import { Building2, Users, Home, CheckCircle } from "lucide-react";

interface Stat {
  icon: React.ReactNode;
  value: string;
  label: string;
}

export default function StatsSection() {
  const stats: Stat[] = [
    {
      icon: <Building2 className="h-8 w-8 text-primary" />,
      value: "10,000+",
      label: "Active Listings",
    },
    {
      icon: <Users className="h-8 w-8 text-primary" />,
      value: "50,000+",
      label: "Registered Users",
    },
    {
      icon: <Home className="h-8 w-8 text-primary" />,
      value: "5,000+",
      label: "Properties Sold",
    },
    {
      icon: <CheckCircle className="h-8 w-8 text-primary" />,
      value: "1,000+",
      label: "Verified Sellers",
    },
  ];

  return (
    <section className="py-16 bg-muted/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <div
              key={index}
              className="text-center space-y-3"
              data-testid={`stat-${index}`}
            >
              <div className="flex justify-center">{stat.icon}</div>
              <div>
                <p className="text-3xl font-bold font-serif text-foreground">
                  {stat.value}
                </p>
                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
