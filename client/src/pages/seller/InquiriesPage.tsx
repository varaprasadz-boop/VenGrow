import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useLocation } from "wouter";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Search,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  MoreVertical,
  CheckCircle,
  X,
  Edit2,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Inquiry, Property, User } from "@shared/schema";

interface InquiryWithDetails extends Inquiry {
  property?: Property;
  buyer?: User;
}

export default function InquiriesPage() {
  const [, setLocation] = useLocation();
  const [selectedTab, setSelectedTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [editingInquiry, setEditingInquiry] = useState<InquiryWithDetails | null>(null);
  const [scheduleInquiry, setScheduleInquiry] = useState<InquiryWithDetails | null>(null);
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "", notes: "" });
  const [editForm, setEditForm] = useState({
    sellerNotes: "",
    followUpDate: "",
    leadTemperature: "",
    conversionStatus: "",
  });
  const { toast } = useToast();

  const { data: inquiries = [], isLoading } = useQuery<InquiryWithDetails[]>({
    queryKey: ["/api/me/seller-inquiries"],
    queryFn: async () => {
      const response = await fetch("/api/me/seller-inquiries", { credentials: "include" });
      if (!response.ok) throw new Error("Failed to fetch inquiries");
      return response.json();
    },
  });

  const updateInquiryMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Inquiry> }) => {
      return apiRequest("PATCH", `/api/inquiries/${id}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-inquiries"] });
      toast({ title: "Inquiry updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update inquiry", variant: "destructive" });
    },
  });

  const updateLeadMutation = useMutation({
    mutationFn: async (data: { id: string; updates: Record<string, unknown> }) => {
      const response = await apiRequest("PATCH", `/api/inquiries/${data.id}/crm`, data.updates);
      return response.json();
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-appointments"] });
      toast({ title: "Lead updated", description: "If you set Viewing Scheduled, it will appear in Property Visits." });
      setEditingInquiry(null);
    },
    onError: () => {
      toast({ title: "Failed to update lead", variant: "destructive" });
    },
  });

  const scheduleVisitMutation = useMutation({
    mutationFn: async (data: { inquiryId: string; scheduledDate: string; scheduledTime: string; notes?: string }) => {
      return apiRequest("POST", "/api/seller/appointments-from-lead", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-inquiries"] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-appointments"] });
      toast({ title: "Visit scheduled", description: "It will appear in Scheduled Visits." });
      setScheduleInquiry(null);
      setScheduleForm({ date: "", time: "", notes: "" });
    },
    onError: (err: unknown) => {
      const msg = (err as { response?: { data?: { error?: string } }; message?: string })?.response?.data?.error ?? (err as Error)?.message ?? "Failed to schedule visit";
      toast({ title: "Error", description: msg, variant: "destructive" });
    },
  });

  const openManageLead = (inquiry: InquiryWithDetails) => {
    setEditingInquiry(inquiry);
    setEditForm({
      sellerNotes: inquiry.sellerNotes || "",
      followUpDate: inquiry.followUpDate ? format(new Date(inquiry.followUpDate), "yyyy-MM-dd") : "",
      leadTemperature: (inquiry.leadTemperature as string) || "warm",
      conversionStatus: inquiry.conversionStatus || "new",
    });
  };

  const handleSaveLead = () => {
    if (!editingInquiry) return;
    updateLeadMutation.mutate({
      id: editingInquiry.id,
      updates: {
        sellerNotes: editForm.sellerNotes || null,
        followUpDate: editForm.followUpDate || null,
        leadTemperature: editForm.leadTemperature || null,
        conversionStatus: editForm.conversionStatus || null,
      },
    });
  };

  const filterInquiries = () => {
    let filtered = inquiries;
    if (selectedTab !== "all") {
      filtered = filtered.filter((i) => i.status === selectedTab);
    }
    if (searchQuery) {
      filtered = filtered.filter(
        (i) =>
          (i.buyer?.firstName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (i.buyer?.lastName?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
          (i.property?.title?.toLowerCase() || "").includes(searchQuery.toLowerCase())
      );
    }
    return filtered;
  };

  const filteredInquiries = filterInquiries();

  const getStatusBadge = (status: string) => {
    const variants: Record<string, { className: string; label: string }> = {
      pending: {
        className: "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500",
        label: "Pending",
      },
      replied: {
        className: "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500",
        label: "Replied",
      },
      closed: {
        className: "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500",
        label: "Closed",
      },
    };
    return variants[status] || variants.pending;
  };

  const handleMarkReplied = (id: string) => {
    updateInquiryMutation.mutate({ id, data: { status: "replied" } });
  };

  const handleCloseInquiry = (id: string) => {
    updateInquiryMutation.mutate({ id, data: { status: "closed" } });
  };

  return (
    <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Buyer Inquiries
            </h1>
            <p className="text-muted-foreground">
              Manage inquiries from potential buyers
            </p>
          </div>

          <div className="mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Search by buyer name or property..."
                className="pl-10"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search"
              />
            </div>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="all" data-testid="tab-all">
                All ({inquiries.length})
              </TabsTrigger>
              <TabsTrigger value="pending" data-testid="tab-pending">
                Pending ({inquiries.filter((i) => i.status === "pending").length})
              </TabsTrigger>
              <TabsTrigger value="replied" data-testid="tab-replied">
                Replied ({inquiries.filter((i) => i.status === "replied").length})
              </TabsTrigger>
              <TabsTrigger value="closed" data-testid="tab-closed">
                Closed ({inquiries.filter((i) => i.status === "closed").length})
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  {[1, 2, 3].map((i) => (
                    <Card key={i} className="p-6">
                      <div className="flex gap-4">
                        <Skeleton className="h-12 w-12 rounded-full" />
                        <div className="flex-1 space-y-2">
                          <Skeleton className="h-5 w-48" />
                          <Skeleton className="h-4 w-64" />
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="space-y-4">
                  {filteredInquiries.map((inquiry) => {
                    const statusInfo = getStatusBadge(inquiry.status);
                    const buyerName = inquiry.buyer
                      ? `${inquiry.buyer.firstName || ""} ${inquiry.buyer.lastName || ""}`.trim() || "Anonymous"
                      : "Anonymous";

                    return (
                      <Card key={inquiry.id} className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                          <div className="flex-1 space-y-4">
                            <div className="flex items-start gap-4">
                              <Avatar>
                                <AvatarFallback>
                                  {buyerName.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex-1">
                                <div className="flex items-center flex-wrap gap-3 mb-2">
                                  <h3 className="font-semibold text-lg">
                                    {buyerName}
                                  </h3>
                                  <Badge className={statusInfo.className}>
                                    {statusInfo.label}
                                  </Badge>
                                  {inquiry.conversionStatus === "viewing_scheduled" && (
                                    <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500">
                                      Viewing Scheduled
                                    </Badge>
                                  )}
                                </div>
                                <p className="text-sm text-muted-foreground mb-2">
                                  {inquiry.property?.title || "Property"}
                                </p>
                                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <Calendar className="h-4 w-4" />
                                    {format(new Date(inquiry.createdAt), "MMM d, yyyy, h:mm a")}
                                  </span>
                                  {inquiry.buyer?.email && (
                                    <span className="flex items-center gap-1">
                                      <Mail className="h-4 w-4" />
                                      {inquiry.buyer.email}
                                    </span>
                                  )}
                                  {inquiry.buyerPhone && (
                                    <span className="flex items-center gap-1">
                                      <Phone className="h-4 w-4" />
                                      {inquiry.buyerPhone}
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            <div className="p-4 bg-muted/50 rounded-lg">
                              <p className="text-sm">{inquiry.message || "No message provided"}</p>
                            </div>
                          </div>

                          <div className="flex lg:flex-col gap-2">
                            {inquiry.buyerPhone && (
                              <Button
                                size="sm"
                                className="flex-1 lg:flex-none"
                                data-testid={`button-call-${inquiry.id}`}
                                onClick={() => window.open(`tel:${inquiry.buyerPhone}`, "_self")}
                              >
                                <Phone className="h-4 w-4 lg:mr-2" />
                                <span className="hidden lg:inline">Call</span>
                              </Button>
                            )}
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              onClick={() => {
                                if (inquiry.buyerId) {
                                  setLocation(`/seller/messages?buyerId=${inquiry.buyerId}`);
                                } else {
                                  toast({
                                    title: "Cannot start chat",
                                    description: "Buyer information not available",
                                    variant: "destructive",
                                  });
                                }
                              }}
                              data-testid={`button-chat-${inquiry.id}`}
                            >
                              <MessageSquare className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Chat</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              onClick={() => { setScheduleInquiry(inquiry); setScheduleForm({ date: "", time: "", notes: "" }); }}
                              data-testid={`button-schedule-${inquiry.id}`}
                            >
                              <Calendar className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Schedule visit</span>
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1 lg:flex-none"
                              onClick={() => openManageLead(inquiry)}
                              data-testid={`button-manage-lead-${inquiry.id}`}
                            >
                              <Edit2 className="h-4 w-4 lg:mr-2" />
                              <span className="hidden lg:inline">Manage Lead</span>
                            </Button>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="flex-1 lg:flex-none"
                                  data-testid={`button-more-${inquiry.id}`}
                                >
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem onClick={() => openManageLead(inquiry)}>
                                  <Edit2 className="h-4 w-4 mr-2" />
                                  Manage Lead
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => { setScheduleInquiry(inquiry); setScheduleForm({ date: "", time: "", notes: "" }); }}>
                                  <Calendar className="h-4 w-4 mr-2" />
                                  Schedule visit
                                </DropdownMenuItem>
                                {inquiry.status === "pending" && (
                                  <DropdownMenuItem onClick={() => handleMarkReplied(inquiry.id)}>
                                    <CheckCircle className="h-4 w-4 mr-2" />
                                    Mark as Replied
                                  </DropdownMenuItem>
                                )}
                                {inquiry.status !== "closed" && (
                                  <DropdownMenuItem onClick={() => handleCloseInquiry(inquiry.id)}>
                                    <X className="h-4 w-4 mr-2" />
                                    Close Inquiry
                                  </DropdownMenuItem>
                                )}
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>
                        </div>
                      </Card>
                    );
                  })}
                </div>
              )}

              {!isLoading && filteredInquiries.length === 0 && (
                <div className="text-center py-16">
                  <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="font-semibold text-xl mb-2">
                    No inquiries found
                  </h3>
                  <p className="text-muted-foreground">
                    {searchQuery
                      ? "Try a different search term"
                      : selectedTab === "all"
                      ? "You haven't received any inquiries yet"
                      : `No ${selectedTab} inquiries`}
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>

        {/* Manage Lead dialog */}
        <Dialog open={!!editingInquiry} onOpenChange={() => setEditingInquiry(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Manage Lead</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label>Conversion Status</Label>
                <Select
                  value={editForm.conversionStatus}
                  onValueChange={(value) => setEditForm({ ...editForm, conversionStatus: value })}
                >
                  <SelectTrigger>
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
                <p className="text-xs text-muted-foreground">
                  Setting to &quot;Viewing Scheduled&quot; will add this lead to Property Visits.
                </p>
              </div>
              <div className="space-y-2">
                <Label>Lead Temperature</Label>
                <Select
                  value={editForm.leadTemperature}
                  onValueChange={(value) => setEditForm({ ...editForm, leadTemperature: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select temperature" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hot">Hot</SelectItem>
                    <SelectItem value="warm">Warm</SelectItem>
                    <SelectItem value="cold">Cold</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Follow-up Date</Label>
                <Input
                  type="date"
                  value={editForm.followUpDate}
                  onChange={(e) => setEditForm({ ...editForm, followUpDate: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Notes</Label>
                <Textarea
                  placeholder="Notes about this lead..."
                  value={editForm.sellerNotes}
                  onChange={(e) => setEditForm({ ...editForm, sellerNotes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingInquiry(null)}>Cancel</Button>
              <Button onClick={handleSaveLead} disabled={updateLeadMutation.isPending}>
                {updateLeadMutation.isPending ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Schedule visit dialog */}
        <Dialog open={!!scheduleInquiry} onOpenChange={() => setScheduleInquiry(null)}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Schedule visit</DialogTitle>
            </DialogHeader>
            {scheduleInquiry && (
              <form
                className="space-y-4 py-4"
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!scheduleForm.date || !scheduleForm.time) {
                    toast({ title: "Date and time required", variant: "destructive" });
                    return;
                  }
                  scheduleVisitMutation.mutate({
                    inquiryId: scheduleInquiry.id,
                    scheduledDate: scheduleForm.date,
                    scheduledTime: scheduleForm.time,
                    notes: scheduleForm.notes || undefined,
                  });
                }}
              >
                <div className="space-y-2">
                  <Label>Date</Label>
                  <Input
                    type="date"
                    value={scheduleForm.date}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, date: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Time</Label>
                  <Input
                    type="time"
                    value={scheduleForm.time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, time: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label>Notes (optional)</Label>
                  <Textarea
                    placeholder="Notes for this visit..."
                    value={scheduleForm.notes}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, notes: e.target.value })}
                    rows={2}
                  />
                </div>
                <DialogFooter>
                  <Button type="button" variant="outline" onClick={() => setScheduleInquiry(null)}>Cancel</Button>
                  <Button type="submit" disabled={scheduleVisitMutation.isPending}>
                    {scheduleVisitMutation.isPending ? "Scheduling..." : "Schedule visit"}
                  </Button>
                </DialogFooter>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </main>
  );
}
