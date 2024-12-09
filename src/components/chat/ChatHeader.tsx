import { User, MoreVertical } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import useChatStore from "@/store/chatStore";
import useAuthStore from "@/store/authStore";

interface ChatHeaderProps {
  conversation: {
    _id: string;
    name?: string;
    participants: {
      _id: string;
      username: string;
      profilePic: string;
    }[];
    isGroup?: boolean;
  };
  onViewProfile?: () => void;
  onLeaveGroup?: () => void;
}

export const ChatHeader = ({
  conversation,
  onViewProfile,
  onLeaveGroup,
}: ChatHeaderProps) => {
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const { user } = useAuthStore();

  const isOnline = conversation?.participants?.some((participant) =>
    onlineUsers.includes(participant._id)
  );
  const otherUser = conversation?.participants?.find(
    (participant) => participant._id !== user?._id
  );
  return (
    <div className="border-b p-4 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={conversation.isGroup ? undefined : otherUser?.profilePic}
            alt={conversation?.name || otherUser?.username}
          />
          <AvatarFallback>
            {conversation.isGroup ? (
              <User className="h-6 w-6" />
            ) : (
              otherUser?.username[0]
            )}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="font-semibold">
            {conversation?.name || otherUser?.username}
          </h2>
          {!conversation.isGroup && (
            <p className="text-sm text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
            <span className="sr-only">More options</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {onViewProfile && (
            <DropdownMenuItem onClick={onViewProfile}>
              View Profile
            </DropdownMenuItem>
          )}
          {conversation.isGroup && onLeaveGroup && (
            <DropdownMenuItem
              onClick={onLeaveGroup}
              className="text-destructive"
            >
              Leave Group
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
