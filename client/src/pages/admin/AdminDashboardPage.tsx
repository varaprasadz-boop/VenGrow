import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  Building,
  DollarSign,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Eye,
  Clock,
} from "lucide-react";

export default function AdminDashboardPage() {
  const stats = [
    {
      label: "Total Users",
      value: "52,345",
      icon: Users,
      change: "+1,234 this month",
      trend: "up",
    },
    {
      label: "Total Listings",
      value: "10,234",
      icon: Building,
      change: "+456 this month",
      trend: "up",
    },
    {
      label: "Revenue (MTD)",
      value: "₹12.5 L",
      icon: DollarSign,
      change: "+18% vs last month",
      trend: "up",
    },
    {
      label: "Active Sellers",
      value: "1,234",
      icon: TrendingUp,
      change: "+89 this month",
      trend: "up",
    },
  ];

  const pendingApprovals = [
    {
      id: "1",
      name: "Prestige Constructions",
      type: "Builder",
      date: "2 hours ago",
      documents: 5,
    },
    {
      id: "2",
      name: "Rahul Sharma",
      type: "Individual",
      date: "5 hours ago",
      documents: 3,
    },
    {
      id: "3",
      name: "Real Estate Pro",
      type: "Broker",
      date: "1 day ago",
      documents: 4,
    },
  ];

  const recentListings = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      seller: "Prestige Estates",
      price: "₹85 L",
      status: "pending",
      submittedAt: "1 hour ago",
    },
    {
      id: "2",
      title: "Commercial Office Space",
      seller: "DLF Properties",
      price: "₹1.5 Cr",
      status: "approved",
      submittedAt: "3 hours ago",
    },
    {
      id: "3",
      title: "Beautiful Villa",
      seller: "John Smith",
      price: "₹1.25 Cr",
      status: "pending",
      submittedAt: "5 hours ago",
    },
  ];

  const recentTransactions = [
    {
      id: "TXN-001",
      seller: "Prestige Estates",
      package: "Premium",
      amount: "₹2,999",
      date: "Nov 24, 2025",
      status: "completed",
    },
    {
      id: "TXN-002",
      seller: "DLF Properties",
      package: "Featured",
      amount: "₹9,999",
      date: "Nov 24, 2025",
      status: "completed",
    },
    {
      id: "TXN-003",
      seller: "Real Estate Pro",
      package: "Basic",
      amount: "₹999",
      date: "Nov 23, 2025",
      status: "refunded",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Admin Dashboard
            </h1>
            <p className="text-muted-foreground">
              Platform overview and management
            </p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-3 rounded-lg bg-primary/10">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                <div>
                  <p className="text-3xl font-bold font-serif mb-1">{stat.value}</p>
                  <p className="text-sm text-muted-foreground mb-2">{stat.label}</p>
                  <p className="text-xs text-green-600">{stat.change}</p>
                </div>
              </Card>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Column */}
            <div className="lg:col-span-2 space-y-8">
              {/* Pending Approvals */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <h2 className="font-semibold text-xl">Pending Seller Approvals</h2>
                    <Badge variant="destructive">{pendingApprovals.length}</Badge>
                  </div>
                  <Button variant="ghost" size="sm" data-testid="button-view-all-approvals">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {pendingApprovals.map((approval) => (
                    <div
                      key={approval.id}
                      className="flex items-center gap-4 p-4 rounded-lg border hover-elevate active-elevate-2"
                    >
                      <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                        <Clock className="h-5 w-5 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{approval.name}</h3>
                        <div className="flex items-center gap-3 text-sm text-muted-foreground">
                          <span>{approval.type}</span>
                          <span>•</span>
                          <span>{approval.documents} documents</span>
                          <span>•</span>
                          <span>{approval.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" data-testid={`button-approve-${approval.id}`}>
                          Approve
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-review-${approval.id}`}
                        >
                          Review
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* Recent Listings */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="font-semibold text-xl">Recent Listings</h2>
                  <Button variant="ghost" size="sm" data-testid="button-view-all-listings">
                    View All
                  </Button>
                </div>
                <div className="space-y-4">
                  {recentListings.map((listing) => (
                    <div
                      key={listing.id}
                      className="flex items-start gap-4 p-4 rounded-lg border"
                    >
                      <div className="flex-1">
                        <h3 className="font-medium mb-1">{listing.title}</h3>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                          <span>{listing.seller}</span>
                          <span>•</span>
                          <span className="font-medium text-primary">{listing.price}</span>
                          <span>•</span>
                          <span>{listing.submittedAt}</span>
                        </div>
                      </div>
                      {listing.status === "pending" ? (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Pending
                        </Badge>
                      ) : (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Approved
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Quick Actions */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">Quick Actions</h3>
                <div className="space-y-2">
                  <Button variant="outline" className="w-full justify-start" data-testid="button-manage-users">
                    <Users className="h-4 w-4 mr-2" />
                    Manage Users
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-manage-listings">
                    <Building className="h-4 w-4 mr-2" />
                    Manage Listings
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-view-transactions">
                    <DollarSign className="h-4 w-4 mr-2" />
                    View Transactions
                  </Button>
                  <Button variant="outline" className="w-full justify-start" data-testid="button-analytics">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Analytics
                  </Button>
                </div>
              </Card>

              {/* Recent Transactions */}
              <Card className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold">Recent Transactions</h3>
                  <Button variant="ghost" size="sm" data-testid="button-view-all-transactions">
                    View All
                  </Button>
                </div>
                <div className="space-y-3">
                  {recentTransactions.map((txn) => (
                    <div key={txn.id} className="text-sm">
                      <div className="flex items-start justify-between mb-1">
                        <p className="font-medium">{txn.seller}</p>
                        <p className="font-semibold text-primary">{txn.amount}</p>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground">
                        <span>{txn.package}</span>
                        <span>•</span>
                        <span>{txn.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>

              {/* System Status */}
              <Card className="p-6">
                <h3 className="font-semibold mb-4">System Status</h3>
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
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                      Active
                    </Badge>
                  </div>
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
