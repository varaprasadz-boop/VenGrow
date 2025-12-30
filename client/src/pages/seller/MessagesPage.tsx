import { useState, useEffect } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Send, Paperclip, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { formatDistanceToNow, format } from "date-fns";

interface Conversation {
  id: string;
  buyerId: string;
  buyerName: string;
  propertyId: string;
  propertyName: string;
  lastMessage: string;
  lastMessageTime: string;
  unread: number;
  inquiryId: string;
}

interface Message {
  id: string;
  sender: "buyer" | "seller";
  text: string;
  time: string;
  inquiryId?: string;
}

export default function MessagesPage() {
  const { toast } = useToast();
  const [selectedChat, setSelectedChat] = useState<string | null>(null);
  const [messageText, setMessageText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const { data: conversations = [], isLoading: conversationsLoading } = useQuery<Conversation[]>({
    queryKey: ["/api/me/conversations"],
  });

  const { data: messages = [], isLoading: messagesLoading } = useQuery<Message[]>({
    queryKey: [`/api/conversations/${selectedChat}/messages`],
    enabled: !!selectedChat,
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (data: { message: string; inquiryId?: string }) => {
      return apiRequest("POST", `/api/conversations/${selectedChat}/messages`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [`/api/conversations/${selectedChat}/messages`] });
      queryClient.invalidateQueries({ queryKey: ["/api/me/conversations"] });
      setMessageText("");
      toast({ title: "Message sent" });
    },
    onError: () => {
      toast({ title: "Failed to send message", variant: "destructive" });
    },
  });

  useEffect(() => {
    if (conversations.length > 0 && !selectedChat) {
      setSelectedChat(conversations[0].buyerId);
    }
  }, [conversations, selectedChat]);

  const handleSend = () => {
    if (!messageText.trim() || !selectedChat) return;
    
    const conversation = conversations.find(c => c.buyerId === selectedChat);
    sendMessageMutation.mutate({
      message: messageText.trim(),
      inquiryId: conversation?.inquiryId,
    });
  };

  const filteredConversations = conversations.filter(conv =>
    conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    conv.propertyName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedConversation = conversations.find(c => c.buyerId === selectedChat);

  if (conversationsLoading) {
    return (
      <main className="flex-1">
        <div className="h-screen flex flex-col">
          <div className="border-b p-4">
            <Skeleton className="h-8 w-48" />
          </div>
          <div className="flex-1 flex">
            <div className="w-96 border-r p-4">
              <Skeleton className="h-10 w-full mb-4" />
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-20 w-full mb-2" />
              ))}
            </div>
            <div className="flex-1 p-4">
              <Skeleton className="h-16 w-full mb-4" />
              <Skeleton className="h-64 w-full" />
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1">
        <div className="h-screen flex flex-col">
          <div className="border-b p-4">
            <div className="max-w-7xl mx-auto">
              <h1 className="font-serif font-bold text-2xl">Messages</h1>
            </div>
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Conversations List */}
            <div className="w-96 border-r flex flex-col">
              <div className="p-4 border-b">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search conversations..."
                    className="pl-10"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {filteredConversations.length === 0 ? (
                  <div className="p-4 text-center text-muted-foreground">
                    <p>No conversations found</p>
                  </div>
                ) : (
                  filteredConversations.map((conv) => (
                    <button
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.buyerId)}
                      className={`w-full p-4 border-b text-left hover-elevate active-elevate-2 ${
                        selectedChat === conv.buyerId ? "bg-muted" : ""
                      }`}
                      data-testid={`button-chat-${conv.id}`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold">{conv.buyerName}</h4>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(conv.lastMessageTime), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                        {conv.propertyName}
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="text-sm text-muted-foreground line-clamp-1">
                          {conv.lastMessage || "No message"}
                        </p>
                        {conv.unread > 0 && (
                          <Badge className="ml-2">{conv.unread}</Badge>
                        )}
                      </div>
                    </button>
                  ))
                )}
              </div>
            </div>

            {/* Chat Area */}
            {selectedChat ? (
              <div className="flex-1 flex flex-col">
                {/* Chat Header */}
                <div className="p-4 border-b">
                  <h3 className="font-semibold">
                    {selectedConversation?.buyerName || "Buyer"}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {selectedConversation?.propertyName || "Property"}
                  </p>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                  {messagesLoading ? (
                    <div className="space-y-4">
                      {[1, 2, 3].map((i) => (
                        <Skeleton key={i} className="h-16 w-64" />
                      ))}
                    </div>
                  ) : messages.length === 0 ? (
                    <div className="text-center text-muted-foreground py-8">
                      <p>No messages yet. Start the conversation!</p>
                    </div>
                  ) : (
                    messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${
                          message.sender === "seller" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-md p-4 rounded-lg ${
                            message.sender === "seller"
                              ? "bg-primary text-primary-foreground"
                              : "bg-muted"
                          }`}
                        >
                          <p className="text-sm mb-1">{message.text}</p>
                          <p
                            className={`text-xs ${
                              message.sender === "seller"
                                ? "text-primary-foreground/70"
                                : "text-muted-foreground"
                            }`}
                          >
                            {format(new Date(message.time), "h:mm a")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                {/* Input */}
                <div className="p-4 border-t">
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="h-5 w-5" />
                    </Button>
                    <Input
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          handleSend();
                        }
                      }}
                      data-testid="input-message"
                    />
                    <Button 
                      data-testid="button-send"
                      onClick={handleSend}
                      disabled={!messageText.trim() || sendMessageMutation.isPending}
                    >
                      {sendMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Send className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-muted-foreground">
                  <p>Select a conversation to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
  );
}
