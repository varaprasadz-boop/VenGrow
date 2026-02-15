import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { getPropertyUrl } from "@/lib/property-utils";
import { Calendar, Clock, MapPin, Building2, Video, Footprints } from "lucide-react";

type AppointmentStatus = "pending" | "confirmed" | "completed" | "cancelled";

interface PropertySummary {
  id: string;
  title: string;
  locality: string | null;
  city: string | null;
  price: number;
  transactionType: string;
  slug: string | null;
  imageUrl: string | null;
}

interface AppointmentWithProperty {
  id: string;
  propertyId: string;
  buyerId: string;
  sellerId: string;
  scheduledDate: string;
  scheduledTime: string;
  visitType: string;
  status: AppointmentStatus;
  notes: string | null;
  createdAt: string;
  property: PropertySummary | null;
}

export default function ScheduleVisitPage() {
  const { user } = useAuth();

  const { data: appointments, isLoading } = useQuery<AppointmentWithProperty[]>({
    queryKey: ["/api/me/appointments", "withProperty=1"],
    queryFn: async () => {
      const res = await fetch("/api/me/appointments?withProperty=1", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load visits");
      return res.json();
    },
    enabled: !!user?.id,
  });

  const formatPrice = (price: number, transactionType: string) => {
    if (transactionType === "rent" || transactionType === "lease") {
      return `₹${(price / 1000).toFixed(0)}K/mo`;
    }
    if (price >= 10000000) {
      return `₹${(price / 10000000).toFixed(2)} Cr`;
    }
    return `₹${(price / 100000).toFixed(2)} L`;
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
  };

  const getStatusBadge = (status: AppointmentStatus) => {
    const styles: Record<AppointmentStatus, string> = {
      pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
      confirmed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400",
      completed: "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300",
      cancelled: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    };
    const labels: Record<AppointmentStatus, string> = {
      pending: "Pending",
      confirmed: "Confirmed",
      completed: "Completed",
      cancelled: "Cancelled",
    };
    return (
      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
        {labels[status]}
      </span>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <main className="flex-1 pb-16 lg:pb-8">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full rounded-lg" />
              ))}
            </div>
          </div>
        </main>
        <BuyerBottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">My Visits</h1>
            <p className="text-muted-foreground">
              History of all property visits you scheduled
            </p>
          </div>

          {!appointments || appointments.length === 0 ? (
            <Card className="p-12 text-center">
              <Calendar className="h-14 w-14 mx-auto mb-4 text-muted-foreground" />
              <h2 className="font-semibold text-xl mb-2">No visits yet</h2>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">
                When you schedule a visit from a property page, it will appear here.
              </p>
              <Button asChild>
                <Link href="/properties">Browse properties</Link>
              </Button>
            </Card>
          ) : (
            <ul className="space-y-4">
              {appointments.map((apt) => (
                <li key={apt.id}>
                  <Card className="overflow-hidden">
                    <Link
                      href={apt.property ? getPropertyUrl(apt.property) : `/property/${apt.propertyId}`}
                      className="flex flex-col sm:flex-row sm:items-stretch gap-0 sm:gap-4 p-0 hover:bg-muted/50 transition-colors block"
                    >
                        {apt.property?.imageUrl && (
                          <div className="w-full sm:w-40 h-36 sm:h-auto sm:min-h-[120px] bg-muted shrink-0">
                            <img
                              src={apt.property.imageUrl}
                              alt={apt.property.title}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}
                        <div className="flex-1 p-4 sm:py-4 sm:pr-4 flex flex-col justify-center min-w-0">
                          {apt.property && (
                            <>
                              <h3 className="font-semibold text-lg line-clamp-2 mb-1">
                                {apt.property.title}
                              </h3>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                <MapPin className="h-4 w-4 shrink-0" />
                                <span className="truncate">
                                  {[apt.property.locality, apt.property.city].filter(Boolean).join(", ") || "—"}
                                </span>
                              </div>
                              <p className="text-primary font-semibold mb-3">
                                {formatPrice(apt.property.price, apt.property.transactionType)}
                              </p>
                            </>
                          )}
                          {!apt.property && (
                            <h3 className="font-semibold text-lg mb-2">Property</h3>
                          )}
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1.5">
                              <Calendar className="h-4 w-4" />
                              {formatDate(apt.scheduledDate)}
                            </span>
                            <span className="flex items-center gap-1.5">
                              <Clock className="h-4 w-4" />
                              {apt.scheduledTime}
                            </span>
                            <span className="flex items-center gap-1.5">
                              {apt.visitType === "virtual" ? (
                                <Video className="h-4 w-4" />
                              ) : (
                                <Footprints className="h-4 w-4" />
                              )}
                              {apt.visitType === "virtual" ? "Virtual" : "In-person"}
                            </span>
                          </div>
                          <div className="mt-3">
                            {getStatusBadge(apt.status)}
                          </div>
                        </div>
                        <div className="hidden sm:flex items-center pr-4">
                          <Building2 className="h-5 w-5 text-muted-foreground" />
                        </div>
                    </Link>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
