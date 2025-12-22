
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Palette } from "lucide-react";

export default function BrandingPage() {
  return (
    <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Palette className="h-8 w-8 text-primary" />
              Profile Branding
            </h1>
            <p className="text-muted-foreground">
              Customize your seller profile appearance
            </p>
          </div>

          <Card className="p-8 mb-8">
            <h3 className="font-semibold text-lg mb-6">Logo & Cover</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="logo">Company Logo</Label>
                <div className="mt-2 p-12 border-2 border-dashed rounded-lg text-center cursor-pointer hover-elevate">
                  <p className="text-sm text-muted-foreground">
                    Click to upload logo (Max 2MB)
                  </p>
                </div>
              </div>

              <div>
                <Label htmlFor="cover">Cover Image</Label>
                <div className="mt-2 p-12 border-2 border-dashed rounded-lg text-center cursor-pointer hover-elevate">
                  <p className="text-sm text-muted-foreground">
                    Click to upload cover image (Max 5MB)
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 mb-8">
            <h3 className="font-semibold text-lg mb-6">Profile Information</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="company-name">Company Name</Label>
                <Input
                  id="company-name"
                  defaultValue="Raj Properties"
                  data-testid="input-company-name"
                />
              </div>

              <div>
                <Label htmlFor="tagline">Tagline</Label>
                <Input
                  id="tagline"
                  placeholder="Your company tagline"
                  data-testid="input-tagline"
                />
              </div>

              <div>
                <Label htmlFor="description">About Us</Label>
                <Textarea
                  id="description"
                  placeholder="Tell buyers about your business..."
                  rows={4}
                  data-testid="textarea-description"
                />
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h3 className="font-semibold text-lg mb-6">Social Links</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="website">Website URL</Label>
                <Input
                  id="website"
                  placeholder="https://example.com"
                  data-testid="input-website"
                />
              </div>
              <div>
                <Label htmlFor="facebook">Facebook Page</Label>
                <Input
                  id="facebook"
                  placeholder="https://facebook.com/yourpage"
                  data-testid="input-facebook"
                />
              </div>
              <div>
                <Label htmlFor="instagram">Instagram Handle</Label>
                <Input
                  id="instagram"
                  placeholder="@yourbrand"
                  data-testid="input-instagram"
                />
              </div>
            </div>
          </Card>

          <Button className="w-full mt-8" size="lg" data-testid="button-save">
            Save Branding
          </Button>
        </div>
      </main>
  );
}
