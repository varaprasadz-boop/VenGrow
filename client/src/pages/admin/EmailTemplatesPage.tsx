import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Eye, Edit, Save } from "lucide-react";

export default function EmailTemplatesPage() {
  const [selectedTemplate, setSelectedTemplate] = useState("welcome");

  const templates = [
    {
      id: "welcome",
      name: "Welcome Email",
      subject: "Welcome to PropConnect",
      category: "User",
      status: "active",
    },
    {
      id: "verify",
      name: "Email Verification",
      subject: "Verify your email address",
      category: "User",
      status: "active",
    },
    {
      id: "seller-approved",
      name: "Seller Approval",
      subject: "Your seller account has been approved",
      category: "Seller",
      status: "active",
    },
    {
      id: "listing-approved",
      name: "Listing Approved",
      subject: "Your property listing is now live",
      category: "Seller",
      status: "active",
    },
    {
      id: "new-inquiry",
      name: "New Inquiry",
      subject: "You have a new property inquiry",
      category: "Seller",
      status: "active",
    },
    {
      id: "visit-confirmed",
      name: "Visit Confirmed",
      subject: "Property visit confirmed",
      category: "Buyer",
      status: "active",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Email Templates
            </h1>
            <p className="text-muted-foreground">
              Manage automated email templates
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Template List */}
            <div className="lg:col-span-1">
              <Card className="p-4">
                <h3 className="font-semibold mb-4">Templates</h3>
                <div className="space-y-2">
                  {templates.map((template) => (
                    <button
                      key={template.id}
                      onClick={() => setSelectedTemplate(template.id)}
                      className={`w-full text-left p-3 rounded-lg hover-elevate active-elevate-2 ${
                        selectedTemplate === template.id
                          ? "bg-primary/10 border border-primary"
                          : "border"
                      }`}
                      data-testid={`button-template-${template.id}`}
                    >
                      <p className="font-medium text-sm mb-1">{template.name}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {template.category}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              </Card>
            </div>

            {/* Template Editor */}
            <div className="lg:col-span-3">
              <Card className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Mail className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-xl">
                        {templates.find((t) => t.id === selectedTemplate)?.name}
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        {templates.find((t) => t.id === selectedTemplate)?.category} Template
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" data-testid="button-preview">
                      <Eye className="h-4 w-4 mr-2" />
                      Preview
                    </Button>
                    <Button data-testid="button-save">
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
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
                  </TabsList>

                  <TabsContent value="content" className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject Line</Label>
                      <Input
                        id="subject"
                        defaultValue={
                          templates.find((t) => t.id === selectedTemplate)?.subject
                        }
                        data-testid="input-subject"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="body">Email Body</Label>
                      <Textarea
                        id="body"
                        rows={15}
                        defaultValue={`Dear {{user_name}},

Welcome to PropConnect! We're excited to have you on board.

Your account has been successfully created and you can now start exploring thousands of properties across India.

Getting Started:
1. Complete your profile
2. Browse properties in your preferred locations
3. Save your favorite properties
4. Connect with verified sellers

If you need any assistance, our support team is here to help.

Best regards,
PropConnect Team`}
                        data-testid="textarea-body"
                        className="font-mono text-sm"
                      />
                    </div>

                    <div className="p-4 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                      <p className="text-sm text-blue-900 dark:text-blue-400">
                        <strong>Tip:</strong> Use variables like {"{{user_name}}"}, {"{{property_title}}"}, etc. to personalize emails.
                      </p>
                    </div>
                  </TabsContent>

                  <TabsContent value="variables">
                    <Card className="p-6 bg-muted/30">
                      <h3 className="font-semibold mb-4">Available Variables</h3>
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { var: "{{user_name}}", desc: "User's full name" },
                          { var: "{{user_email}}", desc: "User's email address" },
                          { var: "{{property_title}}", desc: "Property title" },
                          { var: "{{property_price}}", desc: "Property price" },
                          { var: "{{seller_name}}", desc: "Seller's name" },
                          { var: "{{inquiry_date}}", desc: "Inquiry date" },
                          { var: "{{visit_date}}", desc: "Visit date & time" },
                          { var: "{{platform_url}}", desc: "Platform URL" },
                        ].map((item, index) => (
                          <div key={index} className="p-3 bg-background rounded-lg">
                            <code className="text-sm font-mono text-primary block mb-1">
                              {item.var}
                            </code>
                            <p className="text-xs text-muted-foreground">{item.desc}</p>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </TabsContent>
                </Tabs>
              </Card>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
