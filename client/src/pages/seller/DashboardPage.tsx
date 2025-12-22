import { useQuery } from "@tanstack/react-query";
import SellerLayout from "@/components/layouts/SellerLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Link } from "wouter";
import { 
  Building2, Eye, MessageSquare, TrendingUp, Plus, 
  Clock, Calendar, ArrowUpRight, Package, Star
} from "lucide-react";

function StatCard({ 
  title, 
  value, 
  subtitle,
  icon: Icon, 
  href 
}: { 
  title: string; 
  value: string | number; 
  subtitle?: string;
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
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>
        )}
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function SellerDashboardPage() {
  const { data: stats, isLoading } = useQuery<{
    totalProperties: number;
    activeListings: number;
    totalViews: number;
    totalInquiries: number;
    newInquiries: number;
    scheduledVisits: number;
    packageInfo: { name: string; listingsUsed: number; listingsTotal: number; daysRemaining: number };
    recentInquiries: any[];
    topProperties: any[];
  }>({
    queryKey: ["/api/seller/stats"],
  });

  const packageUsage = stats?.packageInfo 
    ? (stats.packageInfo.listingsUsed / stats.packageInfo.listingsTotal) * 100 
    : 0;

  return (
    <SellerLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Seller Dashboard</h1>
            <p className="text-muted-foreground">Manage your properties and track performance.</p>
          </div>
          <Button asChild>
            <Link href="/seller/property/add" data-testid="button-add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Link>
          </Button>
        </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <StatCard 
            title="Active Listings" 
            value={stats?.activeListings ?? 0}
            subtitle="Properties currently live"
            icon={Building2}
            href="/seller/listings/active"
          />
          <StatCard 
            title="Total Views" 
            value={stats?.totalViews ?? 0}
            subtitle="+15% from last week"
            icon={Eye}
            href="/seller/analytics/views"
          />
          <StatCard 
            title="Inquiries" 
            value={stats?.totalInquiries ?? 0}
            subtitle={`${stats?.newInquiries ?? 0} new this week`}
            icon={MessageSquare}
            href="/seller/inquiries"
          />
          <StatCard 
            title="Scheduled Visits" 
            value={stats?.scheduledVisits ?? 0}
            subtitle="Upcoming property visits"
            icon={Calendar}
            href="/seller/visits"
          />
        </div>

        {/* Package Status & Quick Actions */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Package Status */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5" />
                  Package Status
                </CardTitle>
                <CardDescription>Your current subscription details</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/seller/packages/buy" data-testid="button-upgrade">
                  Upgrade
                </Link>
              </Button>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-medium">{stats?.packageInfo?.name ?? "Premium Package"}</span>
                <Badge>{stats?.packageInfo?.daysRemaining ?? 25} days left</Badge>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>Listings Used</span>
                  <span className="font-medium">
                    {stats?.packageInfo?.listingsUsed ?? 7} / {stats?.packageInfo?.listingsTotal ?? 10}
                  </span>
                </div>
                <Progress value={packageUsage || 70} className="h-2" />
              </div>
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">
                    {(stats?.packageInfo?.listingsTotal ?? 10) - (stats?.packageInfo?.listingsUsed ?? 7)}
                  </p>
                  <p className="text-xs text-muted-foreground">Listings Remaining</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-2xl font-bold text-primary">{stats?.packageInfo?.daysRemaining ?? 25}</p>
                  <p className="text-xs text-muted-foreground">Days Until Renewal</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Inquiries */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between gap-2">
              <div>
                <CardTitle>Recent Inquiries</CardTitle>
                <CardDescription>Latest messages from buyers</CardDescription>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/seller/inquiries" data-testid="button-view-all-inquiries">
                  View All
                </Link>
              </Button>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Amit Patel</p>
                    <p className="text-xs text-muted-foreground">Interested in 3BHK Apartment, Andheri</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> 30m ago
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/seller/inquiries/1" data-testid="button-reply-inquiry">Reply</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Priya Sharma</p>
                    <p className="text-xs text-muted-foreground">Wants to schedule a visit for Villa</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> 2h ago
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/seller/inquiries/2" data-testid="button-reply-inquiry-2">Reply</Link>
                    </Button>
                  </div>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <div>
                    <p className="font-medium">Rajesh Kumar</p>
                    <p className="text-xs text-muted-foreground">Asked about payment terms for plot</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Clock className="h-3 w-3 mr-1" /> 1d ago
                    </Badge>
                    <Button size="sm" variant="outline" asChild>
                      <Link href="/seller/inquiries/3" data-testid="button-reply-inquiry-3">Reply</Link>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Performing Properties */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between gap-2">
            <div>
              <CardTitle>Top Performing Properties</CardTitle>
              <CardDescription>Your properties with the most engagement</CardDescription>
            </div>
            <Button variant="outline" size="sm" asChild>
              <Link href="/seller/analytics" data-testid="button-view-analytics">
                View Analytics
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">3BHK Premium Apartment</p>
                    <p className="text-sm text-muted-foreground">Andheri West, Mumbai</p>
                    <p className="text-sm font-medium text-primary mt-1">₹1.85 Cr</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium flex items-center gap-1">
                      <Eye className="h-4 w-4" /> 245
                    </p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> 12
                    </p>
                    <p className="text-xs text-muted-foreground">Inquiries</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="h-4 w-4" /> 18%
                    </p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/seller/property/1" data-testid="button-view-property">View</Link>
                  </Button>
                </div>
              </div>
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-4">
                  <div className="h-16 w-16 bg-muted rounded-lg flex items-center justify-center">
                    <Building2 className="h-8 w-8 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Luxury Villa with Garden</p>
                    <p className="text-sm text-muted-foreground">Juhu, Mumbai</p>
                    <p className="text-sm font-medium text-primary mt-1">₹5.5 Cr</p>
                  </div>
                </div>
                <div className="flex items-center gap-6 text-sm">
                  <div className="text-center">
                    <p className="font-medium flex items-center gap-1">
                      <Eye className="h-4 w-4" /> 180
                    </p>
                    <p className="text-xs text-muted-foreground">Views</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium flex items-center gap-1">
                      <MessageSquare className="h-4 w-4" /> 8
                    </p>
                    <p className="text-xs text-muted-foreground">Inquiries</p>
                  </div>
                  <div className="text-center">
                    <p className="font-medium flex items-center gap-1 text-green-600">
                      <ArrowUpRight className="h-4 w-4" /> 15%
                    </p>
                    <p className="text-xs text-muted-foreground">Conversion</p>
                  </div>
                  <Button size="sm" asChild>
                    <Link href="/seller/property/2" data-testid="button-view-property-2">View</Link>
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3 md:grid-cols-4">
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/seller/property/add" data-testid="button-quick-add-property" className="flex flex-col items-center gap-2">
                  <Plus className="h-5 w-5" />
                  <span>Add Property</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/seller/bulk-upload" data-testid="button-bulk-upload" className="flex flex-col items-center gap-2">
                  <Building2 className="h-5 w-5" />
                  <span>Bulk Upload</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/seller/analytics" data-testid="button-quick-analytics" className="flex flex-col items-center gap-2">
                  <TrendingUp className="h-5 w-5" />
                  <span>View Analytics</span>
                </Link>
              </Button>
              <Button variant="outline" asChild className="h-auto py-4">
                <Link href="/seller/packages/buy" data-testid="button-buy-package" className="flex flex-col items-center gap-2">
                  <Package className="h-5 w-5" />
                  <span>Buy Package</span>
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </SellerLayout>
  );
}
