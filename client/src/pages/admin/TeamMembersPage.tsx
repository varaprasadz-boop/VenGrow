import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { AdminDataTable, AdminPageHeader, StatusBadge, type FilterConfig, type ColumnConfig } from "@/components/admin/AdminDataTable";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2, Loader2, User } from "lucide-react";

interface TeamMember {
  id: string;
  name: string;
  role: string;
  bio: string;
  imageUrl: string;
  linkedinUrl: string;
  twitterUrl: string;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
}

const filters: FilterConfig[] = [
  { key: "search", label: "Name", type: "search", placeholder: "Search team members..." },
  {
    key: "status",
    label: "Status",
    type: "select",
    options: [
      { value: "active", label: "Active" },
      { value: "inactive", label: "Inactive" },
    ]
  }
];

export default function TeamMembersPage() {
  const [editingMember, setEditingMember] = useState<TeamMember | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    bio: "",
    imageUrl: "",
    linkedinUrl: "",
    twitterUrl: "",
    isActive: true,
    sortOrder: 0
  });
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: members = [], isLoading, isError, refetch } = useQuery<TeamMember[]>({
    queryKey: ["/api/admin/team-members"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: typeof formData) => {
      const res = await apiRequest("POST", "/api/admin/team-members", data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team-members"] });
      setIsDialogOpen(false);
      resetForm();
      toast({ title: "Team member created successfully" });
    },
    onError: () => toast({ title: "Failed to create team member", variant: "destructive" }),
  });

  const updateMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: typeof formData }) => {
      const res = await apiRequest("PUT", `/api/admin/team-members/${id}`, data);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team-members"] });
      setIsDialogOpen(false);
      setEditingMember(null);
      resetForm();
      toast({ title: "Team member updated successfully" });
    },
    onError: () => toast({ title: "Failed to update team member", variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      await apiRequest("DELETE", `/api/admin/team-members/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/team-members"] });
      toast({ title: "Team member deleted successfully" });
    },
    onError: () => toast({ title: "Failed to delete team member", variant: "destructive" }),
  });

  const resetForm = () => {
    setFormData({
      name: "",
      role: "",
      bio: "",
      imageUrl: "",
      linkedinUrl: "",
      twitterUrl: "",
      isActive: true,
      sortOrder: 0
    });
  };

  const openEditDialog = (member: TeamMember) => {
    setEditingMember(member);
    setFormData({
      name: member.name,
      role: member.role || "",
      bio: member.bio || "",
      imageUrl: member.imageUrl || "",
      linkedinUrl: member.linkedinUrl || "",
      twitterUrl: member.twitterUrl || "",
      isActive: member.isActive ?? true,
      sortOrder: member.sortOrder || 0,
    });
    setIsDialogOpen(true);
  };

  const openCreateDialog = () => {
    setEditingMember(null);
    resetForm();
    setIsDialogOpen(true);
  };

  const handleSubmit = () => {
    if (editingMember) {
      updateMutation.mutate({ id: editingMember.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns: ColumnConfig<TeamMember>[] = [
    {
      key: "name",
      header: "Team Member",
      render: (member) => (
        <div className="flex items-center gap-3">
          {member.imageUrl ? (
            <img src={member.imageUrl} alt={member.name} className="h-10 w-10 rounded-full object-cover" />
          ) : (
            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
              <User className="h-5 w-5 text-muted-foreground" />
            </div>
          )}
          <div>
            <p className="font-medium">{member.name}</p>
            <p className="text-sm text-muted-foreground">{member.role}</p>
          </div>
        </div>
      ),
    },
    {
      key: "bio",
      header: "Bio",
      render: (member) => (
        <p className="text-sm text-muted-foreground line-clamp-2 max-w-xs">{member.bio || "-"}</p>
      )
    },
    {
      key: "linkedinUrl",
      header: "Social",
      render: (member) => (
        <div className="flex gap-2">
          {member.linkedinUrl && (
            <a href={member.linkedinUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
              LinkedIn
            </a>
          )}
          {member.twitterUrl && (
            <a href={member.twitterUrl} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline text-sm">
              Twitter
            </a>
          )}
          {!member.linkedinUrl && !member.twitterUrl && <span className="text-muted-foreground">-</span>}
        </div>
      )
    },
    { 
      key: "sortOrder", 
      header: "Order",
      render: (member) => <span>{member.sortOrder || 0}</span>
    },
    {
      key: "isActive",
      header: "Status",
      render: (member) => <StatusBadge active={member.isActive ?? true} />,
    },
  ];

  const filterFn = (member: TeamMember, filters: Record<string, string>) => {
    const searchMatch = !filters.search || 
      member.name.toLowerCase().includes(filters.search.toLowerCase()) ||
      (member.role && member.role.toLowerCase().includes(filters.search.toLowerCase()));
    
    const statusMatch = !filters.status || filters.status === "all" ||
      (filters.status === "active" && member.isActive) ||
      (filters.status === "inactive" && !member.isActive);
    
    return searchMatch && statusMatch;
  };

  const isMutating = createMutation.isPending || updateMutation.isPending;

  return (
    <>
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <AdminPageHeader
            title="Team Members"
            description="Manage team members displayed on the About page"
          />

          <AdminDataTable
            data={members}
            columns={columns}
            filters={filters}
            isLoading={isLoading}
            isError={isError}
            onRefresh={refetch}
            onAddNew={openCreateDialog}
            addNewLabel="Add Member"
            emptyMessage="No team members found. Add your first team member to get started."
            getRowKey={(m) => m.id}
            filterFn={filterFn}
            actions={(member) => (
              <>
                <Button variant="ghost" size="icon" onClick={() => openEditDialog(member)} data-testid={`button-edit-${member.id}`}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={() => deleteMutation.mutate(member.id)}
                  disabled={deleteMutation.isPending}
                  data-testid={`button-delete-${member.id}`}
                >
                  <Trash2 className="h-4 w-4 text-destructive" />
                </Button>
              </>
            )}
          />
        </div>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editingMember ? "Edit Team Member" : "Add New Team Member"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4 max-h-[60vh] overflow-y-auto">
            <div className="space-y-2">
              <Label htmlFor="name">Full Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Rajesh Kumar"
                data-testid="input-name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role / Title</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                placeholder="e.g., Founder & CEO"
                data-testid="input-role"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="imageUrl">Profile Image URL</Label>
              <Input
                id="imageUrl"
                value={formData.imageUrl}
                onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                placeholder="https://..."
                data-testid="input-image-url"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Brief biography..."
                rows={3}
                data-testid="input-bio"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="linkedinUrl">LinkedIn URL</Label>
                <Input
                  id="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={(e) => setFormData({ ...formData, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/in/..."
                  data-testid="input-linkedin"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="twitterUrl">Twitter URL</Label>
                <Input
                  id="twitterUrl"
                  value={formData.twitterUrl}
                  onChange={(e) => setFormData({ ...formData, twitterUrl: e.target.value })}
                  placeholder="https://twitter.com/..."
                  data-testid="input-twitter"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="sortOrder">Sort Order</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: parseInt(e.target.value) || 0 })}
                  data-testid="input-sort-order"
                />
              </div>
              <div className="flex items-center gap-2 pt-6">
                <Switch
                  id="isActive"
                  checked={formData.isActive}
                  onCheckedChange={(checked) => setFormData({ ...formData, isActive: checked })}
                  data-testid="switch-active"
                />
                <Label htmlFor="isActive">Active</Label>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} data-testid="button-cancel">
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isMutating} data-testid="button-save">
              {isMutating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              {editingMember ? "Update" : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
