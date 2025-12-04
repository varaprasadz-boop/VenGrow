import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Heart, User, Home, Building2, Loader2 } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { NotificationBell } from "@/components/NotificationBell";
import { useQuery } from "@tanstack/react-query";

interface NavigationLink {
  id: string;
  label: string;
  url: string;
  position: string;
  sortOrder: number;
  isActive: boolean;
}

interface SiteSetting {
  key: string;
  value: string | null;
}

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: "buyer" | "seller" | "admin";
  userId?: string;
}

export default function Header({ isLoggedIn = false, userType = "buyer", userId }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  const { data: navigationLinks = [], isLoading: navLoading } = useQuery<NavigationLink[]>({
    queryKey: ["/api/navigation-links", "header"],
  });

  const { data: siteSettings = [], isLoading: settingsLoading } = useQuery<SiteSetting[]>({
    queryKey: ["/api/site-settings"],
    staleTime: 5 * 60 * 1000,
  });

  const getSettingValue = (key: string): string | null => {
    const setting = siteSettings.find(s => s.key === key);
    return setting?.value || null;
  };

  const siteName = getSettingValue("site_name");
  const searchPlaceholder = getSettingValue("header_search_placeholder");
  const loginText = getSettingValue("header_login_text");
  const signupText = getSettingValue("header_signup_text");
  const createListingText = getSettingValue("header_create_listing_text");
  const dashboardText = getSettingValue("header_dashboard_text");
  const profileText = getSettingValue("header_profile_text");
  const inquiriesText = getSettingValue("header_inquiries_text");
  const logoutText = getSettingValue("header_logout_text");
  const homeText = getSettingValue("header_home_text");
  const favoritesText = getSettingValue("header_favorites_text");

  const headerLinks = navigationLinks.filter(
    link => link.position === "header" && link.isActive
  ).sort((a, b) => a.sortOrder - b.sortOrder);

  if (settingsLoading) {
    return (
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2" data-testid="link-home">
            <Building2 className="h-6 w-6 text-primary" />
            {siteName && <span className="font-serif font-bold text-xl hidden sm:inline">{siteName}</span>}
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLoading ? (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            ) : headerLinks.length > 0 ? (
              headerLinks.map((link) => (
                <Link key={link.id} href={link.url}>
                  <Button variant="ghost" size="sm" data-testid={`nav-link-${link.label.toLowerCase()}`}>
                    {link.label}
                  </Button>
                </Link>
              ))
            ) : null}
          </nav>

          {searchPlaceholder && (
            <div className="hidden md:flex flex-1 max-w-md">
              <div className="relative w-full">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder={searchPlaceholder}
                  className="pl-10 w-full"
                  data-testid="input-search"
                />
              </div>
            </div>
          )}

          <nav className="hidden md:flex items-center gap-2">
            {!isLoggedIn ? (
              <>
                {loginText && (
                  <Link href="/login">
                    <Button variant="ghost" data-testid="button-login">{loginText}</Button>
                  </Link>
                )}
                {signupText && (
                  <Link href="/register">
                    <Button data-testid="button-register">{signupText}</Button>
                  </Link>
                )}
              </>
            ) : (
              <>
                {userType === "buyer" && favoritesText && (
                  <Link href="/favorites">
                    <Button variant="ghost" size="icon" data-testid="button-favorites">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {userType === "seller" && createListingText && (
                  <Link href="/seller/create-listing">
                    <Button data-testid="button-create-listing">{createListingText}</Button>
                  </Link>
                )}
                {userId && <NotificationBell userId={userId} />}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="button-user-menu">
                      <User className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-48">
                    {dashboardText && (
                      <DropdownMenuItem data-testid="menu-item-dashboard">
                        <User className="mr-2 h-4 w-4" />
                        {dashboardText}
                      </DropdownMenuItem>
                    )}
                    {profileText && (
                      <DropdownMenuItem data-testid="menu-item-profile">
                        {profileText}
                      </DropdownMenuItem>
                    )}
                    {userType === "buyer" && inquiriesText && (
                      <DropdownMenuItem data-testid="menu-item-inquiries">
                        {inquiriesText}
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    {logoutText && (
                      <DropdownMenuItem data-testid="menu-item-logout">
                        {logoutText}
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>

          <div className="flex md:hidden items-center gap-2">
            {searchPlaceholder && (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSearchOpen(!searchOpen)}
                data-testid="button-mobile-search"
              >
                <Search className="h-5 w-5" />
              </Button>
            )}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  {homeText && (
                    <Link href="/">
                      <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-home">
                        <Home className="mr-2 h-4 w-4" />
                        {homeText}
                      </Button>
                    </Link>
                  )}
                  
                  {headerLinks.map((link) => (
                    <Link key={link.id} href={link.url}>
                      <Button variant="ghost" className="w-full justify-start" data-testid={`button-nav-${link.label.toLowerCase()}`}>
                        {link.label}
                      </Button>
                    </Link>
                  ))}

                  {!isLoggedIn ? (
                    <>
                      {loginText && (
                        <Link href="/login">
                          <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-login">{loginText}</Button>
                        </Link>
                      )}
                      {signupText && (
                        <Link href="/register">
                          <Button className="w-full" data-testid="button-nav-register">{signupText}</Button>
                        </Link>
                      )}
                    </>
                  ) : (
                    <>
                      {dashboardText && (
                        <Link href="/dashboard">
                          <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-dashboard">
                            <User className="mr-2 h-4 w-4" />
                            {dashboardText}
                          </Button>
                        </Link>
                      )}
                      {userType === "buyer" && favoritesText && (
                        <Link href="/favorites">
                          <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-favorites">
                            <Heart className="mr-2 h-4 w-4" />
                            {favoritesText}
                          </Button>
                        </Link>
                      )}
                      {logoutText && (
                        <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-logout">
                          {logoutText}
                        </Button>
                      )}
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {searchOpen && searchPlaceholder && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder={searchPlaceholder}
                className="pl-10 w-full"
                data-testid="input-mobile-search"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
