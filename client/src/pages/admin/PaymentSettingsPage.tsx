import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { CreditCard } from "lucide-react";

export default function PaymentSettingsPage() {
  return (
      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Payment Settings
            </h1>
            <p className="text-muted-foreground">
              Configure payment gateway and transaction settings
            </p>
          </div>

          <div className="space-y-6">
            {/* Razorpay Settings */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" />
                Razorpay Configuration
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="api-key">API Key ID</Label>
                  <Input
                    id="api-key"
                    placeholder="rzp_test_xxxxxxxxxxxx"
                    data-testid="input-api-key"
                  />
                </div>
                <div>
                  <Label htmlFor="api-secret">API Secret</Label>
                  <Input
                    id="api-secret"
                    type="password"
                    placeholder="••••••••••••••••"
                    data-testid="input-api-secret"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="test-mode">Test Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Use test credentials for development
                    </p>
                  </div>
                  <Switch id="test-mode" defaultChecked data-testid="switch-test-mode" />
                </div>
              </div>
            </Card>

            {/* Payment Methods */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Accepted Payment Methods</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label htmlFor="cards">Credit/Debit Cards</Label>
                  <Switch id="cards" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="upi">UPI</Label>
                  <Switch id="upi" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="netbanking">Net Banking</Label>
                  <Switch id="netbanking" defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label htmlFor="wallets">Wallets (Paytm, PhonePe, etc.)</Label>
                  <Switch id="wallets" defaultChecked />
                </div>
              </div>
            </Card>

            {/* Transaction Fees */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Transaction Fees</h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="platform-fee">Platform Fee (%)</Label>
                  <Input
                    id="platform-fee"
                    type="number"
                    defaultValue="2"
                    step="0.1"
                    data-testid="input-platform-fee"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    Percentage charged on each transaction
                  </p>
                </div>
                <div>
                  <Label htmlFor="min-transaction">Minimum Transaction Amount (₹)</Label>
                  <Input
                    id="min-transaction"
                    type="number"
                    defaultValue="100"
                    data-testid="input-min-transaction"
                  />
                </div>
              </div>
            </Card>

            <Button className="w-full" data-testid="button-save">
              Save Payment Settings
            </Button>
          </div>
        </div>
      </main>
    );
}
