import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MessageBubble } from "./MessageBubble";
import { TypingIndicator } from "./TypingIndicator";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";
import { Message } from "@/types";

export const MessageList = () => {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { messages } = useChatStore((state) => state);
  const user = useAuthStore((state) => state.user);
  const typingUsers = useChatStore((state) => state.typingUsers);
  const activeConversation = useChatStore((state) => state.activeConversation);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const shouldShowAvatar = (message: Message, index: number) => {
    if (index === 0) return true;
    const prevMessage = messages[index - 1];
    return (
      prevMessage.sender._id !== message.sender._id ||
      new Date(message.createdAt).getTime() -
        new Date(prevMessage.createdAt).getTime() >
        300000 // 5 minutes
    );
  };

  if (!activeConversation) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <p>Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 p-4 overflow-auto">
      <div className="space-y-4">
        {messages &&
          messages.length > 0 &&
          messages.map((message, index) => (
            <MessageBubble
              key={message._id}
              message={message}
              isOwnMessage={message.sender._id === user?._id}
              showAvatar={shouldShowAvatar(message, index)}
            />
          ))}
        {typingUsers[activeConversation._id] && (
          <TypingIndicator username={typingUsers[activeConversation._id]} />
        )}
        <div ref={messagesEndRef} />
      </div>
    </ScrollArea>
  );
};
