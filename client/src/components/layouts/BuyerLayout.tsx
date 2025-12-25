import { Link, useLocation } from "wouter";
import { 
  LayoutDashboard, Search, Heart, MessageSquare, Bell, Settings, 
  Building2, LogOut, Scale, Eye, Calendar, MapPin, Home,
  Filter, History, Star, HelpCircle, User
} from "lucide-react";
import vengrowLogo from "@assets/VenGrow_Logo_Design_Trasparent_1765381672347.png";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface BuyerLayoutProps {
  children: React.ReactNode;
}

const mainNavItems = [
  { title: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
  { title: "Browse Properties", href: "/properties", icon: Search },
  { title: "Map View", href: "/map-search", icon: MapPin },
];

const savedItems = [
  { title: "Favorites", href: "/buyer/favorites", icon: Heart },
  { title: "Saved Searches", href: "/buyer/saved-searches", icon: Filter },
  { title: "Compare Properties", href: "/buyer/compare", icon: Scale },
  { title: "Recently Viewed", href: "/buyer/recently-viewed", icon: Eye },
  { title: "Search History", href: "/buyer/search-history", icon: History },
];

const communicationItems = [
  { title: "Messages", href: "/buyer/messages", icon: MessageSquare },
  { title: "Scheduled Visits", href: "/buyer/visits", icon: Calendar },
  { title: "Inquiries", href: "/buyer/inquiries", icon: MessageSquare },
  { title: "Notifications", href: "/buyer/notifications", icon: Bell },
];

const accountItems = [
  { title: "My Profile", href: "/buyer/profile", icon: User },
  { title: "Settings", href: "/buyer/settings", icon: Settings },
  { title: "My Reviews", href: "/buyer/reviews", icon: Star },
  { title: "Help Center", href: "/help", icon: HelpCircle },
];

const quickLinks = [
  { title: "Buy Property", href: "/buy", icon: Home },
  { title: "Lease Property", href: "/lease", icon: Building2 },
  { title: "Rent Property", href: "/rent", icon: Building2 },
];

export default function BuyerLayout({ children }: BuyerLayoutProps) {
  const [location] = useLocation();
  const { user, logout } = useAuth();
  
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

  const handleLogout = async () => {
    await logout();
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <Sidebar>
          <SidebarHeader className="border-b p-4">
            <Link href="/" className="flex items-center" data-testid="link-home">
              <img 
                src={vengrowLogo} 
                alt="VenGrow - Verified Property Market" 
                className="h-10 object-contain"
                data-testid="img-buyer-logo"
              />
            </Link>
          </SidebarHeader>

          <SidebarContent>
            <ScrollArea className="h-full">
              {/* Main Navigation */}
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

              {/* Quick Links */}
              <SidebarGroup>
                <SidebarGroupLabel>Quick Links</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {quickLinks.map((item) => (
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

              {/* Saved & Tracking */}
              <SidebarGroup>
                <SidebarGroupLabel>Saved & Tracking</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {savedItems.map((item) => (
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

              {/* Communication */}
              <SidebarGroup>
                <SidebarGroupLabel>Communication</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {communicationItems.map((item) => (
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

              {/* Account */}
              <SidebarGroup>
                <SidebarGroupLabel>Account</SidebarGroupLabel>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {accountItems.map((item) => (
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
            </ScrollArea>
          </SidebarContent>

          <SidebarFooter className="border-t p-4">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
                <AvatarFallback className="bg-primary text-primary-foreground text-xs">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="text-sm font-medium truncate">{userName}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email || ''}</span>
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
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" asChild>
                <Link href="/buyer/favorites" data-testid="button-favorites">
                  <Heart className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/buyer/notifications" data-testid="button-notifications">
                  <Bell className="h-4 w-4" />
                </Link>
              </Button>
              <Button variant="ghost" size="icon" asChild>
                <Link href="/buyer/settings" data-testid="button-settings">
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
