import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCog, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { validateEmail } from "@/utils/validation";

export default function ImpersonatePage() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [reason, setReason] = useState("");
  
  const impersonateMutation = useMutation({
    mutationFn: async (data: { email: string; reason: string }) => {
      return apiRequest("POST", "/api/admin/impersonate", data);
    },
    onSuccess: () => {
      toast({
        title: "Impersonation started",
        description: "You are now viewing as the selected user.",
      });
      setEmail("");
      setReason("");
      // Reload page to switch user context
      window.location.reload();
    },
    onError: (error: any) => {
      const errorMessage = error?.response?.data?.error || error?.message || "Failed to start impersonation";
      toast({
        title: "Impersonation failed",
        description: errorMessage,
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Email required",
        description: "Please enter a user email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!validateEmail(email.trim())) {
      toast({
        title: "Invalid email format",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }
    
    if (!reason.trim()) {
      toast({
        title: "Reason required",
        description: "Please provide a reason for impersonation.",
        variant: "destructive",
      });
      return;
    }
    
    impersonateMutation.mutate({
      email: email.trim(),
      reason: reason.trim(),
    });
  };

  const recentImpersonations = [
    { id: "1", email: "user@example.com", date: "Nov 23, 2025", role: "Buyer" },
    { id: "2", email: "seller@example.com", date: "Nov 20, 2025", role: "Seller" },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <UserCog className="h-8 w-8 text-primary" />
              Impersonate User
            </h1>
            <p className="text-muted-foreground">
              Access platform as another user for support
            </p>
          </div>

          <Card className="p-6 mb-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">⚠️ Important</h3>
            <p className="text-sm text-muted-foreground">
              This feature should only be used for legitimate support purposes. All
              impersonation sessions are logged and audited.
            </p>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Impersonate User</h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="email">User Email *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  data-testid="input-email"
                  required
                  aria-required="true"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason for Impersonation *</Label>
                <Input
                  id="reason"
                  placeholder="Support ticket #1234"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  data-testid="input-reason"
                  required
                  aria-required="true"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full" 
                disabled={impersonateMutation.isPending}
                data-testid="button-impersonate"
              >
                {impersonateMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Starting...
                  </>
                ) : (
                  "Start Impersonation Session"
                )}
              </Button>
            </form>
          </Card>

          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Recent Impersonations</h3>
            <div className="space-y-3">
              {recentImpersonations.map((session) => (
                <div
                  key={session.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium mb-1">{session.email}</p>
                    <div className="flex items-center gap-3 text-sm text-muted-foreground">
                      <span>{session.role}</span>
                      <span>•</span>
                      <span>{session.date}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </main>
    );
}
