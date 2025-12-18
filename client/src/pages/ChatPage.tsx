import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Skeleton } from "@/components/ui/skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useWebSocket } from "@/hooks/use-websocket";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { format } from "date-fns";
import type { ChatThread, ChatMessage, User } from "@shared/schema";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
  MessageSquare,
  Wifi,
  WifiOff,
} from "lucide-react";

export default function ChatPage() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [localMessages, setLocalMessages] = useState<ChatMessage[]>([]);
  const [typingUsers, setTypingUsers] = useState<Record<string, boolean>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const { data: currentUser } = useQuery<User>({
    queryKey: ["/api/auth/me"],
  });

  const { data: threads = [], isLoading: threadsLoading } = useQuery<ChatThread[]>({
    queryKey: ["/api/users", currentUser?.id, "chats"],
    enabled: !!currentUser?.id,
  });

  const { data: chatData, isLoading: messagesLoading } = useQuery<{ thread: ChatThread; messages: ChatMessage[] }>({
    queryKey: ["/api/chats", selectedThreadId],
    enabled: !!selectedThreadId,
  });

  const { isConnected, sendChatMessage, markAsRead, sendTypingIndicator } = useWebSocket({
    userId: currentUser?.id || null,
    onMessage: (msg) => {
      if (msg.type === "new_message") {
        setLocalMessages((prev) => {
          if (prev.some((m) => m.id === msg.message.id)) return prev;
          return [...prev, msg.message];
        });
        queryClient.invalidateQueries({ queryKey: ["/api/users", currentUser?.id, "chats"] });
      } else if (msg.type === "user_typing") {
        setTypingUsers((prev) => ({
          ...prev,
          [msg.threadId]: msg.isTyping,
        }));
      } else if (msg.type === "messages_read") {
        queryClient.invalidateQueries({ queryKey: ["/api/chats", msg.threadId] });
      }
    },
  });

  useEffect(() => {
    if (chatData?.messages) {
      setLocalMessages(chatData.messages);
    }
  }, [chatData?.messages]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [localMessages]);

  useEffect(() => {
    if (selectedThreadId && currentUser?.id) {
      markAsRead(selectedThreadId);
    }
  }, [selectedThreadId, currentUser?.id, markAsRead]);

  const handleSend = () => {
    if (!message.trim() || !selectedThreadId || !currentUser?.id) return;

    sendChatMessage(selectedThreadId, message.trim());
    setMessage("");
    sendTypingIndicator(selectedThreadId, false);
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);

    if (!selectedThreadId) return;

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    sendTypingIndicator(selectedThreadId, true);

    typingTimeoutRef.current = setTimeout(() => {
      sendTypingIndicator(selectedThreadId, false);
    }, 2000);
  };

  const selectedThread = threads.find((t) => t.id === selectedThreadId);

  const getOtherParticipant = (thread: ChatThread) => {
    if (!currentUser) return { name: "Unknown", id: "" };
    const isBuyer = thread.buyerId === currentUser.id;
    return {
      name: isBuyer ? "Seller" : "Buyer",
      id: isBuyer ? thread.sellerId : thread.buyerId,
    };
  };

  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col">
        <Header isLoggedIn={false} />
        <main className="flex-1 flex items-center justify-center">
          <Card className="p-8 text-center max-w-md">
            <MessageSquare className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
            <h2 className="font-serif font-bold text-2xl mb-2">Sign in to Chat</h2>
            <p className="text-muted-foreground mb-4">
              Please sign in to access your messages
            </p>
            <Button asChild data-testid="button-chat-login">
              <a href="/login">Sign In</a>
            </Button>
          </Card>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType={currentUser.role as "buyer" | "seller" | "admin"} />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-8 flex-wrap gap-4">
            <h1 className="font-serif font-bold text-3xl">Messages</h1>
            <div className="flex items-center gap-2 text-sm">
              {isConnected ? (
                <>
                  <Wifi className="h-4 w-4 text-green-500" />
                  <span className="text-green-600">Connected</span>
                </>
              ) : (
                <>
                  <WifiOff className="h-4 w-4 text-red-500" />
                  <span className="text-red-600">Reconnecting...</span>
                </>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
            <Card className="lg:col-span-1 p-4 flex flex-col">
              <div className="mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-9"
                    data-testid="input-search-chats"
                  />
                </div>
              </div>

              <ScrollArea className="flex-1 -mx-4 px-4">
                {threadsLoading ? (
                  <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="flex items-start gap-3 p-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="flex-1">
                          <Skeleton className="h-4 w-24 mb-2" />
                          <Skeleton className="h-3 w-full" />
                        </div>
                      </div>
                    ))}
                  </div>
                ) : threads.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No conversations yet</p>
                    <p className="text-sm mt-1">
                      Start chatting by contacting a seller
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {threads.map((thread) => {
                      const other = getOtherParticipant(thread);
                      const isBuyer = thread.buyerId === currentUser.id;
                      const unreadCount = isBuyer ? thread.buyerUnreadCount : thread.sellerUnreadCount;
                      return (
                        <div
                          key={thread.id}
                          onClick={() => setSelectedThreadId(thread.id)}
                          className={`p-3 rounded-lg cursor-pointer hover-elevate active-elevate-2 ${
                            selectedThreadId === thread.id ? "bg-primary/10" : ""
                          }`}
                          data-testid={`chat-thread-${thread.id}`}
                        >
                          <div className="flex items-start gap-3">
                            <Avatar>
                              <AvatarFallback>
                                {other.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-1">
                                <p className="font-medium truncate">{other.name}</p>
                                <span className="text-xs text-muted-foreground flex-shrink-0">
                                  {thread.lastMessageAt
                                    ? format(new Date(thread.lastMessageAt), "h:mm a")
                                    : ""}
                                </span>
                              </div>
                              <div className="flex items-center justify-between">
                                <p className="text-sm text-muted-foreground truncate">
                                  {typingUsers[thread.id]
                                    ? "Typing..."
                                    : "Click to view messages"}
                                </p>
                                {unreadCount > 0 && (
                                  <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center p-1">
                                    {unreadCount}
                                  </Badge>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </ScrollArea>
            </Card>

            <Card className="lg:col-span-2 flex flex-col overflow-hidden">
              {!selectedThreadId ? (
                <div className="flex-1 flex items-center justify-center">
                  <div className="text-center text-muted-foreground">
                    <MessageSquare className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">Select a conversation</p>
                    <p className="text-sm mt-1">
                      Choose a chat from the list to start messaging
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="p-4 border-b flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar>
                        <AvatarFallback>
                          {selectedThread
                            ? getOtherParticipant(selectedThread).name.substring(0, 2).toUpperCase()
                            : ""}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold">
                          {selectedThread ? getOtherParticipant(selectedThread).name : ""}
                        </p>
                        {typingUsers[selectedThreadId] && (
                          <p className="text-xs text-primary animate-pulse">Typing...</p>
                        )}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="icon" data-testid="button-call">
                        <Phone className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid="button-video">
                        <Video className="h-5 w-5" />
                      </Button>
                      <Button variant="ghost" size="icon" data-testid="button-more">
                        <MoreVertical className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>

                  <ScrollArea className="flex-1 p-4">
                    {messagesLoading ? (
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div
                            key={i}
                            className={`flex ${i % 2 === 0 ? "justify-end" : "justify-start"}`}
                          >
                            <Skeleton className="h-16 w-48 rounded-lg" />
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {localMessages.map((msg) => {
                          const isMe = msg.senderId === currentUser.id;
                          return (
                            <div
                              key={msg.id}
                              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                            >
                              <div
                                className={`max-w-[70%] ${
                                  isMe
                                    ? "bg-primary text-primary-foreground"
                                    : "bg-muted"
                                } rounded-lg p-3`}
                              >
                                <p className="text-sm">{msg.content}</p>
                                <p
                                  className={`text-xs mt-1 ${
                                    isMe
                                      ? "text-primary-foreground/70"
                                      : "text-muted-foreground"
                                  }`}
                                >
                                  {msg.createdAt
                                    ? format(new Date(msg.createdAt), "h:mm a")
                                    : ""}
                                </p>
                              </div>
                            </div>
                          );
                        })}
                        <div ref={messagesEndRef} />
                      </div>
                    )}
                  </ScrollArea>

                  <div className="p-4 border-t">
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="icon" data-testid="button-attach">
                        <Paperclip className="h-5 w-5" />
                      </Button>
                      <Input
                        placeholder="Type a message..."
                        value={message}
                        onChange={handleTyping}
                        onKeyPress={(e) => e.key === "Enter" && handleSend()}
                        data-testid="input-message"
                      />
                      <Button
                        onClick={handleSend}
                        disabled={!message.trim() || !isConnected}
                        data-testid="button-send"
                      >
                        <Send className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </>
              )}
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
