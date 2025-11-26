import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Save } from "lucide-react";

export default function SystemSettingsPage() {
  const [settings, setSettings] = useState({
    siteName: "VenGrow",
    siteTagline: "Find Your Dream Property",
    contactEmail: "support@propconnect.com",
    contactPhone: "+91 98765 43210",
    enableRegistration: true,
    enableSellerApproval: true,
    enableListingModeration: true,
    enableEmailNotifications: true,
    enableSMSNotifications: false,
    maintenanceMode: false,
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                System Settings
              </h1>
              <p className="text-muted-foreground">
                Configure platform settings and preferences
              </p>
            </div>
            <Button data-testid="button-save">
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
          </div>

          <Tabs defaultValue="general" className="space-y-6">
            <TabsList>
              <TabsTrigger value="general" data-testid="tab-general">
                General
              </TabsTrigger>
              <TabsTrigger value="features" data-testid="tab-features">
                Features
              </TabsTrigger>
              <TabsTrigger value="notifications" data-testid="tab-notifications">
                Notifications
              </TabsTrigger>
              <TabsTrigger value="advanced" data-testid="tab-advanced">
                Advanced
              </TabsTrigger>
            </TabsList>

            <TabsContent value="general">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="siteName">Site Name</Label>
                    <Input
                      id="siteName"
                      value={settings.siteName}
                      onChange={(e) =>
                        setSettings({ ...settings, siteName: e.target.value })
                      }
                      data-testid="input-site-name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="siteTagline">Site Tagline</Label>
                    <Input
                      id="siteTagline"
                      value={settings.siteTagline}
                      onChange={(e) =>
                        setSettings({ ...settings, siteTagline: e.target.value })
                      }
                      data-testid="input-site-tagline"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="contactEmail">Contact Email</Label>
                      <Input
                        id="contactEmail"
                        type="email"
                        value={settings.contactEmail}
                        onChange={(e) =>
                          setSettings({ ...settings, contactEmail: e.target.value })
                        }
                        data-testid="input-contact-email"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="contactPhone">Contact Phone</Label>
                      <Input
                        id="contactPhone"
                        value={settings.contactPhone}
                        onChange={(e) =>
                          setSettings({ ...settings, contactPhone: e.target.value })
                        }
                        data-testid="input-contact-phone"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="aboutUs">About Us</Label>
                    <Textarea
                      id="aboutUs"
                      rows={6}
                      placeholder="Tell users about your platform..."
                      data-testid="textarea-about-us"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="features">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">User Registration</h3>
                      <p className="text-sm text-muted-foreground">
                        Allow new users to register on the platform
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableRegistration}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableRegistration: checked })
                      }
                      data-testid="switch-registration"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Seller Approval</h3>
                      <p className="text-sm text-muted-foreground">
                        Require admin approval for new seller registrations
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSellerApproval}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, enableSellerApproval: checked })
                      }
                      data-testid="switch-seller-approval"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Listing Moderation</h3>
                      <p className="text-sm text-muted-foreground">
                        Require admin approval for new property listings
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableListingModeration}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableListingModeration: checked,
                        })
                      }
                      data-testid="switch-listing-moderation"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="notifications">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">Email Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Send email notifications to users
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableEmailNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableEmailNotifications: checked,
                        })
                      }
                      data-testid="switch-email-notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1">SMS Notifications</h3>
                      <p className="text-sm text-muted-foreground">
                        Send SMS notifications to users
                      </p>
                    </div>
                    <Switch
                      checked={settings.enableSMSNotifications}
                      onCheckedChange={(checked) =>
                        setSettings({
                          ...settings,
                          enableSMSNotifications: checked,
                        })
                      }
                      data-testid="switch-sms-notifications"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="smtpHost">SMTP Host</Label>
                    <Input
                      id="smtpHost"
                      placeholder="smtp.example.com"
                      data-testid="input-smtp-host"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="smtpPort">SMTP Port</Label>
                      <Input
                        id="smtpPort"
                        placeholder="587"
                        data-testid="input-smtp-port"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        placeholder="username@example.com"
                        data-testid="input-smtp-username"
                      />
                    </div>
                  </div>
                </div>
              </Card>
            </TabsContent>

            <TabsContent value="advanced">
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="flex items-center justify-between p-4 border border-destructive rounded-lg bg-destructive/5">
                    <div className="flex-1">
                      <h3 className="font-medium mb-1 text-destructive">
                        Maintenance Mode
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Put the platform in maintenance mode. Only admins can access.
                      </p>
                    </div>
                    <Switch
                      checked={settings.maintenanceMode}
                      onCheckedChange={(checked) =>
                        setSettings({ ...settings, maintenanceMode: checked })
                      }
                      data-testid="switch-maintenance-mode"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                    <Input
                      id="googleAnalytics"
                      placeholder="UA-XXXXXXXXX-X"
                      data-testid="input-google-analytics"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="razorpayKey">Razorpay API Key</Label>
                    <Input
                      id="razorpayKey"
                      placeholder="rzp_live_XXXXXXXXXXXXXXX"
                      data-testid="input-razorpay-key"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="googleMapsKey">Google Maps API Key</Label>
                    <Input
                      id="googleMapsKey"
                      placeholder="AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                      data-testid="input-google-maps-key"
                    />
                  </div>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
