import { useState } from "react";
import { useLocation } from "wouter";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

export default function ProjectCreatePage() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [selectedState, setSelectedState] = useState("");

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

  const createMutation = useMutation({
    mutationFn: async (data: ProjectFormValues & { status?: string }) => {
      const response = await apiRequest("POST", "/api/seller/projects", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/seller/projects"] });
      toast({ title: "Project created successfully" });
      navigate("/seller/projects");
    },
    onError: (error: any) => {
      toast({ 
        title: "Failed to create project", 
        description: error.message || "Please try again",
        variant: "destructive" 
      });
    },
  });

  const onSubmit = (data: ProjectFormValues, submitForApproval = false) => {
    createMutation.mutate({
      ...data,
      status: submitForApproval ? "pending_approval" : "draft",
    });
  };

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  };

  // Check if seller is allowed to create projects (only brokers and builders)
  const canManageProjects = user?.sellerType && ['broker', 'builder'].includes(user.sellerType);

  // Show restricted access message for individual sellers
  if (!canManageProjects) {
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

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 flex-wrap">
        <Button variant="ghost" size="icon" onClick={() => navigate("/seller/projects")} data-testid="button-back">
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <div>
          <h1 className="font-serif font-bold text-2xl">Create New Project</h1>
          <p className="text-muted-foreground">
            Add a new real estate project to your portfolio
          </p>
        </div>
      </div>

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
                      <Input
                        {...field}
                        placeholder="e.g., Sunrise Heights"
                        onChange={(e) => {
                          field.onChange(e);
                          if (!form.getValues("slug")) {
                            form.setValue("slug", generateSlug(e.target.value));
                          }
                        }}
                        data-testid="input-project-name"
                      />
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
                      <Textarea
                        {...field}
                        placeholder="Describe your project..."
                        rows={4}
                        data-testid="input-project-description"
                      />
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
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              variant="secondary"
              disabled={createMutation.isPending}
              data-testid="button-save-draft"
            >
              <Save className="h-4 w-4 mr-2" />
              Save as Draft
            </Button>
            <Button
              type="button"
              onClick={form.handleSubmit((data) => onSubmit(data, true))}
              disabled={createMutation.isPending}
              data-testid="button-submit-approval"
            >
              <Send className="h-4 w-4 mr-2" />
              Submit for Approval
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
