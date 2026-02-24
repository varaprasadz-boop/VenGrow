import { Link, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { 
  LayoutDashboard, Building2, Plus, Package, CreditCard, MessageSquare, 
  Bell, Settings, BarChart3, HelpCircle, LogOut, ListPlus,
  ChevronDown, Heart, Calendar, Star, FileText, Eye,
  TrendingUp, Users, Clock, ListChecks
} from "lucide-react";
import { RefreshButton } from "@/components/RefreshButton";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import type { SellerSubscription, Package as PackageType } from "@shared/schema";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DashboardSwitcher } from "@/components/DashboardSwitcher";

interface SellerLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { title: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { title: "Add Property", href: "/seller/select-form", icon: Plus },
  { title: "My Properties", href: "/seller/properties", icon: Building2 },
];

// Projects navigation - only visible for brokers and builders
const projectItems = [
  { title: "My Projects", href: "/seller/projects", icon: Building2 },
  { title: "Add Project", href: "/seller/project/add", icon: Plus },
];

// Listings section - Bulk Upload intentionally not included
const listingItems = [
  { title: "Manage Listing", href: "/seller/listings", icon: ListChecks },
];

const analyticsItems = [
  { title: "Analytics Overview", href: "/seller/analytics", icon: BarChart3 },
  { title: "Lead Performance", href: "/seller/analytics/leads", icon: TrendingUp },
];

const inquiryItems = [
  { title: "Inquiries & Leads", href: "/seller/inquiries", icon: MessageSquare },
  { title: "Scheduled Visits", href: "/seller/visits", icon: Calendar },
  { title: "Favorites", href: "/seller/favorites", icon: Heart },
];

const packageItems = [
  { title: "My Packages", href: "/seller/packages", icon: Package },
  { title: "Buy Package", href: "/seller/packages/buy", icon: ListPlus },
  { title: "Package History", href: "/seller/package-history", icon: Clock },
  { title: "Transactions", href: "/seller/transactions", icon: CreditCard },
];

const settingsItems = [
  { title: "Profile", href: "/seller/profile", icon: Users },
  { title: "Account Settings", href: "/seller/settings", icon: Settings },
  { title: "Reviews", href: "/seller/reviews", icon: Star },
  { title: "Notifications", href: "/seller/notifications", icon: Bell },
  { title: "Help Center", href: "/seller/help", icon: HelpCircle },
];

function NavSection({ title, items }: { title: string; items: typeof mainNavItems }) {
  const [location] = useLocation();
  
  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <CollapsibleTrigger asChild>
          <SidebarGroupLabel className="cursor-pointer hover:bg-sidebar-accent rounded-md px-2 py-1.5 flex items-center justify-between">
            {title}
            <ChevronDown className="h-4 w-4 transition-transform group-data-[state=closed]/collapsible:rotate-[-90deg]" />
          </SidebarGroupLabel>
        </CollapsibleTrigger>
        <CollapsibleContent>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton asChild isActive={location === item.href}>
                    <Link href={item.href} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

interface SubscriptionWithPackage extends SellerSubscription {
  package?: PackageType;
}

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [location, setLocation] = useLocation();
  const { user, logout } = useAuth();
  
  // Fetch subscription data
  const { data: subscriptionResponse, isLoading: subscriptionLoading } = useQuery<{
    success: boolean;
    subscription: SellerSubscription | null;
    package: PackageType | null;
    usage?: {
      listingsUsed: number;
      listingLimit: number;
      remainingListings: number;
      featuredUsed: number;
      featuredLimit: number;
    };
  }>({
    queryKey: ["/api/subscriptions/current"],
    enabled: !!user, // Only fetch when user is authenticated
    refetchOnMount: true, // Refetch when component mounts
    refetchOnWindowFocus: true, // Refetch when window regains focus
  });

  // Transform the API response to match the expected format
  const subscription: SubscriptionWithPackage | undefined = subscriptionResponse?.subscription && subscriptionResponse?.package
    ? {
        ...subscriptionResponse.subscription,
        package: subscriptionResponse.package,
        totalListings: subscriptionResponse.usage?.listingsUsed || subscriptionResponse.subscription.listingsUsed || 0,
        status: subscriptionResponse.subscription.isActive ? "active" : "inactive",
      }
    : undefined;

  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  // Calculate user initials
  const userInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || user.email?.[0] || 'U'}`.toUpperCase()
    : 'U';

  // Get user name
  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email 
    : 'Guest';

  // Get seller type label
  const sellerTypeLabel = user?.sellerType 
    ? user.sellerType === 'individual' ? 'Individual Seller' 
      : user.sellerType === 'broker' ? 'Broker' 
      : user.sellerType === 'builder' ? 'Builder' 
      : 'Seller'
    : 'Seller';

  // Get package info
  const packageName = subscription?.package?.name || "No Package";
  
  // Check if seller can manage projects (only brokers and builders)
  const canManageProjects = user?.sellerType && ['broker', 'builder'].includes(user.sellerType);
  const maxListings = subscription?.package?.listingLimit || subscription?.package?.maxListings || 0;
  const usedListings = subscription?.totalListings || subscriptionResponse?.usage?.listingsUsed || 0;
  const remainingListings = Math.max(0, maxListings - usedListings);
  const hasActivePackage = subscription && (subscription.status === "active" || subscription.isActive === true);

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/seller/dashboard" className="flex items-center" data-testid="link-seller-home">
              <img 
                src="/VenGrow.png" 
                alt="VenGrow - Verified Property Market" 
                className="h-10 w-auto max-w-[180px] object-contain"
                data-testid="img-seller-logo"
              />
            </Link>
          </SidebarHeader>

          <SidebarContent className="overflow-y-auto">
              {/* Main Actions */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {mainNavItems.map((item) => (
                      <SidebarMenuItem key={item.href}>
                        <SidebarMenuButton asChild isActive={location === item.href}>
                          <Link href={item.href} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                            <item.icon className="h-4 w-4" />
                            <span>{item.title}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              {/* Projects Section - Only for Brokers and Builders */}
              {canManageProjects && (
                <NavSection title="Projects" items={projectItems} />
              )}

              <NavSection title="Listings" items={listingItems.filter((item) => item.title !== "Bulk Upload")} />
              <NavSection title="Analytics" items={analyticsItems} />
              <NavSection title="Inquiries & Leads" items={inquiryItems} />
              <NavSection title="Packages & Payments" items={packageItems} />
              <NavSection title="Settings" items={settingsItems} />
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            {subscriptionLoading ? (
              <div className="mb-3 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Loading...</span>
                </div>
              </div>
            ) : hasActivePackage ? (
              <div className="mb-3 p-3 bg-primary/10 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">Active Package</span>
                  <Badge variant="secondary" className="text-xs">{packageName}</Badge>
                </div>
                <p className="text-xs text-muted-foreground">
                  {remainingListings} {remainingListings === 1 ? 'listing' : 'listings'} remaining
                </p>
                {remainingListings === 0 && (
                  <Link href="/seller/packages/buy">
                    <Button size="sm" className="w-full mt-2" data-testid="button-upgrade-package">
                      Upgrade
                    </Button>
                  </Link>
                )}
              </div>
            ) : (
              <div className="mb-3 p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">No Active Package</span>
                </div>
                <Link href="/seller/packages/buy">
                  <Button size="sm" className="w-full mt-2" data-testid="button-buy-package">
                    Buy Package
                  </Button>
                </Link>
              </div>
            )}
            
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{userName}</span>
                <span className="text-xs text-muted-foreground truncate">{sellerTypeLabel}</span>
              </div>
              <Button variant="ghost" size="icon" onClick={handleLogout} className="shrink-0" data-testid="button-logout">
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between h-14 px-4 border-b bg-background shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
              <DashboardSwitcher />
            </div>
            <div className="flex items-center gap-2">
              <RefreshButton variant="ghost" size="icon" aria-label="Refresh page data" />
              <Button variant="outline" size="sm" asChild data-testid="button-add-property-header">
                <Link href="/seller/listings/create/step1">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Property
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/seller/notifications" data-testid="button-notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/seller/settings" data-testid="button-settings">
                  <Settings className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </header>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
