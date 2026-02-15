import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import { Search, Send, MessageSquare } from "lucide-react";
import type { ChatThread, ChatMessage } from "@shared/schema";

export interface EnrichedThread extends ChatThread {
  otherParticipantName?: string;
  propertyTitle?: string | null;
}

interface ChatViewProps {
  currentUserId: string;
  /** When set, ensure we have a thread with this seller (profile id) and property, then select it */
  initialSellerId?: string | null;
  initialPropertyId?: string | null;
  /** Compact mode for use inside layout (no card wrapper) */
  compact?: boolean;
}

export function ChatView({
  currentUserId,
  initialSellerId,
  initialPropertyId,
  compact = false,
}: ChatViewProps) {
  const { toast } = useToast();
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const initialThreadKeyRef = useRef<string | null>(null);

  const { data: threads = [], isLoading: threadsLoading } = useQuery<EnrichedThread[]>({
    queryKey: ["/api/me/chats"],
    queryFn: async () => {
      const res = await fetch("/api/me/chats", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load chats");
      return res.json();
    },
    enabled: !!currentUserId,
  });

  const { data: chatData, isLoading: messagesLoading } = useQuery<{ thread: ChatThread; messages: ChatMessage[] }>({
    queryKey: ["/api/chats", selectedThreadId],
    queryFn: async () => {
      const res = await fetch(`/api/chats/${selectedThreadId}`, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to load messages");
      return res.json();
    },
    enabled: !!selectedThreadId,
  });

  const createOrGetThread = useMutation({
    mutationFn: async (params: { buyerId: string; sellerId: string; propertyId?: string }) => {
      const res = await fetch("/api/chats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(params),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        const msg = data?.message || data?.error || "Failed to start chat";
        throw new Error(msg);
      }
      return data as ChatThread;
    },
    onSuccess: (thread: ChatThread) => {
      initialThreadKeyRef.current = null;
      queryClient.invalidateQueries({ queryKey: ["/api/me/chats"] });
      setSelectedThreadId(thread.id);
    },
    onError: (err: Error) => {
      toast({ title: "Failed to start chat", description: err.message, variant: "destructive" });
    },
  });

  // When opening chat from property page: wait for threads to load, then select existing thread or create one (only create when we have propertyId = buyer coming from property page)
  useEffect(() => {
    if (!initialSellerId || !currentUserId || threadsLoading || createOrGetThread.isPending) return;

    const key = `${initialSellerId}:${initialPropertyId ?? ""}`;
    const existing = threads.find(
      (t) =>
        t.sellerId === initialSellerId &&
        (initialPropertyId ? t.propertyId === initialPropertyId : true)
    );
    if (existing) {
      initialThreadKeyRef.current = null;
      setSelectedThreadId(existing.id);
      return;
    }
    if (!initialPropertyId) return;
    if (initialThreadKeyRef.current === key) return;
    initialThreadKeyRef.current = key;
    createOrGetThread.mutate({
      buyerId: currentUserId,
      sellerId: initialSellerId,
      propertyId: initialPropertyId,
    });
  }, [initialSellerId, initialPropertyId, currentUserId, threads, threadsLoading, createOrGetThread.isPending]);

  useEffect(() => {
    if (threads.length > 0 && !selectedThreadId && !initialSellerId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId, initialSellerId]);

  const sendMessage = useMutation({
    mutationFn: async (content: string) => {
      const res = await apiRequest("POST", `/api/chats/${selectedThreadId}/messages`, { content });
      if (!res.ok) throw new Error("Failed to send");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/chats", selectedThreadId] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/chats"] });
      setMessageText("");
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatData?.messages?.length]);

  const filteredThreads = threads.filter(
    (t) =>
      (t.otherParticipantName || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.propertyTitle || "").toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedThread = threads.find((t) => t.id === selectedThreadId);
  const messages = chatData?.messages ?? [];

  const handleSend = () => {
    if (!messageText.trim() || !selectedThreadId) return;
    sendMessage.mutate(messageText.trim());
  };

  const content = (
    <div className="flex-1 flex overflow-hidden min-h-0">
      {/* Thread list */}
      <div className="w-80 border-r flex flex-col bg-muted/30">
        <div className="p-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search chats..."
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <ScrollArea className="flex-1">
          {threadsLoading ? (
            <div className="p-3 space-y-2">
              {[1, 2, 3, 4].map((i) => (
                <Skeleton key={i} className="h-16 w-full rounded-lg" />
              ))}
            </div>
          ) : filteredThreads.length === 0 ? (
            <div className="p-6 text-center text-muted-foreground text-sm">
              <MessageSquare className="h-10 w-10 mx-auto mb-2 opacity-50" />
              <p>No conversations yet</p>
              <p className="mt-1">Chat with sellers from a property page</p>
            </div>
          ) : (
            <div className="p-2 space-y-1">
              {filteredThreads.map((thread) => (
                <button
                  key={thread.id}
                  type="button"
                  onClick={() => setSelectedThreadId(thread.id)}
                  className={`w-full p-3 rounded-lg text-left flex items-start gap-3 hover:bg-muted transition-colors ${
                    selectedThreadId === thread.id ? "bg-primary/10 border border-primary/20" : ""
                  }`}
                >
                  <Avatar className="h-10 w-10 shrink-0">
                    <AvatarFallback className="text-xs">
                      {(thread.otherParticipantName || "?").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm">{thread.otherParticipantName || "Chat"}</p>
                    <p className="text-xs text-muted-foreground truncate">{thread.propertyTitle || "Property"}</p>
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs text-muted-foreground">
                        {thread.lastMessageAt ? format(new Date(thread.lastMessageAt), "MMM d, h:mm a") : "—"}
                      </span>
                      {(() => {
                        const isBuyerInThread = thread.buyerId === currentUserId;
                        const unread = isBuyerInThread ? thread.buyerUnreadCount : thread.sellerUnreadCount;
                        return unread > 0 ? (
                          <Badge variant="default" className="h-5 min-w-5 text-xs px-1">{unread}</Badge>
                        ) : null;
                      })()}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}
        </ScrollArea>
      </div>

      {/* Messages area */}
      {selectedThreadId ? (
        <div className="flex-1 flex flex-col min-w-0">
          <div className="p-4 border-b flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback>
                {(selectedThread?.otherParticipantName || "?").slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0">
              <p className="font-semibold truncate">{selectedThread?.otherParticipantName || "Chat"}</p>
              <p className="text-sm text-muted-foreground truncate">{selectedThread?.propertyTitle || "Property"}</p>
            </div>
          </div>

          <ScrollArea className="flex-1 min-h-0">
            {messagesLoading ? (
              <div className="p-4 space-y-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}>
                    <Skeleton className="h-14 w-64 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : messages.length === 0 ? (
              <div className="p-4 flex items-center justify-center min-h-[200px] text-muted-foreground text-sm">
                No messages yet. Say hello!
              </div>
            ) : (
              <div className="p-4 min-h-full flex flex-col justify-end">
                <div className="space-y-3 mt-auto">
                  {messages.map((msg) => {
                    const isMe = msg.senderId === currentUserId;
                    return (
                      <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                        <div
                          className={`max-w-[75%] rounded-2xl px-4 py-2.5 ${
                            isMe ? "bg-primary text-primary-foreground" : "bg-muted"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words text-left">{msg.content}</p>
                          <p className={`text-xs mt-1 text-left ${isMe ? "text-primary-foreground/80" : "text-muted-foreground"}`}>
                            {format(new Date(msg.createdAt), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                  <div ref={messagesEndRef} />
                </div>
              </div>
            )}
          </ScrollArea>

          <div className="p-4 border-t shrink-0 bg-background">
            <div className="flex gap-2">
              <Input
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                className="flex-1 focus-visible:ring-1 focus-visible:ring-offset-0"
              />
              <Button
                onClick={handleSend}
                disabled={!messageText.trim() || sendMessage.isPending}
                size="icon"
                className="shrink-0"
              >
                {sendMessage.isPending ? (
                  <span className="animate-pulse">...</span>
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p>Select a conversation or start a chat from a property page</p>
          </div>
        </div>
      )}
    </div>
  );

  if (compact) {
    return <div className="h-full flex flex-col min-h-0">{content}</div>;
  }

  return (
    <Card className="flex flex-col overflow-hidden h-[calc(100vh-12rem)] min-h-[400px]">
      {content}
    </Card>
  );
}
