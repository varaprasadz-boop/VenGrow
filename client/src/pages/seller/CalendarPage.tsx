import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function CalendarPage() {
  const events = [
    {
      id: "1",
      title: "Property Visit - Luxury 3BHK",
      time: "10:00 AM",
      type: "visit",
      client: "Rahul Sharma",
    },
    {
      id: "2",
      title: "Document Verification",
      time: "02:00 PM",
      type: "admin",
      client: "VenGrow Team",
    },
    {
      id: "3",
      title: "Client Meeting - Villa Project",
      time: "04:30 PM",
      type: "meeting",
      client: "Priya Patel",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                My Calendar
              </h1>
              <p className="text-muted-foreground">
                Manage your schedule and appointments
              </p>
            </div>
            <Button data-testid="button-add-event">
              <CalendarIcon className="h-4 w-4 mr-2" />
              Add Event
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Calendar */}
            <div className="lg:col-span-2">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="font-semibold text-lg">November 2025</h3>
                  <div className="flex gap-2">
                    <Button variant="outline" size="icon">
                      <ChevronLeft className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-7 gap-2 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
                    <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                      {day}
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                  {Array.from({ length: 35 }).map((_, index) => {
                    const day = index - 2;
                    const isToday = day === 24;
                    const hasEvent = day === 24;
                    return (
                      <button
                        key={index}
                        className={`aspect-square p-2 rounded-lg text-sm hover-elevate active-elevate-2 ${
                          day < 1 || day > 30
                            ? "text-muted-foreground"
                            : isToday
                            ? "bg-primary text-primary-foreground font-semibold"
                            : hasEvent
                            ? "border-2 border-primary"
                            : "border"
                        }`}
                      >
                        {day > 0 && day <= 30 ? day : ""}
                      </button>
                    );
                  })}
                </div>
              </Card>
            </div>

            {/* Events */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <h3 className="font-semibold mb-6">Today's Schedule</h3>
                <div className="space-y-4">
                  {events.map((event) => (
                    <div key={event.id} className="p-4 border rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm font-medium">{event.time}</span>
                      </div>
                      <h4 className="font-semibold mb-1">{event.title}</h4>
                      <p className="text-sm text-muted-foreground">{event.client}</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
