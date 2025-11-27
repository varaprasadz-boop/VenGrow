import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarHeader,
  SidebarFooter,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Home,
  Search,
  Heart,
  MessageSquare,
  Settings,
  User,
  Building,
  Plus,
  BarChart3,
  Package,
  CreditCard,
  Users,
  Shield,
  ListChecks,
  FileCheck,
  Bell,
  HelpCircle,
  LogOut,
  ChevronUp,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface NavItem {
  title: string;
  url: string;
  icon: any;
  badge?: number;
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

const buyerNavigation: NavGroup[] = [
  {
    label: "Discover",
    items: [
      { title: "Home", url: "/", icon: Home },
      { title: "Search Properties", url: "/properties", icon: Search },
      { title: "Favorites", url: "/buyer/favorites", icon: Heart },
    ],
  },
  {
    label: "Activity",
    items: [
      { title: "My Inquiries", url: "/buyer/inquiries", icon: MessageSquare },
      { title: "Messages", url: "/buyer/messages", icon: MessageSquare },
      { title: "Saved Searches", url: "/buyer/saved-searches", icon: Search },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", url: "/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Help & Support", url: "/help", icon: HelpCircle },
    ],
  },
];

const sellerNavigation: NavGroup[] = [
  {
    label: "Dashboard",
    items: [
      { title: "Overview", url: "/seller/dashboard", icon: Home },
      { title: "Analytics", url: "/seller/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Listings",
    items: [
      { title: "My Properties", url: "/seller/listings", icon: Building },
      { title: "Create Listing", url: "/seller/listings/create/step1", icon: Plus },
    ],
  },
  {
    label: "Leads",
    items: [
      { title: "Inquiries", url: "/seller/inquiries", icon: MessageSquare },
      { title: "Messages", url: "/seller/messages", icon: MessageSquare },
      { title: "Lead Management", url: "/seller/leads", icon: Users },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "My Package", url: "/seller/subscription", icon: Package },
      { title: "Payments", url: "/seller/payments", icon: CreditCard },
      { title: "Profile", url: "/seller/profile", icon: User },
      { title: "Settings", url: "/settings", icon: Settings },
    ],
  },
];

const adminNavigation: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: Home },
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
    ],
  },
  {
    label: "Moderation",
    items: [
      { title: "Property Approvals", url: "/admin/listing-moderation", icon: FileCheck },
      { title: "Seller Approvals", url: "/admin/seller-approvals", icon: ListChecks },
      { title: "Content Moderation", url: "/admin/content-moderation", icon: Shield },
    ],
  },
  {
    label: "Users",
    items: [
      { title: "User Management", url: "/admin/users", icon: Users },
      { title: "Seller Profiles", url: "/admin/sellers", icon: Building },
    ],
  },
  {
    label: "Platform",
    items: [
      { title: "Packages", url: "/admin/packages", icon: Package },
      { title: "Transactions", url: "/admin/transactions", icon: CreditCard },
      { title: "System Settings", url: "/admin/settings", icon: Settings },
      { title: "Notifications", url: "/admin/notifications", icon: Bell },
    ],
  },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { user, isAdmin, isSeller, logout } = useAuth();

  const navigation = isAdmin 
    ? adminNavigation 
    : isSeller 
      ? sellerNavigation 
      : buyerNavigation;

  const userInitials = user 
    ? `${user.firstName?.[0] || ''}${user.lastName?.[0] || user.email?.[0] || 'U'}`.toUpperCase()
    : 'U';

  const userName = user 
    ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email 
    : 'Guest';

  const userRole = isAdmin ? 'Super Admin' : isSeller ? 'Seller' : 'Buyer';

  const handleLogout = async () => {
    await logout();
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <Link href="/">
          <div className="flex items-center gap-2 cursor-pointer">
            <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
              <Building className="h-5 w-5 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="font-serif font-bold text-lg">VenGrow</span>
              <span className="text-xs text-muted-foreground">Real Estate</span>
            </div>
          </div>
        </Link>
      </SidebarHeader>

      <SidebarSeparator />

      <SidebarContent>
        {navigation.map((group) => (
          <SidebarGroup key={group.label}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {group.items.map((item) => {
                  const isActive = location === item.url || 
                    (item.url !== "/" && location.startsWith(item.url));
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton asChild isActive={isActive}>
                        <Link href={item.url}>
                          <item.icon className="h-4 w-4" />
                          <span>{item.title}</span>
                          {item.badge && item.badge > 0 && (
                            <Badge variant="secondary" className="ml-auto">
                              {item.badge}
                            </Badge>
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  );
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter className="p-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  data-testid="button-user-menu"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
                    <AvatarFallback>{userInitials}</AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight">
                    <span className="truncate font-semibold">{userName}</span>
                    <span className="truncate text-xs text-muted-foreground">{userRole}</span>
                  </div>
                  <ChevronUp className="ml-auto h-4 w-4" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56"
                side="top"
                align="start"
                sideOffset={4}
              >
                <DropdownMenuItem asChild>
                  <Link href="/profile">
                    <User className="mr-2 h-4 w-4" />
                    Profile
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">
                    <Settings className="mr-2 h-4 w-4" />
                    Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} data-testid="button-logout">
                  <LogOut className="mr-2 h-4 w-4" />
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}

export default AppSidebar;
