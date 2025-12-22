import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building2,
  Search,
  CheckCircle,
  XCircle,
  Eye,
  RefreshCw,
  AlertCircle,
  MapPin,
  Calendar,
  IndianRupee,
} from "lucide-react";
import { formatDistanceToNow, format } from "date-fns";
import { useToast } from "@/hooks/use-toast";
import type { Project } from "@shared/schema";

type ProjectStatus = "draft" | "submitted" | "under_review" | "approved" | "live" | "rejected" | "completed";

export default function ProjectsModerationPage() {
  const [selectedTab, setSelectedTab] = useState<string>("submitted");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [actionType, setActionType] = useState<"approve" | "reject" | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading, isError, refetch } = useQuery<Project[]>({
    queryKey: ["/api/admin/projects", selectedTab],
    queryFn: async () => {
      const status = selectedTab === "all" ? undefined : selectedTab;
      const url = status ? `/api/admin/projects?status=${status}` : "/api/admin/projects";
      const res = await fetch(url, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch projects");
      return res.json();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status, rejectionReason }: { id: string; status: string; rejectionReason?: string }) => {
      const body: Record<string, unknown> = { status };
      if (rejectionReason) body.rejectionReason = rejectionReason;
      const res = await apiRequest("PATCH", `/api/admin/projects/${id}`, body);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/projects"] });
      toast({ title: "Project Updated", description: `Project has been ${actionType === "approve" ? "approved" : "rejected"}.` });
      setSelectedProject(null);
      setActionType(null);
      setRejectionReason("");
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to update project status.", variant: "destructive" });
    },
  });

  const handleApprove = () => {
    if (!selectedProject) return;
    updateStatusMutation.mutate({ id: selectedProject.id, status: "live" });
  };

  const handleReject = () => {
    if (!selectedProject) return;
    updateStatusMutation.mutate({
      id: selectedProject.id,
      status: "rejected",
      rejectionReason,
    });
  };

  const getStatusBadge = (status: ProjectStatus) => {
    switch (status) {
      case "draft":
        return <Badge variant="secondary">Draft</Badge>;
      case "submitted":
        return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-500">Submitted</Badge>;
      case "under_review":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">Under Review</Badge>;
      case "approved":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">Approved</Badge>;
      case "live":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">Live</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "completed":
        return <Badge variant="outline">Completed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.city?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.state?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const submittedCount = projects.filter((p) => p.status === "submitted").length;
  const underReviewCount = projects.filter((p) => p.status === "under_review").length;
  const liveCount = projects.filter((p) => p.status === "live").length;
  const rejectedCount = projects.filter((p) => p.status === "rejected").length;

  if (isLoading) {
    return (
      <main className="flex-1">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-48 mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-24 w-full" />
              ))}
            </div>
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Projects</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading project data.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
    <>
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">Projects Moderation</h1>
            <p className="text-muted-foreground">
              Review and approve seller-submitted real estate projects
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                  <Building2 className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-submitted-count">{submittedCount}</p>
                  <p className="text-sm text-muted-foreground">Pending Review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Eye className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-review-count">{underReviewCount}</p>
                  <p className="text-sm text-muted-foreground">Under Review</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-live-count">{liveCount}</p>
                  <p className="text-sm text-muted-foreground">Live Projects</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold" data-testid="text-rejected-count">{rejectedCount}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search projects by name or location..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search-projects"
              />
            </div>
            <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="submitted" data-testid="tab-submitted">
                Pending ({submittedCount})
              </TabsTrigger>
              <TabsTrigger value="under_review" data-testid="tab-under-review">
                Under Review ({underReviewCount})
              </TabsTrigger>
              <TabsTrigger value="live" data-testid="tab-live">
                Live ({liveCount})
              </TabsTrigger>
              <TabsTrigger value="rejected" data-testid="tab-rejected">
                Rejected ({rejectedCount})
              </TabsTrigger>
              <TabsTrigger value="all" data-testid="tab-all">
                All
              </TabsTrigger>
            </TabsList>

            <TabsContent value={selectedTab} className="mt-0">
              {filteredProjects.length === 0 ? (
                <Card className="p-8 text-center">
                  <Building2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                  <h2 className="font-semibold text-xl mb-2">No Projects Found</h2>
                  <p className="text-muted-foreground">
                    {selectedTab === "submitted"
                      ? "No projects are pending review."
                      : `No projects with status "${selectedTab}".`}
                  </p>
                </Card>
              ) : (
                <div className="space-y-4">
                  {filteredProjects.map((project) => (
                    <Card key={project.id} className="p-6" data-testid={`card-project-${project.id}`}>
                      <div className="flex items-start justify-between flex-wrap gap-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h3 className="font-semibold text-lg" data-testid={`text-project-name-${project.id}`}>
                              {project.name}
                            </h3>
                            {getStatusBadge(project.status as ProjectStatus)}
                          </div>
                          <div className="space-y-1 text-sm text-muted-foreground">
                            <div className="flex items-center gap-2">
                              <MapPin className="h-4 w-4" />
                              <span>{project.city}, {project.state}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <IndianRupee className="h-4 w-4" />
                              <span>
                                {project.priceRangeMin && project.priceRangeMax
                                  ? `${(project.priceRangeMin / 100000).toFixed(1)}L - ${(project.priceRangeMax / 100000).toFixed(1)}L`
                                  : "Price not set"}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Calendar className="h-4 w-4" />
                              <span>
                                Submitted {formatDistanceToNow(new Date(project.createdAt), { addSuffix: true })}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          {(project.status === "submitted" || project.status === "under_review") && (
                            <>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setActionType("reject");
                                }}
                                data-testid={`button-reject-${project.id}`}
                              >
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => {
                                  setSelectedProject(project);
                                  setActionType("approve");
                                }}
                                data-testid={`button-approve-${project.id}`}
                              >
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </Button>
                            </>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => window.open(`/project/${project.slug}`, "_blank")}
                            data-testid={`button-view-${project.id}`}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                        </div>
                      </div>

                      {project.description && (
                        <p className="text-sm text-muted-foreground mt-4 line-clamp-2">
                          {project.description}
                        </p>
                      )}

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 pt-4 border-t">
                        <div>
                          <p className="text-xs text-muted-foreground">Project Stage</p>
                          <p className="text-sm font-medium capitalize">{project.projectStage || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Total Units</p>
                          <p className="text-sm font-medium">{project.totalUnits || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">Completion Date</p>
                          <p className="text-sm font-medium">
                            {project.completionDate
                              ? format(new Date(project.completionDate), "MMM yyyy")
                              : "N/A"}
                          </p>
                        </div>
                        <div>
                          <p className="text-xs text-muted-foreground">RERA Number</p>
                          <p className="text-sm font-medium">{project.reraNumber || "Not Provided"}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={actionType === "approve"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Project</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p>Are you sure you want to approve this project?</p>
            <p className="font-semibold mt-2">{selectedProject?.name}</p>
            <p className="text-sm text-muted-foreground">
              {selectedProject?.city}, {selectedProject?.state}
            </p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button
              onClick={handleApprove}
              disabled={updateStatusMutation.isPending}
              data-testid="button-confirm-approve"
            >
              {updateStatusMutation.isPending ? "Approving..." : "Approve Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={actionType === "reject"} onOpenChange={() => setActionType(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Project</DialogTitle>
          </DialogHeader>
          <div className="py-4 space-y-4">
            <p>Are you sure you want to reject this project?</p>
            <p className="font-semibold">{selectedProject?.name}</p>
            <div className="space-y-2">
              <label className="text-sm font-medium">Rejection Reason</label>
              <Textarea
                placeholder="Please provide a reason for rejection..."
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                rows={4}
                data-testid="textarea-rejection-reason"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActionType(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleReject}
              disabled={updateStatusMutation.isPending || !rejectionReason.trim()}
              data-testid="button-confirm-reject"
            >
              {updateStatusMutation.isPending ? "Rejecting..." : "Reject Project"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
