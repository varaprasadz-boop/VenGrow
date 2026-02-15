import { useSearch } from "wouter";
import BuyerBottomNav from "@/components/layouts/BuyerBottomNav";
import { useAuth } from "@/hooks/useAuth";
import { ChatView } from "@/components/ChatView";

export default function BuyerMessagesPage() {
  const { user } = useAuth();
  const search = useSearch();
  const params = new URLSearchParams(search);
  const sellerId = params.get("sellerId") || null;
  const propertyId = params.get("propertyId") || null;

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex flex-col pb-16 lg:pb-8">
        <div className="border-b px-4 py-3">
          <div className="max-w-7xl mx-auto">
            <h1 className="font-serif font-bold text-2xl">Chat</h1>
            <p className="text-sm text-muted-foreground">Chat with sellers about properties</p>
          </div>
        </div>
        <div className="flex-1 min-h-0 flex flex-col max-w-7xl w-full mx-auto px-4 py-4 overflow-hidden">
          {user?.id ? (
            <div className="flex-1 min-h-0 overflow-hidden">
              <ChatView
                currentUserId={user.id}
                initialSellerId={sellerId}
                initialPropertyId={propertyId}
                compact
              />
            </div>
          ) : (
            <div className="flex items-center justify-center h-64 text-muted-foreground">
              Please sign in to view your chat
            </div>
          )}
        </div>
      </main>
      <BuyerBottomNav />
    </div>
  );
}
