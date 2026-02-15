import { useState } from "react";
import { useParams } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { validateEmail, validatePhone, cleanPhone } from "@/utils/validation";
import { PhoneInput } from "@/components/ui/location-select";

export default function PropertyTourBookingPage() {
  const { id: propertyId } = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedDate, setSelectedDate] = useState<number | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [contactData, setContactData] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const bookTourMutation = useMutation({
    mutationFn: async (data: {
      date: string;
      time: string;
      name: string;
      phone: string;
      email: string;
    }) => {
      if (!propertyId) throw new Error("Property ID is required");
      return apiRequest("POST", "/api/appointments", {
        propertyId,
        scheduledDate: data.date,
        scheduledTime: data.time,
        buyerName: data.name,
        buyerPhone: data.phone,
        buyerEmail: data.email,
        visitType: "physical",
      });
    },
    onSuccess: () => {
      toast({
        title: "Tour booked successfully!",
        description: "The seller will confirm your tour request soon.",
      });
      setContactData({ name: "", phone: "", email: "" });
      setSelectedDate(null);
      setSelectedTime(null);
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to book tour";
      toast({
        title: "Booking failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedDate || !selectedTime) {
      toast({
        title: "Date and time required",
        description: "Please select a date and time for your tour.",
        variant: "destructive",
      });
      return;
    }

    if (!contactData.name.trim()) {
      toast({
        title: "Name required",
        variant: "destructive",
      });
      return;
    }

    if (!contactData.phone.trim()) {
      toast({
        title: "Phone required",
        variant: "destructive",
      });
      return;
    }

    if (!validatePhone(contactData.phone)) {
      toast({
        title: "Invalid phone number",
        description: "Please enter a valid 10-digit Indian mobile number starting with 6-9.",
        variant: "destructive",
      });
      return;
    }

    if (!contactData.email.trim()) {
      toast({
        title: "Email required",
        variant: "destructive",
      });
      return;
    }

    if (!validateEmail(contactData.email.trim())) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const dateStr = new Date(2025, 10, selectedDate).toISOString().split('T')[0];
    bookTourMutation.mutate({
      date: dateStr,
      time: selectedTime,
      name: contactData.name.trim(),
      phone: contactData.phone.trim(),
      email: contactData.email.trim(),
    });
  };

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

      <main className="flex-1 pb-16 lg:pb-8">
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
                  <form id="tour-booking-form" onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <Label htmlFor="name" className="text-sm font-medium mb-2 block">
                        Full Name *
                      </Label>
                      <Input
                        id="name"
                        type="text"
                        placeholder="Enter your name"
                        value={contactData.name}
                        onChange={(e) => setContactData({ ...contactData, name: e.target.value })}
                        required
                        aria-required="true"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium mb-2 block">
                        Phone Number *
                      </Label>
                      <PhoneInput
                        value={cleanPhone(contactData.phone)}
                        onValueChange={(v) => setContactData({ ...contactData, phone: v })}
                        data-testid="input-phone"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email" className="text-sm font-medium mb-2 block">
                        Email *
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={contactData.email}
                        onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                        required
                        aria-required="true"
                      />
                    </div>
                  </form>
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
                  type="submit"
                  form="tour-booking-form"
                  className="w-full"
                  disabled={!selectedDate || !selectedTime || bookTourMutation.isPending}
                  data-testid="button-confirm"
                >
                  {bookTourMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Booking...
                    </>
                  ) : (
                    <>
                      <Calendar className="h-4 w-4 mr-2" />
                      Confirm Booking
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
