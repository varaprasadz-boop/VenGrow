import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";
import { useAuthStore } from "@/stores/authStore";
import { useEffect } from "react";

export interface AuthUser extends Partial<User> {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: "buyer" | "seller" | "admin";
  isSuperAdmin?: boolean;
  sellerType?: "individual" | "broker" | "builder";
}

// Legacy hook - now uses Zustand store internally but maintains API compatibility
export function useAuth() {
  const queryClient = useQueryClient();
  const { user, isLoading, isAuthenticated, isBuyer, isSeller, isAdmin, isSuperAdmin, logout: storeLogout, setUser } = useAuthStore();
  
  const { data: queryUser, isLoading: queryLoading, error, refetch } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  // Sync query data with Zustand store
  useEffect(() => {
    if (queryUser !== undefined) {
      setUser(queryUser);
    }
  }, [queryUser, setUser]);

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      await storeLogout();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return {
    user,
    isLoading: isLoading || queryLoading,
    isAuthenticated,
    isBuyer,
    isSeller,
    isAdmin,
    isSuperAdmin,
    error,
    logout,
    refetch,
  };
}
