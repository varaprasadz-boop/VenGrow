import { Link } from "wouter";
import { Building2, Wrench, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MaintenancePage() {
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
          
          <div className="inline-flex h-32 w-32 items-center justify-center rounded-full bg-primary/10 mb-6">
            <Wrench className="h-16 w-16 text-primary" />
          </div>

          <h2 className="font-serif font-bold text-3xl mb-3">
            Under Maintenance
          </h2>
          <p className="text-muted-foreground mb-8">
            We're currently performing scheduled maintenance to improve your experience. We'll be back shortly!
          </p>

          <div className="bg-muted/50 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>Expected downtime: 2-3 hours</span>
            </div>
          </div>

          <Button variant="outline" onClick={() => window.location.reload()} data-testid="button-check-status">
            Check Status
          </Button>

          <div className="mt-8 text-sm text-muted-foreground">
            <p>For urgent inquiries, contact:</p>
            <p className="font-medium mt-1">support@propconnect.in</p>
          </div>
        </div>
      </div>
    </div>
  );
}
