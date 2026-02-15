import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Bell, Mail, MessageSquare, Globe, Moon, Sun, Loader2 } from "lucide-react";
import type { User } from "@shared/schema";

export default function SettingsPage() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(false);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [newListings, setNewListings] = useState(true);
  const [priceDrops, setPriceDrops] = useState(true);
  const [inquiryReplies, setInquiryReplies] = useState(true);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState("en");
  const [currency, setCurrency] = useState("inr");

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
    enabled: !!user,
  });

  useEffect(() => {
    if (currentUser && (currentUser as any).metadata) {
      const prefs = (currentUser as any).metadata;
      if (prefs.emailNotifications !== undefined) setEmailNotifications(prefs.emailNotifications);
      if (prefs.smsNotifications !== undefined) setSmsNotifications(prefs.smsNotifications);
      if (prefs.pushNotifications !== undefined) setPushNotifications(prefs.pushNotifications);
      if (prefs.newListings !== undefined) setNewListings(prefs.newListings);
      if (prefs.priceDrops !== undefined) setPriceDrops(prefs.priceDrops);
      if (prefs.inquiryReplies !== undefined) setInquiryReplies(prefs.inquiryReplies);
    }
  }, [currentUser]);

  const savePreferencesMutation = useMutation({
    mutationFn: async (preferences: {
      emailNotifications: boolean;
      smsNotifications: boolean;
      pushNotifications: boolean;
      newListings: boolean;
      priceDrops: boolean;
      inquiryReplies: boolean;
    }) => {
      return apiRequest("PATCH", "/api/auth/me/preferences", preferences);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/auth/me"] });
      toast({
        title: "Settings saved successfully",
      });
    },
    onError: () => {
      toast({
        title: "Failed to save settings",
        variant: "destructive",
      });
    },
  });

  const handleSaveSettings = () => {
    savePreferencesMutation.mutate({
      emailNotifications,
      smsNotifications,
      pushNotifications,
      newListings,
      priceDrops,
      inquiryReplies,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Manage your account preferences
            </p>
          </div>

          <div className="space-y-6">
            {/* Notifications */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-semibold text-xl">Notification Preferences</h2>
              </div>

              <div className="space-y-6">
                {/* Notification Channels */}
                <div className="space-y-4">
                  <h3 className="font-medium">Notification Channels</h3>
                  
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Email Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive updates via email
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={emailNotifications}
                      onCheckedChange={setEmailNotifications}
                      data-testid="switch-email-notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <MessageSquare className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">SMS Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive important updates via SMS
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={smsNotifications}
                      onCheckedChange={setSmsNotifications}
                      data-testid="switch-sms-notifications"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Bell className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Push Notifications</p>
                        <p className="text-sm text-muted-foreground">
                          Receive browser push notifications
                        </p>
                      </div>
                    </div>
                    <Switch
                      checked={pushNotifications}
                      onCheckedChange={setPushNotifications}
                      data-testid="switch-push-notifications"
                    />
                  </div>
                </div>

                {/* Notification Types */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="font-medium">Notification Types</h3>
                  
                  <div className="flex items-center justify-between">
                    <Label htmlFor="new-listings">New property listings matching your searches</Label>
                    <Switch
                      id="new-listings"
                      checked={newListings}
                      onCheckedChange={setNewListings}
                      data-testid="switch-new-listings"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="price-drops">Price drops on favorited properties</Label>
                    <Switch
                      id="price-drops"
                      checked={priceDrops}
                      onCheckedChange={setPriceDrops}
                      data-testid="switch-price-drops"
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <Label htmlFor="inquiry-replies">Replies to my inquiries</Label>
                    <Switch
                      id="inquiry-replies"
                      checked={inquiryReplies}
                      onCheckedChange={setInquiryReplies}
                      data-testid="switch-inquiry-replies"
                    />
                  </div>
                </div>
              </div>
            </Card>

            {/* Appearance */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  {darkMode ? <Moon className="h-5 w-5 text-primary" /> : <Sun className="h-5 w-5 text-primary" />}
                </div>
                <h2 className="font-semibold text-xl">Appearance</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="dark-mode">Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">
                      Switch between light and dark theme
                    </p>
                  </div>
                  <Switch
                    id="dark-mode"
                    checked={darkMode}
                    onCheckedChange={setDarkMode}
                    data-testid="switch-dark-mode"
                  />
                </div>
              </div>
            </Card>

            {/* Language & Region */}
            <Card className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Globe className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-semibold text-xl">Language & Region</h2>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Select value={language} onValueChange={setLanguage}>
                    <SelectTrigger id="language" data-testid="select-language">
                      <SelectValue placeholder="Select language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="en">English</SelectItem>
                      <SelectItem value="hi">Hindi (हिंदी)</SelectItem>
                      <SelectItem value="mr">Marathi (मराठी)</SelectItem>
                      <SelectItem value="ta">Tamil (தமிழ்)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="currency">Currency</Label>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger id="currency" data-testid="select-currency">
                      <SelectValue placeholder="Select currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="inr">Indian Rupee (₹)</SelectItem>
                      <SelectItem value="usd">US Dollar ($)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>

            {/* Save Button */}
            <div className="flex justify-end">
              <Button 
                size="lg" 
                onClick={handleSaveSettings}
                disabled={savePreferencesMutation.isPending}
                data-testid="button-save-settings"
              >
                {savePreferencesMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : (
                  "Save Settings"
                )}
              </Button>
            </div>
          </div>
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
