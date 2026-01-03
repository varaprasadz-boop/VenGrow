import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";
import { useAuthStore } from "@/stores/authStore";

export default function LogoutPage() {
  const [error, setError] = useState<string | null>(null);
  const logout = useAuthStore((state) => state.logout);

  useEffect(() => {
    const performLogout = async () => {
      try {
        // Use the auth store logout which handles everything
        await logout();
        // logout() already redirects, so we don't need to do anything here
      } catch (err) {
        console.error("Logout error:", err);
        setError("Failed to logout. Redirecting...");
        // Even on error, redirect to home
        setTimeout(() => {
          window.location.href = "/";
        }, 1500);
      }
    };

    performLogout();
  }, [logout]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        {error ? (
          <p className="text-destructive">{error}</p>
        ) : (
          <>
            <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
            <p className="mt-4 text-muted-foreground">Logging out...</p>
          </>
        )}
      </div>
    </div>
  );
}
