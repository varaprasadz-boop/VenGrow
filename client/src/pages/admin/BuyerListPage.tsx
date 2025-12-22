import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Users,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  RefreshCw,
  AlertCircle,
  Heart,
  MessageSquare,
} from "lucide-react";
import { format } from "date-fns";
import { useState } from "react";
import type { User } from "@shared/schema";

interface BuyerWithStats extends User {
  favoritesCount: number;
  inquiriesCount: number;
}

export default function BuyerListPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const { data: buyers = [], isLoading, isError, refetch } = useQuery<BuyerWithStats[]>({
    queryKey: ["/api/admin/buyers"],
  });

  const filteredBuyers = buyers.filter(buyer =>
    buyer.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    buyer.lastName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-8" />
            <Skeleton className="h-96 w-full" />
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Buyers</h2>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />Retry
            </Button>
          </div>
        </main>
    );
  }

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2 rounded-lg bg-primary/10">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="font-serif font-bold text-3xl">Buyer Accounts</h1>
              <p className="text-muted-foreground">View all registered buyers</p>
            </div>
          </div>

          <Card className="p-6">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search buyers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
                data-testid="input-search"
              />
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Buyer</TableHead>
                    <TableHead>Email Verified</TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Heart className="h-4 w-4" />
                        Favorites
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Inquiries
                      </div>
                    </TableHead>
                    <TableHead className="text-center">Joined</TableHead>
                    <TableHead className="text-center">Status</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredBuyers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        No buyers found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredBuyers.map((buyer) => (
                      <TableRow key={buyer.id} data-testid={`row-buyer-${buyer.id}`}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{buyer.firstName} {buyer.lastName}</p>
                            <p className="text-sm text-muted-foreground">{buyer.email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {buyer.isEmailVerified ? (
                            <CheckCircle className="h-4 w-4 text-green-500" />
                          ) : (
                            <XCircle className="h-4 w-4 text-muted-foreground" />
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{buyer.favoritesCount || 0}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{buyer.inquiriesCount || 0}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          {format(new Date(buyer.createdAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-center">
                          {buyer.isActive ? (
                            <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">Active</Badge>
                          ) : (
                            <Badge variant="secondary">Inactive</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="sm" data-testid={`button-view-${buyer.id}`}>
                            <Eye className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </Card>
        </div>
      </main>
    );
}
