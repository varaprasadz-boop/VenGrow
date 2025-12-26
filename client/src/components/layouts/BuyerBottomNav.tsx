import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  Search,
  Heart,
  MessageSquare,
  User,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Dashboard", href: "/buyer/dashboard", icon: LayoutDashboard },
  { title: "Browse", href: "/properties", icon: Search },
  { title: "Favorites", href: "/buyer/favorites", icon: Heart },
  { title: "Messages", href: "/buyer/inquiries", icon: MessageSquare },
  { title: "Profile", href: "/buyer/profile", icon: User },
];

export default function BuyerBottomNav() {
  const [location] = useLocation();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-background border-t lg:hidden pb-[env(safe-area-inset-bottom)]">
      <div className="flex items-center justify-around h-16 max-w-screen-xl mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.href || 
            (item.href === "/buyer/dashboard" && (location === "/dashboard" || location === "/buyer/dashboard"));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex flex-col items-center justify-center flex-1 h-full transition-colors",
                "hover:bg-muted/50 active:bg-muted",
                isActive && "text-primary"
              )}
            >
              <item.icon
                className={cn(
                  "h-5 w-5 mb-1 transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              />
              <span
                className={cn(
                  "text-[10px] sm:text-xs font-medium transition-colors",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                {item.title}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

