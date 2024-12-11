import { User, MoreVertical, UserCircle2Icon } from "lucide-react";
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
import ViewFriendProfile from "../friends/ViewFriendProfile";
import ToolTip_ from "../ToolTip_";

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
}

export const ChatHeader = ({ conversation }: ChatHeaderProps) => {
  const onlineUsers = useChatStore((state) => state.onlineUsers);
  const { user } = useAuthStore();

  const otherUser = conversation?.participants?.find(
    (participant) => participant._id !== user?._id
  );
  const isOnline = onlineUsers.includes(otherUser?._id!);
  return (
    <div className="border-b p-4 flex items-center justify-between bg-card">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage
            src={otherUser?.profilePic}
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
          {conversation && (
            <p className="text-sm text-muted-foreground">
              {isOnline ? "Online" : "Offline"}
            </p>
          )}
        </div>
      </div>

      <ToolTip_ content={"View Profile"}>
        <ViewFriendProfile friendId={otherUser?._id!}>
          <Button size={"icon"}>
            <UserCircle2Icon className="size-full" />
          </Button>
        </ViewFriendProfile>
      </ToolTip_>
    </div>
  );
};
