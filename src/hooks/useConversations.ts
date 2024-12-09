import { useState, useEffect } from "react";
import { toast } from "sonner";
import { conversations_api } from "@/lib/api";
import { Conversation } from "@/types";
import { getSocket } from "@/lib/socket";

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const response = await conversations_api.getAll();
        setConversations(response);
      } catch (error) {
        toast.error("Failed to load conversations");
      } finally {
        setIsLoading(false);
      }
    };

    const socket = getSocket();

    socket?.on("newMessage", (message) => {
      setConversations((prev) =>
        prev
          .map((conv) =>
            conv._id === message.conversationId
              ? { ...conv, lastMessage: message }
              : conv
          )
          .sort((a, b) => {
            const dateA = a.lastMessage?.createdAt || a.createdAt;
            const dateB = b.lastMessage?.createdAt || b.createdAt;
            return new Date(dateB).getTime() - new Date(dateA).getTime();
          })
      );
    });

    fetchConversations();

    return () => {
      socket?.off("newMessage");
    };
  }, []);

  return { conversations, isLoading };
};
