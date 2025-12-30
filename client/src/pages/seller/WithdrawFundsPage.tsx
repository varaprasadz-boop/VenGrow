import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DollarSign, AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import type { Payment } from "@shared/schema";

interface BankAccount {
  id: string;
  bankName: string;
  accountNumber: string;
  ifscCode: string;
  accountHolderName: string;
}

export default function WithdrawFundsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [selectedBankId, setSelectedBankId] = useState("");
  const [note, setNote] = useState("");
  const minWithdrawal = 1000;

  const { data: payments = [], isLoading: paymentsLoading } = useQuery<Payment[]>({
    queryKey: ["/api/me/payments"],
    enabled: !!user,
  });

  const { data: bankAccounts = [], isLoading: bankAccountsLoading } = useQuery<BankAccount[]>({
    queryKey: ["/api/me/bank-accounts"],
    enabled: !!user,
  });

  const withdrawalMutation = useMutation({
    mutationFn: async (data: { amount: number; bankAccountId: string; note?: string }) => {
      return apiRequest("POST", "/api/withdrawals", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/me/payments"] });
      toast({ title: "Withdrawal request submitted successfully" });
      setAmount("");
      setSelectedBankId("");
      setNote("");
    },
    onError: () => {
      toast({ title: "Failed to submit withdrawal request", variant: "destructive" });
    },
  });

  const completedPayments = payments.filter(p => p.status === "completed");
  const availableBalance = completedPayments.reduce((sum, p) => sum + (p.amount || 0), 0);
  const withdrawalAmount = parseFloat(amount) || 0;
  const processingFee = 0; // No fees
  const amountToReceive = withdrawalAmount - processingFee;

  const handleWithdraw = () => {
    if (!amount || withdrawalAmount < minWithdrawal) {
      toast({ 
        title: `Minimum withdrawal amount is ₹${minWithdrawal.toLocaleString()}`,
        variant: "destructive" 
      });
      return;
    }
    if (withdrawalAmount > availableBalance) {
      toast({ 
        title: "Insufficient balance",
        variant: "destructive" 
      });
      return;
    }
    if (!selectedBankId) {
      toast({ 
        title: "Please select a bank account",
        variant: "destructive" 
      });
      return;
    }
    withdrawalMutation.mutate({
      amount: withdrawalAmount,
      bankAccountId: selectedBankId,
      note: note || undefined,
    });
  };

  const isLoading = paymentsLoading || bankAccountsLoading;

  if (isLoading) {
    return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Skeleton className="h-10 w-64 mb-8" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-96" />
            </div>
            <div>
              <Skeleton className="h-64" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
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
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      data-testid="input-amount"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Minimum withdrawal: ₹{minWithdrawal.toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="bank">Select Bank Account</Label>
                    {bankAccounts.length === 0 ? (
                      <div className="p-4 border rounded-lg bg-muted/50">
                        <p className="text-sm text-muted-foreground mb-2">
                          No bank accounts added. Please add a bank account first.
                        </p>
                        <Button variant="outline" size="sm" asChild>
                          <a href="/seller/settings">Add Bank Account</a>
                        </Button>
                      </div>
                    ) : (
                      <Select value={selectedBankId} onValueChange={setSelectedBankId}>
                        <SelectTrigger id="bank" data-testid="select-bank">
                          <SelectValue placeholder="Choose account" />
                        </SelectTrigger>
                        <SelectContent>
                          {bankAccounts.map((account) => (
                            <SelectItem key={account.id} value={account.id}>
                              {account.bankName} - ****{account.accountNumber.slice(-4)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>

                  <div>
                    <Label htmlFor="note">Note (Optional)</Label>
                    <Input
                      id="note"
                      placeholder="Add a note for this withdrawal"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
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
                    ₹{availableBalance.toLocaleString("en-IN")}
                  </p>
                </div>

                <div className="space-y-4 mb-6 p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Withdrawal</span>
                    <span className="font-medium">₹{withdrawalAmount.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Processing Fee</span>
                    <span className="font-medium">₹{processingFee.toLocaleString("en-IN")}</span>
                  </div>
                  <div className="pt-4 border-t flex items-center justify-between">
                    <span className="font-semibold">You'll Receive</span>
                    <span className="font-semibold text-lg">₹{amountToReceive.toLocaleString("en-IN")}</span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  data-testid="button-withdraw"
                  onClick={handleWithdraw}
                  disabled={withdrawalMutation.isPending || availableBalance === 0 || bankAccounts.length === 0}
                >
                  {withdrawalMutation.isPending ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <DollarSign className="h-4 w-4 mr-2" />
                      Withdraw Funds
                    </>
                  )}
                </Button>
              </Card>
            </div>
          </div>
        </div>
      </main>
  );
}
