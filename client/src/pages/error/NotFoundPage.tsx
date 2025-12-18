import { Link } from "wouter";
import { Building2, Home, Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <Building2 className="h-8 w-8 text-primary" />
            <span className="font-serif font-bold text-2xl">VenGrow</span>
          </Link>
          
          <div className="relative mb-6">
            <h1 className="font-serif font-bold text-9xl text-primary/20">404</h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="h-24 w-24 text-primary" />
            </div>
          </div>

          <h2 className="font-serif font-bold text-3xl mb-3">
            Page Not Found
          </h2>
          <p className="text-muted-foreground mb-8">
            Oops! The page you're looking for doesn't exist. It might have been moved or deleted.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link href="/">
              <Button className="w-full sm:w-auto" data-testid="button-home">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
            <Link href="/listings">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-browse">
                Browse Properties
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
