import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageStatus } from "./MessageStatus";
import { formatTime } from "@/lib/utils";
import { Message } from "@/types";

interface MessageBubbleProps {
  message: Message;
  isOwnMessage: boolean;
  showAvatar?: boolean;
}

export const MessageBubble = ({
  message,
  isOwnMessage,
  showAvatar = true,
}: MessageBubbleProps) => {
  const { content, sender, createdAt, read } = message;

  return (
    <div
      className={`flex items-end gap-2 ${
        isOwnMessage ? "justify-end" : "justify-start"
      }`}
    >
      {!isOwnMessage && showAvatar && (
        <Avatar className="w-8 h-8">
          <AvatarImage src={sender.profilePic} alt={sender.username} />
          <AvatarFallback>{sender.username[0]}</AvatarFallback>
        </Avatar>
      )}
      <div
        className={`max-w-[70%] rounded-lg p-3 ${
          isOwnMessage ? "bg-primary text-primary-foreground" : "bg-secondary"
        }`}
      >
        {!isOwnMessage && showAvatar && (
          <p className="text-xs font-medium mb-1">{sender.username}</p>
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{content}</p>
        <div className="flex items-center justify-end gap-1 mt-1">
          <span className="text-xs opacity-70">{formatTime(createdAt)}</span>
          {isOwnMessage && (
            <MessageStatus
              isRead={read}
              className={read ? "text-primary" : "text-muted-foreground"}
            />
          )}
        </div>
      </div>
    </div>
  );
};
