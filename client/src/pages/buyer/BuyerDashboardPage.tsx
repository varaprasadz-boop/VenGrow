import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Heart,
  MessageSquare,
  Eye,
  TrendingUp,
  Home,
  Clock,
  CheckCircle,
  XCircle,
  Bell,
  CalendarDays,
  Calendar,
} from "lucide-react";
import PropertyCard from "@/components/PropertyCard";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow, format, parseISO, isAfter, isToday } from "date-fns";
import type { Property, Inquiry, SavedSearch, Appointment } from "@shared/schema";

interface DashboardStats {
  favoritesCount: number;
  inquiriesCount: number;
  viewedCount: number;
  savedSearchesCount: number;
  pendingInquiries: number;
}

interface InquiryWithProperty extends Inquiry {
  property?: {
    title: string;
  };
  seller?: {
    businessName?: string;
    firstName?: string;
  };
}

export default function BuyerDashboardPage() {
  const { user } = useAuth();

  const { data: dashboardStats, isLoading: statsLoading } = useQuery<DashboardStats>({
    queryKey: ["/api/me/dashboard"],
    enabled: !!user,
  });

  const { data: favorites = [], isLoading: favoritesLoading } = useQuery<Property[]>({
    queryKey: ["/api/me/favorites"],
    enabled: !!user,
  });

  const { data: inquiries = [], isLoading: inquiriesLoading } = useQuery<InquiryWithProperty[]>({
    queryKey: ["/api/me/inquiries"],
    enabled: !!user,
  });

  const { data: savedSearches = [], isLoading: searchesLoading } = useQuery<SavedSearch[]>({
    queryKey: ["/api/me/saved-searches"],
    enabled: !!user,
  });

  const { data: appointments = [], isLoading: appointmentsLoading } = useQuery<Appointment[]>({
    queryKey: ["/api/me/appointments"],
    enabled: !!user,
  });

  const upcomingAppointments = appointments.filter(
    (a) => (a.status === "pending" || a.status === "confirmed") && 
           (isAfter(parseISO(String(a.scheduledDate)), new Date()) || isToday(parseISO(String(a.scheduledDate))))
  ).slice(0, 3);

  const getAppointmentStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "confirmed":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "completed":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500";
      case "cancelled":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500";
      default:
        return "";
    }
  };

  const stats = [
    {
      label: "Favorites",
      value: dashboardStats?.favoritesCount || favorites.length,
      icon: Heart,
      change: `${favorites.length} saved`,
      trend: "up",
      link: "/buyer/favorites",
    },
    {
      label: "Active Inquiries",
      value: dashboardStats?.inquiriesCount || inquiries.length,
      icon: MessageSquare,
      change: `${inquiries.filter(i => i.status === "pending").length} pending`,
      trend: "neutral",
      link: "/buyer/inquiries",
    },
    {
      label: "Properties Viewed",
      value: dashboardStats?.viewedCount || 0,
      icon: Eye,
      change: "Last 30 days",
      trend: "up",
      link: "/buyer/recently-viewed",
    },
    {
      label: "Saved Searches",
      value: dashboardStats?.savedSearchesCount || savedSearches.length,
      icon: TrendingUp,
      change: "All active",
      trend: "neutral",
      link: "/buyer/saved-searches",
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-4 w-4" />;
      case "replied":
        return <CheckCircle className="h-4 w-4" />;
      case "closed":
        return <XCircle className="h-4 w-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500";
      case "replied":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500";
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-500";
      default:
        return "";
    }
  };

  const formatPropertyForCard = (property: Property) => ({
    id: property.id,
    title: property.title,
    price: property.price,
    location: `${property.locality || ''}, ${property.city}`.replace(/^, /, ''),
    imageUrl: typeof (property as any).images?.[0] === 'string' 
      ? ((property as any).images?.[0] || '/placeholder-property.jpg')
      : ((property as any).images?.[0]?.url || '/placeholder-property.jpg'),
    bedrooms: property.bedrooms || 0,
    bathrooms: property.bathrooms || 0,
    area: property.area,
    propertyType: property.propertyType,
    isFeatured: property.isFeatured || false,
    isVerified: property.isVerified || false,
    sellerType: "Individual" as const,
    transactionType: (property.transactionType === "sale" ? "Sale" : "Rent") as "Sale" | "Rent",
  });

  const recentInquiries = inquiries.slice(0, 3);
  const recentFavorites = favorites.slice(0, 2);

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={!!user} userType="buyer" />

      <main className="flex-1 bg-muted/30 pb-16 lg:pb-8">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl mb-2">
              Welcome back{user?.firstName ? `, ${user.firstName}` : ''}!
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Here's what's happening with your property search
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-6 mb-6 sm:mb-8">
            {statsLoading ? (
              [1, 2, 3, 4].map((i) => (
                <Card key={i} className="p-3 sm:p-4 lg:p-6">
                  <Skeleton className="h-8 w-8 sm:h-10 sm:w-10 lg:h-12 lg:w-12 rounded-lg mb-2 sm:mb-3" />
                  <Skeleton className="h-6 w-12 sm:h-7 sm:w-16 lg:h-8 lg:w-16 mb-1" />
                  <Skeleton className="h-3 w-16 sm:h-4 sm:w-24" />
                </Card>
              ))
            ) : (
              stats.map((stat, index) => (
                <Link key={index} href={stat.link}>
                  <Card className="p-3 sm:p-4 lg:p-6 hover-elevate active-elevate-2 cursor-pointer">
                    <div className="flex items-center justify-between mb-2 sm:mb-3 gap-2">
                      <div className="p-2 sm:p-2.5 lg:p-3 rounded-lg bg-primary/10">
                        <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-primary" />
                      </div>
                    </div>
                    <div>
                      <p className="text-xl sm:text-2xl lg:text-3xl font-bold font-serif mb-0.5 sm:mb-1">{stat.value}</p>
                      <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{stat.label}</p>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-1">{stat.change}</p>
                    </div>
                  </Card>
                </Link>
              ))
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-6 lg:space-y-8">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
                  <h2 className="font-semibold text-lg sm:text-xl">Recent Inquiries</h2>
                  <Link href="/buyer/inquiries">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-inquiries">
                      View All
                    </Button>
                  </Link>
                </div>
                {inquiriesLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="p-4 rounded-lg border">
                        <Skeleton className="h-5 w-3/4 mb-2" />
                        <Skeleton className="h-4 w-1/2 mb-2" />
                        <Skeleton className="h-3 w-1/4" />
                      </div>
                    ))}
                  </div>
                ) : recentInquiries.length > 0 ? (
                  <div className="space-y-4">
                    {recentInquiries.map((inquiry) => (
                      <div
                        key={inquiry.id}
                        className="flex items-start gap-4 p-4 rounded-lg hover-elevate active-elevate-2 border"
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1 truncate">
                            {inquiry.property?.title || "Property Inquiry"}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-2">
                            {inquiry.seller?.businessName || inquiry.seller?.firstName || "Seller"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(inquiry.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge
                          className={`${getStatusColor(inquiry.status)} flex items-center gap-1`}
                        >
                          {getStatusIcon(inquiry.status)}
                          {inquiry.status}
                        </Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No inquiries yet</p>
                    <Link href="/properties">
                      <Button variant="ghost" className="mt-2">Browse Properties</Button>
                    </Link>
                  </div>
                )}
              </Card>

              <div>
                <div className="flex items-center justify-between mb-4 sm:mb-6 gap-4">
                  <h2 className="font-semibold text-lg sm:text-xl">Saved Properties</h2>
                  <Link href="/buyer/favorites">
                    <Button variant="ghost" size="sm" data-testid="button-view-history">
                      View All
                    </Button>
                  </Link>
                </div>
                {favoritesLoading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {[1, 2].map((i) => (
                      <div key={i} className="space-y-3">
                        <Skeleton className="h-48 w-full rounded-lg" />
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                      </div>
                    ))}
                  </div>
                ) : recentFavorites.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {recentFavorites.map((property) => (
                      <PropertyCard key={property.id} {...formatPropertyForCard(property)} />
                    ))}
                  </div>
                ) : (
                  <Card className="p-8 text-center text-muted-foreground">
                    <Heart className="h-12 w-12 mx-auto mb-3 opacity-50" />
                    <p>No saved properties yet</p>
                    <Link href="/properties">
                      <Button variant="ghost" className="mt-2">Start Browsing</Button>
                    </Link>
                  </Card>
                )}
              </div>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-4">
                  <h3 className="font-semibold text-sm sm:text-base">Saved Searches</h3>
                  <Link href="/buyer/saved-searches">
                    <Button variant="ghost" size="sm" data-testid="button-manage-searches">
                      Manage
                    </Button>
                  </Link>
                </div>
                {searchesLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                ) : savedSearches.length > 0 ? (
                  <div className="space-y-3">
                    {savedSearches.slice(0, 3).map((search) => (
                      <Link key={search.id} href={`/properties?search=${search.id}`}>
                        <div className="p-3 rounded-lg border hover-elevate active-elevate-2 cursor-pointer">
                          <div className="flex items-start justify-between mb-2 gap-2">
                            <h4 className="text-sm font-medium flex-1">{search.name}</h4>
                            {search.alertEnabled && (
                              <Badge variant="secondary" className="ml-2">
                                <Bell className="h-3 w-3 mr-1" />
                                Active
                              </Badge>
                            )}
                          </div>
                          <p className="text-xs text-muted-foreground">
                            Created {formatDistanceToNow(new Date(search.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <TrendingUp className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No saved searches</p>
                  </div>
                )}
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4 gap-4">
                  <h3 className="font-semibold text-sm sm:text-base flex items-center gap-2">
                    <CalendarDays className="h-4 w-4" />
                    Upcoming Visits
                  </h3>
                </div>
                {appointmentsLoading ? (
                  <div className="space-y-3">
                    {[1, 2].map((i) => (
                      <Skeleton key={i} className="h-16 w-full rounded-lg" />
                    ))}
                  </div>
                ) : upcomingAppointments.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingAppointments.map((appointment) => (
                      <div
                        key={appointment.id}
                        className="p-3 rounded-lg border hover-elevate"
                        data-testid={`card-appointment-${appointment.id}`}
                      >
                        <div className="flex items-start justify-between mb-2 gap-2">
                          <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium">
                              {format(parseISO(String(appointment.scheduledDate)), "MMM d")}
                            </span>
                          </div>
                          <Badge className={getAppointmentStatusColor(appointment.status)}>
                            {appointment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {appointment.scheduledTime}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    <CalendarDays className="h-8 w-8 mx-auto mb-2 opacity-50" />
                    <p>No scheduled visits</p>
                    <Link href="/properties">
                      <Button variant="ghost" size="sm" className="mt-2">Browse Properties</Button>
                    </Link>
                  </div>
                )}
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/properties">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-browse-properties">
                      <Home className="h-4 w-4 mr-2" />
                      Browse Properties
                    </Button>
                  </Link>
                  <Link href="/buyer/favorites">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-view-favorites">
                      <Heart className="h-4 w-4 mr-2" />
                      View Favorites
                    </Button>
                  </Link>
                  <Link href="/buyer/property-alerts">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-create-alert">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Create Alert
                    </Button>
                  </Link>
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
