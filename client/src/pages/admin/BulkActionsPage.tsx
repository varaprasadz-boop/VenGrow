import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, XCircle, Mail, Trash2 } from "lucide-react";

export default function BulkActionsPage() {
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [action, setAction] = useState("");

  const listings = [
    {
      id: "1",
      title: "Luxury 3BHK Apartment",
      seller: "Prestige Estates",
      status: "pending",
      submittedAt: "Nov 24, 2025",
    },
    {
      id: "2",
      title: "Commercial Office Space",
      seller: "DLF Properties",
      status: "pending",
      submittedAt: "Nov 23, 2025",
    },
    {
      id: "3",
      title: "Spacious Villa",
      seller: "Real Estate Pro",
      status: "pending",
      submittedAt: "Nov 22, 2025",
    },
    {
      id: "4",
      title: "2BHK Apartment",
      seller: "Individual Seller",
      status: "pending",
      submittedAt: "Nov 21, 2025",
    },
  ];

  const toggleSelection = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === listings.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(listings.map((l) => l.id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="admin" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="mb-8">
            <h1 className="font-serif font-bold text-3xl mb-2">
              Bulk Actions
            </h1>
            <p className="text-muted-foreground">
              Perform actions on multiple listings at once
            </p>
          </div>

          {/* Bulk Action Bar */}
          {selectedItems.length > 0 && (
            <Card className="p-4 mb-6 bg-blue-50 dark:bg-blue-900/10 border-blue-200 dark:border-blue-900/20">
              <div className="flex items-center gap-4">
                <p className="font-medium">
                  {selectedItems.length} items selected
                </p>
                <Select value={action} onValueChange={setAction}>
                  <SelectTrigger className="w-48" data-testid="select-action">
                    <SelectValue placeholder="Select action" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="approve">Approve All</SelectItem>
                    <SelectItem value="reject">Reject All</SelectItem>
                    <SelectItem value="email">Send Email</SelectItem>
                    <SelectItem value="delete">Delete All</SelectItem>
                  </SelectContent>
                </Select>
                <Button data-testid="button-apply">Apply Action</Button>
                <Button
                  variant="ghost"
                  onClick={() => setSelectedItems([])}
                  data-testid="button-clear"
                >
                  Clear Selection
                </Button>
              </div>
            </Card>
          )}

          {/* Listings Table */}
          <Card>
            <div className="p-4 border-b flex items-center gap-4">
              <Checkbox
                checked={selectedItems.length === listings.length}
                onCheckedChange={toggleSelectAll}
                data-testid="checkbox-select-all"
              />
              <span className="font-medium">Select All</span>
            </div>

            <div className="divide-y">
              {listings.map((listing) => (
                <div
                  key={listing.id}
                  className={`p-6 ${
                    selectedItems.includes(listing.id) ? "bg-blue-50/50 dark:bg-blue-900/5" : ""
                  }`}
                >
                  <div className="flex items-start gap-4">
                    <Checkbox
                      checked={selectedItems.includes(listing.id)}
                      onCheckedChange={() => toggleSelection(listing.id)}
                      data-testid={`checkbox-${listing.id}`}
                    />
                    <div className="flex-1">
                      <h3 className="font-semibold mb-2">{listing.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>
                          <strong>Seller:</strong> {listing.seller}
                        </span>
                        <span>•</span>
                        <span>Submitted: {listing.submittedAt}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-approve-${listing.id}`}
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Approve
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        data-testid={`button-reject-${listing.id}`}
                      >
                        <XCircle className="h-4 w-4 mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-8">
            <Card className="p-6 text-center hover-elevate cursor-pointer">
              <CheckCircle className="h-8 w-8 mx-auto mb-3 text-green-600" />
              <p className="font-medium mb-1">Approve All</p>
              <p className="text-xs text-muted-foreground">
                Approve all pending listings
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate cursor-pointer">
              <XCircle className="h-8 w-8 mx-auto mb-3 text-red-600" />
              <p className="font-medium mb-1">Reject All</p>
              <p className="text-xs text-muted-foreground">
                Reject all pending listings
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate cursor-pointer">
              <Mail className="h-8 w-8 mx-auto mb-3 text-blue-600" />
              <p className="font-medium mb-1">Send Bulk Email</p>
              <p className="text-xs text-muted-foreground">
                Email all selected sellers
              </p>
            </Card>
            <Card className="p-6 text-center hover-elevate cursor-pointer">
              <Trash2 className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <p className="font-medium mb-1">Delete All</p>
              <p className="text-xs text-muted-foreground">
                Delete all rejected listings
              </p>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
