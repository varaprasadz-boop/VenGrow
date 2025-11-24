import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Search,
  Send,
  Paperclip,
  MoreVertical,
  Phone,
  Video,
} from "lucide-react";

export default function ChatPage() {
  const [message, setMessage] = useState("");
  const [selectedChat, setSelectedChat] = useState("1");

  const conversations = [
    {
      id: "1",
      name: "Prestige Estates",
      lastMessage: "Yes, you can schedule a visit this weekend",
      time: "2m ago",
      unread: 2,
      online: true,
      propertyTitle: "Luxury 3BHK Apartment",
    },
    {
      id: "2",
      name: "Rahul Sharma",
      lastMessage: "What's the monthly maintenance?",
      time: "1h ago",
      unread: 0,
      online: false,
      propertyTitle: "2BHK Flat in Koramangala",
    },
    {
      id: "3",
      name: "DLF Properties",
      lastMessage: "The property is still available",
      time: "3h ago",
      unread: 1,
      online: true,
      propertyTitle: "Commercial Office Space",
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "them",
      text: "Hello! Are you interested in this property?",
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "me",
      text: "Yes, I'd like to know more about it. Is it still available?",
      time: "10:32 AM",
    },
    {
      id: "3",
      sender: "them",
      text: "Yes, it's available. Would you like to schedule a visit?",
      time: "10:35 AM",
    },
    {
      id: "4",
      sender: "me",
      text: "That would be great. Can we visit this weekend?",
      time: "10:36 AM",
    },
    {
      id: "5",
      sender: "them",
      text: "Yes, you can schedule a visit this weekend",
      time: "10:38 AM",
    },
  ];

  const selectedConversation = conversations.find((c) => c.id === selectedChat);

  const handleSend = () => {
    if (message.trim()) {
      console.log("Sending:", message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header isLoggedIn={true} userType="buyer" />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <h1 className="font-serif font-bold text-3xl mb-8">Messages</h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-[calc(100vh-16rem)]">
            {/* Conversations List */}
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
                <div className="space-y-2">
                  {conversations.map((conv) => (
                    <div
                      key={conv.id}
                      onClick={() => setSelectedChat(conv.id)}
                      className={`p-3 rounded-lg cursor-pointer hover-elevate active-elevate-2 ${
                        selectedChat === conv.id ? "bg-primary/10" : ""
                      }`}
                      data-testid={`chat-${conv.id}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="relative">
                          <Avatar>
                            <AvatarImage src="" alt={conv.name} />
                            <AvatarFallback>
                              {conv.name.substring(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          {conv.online && (
                            <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between mb-1">
                            <p className="font-medium truncate">{conv.name}</p>
                            <span className="text-xs text-muted-foreground flex-shrink-0">
                              {conv.time}
                            </span>
                          </div>
                          <p className="text-xs text-muted-foreground mb-1 truncate">
                            {conv.propertyTitle}
                          </p>
                          <div className="flex items-center justify-between">
                            <p className="text-sm text-muted-foreground truncate">
                              {conv.lastMessage}
                            </p>
                            {conv.unread > 0 && (
                              <Badge className="ml-2 h-5 min-w-5 flex items-center justify-center p-1">
                                {conv.unread}
                              </Badge>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>
            </Card>

            {/* Chat Window */}
            <Card className="lg:col-span-2 flex flex-col overflow-hidden">
              {/* Chat Header */}
              <div className="p-4 border-b flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="" alt={selectedConversation?.name} />
                      <AvatarFallback>
                        {selectedConversation?.name.substring(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {selectedConversation?.online && (
                      <div className="absolute bottom-0 right-0 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">{selectedConversation?.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {selectedConversation?.propertyTitle}
                    </p>
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

              {/* Messages */}
              <ScrollArea className="flex-1 p-4">
                <div className="space-y-4">
                  {messages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`flex ${
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] ${
                          msg.sender === "me"
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted"
                        } rounded-lg p-3`}
                      >
                        <p className="text-sm">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 ${
                            msg.sender === "me"
                              ? "text-primary-foreground/70"
                              : "text-muted-foreground"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </ScrollArea>

              {/* Message Input */}
              <div className="p-4 border-t">
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="icon" data-testid="button-attach">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSend()}
                    data-testid="input-message"
                  />
                  <Button onClick={handleSend} data-testid="button-send">
                    <Send className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
