import { useState, useEffect } from "react";
import { Link, useLocation as useWouterLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Heart, User, Home, ChevronDown, Plus, LogOut, LayoutDashboard, MessageSquare, Settings, Building2, MapPin } from "lucide-react";
import { RefreshButton } from "@/components/RefreshButton";
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
import { useAuth } from "@/hooks/useAuth";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useLocation as useLocationContext, SUPPORTED_CITIES } from "@/contexts/LocationContext";
import { useQuery } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: "buyer" | "seller" | "admin";
  userId?: string;
}

const navigationLinks = [
  { label: "Buy", url: "/buy" },
  { label: "Rent", url: "/rent" },
  { label: "Projects", url: "/projects" },
];

interface PopularCity {
  id: string;
  name: string;
  state?: string;
  isActive: boolean;
}

export default function Header({ isLoggedIn: propIsLoggedIn, userType: propUserType, userId: propUserId }: HeaderProps) {
  const { user, isAuthenticated, logout, isBuyer, isSeller, isAdmin, activeDashboard, setActiveDashboard, refetch } = useAuth();
  const [location, setWouterLocation] = useWouterLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [addingRole, setAddingRole] = useState(false);

  // Sync active dashboard with current path when user has both roles
  useEffect(() => {
    if (isBuyer && isSeller && location) {
      if (location.startsWith("/seller/")) setActiveDashboard("seller");
      else if (location.startsWith("/buyer/") || location === "/dashboard" || location === "/favorites" || location === "/inquiries") setActiveDashboard("buyer");
    }
  }, [location, isBuyer, isSeller, setActiveDashboard]);
  
  // Fetch active cities from API
  const { data: apiCities = [] } = useQuery<PopularCity[]>({
    queryKey: ["/api/popular-cities"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/popular-cities");
      return response.json();
    },
  });

  // Convert API cities to LocationCity format for compatibility
  const activeApiCities = apiCities.filter(city => city.isActive).map(city => {
    // Try to find matching city in SUPPORTED_CITIES to get lat/lng, otherwise use defaults
    const matchedCity = SUPPORTED_CITIES.find(sc => sc.name === city.name);
    return {
      name: city.name,
      state: city.state || matchedCity?.state || "",
      lat: matchedCity?.lat || 0,
      lng: matchedCity?.lng || 0,
    };
  });

  // Use LocationContext for city management
  let locationContext: ReturnType<typeof useLocationContext> | null = null;
  try {
    locationContext = useLocationContext();
  } catch {
    // LocationProvider not available, use fallback
  }
  
  const selectedCity = locationContext?.selectedCity?.name || "Mumbai";
  // Use active cities from API, fallback to LocationContext, then static list
  const cities = activeApiCities.length > 0 
    ? activeApiCities 
    : (locationContext?.supportedCities || SUPPORTED_CITIES);
  
  // Use auth hook values, fall back to props for backward compatibility
  const isLoggedIn = propIsLoggedIn !== undefined ? propIsLoggedIn : isAuthenticated;
  const hasBothRoles = isBuyer && isSeller;
  const effectiveView = hasBothRoles ? activeDashboard : isSeller ? "seller" : "buyer";
  const userType = propUserType || (user?.role as "buyer" | "seller" | "admin") || "buyer";
  const userId = propUserId || user?.id;
  const showDashboardSwitcher = isLoggedIn && !isAdmin && (isBuyer || isSeller);

  const handleCitySelect = (cityName: string) => {
    if (locationContext) {
      const city = cities.find(c => c.name === cityName);
      if (city) {
        // Ensure LocationCity format with lat/lng
        const locationCity = {
          name: city.name,
          state: city.state || "",
          lat: (city as any).lat || 0,
          lng: (city as any).lng || 0,
        };
        locationContext.setSelectedCity(locationCity);
      }
    }
  };

  const handleLogout = async () => {
    await logout();
    setMobileMenuOpen(false);
  };

  const getDashboardUrl = () => {
    if (userType === "admin") return "/admin/dashboard";
    if (hasBothRoles) return activeDashboard === "seller" ? "/seller/dashboard" : "/buyer/dashboard";
    if (isSeller) return "/seller/dashboard";
    return "/buyer/dashboard";
  };

  const getProfileUrl = () => {
    if (userType === "admin") return "/admin/settings";
    if (hasBothRoles) return activeDashboard === "seller" ? "/seller/profile" : "/profile";
    if (isSeller) return "/seller/profile";
    return "/profile";
  };

  const handleSwitchToBuyer = async () => {
    if (hasBothRoles) {
      setActiveDashboard("buyer");
      setWouterLocation("/buyer/dashboard");
      setMobileMenuOpen(false);
      return;
    }
    setAddingRole(true);
    try {
      const res = await fetch("/api/auth/me/roles", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addRole: "buyer" }),
      });
      if (!res.ok) throw new Error("Failed to add buyer role");
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setActiveDashboard("buyer");
      setWouterLocation("/buyer/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setAddingRole(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSwitchToSeller = () => {
    if (hasBothRoles) {
      setActiveDashboard("seller");
      setWouterLocation("/seller/dashboard");
      setMobileMenuOpen(false);
      return;
    }
    setWouterLocation("/seller/type");
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center -ml-2 relative z-10" data-testid="link-home">
              <div className="px-2 pt-1">
                <img 
                  src="/VenGrow.png" 
                  alt="VenGrow - Verified Property Market" 
                  className="h-12 md:h-14 w-auto max-w-[200px] object-contain"
                  data-testid="img-header-logo"
                />
              </div>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="dropdown-city">
                  {selectedCity}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-48 max-h-64 overflow-y-auto">
                {cities.map((city) => (
                  <DropdownMenuItem 
                    key={city.name} 
                    onClick={() => handleCitySelect(city.name)}
                    className={selectedCity === city.name ? "bg-accent" : ""}
                    data-testid={`city-option-${city.name.toLowerCase()}`}
                  >
                    <div className="flex flex-col">
                      <span>{city.name}</span>
                      <span className="text-xs text-muted-foreground">{city.state}</span>
                    </div>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            {navigationLinks.map((link) => (
              <Link key={link.label} href={link.url}>
                <Button variant="ghost" size="sm" data-testid={`nav-link-${link.label.toLowerCase()}`}>
                  {link.label}
                </Button>
              </Link>
            ))}
          </nav>

          <nav className="hidden md:flex items-center gap-2">
            {showDashboardSwitcher && (
              <div className="flex rounded-md border bg-muted/50 p-0.5" role="group" aria-label="Dashboard view">
                <Button
                  variant={effectiveView === "buyer" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 rounded px-2.5 text-xs"
                  onClick={handleSwitchToBuyer}
                  disabled={addingRole}
                  data-testid="header-switcher-buyer"
                >
                  {isBuyer && !isSeller ? "Buyer" : hasBothRoles ? "Buyer" : "Switch to Buyer"}
                </Button>
                <Button
                  variant={effectiveView === "seller" ? "secondary" : "ghost"}
                  size="sm"
                  className="h-8 rounded px-2.5 text-xs"
                  onClick={handleSwitchToSeller}
                  data-testid="header-switcher-seller"
                >
                  {isSeller && !isBuyer ? "Seller" : hasBothRoles ? "Seller" : "Become a seller"}
                </Button>
              </div>
            )}
            <RefreshButton variant="ghost" size="icon" aria-label="Refresh page data" />
            {isSeller || !isLoggedIn ? (
              <Link href={isLoggedIn ? "/seller/property/add" : "/login"}>
                <Button variant="outline" size="sm" data-testid="button-post-property">
                  Post Property <span className="text-primary font-bold italic ml-1">FREE</span>
                </Button>
              </Link>
            ) : null}
            {!isLoggedIn ? (
              <>
                <Link href="/login">
                  <Button variant="ghost" data-testid="button-login">Login</Button>
                </Link>
                <Link href="/register">
                  <Button data-testid="button-register">Sign Up</Button>
                </Link>
              </>
            ) : (
              <>
                {isBuyer && (
                  <Link href="/favorites">
                    <Button variant="ghost" size="icon" data-testid="button-favorites">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {isSeller && (
                  <Link href="/seller/property/add">
                    <Button data-testid="button-create-listing-header">
                      <Plus className="h-4 w-4 mr-1" />
                      Add Property
                    </Button>
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
                    <div className="px-2 py-1.5 text-sm font-medium text-muted-foreground capitalize">
                      {hasBothRoles ? "Buyer & Seller" : userType + " Account"}
                    </div>
                    <DropdownMenuSeparator />
                    <Link href={getDashboardUrl()}>
                      <DropdownMenuItem data-testid="menu-item-dashboard">
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                      </DropdownMenuItem>
                    </Link>
                    <Link href={getProfileUrl()}>
                      <DropdownMenuItem data-testid="menu-item-profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </DropdownMenuItem>
                    </Link>
                    {isBuyer && (
                      <>
                        <Link href="/buyer/chat">
                          <DropdownMenuItem data-testid="menu-item-chat">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/buyer/inquiries">
                          <DropdownMenuItem data-testid="menu-item-inquiries">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            My Inquiries
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/favorites">
                          <DropdownMenuItem data-testid="menu-item-favorites">
                            <Heart className="mr-2 h-4 w-4" />
                            Favorites
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    {isSeller && (
                      <>
                        <Link href="/seller/chat">
                          <DropdownMenuItem data-testid="menu-item-chat">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Chat
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/seller/listings">
                          <DropdownMenuItem data-testid="menu-item-listings">
                            <Building2 className="mr-2 h-4 w-4" />
                            My Listings
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/seller/leads">
                          <DropdownMenuItem data-testid="menu-item-leads">
                            <MessageSquare className="mr-2 h-4 w-4" />
                            Leads
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    {userType === "admin" && (
                      <>
                        <Link href="/admin/users">
                          <DropdownMenuItem data-testid="menu-item-users">
                            <User className="mr-2 h-4 w-4" />
                            User Management
                          </DropdownMenuItem>
                        </Link>
                        <Link href="/admin/listing-moderation">
                          <DropdownMenuItem data-testid="menu-item-moderation">
                            <Building2 className="mr-2 h-4 w-4" />
                            Moderation
                          </DropdownMenuItem>
                        </Link>
                      </>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} data-testid="menu-item-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <RefreshButton variant="ghost" size="icon" aria-label="Refresh page data" />
            {isLoggedIn && userId && <NotificationBell userId={userId} />}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent className="flex flex-col h-full p-0">
                <div className="flex-1 overflow-y-auto">
                  <ScrollArea className="h-full">
                    <nav className="flex flex-col gap-2 p-6 pt-12">
                      {isLoggedIn && (
                        <div className="mb-4 pb-4 border-b">
                          <p className="text-sm text-muted-foreground mb-1">Logged in as</p>
                          <p className="font-medium capitalize">{hasBothRoles ? "Buyer & Seller" : userType}</p>
                          {user?.email && (
                            <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                          )}
                          {showDashboardSwitcher && (
                            <div className="flex gap-1 mt-2">
                              <Button
                                variant={effectiveView === "buyer" ? "secondary" : "outline"}
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={handleSwitchToBuyer}
                                disabled={addingRole}
                              >
                                {hasBothRoles ? "Buyer" : "Switch to Buyer"}
                              </Button>
                              <Button
                                variant={effectiveView === "seller" ? "secondary" : "outline"}
                                size="sm"
                                className="flex-1 text-xs"
                                onClick={handleSwitchToSeller}
                              >
                                {hasBothRoles ? "Seller" : "Become a seller"}
                              </Button>
                            </div>
                          )}
                        </div>
                      )}
                      
                      <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                        <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-home">
                          <Home className="mr-2 h-4 w-4" />
                          Home
                        </Button>
                      </Link>
                      
                      {navigationLinks.map((link) => (
                        <Link key={link.label} href={link.url} onClick={() => setMobileMenuOpen(false)}>
                          <Button variant="ghost" className="w-full justify-start" data-testid={`button-nav-${link.label.toLowerCase()}`}>
                            {link.label}
                          </Button>
                        </Link>
                      ))}

                      <div className="my-2 border-t pt-2" />
                      
                      {/* City Selection */}
                      <div className="px-2 py-1">
                        <p className="text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          Select City
                        </p>
                        <div className="grid grid-cols-2 gap-1">
                          {cities.slice(0, 8).map((city) => (
                            <Button
                              key={city.name}
                              variant={selectedCity === city.name ? "default" : "outline"}
                              size="sm"
                              className="w-full text-xs"
                              onClick={() => handleCitySelect(city.name)}
                            >
                              {city.name}
                            </Button>
                          ))}
                        </div>
                        {locationContext && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="w-full mt-2 text-xs text-muted-foreground"
                            onClick={() => locationContext.setShowCityPicker(true)}
                          >
                            View All Cities
                          </Button>
                        )}
                      </div>

                      <div className="my-2 border-t pt-2" />

                      {!isLoggedIn ? (
                        <>
                          <Link href="/login" onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-login">Login</Button>
                          </Link>
                          <Link href="/register" onClick={() => setMobileMenuOpen(false)}>
                            <Button className="w-full" data-testid="button-nav-register">Sign Up</Button>
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link href={getDashboardUrl()} onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-dashboard">
                              <LayoutDashboard className="mr-2 h-4 w-4" />
                              Dashboard
                            </Button>
                          </Link>
                          
                          {isBuyer && (
                            <>
                              <Link href="/buyer/chat" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-chat">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Chat
                                </Button>
                              </Link>
                              <Link href="/favorites" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-favorites">
                                  <Heart className="mr-2 h-4 w-4" />
                                  Favorites
                                </Button>
                              </Link>
                              <Link href="/buyer/inquiries" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-inquiries">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  My Inquiries
                                </Button>
                              </Link>
                              <Link href="/buyer/visits" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  Scheduled Visits
                                </Button>
                              </Link>
                            </>
                          )}
                          
                          {isSeller && (
                            <>
                              <Link href="/seller/chat" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Chat
                                </Button>
                              </Link>
                              <Link href="/seller/listings" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  <Building2 className="mr-2 h-4 w-4" />
                                  My Listings
                                </Button>
                              </Link>
                              <Link href="/seller/property/add" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  <Plus className="mr-2 h-4 w-4" />
                                  Add Property
                                </Button>
                              </Link>
                              <Link href="/seller/leads" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  <MessageSquare className="mr-2 h-4 w-4" />
                                  Leads
                                </Button>
                              </Link>
                            </>
                          )}
                          
                          {userType === "admin" && (
                            <>
                              <Link href="/admin/users" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  <User className="mr-2 h-4 w-4" />
                                  User Management
                                </Button>
                              </Link>
                              <Link href="/admin/listing-moderation" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  <Building2 className="mr-2 h-4 w-4" />
                                  Property Moderation
                                </Button>
                              </Link>
                              <Link href="/admin/projects" onClick={() => setMobileMenuOpen(false)}>
                                <Button variant="ghost" className="w-full justify-start">
                                  Project Moderation
                                </Button>
                              </Link>
                            </>
                          )}
                          
                          <Link href={getProfileUrl()} onClick={() => setMobileMenuOpen(false)}>
                            <Button variant="ghost" className="w-full justify-start">
                              <Settings className="mr-2 h-4 w-4" />
                              Settings
                            </Button>
                          </Link>
                          
                          <div className="my-2 border-t pt-2" />
                          
                          <Button 
                            variant="ghost" 
                            className="w-full justify-start text-destructive hover:text-destructive" 
                            onClick={handleLogout}
                            data-testid="button-nav-logout"
                          >
                            <LogOut className="mr-2 h-4 w-4" />
                            Logout
                          </Button>
                        </>
                      )}
                    </nav>
                  </ScrollArea>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}
