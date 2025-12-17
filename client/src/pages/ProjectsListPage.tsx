import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building2, MapPin, Calendar, Loader2, Search, Home, IndianRupee } from "lucide-react";
import type { Project } from "@shared/schema";
import { useState } from "react";

const projectStages = [
  { value: "all", label: "All Stages" },
  { value: "pre_launch", label: "Pre-launch" },
  { value: "launch", label: "Launch" },
  { value: "under_construction", label: "Under Construction" },
  { value: "ready_to_move", label: "Ready to Move" },
];

function formatPrice(price: number): string {
  if (price >= 10000000) {
    return `₹${(price / 10000000).toFixed(2)} Cr`;
  }
  return `₹${(price / 100000).toFixed(2)} Lac`;
}

export default function ProjectsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [stageFilter, setStageFilter] = useState("all");

  const { data: projects = [], isLoading } = useQuery<Project[]>({
    queryKey: ["/api/projects"],
  });

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.locality?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStage = stageFilter === "all" || project.projectStage === stageFilter;
    
    return matchesSearch && matchesStage;
  });

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary mb-4">
              <Building2 className="h-5 w-5" />
              <span className="text-sm font-medium">Real Estate Projects</span>
            </div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl mb-4" data-testid="text-page-title">
              Explore Projects
            </h1>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Discover premium residential and commercial projects from top developers
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name or location..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                data-testid="input-search-projects"
              />
            </div>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-full sm:w-48" data-testid="select-project-stage">
                <SelectValue placeholder="Project Stage" />
              </SelectTrigger>
              <SelectContent>
                {projectStages.map((stage) => (
                  <SelectItem key={stage.value} value={stage.value}>
                    {stage.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : filteredProjects.length === 0 ? (
            <div className="text-center py-16">
              <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-2">No projects found</h3>
              <p className="text-muted-foreground">
                {searchTerm || stageFilter !== "all" 
                  ? "Try adjusting your filters" 
                  : "Check back soon for new projects"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProjects.map((project) => {
                const images = project.galleryImages || [];
                return (
                  <Link 
                    key={project.id} 
                    href={`/project/${project.slug || project.id}`}
                    data-testid={`link-project-${project.id}`}
                  >
                    <Card className="overflow-hidden hover-elevate active-elevate-2 cursor-pointer h-full" data-testid={`card-project-${project.id}`}>
                      <div className="h-48 bg-muted relative">
                        {images[0] ? (
                          <img 
                            src={images[0]} 
                            alt={project.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Building2 className="h-12 w-12 text-muted-foreground" />
                          </div>
                        )}
                        {project.isFeatured && (
                          <Badge className="absolute top-3 left-3 bg-primary">Featured</Badge>
                        )}
                        {project.projectStage && (
                          <Badge 
                            variant="secondary" 
                            className="absolute top-3 right-3 capitalize"
                          >
                            {project.projectStage.replace(/_/g, " ")}
                          </Badge>
                        )}
                      </div>
                      
                      <div className="p-5">
                        <h3 className="font-semibold text-lg mb-2 line-clamp-1" data-testid={`text-project-name-${project.id}`}>
                          {project.name}
                        </h3>
                        
                        {(project.locality || project.city) && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1 mb-3">
                            <MapPin className="h-4 w-4 flex-shrink-0" />
                            <span className="line-clamp-1">
                              {[project.locality, project.city, project.state].filter(Boolean).join(", ")}
                            </span>
                          </p>
                        )}

                        <div className="flex items-center gap-2 mb-3">
                          <IndianRupee className="h-4 w-4 text-primary" />
                          <span className="font-semibold text-primary">
                            {project.priceRangeMin && project.priceRangeMax ? (
                              <>
                                {formatPrice(project.priceRangeMin)} - {formatPrice(project.priceRangeMax)}
                              </>
                            ) : project.priceRangeMin ? (
                              <>Starting from {formatPrice(project.priceRangeMin)}</>
                            ) : (
                              "Price on Request"
                            )}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="flex items-center gap-1">
                            <Home className="h-3 w-3" />
                            {project.totalUnits || 0} Units
                          </Badge>
                          {project.completionDate && (
                            <Badge variant="outline" className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {new Date(project.completionDate).toLocaleDateString("en-IN", { 
                                month: "short", 
                                year: "numeric" 
                              })}
                            </Badge>
                          )}
                        </div>
                      </div>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
