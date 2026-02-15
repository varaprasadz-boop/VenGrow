import { create } from 'zustand';
import type { AuthUser } from '@/hooks/useAuth';
import { queryClient } from '@/lib/queryClient';
import { toast } from '@/hooks/use-toast';

const ACTIVE_DASHBOARD_KEY = "vengrow_active_dashboard";

export type ActiveDashboard = "buyer" | "seller";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isBuyer: boolean;
  isSeller: boolean;
  isAdmin: boolean;
  isSuperAdmin: boolean;
  activeDashboard: ActiveDashboard;

  // Actions
  setUser: (user: AuthUser | null) => void;
  setLoading: (loading: boolean) => void;
  setActiveDashboard: (view: ActiveDashboard) => void;
  clearUser: () => void;
  logout: () => Promise<void>;
  initializeAuth: () => Promise<void>;
}

function getRoles(user: AuthUser | null): string[] {
  if (!user) return [];
  if (Array.isArray(user.roles) && user.roles.length > 0) return user.roles;
  return user.role ? [user.role] : [];
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isAuthenticated: false,
  isBuyer: false,
  isSeller: false,
  isAdmin: false,
  isSuperAdmin: false,
  activeDashboard: (() => {
    if (typeof window === "undefined") return "buyer";
    const stored = localStorage.getItem(ACTIVE_DASHBOARD_KEY);
    return stored === "seller" ? "seller" : "buyer";
  })(),

  setUser: (user: AuthUser | null) => {
    const isAdminValue = !!(user && (user.role === "admin" || user.isSuperAdmin));
    const isSuperAdminValue = !!(user?.isSuperAdmin);
    const roles = getRoles(user);
    const isBuyerValue = roles.includes("buyer");
    const isSellerValue = roles.includes("seller");

    set({
      user,
      isAuthenticated: !!user,
      isBuyer: isBuyerValue,
      isSeller: isSellerValue,
      isAdmin: isAdminValue,
      isSuperAdmin: isSuperAdminValue,
    });
  },

  setActiveDashboard: (view: ActiveDashboard) => {
    if (typeof window !== "undefined") localStorage.setItem(ACTIVE_DASHBOARD_KEY, view);
    set({ activeDashboard: view });
  },

  setLoading: (loading: boolean) => {
    set({ isLoading: loading });
  },

  clearUser: () => {
    set({
      user: null,
      isAuthenticated: false,
      isBuyer: false,
      isSeller: false,
      isAdmin: false,
      isSuperAdmin: false,
    });
  },

  logout: async () => {
    try {
      // Clear user state immediately to prevent access to protected pages
      get().clearUser();
      
      // Clear all auth-related data
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      
      // Clear localStorage first
      localStorage.removeItem("user");
      localStorage.removeItem("adminUser");
      
      // Call logout endpoints to destroy server sessions
      // Use Promise.allSettled to ensure both are attempted even if one fails
      await Promise.allSettled([
        fetch("/api/logout", { 
          method: "POST", 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        }).catch(err => {
          console.error("Logout API call failed:", err);
        }),
        fetch("/api/admin/logout", { 
          method: "POST", 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        }).catch(err => {
          console.error("Admin logout API call failed:", err);
        }),
        fetch("/api/auth/logout", { 
          method: "POST", 
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          }
        }).catch(err => {
          console.error("Auth logout API call failed:", err);
        })
      ]);
      
      // Small delay to ensure session is destroyed
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Show success toast before redirect
      toast({
        title: "Logged out successfully",
        description: "You have been logged out.",
      });
      
      // Small delay to show toast before redirect
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Force redirect to home page (not login, to prevent showing login when logged out)
      window.location.href = "/";
    } catch (error) {
      console.error("Logout failed:", error);
      // Even on error, clear state and redirect
      get().clearUser();
      localStorage.removeItem("user");
      localStorage.removeItem("adminUser");
      window.location.href = "/";
    }
  },

  initializeAuth: async () => {
    get().setLoading(true);
    try {
      const response = await fetch("/api/auth/me", { credentials: "include" });
      if (response.ok) {
        const user = await response.json();
        console.log("User data from /api/auth/me:", user);
        get().setUser(user);
        const state = get();
        console.log("Auth store after setUser:", {
          isAuthenticated: state.isAuthenticated,
          isAdmin: state.isAdmin,
          isSuperAdmin: state.isSuperAdmin,
          userRole: state.user?.role,
        });
        // Sync active dashboard from current path so toggle matches route (e.g. seller on /seller/* sees "Seller")
        if (typeof window !== "undefined" && (state.isBuyer || state.isSeller)) {
          const path = window.location.pathname;
          if (path.startsWith("/seller/")) get().setActiveDashboard("seller");
          else if (path.startsWith("/buyer/") || path === "/dashboard" || path === "/favorites" || path === "/inquiries") get().setActiveDashboard("buyer");
        }
      } else {
        console.log("Auth check failed with status:", response.status);
        get().clearUser();
      }
    } catch (error) {
      console.error("Auth initialization failed:", error);
      get().clearUser();
    } finally {
      get().setLoading(false);
    }
  },
}));

