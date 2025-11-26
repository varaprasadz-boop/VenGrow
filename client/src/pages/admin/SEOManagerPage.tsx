import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Search, TrendingUp, FileText } from "lucide-react";

export default function SEOManagerPage() {
  const pages = [
    {
      id: "1",
      name: "Homepage",
      url: "/",
      title: "VenGrow - Find Your Dream Property",
      metaScore: 85,
      status: "optimized",
    },
    {
      id: "2",
      name: "Property Listings",
      url: "/listings",
      title: "Property Listings in India",
      metaScore: 72,
      status: "needs_improvement",
    },
    {
      id: "3",
      name: "About Us",
      url: "/about",
      title: "About VenGrow",
      metaScore: 65,
      status: "needs_improvement",
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              SEO Manager
            </h1>
            <p className="text-muted-foreground">
              Optimize your website for search engines
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <TrendingUp className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">78</p>
                  <p className="text-sm text-muted-foreground">Average SEO Score</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <FileText className="h-6 w-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">{pages.length}</p>
                  <p className="text-sm text-muted-foreground">Pages Tracked</p>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Search className="h-6 w-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-3xl font-bold">24</p>
                  <p className="text-sm text-muted-foreground">Keywords Ranking</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Pages List */}
          <Card className="p-6 mb-8">
            <h3 className="font-semibold text-lg mb-6">Page SEO Analysis</h3>
            <div className="space-y-4">
              {pages.map((page) => (
                <div
                  key={page.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-medium">{page.name}</h4>
                      {page.status === "optimized" ? (
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          Optimized
                        </Badge>
                      ) : (
                        <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
                          Needs Improvement
                        </Badge>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {page.url}
                    </p>
                    <div className="flex items-center gap-4">
                      <span className="text-sm text-muted-foreground">
                        SEO Score:
                      </span>
                      <div className="flex-1 max-w-xs">
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                          <div
                            className={`h-full ${
                              page.metaScore >= 80
                                ? "bg-green-500"
                                : page.metaScore >= 60
                                ? "bg-yellow-500"
                                : "bg-red-500"
                            }`}
                            style={{ width: `${page.metaScore}%` }}
                          />
                        </div>
                      </div>
                      <span className="text-sm font-medium">{page.metaScore}/100</span>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    data-testid={`button-edit-${page.id}`}
                  >
                    Edit SEO
                  </Button>
                </div>
              ))}
            </div>
          </Card>

          {/* Edit Form */}
          <Card className="p-6">
            <h3 className="font-semibold text-lg mb-6">Edit Page SEO</h3>
            <div className="space-y-6">
              <div>
                <Label htmlFor="page-title">Page Title</Label>
                <Input
                  id="page-title"
                  placeholder="Enter page title"
                  data-testid="input-title"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 50-60 characters
                </p>
              </div>

              <div>
                <Label htmlFor="meta-description">Meta Description</Label>
                <Textarea
                  id="meta-description"
                  rows={3}
                  placeholder="Enter meta description"
                  data-testid="textarea-description"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Recommended: 150-160 characters
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Focus Keywords</Label>
                <Input
                  id="keywords"
                  placeholder="Enter keywords separated by commas"
                  data-testid="input-keywords"
                />
              </div>

              <div>
                <Label htmlFor="canonical">Canonical URL</Label>
                <Input
                  id="canonical"
                  placeholder="https://propconnect.com/page"
                  data-testid="input-canonical"
                />
              </div>

              <Button data-testid="button-save">Save SEO Settings</Button>
            </div>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  );
}
