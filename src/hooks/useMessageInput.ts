import { useRef, useCallback, useState } from "react";
import { MessageFormData } from "@/lib/validators";
import { messages } from "@/lib/api";
import { getSocket } from "@/lib/socket";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";

let typingTimeout: NodeJS.Timeout;

export const useMessageInput = () => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const user = useAuthStore((state) => state.user);
  const inputRef = useRef<HTMLInputElement>(null);
  const { addMessage } = useChatStore();
  const [loading, setLoading] = useState(false);

  const emitTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !activeConversation || !user) return;

    socket.emit("typing", {
      conversationId: activeConversation,
      username: user.username,
    });

    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      socket.emit("stopTyping", activeConversation);
    }, 3000);
  }, [activeConversation, user]);

  const handleSubmit = async (data: MessageFormData) => {
    if (!activeConversation || loading) return;
    setLoading(true);
    try {
      const response = await messages.sendMessage({
        conversationId: activeConversation._id,
        content: data.message,
      });
      addMessage(response);
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    } catch (error) {
      console.error("Failed to send message:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    handleSubmit,
    emitTyping,
    inputRef,
    loading,
  };
};
