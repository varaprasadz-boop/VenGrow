import React, { Suspense, lazy, useEffect, useState } from "react";
import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { publicRoutes, buyerRoutes, sellerRoutes, adminRoutes, commonAuthRoutes } from "@/lib/routes";
import { Loader2 } from "lucide-react";
import AdminLayout from "@/components/layouts/AdminLayout";
import SellerLayout from "@/components/layouts/SellerLayout";
import BuyerLayout from "@/components/layouts/BuyerLayout";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { LocationProvider } from "@/contexts/LocationContext";
import { CompareProvider } from "@/contexts/CompareContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import GuestRoute from "@/components/GuestRoute";
import { useAuthStore } from "@/stores/authStore";

const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function withLayout(Component: React.ComponentType<any>, Layout: React.ComponentType<{ children: React.ReactNode }>) {
  return function WrappedComponent(props: any) {
    return (
      <Layout>
        <Component {...props} />
      </Layout>
    );
  };
}

function withProtectedRoute(Component: React.ComponentType<any>, requireAuth: boolean, roles?: string[]) {
  if (!requireAuth) {
    return Component;
  }
  
  return function ProtectedComponent(props: any) {
    // Only set requireAdmin if roles array contains ONLY "admin" (admin-only routes)
    // For routes with multiple roles (e.g., ["buyer", "admin"]), use requiredRole only
    const isAdminOnly = roles && roles.length === 1 && roles[0] === "admin";
    
    return (
      <ProtectedRoute 
        requiredRole={roles ? (roles.length === 1 ? roles[0] as any : roles as any) : undefined}
        requireAdmin={isAdminOnly}
      >
        <Component {...props} />
      </ProtectedRoute>
    );
  };
}

function withGuestRoute(Component: React.ComponentType<any>) {
  return function GuestComponent(props: any) {
    return (
      <GuestRoute>
        <Component {...props} />
      </GuestRoute>
    );
  };
}

/** Redirects /seller/property/add to the canonical create-listing path */
function RedirectSellerPropertyAddToStep1() {
  const [, setLocation] = useLocation();
  useEffect(() => {
    setLocation("/seller/listings/create/step1", { replace: true });
  }, [setLocation]);
  return <LoadingSpinner />;
}

function Router() {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const isLoading = useAuthStore((state) => state.isLoading);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const [hasInitialized, setHasInitialized] = useState(false);
  const [, setLocation] = useLocation();

  useEffect(() => {
    // Only initialize auth once on mount
    if (!hasInitialized) {
      initializeAuth().then(() => {
        setHasInitialized(true);
      });
    }
  }, [initializeAuth, hasInitialized]);

  // Monitor auth state changes - if user becomes unauthenticated, redirect to home
  useEffect(() => {
    if (hasInitialized && !isLoading && !isAuthenticated) {
      // Check if we're on a protected route
      const currentPath = window.location.pathname;
      
      // Public routes that should be accessible without auth
      const publicSellerRoutes = [
        "/seller/type",
        "/seller/register/individual",
        "/seller/register/broker",
        "/seller/register/builder",
        "/seller/register/corporate"
      ];
      
      const publicAdminRoutes = [
        "/admin/login"
      ];
      
      const isPublicSellerRoute = publicSellerRoutes.some(route => currentPath === route);
      const isPublicAdminRoute = publicAdminRoutes.some(route => currentPath === route);
      
      const isProtectedRoute = 
        currentPath.startsWith("/buyer/") ||
        (currentPath.startsWith("/seller/") && !isPublicSellerRoute) ||
        (currentPath.startsWith("/admin/") && !isPublicAdminRoute) ||
        currentPath.startsWith("/dashboard") ||
        currentPath.startsWith("/profile") ||
        currentPath.startsWith("/settings") ||
        currentPath.startsWith("/favorites") ||
        currentPath.startsWith("/inquiries");
      
      if (isProtectedRoute) {
        // Redirect to home if trying to access protected route while not authenticated
        setLocation("/");
      }
    }
  }, [hasInitialized, isLoading, isAuthenticated, setLocation]);

  // Show loading only on initial load, not after navigation
  // Once we've initialized once, don't block routes even if isLoading becomes true temporarily
  if (isLoading && !hasInitialized && !isAuthenticated) {
    return <LoadingSpinner />;
  }

  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {/* Public Routes - No sidebar */}
        {publicRoutes.map((route) => {
          // Protect login/register pages - redirect if already logged in
          const isAuthPage = route.path === "/login" || 
                            route.path === "/register" || 
                            route.path === "/admin/login";
          
          if (isAuthPage) {
            const GuestComponent = withGuestRoute(route.component as any);
            return <Route key={route.path} path={route.path} component={GuestComponent} />;
          }
          
          return <Route key={route.path} path={route.path} component={route.component as any} />;
        })}
        
        {/* Buyer Routes - With BuyerLayout sidebar */}
        {buyerRoutes.map((route) => {
          const ProtectedComponent = withProtectedRoute(
            withLayout(route.component as any, BuyerLayout),
            route.requireAuth ?? false,
            route.roles
          );
          return <Route key={route.path} path={route.path} component={ProtectedComponent} />;
        })}

        {/* Redirect legacy Add Property path to canonical create step1 */}
        <Route
          path="/seller/property/add"
          component={withProtectedRoute(
            withLayout(RedirectSellerPropertyAddToStep1, SellerLayout),
            true,
            ["seller"]
          ) as any}
        />
        
        {/* Seller Routes - With SellerLayout sidebar */}
        {sellerRoutes.map((route) => {
          const ProtectedComponent = withProtectedRoute(
            withLayout(route.component as any, SellerLayout),
            route.requireAuth ?? false,
            route.roles
          );
          return <Route key={route.path} path={route.path} component={ProtectedComponent} />;
        })}
        
        {/* Admin Routes - With AdminLayout sidebar */}
        {adminRoutes.map((route) => {
          const ProtectedComponent = withProtectedRoute(
            withLayout(route.component as any, AdminLayout),
            route.requireAuth ?? false,
            route.roles
          );
          return <Route key={route.path} path={route.path} component={ProtectedComponent} />;
        })}
        
        {/* Common Auth Routes - No sidebar (login/register pages) */}
        {commonAuthRoutes.map((route) => {
          const ProtectedComponent = withProtectedRoute(
            route.component as any,
            route.requireAuth ?? false,
            route.roles
          );
          return <Route key={route.path} path={route.path} component={ProtectedComponent} />;
        })}
        
        {/* 404 Fallback */}
        <Route component={NotFound as any} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <CompareProvider>
            <LocationProvider>
              <Toaster />
              <Router />
            </LocationProvider>
          </CompareProvider>
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
