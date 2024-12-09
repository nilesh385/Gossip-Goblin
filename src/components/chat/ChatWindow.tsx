import { useEffect } from "react";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";
import { ChatHeader } from "./ChatHeader";
import { messages } from "@/lib/api";
import useChatStore from "@/store/chatStore";
import { getSocket } from "@/lib/socket";
import { toast } from "sonner";
import { MessageCircleMoreIcon } from "lucide-react";

export const ChatWindow = () => {
  const activeConversation = useChatStore((state) => state.activeConversation);
  const setMessages = useChatStore((state) => state.setMessages);

  useEffect(() => {
    if (activeConversation) {
      const socket = getSocket();
      socket?.emit("joinRoom", activeConversation);

      const fetchMessages = async () => {
        try {
          const data = await messages.getMessages(activeConversation._id);
          console.log(data);
          setMessages(data.messages);
        } catch (error) {
          toast.error("Failed to load messages");
        }
      };

      fetchMessages();

      return () => {
        socket?.emit("leaveRoom", activeConversation);
      };
    }
  }, [activeConversation, setMessages]);

  const handleViewProfile = () => {
    // Implement profile viewing logic
  };

  const handleLeaveGroup = () => {
    // Implement group leaving logic
  };

  return (
    <div className="h-full flex flex-col bg-background overflow-hidden">
      {activeConversation ? (
        <>
          <ChatHeader
            conversation={activeConversation}
            onViewProfile={handleViewProfile}
            onLeaveGroup={handleLeaveGroup}
          />
          <MessageList />
          <MessageInput />
        </>
      ) : (
        <div className="h-full flex flex-col items-center justify-center dark:text-muted-foreground text-violet-700 text-2xl">
          <MessageCircleMoreIcon className="size-2/4" />
          <p>Select a conversation to start chatting</p>
        </div>
      )}
    </div>
  );
};
