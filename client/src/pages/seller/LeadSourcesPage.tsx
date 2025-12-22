
import { Card } from "@/components/ui/card";
import { TrendingUp, Search, Share2, Users } from "lucide-react";

export default function LeadSourcesPage() {
  const sources = [
    {
      name: "Organic Search",
      leads: 45,
      percentage: 40,
      trend: "+12%",
      icon: Search,
    },
    {
      name: "Direct Traffic",
      leads: 28,
      percentage: 25,
      trend: "+5%",
      icon: TrendingUp,
    },
    {
      name: "Social Media",
      leads: 22,
      percentage: 20,
      trend: "+18%",
      icon: Share2,
    },
    {
      name: "Referrals",
      leads: 17,
      percentage: 15,
      trend: "+8%",
      icon: Users,
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Lead Sources
            </h1>
            <p className="text-muted-foreground">
              Track where your inquiries are coming from
            </p>
          </div>

          {/* Chart */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Lead Distribution</h3>
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">Lead Sources Chart</span>
            </div>
          </Card>

          {/* Source Breakdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {sources.map((source, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-primary/10 flex-shrink-0">
                    <source.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg mb-2">{source.name}</h3>
                    <div className="flex items-baseline gap-3 mb-3">
                      <p className="text-3xl font-bold">{source.leads}</p>
                      <span className="text-sm text-green-600 font-medium">
                        {source.trend}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div
                        className="bg-primary h-2 rounded-full"
                        style={{ width: `${source.percentage}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-2">
                      {source.percentage}% of total leads
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
