import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, TrendingUp, Phone, Mail, MessageSquare } from "lucide-react";

export default function LeadManagementPage() {
  const [selectedTab, setSelectedTab] = useState("all");

  const leads = [
    {
      id: "1",
      name: "Rahul Sharma",
      email: "rahul@example.com",
      phone: "+91 98765 43210",
      property: "Luxury 3BHK Apartment",
      status: "hot",
      source: "Website",
      lastContact: "2 hours ago",
      score: 85,
    },
    {
      id: "2",
      name: "Priya Patel",
      email: "priya@example.com",
      phone: "+91 98765 43211",
      property: "Commercial Office Space",
      status: "warm",
      source: "Social Media",
      lastContact: "1 day ago",
      score: 65,
    },
    {
      id: "3",
      name: "Amit Kumar",
      email: "amit@example.com",
      phone: "+91 98765 43212",
      property: "2BHK Flat",
      status: "cold",
      source: "Referral",
      lastContact: "1 week ago",
      score: 35,
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "hot":
        return <Badge variant="destructive">Hot Lead</Badge>;
      case "warm":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Warm Lead
          </Badge>
        );
      case "cold":
        return (
          <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
            Cold Lead
          </Badge>
        );
      default:
        return null;
    }
  };

  const filterLeads = () => {
    if (selectedTab === "all") return leads;
    return leads.filter((l) => l.status === selectedTab);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Lead Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your property leads
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{leads.length}</p>
                  <p className="text-sm text-muted-foreground">Total Leads</p>
                </div>
              </div>
            </Card>

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
                  <TrendingUp className="h-6 w-6 text-yellow-600" />
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
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">28%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Leads List */}
          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({leads.length})
              </TabsTrigger>
              <TabsTrigger value="hot" data-testid="tab-hot">
                Hot ({leads.filter((l) => l.status === "hot").length})
              </TabsTrigger>
              <TabsTrigger value="warm" data-testid="tab-warm">
                Warm ({leads.filter((l) => l.status === "warm").length})
              </TabsTrigger>
              <TabsTrigger value="cold" data-testid="tab-cold">
                Cold ({leads.filter((l) => l.status === "cold").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              <div className="space-y-4">
                {filterLeads().map((lead) => (
                  <Card key={lead.id} className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{lead.name}</h3>
                          {getStatusBadge(lead.status)}
                          <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                            Score: {lead.score}
                          </div>
                        </div>
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{lead.email}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{lead.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Interested In
                        </p>
                        <p className="font-medium text-sm">{lead.property}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">Source</p>
                        <p className="font-medium text-sm">{lead.source}</p>
                      </div>
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Last Contact
                        </p>
                        <p className="font-medium text-sm">{lead.lastContact}</p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-call-${lead.id}`}
                      >
                        <Phone className="h-4 w-4 mr-2" />
                        Call
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-email-${lead.id}`}
                      >
                        <Mail className="h-4 w-4 mr-2" />
                        Email
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-message-${lead.id}`}
                      >
                        <MessageSquare className="h-4 w-4 mr-2" />
                        Message
                      </Button>
                      <Button
                        size="sm"
                        className="ml-auto"
                        data-testid={`button-view-${lead.id}`}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
