import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { publicRoutes, buyerRoutes, sellerRoutes, adminRoutes, commonAuthRoutes } from "@/lib/routes";
import { Loader2 } from "lucide-react";

const NotFound = lazy(() => import("@/pages/not-found"));

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {/* Public Routes */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component as any} />
        ))}
        
        {/* Buyer Routes */}
        {buyerRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component as any} />
        ))}
        
        {/* Seller Routes */}
        {sellerRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component as any} />
        ))}
        
        {/* Admin Routes */}
        {adminRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component as any} />
        ))}
        
        {/* Common Auth Routes */}
        {commonAuthRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component as any} />
        ))}
        
        {/* 404 Fallback */}
        <Route component={NotFound as any} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
