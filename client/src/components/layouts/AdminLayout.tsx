import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Users, Building2, Package, CreditCard, MessageSquare, 
  Bell, Settings, Shield, FileText, BarChart3, HelpCircle, LogOut,
  ChevronDown, UserCog, ListChecks, Globe, Mail, Clock, Star,
  Database, Activity, Megaphone, Image, Quote, BadgeCheck, Heart, UserCircle
} from "lucide-react";
import vengrowLogo from "@assets/VenGrow_Logo_Design,_1765365353403.jpg";
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
  { title: "Buyers", href: "/admin/buyers", icon: Users },
  { title: "Sellers", href: "/admin/sellers", icon: Users },
  { title: "Seller Approvals", href: "/admin/seller-approvals", icon: UserCog },
  { title: "Verification Requests", href: "/admin/verifications", icon: Shield },
];

const propertyManagementItems = [
  { title: "All Properties", href: "/admin/properties", icon: Building2 },
  { title: "Property Approvals", href: "/admin/listing-moderation", icon: ListChecks },
  { title: "Pending Properties", href: "/admin/pending-properties", icon: Clock },
  { title: "Featured Properties", href: "/admin/featured", icon: Star },
];

const packageItems = [
  { title: "Package Plans", href: "/admin/packages", icon: Package },
  { title: "Transactions", href: "/admin/transactions", icon: CreditCard },
  { title: "Invoices", href: "/admin/invoices", icon: FileText },
  { title: "Invoice Settings", href: "/admin/invoice-settings", icon: Settings },
];

const communicationItems = [
  { title: "All Inquiries", href: "/admin/inquiries", icon: MessageSquare },
  { title: "Form Submissions", href: "/admin/inquiries/form", icon: FileText },
  { title: "Chat Inquiries", href: "/admin/inquiries/chat", icon: MessageSquare },
  { title: "Email Templates", href: "/admin/email-templates", icon: Mail },
];

const systemItems = [
  { title: "General Settings", href: "/admin/settings", icon: Settings },
  { title: "Map Integration", href: "/admin/settings/maps", icon: Globe },
  { title: "SMTP Settings", href: "/admin/settings/smtp", icon: Mail },
  { title: "Payment Gateway", href: "/admin/settings/razorpay", icon: CreditCard },
  { title: "Audit Logs", href: "/admin/audit-logs", icon: Database },
];

const cmsContentItems = [
  { title: "Popular Cities", href: "/admin/popular-cities", icon: Globe },
  { title: "Property Types", href: "/admin/property-types", icon: Building2 },
  { title: "Hero Slides", href: "/admin/hero-slides", icon: Image },
  { title: "Verified Builders", href: "/admin/verified-builders", icon: BadgeCheck },
  { title: "Testimonials", href: "/admin/testimonials", icon: Quote },
  { title: "Team Members", href: "/admin/team-members", icon: UserCircle },
  { title: "Company Values", href: "/admin/company-values", icon: Heart },
  { title: "FAQs", href: "/admin/faqs", icon: HelpCircle },
  { title: "Banners", href: "/admin/banners", icon: Megaphone },
  { title: "Static Pages", href: "/admin/static-pages", icon: FileText },
  { title: "Navigation Links", href: "/admin/navigation", icon: Globe },
  { title: "Site Settings", href: "/admin/site-settings", icon: Settings },
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
            <Link href="/admin/dashboard" className="flex items-center" data-testid="link-admin-home">
              <img 
                src={vengrowLogo} 
                alt="VenGrow - Verified Property Market" 
                className="h-10 object-contain"
                data-testid="img-admin-logo"
              />
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
              <NavSection title="CMS Content" items={cmsContentItems} />
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
