
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Bell } from "lucide-react";

export default function NotificationPreferencesPage() {
  const emailPreferences = [
    {
      id: "new-inquiry",
      label: "New Inquiries",
      description: "Get notified when someone inquires about your property",
      defaultValue: true,
    },
    {
      id: "messages",
      label: "New Messages",
      description: "Notifications for new chat messages",
      defaultValue: true,
    },
    {
      id: "listing-approved",
      label: "Listing Approvals",
      description: "When your property listing is approved or rejected",
      defaultValue: true,
    },
    {
      id: "payment",
      label: "Payment Confirmations",
      description: "Receipts and payment status updates",
      defaultValue: true,
    },
    {
      id: "weekly-report",
      label: "Weekly Performance Report",
      description: "Summary of your listings' performance",
      defaultValue: false,
    },
    {
      id: "marketing",
      label: "Marketing & Promotions",
      description: "Special offers and platform updates",
      defaultValue: false,
    },
  ];

  const smsPreferences = [
    {
      id: "urgent-inquiry",
      label: "Urgent Inquiries",
      description: "High-priority leads via SMS",
      defaultValue: true,
    },
    {
      id: "booking",
      label: "Property Visit Bookings",
      description: "When someone books a property tour",
      defaultValue: true,
    },
    {
      id: "payment-sms",
      label: "Payment Alerts",
      description: "Transaction notifications via SMS",
      defaultValue: false,
    },
  ];

  return (


      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Notification Preferences
            </h1>
            <p className="text-muted-foreground">
              Choose how you want to be notified
            </p>
    

          <div className="space-y-6">
            {/* Email Notifications */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Bell className="h-5 w-5 text-primary" />
                Email Notifications
              </h3>
              <div className="space-y-6">
                {emailPreferences.map((pref) => (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between pb-6 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <Label htmlFor={pref.id} className="font-medium">
                        {pref.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pref.description}
                      </p>
              
                    <Switch
                      id={pref.id}
                      defaultChecked={pref.defaultValue}
                      data-testid={`switch-email-${pref.id}`}
                    />
            
                ))}
        
            </Card>

            {/* SMS Notifications */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">SMS Notifications</h3>
              <div className="space-y-6">
                {smsPreferences.map((pref) => (
                  <div
                    key={pref.id}
                    className="flex items-center justify-between pb-6 border-b last:border-0 last:pb-0"
                  >
                    <div className="flex-1">
                      <Label htmlFor={`sms-${pref.id}`} className="font-medium">
                        {pref.label}
                      </Label>
                      <p className="text-sm text-muted-foreground mt-1">
                        {pref.description}
                      </p>
              
                    <Switch
                      id={`sms-${pref.id}`}
                      defaultChecked={pref.defaultValue}
                      data-testid={`switch-sms-${pref.id}`}
                    />
            
                ))}
        
            </Card>

            {/* Push Notifications */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6">Push Notifications</h3>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <Label htmlFor="push-enabled" className="font-medium">
                      Enable Push Notifications
                    </Label>
                    <p className="text-sm text-muted-foreground mt-1">
                      Receive instant notifications on your device
                    </p>
            
                  <Switch
                    id="push-enabled"
                    defaultChecked
                    data-testid="switch-push-enabled"
                  />
          
        
            </Card>

            <Button className="w-full" size="lg" data-testid="button-save">
              Save Preferences
            </Button>
    
  
      </main>
  );
}
