import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { User } from "@shared/schema";

export interface AuthUser extends Partial<User> {
  id: string;
  email?: string;
  firstName?: string;
  lastName?: string;
  role?: "buyer" | "seller" | "admin";
  isSuperAdmin?: boolean;
  sellerType?: "individual" | "broker" | "builder";
}

export function useAuth() {
  const queryClient = useQueryClient();
  
  const { data: user, isLoading, error, refetch } = useQuery<AuthUser>({
    queryKey: ["/api/auth/me"],
    retry: false,
  });

  const logout = async () => {
    try {
      await fetch("/api/logout", { method: "POST", credentials: "include" });
      queryClient.setQueryData(["/api/auth/me"], null);
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin" || user?.isSuperAdmin;
  const isSuperAdmin = !!user?.isSuperAdmin;

  return {
    user,
    isLoading,
    isAuthenticated: !!user && !error,
    isBuyer,
    isSeller,
    isAdmin,
    isSuperAdmin,
    error,
    logout,
    refetch,
  };
}
