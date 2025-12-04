import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

interface StaticPage {
  id: string;
  slug: string;
  title: string;
  content: string;
  metaTitle?: string;
  metaDescription?: string;
  lastUpdated?: string;
}

export default function PrivacyPage() {
  const { data: pageContent, isLoading, isError } = useQuery<StaticPage>({
    queryKey: ["/api/static-pages", "privacy"],
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Skeleton className="h-8 w-24 mx-auto mb-4" />
              <Skeleton className="h-12 w-96 mx-auto mb-6" />
              <Skeleton className="h-6 w-48 mx-auto" />
            </div>
          </section>
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              {[1, 2, 3, 4, 5].map(i => (
                <div key={i} className="mb-8">
                  <Skeleton className="h-8 w-64 mb-4" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </div>
              ))}
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  if (!pageContent?.content || isError) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <section className="py-16 bg-gradient-to-b from-primary/5 to-background">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <Badge className="mb-4">Legal</Badge>
              <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6">
                Privacy Policy
              </h1>
            </div>
          </section>
          <section className="py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">Content Not Available</h2>
                <p className="text-muted-foreground">
                  Privacy Policy content has not been configured yet. Please check back later.
                </p>
              </Card>
            </div>
          </section>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      <main className="flex-1">
        <section className="py-16 bg-gradient-to-b from-primary/5 to-background" data-testid="section-privacy-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <Badge className="mb-4">Legal</Badge>
            <h1 className="font-serif font-bold text-4xl sm:text-5xl mb-6" data-testid="text-privacy-title">
              {pageContent.title || "Privacy Policy"}
            </h1>
            {pageContent.lastUpdated && (
              <p className="text-muted-foreground" data-testid="text-privacy-date">
                Last updated: {pageContent.lastUpdated}
              </p>
            )}
          </div>
        </section>

        <section className="py-16" data-testid="section-privacy-content">
          <div 
            className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 prose prose-gray dark:prose-invert max-w-none
              [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mb-4 [&_h2]:mt-8
              [&_h3]:font-semibold [&_h3]:text-lg [&_h3]:mb-3 [&_h3]:mt-4
              [&_p]:text-muted-foreground [&_p]:leading-relaxed [&_p]:mb-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:text-muted-foreground [&_ul]:space-y-2 [&_ul]:mb-4
              [&_section]:mb-8"
            dangerouslySetInnerHTML={{ __html: pageContent.content }}
            data-testid="content-privacy"
          />
        </section>
      </main>

      <Footer />
    </div>
  );
}
