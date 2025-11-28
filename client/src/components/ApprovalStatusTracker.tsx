import { Link } from "wouter";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileEdit,
  Send,
  ArrowRight,
  Home,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { Property } from "@shared/schema";

interface ApprovalStatusTrackerProps {
  properties: Property[];
  isLoading?: boolean;
}

const statusConfig: Record<string, { 
  label: string; 
  icon: typeof Clock; 
  color: string;
  bgColor: string;
  step: number;
}> = {
  draft: { 
    label: "Draft", 
    icon: FileEdit, 
    color: "text-muted-foreground",
    bgColor: "bg-muted",
    step: 1,
  },
  submitted: { 
    label: "Submitted", 
    icon: Send, 
    color: "text-blue-600 dark:text-blue-400",
    bgColor: "bg-blue-100 dark:bg-blue-950/50",
    step: 2,
  },
  under_review: { 
    label: "Under Review", 
    icon: Clock, 
    color: "text-yellow-600 dark:text-yellow-400",
    bgColor: "bg-yellow-100 dark:bg-yellow-950/50",
    step: 3,
  },
  approved: { 
    label: "Approved", 
    icon: CheckCircle, 
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/50",
    step: 4,
  },
  live: { 
    label: "Live", 
    icon: CheckCircle, 
    color: "text-green-600 dark:text-green-400",
    bgColor: "bg-green-100 dark:bg-green-950/50",
    step: 5,
  },
  needs_reapproval: { 
    label: "Needs Re-approval", 
    icon: AlertCircle, 
    color: "text-orange-600 dark:text-orange-400",
    bgColor: "bg-orange-100 dark:bg-orange-950/50",
    step: 3,
  },
  rejected: { 
    label: "Rejected", 
    icon: XCircle, 
    color: "text-red-600 dark:text-red-400",
    bgColor: "bg-red-100 dark:bg-red-950/50",
    step: 0,
  },
};

function getStatusProgress(status: string): number {
  const config = statusConfig[status];
  if (!config) return 0;
  return (config.step / 5) * 100;
}

export function ApprovalStatusTracker({ properties, isLoading }: ApprovalStatusTrackerProps) {
  const pendingProperties = properties.filter(
    (p) => p.workflowStatus && !["live", "rejected"].includes(p.workflowStatus)
  );
  
  const rejectedProperties = properties.filter(
    (p) => p.workflowStatus === "rejected"
  );

  const liveProperties = properties.filter(
    (p) => p.workflowStatus === "live" || p.status === "active"
  );

  if (isLoading) {
    return (
      <Card className="p-6">
        <Skeleton className="h-6 w-48 mb-4" />
        <div className="space-y-4">
          <Skeleton className="h-20 w-full" />
          <Skeleton className="h-20 w-full" />
        </div>
      </Card>
    );
  }

  if (pendingProperties.length === 0 && rejectedProperties.length === 0) {
    return null;
  }

  return (
    <Card className="p-6 mb-8">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg">Approval Status</h3>
        <Badge variant="outline">
          {pendingProperties.length} pending • {liveProperties.length} live
        </Badge>
      </div>

      {pendingProperties.length > 0 && (
        <div className="space-y-4 mb-4">
          {pendingProperties.slice(0, 3).map((property) => {
            const status = property.workflowStatus || "draft";
            const config = statusConfig[status] || statusConfig.draft;
            const Icon = config.icon;
            const progress = getStatusProgress(status);

            return (
              <div
                key={property.id}
                className="border rounded-lg p-4 hover-elevate"
                data-testid={`approval-tracker-${property.id}`}
              >
                <div className="flex items-start justify-between gap-4 mb-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className={`p-2 rounded-lg ${config.bgColor} shrink-0`}>
                      <Icon className={`h-4 w-4 ${config.color}`} />
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-medium line-clamp-1">{property.title}</h4>
                      <p className="text-sm text-muted-foreground">
                        {property.locality ? `${property.locality}, ` : ""}{property.city}
                      </p>
                    </div>
                  </div>
                  <Badge className={`${config.bgColor} ${config.color} border-0 shrink-0`}>
                    {config.label}
                  </Badge>
                </div>

                <div className="mb-3">
                  <div className="flex justify-between text-xs text-muted-foreground mb-1">
                    <span>Progress</span>
                    <span>{Math.round(progress)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {property.updatedAt
                        ? formatDistanceToNow(new Date(property.updatedAt), { addSuffix: true })
                        : "Recently"}
                    </span>
                  </div>
                  <Link href={`/seller/properties/${property.id}`}>
                    <Button 
                      variant="ghost" 
                      size="sm"
                      data-testid={`button-view-property-${property.id}`}
                    >
                      View Details
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                  </Link>
                </div>

                {status === "draft" && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-2">
                      Complete your listing and submit it for review
                    </p>
                    <Link href={`/seller/properties/${property.id}/edit`}>
                      <Button 
                        size="sm"
                        data-testid={`button-continue-editing-${property.id}`}
                      >
                        <FileEdit className="h-3 w-3 mr-1" />
                        Continue Editing
                      </Button>
                    </Link>
                  </div>
                )}

                {status === "needs_reapproval" && (
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm text-yellow-600 dark:text-yellow-400">
                      Your edits need admin approval before going live
                    </p>
                  </div>
                )}
              </div>
            );
          })}

          {pendingProperties.length > 3 && (
            <Link href="/seller/listings">
              <Button 
                variant="outline" 
                className="w-full"
                data-testid="button-view-all-pending"
              >
                View All {pendingProperties.length} Pending Properties
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
          )}
        </div>
      )}

      {rejectedProperties.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="font-medium text-red-600 dark:text-red-400 mb-3 flex items-center gap-2">
            <XCircle className="h-4 w-4" />
            Rejected Properties ({rejectedProperties.length})
          </h4>
          <div className="space-y-2">
            {rejectedProperties.slice(0, 2).map((property) => (
              <div
                key={property.id}
                className="flex items-center justify-between p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-900"
              >
                <div className="flex items-center gap-3">
                  <Home className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium text-sm">{property.title}</p>
                    {property.rejectionReason && (
                      <p className="text-xs text-red-600 dark:text-red-400">
                        Reason: {property.rejectionReason}
                      </p>
                    )}
                  </div>
                </div>
                <Link href={`/seller/properties/${property.id}/edit`}>
                  <Button 
                    variant="outline" 
                    size="sm"
                    data-testid={`button-resubmit-${property.id}`}
                  >
                    <FileEdit className="h-3 w-3 mr-1" />
                    Edit & Resubmit
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  );
}
