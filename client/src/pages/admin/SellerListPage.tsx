import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Building,
  Search,
  Filter,
  Download,
  Eye,
  Calendar,
  MessageSquare,
  CheckCircle,
  Clock,
  XCircle,
  RefreshCw,
  AlertCircle,
  User,
  Briefcase,
  Building2,
  BadgeCheck,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { formatDistanceToNow, format } from "date-fns";
import { useState } from "react";
import { exportToCSV } from "@/lib/utils";

interface SellerWithStats {
  id: string;
  userId: string;
  companyName: string | null;
  sellerType: string;
  verificationStatus: string;
  totalListings: number;
  liveAt: string | null;
  createdAt: string;
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    phone: string | null;
  };
  livePropertiesCount: number;
  totalInquiries: number;
  isVerifiedBuilder?: boolean;
  logoUrl?: string | null;
}

export default function SellerListPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sellers = [], isLoading, isError, refetch } = useQuery<SellerWithStats[]>({
    queryKey: ["/api/admin/sellers/stats"],
  });

  const toggleVerifiedBuilderMutation = useMutation({
    mutationFn: async (sellerId: string) => {
      const response = await apiRequest("POST", `/api/admin/sellers/${sellerId}/toggle-verified-builder`);
      return response.json();
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["/api/admin/sellers/stats"] });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/verified-builders"] });
      toast({
        title: result.isVerifiedBuilder ? "Added to Verified Builders" : "Removed from Verified Builders",
        description: result.message,
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to toggle verified builder status",
        variant: "destructive",
      });
    },
  });

  const filteredSellers = sellers.filter(seller => {
    const matchesSearch = 
      (seller.companyName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (seller.user?.email?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (seller.user?.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) || false) ||
      (seller.user?.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) || false);

    const matchesStatus = statusFilter === "all" || seller.verificationStatus === statusFilter;
    const matchesType = typeFilter === "all" || 
      seller.sellerType === typeFilter || 
      (typeFilter === "corporate" && seller.sellerType === "builder");

    return matchesSearch && matchesStatus && matchesType;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "verified":
        return (
          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-500">
            <CheckCircle className="h-3 w-3 mr-1" />
            Verified
          </Badge>
        );
      case "pending":
        return (
          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-500">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case "rejected":
        return (
          <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-500">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getSellerName = (seller: SellerWithStats) => {
    if (seller.companyName) return seller.companyName;
    if (seller.user?.firstName || seller.user?.lastName) {
      return `${seller.user.firstName || ''} ${seller.user.lastName || ''}`.trim();
    }
    return seller.user?.email || "Unknown Seller";
  };

  const getNormalizedSellerType = (sellerType: string): "individual" | "broker" | "corporate" => {
    if (sellerType === "corporate" || sellerType === "builder") return "corporate";
    if (sellerType === "broker") return "broker";
    return "individual";
  };

  const isCorporateSeller = (seller: SellerWithStats): boolean => {
    return getNormalizedSellerType(seller.sellerType) === "corporate";
  };

  const handleExport = () => {
    const exportData = filteredSellers.map(seller => ({
      name: getSellerName(seller),
      email: seller.user?.email || "",
      phone: seller.user?.phone || "",
      sellerType: seller.sellerType,
      verificationStatus: seller.verificationStatus,
      totalListings: seller.totalListings,
      liveListings: seller.livePropertiesCount,
      totalInquiries: seller.totalInquiries,
      isVerifiedBuilder: seller.isVerifiedBuilder ? "Yes" : "No",
      registeredOn: format(new Date(seller.createdAt), "yyyy-MM-dd"),
    }));

    exportToCSV(exportData, `sellers_export_${format(new Date(), 'yyyy-MM-dd')}`, [
      { key: 'name', header: 'Seller Name' },
      { key: 'email', header: 'Email' },
      { key: 'phone', header: 'Phone' },
      { key: 'sellerType', header: 'Seller Type' },
      { key: 'verificationStatus', header: 'Status' },
      { key: 'totalListings', header: 'Total Listings' },
      { key: 'liveListings', header: 'Live Listings' },
      { key: 'totalInquiries', header: 'Total Inquiries' },
      { key: 'isVerifiedBuilder', header: 'Verified Builder' },
      { key: 'registeredOn', header: 'Registered On' },
    ]);
  };

  if (isLoading) {
    return (
      <main className="flex-1 bg-muted/30">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <Skeleton className="h-10 w-64 mb-2" />
            <Skeleton className="h-6 w-96 mb-8" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-16 w-full" />
              ))}
            </div>
          </div>
        </main>
    );
  }

  if (isError) {
    return (
      <main className="flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center p-8">
            <AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive" />
            <h2 className="text-xl font-semibold mb-2">Failed to Load Sellers</h2>
            <p className="text-muted-foreground mb-4">
              There was an error loading the seller data.
            </p>
            <Button onClick={() => refetch()} data-testid="button-retry">
              <RefreshCw className="h-4 w-4 mr-2" />
              Retry
            </Button>
          </div>
        </main>
    );
  }

  const stats = {
    total: sellers.length,
    verified: sellers.filter(s => s.verificationStatus === "verified").length,
    pending: sellers.filter(s => s.verificationStatus === "pending").length,
    rejected: sellers.filter(s => s.verificationStatus === "rejected").length,
  };

  return (
      <main className="flex-1 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <div>
              <h1 className="font-serif font-bold text-3xl mb-2">
                Seller Management
              </h1>
              <p className="text-muted-foreground">
                View and manage all registered sellers with their statistics
              </p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => refetch()} data-testid="button-refresh">
                <RefreshCw className="h-4 w-4 mr-2" />
                Refresh
              </Button>
              <Button variant="outline" onClick={handleExport} data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Building className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.total}</p>
                  <p className="text-sm text-muted-foreground">Total Sellers</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-100 dark:bg-green-900/20">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.verified}</p>
                  <p className="text-sm text-muted-foreground">Verified</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                  <Clock className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.pending}</p>
                  <p className="text-sm text-muted-foreground">Pending</p>
                </div>
              </div>
            </Card>
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-100 dark:bg-red-900/20">
                  <XCircle className="h-5 w-5 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{stats.rejected}</p>
                  <p className="text-sm text-muted-foreground">Rejected</p>
                </div>
              </div>
            </Card>
          </div>

          <Card className="p-6">
            {/* Seller Type Tabs */}
            <div className="mb-6">
              <Tabs value={typeFilter} onValueChange={setTypeFilter} className="w-full">
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="all" className="flex items-center gap-2" data-testid="tab-all">
                    <Building className="h-4 w-4" />
                    All
                  </TabsTrigger>
                  <TabsTrigger value="individual" className="flex items-center gap-2" data-testid="tab-individual">
                    <User className="h-4 w-4" />
                    Individual
                  </TabsTrigger>
                  <TabsTrigger value="broker" className="flex items-center gap-2" data-testid="tab-broker">
                    <Briefcase className="h-4 w-4" />
                    Broker
                  </TabsTrigger>
                  <TabsTrigger value="corporate" className="flex items-center gap-2" data-testid="tab-corporate">
                    <Building2 className="h-4 w-4" />
                    Corporate
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>

            {/* Search and Status Filter */}
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, company, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]" data-testid="select-status">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Seller</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    {(typeFilter === "corporate" || typeFilter === "all") && (
                      <TableHead className="text-center">
                        <div className="flex items-center justify-center gap-1">
                          <BadgeCheck className="h-4 w-4" />
                          Verified Builder
                        </div>
                      </TableHead>
                    )}
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Live Since
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Building className="h-4 w-4" />
                        Properties Live
                      </div>
                    </TableHead>
                    <TableHead className="text-center">
                      <div className="flex items-center justify-center gap-1">
                        <MessageSquare className="h-4 w-4" />
                        Total Enquiries
                      </div>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredSellers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={(typeFilter === "corporate" || typeFilter === "all") ? 8 : 7} className="text-center py-8 text-muted-foreground">
                        No sellers found matching your criteria
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSellers.map((seller) => (
                      <TableRow key={seller.id} data-testid={`row-seller-${seller.id}`}>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            {isCorporateSeller(seller) && seller.logoUrl ? (
                              <img 
                                src={seller.logoUrl} 
                                alt={seller.companyName || "Company"} 
                                className="h-10 w-10 rounded-lg object-contain bg-muted"
                              />
                            ) : isCorporateSeller(seller) ? (
                              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                                <Building2 className="h-5 w-5 text-muted-foreground" />
                              </div>
                            ) : null}
                            <div>
                              <p className="font-medium">{getSellerName(seller)}</p>
                              <p className="text-sm text-muted-foreground">{seller.user?.email}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {getNormalizedSellerType(seller.sellerType) === "corporate" ? (
                              <span className="flex items-center gap-1">
                                <Building2 className="h-3 w-3" />
                                Corporate
                              </span>
                            ) : getNormalizedSellerType(seller.sellerType) === "broker" ? (
                              <span className="flex items-center gap-1">
                                <Briefcase className="h-3 w-3" />
                                Broker
                              </span>
                            ) : (
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                Individual
                              </span>
                            )}
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(seller.verificationStatus)}</TableCell>
                        {(typeFilter === "corporate" || typeFilter === "all") && (
                          <TableCell className="text-center">
                            {isCorporateSeller(seller) ? (
                              <div className="flex items-center justify-center gap-2">
                                <Switch
                                  checked={seller.isVerifiedBuilder || false}
                                  onCheckedChange={() => {
                                    toggleVerifiedBuilderMutation.mutate(seller.id);
                                  }}
                                  disabled={toggleVerifiedBuilderMutation.isPending}
                                  data-testid={`switch-verified-${seller.id}`}
                                />
                                {seller.isVerifiedBuilder && (
                                  <BadgeCheck className="h-4 w-4 text-primary" />
                                )}
                              </div>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                        )}
                        <TableCell className="text-center">
                          {seller.liveAt ? (
                            <div>
                              <p className="font-medium">{format(new Date(seller.liveAt), "MMM d, yyyy")}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(new Date(seller.liveAt), { addSuffix: true })}
                              </p>
                            </div>
                          ) : (
                            <span className="text-muted-foreground">-</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold text-primary">{seller.livePropertiesCount}</span>
                        </TableCell>
                        <TableCell className="text-center">
                          <span className="font-semibold">{seller.totalInquiries}</span>
                        </TableCell>
                        <TableCell className="text-right">
                          <Link href={`/admin/seller/${seller.id}`}>
                            <Button variant="ghost" size="sm" data-testid={`button-view-${seller.id}`}>
                              <Eye className="h-4 w-4" />
                            </Button>
                          </Link>
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
