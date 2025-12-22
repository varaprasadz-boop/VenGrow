import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  FileText,
  Building,
  Save,
  RefreshCw,
  AlertCircle,
  Receipt,
} from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";

interface InvoiceSettings {
  id: string;
  companyName: string;
  companyAddress: string | null;
  gstin: string | null;
  pan: string | null;
  logo: string | null;
  footerText: string | null;
  bankDetails: {
    bankName?: string;
    accountNumber?: string;
    ifscCode?: string;
    accountHolder?: string;
  } | null;
  termsAndConditions: string | null;
  invoicePrefix: string;
  nextInvoiceNumber: number;
}

export default function InvoiceSettingsPage() {
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<InvoiceSettings>>({
    companyName: "VenGrow Real Estate Pvt. Ltd.",
    companyAddress: "",
    gstin: "",
    pan: "",
    footerText: "",
    invoicePrefix: "VG",
    nextInvoiceNumber: 1,
    bankDetails: {
      bankName: "",
      accountNumber: "",
      ifscCode: "",
      accountHolder: "",
    },
    termsAndConditions: "",
  });

  const { data: settings, isLoading, isError, refetch } = useQuery<InvoiceSettings>({
    queryKey: ["/api/admin/invoice-settings"],
  });

  useEffect(() => {
    if (settings) {
      setFormData(settings);
    }
  }, [settings]);

  const saveMutation = useMutation({
    mutationFn: async (data: Partial<InvoiceSettings>) => {
      return apiRequest("PUT", "/api/admin/invoice-settings", data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/invoice-settings"] });
      toast({
        title: "Settings Saved",
        description: "Invoice settings have been updated successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save invoice settings.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    saveMutation.mutate(formData);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Settings</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the invoice settings.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Invoice Settings
            </h1>
            <p className="text-muted-foreground">
              Configure your company details and invoice preferences
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Building className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Company Details</h2>
                    <p className="text-sm text-muted-foreground">
                      These details will appear on all invoices
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <Label htmlFor="companyName">Company Name *</Label>
                    <Input
                      id="companyName"
                      value={formData.companyName || ""}
                      onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                      placeholder="Your Company Name"
                      required
                      data-testid="input-company-name"
                    />
                  </div>
                  <div className="md:col-span-2">
                    <Label htmlFor="companyAddress">Company Address</Label>
                    <Textarea
                      id="companyAddress"
                      value={formData.companyAddress || ""}
                      onChange={(e) => setFormData({ ...formData, companyAddress: e.target.value })}
                      placeholder="Enter full company address"
                      rows={3}
                      data-testid="input-company-address"
                    />
                  </div>
                  <div>
                    <Label htmlFor="gstin">GSTIN</Label>
                    <Input
                      id="gstin"
                      value={formData.gstin || ""}
                      onChange={(e) => setFormData({ ...formData, gstin: e.target.value })}
                      placeholder="e.g., 22AAAAA0000A1Z5"
                      data-testid="input-gstin"
                    />
                  </div>
                  <div>
                    <Label htmlFor="pan">PAN</Label>
                    <Input
                      id="pan"
                      value={formData.pan || ""}
                      onChange={(e) => setFormData({ ...formData, pan: e.target.value })}
                      placeholder="e.g., AAAAA0000A"
                      data-testid="input-pan"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Receipt className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Invoice Numbering</h2>
                    <p className="text-sm text-muted-foreground">
                      Configure invoice number format
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="invoicePrefix">Invoice Prefix</Label>
                    <Input
                      id="invoicePrefix"
                      value={formData.invoicePrefix || ""}
                      onChange={(e) => setFormData({ ...formData, invoicePrefix: e.target.value })}
                      placeholder="e.g., VG"
                      data-testid="input-invoice-prefix"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Preview: {formData.invoicePrefix}-{String(formData.nextInvoiceNumber || 1).padStart(5, '0')}
                    </p>
                  </div>
                  <div>
                    <Label htmlFor="nextInvoiceNumber">Next Invoice Number</Label>
                    <Input
                      id="nextInvoiceNumber"
                      type="number"
                      value={formData.nextInvoiceNumber || 1}
                      onChange={(e) => setFormData({ ...formData, nextInvoiceNumber: parseInt(e.target.value) || 1 })}
                      min={1}
                      data-testid="input-next-number"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Bank Details</h2>
                    <p className="text-sm text-muted-foreground">
                      Bank account details for payment
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="bankName">Bank Name</Label>
                    <Input
                      id="bankName"
                      value={formData.bankDetails?.bankName || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, bankName: e.target.value }
                      })}
                      placeholder="e.g., HDFC Bank"
                      data-testid="input-bank-name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountHolder">Account Holder Name</Label>
                    <Input
                      id="accountHolder"
                      value={formData.bankDetails?.accountHolder || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, accountHolder: e.target.value }
                      })}
                      placeholder="Account holder name"
                      data-testid="input-account-holder"
                    />
                  </div>
                  <div>
                    <Label htmlFor="accountNumber">Account Number</Label>
                    <Input
                      id="accountNumber"
                      value={formData.bankDetails?.accountNumber || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, accountNumber: e.target.value }
                      })}
                      placeholder="e.g., 1234567890"
                      data-testid="input-account-number"
                    />
                  </div>
                  <div>
                    <Label htmlFor="ifscCode">IFSC Code</Label>
                    <Input
                      id="ifscCode"
                      value={formData.bankDetails?.ifscCode || ""}
                      onChange={(e) => setFormData({
                        ...formData,
                        bankDetails: { ...formData.bankDetails, ifscCode: e.target.value }
                      })}
                      placeholder="e.g., HDFC0001234"
                      data-testid="input-ifsc-code"
                    />
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <div className="flex items-center gap-3 mb-6">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-lg">Additional Information</h2>
                    <p className="text-sm text-muted-foreground">
                      Footer text and terms for invoices
                    </p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <Label htmlFor="footerText">Footer Text</Label>
                    <Textarea
                      id="footerText"
                      value={formData.footerText || ""}
                      onChange={(e) => setFormData({ ...formData, footerText: e.target.value })}
                      placeholder="Text to display at the bottom of invoices"
                      rows={2}
                      data-testid="input-footer-text"
                    />
                  </div>
                  <div>
                    <Label htmlFor="termsAndConditions">Terms & Conditions</Label>
                    <Textarea
                      id="termsAndConditions"
                      value={formData.termsAndConditions || ""}
                      onChange={(e) => setFormData({ ...formData, termsAndConditions: e.target.value })}
                      placeholder="Enter terms and conditions for invoices"
                      rows={4}
                      data-testid="input-terms"
                    />
                  </div>
                </div>
              </Card>

              <div className="flex justify-end">
                <Button 
                  type="submit" 
                  disabled={saveMutation.isPending}
                  data-testid="button-save"
                >
                  {saveMutation.isPending ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4 mr-2" />
                      Save Settings
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </main>
    );
}
