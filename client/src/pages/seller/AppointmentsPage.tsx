import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format, isAfter, isBefore, isToday, parseISO } from "date-fns";
import type { Appointment } from "@shared/schema";
import {
  Calendar,
  CalendarDays,
  Clock,
  User,
  Phone,
  Mail,
  MapPin,
  CheckCircle,
  XCircle,
  Clock3,
  Building2,
  Loader2,
  RefreshCw,
  MessageSquare,
} from "lucide-react";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200",
  confirmed: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200",
  completed: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200",
  cancelled: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200",
  rescheduled: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200",
  no_show: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200",
};

const statusLabels: Record<string, string> = {
  pending: "Pending",
  confirmed: "Confirmed",
  completed: "Completed",
  cancelled: "Cancelled",
  rescheduled: "Rescheduled",
  no_show: "No Show",
};

export default function AppointmentsPage() {
  const { toast } = useToast();
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [rescheduleDate, setRescheduleDate] = useState("");
  const [rescheduleTime, setRescheduleTime] = useState("");
  const [sellerNotes, setSellerNotes] = useState("");

  const { data: appointments = [], isLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/me/seller-appointments"],
  });

  const confirmMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/appointments/${id}/confirm`);
    },
    onSuccess: () => {
      toast({ title: "Appointment confirmed" });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-appointments"] });
      setShowDetailsModal(false);
    },
    onError: () => {
      toast({ title: "Failed to confirm appointment", variant: "destructive" });
    },
  });

  const cancelMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/appointments/${id}/cancel`, { reason: sellerNotes });
    },
    onSuccess: () => {
      toast({ title: "Appointment cancelled" });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-appointments"] });
      setShowDetailsModal(false);
    },
    onError: () => {
      toast({ title: "Failed to cancel appointment", variant: "destructive" });
    },
  });

  const completeMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("POST", `/api/appointments/${id}/complete`);
    },
    onSuccess: () => {
      toast({ title: "Appointment marked as completed" });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-appointments"] });
      setShowDetailsModal(false);
    },
    onError: () => {
      toast({ title: "Failed to complete appointment", variant: "destructive" });
    },
  });

  const rescheduleMutation = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("PATCH", `/api/appointments/${id}`, {
        scheduledDate: rescheduleDate,
        scheduledTime: rescheduleTime,
        sellerNotes,
      });
    },
    onSuccess: () => {
      toast({ title: "Appointment rescheduled" });
      queryClient.invalidateQueries({ queryKey: ["/api/me/seller-appointments"] });
      setShowRescheduleModal(false);
      setShowDetailsModal(false);
    },
    onError: () => {
      toast({ title: "Failed to reschedule appointment", variant: "destructive" });
    },
  });

  const filterAppointments = (status: string) => {
    if (status === "upcoming") {
      return appointments.filter(
        (a) =>
          (a.status === "pending" || a.status === "confirmed") &&
          isAfter(parseISO(String(a.scheduledDate)), new Date())
      );
    }
    if (status === "today") {
      return appointments.filter(
        (a) =>
          (a.status === "pending" || a.status === "confirmed") &&
          isToday(parseISO(String(a.scheduledDate)))
      );
    }
    if (status === "past") {
      return appointments.filter(
        (a) =>
          a.status === "completed" ||
          a.status === "cancelled" ||
          isBefore(parseISO(String(a.scheduledDate)), new Date())
      );
    }
    return appointments;
  };

  const openDetails = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setShowDetailsModal(true);
  };

  const openReschedule = () => {
    if (selectedAppointment) {
      setRescheduleDate(format(parseISO(String(selectedAppointment.scheduledDate)), "yyyy-MM-dd"));
      setRescheduleTime(selectedAppointment.scheduledTime);
      setShowRescheduleModal(true);
    }
  };

  const AppointmentCard = ({ appointment }: { appointment: Appointment }) => {
    const date = parseISO(String(appointment.scheduledDate));
    const isPast = isBefore(date, new Date()) && !isToday(date);

  return (
      <Card
        className={`p-4 hover-elevate cursor-pointer ${isPast ? "opacity-60" : ""}`}
        onClick={() => openDetails(appointment)}
        data-testid={`card-appointment-${appointment.id}`}
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex-1 space-y-2">
            <div className="flex items-center gap-2 flex-wrap">
              <Badge className={statusColors[appointment.status]}>
                {statusLabels[appointment.status]}
              </Badge>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {format(date, "EEE, MMM d, yyyy")}
              </span>
              <span className="text-sm text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {appointment.scheduledTime}
              </span>
      
            <div className="flex items-center gap-4 text-sm">
              <span className="flex items-center gap-1">
                <User className="h-4 w-4 text-muted-foreground" />
                {appointment.buyerName || "Unknown Buyer"}
              </span>
              {appointment.buyerPhone && (
                <span className="flex items-center gap-1">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  {appointment.buyerPhone}
                </span>
              )}
      
            {appointment.notes && (
              <p className="text-sm text-muted-foreground line-clamp-1">
                <MessageSquare className="h-3 w-3 inline mr-1" />
                {appointment.notes}
              </p>
            )}
    
          <div className="flex gap-2">
            {appointment.status === "pending" && (
              <>
                <Button
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    confirmMutation.mutate(appointment.id);
                  }}
                  disabled={confirmMutation.isPending}
                  data-testid={`button-confirm-${appointment.id}`}
                >
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Confirm
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedAppointment(appointment);
                    openReschedule();
                  }}
                  data-testid={`button-reschedule-${appointment.id}`}
                >
                  <RefreshCw className="h-4 w-4 mr-1" />
                  Reschedule
                </Button>
              </>
            )}
            {appointment.status === "confirmed" && (
              <Button
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  completeMutation.mutate(appointment.id);
                }}
                disabled={completeMutation.isPending}
                data-testid={`button-complete-${appointment.id}`}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Mark Complete
              </Button>
            )}
    
  
      </Card>
    );
  };

  if (isLoading) {
  return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />

    );
  }

  const todayCount = filterAppointments("today").length;
  const upcomingCount = filterAppointments("upcoming").length;
  const pendingCount = appointments.filter((a) => a.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold" data-testid="text-page-title">Property Visits</h1>
        <p className="text-muted-foreground">Manage scheduled property visits from buyers</p>


      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 dark:bg-blue-900 rounded-lg">
              <CalendarDays className="h-5 w-5 text-blue-600 dark:text-blue-300" />
      
            <div>
              <p className="text-2xl font-bold" data-testid="text-today-count">{todayCount}</p>
              <p className="text-sm text-muted-foreground">Today's Visits</p>
      
    
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 dark:bg-green-900 rounded-lg">
              <Calendar className="h-5 w-5 text-green-600 dark:text-green-300" />
      
            <div>
              <p className="text-2xl font-bold" data-testid="text-upcoming-count">{upcomingCount}</p>
              <p className="text-sm text-muted-foreground">Upcoming</p>
      
    
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
              <Clock3 className="h-5 w-5 text-yellow-600 dark:text-yellow-300" />
      
            <div>
              <p className="text-2xl font-bold" data-testid="text-pending-count">{pendingCount}</p>
              <p className="text-sm text-muted-foreground">Pending Approval</p>
      
    
        </Card>


      {/* Appointments Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList>
          <TabsTrigger value="all" data-testid="tab-all">All ({appointments.length})</TabsTrigger>
          <TabsTrigger value="today" data-testid="tab-today">Today ({todayCount})</TabsTrigger>
          <TabsTrigger value="upcoming" data-testid="tab-upcoming">Upcoming ({upcomingCount})</TabsTrigger>
          <TabsTrigger value="past" data-testid="tab-past">Past</TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="space-y-3 mt-4">
          {appointments.length === 0 ? (
            <Card className="p-8 text-center">
              <CalendarDays className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No appointments yet</h3>
              <p className="text-muted-foreground">When buyers schedule visits, they'll appear here.</p>
            </Card>
          ) : (
            appointments.map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
        <TabsContent value="today" className="space-y-3 mt-4">
          {filterAppointments("today").length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No visits scheduled for today</h3>
            </Card>
          ) : (
            filterAppointments("today").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
        <TabsContent value="upcoming" className="space-y-3 mt-4">
          {filterAppointments("upcoming").length === 0 ? (
            <Card className="p-8 text-center">
              <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No upcoming visits</h3>
            </Card>
          ) : (
            filterAppointments("upcoming").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
        <TabsContent value="past" className="space-y-3 mt-4">
          {filterAppointments("past").length === 0 ? (
            <Card className="p-8 text-center">
              <Clock className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="font-semibold text-lg">No past visits</h3>
            </Card>
          ) : (
            filterAppointments("past").map((appointment) => (
              <AppointmentCard key={appointment.id} appointment={appointment} />
            ))
          )}
        </TabsContent>
      </Tabs>

      {/* Appointment Details Modal */}
      <Dialog open={showDetailsModal} onOpenChange={setShowDetailsModal}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Appointment Details</DialogTitle>
          </DialogHeader>
          {selectedAppointment && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Badge className={statusColors[selectedAppointment.status]}>
                  {statusLabels[selectedAppointment.status]}
                </Badge>
        
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Date</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {format(parseISO(String(selectedAppointment.scheduledDate)), "EEE, MMM d, yyyy")}
                  </p>
          
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Time</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {selectedAppointment.scheduledTime}
                  </p>
          
        
              <div className="space-y-1">
                <Label className="text-muted-foreground">Buyer</Label>
                <p className="font-medium flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {selectedAppointment.buyerName}
                </p>
        
              {selectedAppointment.buyerPhone && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Phone</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${selectedAppointment.buyerPhone}`} className="text-primary hover:underline">
                      {selectedAppointment.buyerPhone}
                    </a>
                  </p>
          
              )}
              {selectedAppointment.buyerEmail && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Email</Label>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${selectedAppointment.buyerEmail}`} className="text-primary hover:underline">
                      {selectedAppointment.buyerEmail}
                    </a>
                  </p>
          
              )}
              {selectedAppointment.notes && (
                <div className="space-y-1">
                  <Label className="text-muted-foreground">Buyer Notes</Label>
                  <p className="text-sm bg-muted p-3 rounded-md">{selectedAppointment.notes}</p>
          
              )}
              <DialogFooter className="flex-col sm:flex-row gap-2">
                {selectedAppointment.status === "pending" && (
                  <>
                    <Button
                      onClick={() => confirmMutation.mutate(selectedAppointment.id)}
                      disabled={confirmMutation.isPending}
                      data-testid="button-modal-confirm"
                    >
                      {confirmMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                      Confirm Visit
                    </Button>
                    <Button variant="outline" onClick={openReschedule} data-testid="button-modal-reschedule">
                      Reschedule
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => cancelMutation.mutate(selectedAppointment.id)}
                      disabled={cancelMutation.isPending}
                      data-testid="button-modal-cancel"
                    >
                      Decline
                    </Button>
                  </>
                )}
                {selectedAppointment.status === "confirmed" && (
                  <>
                    <Button
                      onClick={() => completeMutation.mutate(selectedAppointment.id)}
                      disabled={completeMutation.isPending}
                      data-testid="button-modal-complete"
                    >
                      Mark Completed
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => cancelMutation.mutate(selectedAppointment.id)}
                      disabled={cancelMutation.isPending}
                    >
                      Cancel Visit
                    </Button>
                  </>
                )}
              </DialogFooter>
      
          )}
        </DialogContent>
      </Dialog>

      {/* Reschedule Modal */}
      <Dialog open={showRescheduleModal} onOpenChange={setShowRescheduleModal}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Visit</DialogTitle>
            <DialogDescription>
              Propose a new date and time for this property visit.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (selectedAppointment) {
                rescheduleMutation.mutate(selectedAppointment.id);
              }
            }}
            className="space-y-4"
          >
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="reschedule-date">New Date</Label>
                <Input
                  id="reschedule-date"
                  type="date"
                  value={rescheduleDate}
                  onChange={(e) => setRescheduleDate(e.target.value)}
                  min={new Date().toISOString().split("T")[0]}
                  data-testid="input-reschedule-date"
                />
        
              <div className="space-y-2">
                <Label htmlFor="reschedule-time">New Time</Label>
                <Input
                  id="reschedule-time"
                  type="text"
                  placeholder="e.g., 10:00 AM"
                  value={rescheduleTime}
                  onChange={(e) => setRescheduleTime(e.target.value)}
                  data-testid="input-reschedule-time"
                />
        
      
            <div className="space-y-2">
              <Label htmlFor="seller-notes">Message to Buyer (optional)</Label>
              <Textarea
                id="seller-notes"
                placeholder="Let the buyer know why you're rescheduling..."
                value={sellerNotes}
                onChange={(e) => setSellerNotes(e.target.value)}
                data-testid="textarea-seller-notes"
              />
      
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowRescheduleModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={rescheduleMutation.isPending} data-testid="button-confirm-reschedule">
                {rescheduleMutation.isPending ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : null}
                Reschedule
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
