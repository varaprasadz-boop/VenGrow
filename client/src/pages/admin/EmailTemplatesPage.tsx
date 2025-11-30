import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Mail, Eye, Edit, Save, Plus, Trash2, Send, Copy, Loader2 } from "lucide-react";
import type { EmailTemplate } from "@shared/schema";

const triggerEventLabels: Record<string, string> = {
  welcome_buyer: "Welcome Buyer",
  welcome_seller: "Welcome Seller",
  email_verification: "Email Verification",
  password_reset: "Password Reset",
  password_changed: "Password Changed",
  inquiry_received: "Inquiry Received",
  inquiry_response: "Inquiry Response",
  new_message: "New Message",
  property_submitted: "Property Submitted",
  property_approved: "Property Approved",
  property_rejected: "Property Rejected",
  property_needs_reapproval: "Property Needs Reapproval",
  property_live: "Property Live",
  seller_approved: "Seller Approved",
  seller_rejected: "Seller Rejected",
  seller_verification_pending: "Seller Verification Pending",
  payment_success: "Payment Success",
  payment_failed: "Payment Failed",
  subscription_activated: "Subscription Activated",
  subscription_expiring: "Subscription Expiring",
  subscription_expired: "Subscription Expired",
  account_deactivated: "Account Deactivated",
  account_reactivated: "Account Reactivated",
  admin_notification: "Admin Notification",
};

const triggerEventCategories: Record<string, string> = {
  welcome_buyer: "Registration",
  welcome_seller: "Registration",
  email_verification: "Verification",
  password_reset: "Verification",
  password_changed: "Verification",
  inquiry_received: "Inquiries",
  inquiry_response: "Inquiries",
  new_message: "Inquiries",
  property_submitted: "Properties",
  property_approved: "Properties",
  property_rejected: "Properties",
  property_needs_reapproval: "Properties",
  property_live: "Properties",
  seller_approved: "Sellers",
  seller_rejected: "Sellers",
  seller_verification_pending: "Sellers",
  payment_success: "Payments",
  payment_failed: "Payments",
  subscription_activated: "Subscriptions",
  subscription_expiring: "Subscriptions",
  subscription_expired: "Subscriptions",
  account_deactivated: "Account",
  account_reactivated: "Account",
  admin_notification: "Admin",
};

export default function EmailTemplatesPage() {
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [showTestEmail, setShowTestEmail] = useState(false);
  const [testEmail, setTestEmail] = useState("");
  const [editData, setEditData] = useState<Partial<EmailTemplate>>({});
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading } = useQuery<EmailTemplate[]>({
    queryKey: ["/api/email-templates"],
  });

  const updateTemplateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<EmailTemplate> }) => {
      const response = await apiRequest("PUT", `/api/admin/email-templates/${id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/email-templates"] });
      setEditMode(false);
      toast({ title: "Template updated successfully" });
    },
    onError: () => {
      toast({ title: "Failed to update template", variant: "destructive" });
    },
  });

  const selectedTemplate = templates.find((t) => t.id === selectedTemplateId);

  const filteredTemplates = categoryFilter === "all" 
    ? templates 
    : templates.filter(t => t.triggerEvent && triggerEventCategories[t.triggerEvent] === categoryFilter);

  const categories = Array.from(new Set(Object.values(triggerEventCategories)));

  const handleEditChange = (field: keyof EmailTemplate, value: any) => {
    setEditData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    if (selectedTemplateId && editData) {
      updateTemplateMutation.mutate({ id: selectedTemplateId, data: editData });
    }
  };

  const startEditing = () => {
    if (selectedTemplate) {
      setEditData({
        name: selectedTemplate.name,
        subject: selectedTemplate.subject,
        body: selectedTemplate.body,
        isActive: selectedTemplate.isActive,
        description: selectedTemplate.description,
      });
      setEditMode(true);
    }
  };

  const cancelEditing = () => {
    setEditMode(false);
    setEditData({});
  };

  const copyVariable = (variable: string) => {
    navigator.clipboard.writeText(`{{${variable}}}`);
    toast({ title: `Copied {{${variable}}} to clipboard` });
  };

  const renderPreview = () => {
    if (!selectedTemplate) return null;
    const body = editMode ? (editData.body || selectedTemplate.body) : selectedTemplate.body;
    const subject = editMode ? (editData.subject || selectedTemplate.subject) : selectedTemplate.subject;
    
    const previewBody = body
      .replace(/{{firstName}}/g, "John")
      .replace(/{{lastName}}/g, "Doe")
      .replace(/{{email}}/g, "john.doe@example.com")
      .replace(/{{sellerName}}/g, "Amit Kumar")
      .replace(/{{buyerName}}/g, "Priya Sharma")
      .replace(/{{propertyTitle}}/g, "3 BHK Apartment in Koramangala")
      .replace(/{{propertyLink}}/g, "https://vengrow.com/property/123")
      .replace(/{{amount}}/g, "2,499")
      .replace(/{{packageName}}/g, "Premium")
      .replace(/{{verificationLink}}/g, "https://vengrow.com/verify/abc123")
      .replace(/{{resetLink}}/g, "https://vengrow.com/reset/xyz789")
      .replace(/{{validUntil}}/g, "January 15, 2026")
      .replace(/{{listingLimit}}/g, "10")
      .replace(/{{transactionId}}/g, "TXN20251129001234")
      .replace(/{{expiryDate}}/g, "December 29, 2025")
      .replace(/{{changeDate}}/g, "November 29, 2025")
      .replace(/{{changeTime}}/g, "10:30 AM IST");

    return (
      <div className="max-h-[500px] overflow-y-auto">
        <div className="bg-white text-black p-6 rounded-lg border">
          <div className="border-b pb-4 mb-4">
            <p className="text-sm text-gray-500">From: VenGrow &lt;noreply@vengrow.com&gt;</p>
            <p className="text-sm text-gray-500">To: john.doe@example.com</p>
            <p className="font-semibold mt-2">{subject.replace(/{{.*?}}/g, (match) => {
              const key = match.slice(2, -2);
              const defaults: Record<string, string> = {
                firstName: "John",
                propertyTitle: "3 BHK Apartment in Koramangala",
                packageName: "Premium",
              };
              return defaults[key] || match;
            })}</p>
          </div>
          <div dangerouslySetInnerHTML={{ __html: previewBody }} />
        </div>
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={true} userType="admin" />
        <main className="flex-1 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Email Templates
              </h1>
              <p className="text-muted-foreground">
                Manage automated email templates for all platform notifications
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger className="w-40" data-testid="select-category-filter">
                  <SelectValue placeholder="All Categories" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Templates ({filteredTemplates.length})</h3>
                <div className="space-y-2 max-h-[600px] overflow-y-auto">
                  {filteredTemplates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => {
                        setSelectedTemplateId(template.id);
                        setEditMode(false);
                        setEditData({});
                      }}
                      className={`w-full text-left p-3 rounded-lg hover-elevate active-elevate-2 ${
                        selectedTemplateId === template.id
                          ? "bg-primary/10 border border-primary"
                          : "border"
                      }`}
                      data-testid={`button-template-${template.id}`}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-medium text-sm truncate">{template.name}</p>
                        <Badge 
                          variant={template.isActive ? "default" : "secondary"} 
                          className="text-xs ml-2 shrink-0"
                        >
                          {template.isActive ? "Active" : "Inactive"}
                        </Badge>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {template.triggerEvent && triggerEventCategories[template.triggerEvent] || "Other"}
                      </Badge>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            <div className="lg:col-span-3">
              {selectedTemplate ? (
                <Card className="p-6">
                  <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                    <div className="flex items-center gap-3">
                      <div className="p-3 rounded-lg bg-primary/10">
                        <Mail className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h2 className="font-semibold text-xl">
                          {editMode ? editData.name : selectedTemplate.name}
                        </h2>
                        <p className="text-sm text-muted-foreground">
                          Trigger: {selectedTemplate.triggerEvent && triggerEventLabels[selectedTemplate.triggerEvent] || selectedTemplate.triggerEvent}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      {editMode ? (
                        <>
                          <Button variant="outline" onClick={cancelEditing} data-testid="button-cancel">
                            Cancel
                          </Button>
                          <Button 
                            onClick={handleSave} 
                            disabled={updateTemplateMutation.isPending}
                            data-testid="button-save"
                          >
                            {updateTemplateMutation.isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                            <Save className="h-4 w-4 mr-2" />
                            Save
                          </Button>
                        </>
                      ) : (
                        <>
                          <Dialog open={showPreview} onOpenChange={setShowPreview}>
                            <DialogTrigger asChild>
                              <Button variant="outline" data-testid="button-preview">
                                <Eye className="h-4 w-4 mr-2" />
                                Preview
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Email Preview</DialogTitle>
                              </DialogHeader>
                              {renderPreview()}
                            </DialogContent>
                          </Dialog>
                          <Button variant="outline" onClick={startEditing} data-testid="button-edit">
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                        </>
                      )}
                    </div>
                  </div>

                  <Tabs defaultValue="content">
                    <TabsList>
                      <TabsTrigger value="content" data-testid="tab-content">
                        Content
                      </TabsTrigger>
                      <TabsTrigger value="variables" data-testid="tab-variables">
                        Variables
                      </TabsTrigger>
                      <TabsTrigger value="settings" data-testid="tab-settings">
                        Settings
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="content" className="space-y-6 mt-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Template Name</Label>
                        <Input
                          id="name"
                          value={editMode ? editData.name : selectedTemplate.name}
                          onChange={(e) => handleEditChange("name", e.target.value)}
                          disabled={!editMode}
                          data-testid="input-name"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="subject">Subject Line</Label>
                        <Input
                          id="subject"
                          value={editMode ? editData.subject : selectedTemplate.subject}
                          onChange={(e) => handleEditChange("subject", e.target.value)}
                          disabled={!editMode}
                          data-testid="input-subject"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="body">Email Body (HTML)</Label>
                        <Textarea
                          id="body"
                          rows={15}
                          value={editMode ? editData.body : selectedTemplate.body}
                          onChange={(e) => handleEditChange("body", e.target.value)}
                          disabled={!editMode}
                          data-testid="textarea-body"
                          className="font-mono text-sm"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Input
                          id="description"
                          value={editMode ? (editData.description || "") : (selectedTemplate.description || "")}
                          onChange={(e) => handleEditChange("description", e.target.value)}
                          disabled={!editMode}
                          data-testid="input-description"
                        />
                      </div>

                      <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-400">
                          <strong>Tip:</strong> Use variables like {"{{firstName}}"}, {"{{propertyTitle}}"}, etc. to personalize emails. Click on variables in the Variables tab to copy them.
                        </p>
                      </div>
                    </TabsContent>

                    <TabsContent value="variables" className="mt-6">
                      <Card className="p-6 bg-muted/30">
                        <h3 className="font-semibold mb-4">Available Variables for This Template</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {selectedTemplate.variables?.map((variable, index) => (
                            <button
                              key={index}
                              onClick={() => copyVariable(variable)}
                              className="p-3 bg-background rounded-lg hover-elevate text-left"
                              data-testid={`button-copy-${variable}`}
                            >
                              <div className="flex items-center justify-between">
                                <code className="text-sm font-mono text-primary">
                                  {`{{${variable}}}`}
                                </code>
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        <h3 className="font-semibold mt-6 mb-4">All Common Variables</h3>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                          {[
                            { var: "firstName", desc: "User's first name" },
                            { var: "lastName", desc: "User's last name" },
                            { var: "email", desc: "User's email" },
                            { var: "sellerName", desc: "Seller's name" },
                            { var: "buyerName", desc: "Buyer's name" },
                            { var: "propertyTitle", desc: "Property title" },
                            { var: "propertyLink", desc: "Property URL" },
                            { var: "amount", desc: "Payment amount" },
                            { var: "packageName", desc: "Package name" },
                            { var: "transactionId", desc: "Transaction ID" },
                            { var: "verificationLink", desc: "Verification URL" },
                            { var: "resetLink", desc: "Password reset URL" },
                          ].map((item, index) => (
                            <button
                              key={index}
                              onClick={() => copyVariable(item.var)}
                              className="p-3 bg-background rounded-lg hover-elevate text-left"
                            >
                              <div className="flex items-center justify-between mb-1">
                                <code className="text-sm font-mono text-primary">
                                  {`{{${item.var}}}`}
                                </code>
                                <Copy className="h-3 w-3 text-muted-foreground" />
                              </div>
                              <p className="text-xs text-muted-foreground">{item.desc}</p>
                            </button>
                          ))}
                        </div>
                      </Card>
                    </TabsContent>

                    <TabsContent value="settings" className="mt-6">
                      <Card className="p-6 space-y-6">
                        <div className="flex items-center justify-between">
                          <div>
                            <Label>Template Status</Label>
                            <p className="text-sm text-muted-foreground">
                              {editMode 
                                ? (editData.isActive ? "Active - Emails will be sent" : "Inactive - Emails will not be sent")
                                : (selectedTemplate.isActive ? "Active - Emails will be sent" : "Inactive - Emails will not be sent")
                              }
                            </p>
                          </div>
                          <Switch
                            checked={editMode ? editData.isActive : selectedTemplate.isActive}
                            onCheckedChange={(checked) => handleEditChange("isActive", checked)}
                            disabled={!editMode}
                            data-testid="switch-active"
                          />
                        </div>

                        <div>
                          <Label>Trigger Event</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedTemplate.triggerEvent && triggerEventLabels[selectedTemplate.triggerEvent] || selectedTemplate.triggerEvent}
                          </p>
                          <Badge variant="outline" className="mt-2">
                            {selectedTemplate.triggerEvent}
                          </Badge>
                        </div>

                        <div>
                          <Label>Created At</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedTemplate.createdAt 
                              ? new Date(selectedTemplate.createdAt).toLocaleString('en-IN')
                              : "Not available"
                            }
                          </p>
                        </div>

                        <div>
                          <Label>Last Updated</Label>
                          <p className="text-sm text-muted-foreground mt-1">
                            {selectedTemplate.updatedAt 
                              ? new Date(selectedTemplate.updatedAt).toLocaleString('en-IN')
                              : "Not available"
                            }
                          </p>
                        </div>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </Card>
              ) : (
                <Card className="p-12 text-center">
                  <Mail className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="font-semibold text-lg mb-2">Select a Template</h3>
                  <p className="text-muted-foreground">
                    Choose an email template from the list to view and edit its content.
                  </p>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
