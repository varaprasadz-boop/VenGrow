import { useEffect } from "react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "buyer" | "seller" | "admin" | ("buyer" | "seller" | "admin")[];
  requireAdmin?: boolean;
  requireSuperAdmin?: boolean;
  redirectTo?: string;
}

export default function ProtectedRoute({ 
  children, 
  requiredRole, 
  requireAdmin = false,
  requireSuperAdmin = false,
  redirectTo = "/login" 
}: ProtectedRouteProps) {
  const [, setLocation] = useLocation();
  const { user, isLoading, isAuthenticated, isAdmin, isSuperAdmin } = useAuthStore();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      // Redirect to login and prevent any further navigation
      setLocation(redirectTo);
      // Clear any stored auth data to ensure clean state
      localStorage.removeItem("user");
      localStorage.removeItem("adminUser");
    }
  }, [isLoading, isAuthenticated, toast, setLocation, redirectTo]);

  useEffect(() => {
    // Skip checks while loading
    if (isLoading) {
      return;
    }
    
    // If not authenticated, redirect (handled by first useEffect)
    if (!isAuthenticated) {
      return;
    }
    
    // Check access permissions for authenticated users
    if (requireSuperAdmin && !isSuperAdmin) {
      console.log("Access denied: requireSuperAdmin but isSuperAdmin is", isSuperAdmin, "user:", user);
      toast({
        title: "Access Denied",
        description: "This page requires Super Admin privileges.",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    if (requireAdmin && !isAdmin) {
      console.log("Access denied: requireAdmin but isAdmin is", isAdmin, "user:", user, "role:", user?.role);
      toast({
        title: "Access Denied",
        description: "This page requires Admin privileges.",
        variant: "destructive",
      });
      setLocation("/");
      return;
    }

    if (requiredRole) {
      const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
      const userRoles = Array.isArray(user?.roles) && user.roles.length > 0 ? user.roles : (user?.role ? [user.role] : []);
      const hasRole = allowedRoles.some((r) => userRoles.includes(r)) || isAdmin;

      if (!hasRole) {
        toast({
          title: "Access Denied",
          description: "You need appropriate privileges to access this page.",
          variant: "destructive",
        });
        const wantsSeller = allowedRoles.includes("seller");
        if (userRoles.includes("buyer") && wantsSeller) setLocation("/seller/type");
        else if (userRoles.includes("buyer")) setLocation("/buyer/dashboard");
        else if (userRoles.includes("seller")) setLocation("/seller/dashboard");
        else if (isAdmin) setLocation("/admin/dashboard");
        else setLocation("/");
      }
    }
  }, [isLoading, isAuthenticated, requiredRole, user?.role, user?.roles, isAdmin, isSuperAdmin, requireAdmin, requireSuperAdmin, toast, setLocation, user]);

  // Show loading spinner while auth is being checked
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If not authenticated after loading completes, don't render (redirect happens in useEffect)
  if (!isAuthenticated) {
    return null;
  }

  if (requireSuperAdmin && !isSuperAdmin) {
    return null;
  }

  if (requireAdmin && !isAdmin) {
    return null;
  }

  if (requiredRole) {
    const allowedRoles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const userRoles = Array.isArray(user?.roles) && user.roles.length > 0 ? user.roles : (user?.role ? [user.role] : []);
    const hasRole = allowedRoles.some((r) => userRoles.includes(r)) || isAdmin;
    if (!hasRole) return null;
  }

  return <>{children}</>;
}
