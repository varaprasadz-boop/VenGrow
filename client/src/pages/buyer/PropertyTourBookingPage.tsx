import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar } from "lucide-react";

export default function PropertyTourBookingPage() {
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);

  const availableDates = [
    { day: 25, month: "Nov", available: true },
    { day: 26, month: "Nov", available: true },
    { day: 27, month: "Nov", available: false },
    { day: 28, month: "Nov", available: true },
    { day: 29, month: "Nov", available: true },
    { day: 30, month: "Nov", available: true },
  ];

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Book a Property Tour
            </h1>
            <p className="text-muted-foreground">
              Luxury 3BHK Apartment • Bandra West, Mumbai
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Booking Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Select Date */}
              <Card className="p-6">
                <h3 className="font-semibold mb-6">Select Date</h3>
                <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                  {availableDates.map((date) => (
                    <button
                      key={date.day}
                      disabled={!date.available}
                      onClick={() => setSelectedDate(date.day)}
                      className={`p-4 rounded-lg border text-center hover-elevate active-elevate-2 ${
                        selectedDate === date.day
                          ? "border-primary bg-primary/5"
                          : date.available
                          ? "border-border"
                          : "border-border opacity-40 cursor-not-allowed"
                      }`}
                      data-testid={`button-date-${date.day}`}
                    >
                      <p className="font-semibold">{date.day}</p>
                      <p className="text-sm text-muted-foreground">{date.month}</p>
                    </button>
                  ))}
                </div>
              </Card>

              {/* Select Time */}
              {selectedDate && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-6">Select Time Slot</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        onClick={() => setSelectedTime(time)}
                        className={`p-3 rounded-lg border text-sm hover-elevate active-elevate-2 ${
                          selectedTime === time
                            ? "border-primary bg-primary/5"
                            : "border-border"
                        }`}
                        data-testid={`button-time-${time}`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </Card>
              )}

              {/* Contact Info */}
              {selectedTime && (
                <Card className="p-6">
                  <h3 className="font-semibold mb-6">Your Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Full Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Enter your name"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="+91 XXXXX XXXXX"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Email
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                </Card>
              )}
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold mb-6">Booking Summary</h3>
                <div className="space-y-4 mb-6">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Image</span>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-1">
                      Luxury 3BHK Apartment
                    </h4>
                    <p className="text-sm text-muted-foreground">
                      Bandra West, Mumbai
                    </p>
                  </div>

                  {selectedDate && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Date</p>
                      <p className="font-medium">{selectedDate} Nov, 2025</p>
                    </div>
                  )}

                  {selectedTime && (
                    <div className="pt-4 border-t">
                      <p className="text-sm text-muted-foreground mb-1">Time</p>
                      <p className="font-medium">{selectedTime}</p>
                    </div>
                  )}
                </div>

                <Button
                  className="w-full"
                  disabled={!selectedDate || !selectedTime}
                  data-testid="button-confirm"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  Confirm Booking
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
