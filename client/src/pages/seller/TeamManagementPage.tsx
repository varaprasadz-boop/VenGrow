
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Edit, Trash2 } from "lucide-react";

export default function TeamManagementPage() {
  const teamMembers = [
    {
      id: "1",
      name: "Rajesh Kumar",
      role: "Sales Manager",
      email: "rajesh@example.com",
      permissions: ["Manage Listings", "View Analytics"],
      status: "active",
    },
    {
      id: "2",
      name: "Priya Sharma",
      role: "Property Consultant",
      email: "priya@example.com",
      permissions: ["Respond to Inquiries"],
      status: "active",
    },
  ];

  return (
    <main className="flex-1">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2 flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                Team Management
              </h1>
              <p className="text-muted-foreground">
                Manage team members and their permissions
              </p>
            </div>
            <Button data-testid="button-add-member">
              <Plus className="h-4 w-4 mr-2" />
              Add Member
            </Button>
          </div>

          <div className="space-y-4">
            {teamMembers.map((member) => (
              <Card key={member.id} className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-4 flex-1">
                    <Avatar className="h-12 w-12">
                      <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{member.name}</h3>
                        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
                          {member.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-4">
                        {member.role} • {member.email}
                      </p>
                      <div>
                        <p className="text-xs text-muted-foreground mb-2">
                          Permissions:
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {member.permissions.map((permission, index) => (
                            <Badge key={index} variant="outline">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${member.id}`}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      data-testid={`button-remove-${member.id}`}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>
  );
}
