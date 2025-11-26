import { Link } from "wouter";
import { Building2, Home, ShieldAlert } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">VenGrow</span>
            </a>
          </Link>
          
          <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <ShieldAlert className="h-16 w-16 text-destructive" />
          </div>

          <h2 className="font-serif font-bold text-3xl mb-3">
            Access Denied
          </h2>
          <p className="text-muted-foreground mb-8">
            You don't have permission to access this page. This area is restricted to authorized users only.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto" data-testid="button-home">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-login">
                Login
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
