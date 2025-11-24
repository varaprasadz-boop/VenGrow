import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, AlertTriangle } from "lucide-react";

export default function WithdrawFundsPage() {
  const availableBalance = 45000;
  const minWithdrawal = 1000;

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Withdraw Funds
            </h1>
            <p className="text-muted-foreground">
              Transfer your earnings to your bank account
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Withdrawal Form */}
            <div className="lg:col-span-2">
              <Card className="p-8">
                <h3 className="font-semibold text-lg mb-6">Withdrawal Details</h3>
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="amount">Withdrawal Amount (₹)</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Enter amount"
                      min={minWithdrawal}
                      max={availableBalance}
                      data-testid="input-amount"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum withdrawal: ₹{minWithdrawal.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bank">Select Bank Account</Label>
                    <Select>
                      <SelectTrigger id="bank" data-testid="select-bank">
                        <SelectValue placeholder="Choose account" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hdfc">
                          HDFC Bank - ****4242
                        </SelectItem>
                        <SelectItem value="icici">
                          ICICI Bank - ****5555
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="Add a note for this withdrawal"
                      data-testid="input-note"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6 mt-6 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold mb-2">Important Information</h4>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li>• Processing time: 1-3 business days</li>
                      <li>• Minimum withdrawal amount: ₹{minWithdrawal.toLocaleString()}</li>
                      <li>• No processing fees for withdrawals</li>
                      <li>• Ensure your bank details are correct</li>
                    </ul>
                  </div>
                </div>
              </Card>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <Card className="p-6 sticky top-8">
                <h3 className="font-semibold mb-6">Account Balance</h3>
                <div className="mb-6">
                  <p className="text-sm text-muted-foreground mb-2">
                    Available Balance
                  </p>
                  <p className="text-4xl font-bold font-serif text-primary">
                    ₹{availableBalance.toLocaleString()}
                  </p>
                </div>

                <div className="space-y-4 mb-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Withdrawal</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-medium">₹0</span>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="font-semibold">You'll Receive</span>
                    <span className="font-semibold text-lg">₹0</span>
                  </div>
                </div>

                <Button className="w-full" data-testid="button-withdraw">
                  <DollarSign className="h-4 w-4 mr-2" />
                  Withdraw Funds
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
