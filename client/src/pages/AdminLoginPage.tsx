import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { PasswordField } from "@/components/ui/passwordinput";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuthStore } from "@/stores/authStore";

// Get store instance for direct access
const { getState: getAuthState } = useAuthStore;

export default function AdminLoginPage() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const initializeAuth = useAuthStore((state) => state.initializeAuth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await apiRequest("POST", "/api/admin/login", { email, password });
      const data = await response.json();
      
      if (data.success) {
        // Invalidate React Query cache to refetch user data
        queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
        // Re-initialize auth store with fresh data
        await initializeAuth();
        
        toast({
          title: "Welcome, Super Admin",
          description: "You have been logged in successfully.",
        });
        
        // Give auth store time to update, then navigate
        setTimeout(async () => {
          // Re-check auth state one more time before navigating
          await initializeAuth();
          const authState = getAuthState();
          console.log("Final auth check before navigation:", {
            isAuthenticated: authState.isAuthenticated,
            isAdmin: authState.isAdmin,
            isSuperAdmin: authState.isSuperAdmin,
            user: authState.user,
          });
          
          if (authState.isAuthenticated && authState.isAdmin) {
            setLocation("/admin/dashboard");
          } else {
            toast({
              title: "Please Wait",
              description: "Verifying authentication...",
            });
            // Try one more time after another short delay
            setTimeout(async () => {
              await initializeAuth();
              setLocation("/admin/dashboard");
            }, 500);
          }
        }, 200);
      } else {
        toast({
          title: "Login Failed",
          description: data.message || "Invalid credentials",
          variant: "destructive",
        });
      }
    } catch (error: any) {
      toast({
        title: "Login Failed",
        description: error.message || "Invalid email or password",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <Link href="/" className="flex items-center" data-testid="link-home">
                <div className="px-2 pt-1">
                  <img
                    src="/VenGrow.png"
                    alt="VenGrow - Verified Property Market"
                    className="h-12 md:h-14 w-auto max-w-[200px] object-contain"
                    data-testid="img-admin-login-logo"
                  />
                </div>
              </Link>
            </div>
            <CardTitle className="text-2xl">Admin Login</CardTitle>
            <CardDescription>
              Super Admin access only
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@vengrow.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  data-testid="input-admin-email"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordField
                  id="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  data-testid="input-admin-password"
                />
              </div>

              <Button 
                type="submit" 
                className="w-full" 
                disabled={isLoading}
                data-testid="button-admin-login"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Sign In as Admin
                  </span>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-4 border-t">
              <p className="text-xs text-muted-foreground text-center">
                This is a restricted area for authorized administrators only.
                <br />
                <Link href="/login" className="text-primary hover:underline">
                  Return to user login
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
