import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Languages } from "lucide-react";

export default function LanguageSettingsPage() {
  const languages = [
    {
      id: "en",
      name: "English",
      nativeName: "English",
      enabled: true,
      default: true,
      completion: 100,
    },
    {
      id: "hi",
      name: "Hindi",
      nativeName: "हिंदी",
      enabled: true,
      default: false,
      completion: 95,
    },
    {
      id: "mr",
      name: "Marathi",
      nativeName: "मराठी",
      enabled: false,
      default: false,
      completion: 60,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
              <Languages className="h-8 w-8 text-primary" />
              Language Settings
            </h1>
            <p className="text-muted-foreground">
              Manage platform supported languages
            </p>
          </div>

          <div className="space-y-4">
            {languages.map((language) => (
              <Card key={language.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">
                        {language.name} ({language.nativeName})
                      </h3>
                      {language.default && (
                        <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">
                          Default
                        </Badge>
                      )}
                    </div>
                    <div className="mb-3">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-muted-foreground">
                          Translation Completion
                        </span>
                        <span className="text-sm font-semibold">
                          {language.completion}%
                        </span>
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{ width: `${language.completion}%` }}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <Switch
                      defaultChecked={language.enabled}
                      disabled={language.default}
                      data-testid={`switch-${language.id}`}
                    />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
