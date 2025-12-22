import { useState } from "react";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Send, Paperclip } from "lucide-react";

export default function MessagesPage() {
  const [selectedChat, setSelectedChat] = useState("1");

  const conversations = [
    {
      id: "1",
      name: "Rahul Sharma",
      property: "Luxury 3BHK Apartment",
      lastMessage: "Is the property still available?",
      time: "2 min ago",
      unread: 2,
    },
    {
      id: "2",
      name: "Priya Patel",
      property: "Commercial Office Space",
      lastMessage: "Can we schedule a visit?",
      time: "1 hour ago",
      unread: 0,
    },
    {
      id: "3",
      name: "Amit Kumar",
      property: "2BHK Flat",
      lastMessage: "Thank you for the information",
      time: "1 day ago",
      unread: 0,
    },
  ];

  const messages = [
    {
      id: "1",
      sender: "buyer",
      text: "Hi, I'm interested in your property. Is it still available?",
      time: "10:30 AM",
    },
    {
      id: "2",
      sender: "seller",
      text: "Yes, it's still available. Would you like to schedule a visit?",
      time: "10:35 AM",
    },
    {
      id: "3",
      sender: "buyer",
      text: "Yes, please. What time works best for you?",
      time: "10:40 AM",
    },
  ];

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
                    data-testid="input-search"
                  />
                </div>
              </div>

              <div className="flex-1 overflow-y-auto">
                {conversations.map((conv) => (
                  <button
                    key={conv.id}
                    onClick={() => setSelectedChat(conv.id)}
                    className={`w-full p-4 border-b text-left hover-elevate active-elevate-2 ${
                      selectedChat === conv.id ? "bg-muted" : ""
                    }`}
                    data-testid={`button-chat-${conv.id}`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold">{conv.name}</h4>
                      <span className="text-xs text-muted-foreground">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-1">
                      {conv.property}
                    </p>
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {conv.lastMessage}
                      </p>
                      {conv.unread > 0 && (
                        <Badge className="ml-2">{conv.unread}</Badge>
                      )}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Chat Area */}
            <div className="flex-1 flex flex-col">
              {/* Chat Header */}
              <div className="p-4 border-b">
                <h3 className="font-semibold">
                  {conversations.find((c) => c.id === selectedChat)?.name}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {conversations.find((c) => c.id === selectedChat)?.property}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {messages.map((message) => (
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
                        {message.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Input */}
              <div className="p-4 border-t">
                <div className="flex gap-2">
                  <Button variant="ghost" size="icon">
                    <Paperclip className="h-5 w-5" />
                  </Button>
                  <Input
                    placeholder="Type your message..."
                    data-testid="input-message"
                  />
                  <Button data-testid="button-send">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
  );
}
