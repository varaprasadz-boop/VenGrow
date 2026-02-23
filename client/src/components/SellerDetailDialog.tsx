import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CheckCircle, MessageSquare, Phone, Mail, Calendar } from "lucide-react";

interface SellerContactVisibility {
  showPhoneNumber?: boolean;
  showEmail?: boolean;
  allowScheduleVisit?: boolean;
}

interface SellerInfo {
  id: string;
  businessName?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  sellerType?: string | null;
  isVerified?: boolean;
  phone?: string | null;
}

interface SellerDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  seller: SellerInfo | null | undefined;
  sellerContactVisibility?: SellerContactVisibility | null;
  contactPhone?: string | null;
  sellerEmail?: string | null;
  onChat?: () => void;
  onScheduleVisit?: () => void;
  validatePhone?: (phone: string) => boolean;
  cleanPhone?: (phone: string) => string;
}

export function SellerDetailDialog({
  open,
  onOpenChange,
  seller,
  sellerContactVisibility,
  contactPhone,
  sellerEmail,
  onChat,
  onScheduleVisit,
  validatePhone = () => false,
  cleanPhone = (p: string) => p.replace(/\D/g, ""),
}: SellerDetailDialogProps) {
  if (!seller) return null;

  const visibility = sellerContactVisibility ?? {};
  const showPhone = visibility.showPhoneNumber !== false;
  const showEmail = visibility.showEmail === true;
  const allowSchedule = visibility.allowScheduleVisit !== false;

  const phone = contactPhone || seller.phone || "";
  const validPhone = showPhone && phone && validatePhone(cleanPhone(phone));
  const whatsappNumber = validPhone ? "91" + cleanPhone(phone) : "";
  const email = showEmail ? (sellerEmail || "") : "";

  const sellerName =
    seller.businessName ||
    `${seller.firstName || ""} ${seller.lastName || ""}`.trim() ||
    "Seller";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Seller details
          </DialogTitle>
          <DialogDescription>
            Contact information is shown according to the seller&apos;s privacy settings.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold">{sellerName}</span>
            {seller.isVerified && (
              <Badge variant="secondary" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Verified
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {seller.sellerType || "Individual"}
            </Badge>
          </div>

          {validPhone && (
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{phone}</span>
            </div>
          )}

          {showEmail && email && (
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{email}</span>
            </div>
          )}

          {allowSchedule && (
            <p className="text-sm text-muted-foreground flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              Schedule a visit is available for this property.
            </p>
          )}

          {!validPhone && !email && !allowSchedule && (
            <p className="text-sm text-muted-foreground">
              Use &quot;Chat with Seller&quot; or &quot;Send Inquiry&quot; to contact the seller.
            </p>
          )}

          <div className="flex flex-col gap-2 pt-2">
            {validPhone && (
              <Button
                className="w-full bg-[#25D366] hover:bg-[#20BD5A] text-white"
                onClick={() => {
                  if (whatsappNumber) window.open(`https://wa.me/${whatsappNumber}`, "_blank");
                }}
              >
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat on WhatsApp
              </Button>
            )}
            {onChat && (
              <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); onChat(); }}>
                <MessageSquare className="h-4 w-4 mr-2" />
                Chat with Seller
              </Button>
            )}
            {allowSchedule && onScheduleVisit && (
              <Button variant="outline" className="w-full" onClick={() => { onOpenChange(false); onScheduleVisit(); }}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule Visit
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
