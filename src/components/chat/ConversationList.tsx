import { useConversations } from "@/hooks/useConversations";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConversationItem } from "./ConversationItem";
import { SearchDialog } from "../search/SearchDialog";
import { FriendRequestsDialog } from "../friends/FriendRequestsDialog";
import { Loader2 } from "lucide-react";
import useChatStore from "@/store/chatStore";

export const ConversationList = () => {
  const { conversations, isLoading } = useConversations();
  const setActiveConversation = useChatStore(
    (state) => state.setActiveConversation
  );

  if (isLoading) {
    return (
      <div className="h-full flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b flex justify-between items-center">
        <h2 className="text-xl font-semibold">Chats</h2>
        <div className="flex items-center gap-2">
          <FriendRequestsDialog />
          <SearchDialog />
        </div>
      </div>
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-2">
          {console.log(conversations) as React.ReactNode}
          {conversations &&
            conversations?.length > 0 &&
            conversations.map((conversation) => (
              <ConversationItem
                key={conversation._id}
                conversation={conversation}
                onClick={() => setActiveConversation(conversation)}
              />
            ))}
          {conversations && conversations.length === 0 && (
            <div className="text-center p-4 text-muted-foreground">
              No conversations yet. Start chatting with your friends!
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};
