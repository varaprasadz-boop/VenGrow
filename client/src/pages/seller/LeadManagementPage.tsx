import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { Breadcrumbs } from "@/components/ui/breadcrumbs";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Users, TrendingUp, Phone, Mail, MessageSquare, Calendar, StickyNote, CheckCircle2, Edit2 } from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry, Property, User } from "@shared/schema";

interface LeadWithDetails extends Inquiry {
  property?: Property;
  user?: User;
}

type LeadStatus = "hot" | "warm" | "cold";

function getLeadStatus(inquiry: LeadWithDetails): LeadStatus {
  if (inquiry.leadTemperature) {
    return inquiry.leadTemperature as LeadStatus;
  }
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
  return baseScore + (inquiry.conversionStatus === "converted" ? 20 : inquiry.conversionStatus === "viewing_scheduled" ? 10 : 0);
}

export default function LeadManagementPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedTab, setSelectedTab] = useState("all");
  const [editingLead, setEditingLead] = useState<LeadWithDetails | null>(null);
  const [editForm, setEditForm] = useState({
    sellerNotes: "",
    followUpDate: "",
    leadTemperature: "",
    conversionStatus: "",
  });

  const { data: inquiries = [], isLoading } = useQuery<LeadWithDetails[]>({
    queryKey: ["/api/me/seller-inquiries"],
    enabled: !!user,
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Record<string, unknown> }) => {
      const response = await apiRequest("PATCH", `/api/inquiries/${data.id}/crm`, data.updates);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-inquiries"] });
      toast({ title: "Lead Updated", description: "Lead information has been saved." });
      setEditingLead(null);
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update lead.", variant: "destructive" });
    },
  });

  const openEditDialog = (lead: LeadWithDetails) => {
    setEditingLead(lead);
    setEditForm({
      sellerNotes: lead.sellerNotes || "",
      followUpDate: lead.followUpDate ? format(new Date(lead.followUpDate), "yyyy-MM-dd") : "",
      leadTemperature: lead.leadTemperature || getLeadStatus(lead),
      conversionStatus: lead.conversionStatus || "new",
    });
  };

  const handleSaveEdit = () => {
    if (!editingLead) return;
    updateLeadMutation.mutate({
      id: editingLead.id,
      updates: {
        sellerNotes: editForm.sellerNotes || null,
        followUpDate: editForm.followUpDate || null,
        leadTemperature: editForm.leadTemperature || null,
        conversionStatus: editForm.conversionStatus || null,
      },
    });
  };

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

  const getConversionBadge = (status: string | null) => {
    switch (status) {
      case "converted":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">Converted</Badge>;
      case "viewing_scheduled":
        return <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500">Viewing Scheduled</Badge>;
      case "contacted":
        return <Badge variant="outline">Contacted</Badge>;
      case "lost":
        return <Badge variant="secondary">Lost</Badge>;
      default:
        return null;
    }
  };

  const filterLeads = () => {
    if (selectedTab === "all") return leads;
    return leads.filter((l) => l.leadStatus === selectedTab);
  };

  const hotLeads = leads.filter(l => l.leadStatus === "hot").length;
  const warmLeads = leads.filter(l => l.leadStatus === "warm").length;
  const coldLeads = leads.filter(l => l.leadStatus === "cold").length;
  const convertedLeads = leads.filter(l => l.conversionStatus === "converted").length;
  const conversionRate = leads.length > 0 ? Math.round((convertedLeads / leads.length) * 100) : 0;

  if (isLoading) {
    return (
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
    );
  }

  const breadcrumbItems = [
    { label: "Dashboard", href: "/seller/dashboard" },
    { label: "Lead Management" },
  ];

  return (
    <>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Breadcrumbs items={breadcrumbItems} className="mb-6" />
          
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Lead Management
            </h1>
            <p className="text-muted-foreground">
              Track and manage your property leads with CRM tools
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
                  <CheckCircle2 className="h-6 w-6 text-green-600" />
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
                            {getConversionBadge(lead.conversionStatus)}
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
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => openEditDialog(lead)}
                          data-testid={`button-edit-lead-${lead.id}`}
                        >
                          <Edit2 className="h-4 w-4 mr-2" />
                          Manage Lead
                        </Button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-4">
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
                          <p className="font-medium text-sm capitalize">{lead.sourceType || "Website"}</p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1">
                            Last Contact
                          </p>
                          <p className="font-medium text-sm">
                            {formatDistanceToNow(new Date(lead.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <div className="p-3 bg-muted rounded-lg">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Follow-up
                          </p>
                          <p className="font-medium text-sm">
                            {lead.followUpDate 
                              ? format(new Date(lead.followUpDate), "MMM d, yyyy")
                              : "Not set"}
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

                      {lead.sellerNotes && (
                        <div className="p-3 bg-yellow-50 dark:bg-yellow-900/10 rounded-lg mb-4 border-l-4 border-yellow-400">
                          <p className="text-xs text-muted-foreground mb-1 flex items-center gap-1">
                            <StickyNote className="h-3 w-3" />
                            Your Notes
                          </p>
                          <p className="text-sm">{lead.sellerNotes}</p>
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
                      </div>
                    </Card>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </main>

      <Dialog open={!!editingLead} onOpenChange={() => setEditingLead(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Manage Lead</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Lead Temperature</Label>
              <Select
                value={editForm.leadTemperature}
                onValueChange={(value) => setEditForm({ ...editForm, leadTemperature: value })}
              >
                <SelectTrigger data-testid="select-lead-temperature">
                  <SelectValue placeholder="Select temperature" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="hot">Hot - High Priority</SelectItem>
                  <SelectItem value="warm">Warm - Medium Priority</SelectItem>
                  <SelectItem value="cold">Cold - Low Priority</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Conversion Status</Label>
              <Select
                value={editForm.conversionStatus}
                onValueChange={(value) => setEditForm({ ...editForm, conversionStatus: value })}
              >
                <SelectTrigger data-testid="select-conversion-status">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="new">New Lead</SelectItem>
                  <SelectItem value="contacted">Contacted</SelectItem>
                  <SelectItem value="viewing_scheduled">Viewing Scheduled</SelectItem>
                  <SelectItem value="converted">Converted</SelectItem>
                  <SelectItem value="lost">Lost</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Follow-up Date</Label>
              <Input
                type="date"
                value={editForm.followUpDate}
                onChange={(e) => setEditForm({ ...editForm, followUpDate: e.target.value })}
                data-testid="input-follow-up-date"
              />
            </div>

            <div className="space-y-2">
              <Label>Notes</Label>
              <Textarea
                placeholder="Add notes about this lead..."
                value={editForm.sellerNotes}
                onChange={(e) => setEditForm({ ...editForm, sellerNotes: e.target.value })}
                rows={4}
                data-testid="textarea-seller-notes"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setEditingLead(null)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSaveEdit} 
              disabled={updateLeadMutation.isPending}
              data-testid="button-save-lead"
            >
              {updateLeadMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
