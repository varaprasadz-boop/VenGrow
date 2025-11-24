import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UserCog } from "lucide-react";

export default function ImpersonatePage() {
  const recentImpersonations = [
    { id: "1", email: "user@example.com", date: "Nov 23, 2025", role: "Buyer" },
    { id: "2", email: "seller@example.com", date: "Nov 20, 2025", role: "Seller" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

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
            <div className="space-y-4">
              <div>
                <Label htmlFor="email">User Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="user@example.com"
                  data-testid="input-email"
                />
              </div>
              <div>
                <Label htmlFor="reason">Reason for Impersonation</Label>
                <Input
                  id="reason"
                  placeholder="Support ticket #1234"
                  data-testid="input-reason"
                />
              </div>
              <Button className="w-full" data-testid="button-impersonate">
                Start Impersonation Session
              </Button>
            </div>
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

      <Footer />
    </div>
  );
}
