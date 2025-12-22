import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  TrendingUp,
  IndianRupee,
  RefreshCw,
  AlertCircle,
  Package,
  MessageSquare,
  UserCheck,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
} from "lucide-react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import type { User, Property, Payment, SellerProfile, SellerSubscription, Inquiry } from "@shared/schema";

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

const COLORS = ["hsl(var(--primary))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function PlatformStatisticsPage() {
  const { data: users = [], isLoading: loadingUsers, isError: errorUsers, refetch: refetchUsers } = useQuery<User[]>({
    queryKey: ["/api/admin/users"],
  });

  const { data: properties = [], isLoading: loadingProperties, isError: errorProperties, refetch: refetchProperties } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
  });

  const { data: payments = [], isLoading: loadingPayments, isError: errorPayments, refetch: refetchPayments } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
  });

  const { data: sellerProfiles = [], isLoading: loadingSellers, isError: errorSellers, refetch: refetchSellers } = useQuery<SellerProfile[]>({
    queryKey: ["/api/sellers"],
  });

  const { data: subscriptions = [], isLoading: loadingSubs, isError: errorSubs, refetch: refetchSubs } = useQuery<SellerSubscription[]>({
    queryKey: ["/api/subscriptions"],
  });

  const { data: inquiries = [], isLoading: loadingInquiries, isError: errorInquiries, refetch: refetchInquiries } = useQuery<Inquiry[]>({
    queryKey: ["/api/inquiries"],
  });

  const isLoading = loadingUsers || loadingProperties || loadingPayments || loadingSellers || loadingSubs || loadingInquiries;
  const isError = errorUsers || errorProperties || errorPayments || errorSellers || errorSubs || errorInquiries;

  const handleRefresh = () => {
    refetchUsers();
    refetchProperties();
    refetchPayments();
    refetchSellers();
    refetchSubs();
    refetchInquiries();
  };

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Analytics</h2>
            <p className="text-muted-foreground mb-4">
              There was an error retrieving platform statistics. Please try again.
            </p>
            <Button onClick={handleRefresh} data-testid="button-retry-error">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <Skeleton className="h-80" />
              <Skeleton className="h-80" />
            </div>
            <Skeleton className="h-80" />
          </div>
        </main>
    );
  }

  const totalRevenue = payments
    .filter((p) => p.status === "completed")
    .reduce((sum, p) => sum + (p.amount || 0), 0);

  const buyerCount = users.filter((u) => u.role === "buyer").length;
  const sellerCount = users.filter((u) => u.role === "seller").length;
  const adminCount = users.filter((u) => u.role === "admin").length;

  const activeListings = properties.filter((p) => p.status === "active" || p.workflowStatus === "live").length;
  const pendingListings = properties.filter((p) => p.status === "pending" || p.workflowStatus === "submitted" || p.workflowStatus === "under_review").length;
  const draftListings = properties.filter((p) => p.status === "draft").length;

  const verifiedSellers = sellerProfiles.filter((p) => p.verificationStatus === "verified").length;
  const pendingSellers = sellerProfiles.filter((p) => p.verificationStatus === "pending").length;

  const activeSubscriptions = subscriptions.filter((s) => s.isActive).length;

  const stats = [
    {
      label: "Total Users",
      value: users.length.toLocaleString(),
      icon: Users,
      subtext: `${buyerCount} buyers, ${sellerCount} sellers`,
      bgColor: "bg-blue-100 dark:bg-blue-900/20",
      iconColor: "text-blue-600",
    },
    {
      label: "Active Listings",
      value: activeListings.toLocaleString(),
      icon: Building,
      subtext: `${pendingListings} pending review`,
      bgColor: "bg-green-100 dark:bg-green-900/20",
      iconColor: "text-green-600",
    },
    {
      label: "Total Revenue",
      value: formatPrice(totalRevenue),
      icon: IndianRupee,
      subtext: `${payments.filter((p) => p.status === "completed").length} completed payments`,
      bgColor: "bg-orange-100 dark:bg-orange-900/20",
      iconColor: "text-orange-600",
    },
    {
      label: "Active Subscriptions",
      value: activeSubscriptions.toLocaleString(),
      icon: Package,
      subtext: `${verifiedSellers} verified sellers`,
      bgColor: "bg-purple-100 dark:bg-purple-900/20",
      iconColor: "text-purple-600",
    },
  ];

  const userDistribution = [
    { name: "Buyers", value: buyerCount, fill: COLORS[0] },
    { name: "Sellers", value: sellerCount, fill: COLORS[1] },
    { name: "Admins", value: adminCount, fill: COLORS[2] },
  ].filter((d) => d.value > 0);

  const propertyDistribution = [
    { name: "Active", value: activeListings, fill: COLORS[0] },
    { name: "Pending", value: pendingListings, fill: COLORS[1] },
    { name: "Draft", value: draftListings, fill: COLORS[2] },
    { name: "Rejected", value: properties.filter((p) => p.status === "rejected").length, fill: COLORS[3] },
  ].filter((d) => d.value > 0);

  const sellerDistribution = [
    { name: "Verified", value: verifiedSellers, fill: COLORS[0] },
    { name: "Pending", value: pendingSellers, fill: COLORS[1] },
    { name: "Rejected", value: sellerProfiles.filter((p) => p.verificationStatus === "rejected").length, fill: COLORS[3] },
  ].filter((d) => d.value > 0);

  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const now = new Date();
  const currentMonth = now.getMonth();
  const currentYear = now.getFullYear();

  const getLast6Months = () => {
    const result = [];
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentYear, currentMonth - i, 1);
      result.push({
        month: monthNames[date.getMonth()],
        monthIndex: date.getMonth(),
        year: date.getFullYear(),
      });
    }
    return result;
  };

  const last6Months = getLast6Months();

  const revenueByMonth = last6Months.map((monthData) => {
    const monthPayments = payments.filter((p) => {
      const date = new Date(p.createdAt);
      return date.getMonth() === monthData.monthIndex && 
             date.getFullYear() === monthData.year && 
             p.status === "completed";
    });
    return {
      month: monthData.month,
      revenue: monthPayments.reduce((sum, p) => sum + (p.amount || 0), 0),
      count: monthPayments.length,
    };
  });

  const usersByMonth = last6Months.map((monthData) => {
    const monthUsers = users.filter((u) => {
      if (!u.createdAt) return false;
      const date = new Date(u.createdAt);
      return date.getMonth() === monthData.monthIndex && date.getFullYear() === monthData.year;
    });
    return {
      month: monthData.month,
      users: monthUsers.length,
      buyers: monthUsers.filter((u) => u.role === "buyer").length,
      sellers: monthUsers.filter((u) => u.role === "seller").length,
    };
  });

  const metrics = [
    {
      icon: UserCheck,
      label: "Seller Verification Rate",
      value: sellerProfiles.length > 0 ? `${Math.round((verifiedSellers / sellerProfiles.length) * 100)}%` : "N/A",
      description: `${verifiedSellers} of ${sellerProfiles.length} sellers verified`,
      trend: verifiedSellers > pendingSellers ? "positive" : "neutral",
    },
    {
      icon: Eye,
      label: "Listing Approval Rate",
      value: properties.length > 0 ? `${Math.round((activeListings / Math.max(properties.length, 1)) * 100)}%` : "N/A",
      description: `${activeListings} of ${properties.length} listings active`,
      trend: activeListings > pendingListings ? "positive" : "neutral",
    },
    {
      icon: MessageSquare,
      label: "Total Inquiries",
      value: inquiries.length.toLocaleString(),
      description: `${inquiries.filter((i) => i.status === "pending").length} pending response`,
      trend: "neutral",
    },
    {
      icon: Clock,
      label: "Pending Actions",
      value: (pendingSellers + pendingListings).toLocaleString(),
      description: `${pendingSellers} sellers, ${pendingListings} listings`,
      trend: pendingSellers + pendingListings > 0 ? "warning" : "positive",
    },
  ];

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2" data-testid="text-page-title">
                Platform Statistics
              </h1>
              <p className="text-muted-foreground">
                Real-time analytics from your database
              </p>
            </div>
            <Button onClick={handleRefresh} variant="outline" data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Data
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6" data-testid={`card-stat-${index}`}>
                <div className="flex items-start gap-4">
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-6 w-6 ${stat.iconColor}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-3xl font-bold font-serif">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-xs text-muted-foreground mt-1">{stat.subtext}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Revenue Trend (Last 6 Months)</h3>
              {revenueByMonth.some((d) => d.revenue > 0) ? (
                <ResponsiveContainer width="100%" height={280}>
                  <BarChart data={revenueByMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis 
                      tick={{ fontSize: 12 }}
                      tickFormatter={(value) => formatPrice(value)}
                    />
                    <Tooltip 
                      formatter={(value: number) => [formatPrice(value), "Revenue"]}
                      labelFormatter={(label) => `Month: ${label}`}
                    />
                    <Bar dataKey="revenue" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <IndianRupee className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No revenue data available yet</p>
                  </div>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">User Growth (Last 6 Months)</h3>
              {usersByMonth.some((d) => d.users > 0) ? (
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={usersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                    <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="buyers" 
                      stroke="hsl(var(--primary))" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                    <Line 
                      type="monotone" 
                      dataKey="sellers" 
                      stroke="hsl(var(--chart-2))" 
                      strokeWidth={2}
                      dot={{ r: 4 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-64 flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <Users className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No user data available yet</p>
                  </div>
                </div>
              )}
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">User Distribution</h3>
              {userDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={userDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {userDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-muted-foreground">
                  <p>No user data</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Property Status</h3>
              {propertyDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={propertyDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {propertyDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-muted-foreground">
                  <p>No property data</p>
                </div>
              )}
            </Card>

            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Seller Verification</h3>
              {sellerDistribution.length > 0 ? (
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie
                      data={sellerDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={2}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {sellerDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-52 flex items-center justify-center text-muted-foreground">
                  <p>No seller data</p>
                </div>
              )}
            </Card>
          </div>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Key Performance Metrics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {metrics.map((metric, index) => (
                <div key={index} className="p-4 bg-muted rounded-lg" data-testid={`metric-${index}`}>
                  <div className="flex items-center gap-2 mb-2">
                    <metric.icon className="h-5 w-5 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">{metric.label}</p>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className="text-3xl font-bold">{metric.value}</p>
                    {metric.trend === "positive" && (
                      <CheckCircle className="h-4 w-4 text-green-600" />
                    )}
                    {metric.trend === "warning" && (
                      <AlertCircle className="h-4 w-4 text-yellow-600" />
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{metric.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6 mt-6">
            <h3 className="font-semibold text-lg mb-4">Quick Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 text-sm">
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Total Properties</p>
                <p className="font-bold text-lg">{properties.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Total Payments</p>
                <p className="font-bold text-lg">{payments.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Seller Profiles</p>
                <p className="font-bold text-lg">{sellerProfiles.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Subscriptions</p>
                <p className="font-bold text-lg">{subscriptions.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Inquiries</p>
                <p className="font-bold text-lg">{inquiries.length}</p>
              </div>
              <div className="p-3 bg-muted rounded-lg text-center">
                <p className="text-muted-foreground">Completed</p>
                <p className="font-bold text-lg">{payments.filter((p) => p.status === "completed").length}</p>
              </div>
            </div>
          </Card>
        </div>
      </main>
    );
}
