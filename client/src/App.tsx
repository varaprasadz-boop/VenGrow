import { Suspense, lazy } from "react";
import { Switch, Route } from "wouter";
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

function Router() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <Switch>
        {/* Public Routes - No sidebar */}
        {publicRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={route.component as any} />
        ))}
        
        {/* Buyer Routes - With BuyerLayout sidebar */}
        {buyerRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={withLayout(route.component as any, BuyerLayout)} />
        ))}
        
        {/* Seller Routes - With SellerLayout sidebar */}
        {sellerRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={withLayout(route.component as any, SellerLayout)} />
        ))}
        
        {/* Admin Routes - With AdminLayout sidebar */}
        {adminRoutes.map((route) => (
          <Route key={route.path} path={route.path} component={withLayout(route.component as any, AdminLayout)} />
        ))}
        
        {/* Common Auth Routes - No sidebar (login/register pages) */}
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
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;
