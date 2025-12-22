import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Settings, Bell, Eye, Mail } from "lucide-react";

export default function ListingSettingsPage() {
  const [settings, setSettings] = useState({
    autoApproveInquiries: false,
    emailNotifications: true,
    smsNotifications: true,
    showPhoneNumber: true,
    showEmail: false,
    allowScheduleVisit: true,
    autoResponseEnabled: true,
    weekendAvailability: true,
  });

  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Listing Settings
            </h1>
            <p className="text-muted-foreground">
              Configure how buyers interact with your listings
            </p>
          </div>

          {/* Visibility Settings */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Visibility Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="show-phone">Show Phone Number</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your contact number on listings
                  </p>
                </div>
                <Switch
                  id="show-phone"
                  checked={settings.showPhoneNumber}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showPhoneNumber: checked })
                  }
                  data-testid="switch-phone"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="show-email">Show Email Address</Label>
                  <p className="text-sm text-muted-foreground">
                    Display your email on listings
                  </p>
                </div>
                <Switch
                  id="show-email"
                  checked={settings.showEmail}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, showEmail: checked })
                  }
                  data-testid="switch-email"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="schedule-visit">Allow Schedule Visit</Label>
                  <p className="text-sm text-muted-foreground">
                    Let buyers book property visits online
                  </p>
                </div>
                <Switch
                  id="schedule-visit"
                  checked={settings.allowScheduleVisit}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, allowScheduleVisit: checked })
                  }
                  data-testid="switch-schedule"
                />
              </div>
            </div>
          </Card>

          {/* Notification Settings */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Bell className="h-5 w-5 text-primary" />
              Notification Settings
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="email-notif">Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive inquiry notifications via email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={settings.emailNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, emailNotifications: checked })
                  }
                  data-testid="switch-email-notif"
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="sms-notif">SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">
                    Receive inquiry notifications via SMS
                  </p>
                </div>
                <Switch
                  id="sms-notif"
                  checked={settings.smsNotifications}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, smsNotifications: checked })
                  }
                  data-testid="switch-sms-notif"
                />
              </div>
            </div>
          </Card>

          {/* Auto Response */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Mail className="h-5 w-5 text-primary" />
              Auto Response
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="auto-response">Enable Auto Response</Label>
                  <p className="text-sm text-muted-foreground">
                    Automatically send response to new inquiries
                  </p>
                </div>
                <Switch
                  id="auto-response"
                  checked={settings.autoResponseEnabled}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, autoResponseEnabled: checked })
                  }
                  data-testid="switch-auto-response"
                />
              </div>

              {settings.autoResponseEnabled && (
                <div>
                  <Label htmlFor="auto-message">Auto Response Message</Label>
                  <textarea
                    id="auto-message"
                    rows={4}
                    className="w-full mt-2 p-3 border rounded-lg"
                    placeholder="Thank you for your inquiry. I will get back to you within 24 hours..."
                    data-testid="textarea-auto-message"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Availability */}
          <Card className="p-6 mb-6">
            <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
              <Settings className="h-5 w-5 text-primary" />
              Availability
            </h3>
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <Label htmlFor="weekend">Weekend Availability</Label>
                  <p className="text-sm text-muted-foreground">
                    Available for property visits on weekends
                  </p>
                </div>
                <Switch
                  id="weekend"
                  checked={settings.weekendAvailability}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, weekendAvailability: checked })
                  }
                  data-testid="switch-weekend"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="start-time">Available From</Label>
                  <Input
                    id="start-time"
                    type="time"
                    defaultValue="09:00"
                    data-testid="input-start-time"
                  />
                </div>
                <div>
                  <Label htmlFor="end-time">Available Until</Label>
                  <Input
                    id="end-time"
                    type="time"
                    defaultValue="18:00"
                    data-testid="input-end-time"
                  />
                </div>
              </div>
            </div>
          </Card>

          <div className="flex gap-4">
            <Button className="flex-1" data-testid="button-save">
              Save Changes
            </Button>
            <Button variant="outline" className="flex-1" data-testid="button-reset">
              Reset to Default
            </Button>
          </div>
        </div>
      </main>
  );
}
