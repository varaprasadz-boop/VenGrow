import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, Users, Target } from "lucide-react";

export default function LeadScorePage() {
  const leads = [
    {
      id: "1",
      name: "Rahul Sharma",
      property: "Luxury 3BHK Apartment",
      score: 92,
      status: "hot",
      interactions: 15,
      lastContact: "2 hours ago",
      tags: ["High Budget", "Ready to Buy", "Multiple Visits"],
    },
    {
      id: "2",
      name: "Priya Patel",
      property: "Commercial Office Space",
      score: 68,
      status: "warm",
      interactions: 8,
      lastContact: "1 day ago",
      tags: ["Researching", "Budget Conscious"],
    },
    {
      id: "3",
      name: "Amit Kumar",
      property: "2BHK Flat",
      score: 35,
      status: "cold",
      interactions: 3,
      lastContact: "1 week ago",
      tags: ["Just Browsing"],
    },
  ];

  const getScoreBadge = (score: number) => {
    if (score >= 80)
      return (
        <Badge variant="destructive" className="text-base px-3 py-1">
          {score}
        </Badge>
      );
    if (score >= 60)
      return (
        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500 text-base px-3 py-1">
          {score}
        </Badge>
      );
    return (
      <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500 text-base px-3 py-1">
        {score}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Lead Scoring
            </h1>
            <p className="text-muted-foreground">
              Prioritize your leads based on their conversion potential
            </p>
          </div>

          {/* Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <TrendingUp className="h-6 w-6 text-red-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {leads.filter((l) => l.status === "hot").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Hot Leads</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Target className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {leads.filter((l) => l.status === "warm").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Warm Leads</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">
                    {leads.filter((l) => l.status === "cold").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Cold Leads</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Leads List */}
          <div className="space-y-4">
            {leads.map((lead) => (
              <Card key={lead.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start gap-4">
                    <div className="flex flex-col items-center gap-2">
                      {getScoreBadge(lead.score)}
                      <span className="text-xs text-muted-foreground">Score</span>
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg mb-1">{lead.name}</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Interested in: {lead.property}
                      </p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>{lead.interactions} interactions</span>
                        <span>•</span>
                        <span>Last contact: {lead.lastContact}</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {lead.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Score Breakdown */}
                <div className="p-4 bg-muted rounded-lg mb-4">
                  <p className="text-sm font-medium mb-3">Score Breakdown</p>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Engagement
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "85%" }} />
                        </div>
                        <span className="text-xs font-medium">85%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Budget</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "90%" }} />
                        </div>
                        <span className="text-xs font-medium">90%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Timeline</p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "95%" }} />
                        </div>
                        <span className="text-xs font-medium">95%</span>
                      </div>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">
                        Responsiveness
                      </p>
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-background rounded-full overflow-hidden">
                          <div className="h-full bg-primary" style={{ width: "80%" }} />
                        </div>
                        <span className="text-xs font-medium">80%</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Button size="sm" data-testid={`button-contact-${lead.id}`}>
                  Contact Lead
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
