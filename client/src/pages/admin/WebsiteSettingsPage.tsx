import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Globe, Image, FileText } from "lucide-react";

export default function WebsiteSettingsPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Website Settings
            </h1>
            <p className="text-muted-foreground">
              Configure site-wide settings and content
            </p>
          </div>

          <div className="space-y-6">
            {/* SEO Settings */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Globe className="h-5 w-5 text-primary" />
                SEO Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="site-title">Site Title</Label>
                  <Input
                    id="site-title"
                    defaultValue="PropConnect - Your Real Estate Partner"
                    data-testid="input-site-title"
                  />
                </div>
                <div>
                  <Label htmlFor="meta-description">Meta Description</Label>
                  <Textarea
                    id="meta-description"
                    rows={3}
                    defaultValue="Find your dream property in India. Browse thousands of verified listings from trusted sellers."
                    data-testid="textarea-meta-description"
                  />
                </div>
                <div>
                  <Label htmlFor="keywords">Meta Keywords</Label>
                  <Input
                    id="keywords"
                    defaultValue="real estate, property, India, buy, sell, rent"
                    data-testid="input-keywords"
                  />
                </div>
              </div>
            </Card>

            {/* Branding */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <Image className="h-5 w-5 text-primary" />
                Branding
              </h3>
              <div className="space-y-6">
                <div>
                  <Label>Logo</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-24 h-24 bg-muted rounded-lg flex items-center justify-center">
                      <span className="text-sm text-muted-foreground">Logo</span>
                    </div>
                    <Button variant="outline" data-testid="button-upload-logo">
                      Upload New Logo
                    </Button>
                  </div>
                </div>
                <div>
                  <Label>Favicon</Label>
                  <div className="mt-2 flex items-center gap-4">
                    <div className="w-12 h-12 bg-muted rounded flex items-center justify-center">
                      <span className="text-xs text-muted-foreground">Icon</span>
                    </div>
                    <Button variant="outline" data-testid="button-upload-favicon">
                      Upload Favicon
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

            {/* Homepage Settings */}
            <Card className="p-6">
              <h3 className="font-semibold text-lg mb-6 flex items-center gap-2">
                <FileText className="h-5 w-5 text-primary" />
                Homepage Settings
              </h3>
              <div className="space-y-6">
                <div>
                  <Label htmlFor="hero-title">Hero Title</Label>
                  <Input
                    id="hero-title"
                    defaultValue="Find Your Dream Property in India"
                    data-testid="input-hero-title"
                  />
                </div>
                <div>
                  <Label htmlFor="hero-subtitle">Hero Subtitle</Label>
                  <Input
                    id="hero-subtitle"
                    defaultValue="Browse thousands of verified listings"
                    data-testid="input-hero-subtitle"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="show-featured">Show Featured Listings</Label>
                    <p className="text-sm text-muted-foreground">
                      Display featured properties on homepage
                    </p>
                  </div>
                  <Switch id="show-featured" defaultChecked data-testid="switch-featured" />
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
        </div>
      </main>

      <Footer />
    </div>
  );
}
