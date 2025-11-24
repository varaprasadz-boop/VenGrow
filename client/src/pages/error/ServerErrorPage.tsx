import { Link } from "wouter";
import { Building2, Home, ServerCrash, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function ServerErrorPage() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <Link href="/">
            <a className="inline-flex items-center gap-2 mb-6">
              <Building2 className="h-8 w-8 text-primary" />
              <span className="font-serif font-bold text-2xl">PropConnect</span>
            </a>
          </Link>
          
          <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <ServerCrash className="h-16 w-16 text-destructive" />
          </div>

          <h2 className="font-serif font-bold text-3xl mb-3">
            Something Went Wrong
          </h2>
          <p className="text-muted-foreground mb-8">
            We're experiencing some technical difficulties. Our team has been notified and is working on a fix.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={handleRefresh} className="w-full sm:w-auto" data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh Page
            </Button>
            <Link href="/">
              <Button variant="outline" className="w-full sm:w-auto" data-testid="button-home">
                <Home className="h-4 w-4 mr-2" />
                Go Home
              </Button>
            </Link>
          </div>

          <p className="text-xs text-muted-foreground mt-6">
            Error Code: 500 | If the problem persists, please contact support
          </p>
        </div>
      </div>
    </div>
  );
}
