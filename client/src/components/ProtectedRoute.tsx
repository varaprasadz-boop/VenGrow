import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

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
  const { user, isLoading, isAuthenticated, isAdmin, isSuperAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to access this page.",
        variant: "destructive",
      });
      setLocation(redirectTo);
    }
  }, [isLoading, isAuthenticated, toast, setLocation, redirectTo]);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      if (requireSuperAdmin && !isSuperAdmin) {
        toast({
          title: "Access Denied",
          description: "This page requires Super Admin privileges.",
          variant: "destructive",
        });
        setLocation("/");
        return;
      }

      if (requireAdmin && !isAdmin) {
        toast({
          title: "Access Denied",
          description: "This page requires Admin privileges.",
          variant: "destructive",
        });
        setLocation("/");
        return;
      }

      if (requiredRole) {
        const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
        const hasRole = roles.includes(user?.role as any) || isAdmin;
        
        if (!hasRole) {
          toast({
            title: "Access Denied",
            description: `You need appropriate privileges to access this page.`,
            variant: "destructive",
          });
          
          if (user?.role === "buyer") {
            setLocation("/buyer/dashboard");
          } else if (user?.role === "seller") {
            setLocation("/seller/dashboard");
          } else if (isAdmin) {
            setLocation("/admin/dashboard");
          } else {
            setLocation("/");
          }
        }
      }
    }
  }, [isLoading, isAuthenticated, requiredRole, user?.role, isAdmin, isSuperAdmin, requireAdmin, requireSuperAdmin, toast, setLocation]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

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
    const roles = Array.isArray(requiredRole) ? requiredRole : [requiredRole];
    const hasRole = roles.includes(user?.role as any) || isAdmin;
    if (!hasRole) {
      return null;
    }
  }

  return <>{children}</>;
}
