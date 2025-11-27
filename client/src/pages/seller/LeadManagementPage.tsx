import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, TrendingUp, Phone, Mail, MessageSquare } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Inquiry, Property, User } from "@shared/schema";

interface LeadWithDetails extends Inquiry {
  property?: Property;
  user?: User;
}

type LeadStatus = "hot" | "warm" | "cold";

function getLeadStatus(inquiry: LeadWithDetails): LeadStatus {
  const createdAt = new Date(inquiry.createdAt);
  const now = new Date();
  const daysSinceInquiry = Math.floor((now.getTime() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
  
  if (daysSinceInquiry <= 2) return "hot";
  if (daysSinceInquiry <= 7) return "warm";
  return "cold";
}

function getLeadScore(inquiry: LeadWithDetails): number {
  const status = getLeadStatus(inquiry);
  const baseScore = status === "hot" ? 80 : status === "warm" ? 55 : 30;
  return baseScore + Math.floor(Math.random() * 15);
}

export default function LeadManagementPage() {
  const { user } = useAuth();
  const [selectedTab, setSelectedTab] = useState("all");

  const { data: inquiries = [], isLoading } = useQuery<LeadWithDetails[]>({
    queryKey: ["/api/me/seller-inquiries"],
    enabled: !!user,
  });

  const leads = inquiries.map(inquiry => ({
    ...inquiry,
    leadStatus: getLeadStatus(inquiry),
    score: getLeadScore(inquiry),
  }));

  const getStatusBadge = (status: LeadStatus) => {
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
    }
  };

  const filterLeads = () => {
    if (selectedTab === "all") return leads;
    return leads.filter((l) => l.leadStatus === selectedTab);
  };

  const hotLeads = leads.filter(l => l.leadStatus === "hot").length;
  const warmLeads = leads.filter(l => l.leadStatus === "warm").length;
  const coldLeads = leads.filter(l => l.leadStatus === "cold").length;
  const conversionRate = leads.length > 0 ? Math.round((hotLeads / leads.length) * 100) : 0;

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="seller" />
        <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <Skeleton className="h-12 w-full mb-4" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-48 w-full" />
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

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

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Users className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold" data-testid="text-total-leads">{leads.length}</p>
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
                  <p className="text-3xl font-bold" data-testid="text-hot-leads">{hotLeads}</p>
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
                  <p className="text-3xl font-bold" data-testid="text-warm-leads">{warmLeads}</p>
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
                  <p className="text-3xl font-bold" data-testid="text-conversion-rate">{conversionRate}%</p>
                  <p className="text-sm text-muted-foreground">Conversion Rate</p>
                </div>
              </div>
            </Card>
          </div>

          {leads.length === 0 ? (
            <Card className="p-8 text-center">
              <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-semibold text-xl mb-2">No Leads Yet</h2>
              <p className="text-muted-foreground">
                When buyers inquire about your properties, they will appear here as leads.
              </p>
            </Card>
          ) : (
            <Tabs value={selectedTab} onValueChange={setSelectedTab}>
              <TabsList className="mb-6">
                <TabsTrigger value="all" data-testid="tab-all">
                  All ({leads.length})
                </TabsTrigger>
                <TabsTrigger value="hot" data-testid="tab-hot">
                  Hot ({hotLeads})
                </TabsTrigger>
                <TabsTrigger value="warm" data-testid="tab-warm">
                  Warm ({warmLeads})
                </TabsTrigger>
                <TabsTrigger value="cold" data-testid="tab-cold">
                  Cold ({coldLeads})
                </TabsTrigger>
              </TabsList>

              <TabsContent value={selectedTab} className="mt-0">
                <div className="space-y-4">
                  {filterLeads().map((lead) => (
                    <Card key={lead.id} className="p-6" data-testid={`card-lead-${lead.id}`}>
                      <div className="flex items-start justify-between mb-4 flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg" data-testid={`text-lead-name-${lead.id}`}>
                              {lead.user ? `${lead.user.firstName || ""} ${lead.user.lastName || ""}`.trim() || "Anonymous User" : "Anonymous User"}
                            </h3>
                            {getStatusBadge(lead.leadStatus)}
                            <div className="px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium">
                              Score: {lead.score}
                            </div>
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <Mail className="h-4 w-4" />
                              <span>{lead.user?.email || lead.buyerEmail || "No email"}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Phone className="h-4 w-4" />
                              <span>{lead.buyerPhone || "No phone"}</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            Interested In
                          </p>
                          <p className="font-medium text-sm">
                            {lead.property?.title || "Property Inquiry"}
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">Source</p>
                          <p className="font-medium text-sm">Website Inquiry</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            Last Contact
                          </p>
                          <p className="font-medium text-sm">
                            {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </div>

                      {lead.message && (
                        <div className="p-3 bg-muted/50 rounded-lg mb-4">
                          <p className="text-sm text-muted-foreground italic">
                            "{lead.message}"
                          </p>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
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
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
