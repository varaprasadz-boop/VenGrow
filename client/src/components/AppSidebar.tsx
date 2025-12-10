import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import vengrowLogo from "@assets/image_1765381383406.png";
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
  MapPin,
  TrendingUp,
  Clock,
  FileText,
  Receipt,
  Phone,
  Mail,
  Globe,
  Palette,
  Database,
  Cog,
  Lock,
  ExternalLink,
  CalendarDays,
  Eye,
  CheckCircle,
  Star,
  Wallet,
  Calculator,
  History,
  Bookmark,
  Map,
  ClipboardList,
  MessagesSquare,
  Handshake,
  BadgeCheck,
  AlertCircle,
  Share2,
  Link2,
  Flag,
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
      { title: "Search Properties", url: "/listings", icon: Search },
      { title: "Map View", url: "/map", icon: Map },
    ],
  },
  {
    label: "My Properties",
    items: [
      { title: "Favorites", url: "/buyer/favorites", icon: Heart },
      { title: "Saved Searches", url: "/buyer/saved-searches", icon: Bookmark },
      { title: "Recently Viewed", url: "/buyer/recently-viewed", icon: Clock },
      { title: "Compare", url: "/buyer/compare", icon: ClipboardList },
    ],
  },
  {
    label: "Activity",
    items: [
      { title: "My Inquiries", url: "/buyer/inquiries", icon: MessageSquare },
      { title: "Messages", url: "/buyer/messages", icon: MessagesSquare },
      { title: "Property Alerts", url: "/buyer/property-alerts", icon: Bell },
      { title: "Scheduled Visits", url: "/buyer/schedule-visit", icon: CalendarDays },
    ],
  },
  {
    label: "Financial Tools",
    items: [
      { title: "Mortgage Calculator", url: "/buyer/mortgage-calculator", icon: Calculator },
      { title: "Home Valuation", url: "/buyer/home-valuation", icon: TrendingUp },
      { title: "Loan Assistance", url: "/buyer/loan-assistance", icon: Wallet },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", url: "/profile", icon: User },
      { title: "Notifications", url: "/buyer/notifications", icon: Bell },
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
      { title: "Performance", url: "/seller/performance", icon: TrendingUp },
    ],
  },
  {
    label: "Properties",
    items: [
      { title: "My Listings", url: "/seller/listings", icon: Building },
      { title: "Create Listing", url: "/seller/create-listing/step1", icon: Plus },
      { title: "Pending Approval", url: "/seller/pending-approval", icon: Clock },
      { title: "Featured Properties", url: "/seller/featured", icon: Star },
    ],
  },
  {
    label: "Leads & Inquiries",
    items: [
      { title: "All Inquiries", url: "/seller/inquiries", icon: MessageSquare },
      { title: "Form Submissions", url: "/seller/inquiries/form", icon: FileText },
      { title: "Chat Inquiries", url: "/seller/inquiries/chat", icon: MessagesSquare },
      { title: "Call Requests", url: "/seller/inquiries/call", icon: Phone },
      { title: "Messages", url: "/seller/messages", icon: Mail },
    ],
  },
  {
    label: "Subscription & Billing",
    items: [
      { title: "My Package", url: "/seller/subscription", icon: Package },
      { title: "Upgrade Plan", url: "/seller/upgrade", icon: TrendingUp },
      { title: "Payment History", url: "/seller/payments", icon: CreditCard },
      { title: "Invoices", url: "/seller/invoices", icon: Receipt },
    ],
  },
  {
    label: "Account",
    items: [
      { title: "Profile", url: "/seller/profile", icon: User },
      { title: "Business Info", url: "/seller/business-info", icon: Building },
      { title: "Verification", url: "/seller/verification", icon: BadgeCheck },
      { title: "Notifications", url: "/seller/notifications", icon: Bell },
      { title: "Settings", url: "/settings", icon: Settings },
      { title: "Help & Support", url: "/help", icon: HelpCircle },
    ],
  },
];

const adminNavigation: NavGroup[] = [
  {
    label: "Overview",
    items: [
      { title: "Dashboard", url: "/admin/dashboard", icon: Home },
      { title: "Analytics", url: "/admin/analytics", icon: BarChart3 },
      { title: "Reports", url: "/admin/reports", icon: FileText },
    ],
  },
  {
    label: "Moderation",
    items: [
      { title: "Property Approvals", url: "/admin/listing-moderation", icon: FileCheck },
      { title: "Seller Approvals", url: "/admin/seller-approvals", icon: ListChecks },
      { title: "Content Moderation", url: "/admin/content-moderation", icon: Shield },
      { title: "Review Queue", url: "/admin/review-queue", icon: ClipboardList },
    ],
  },
  {
    label: "Users & Sellers",
    items: [
      { title: "All Users", url: "/admin/users", icon: Users },
      { title: "Seller List", url: "/admin/sellers", icon: Building },
      { title: "Buyer Accounts", url: "/admin/buyers", icon: User },
      { title: "Verification Requests", url: "/admin/verifications", icon: BadgeCheck },
    ],
  },
  {
    label: "Properties",
    items: [
      { title: "All Properties", url: "/admin/properties", icon: Building },
      { title: "Featured Properties", url: "/admin/featured", icon: Star },
      { title: "Pending Properties", url: "/admin/pending-properties", icon: Clock },
      { title: "Rejected Properties", url: "/admin/rejected-properties", icon: AlertCircle },
    ],
  },
  {
    label: "Inquiries & Leads",
    items: [
      { title: "All Inquiries", url: "/admin/inquiries", icon: MessageSquare },
      { title: "Form Submissions", url: "/admin/inquiries/form", icon: FileText },
      { title: "Chat Inquiries", url: "/admin/inquiries/chat", icon: MessagesSquare },
      { title: "Call Requests", url: "/admin/inquiries/call", icon: Phone },
    ],
  },
  {
    label: "Packages & Billing",
    items: [
      { title: "Subscription Packages", url: "/admin/packages", icon: Package },
      { title: "All Transactions", url: "/admin/transactions", icon: CreditCard },
      { title: "Invoices", url: "/admin/invoices", icon: Receipt },
      { title: "Invoice Settings", url: "/admin/invoice-settings", icon: FileText },
    ],
  },
  {
    label: "Content Management",
    items: [
      { title: "Popular Cities", url: "/admin/popular-cities", icon: MapPin },
      { title: "Property Types", url: "/admin/property-types", icon: Building },
      { title: "Navigation Links", url: "/admin/navigation-links", icon: Link2 },
      { title: "Static Pages", url: "/admin/static-pages", icon: FileText },
      { title: "FAQ Management", url: "/admin/faqs", icon: HelpCircle },
      { title: "Banners", url: "/admin/banners", icon: Flag },
    ],
  },
  {
    label: "Platform Settings",
    items: [
      { title: "General Settings", url: "/admin/settings", icon: Settings },
      { title: "Site Settings", url: "/admin/site-settings", icon: Settings },
      { title: "Map Integration", url: "/admin/settings/maps", icon: MapPin },
      { title: "SMTP Settings", url: "/admin/settings/smtp", icon: Mail },
      { title: "Email Templates", url: "/admin/email-templates", icon: FileText },
      { title: "Payment Gateway", url: "/admin/settings/razorpay", icon: Wallet },
      { title: "Analytics", url: "/admin/settings/analytics", icon: BarChart3 },
      { title: "Social Links", url: "/admin/settings/social", icon: Share2 },
    ],
  },
  {
    label: "System",
    items: [
      { title: "Audit Logs", url: "/admin/audit-logs", icon: History },
      { title: "Notifications", url: "/admin/notifications", icon: Bell },
      { title: "Security", url: "/admin/security", icon: Lock },
      { title: "Database", url: "/admin/database", icon: Database },
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
          <img 
            src={vengrowLogo} 
            alt="VenGrow - Verified Property Market" 
            className="h-10 object-contain cursor-pointer"
          />
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
