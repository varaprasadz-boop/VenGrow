import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Shield, Users, Edit } from "lucide-react";

export default function UserRolesPage() {
  const roles = [
    {
      id: "1",
      name: "Super Admin",
      users: 2,
      permissions: [
        "Full system access",
        "Manage all users",
        "Configure settings",
        "View all data",
      ],
      editable: false,
    },
    {
      id: "2",
      name: "Admin",
      users: 5,
      permissions: [
        "Manage users",
        "Moderate content",
        "View analytics",
        "Manage listings",
      ],
      editable: true,
    },
    {
      id: "3",
      name: "Seller - Verified",
      users: 1234,
      permissions: [
        "Create listings",
        "Manage own listings",
        "View inquiries",
        "Access analytics",
      ],
      editable: true,
    },
    {
      id: "4",
      name: "Buyer",
      users: 5678,
      permissions: [
        "Search properties",
        "Save favorites",
        "Contact sellers",
        "View property details",
      ],
      editable: true,
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                User Roles & Permissions
              </h1>
              <p className="text-muted-foreground">
                Manage user roles and access controls
              </p>
            </div>
            <Button data-testid="button-create-role">
              <Shield className="h-4 w-4 mr-2" />
              Create Role
            </Button>
          </div>

          <div className="space-y-6">
            {roles.map((role) => (
              <Card key={role.id} className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold text-lg">{role.name}</h3>
                      {!role.editable && (
                        <Badge variant="outline">System Role</Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{role.users.toLocaleString()} users</span>
                    </div>
                  </div>
                  {role.editable && (
                    <Button
                      variant="outline"
                      size="sm"
                      data-testid={`button-edit-${role.id}`}
                    >
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Role
                    </Button>
                  )}
                </div>

                <div>
                  <h4 className="font-medium mb-4">Permissions</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {role.permissions.map((permission, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-muted rounded-lg"
                      >
                        <span className="text-sm">{permission}</span>
                        <Switch
                          defaultChecked
                          disabled={!role.editable}
                          data-testid={`switch-${role.id}-${index}`}
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
