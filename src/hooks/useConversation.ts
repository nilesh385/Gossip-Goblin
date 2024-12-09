import { useEffect } from "react";
import { toast } from "sonner";
import { messages } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import useChatStore from "@/store/chatStore";

export const useConversation = () => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const setMessages = useChatStore((state) => state.setMessages);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!activeConversation) return;

    const socket = getSocket();
    socket?.emit("joinRoom", activeConversation);

    const fetchMessages = async () => {
      try {
        const data = await messages.getMessages(activeConversation);
        setMessages(data);
      } catch (error) {
        toast.error("Failed to load messages");
      }
    };

    fetchMessages();

    socket?.on("newMessage", (message) => {
      addMessage(message);
    });

    return () => {
      socket?.emit("leaveRoom", activeConversation);
      socket?.off("newMessage");
    };
  }, [activeConversation, setMessages, addMessage]);

  return {
    activeConversation,
  };
};
