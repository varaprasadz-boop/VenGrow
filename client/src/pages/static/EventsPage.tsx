import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Users } from "lucide-react";

export default function EventsPage() {
  const upcomingEvents = [
    {
      id: "1",
      title: "Property Investment Summit 2025",
      date: "Dec 15, 2025",
      time: "10:00 AM - 5:00 PM",
      location: "Taj Hotel, Mumbai",
      type: "Conference",
      attendees: 500,
      status: "upcoming",
    },
    {
      id: "2",
      title: "First-Time Home Buyer Workshop",
      date: "Dec 8, 2025",
      time: "2:00 PM - 4:00 PM",
      location: "Online Webinar",
      type: "Workshop",
      attendees: 200,
      status: "upcoming",
    },
    {
      id: "3",
      title: "Luxury Property Showcase",
      date: "Dec 20, 2025",
      time: "11:00 AM - 6:00 PM",
      location: "ITC Grand, Bangalore",
      type: "Expo",
      attendees: 1000,
      status: "upcoming",
    },
  ];

  const pastEvents = [
    {
      id: "4",
      title: "Real Estate Trends 2025",
      date: "Nov 10, 2025",
      location: "Virtual Event",
      attendees: 350,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={false} userType="buyer" />

      <main className="flex-1">
        {/* Hero */}
        <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-serif font-bold text-4xl md:text-5xl mb-4">
              Events & Workshops
            </h1>
            <p className="text-lg text-muted-foreground">
              Join our upcoming events and learn from industry experts
            </p>
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="py-16">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8">
              Upcoming Events
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="p-6">
                  <Badge className="mb-4">{event.type}</Badge>
                  <h3 className="font-semibold text-lg mb-4">{event.title}</h3>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {event.date} • {event.time}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{event.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{event.attendees} attendees</span>
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    data-testid={`button-register-${event.id}`}
                  >
                    Register Now
                  </Button>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Past Events */}
        <div className="py-16 bg-muted/30">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="font-serif font-bold text-3xl mb-8">Past Events</h2>
            <div className="space-y-4">
              {pastEvents.map((event) => (
                <Card key={event.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-lg mb-2">
                        {event.title}
                      </h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          {event.date}
                        </span>
                        <span className="flex items-center gap-1">
                          <MapPin className="h-4 w-4" />
                          {event.location}
                        </span>
                        <span className="flex items-center gap-1">
                          <Users className="h-4 w-4" />
                          {event.attendees} attended
                        </span>
                      </div>
                    </div>
                    <Button
                      variant="outline"
                      data-testid={`button-recording-${event.id}`}
                    >
                      View Recording
                    </Button>
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
