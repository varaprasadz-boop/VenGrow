import { useState } from "react";
import { Link } from "wouter";
import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar as CalendarIcon, Clock, MapPin, Building2 } from "lucide-react";

export default function ScheduleVisitPage() {
  const [visitType, setVisitType] = useState("physical");
  const [formData, setFormData] = useState({
    date: "",
    time: "",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const property = {
    title: "Luxury 3BHK Apartment in Prime Location",
    location: "Bandra West, Mumbai",
    price: "₹85 L",
    seller: "Prestige Estates",
  };

  const timeSlots = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <Link href="/property/1">
              <a className="text-sm text-primary hover:underline mb-2 inline-block">
                ← Back to Property
              </a>
            </Link>
            <h1 className="font-serif font-bold text-3xl mb-2">
              Schedule a Visit
            </h1>
            <p className="text-muted-foreground">
              Choose your preferred date and time for property visit
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <form className="space-y-6">
                  {/* Visit Type */}
                  <div className="space-y-3">
                    <Label>Visit Type</Label>
                    <RadioGroup value={visitType} onValueChange={setVisitType}>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem
                          value="physical"
                          id="physical"
                          data-testid="radio-physical"
                        />
                        <Label
                          htmlFor="physical"
                          className="flex-1 font-normal cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">Physical Visit</p>
                            <p className="text-sm text-muted-foreground">
                              Visit the property in person
                            </p>
                          </div>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2 p-4 border rounded-lg">
                        <RadioGroupItem
                          value="virtual"
                          id="virtual"
                          data-testid="radio-virtual"
                        />
                        <Label
                          htmlFor="virtual"
                          className="flex-1 font-normal cursor-pointer"
                        >
                          <div>
                            <p className="font-medium">Virtual Tour</p>
                            <p className="text-sm text-muted-foreground">
                              Schedule a video call tour
                            </p>
                          </div>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Date & Time */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="date">Preferred Date</Label>
                      <div className="relative">
                        <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                          id="date"
                          type="date"
                          className="pl-10"
                          value={formData.date}
                          onChange={(e) =>
                            setFormData({ ...formData, date: e.target.value })
                          }
                          data-testid="input-date"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="time">Preferred Time</Label>
                      <div className="relative">
                        <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <select
                          id="time"
                          className="w-full pl-10 h-10 border rounded-md"
                          value={formData.time}
                          onChange={(e) =>
                            setFormData({ ...formData, time: e.target.value })
                          }
                          data-testid="select-time"
                        >
                          <option value="">Select time</option>
                          {timeSlots.map((slot) => (
                            <option key={slot} value={slot}>
                              {slot}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Contact Details */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Your Name</Label>
                      <Input
                        id="name"
                        placeholder="Full name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        data-testid="input-name"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="your@email.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          data-testid="input-email"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          data-testid="input-phone"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Additional Message (Optional)</Label>
                      <Textarea
                        id="message"
                        rows={4}
                        placeholder="Any specific requirements or questions..."
                        value={formData.message}
                        onChange={(e) =>
                          setFormData({ ...formData, message: e.target.value })
                        }
                        data-testid="textarea-message"
                      />
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <Link href="/property/1" className="flex-1">
                      <Button variant="outline" className="w-full" data-testid="button-cancel">
                        Cancel
                      </Button>
                    </Link>
                    <Button className="flex-1" data-testid="button-schedule">
                      Schedule Visit
                    </Button>
                  </div>
                </form>
              </Card>
            </div>

            {/* Property Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-4">
                <h3 className="font-semibold mb-4">Property Details</h3>

                <div className="space-y-4">
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <span className="text-sm text-muted-foreground">Property Image</span>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-2 line-clamp-2">
                      {property.title}
                    </h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                      <MapPin className="h-4 w-4" />
                      <span>{property.location}</span>
                    </div>
                    <p className="text-2xl font-bold font-serif text-primary mb-3">
                      {property.price}
                    </p>
                  </div>

                  <div className="pt-4 border-t">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 rounded-lg bg-primary/10">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Listed by</p>
                        <p className="font-medium">{property.seller}</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                    <p className="text-sm text-blue-900 dark:text-blue-400">
                      <strong>Note:</strong> The seller will receive your visit request and confirm the appointment within 24 hours.
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
