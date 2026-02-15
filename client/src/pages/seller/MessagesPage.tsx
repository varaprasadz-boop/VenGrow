import { useAuth } from "@/hooks/useAuth";
import { ChatView } from "@/components/ChatView";

export default function MessagesPage() {
  const { user } = useAuth();

  return (
    <main className="flex-1 flex flex-col min-h-0">
      <div className="border-b p-4">
        <h1 className="font-serif font-bold text-2xl">Chat</h1>
        <p className="text-sm text-muted-foreground">Chat with buyers about your properties</p>
      </div>
      <div className="flex-1 min-h-0 flex flex-col p-4 overflow-hidden">
        {user?.id ? (
          <div className="flex-1 min-h-0 overflow-hidden">
            <ChatView currentUserId={user.id} compact />
          </div>
        ) : (
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            Please sign in to view your chat
          </div>
        )}
      </div>
    </main>
  );
}
