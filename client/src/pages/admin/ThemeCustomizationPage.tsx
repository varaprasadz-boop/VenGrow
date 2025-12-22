import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Palette } from "lucide-react";

export default function ThemeCustomizationPage() {
  const colorSettings = [
    { id: "primary", label: "Primary Color", value: "#FF6B35" },
    { id: "secondary", label: "Secondary Color", value: "#004E89" },
    { id: "accent", label: "Accent Color", value: "#F77F00" },
    { id: "background", label: "Background", value: "#FFFFFF" },
  ];

  return (
      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Palette className="h-8 w-8 text-primary" />
              Theme Customization
            </h1>
            <p className="text-muted-foreground">
              Customize platform colors and branding
            </p>
          </div>

          {/* Colors */}
          <Card className="p-8 mb-8">
            <h3 className="font-semibold text-lg mb-6">Brand Colors</h3>
            <div className="space-y-6">
              {colorSettings.map((color) => (
                <div key={color.id} className="flex items-center gap-4">
                  <div className="flex-1">
                    <Label htmlFor={color.id}>{color.label}</Label>
                    <Input
                      id={color.id}
                      defaultValue={color.value}
                      className="mt-1"
                      data-testid={`input-${color.id}`}
                    />
                  </div>
                  <div
                    className="w-16 h-16 rounded-lg border-2"
                    style={{ backgroundColor: color.value }}
                  />
                </div>
              ))}
            </div>
          </Card>

          {/* Logo */}
          <Card className="p-8 mb-8">
            <h3 className="font-semibold text-lg mb-6">Platform Logo</h3>
            <div>
              <Label>Upload Logo</Label>
              <div className="mt-2 p-12 border-2 border-dashed rounded-lg text-center cursor-pointer hover-elevate">
                <p className="text-sm text-muted-foreground">
                  Click to upload logo (Max 2MB, PNG/SVG)
                </p>
              </div>
            </div>
          </Card>

          <Button className="w-full" size="lg" data-testid="button-save">
            Save Theme
          </Button>

          <Card className="p-6 mt-8 bg-yellow-50 dark:bg-yellow-900/10 border-yellow-200 dark:border-yellow-900/20">
            <h3 className="font-semibold mb-2">Important</h3>
            <p className="text-sm text-muted-foreground">
              Theme changes will affect all users immediately. Preview changes before saving.
            </p>
          </Card>
        </div>
      </main>
    );
}
