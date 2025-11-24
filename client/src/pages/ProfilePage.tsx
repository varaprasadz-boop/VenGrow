import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Mail, Phone, MapPin, Camera, Save } from "lucide-react";

export default function ProfilePage() {
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, Maharashtra",
    bio: "Looking for a spacious apartment in Mumbai",
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Profile Settings
            </h1>
            <p className="text-muted-foreground">
              Manage your account information
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Profile Picture */}
            <div className="lg:col-span-1">
              <Card className="p-6">
                <div className="text-center">
                  <div className="relative inline-block mb-4">
                    <Avatar className="h-32 w-32">
                      <AvatarFallback className="text-3xl">JD</AvatarFallback>
                    </Avatar>
                    <button
                      className="absolute bottom-0 right-0 p-2 rounded-full bg-primary text-primary-foreground hover-elevate active-elevate-2"
                      data-testid="button-upload-photo"
                    >
                      <Camera className="h-4 w-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold mb-1">{profile.name}</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {profile.email}
                  </p>
                  <Button variant="outline" className="w-full" size="sm" data-testid="button-change-photo">
                    Change Photo
                  </Button>
                </div>
              </Card>
            </div>

            {/* Profile Form */}
            <div className="lg:col-span-3">
              <Tabs defaultValue="personal">
                <TabsList className="mb-6">
                  <TabsTrigger value="personal" data-testid="tab-personal">
                    Personal Info
                  </TabsTrigger>
                  <TabsTrigger value="security" data-testid="tab-security">
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="preferences" data-testid="tab-preferences">
                    Preferences
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personal">
                  <Card className="p-6">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <div className="relative">
                          <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="name"
                            className="pl-10"
                            value={profile.name}
                            onChange={(e) =>
                              setProfile({ ...profile, name: e.target.value })
                            }
                            data-testid="input-name"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="email"
                            type="email"
                            className="pl-10"
                            value={profile.email}
                            onChange={(e) =>
                              setProfile({ ...profile, email: e.target.value })
                            }
                            data-testid="input-email"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="phone"
                            type="tel"
                            className="pl-10"
                            value={profile.phone}
                            onChange={(e) =>
                              setProfile({ ...profile, phone: e.target.value })
                            }
                            data-testid="input-phone"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="location">Location</Label>
                        <div className="relative">
                          <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                          <Input
                            id="location"
                            className="pl-10"
                            value={profile.location}
                            onChange={(e) =>
                              setProfile({ ...profile, location: e.target.value })
                            }
                            data-testid="input-location"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          rows={4}
                          placeholder="Tell us about yourself..."
                          value={profile.bio}
                          onChange={(e) =>
                            setProfile({ ...profile, bio: e.target.value })
                          }
                          data-testid="textarea-bio"
                        />
                      </div>

                      <Button data-testid="button-save">
                        <Save className="h-4 w-4 mr-2" />
                        Save Changes
                      </Button>
                    </form>
                  </Card>
                </TabsContent>

                <TabsContent value="security">
                  <Card className="p-6">
                    <form className="space-y-6">
                      <div className="space-y-2">
                        <Label htmlFor="currentPassword">Current Password</Label>
                        <Input
                          id="currentPassword"
                          type="password"
                          data-testid="input-current-password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="newPassword">New Password</Label>
                        <Input
                          id="newPassword"
                          type="password"
                          data-testid="input-new-password"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                        <Input
                          id="confirmPassword"
                          type="password"
                          data-testid="input-confirm-password"
                        />
                      </div>

                      <Button data-testid="button-update-password">
                        Update Password
                      </Button>
                    </form>
                  </Card>
                </TabsContent>

                <TabsContent value="preferences">
                  <Card className="p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold mb-4">Email Notifications</h3>
                        <div className="space-y-3">
                          {[
                            "New property matches",
                            "Price drop alerts",
                            "Newsletter",
                            "Marketing emails",
                          ].map((item, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                              <span className="text-sm">{item}</span>
                              <input
                                type="checkbox"
                                defaultChecked={index < 2}
                                className="h-4 w-4"
                                data-testid={`checkbox-notify-${index}`}
                              />
                            </div>
                          ))}
                        </div>
                      </div>

                      <Button data-testid="button-save-preferences">
                        Save Preferences
                      </Button>
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
