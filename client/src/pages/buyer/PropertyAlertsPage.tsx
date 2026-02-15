import { useState } from "react";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Bell, MapPin, Home, DollarSign, Edit, Trash2 } from "lucide-react";

export default function PropertyAlertsPage() {
  const [alerts, setAlerts] = useState([
    {
      id: "1",
      name: "3BHK in Mumbai under ₹1 Cr",
      location: "Mumbai",
      propertyType: "Apartment",
      minBudget: 5000000,
      maxBudget: 10000000,
      bedrooms: 3,
      isActive: true,
      frequency: "Daily",
      matchesFound: 12,
    },
    {
      id: "2",
      name: "Villas in Bangalore",
      location: "Bangalore",
      propertyType: "Villa",
      minBudget: 10000000,
      maxBudget: 50000000,
      bedrooms: 4,
      isActive: true,
      frequency: "Weekly",
      matchesFound: 5,
    },
    {
      id: "3",
      name: "Commercial in Gurgaon",
      location: "Gurgaon",
      propertyType: "Commercial",
      minBudget: 20000000,
      maxBudget: 100000000,
      bedrooms: 0,
      isActive: false,
      frequency: "Instant",
      matchesFound: 2,
    },
  ]);

  const toggleAlert = (id: string) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === id ? { ...alert, isActive: !alert.isActive } : alert
      )
    );
  };

  return (
    <div className="min-h-screen flex flex-col">

      <main className="flex-1 pb-16 lg:pb-8">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Property Alerts
              </h1>
              <p className="text-muted-foreground">
                Get notified when new properties match your criteria
              </p>
            </div>
            <Button data-testid="button-create-alert">
              <Bell className="h-4 w-4 mr-2" />
              Create Alert
            </Button>
          </div>

          {/* Active Alerts Count */}
          <Card className="p-6 mb-8 bg-gradient-to-br from-primary/5 to-primary/10">
            <div className="flex items-center gap-4">
              <div className="p-4 rounded-full bg-primary/20">
                <Bell className="h-8 w-8 text-primary" />
              </div>
              <div>
                <p className="text-3xl font-bold font-serif">
                  {alerts.filter((a) => a.isActive).length}
                </p>
                <p className="text-muted-foreground">Active Alerts</p>
              </div>
            </div>
          </Card>

          {/* Alerts List */}
          <div className="space-y-4">
            {alerts.map((alert) => (
              <Card key={alert.id} className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <h3 className="font-semibold text-lg">{alert.name}</h3>
                      {alert.isActive ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Active
                        </Badge>
                      ) : (
                        <Badge variant="outline">Paused</Badge>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{alert.location}</span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Home className="h-4 w-4" />
                        <span>
                          {alert.propertyType}
                          {alert.bedrooms > 0 && ` • ${alert.bedrooms} BHK`}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <DollarSign className="h-4 w-4" />
                        <span>
                          ₹{(alert.minBudget / 100000).toFixed(1)}L - ₹
                          {(alert.maxBudget / 100000).toFixed(1)}L
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Bell className="h-4 w-4" />
                        <span>{alert.frequency} notifications</span>
                      </div>
                    </div>

                    {alert.matchesFound > 0 && (
                      <div className="p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                        <p className="text-sm text-blue-900 dark:text-blue-400">
                          <strong>{alert.matchesFound} new properties</strong>{" "}
                          match this alert
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Switch
                      checked={alert.isActive}
                      onCheckedChange={() => toggleAlert(alert.id)}
                      data-testid={`switch-alert-${alert.id}`}
                    />
                  </div>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-edit-${alert.id}`}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    data-testid={`button-delete-${alert.id}`}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                  {alert.matchesFound > 0 && (
                    <Button
                      size="sm"
                      className="ml-auto"
                      data-testid={`button-view-matches-${alert.id}`}
                    >
                      View {alert.matchesFound} Matches
                    </Button>
                  )}
                </div>
              </Card>
            ))}
          </div>

          {alerts.length === 0 && (
            <Card className="p-12 text-center">
              <Bell className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Alerts Yet</h3>
              <p className="text-muted-foreground mb-6">
                Create your first alert to get notified about new properties
              </p>
              <Button>Create Your First Alert</Button>
            </Card>
          )}
        </div>
      </main>

      <BuyerBottomNav />
    </div>
  );
}
