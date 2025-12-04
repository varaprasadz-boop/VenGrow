import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Building2, Plus, Package, CreditCard, MessageSquare, 
  Bell, Settings, BarChart3, HelpCircle, LogOut, ListPlus,
  ChevronDown, Heart, Calendar, Star, FileText, Upload, Eye,
  TrendingUp, Users, Clock, Wallet
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
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

interface SellerLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { title: "Dashboard", href: "/seller/dashboard", icon: LayoutDashboard },
  { title: "Add Property", href: "/seller/property/add", icon: Plus },
  { title: "My Properties", href: "/seller/properties", icon: Building2 },
];

const listingItems = [
  { title: "Active Listings", href: "/seller/listings/active", icon: Eye },
  { title: "Pending Review", href: "/seller/listings/pending", icon: Clock },
  { title: "Drafts", href: "/seller/listings/drafts", icon: FileText },
  { title: "Expired", href: "/seller/listings/expired", icon: Calendar },
  { title: "Bulk Upload", href: "/seller/bulk-upload", icon: Upload },
];

const analyticsItems = [
  { title: "Analytics Overview", href: "/seller/analytics", icon: BarChart3 },
  { title: "Property Views", href: "/seller/analytics/views", icon: Eye },
  { title: "Lead Performance", href: "/seller/analytics/leads", icon: TrendingUp },
  { title: "Conversion Insights", href: "/seller/analytics/conversion", icon: TrendingUp },
];

const inquiryItems = [
  { title: "All Inquiries", href: "/seller/inquiries", icon: MessageSquare },
  { title: "New Leads", href: "/seller/inquiries/new", icon: Users },
  { title: "Scheduled Visits", href: "/seller/visits", icon: Calendar },
  { title: "Favorites", href: "/seller/favorites", icon: Heart },
];

const packageItems = [
  { title: "My Packages", href: "/seller/packages", icon: Package },
  { title: "Buy Package", href: "/seller/packages/buy", icon: ListPlus },
  { title: "Package History", href: "/seller/package-history", icon: Clock },
  { title: "Wallet", href: "/seller/wallet", icon: Wallet },
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

export default function SellerLayout({ children }: SellerLayoutProps) {
  const [location] = useLocation();
  
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/seller/dashboard" className="flex items-center gap-3" data-testid="link-seller-home">
              <img 
                src="/favicon.png" 
                alt="VenGrow" 
                className="h-8 w-8 object-contain"
                data-testid="img-seller-logo"
              />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg">VenGrow</span>
                <span className="text-xs text-muted-foreground">Seller Portal</span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <ScrollArea className="h-full">
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

              <NavSection title="Listings" items={listingItems} />
              <NavSection title="Analytics" items={analyticsItems} />
              <NavSection title="Inquiries & Leads" items={inquiryItems} />
              <NavSection title="Packages & Payments" items={packageItems} />
              <NavSection title="Settings" items={settingsItems} />
            </ScrollArea>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="mb-3 p-3 bg-primary/10 rounded-lg">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium">Active Package</span>
                <Badge variant="secondary" className="text-xs">Premium</Badge>
              </div>
              <p className="text-xs text-muted-foreground">3 listings remaining</p>
              <Link href="/seller/packages/buy">
                <Button size="sm" className="w-full mt-2" data-testid="button-upgrade-package">
                  Upgrade
                </Button>
              </Link>
            </div>
            
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">RS</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">Rajesh Sharma</span>
                <span className="text-xs text-muted-foreground truncate">Individual Seller</span>
              </div>
              <Button variant="ghost" size="icon" asChild className="shrink-0">
                <Link href="/logout" data-testid="button-logout">
                  <LogOut className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </SidebarFooter>
        </Sidebar>

        <div className="flex flex-col flex-1 overflow-hidden">
          <header className="flex items-center justify-between h-14 px-4 border-b bg-background shrink-0">
            <div className="flex items-center gap-2">
              <SidebarTrigger data-testid="button-sidebar-toggle" />
            </div>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" asChild>
                <Link href="/seller/property/add" data-testid="button-add-property-header">
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
