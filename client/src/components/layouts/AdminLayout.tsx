import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, Building2, Package, CreditCard, MessageSquare, 
  Bell, Settings, Shield, FileText, BarChart3, HelpCircle, LogOut,
  ChevronDown, UserCog, ListChecks, AlertTriangle, Globe, Mail,
  Database, Activity, Megaphone, Flag
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

interface AdminLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { title: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboard },
  { title: "Analytics", href: "/admin/analytics", icon: BarChart3 },
  { title: "Activity Log", href: "/admin/activity", icon: Activity },
];

const userManagementItems = [
  { title: "All Users", href: "/admin/users", icon: Users },
  { title: "Buyers", href: "/admin/users/buyers", icon: Users },
  { title: "Sellers", href: "/admin/users/sellers", icon: Users },
  { title: "Seller Approvals", href: "/admin/approvals/sellers", icon: UserCog },
  { title: "KYC Verification", href: "/admin/kyc-verification", icon: Shield },
  { title: "Suspended Users", href: "/admin/users/suspended", icon: AlertTriangle },
];

const propertyManagementItems = [
  { title: "All Properties", href: "/admin/properties", icon: Building2 },
  { title: "Pending Review", href: "/admin/properties/pending", icon: ListChecks },
  { title: "Reported Properties", href: "/admin/properties/reported", icon: Flag },
  { title: "Featured Properties", href: "/admin/properties/featured", icon: Building2 },
];

const packageItems = [
  { title: "Package Plans", href: "/admin/packages", icon: Package },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "Payment Settings", href: "/admin/payments/settings", icon: CreditCard },
  { title: "Revenue Report", href: "/admin/revenue", icon: BarChart3 },
];

const communicationItems = [
  { title: "Messages", href: "/admin/messages", icon: MessageSquare },
  { title: "Notifications", href: "/admin/notifications", icon: Bell },
  { title: "Email Templates", href: "/admin/emails", icon: Mail },
  { title: "Announcements", href: "/admin/announcements", icon: Megaphone },
];

const systemItems = [
  { title: "Settings", href: "/admin/settings", icon: Settings },
  { title: "Content Pages", href: "/admin/pages", icon: FileText },
  { title: "SEO Settings", href: "/admin/seo", icon: Globe },
  { title: "Database", href: "/admin/database", icon: Database },
  { title: "Support", href: "/admin/support", icon: HelpCircle },
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

export default function AdminLayout({ children }: AdminLayoutProps) {
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/admin/dashboard" className="flex items-center gap-2" data-testid="link-admin-home">
              <Building2 className="h-6 w-6 text-primary" />
              <div className="flex flex-col">
                <span className="font-serif font-bold text-lg">VenGrow</span>
                <span className="text-xs text-muted-foreground">Admin Panel</span>
              </div>
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <ScrollArea className="h-full">
              {/* Main */}
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {mainNavItems.map((item) => {
                      const [location] = useLocation();
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton asChild isActive={location === item.href}>
                            <Link href={item.href} data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                              <item.icon className="h-4 w-4" />
                              <span>{item.title}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>

              <NavSection title="User Management" items={userManagementItems} />
              <NavSection title="Properties" items={propertyManagementItems} />
              <NavSection title="Packages & Payments" items={packageItems} />
              <NavSection title="Communication" items={communicationItems} />
              <NavSection title="System" items={systemItems} />
            </ScrollArea>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src="" />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">SA</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">Super Admin</span>
                <span className="text-xs text-muted-foreground truncate">admin@vengrow.in</span>
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
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/notifications" data-testid="button-notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/admin/settings" data-testid="button-settings">
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
