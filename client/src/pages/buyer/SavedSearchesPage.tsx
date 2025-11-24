import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Search,
  Bell,
  BellOff,
  Trash2,
  Edit,
  MapPin,
  Building2,
  DollarSign,
} from "lucide-react";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState([
    {
      id: "1",
      name: "3BHK in Mumbai",
      location: "Mumbai",
      propertyType: "Apartment",
      minPrice: "50L",
      maxPrice: "1Cr",
      bedrooms: "3",
      alerts: true,
      newResults: 5,
      lastChecked: "2 hours ago",
    },
    {
      id: "2",
      name: "Office Space Gurgaon",
      location: "Gurgaon",
      propertyType: "Commercial",
      minPrice: "1Cr",
      maxPrice: "5Cr",
      bedrooms: "Any",
      alerts: true,
      newResults: 2,
      lastChecked: "5 hours ago",
    },
    {
      id: "3",
      name: "Budget Flats Bangalore",
      location: "Bangalore",
      propertyType: "Apartment",
      minPrice: "30L",
      maxPrice: "60L",
      bedrooms: "2",
      alerts: false,
      newResults: 0,
      lastChecked: "1 day ago",
    },
  ]);

  const toggleAlerts = (id: string) => {
    setSearches(
      searches.map((s) => (s.id === id ? { ...s, alerts: !s.alerts } : s))
    );
  };

  const deleteSearch = (id: string) => {
    setSearches(searches.filter((s) => s.id !== id));
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Saved Searches</h1>
            <p className="text-muted-foreground">
              Manage your saved property searches and alerts
            </p>
          </div>

          {searches.length > 0 ? (
            <div className="space-y-4">
              {searches.map((search) => (
                <Card key={search.id} className="p-6">
                  <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                    <div className="flex-1 space-y-4">
                      <div className="flex items-start justify-between">
                        <div>
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-semibold text-lg">{search.name}</h3>
                            {search.newResults > 0 && (
                              <Badge>{search.newResults} new</Badge>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Last checked {search.lastChecked}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4 text-muted-foreground" />
                          <span>{search.location}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground" />
                          <span>{search.propertyType}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <DollarSign className="h-4 w-4 text-muted-foreground" />
                          <span>
                            ₹{search.minPrice} - ₹{search.maxPrice}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Search className="h-4 w-4 text-muted-foreground" />
                          <span>{search.bedrooms} BHK</span>
                        </div>
                      </div>

                      {search.alerts && (
                        <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/10 border border-blue-200 dark:border-blue-900/20 rounded-lg">
                          <Bell className="h-4 w-4 text-blue-600" />
                          <span className="text-sm text-blue-900 dark:text-blue-400">
                            Email alerts enabled for new properties
                          </span>
                        </div>
                      )}
                    </div>

                    <div className="flex lg:flex-col gap-2">
                      <Button
                        size="sm"
                        className="flex-1 lg:flex-none"
                        data-testid={`button-view-${search.id}`}
                      >
                        <Search className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">View Results</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none"
                        onClick={() => toggleAlerts(search.id)}
                        data-testid={`button-alerts-${search.id}`}
                      >
                        {search.alerts ? (
                          <>
                            <BellOff className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Disable Alerts</span>
                          </>
                        ) : (
                          <>
                            <Bell className="h-4 w-4 lg:mr-2" />
                            <span className="hidden lg:inline">Enable Alerts</span>
                          </>
                        )}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none"
                        data-testid={`button-edit-${search.id}`}
                      >
                        <Edit className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Edit</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        className="flex-1 lg:flex-none text-destructive"
                        onClick={() => deleteSearch(search.id)}
                        data-testid={`button-delete-${search.id}`}
                      >
                        <Trash2 className="h-4 w-4 lg:mr-2" />
                        <span className="hidden lg:inline">Delete</span>
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="p-12 text-center">
              <Search className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="font-semibold text-xl mb-2">No Saved Searches</h3>
              <p className="text-muted-foreground mb-6">
                Save your property searches to get notified when new listings match your criteria
              </p>
              <Button>Start Searching</Button>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
