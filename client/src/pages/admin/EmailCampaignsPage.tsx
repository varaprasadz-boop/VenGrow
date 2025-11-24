import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Mail, Send, Users } from "lucide-react";

export default function EmailCampaignsPage() {
  const campaigns = [
    {
      id: "1",
      name: "New Listings Weekly Newsletter",
      subject: "Top Properties This Week",
      recipients: 15234,
      sent: 15234,
      opened: 12456,
      clicked: 3452,
      status: "sent",
      date: "Nov 20, 2025",
    },
    {
      id: "2",
      name: "Price Drop Alerts",
      subject: "Properties with Price Reductions",
      recipients: 8765,
      sent: 8765,
      opened: 7123,
      clicked: 2134,
      status: "sent",
      date: "Nov 18, 2025",
    },
    {
      id: "3",
      name: "Black Friday Special Offers",
      subject: "Exclusive Deals on Premium Listings",
      recipients: 25000,
      sent: 0,
      opened: 0,
      clicked: 0,
      status: "scheduled",
      date: "Nov 29, 2025",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "sent":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Sent
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
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Email Campaigns
              </h1>
              <p className="text-muted-foreground">
                Manage email marketing campaigns
              </p>
            </div>
            <Button data-testid="button-create">
              <Mail className="h-4 w-4 mr-2" />
              Create Campaign
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Send className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">24K</p>
                  <p className="text-sm text-muted-foreground">Emails Sent</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <Mail className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">19.6K</p>
                  <p className="text-sm text-muted-foreground">Opened</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                  <Users className="h-6 w-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">5.6K</p>
                  <p className="text-sm text-muted-foreground">Clicked</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
                  <TrendingUp className="h-6 w-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">23.3%</p>
                  <p className="text-sm text-muted-foreground">Click Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Campaigns List */}
          <div className="space-y-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{campaign.name}</h3>
                      {getStatusBadge(campaign.status)}
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">
                      Subject: {campaign.subject}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {campaign.status === "sent" ? "Sent on" : "Scheduled for"}{" "}
                      {campaign.date}
                    </p>
                  </div>
                </div>

                {campaign.status === "sent" && (
                  <div className="grid grid-cols-4 gap-4 mt-4">
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">
                        Recipients
                      </p>
                      <p className="font-semibold">
                        {campaign.recipients.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Sent</p>
                      <p className="font-semibold">
                        {campaign.sent.toLocaleString()}
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Opened</p>
                      <p className="font-semibold">
                        {campaign.opened.toLocaleString()}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({((campaign.opened / campaign.sent) * 100).toFixed(1)}%)
                        </span>
                      </p>
                    </div>
                    <div className="p-3 bg-muted rounded-lg">
                      <p className="text-xs text-muted-foreground mb-1">Clicked</p>
                      <p className="font-semibold">
                        {campaign.clicked.toLocaleString()}{" "}
                        <span className="text-xs text-muted-foreground">
                          ({((campaign.clicked / campaign.opened) * 100).toFixed(1)}
                          %)
                        </span>
                      </p>
                    </div>
                  </div>
                )}

                {campaign.status === "scheduled" && (
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg mt-4">
                    <p className="text-sm">
                      Will be sent to {campaign.recipients.toLocaleString()}{" "}
                      recipients
                    </p>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
