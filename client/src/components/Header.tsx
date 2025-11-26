import { useState } from "react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Menu, Search, Heart, User, Home, Building2 } from "lucide-react";
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

interface HeaderProps {
  isLoggedIn?: boolean;
  userType?: "buyer" | "seller" | "admin";
}

export default function Header({ isLoggedIn = false, userType = "buyer" }: HeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-2 py-1 -ml-2" data-testid="link-home">
            <Building2 className="h-6 w-6 text-primary" />
            <span className="font-serif font-bold text-xl hidden sm:inline">VenGrow</span>
          </Link>

          {/* Desktop Search */}
          <div className="hidden md:flex flex-1 max-w-xl">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by city, locality, or property type..."
                className="pl-10 w-full"
                data-testid="input-search"
              />
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-2">
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

          {/* Mobile Menu */}
          <div className="flex md:hidden items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSearchOpen(!searchOpen)}
              data-testid="button-mobile-search"
            >
              <Search className="h-5 w-5" />
            </Button>
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

        {/* Mobile Search */}
        {searchOpen && (
          <div className="md:hidden pb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search properties..."
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
