import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";

export default function PropertySEOPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="seller" />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Search className="h-8 w-8 text-primary" />
              SEO Settings
            </h1>
            <p className="text-muted-foreground">
              Optimize your listing for search engines
            </p>
          </div>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Meta Information</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="title">SEO Title</Label>
                <Input
                  id="title"
                  defaultValue="Luxury 3BHK Apartment in Bandra West Mumbai"
                  data-testid="input-seo-title"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  60 characters recommended
                </p>
              </div>
              <div>
                <Label htmlFor="description">SEO Description</Label>
                <Textarea
                  id="description"
                  defaultValue="Premium 3-bedroom apartment with sea views in Mumbai's most sought-after locality. Modern amenities, great connectivity."
                  rows={3}
                  data-testid="input-seo-description"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  160 characters recommended
                </p>
              </div>
              <div>
                <Label htmlFor="keywords">Keywords</Label>
                <Input
                  id="keywords"
                  defaultValue="3BHK apartment, Bandra West, Mumbai, luxury flat"
                  data-testid="input-keywords"
                />
              </div>
            </div>
          </Card>

          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">SEO Score</h3>
            <div className="flex items-center gap-4 mb-4">
              <div className="text-5xl font-bold text-green-600">85</div>
              <div>
                <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500 mb-2">
                  Good
                </Badge>
                <p className="text-sm text-muted-foreground">
                  Your listing is well-optimized
                </p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Title length is optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-green-600">✓</span>
                <span>Description includes keywords</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-yellow-600">!</span>
                <span>Add more high-quality images</span>
              </div>
            </div>
          </Card>

          <Button className="w-full" size="lg" data-testid="button-save">
            Save SEO Settings
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
