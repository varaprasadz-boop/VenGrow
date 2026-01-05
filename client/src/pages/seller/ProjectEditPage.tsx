import { useState, useEffect } from "react";
import { useLocation, useParams } from "wouter";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { StateSelect, CitySelect } from "@/components/ui/location-select";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { ArrowLeft, Save, Send, AlertCircle, Plus } from "lucide-react";
import type { Project } from "@shared/schema";

const projectFormSchema = z.object({
  name: z.string().min(3, "Project name must be at least 3 characters"),
  slug: z.string().min(3, "Slug must be at least 3 characters").regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().optional(),
  address: z.string().optional(),
  locality: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  pincode: z.string().optional(),
  projectStage: z.enum(["pre_launch", "under_construction", "ready_to_move", "completed"]),
  reraNumber: z.string().optional(),
  totalUnits: z.coerce.number().optional(),
  availableUnits: z.coerce.number().optional(),
  priceRangeMin: z.coerce.number().optional(),
  priceRangeMax: z.coerce.number().optional(),
  areaRangeMin: z.coerce.number().optional(),
  areaRangeMax: z.coerce.number().optional(),
  bannerImage: z.string().optional(),
  youtubeVideoUrl: z.string().optional(),
});

type ProjectFormValues = z.infer<typeof projectFormSchema>;

export default function ProjectEditPage() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const params = useParams<{ id: string }>();
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState("");

  const { data: project, isLoading } = useQuery<Project>({
    queryKey: ["/api/projects", params.id],
    enabled: !!params.id,
  });

  const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: {
      name: "",
      slug: "",
      description: "",
      address: "",
      locality: "",
      city: "",
      state: "",
      pincode: "",
      projectStage: "under_construction",
      reraNumber: "",
      totalUnits: undefined,
      availableUnits: undefined,
      priceRangeMin: undefined,
      priceRangeMax: undefined,
      areaRangeMin: undefined,
      areaRangeMax: undefined,
      bannerImage: "",
      youtubeVideoUrl: "",
    },
  });

  useEffect(() => {
    if (project) {
      setSelectedState(project.state);
      form.reset({
        name: project.name,
        slug: project.slug,
        description: project.description || "",
        address: project.address || "",
        locality: project.locality || "",
        city: project.city,
        state: project.state,
        pincode: project.pincode || "",
        projectStage: project.projectStage as any,
        reraNumber: project.reraNumber || "",
        totalUnits: project.totalUnits || undefined,
        availableUnits: project.availableUnits || undefined,
        priceRangeMin: project.priceRangeMin || undefined,
        priceRangeMax: project.priceRangeMax || undefined,
        areaRangeMin: project.areaRangeMin || undefined,
        areaRangeMax: project.areaRangeMax || undefined,
        bannerImage: project.bannerImage || "",
        youtubeVideoUrl: project.youtubeVideoUrl || "",
      });
    }
  }, [project, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: ProjectFormValues & { status?: string }) => {
      const response = await apiRequest("PATCH", `/api/seller/projects/${params.id}`, data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/projects"] });
      queryClient.invalidateQueries({ queryKey: ["/api/projects", params.id] });
      toast({ title: "Project updated successfully" });
      navigate("/seller/projects");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to update project", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: ProjectFormValues, submitForApproval = false) => {
    const updateData: any = { ...data };
    if (submitForApproval && project?.status === 'draft') {
      updateData.status = 'pending_approval';
    }
    updateMutation.mutate(updateData);
  };


  const getStatusBadge = (status: string) => {
    switch (status) {
      case "live":
        return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">Live</Badge>;
      case "pending_approval":
        return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">Pending Approval</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="secondary">Draft</Badge>;
    }
  };

  // Check if seller is allowed to manage projects (only brokers and builders)
  const canManageProjects = user?.sellerType && ['broker', 'builder'].includes(user.sellerType);

  // Show loading state first, before checking restrictions
  if (authLoading || isLoading) {
    return (
      <div className="p-6 space-y-6">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-96 w-full" />
      </div>
    );
  }

  // Show restricted access message for individual sellers (only after auth loaded)
  if (user && !canManageProjects) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[60vh]">
        <Card className="p-8 max-w-lg text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
          <h2 className="font-serif font-bold text-2xl mb-3">Projects Not Available</h2>
          <p className="text-muted-foreground mb-6">
            Projects are only available for Brokers and Builders. As an Individual seller, 
            you can create individual property listings instead.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Button onClick={() => navigate("/seller/property/add")} data-testid="button-add-property">
              <Plus className="h-4 w-4 mr-2" />
              Add Property
            </Button>
            <Button variant="outline" onClick={() => navigate("/seller/dashboard")} data-testid="button-go-dashboard">
              Go to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="p-6">
        <Card className="p-12 text-center">
          <AlertCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
          <h2 className="font-semibold text-xl mb-2">Project not found</h2>
          <p className="text-muted-foreground mb-6">
            The project you're looking for doesn't exist or you don't have access to it.
          </p>
          <Button onClick={() => navigate("/seller/projects")} data-testid="button-back-to-projects">
            Back to Projects
          </Button>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/seller/projects")} data-testid="button-back">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="font-serif font-bold text-2xl">Edit Project</h1>
            <p className="text-muted-foreground">{project.name}</p>
          </div>
        </div>
        {getStatusBadge(project.status)}
      </div>

      {project.status === 'rejected' && project.rejectionReason && (
        <Card className="p-4 border-destructive bg-destructive/5">
          <div className="flex gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div>
              <p className="font-medium text-destructive">Rejection Reason</p>
              <p className="text-sm text-muted-foreground">{project.rejectionReason}</p>
            </div>
          </div>
        </Card>
      )}

      <Form {...form}>
        <form onSubmit={form.handleSubmit((data) => onSubmit(data, false))} className="space-y-6">
          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Name *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Sunrise Heights" data-testid="input-project-name" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>URL Slug *</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="sunrise-heights" data-testid="input-project-slug" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Describe your project..." rows={4} data-testid="input-project-description" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="projectStage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Project Stage *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-project-stage">
                          <SelectValue placeholder="Select stage" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="pre_launch">Pre-Launch</SelectItem>
                        <SelectItem value="under_construction">Under Construction</SelectItem>
                        <SelectItem value="ready_to_move">Ready to Move</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="reraNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>RERA Number</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., P52000012345" data-testid="input-rera-number" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Location</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State *</FormLabel>
                    <FormControl>
                      <StateSelect
                        value={field.value || ""}
                        onValueChange={(value) => {
                          field.onChange(value);
                          setSelectedState(value);
                          form.setValue("city", "");
                        }}
                        data-testid="select-state"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>City *</FormLabel>
                    <FormControl>
                      <CitySelect
                        value={field.value || ""}
                        onValueChange={field.onChange}
                        stateValue={selectedState}
                        data-testid="select-city"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="locality"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Locality</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., Bandra West" data-testid="input-locality" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="pincode"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>PIN Code</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="e.g., 400050" data-testid="input-pincode" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Full Address</FormLabel>
                    <FormControl>
                      <Textarea {...field} placeholder="Enter complete address" rows={2} data-testid="input-address" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Units & Pricing</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <FormField
                control={form.control}
                name="totalUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Units</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 200" data-testid="input-total-units" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="availableUnits"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Available Units</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 50" data-testid="input-available-units" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceRangeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Price (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 5000000" data-testid="input-price-min" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="priceRangeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Price (INR)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 15000000" data-testid="input-price-max" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaRangeMin"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Min Area (sq.ft.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 800" data-testid="input-area-min" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="areaRangeMax"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Max Area (sq.ft.)</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} placeholder="e.g., 2500" data-testid="input-area-max" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="font-semibold text-lg mb-4">Media</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="bannerImage"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Banner Image URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://..." data-testid="input-banner-image" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="youtubeVideoUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube Video URL</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="https://youtube.com/watch?v=..." data-testid="input-youtube-url" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </Card>

          <div className="flex items-center justify-end gap-4 flex-wrap">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/seller/projects")}
              data-testid="button-cancel"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={updateMutation.isPending}
              data-testid="button-save"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Changes
            </Button>
            {project.status === 'draft' && (
              <Button
                type="button"
                onClick={form.handleSubmit((data) => onSubmit(data, true))}
                disabled={updateMutation.isPending}
                data-testid="button-submit-approval"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit for Approval
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
