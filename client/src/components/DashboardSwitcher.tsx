import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";

export function DashboardSwitcher() {
  const [location, setWouterLocation] = useLocation();
  const { isBuyer, isSeller, isAdmin, activeDashboard, setActiveDashboard, refetch } = useAuth();
  const [addingRole, setAddingRole] = useState(false);

  // Sync toggle with current route so it always shows the correct dashboard (e.g. seller sees "Seller" when on seller routes)
  useEffect(() => {
    if (!isBuyer && !isSeller) return;
    if (location.startsWith("/seller/")) setActiveDashboard("seller");
    else if (location.startsWith("/buyer/") || location === "/dashboard" || location === "/favorites" || location === "/inquiries") setActiveDashboard("buyer");
  }, [location, isBuyer, isSeller, setActiveDashboard]);

  const hasBothRoles = isBuyer && isSeller;
  const effectiveView = hasBothRoles ? activeDashboard : isSeller ? "seller" : "buyer";
  const showSwitcher = !isAdmin && (isBuyer || isSeller);

  const handleSwitchToBuyer = async () => {
    if (hasBothRoles) {
      setActiveDashboard("buyer");
      setWouterLocation("/buyer/dashboard");
      return;
    }
    setAddingRole(true);
    try {
      const res = await fetch("/api/auth/me/roles", {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addRole: "buyer" }),
      });
      if (!res.ok) throw new Error("Failed to add buyer role");
      await refetch();
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      setActiveDashboard("buyer");
      setWouterLocation("/buyer/dashboard");
    } catch (e) {
      console.error(e);
    } finally {
      setAddingRole(false);
    }
  };

  const handleSwitchToSeller = () => {
    if (hasBothRoles) {
      setActiveDashboard("seller");
      setWouterLocation("/seller/dashboard");
      return;
    }
    setWouterLocation("/seller/type");
  };

  if (!showSwitcher) return null;

  return (
    <div className="flex rounded-md border bg-muted/50 p-0.5" role="group" aria-label="Dashboard view">
      <Button
        variant={effectiveView === "buyer" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 rounded px-2.5 text-xs"
        onClick={handleSwitchToBuyer}
        disabled={addingRole}
        data-testid="dashboard-switcher-buyer"
      >
        {isBuyer && !isSeller ? "Buyer" : hasBothRoles ? "Buyer" : "Switch to Buyer"}
      </Button>
      <Button
        variant={effectiveView === "seller" ? "secondary" : "ghost"}
        size="sm"
        className="h-8 rounded px-2.5 text-xs"
        onClick={handleSwitchToSeller}
        data-testid="dashboard-switcher-seller"
      >
        {isSeller && !isBuyer ? "Seller" : hasBothRoles ? "Seller" : "Become a seller"}
      </Button>
    </div>
  );
}
