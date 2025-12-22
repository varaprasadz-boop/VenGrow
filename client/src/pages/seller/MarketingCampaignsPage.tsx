
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Megaphone, Eye, Users, TrendingUp } from "lucide-react";

export default function MarketingCampaignsPage() {
  const campaigns = [
    {
      id: "1",
      name: "Weekend Open House Promotion",
      property: "Luxury 3BHK Apartment",
      status: "active",
      reach: 12345,
      clicks: 456,
      leads: 23,
      budget: "₹5,000",
      spent: "₹3,200",
    },
    {
      id: "2",
      name: "Premium Property Showcase",
      property: "Commercial Office Space",
      status: "scheduled",
      startDate: "Nov 28, 2025",
      budget: "₹10,000",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Active
          </Badge>
        );
      case "scheduled":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            Scheduled
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
                <Megaphone className="h-8 w-8 text-primary" />
                Marketing Campaigns
              </h1>
              <p className="text-muted-foreground">
                Promote your properties and track performance
              </p>
            </div>
            <Button data-testid="button-create">
              Create Campaign
            </Button>
          </div>

          <div className="space-y-6">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {campaign.property}
                    </p>
                  </div>
                </div>

                {campaign.status === "active" && (
                  <>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Reach</p>
                        </div>
                        <p className="text-2xl font-bold">
                          {campaign.reach.toLocaleString()}
                        </p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Clicks</p>
                        </div>
                        <p className="text-2xl font-bold">{campaign.clicks}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <div className="flex items-center gap-2 mb-2">
                          <Users className="h-4 w-4 text-muted-foreground" />
                          <p className="text-xs text-muted-foreground">Leads</p>
                        </div>
                        <p className="text-2xl font-bold">{campaign.leads}</p>
                      </div>
                      <div className="p-4 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-2">Budget</p>
                        <p className="text-lg font-bold">{campaign.budget}</p>
                        <p className="text-xs text-muted-foreground">
                          Spent: {campaign.spent}
                        </p>
                      </div>
                    </div>
                  </>
                )}

                {campaign.status === "scheduled" && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg mb-6">
                    <p className="text-sm text-blue-900 dark:text-blue-400">
                      Campaign starts on {campaign.startDate} • Budget: {campaign.budget}
                    </p>
                  </div>
                )}

                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-edit-${campaign.id}`}
                  >
                    Edit
                  </Button>
                  {campaign.status === "active" && (
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-pause-${campaign.id}`}
                    >
                      Pause
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
