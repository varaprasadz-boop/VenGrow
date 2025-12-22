import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Users,
  Building,
  IndianRupee,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Clock,
  RefreshCw,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import type { User, Property, Payment, SellerProfile } from "@shared/schema";

interface DashboardStats {
  totalUsers: number;
  totalListings: number;
  totalRevenue: number;
  activeSellers: number;
}

function formatPrice(amount: number): string {
  if (amount >= 10000000) {
    return `₹${(amount / 10000000).toFixed(2)} Cr`;
  } else if (amount >= 100000) {
    return `₹${(amount / 100000).toFixed(1)} L`;
  } else if (amount >= 1000) {
    return `₹${(amount / 1000).toFixed(1)}K`;
  }
  return `₹${amount.toLocaleString("en-IN")}`;
}

export default function AdminDashboardPage() {
  const { data: users = [], isLoading: loadingUsers, isError: errorUsers, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: properties = [], isLoading: loadingProperties, isError: errorProperties, refetch: refetchProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: payments = [], isLoading: loadingPayments, isError: errorPayments, refetch: refetchPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: sellerProfiles = [], isLoading: loadingProfiles, isError: errorProfiles, refetch: refetchProfiles } = useQuery<SellerProfile[]>({
    queryKey: ["/api/sellers"],
  });

  const isLoading = loadingUsers || loadingProperties || loadingPayments || loadingProfiles;
  const isError = errorUsers || errorProperties || errorPayments || errorProfiles;

  const handleRetry = () => {
    refetchUsers();
    refetchProperties();
    refetchPayments();
    refetchProfiles();
  };

  const stats: DashboardStats = {
    totalUsers: users.length,
    totalListings: properties.length,
    totalRevenue: payments
      .filter(p => p.status === "completed")
      .reduce((sum, p) => sum + (p.amount || 0), 0),
    activeSellers: sellerProfiles.filter(p => p.verificationStatus === "verified").length,
  };

  const pendingApprovals = sellerProfiles
    .filter(p => p.verificationStatus === "pending")
    .slice(0, 5);

  const recentListings = [...properties]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const recentTransactions = [...payments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
            <Skeleton className="h-8 sm:h-10 w-48 sm:w-64 mb-2" />
            <Skeleton className="h-5 sm:h-6 w-36 sm:w-48 mb-6 sm:mb-8" />
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 sm:h-32 w-full" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
              <Skeleton className="lg:col-span-2 h-64 sm:h-96 w-full" />
              <Skeleton className="h-64 sm:h-96 w-full" />
            </div>
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Dashboard</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the dashboard data. Please try again.
            </p>
            <Button onClick={handleRetry} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  const statCards = [
    {
      label: "Total Users",
      value: stats.totalUsers.toLocaleString(),
      icon: Users,
      change: `${users.filter(u => u.role === 'buyer').length} buyers, ${users.filter(u => u.role === 'seller').length} sellers`,
    },
    {
      label: "Total Listings",
      value: stats.totalListings.toLocaleString(),
      icon: Building,
      change: `${properties.filter(p => p.status === 'active').length} active`,
    },
    {
      label: "Revenue (Total)",
      value: formatPrice(stats.totalRevenue),
      icon: IndianRupee,
      change: `${payments.filter(p => p.status === 'completed').length} transactions`,
    },
    {
      label: "Verified Sellers",
      value: stats.activeSellers.toLocaleString(),
      icon: TrendingUp,
      change: `${pendingApprovals.length} pending approval`,
    },
  ];

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="mb-6 sm:mb-8">
            <h1 className="font-serif font-bold text-2xl sm:text-3xl mb-1 sm:mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground text-sm sm:text-base">
              Platform overview and management
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6 mb-6 sm:mb-8">
            {statCards.map((stat, index) => (
              <Card key={index} className="p-3 sm:p-6" data-testid={`card-stat-${index}`}>
                <div className="flex items-start justify-between mb-2 sm:mb-3">
                  <div className="p-2 sm:p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-xl sm:text-3xl font-bold font-serif mb-0.5 sm:mb-1">{stat.value}</p>
                  <p className="text-xs sm:text-sm text-muted-foreground mb-1 sm:mb-2">{stat.label}</p>
                  <p className="text-[10px] sm:text-xs text-green-600 line-clamp-1">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-8">
            <div className="lg:col-span-2 space-y-4 sm:space-y-8">
              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                  <div className="flex items-center gap-2 sm:gap-3">
                    <h2 className="font-semibold text-lg sm:text-xl">Pending Seller Approvals</h2>
                    <Badge variant="destructive">{pendingApprovals.length}</Badge>
                  </div>
                  <Link href="/admin/seller-approvals">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-approvals">
                      View All
                    </Button>
                  </Link>
                </div>
                {pendingApprovals.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <CheckCircle className="h-12 w-12 mx-auto mb-2 text-green-500" />
                    <p>All seller registrations have been reviewed</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingApprovals.map((approval) => (
                      <div
                        key={approval.id}
                        className="flex items-center gap-4 p-4 rounded-lg border hover-elevate active-elevate-2"
                        data-testid={`card-approval-${approval.id}`}
                      >
                        <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                          <Clock className="h-5 w-5 text-yellow-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1 truncate">{approval.companyName || "Individual Seller"}</h3>
                          <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                            <span className="capitalize">{approval.sellerType}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(approval.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                          <Button size="sm" data-testid={`button-approve-${approval.id}`}>
                            Approve
                          </Button>
                          <Link href={`/admin/seller-approvals`}>
                            <Button variant="outline" size="sm" data-testid={`button-review-${approval.id}`}>
                              Review
                            </Button>
                          </Link>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-4 sm:mb-6 flex-wrap gap-2">
                  <h2 className="font-semibold text-lg sm:text-xl">Recent Listings</h2>
                  <Link href="/admin/listing-moderation">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-listings">
                      View All
                    </Button>
                  </Link>
                </div>
                {recentListings.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Building className="h-12 w-12 mx-auto mb-2" />
                    <p>No listings yet</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {recentListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-start gap-4 p-4 rounded-lg border"
                        data-testid={`card-listing-${listing.id}`}
                      >
                        <div className="flex-1 min-w-0">
                          <h3 className="font-medium mb-1 truncate">{listing.title}</h3>
                          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                            <span>{listing.city}, {listing.state}</span>
                            <span>•</span>
                            <span className="font-medium text-primary">{formatPrice(listing.price)}</span>
                            <span>•</span>
                            <span>{formatDistanceToNow(new Date(listing.createdAt), { addSuffix: true })}</span>
                          </div>
                        </div>
                        {listing.status === "pending" ? (
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                            <AlertCircle className="h-3 w-3 mr-1" />
                            Pending
                          </Badge>
                        ) : listing.status === "active" ? (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Active
                          </Badge>
                        ) : (
                          <Badge variant="secondary">{listing.status}</Badge>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </Card>
            </div>

            <div className="space-y-4 sm:space-y-6">
              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Link href="/admin/user-management">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-manage-users">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Users
                    </Button>
                  </Link>
                  <Link href="/admin/listing-moderation">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-manage-listings">
                      <Building className="h-4 w-4 mr-2" />
                      Manage Listings
                    </Button>
                  </Link>
                  <Link href="/admin/transactions">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-view-transactions">
                      <IndianRupee className="h-4 w-4 mr-2" />
                      View Transactions
                    </Button>
                  </Link>
                  <Link href="/admin/platform-analytics">
                    <Button variant="outline" className="w-full justify-start" data-testid="button-analytics">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Analytics
                    </Button>
                  </Link>
                </div>
              </Card>

              <Card className="p-4 sm:p-6">
                <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
                  <h3 className="font-semibold">Recent Transactions</h3>
                  <Link href="/admin/transactions">
                    <Button variant="ghost" size="sm" data-testid="button-view-all-transactions">
                      View All
                    </Button>
                  </Link>
                </div>
                {recentTransactions.length === 0 ? (
                  <p className="text-sm text-muted-foreground text-center py-4">No transactions yet</p>
                ) : (
                  <div className="space-y-3">
                    {recentTransactions.map((txn) => (
                      <div key={txn.id} className="text-sm" data-testid={`card-txn-${txn.id}`}>
                        <div className="flex items-start justify-between mb-1 gap-2">
                          <p className="font-medium truncate">{txn.razorpayOrderId || "Payment"}</p>
                          <p className="font-semibold text-primary whitespace-nowrap">
                            {formatPrice(txn.amount || 0)}
                          </p>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <span className="capitalize">{txn.status}</span>
                          <span>•</span>
                          <span>{format(new Date(txn.createdAt), "MMM d, yyyy")}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </Card>

              <Card className="p-4 sm:p-6">
                <h3 className="font-semibold mb-3 sm:mb-4">System Status</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Server Status</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                      Online
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Database</span>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                      Healthy
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Payment Gateway</span>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                      Pending Setup
                    </Badge>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    );
}
