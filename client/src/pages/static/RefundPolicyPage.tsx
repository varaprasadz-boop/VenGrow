import { useQuery } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
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

export default function RefundPolicyPage() {
  const { data: pageContent, isLoading, isError } = useQuery<StaticPage>({
    queryKey: ["/api/static-pages", "refund"],
    staleTime: 5 * 60 * 1000,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header />
        <main className="flex-1">
          <div className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-12 w-64 mb-4" />
              <Skeleton className="h-6 w-48" />
            </div>
          </div>
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <Skeleton className="h-96 w-full rounded-lg" />
          </div>
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
          <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Badge className="mb-4">Policy</Badge>
              <h1 className="font-serif font-bold text-4xl mb-4">Refund Policy</h1>
            </div>
          </section>
          <section className="py-12">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
              <Card className="p-8 text-center">
                <AlertCircle className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h2 className="font-semibold text-xl mb-2">Content Not Available</h2>
                <p className="text-muted-foreground">
                  Refund Policy content has not been configured yet. Please check back later.
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
        <section className="bg-gradient-to-br from-primary/5 to-primary/10 py-16" data-testid="section-refund-hero">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Badge className="mb-4">Policy</Badge>
            <h1 className="font-serif font-bold text-4xl mb-4" data-testid="text-refund-title">
              {pageContent.title || "Refund Policy"}
            </h1>
            {pageContent.lastUpdated && (
              <p className="text-lg text-muted-foreground" data-testid="text-refund-date">
                Last updated: {pageContent.lastUpdated}
              </p>
            )}
          </div>
        </section>

        <section className="py-12" data-testid="section-refund-content">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <Card className="p-8">
              <div 
                className="prose prose-slate dark:prose-invert max-w-none
                  [&_h2]:font-serif [&_h2]:font-bold [&_h2]:text-2xl [&_h2]:mb-4 [&_h2]:mt-6
                  [&_h3]:font-semibold [&_h3]:text-xl [&_h3]:mb-4 [&_h3]:mt-6
                  [&_p]:text-muted-foreground [&_p]:mb-4
                  [&_ul]:space-y-2 [&_ul]:mb-8
                  [&_ol]:space-y-3 [&_ol]:mb-8
                  [&_li]:flex [&_li]:gap-2"
                dangerouslySetInnerHTML={{ __html: pageContent.content }}
                data-testid="content-refund"
              />
            </Card>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
