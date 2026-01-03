import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuthStore } from "@/stores/authStore";
import { Loader2 } from "lucide-react";

interface GuestRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
}

/**
 * GuestRoute - Prevents logged-in users from accessing login/register pages
 * Redirects authenticated users to their dashboard
 */
export default function GuestRoute({ 
  children, 
  redirectTo 
}: GuestRouteProps) {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated, isBuyer, isSeller, isAdmin } = useAuthStore();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      // Redirect authenticated users to their appropriate dashboard
      if (isAdmin) {
        setLocation(redirectTo || "/admin/dashboard");
      } else if (isSeller) {
        setLocation(redirectTo || "/seller/dashboard");
      } else if (isBuyer) {
        setLocation(redirectTo || "/buyer/dashboard");
      } else {
        setLocation(redirectTo || "/");
      }
    }
  }, [isLoading, isAuthenticated, isBuyer, isSeller, isAdmin, setLocation, redirectTo]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // Don't render login/register pages if user is authenticated
  if (isAuthenticated) {
    return null;
  }

  return <>{children}</>;
}

