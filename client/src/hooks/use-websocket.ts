import { useEffect, useRef, useCallback, useState } from "react";
import type { ChatMessage } from "@shared/schema";

type WebSocketMessage =
  | { type: "auth"; userId: string }
  | { type: "chat_message"; threadId: string; content: string; attachments?: string[] }
  | { type: "mark_read"; threadId: string }
  | { type: "typing"; threadId: string; isTyping: boolean }
  | { type: "ping" };

type IncomingMessage =
  | { type: "auth_success"; userId: string }
  | { type: "new_message"; message: ChatMessage; threadId: string }
  | { type: "messages_read"; threadId: string }
  | { type: "user_typing"; threadId: string; userId: string; isTyping: boolean }
  | { type: "pong" }
  | { type: "error"; message: string };

interface UseWebSocketOptions {
  userId: string | null;
  onMessage?: (message: IncomingMessage) => void;
  onConnect?: () => void;
  onDisconnect?: () => void;
}

export function useWebSocket({ userId, onMessage, onConnect, onDisconnect }: UseWebSocketOptions) {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [connectionState, setConnectionState] = useState<"connecting" | "connected" | "disconnected">("disconnected");

  const connect = useCallback(() => {
    if (!userId) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) return;

    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    setConnectionState("connecting");
    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      ws.send(JSON.stringify({ type: "auth", userId }));
      setIsConnected(true);
      setConnectionState("connected");
      onConnect?.();

      pingIntervalRef.current = setInterval(() => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ type: "ping" }));
        }
      }, 30000);
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data) as IncomingMessage;
        onMessage?.(message);
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    ws.onclose = () => {
      setIsConnected(false);
      setConnectionState("disconnected");
      onDisconnect?.();

      if (pingIntervalRef.current) {
        clearInterval(pingIntervalRef.current);
        pingIntervalRef.current = null;
      }

      reconnectTimeoutRef.current = setTimeout(() => {
        connect();
      }, 3000);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    wsRef.current = ws;
  }, [userId, onMessage, onConnect, onDisconnect]);

  const disconnect = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    if (pingIntervalRef.current) {
      clearInterval(pingIntervalRef.current);
      pingIntervalRef.current = null;
    }
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
    setIsConnected(false);
    setConnectionState("disconnected");
  }, []);

  const sendMessage = useCallback((message: WebSocketMessage) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message));
    }
  }, []);

  const sendChatMessage = useCallback((threadId: string, content: string, attachments?: string[]) => {
    sendMessage({ type: "chat_message", threadId, content, attachments });
  }, [sendMessage]);

  const markAsRead = useCallback((threadId: string) => {
    sendMessage({ type: "mark_read", threadId });
  }, [sendMessage]);

  const sendTypingIndicator = useCallback((threadId: string, isTyping: boolean) => {
    sendMessage({ type: "typing", threadId, isTyping });
  }, [sendMessage]);

  useEffect(() => {
    if (userId) {
      connect();
    }
    return () => {
      disconnect();
    };
  }, [userId, connect, disconnect]);

  return {
    isConnected,
    connectionState,
    sendChatMessage,
    markAsRead,
    sendTypingIndicator,
    connect,
    disconnect,
  };
}
