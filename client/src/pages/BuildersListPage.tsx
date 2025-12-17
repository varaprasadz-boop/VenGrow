import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { BadgeCheck, Building2, MapPin, Calendar, Loader2, Search } from "lucide-react";
import type { VerifiedBuilder } from "@shared/schema";
import { useState } from "react";

export default function BuildersListPage() {
  const [searchTerm, setSearchTerm] = useState("");

  const { data: builders = [], isLoading } = useQuery<VerifiedBuilder[]>({
    queryKey: ["/api/verified-builders"],
  });

  const filteredBuilders = builders.filter(builder => 
    builder.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    builder.state?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <BadgeCheck className="h-5 w-5" />
              <span className="text-sm font-medium">Trusted Partners</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl mb-4" data-testid="text-page-title">
              Verified Builders & Developers
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Explore properties from India's most trusted real estate developers
            </p>
          </div>

          <div className="max-w-md mx-auto mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search builders by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-builders"
              />
            </div>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredBuilders.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No builders found</h3>
              <p className="text-muted-foreground">
                {searchTerm ? "Try a different search term" : "Check back soon for verified builders"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBuilders.map((builder) => (
                <Link 
                  key={builder.id} 
                  href={`/builder/${builder.slug}`}
                  data-testid={`link-builder-${builder.id}`}
                >
                  <Card className="p-6 hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-builder-${builder.id}`}>
                    <div className="flex flex-col items-center text-center gap-4">
                      <div className="h-24 w-24 rounded-lg overflow-hidden bg-muted flex items-center justify-center">
                        {builder.logoUrl ? (
                          <img 
                            src={builder.logoUrl} 
                            alt={builder.companyName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Building2 className="h-10 w-10 text-muted-foreground" />
                        )}
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-center gap-2 mb-1">
                          <h3 className="font-semibold text-lg" data-testid={`text-builder-name-${builder.id}`}>
                            {builder.companyName}
                          </h3>
                          {builder.isVerified && (
                            <BadgeCheck className="h-5 w-5 text-primary" />
                          )}
                        </div>
                        
                        {(builder.city || builder.state) && (
                          <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                            <MapPin className="h-3 w-3" />
                            {[builder.city, builder.state].filter(Boolean).join(", ")}
                          </p>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 justify-center">
                        <Badge variant="secondary">
                          {builder.propertyCount || 0} Properties
                        </Badge>
                        {builder.establishedYear && (
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Est. {builder.establishedYear}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
