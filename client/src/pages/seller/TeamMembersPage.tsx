import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { UserPlus, Mail, Phone, Edit, Trash2, Shield } from "lucide-react";

export default function TeamMembersPage() {
  const [members] = useState([
    {
      id: "1",
      name: "Rajesh Kumar",
      email: "rajesh@prestige.com",
      phone: "+91 98765 43210",
      role: "Admin",
      status: "active",
      joinedDate: "Nov 1, 2025",
      listingsManaged: 12,
    },
    {
      id: "2",
      name: "Priya Sharma",
      email: "priya@prestige.com",
      phone: "+91 98765 43211",
      role: "Agent",
      status: "active",
      joinedDate: "Nov 5, 2025",
      listingsManaged: 8,
    },
    {
      id: "3",
      name: "Amit Patel",
      email: "amit@prestige.com",
      phone: "+91 98765 43212",
      role: "Agent",
      status: "inactive",
      joinedDate: "Oct 20, 2025",
      listingsManaged: 5,
    },
  ]);

  const getRoleBadge = (role: string) => {
    if (role === "Admin") {
    return (
        <Badge className="bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-500">
          <Shield className="h-3 w-3 mr-1" />
          Admin
        </Badge>
      );
    }
    return <Badge variant="outline">Agent</Badge>;
  };

  const getStatusBadge = (status: string) => {
    if (status === "active") {
    return (
        <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
          Active
        </Badge>
      );
    }
    return <Badge variant="outline">Inactive</Badge>;
  };

  return (


      <main className="flex-1">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Team Members
              </h1>
              <p className="text-muted-foreground">
                Manage your team and their access
              </p>
      
            <Button data-testid="button-invite">
              <UserPlus className="h-4 w-4 mr-2" />
              Invite Member
            </Button>
    

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Total Members</p>
              <p className="text-3xl font-bold">{members.length}</p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">Active Members</p>
              <p className="text-3xl font-bold">
                {members.filter((m) => m.status === "active").length}
              </p>
            </Card>
            <Card className="p-6">
              <p className="text-sm text-muted-foreground mb-2">
                Total Listings Managed
              </p>
              <p className="text-3xl font-bold">
                {members.reduce((sum, m) => sum + m.listingsManaged, 0)}
              </p>
            </Card>
    

          {/* Members List */}
          <div className="space-y-4">
            {members.map((member) => (
              <Card key={member.id} className="p-6">
                <div className="flex items-start gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="text-lg">
                      {member.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>

                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{member.name}</h3>
                          {getRoleBadge(member.role)}
                          {getStatusBadge(member.status)}
                  
                        <div className="space-y-1 text-sm text-muted-foreground">
                          <div className="flex items-center gap-2">
                            <Mail className="h-4 w-4" />
                            <span>{member.email}</span>
                    
                          <div className="flex items-center gap-2">
                            <Phone className="h-4 w-4" />
                            <span>{member.phone}</span>
                    
                  
                
              

                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Joined Date
                        </p>
                        <p className="font-medium text-sm">{member.joinedDate}</p>
                
                      <div className="p-3 bg-muted rounded-lg">
                        <p className="text-xs text-muted-foreground mb-1">
                          Listings Managed
                        </p>
                        <p className="font-medium text-sm">
                          {member.listingsManaged}
                        </p>
                
              

                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-edit-${member.id}`}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        data-testid={`button-remove-${member.id}`}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Remove
                      </Button>
                      {member.status === "inactive" && (
                        <Button
                          size="sm"
                          data-testid={`button-activate-${member.id}`}
                        >
                          Activate
                        </Button>
                      )}
                      {member.status === "active" && member.role !== "Admin" && (
                        <Button
                          variant="outline"
                          size="sm"
                          data-testid={`button-deactivate-${member.id}`}
                        >
                          Deactivate
                        </Button>
                      )}
              
            
          
              </Card>
            ))}
    
  
      </main>
  );
}
