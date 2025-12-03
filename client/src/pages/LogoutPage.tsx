import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";

export default function LogoutPage() {
  const [, setLocation] = useLocation();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const performLogout = async () => {
      try {
        const adminRes = await fetch("/api/admin/logout", {
          method: "POST",
          credentials: "include",
        });

        const userRes = await fetch("/api/auth/logout", {
          method: "POST",
          credentials: "include",
        });

        localStorage.removeItem("user");
        localStorage.removeItem("adminUser");
        
        setTimeout(() => {
          setLocation("/login");
        }, 500);
      } catch (err) {
        console.error("Logout error:", err);
        setError("Failed to logout. Redirecting to login...");
        setTimeout(() => {
          setLocation("/login");
        }, 1500);
      }
    };

    performLogout();
  }, [setLocation]);

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
