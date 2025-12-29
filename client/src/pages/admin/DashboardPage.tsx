import { useQuery } from "@tanstack/react-query";
import AdminLayout from "@/components/layouts/AdminLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Link } from "wouter";
import { 
  Users, Building2, CreditCard, TrendingUp, AlertCircle, 
  CheckCircle, Clock, Eye, ArrowUpRight, ArrowDownRight
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { SellerProfile, Payment } from "@shared/schema";

function StatCard({ 
  title, 
  value, 
  change, 
  changeType, 
  icon: Icon, 
  href 
}: { 
  title: string; 
  value: string | number; 
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  href?: string;
}) {
  const content = (
    <Card className="hover-elevate">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 gap-2">
        <CardTitle className="text-sm font-medium">{title}</CardTitle>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{value}</div>
        {change && (
          <p className={`text-xs flex items-center gap-1 mt-1 ${
            changeType === "positive" ? "text-green-600" : 
            changeType === "negative" ? "text-red-600" : 
            "text-muted-foreground"
          }`}>
            {changeType === "positive" ? <ArrowUpRight className="h-3 w-3" /> : 
             changeType === "negative" ? <ArrowDownRight className="h-3 w-3" /> : null}
            {change}
          </p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function AdminDashboardPage() {
  // Fetch pending sellers
  const { data: pendingSellers = [], isLoading: loadingSellers } = useQuery<SellerProfile[]>({
    queryKey: ["/api/sellers"],
    select: (sellers) => sellers.filter(s => s.verificationStatus === "pending").slice(0, 2),
  });

  // Fetch recent transactions
  const { data: recentTransactions = [], isLoading: loadingTransactions } = useQuery<Payment[]>({
    queryKey: ["/api/payments"],
    select: (payments) => payments
      .filter(p => p.status === "completed")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 3),
  });

  // Fetch stats
  const { data: stats, isLoading: loadingStats } = useQuery<{
    totalUsers: number;
    totalProperties: number;
    totalRevenue: number;
    pendingApprovals: number;
    activeListings: number;
    newUsersThisMonth: number;
  }>({
    queryKey: ["/api/admin/stats"],
  });

  const isLoading = loadingSellers || loadingTransactions || loadingStats;

  // Get user info for sellers
  const { data: allUsers = [] } = useQuery<any[]>({
    queryKey: ["/api/admin/users"],
    enabled: pendingSellers.length > 0,
  });

  const getUserInfo = (userId: string) => {
    const user = allUsers.find(u => u.id === userId);
    return user ? {
      name: `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown",
      email: user.email || "",
    } : { name: "Unknown", email: "" };
  };

  const getPackageName = (packageId: string | null) => {
    if (!packageId) return "Unknown Package";
    // This would ideally fetch from packages API, but for now return a placeholder
    return "Package";
  };

  return (
    <AdminLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
            <p className="text-muted-foreground">Welcome back! Here's what's happening on VenGrow.</p>
          </div>
          <Button asChild>
            <Link href="/admin/analytics" data-testid="button-view-analytics">
              View Analytics
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Total Users" 
            value={stats?.totalUsers ?? 0}
            change="+12% from last month"
            changeType="positive"
            icon={Users}
            href="/admin/users"
          />
          <StatCard 
            title="Total Properties" 
            value={stats?.totalProperties ?? 0}
            change="+8% from last month"
            changeType="positive"
            icon={Building2}
            href="/admin/properties"
          />
          <StatCard 
            title="Revenue" 
            value={`₹${((stats?.totalRevenue ?? 0) / 100000).toFixed(1)}L`}
            change="+23% from last month"
            changeType="positive"
            icon={CreditCard}
            href="/admin/transactions"
          />
          <StatCard 
            title="Pending Approvals" 
            value={stats?.pendingApprovals ?? 0}
            change="Requires attention"
            changeType="neutral"
            icon={AlertCircle}
            href="/admin/seller-approvals"
          />
        </div>

        {/* Quick Actions & Recent Activity */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Pending Seller Approvals */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Pending Seller Approvals</CardTitle>
                <CardDescription>Sellers waiting for verification</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/approvals/sellers" data-testid="button-view-all-approvals">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading...</div>
                ) : pendingSellers.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <CheckCircle className="h-8 w-8 mx-auto mb-2 text-green-500" />
                    <p>All seller registrations have been reviewed</p>
                  </div>
                ) : (
                  pendingSellers.map((seller, index) => {
                    const userInfo = getUserInfo(seller.userId);
                    return (
                      <div key={seller.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <p className="font-medium">{seller.companyName || userInfo.name}</p>
                            <p className="text-xs text-muted-foreground capitalize">{seller.sellerType} • {seller.city || "Unknown"}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline" className="text-xs">
                            <Clock className="h-3 w-3 mr-1" /> {formatDistanceToNow(new Date(seller.createdAt), { addSuffix: true })}
                          </Badge>
                          <Button 
                            size="sm" 
                            data-testid={`button-review-seller${index === 0 ? "" : `-${index + 1}`}`}
                            asChild
                          >
                            <Link href={`/admin/seller-approvals`}>Review</Link>
                          </Button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>

          {/* Recent Transactions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Recent Transactions</CardTitle>
                <CardDescription>Latest package purchases</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/admin/transactions" data-testid="button-view-all-transactions">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {isLoading ? (
                  <div className="text-center py-4 text-muted-foreground">Loading...</div>
                ) : recentTransactions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground">
                    <p>No recent transactions</p>
                  </div>
                ) : (
                  recentTransactions.map((txn) => {
                    const user = allUsers.find(u => u.id === txn.userId);
                    const userName = user ? `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.email || "Unknown" : "Unknown";
                    return (
                      <div key={txn.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">{getPackageName(txn.packageId)}</p>
                            <p className="text-xs text-muted-foreground">{userName}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium text-green-600">+₹{(txn.amount || 0).toLocaleString("en-IN")}</p>
                          <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(txn.createdAt), { addSuffix: true })}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/admin/users" data-testid="button-manage-users" className="flex flex-col items-center gap-2">
                  <Users className="h-5 w-5" />
                  <span>Manage Users</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/admin/properties" data-testid="button-manage-properties" className="flex flex-col items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>Review Properties</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/admin/packages" data-testid="button-manage-packages" className="flex flex-col items-center gap-2">
                  <CreditCard className="h-5 w-5" />
                  <span>Manage Packages</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/admin/analytics" data-testid="button-view-reports" className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>View Reports</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </AdminLayout>
  );
}
