import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, Heart, User, Home, ChevronDown, Plus } from "lucide-react";
import vengrowLogo from "@assets/VenGrow_Logo_Design_Trasparent_1765366039283.png";
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

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: "buyer" | "seller" | "admin";
  userId?: string;
}

const navigationLinks = [
  { label: "Buy", url: "/buy" },
  { label: "Rent", url: "/rent" },
  { label: "Sell", url: "/sell" },
  { label: "Projects", url: "/projects" },
];

const cities = [
  "Mumbai",
  "Delhi",
  "Bangalore",
  "Hyderabad",
  "Chennai",
  "Pune",
  "Kolkata",
  "Ahmedabad",
];

export default function Header({ isLoggedIn = false, userType = "buyer", userId }: HeaderProps) {
  const [selectedCity, setSelectedCity] = useState("Mumbai");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const _ = selectedCity; // City selector UI only for now

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <div className="flex items-center gap-1">
            <Link href="/" className="flex items-center hover-elevate active-elevate-2 rounded-md -ml-2 relative" data-testid="link-home">
              <img 
                src={vengrowLogo} 
                alt="VenGrow - Verified Property Market" 
                className="h-10 md:h-12 object-contain -my-2"
                data-testid="img-header-logo"
              />
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="text-muted-foreground" data-testid="dropdown-city">
                  {selectedCity}
                  <ChevronDown className="ml-1 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-40">
                {cities.map((city) => (
                  <DropdownMenuItem 
                    key={city} 
                    onClick={() => setSelectedCity(city)}
                    data-testid={`city-option-${city.toLowerCase()}`}
                  >
                    {city}
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
            <Link href="/login">
              <Button variant="outline" size="sm" data-testid="button-post-property">
                Post Property <span className="text-primary font-bold italic ml-1">FREE</span>
              </Button>
            </Link>
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
                {userType === "buyer" && (
                  <Link href="/favorites">
                    <Button variant="ghost" size="icon" data-testid="button-favorites">
                      <Heart className="h-5 w-5" />
                    </Button>
                  </Link>
                )}
                {userType === "seller" && (
                  <Link href="/seller/create-listing">
                    <Button data-testid="button-create-listing">Create Listing</Button>
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
                    <DropdownMenuItem data-testid="menu-item-dashboard">
                      <User className="mr-2 h-4 w-4" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuItem data-testid="menu-item-profile">
                      Profile
                    </DropdownMenuItem>
                    {userType === "buyer" && (
                      <DropdownMenuItem data-testid="menu-item-inquiries">
                        My Inquiries
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem data-testid="menu-item-logout">
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </nav>

          <div className="flex md:hidden items-center gap-2">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" data-testid="button-mobile-menu">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent>
                <nav className="flex flex-col gap-4 mt-8">
                  <Link href="/">
                    <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-home">
                      <Home className="mr-2 h-4 w-4" />
                      Home
                    </Button>
                  </Link>
                  
                  {navigationLinks.map((link) => (
                    <Link key={link.label} href={link.url}>
                      <Button variant="ghost" className="w-full justify-start" data-testid={`button-nav-${link.label.toLowerCase()}`}>
                        {link.label}
                      </Button>
                    </Link>
                  ))}

                  {!isLoggedIn ? (
                    <>
                      <Link href="/login">
                        <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-login">Login</Button>
                      </Link>
                      <Link href="/register">
                        <Button className="w-full" data-testid="button-nav-register">Sign Up</Button>
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link href="/dashboard">
                        <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-dashboard">
                          <User className="mr-2 h-4 w-4" />
                          Dashboard
                        </Button>
                      </Link>
                      {userType === "buyer" && (
                        <Link href="/favorites">
                          <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-favorites">
                            <Heart className="mr-2 h-4 w-4" />
                            Favorites
                          </Button>
                        </Link>
                      )}
                      <Button variant="ghost" className="w-full justify-start" data-testid="button-nav-logout">
                        Logout
                      </Button>
                    </>
                  )}
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

      </div>
    </header>
  );
}
