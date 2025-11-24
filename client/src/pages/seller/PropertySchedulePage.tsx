import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, MapPin, User } from "lucide-react";

export default function PropertySchedulePage() {
  const upcomingVisits = [
    {
      id: "1",
      property: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      visitorName: "Amit Kumar",
      visitorPhone: "+91 98765 43210",
      date: "Nov 25, 2025",
      time: "10:00 AM",
      status: "confirmed",
    },
    {
      id: "2",
      property: "Luxury 3BHK Apartment",
      location: "Bandra West, Mumbai",
      visitorName: "Priya Sharma",
      visitorPhone: "+91 98765 12345",
      date: "Nov 25, 2025",
      time: "2:00 PM",
      status: "confirmed",
    },
    {
      id: "3",
      property: "Commercial Office Space",
      location: "BKC, Mumbai",
      visitorName: "Rajesh Patel",
      visitorPhone: "+91 98765 67890",
      date: "Nov 26, 2025",
      time: "11:00 AM",
      status: "pending",
    },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "confirmed":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            Confirmed
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            Pending
          </Badge>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <CalendarIcon className="h-8 w-8 text-primary" />
              Property Visit Schedule
            </h1>
            <p className="text-muted-foreground">
              Manage upcoming property viewings
            </p>
          </div>

          {/* Calendar View */}
          <Card className="p-6 mb-8">
            <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
              <span className="text-muted-foreground">Calendar View</span>
            </div>
          </Card>

          {/* Upcoming Visits */}
          <div>
            <h2 className="font-semibold text-xl mb-4">Upcoming Visits</h2>
            <div className="space-y-4">
              {upcomingVisits.map((visit) => (
                <Card key={visit.id} className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold">{visit.property}</h3>
                        {getStatusBadge(visit.status)}
                      </div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground mb-4">
                        <MapPin className="h-4 w-4" />
                        {visit.location}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="flex items-center gap-2 text-sm">
                          <User className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{visit.visitorName}</p>
                            <p className="text-xs text-muted-foreground">
                              {visit.visitorPhone}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{visit.date}</p>
                            <p className="text-xs text-muted-foreground">Visit Date</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-muted-foreground" />
                          <div>
                            <p className="font-medium">{visit.time}</p>
                            <p className="text-xs text-muted-foreground">Time Slot</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    {visit.status === "pending" && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-confirm-${visit.id}`}
                        >
                          Confirm
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          data-testid={`button-reject-${visit.id}`}
                        >
                          Reject
                        </Button>
                      </>
                    )}
                    {visit.status === "confirmed" && (
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-reschedule-${visit.id}`}
                      >
                        Reschedule
                      </Button>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
