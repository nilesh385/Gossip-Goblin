import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { FriendRequest } from "@/types";

interface FriendRequestItemProps {
  request: FriendRequest;
  onAccept: (id: string) => Promise<void>;
  onReject: (id: string) => Promise<void>;
  isProcessing: boolean;
}

export const FriendRequestItem = ({
  request,
  onAccept,
  onReject,
  isProcessing,
}: FriendRequestItemProps) => {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg hover:bg-accent">
      <div className="flex items-center gap-3">
        <Avatar>
          <AvatarImage src={request?.profilePic} alt={request?.username} />
          <AvatarFallback>
            {request?.username?.[0].toUpperCase()}
          </AvatarFallback>
        </Avatar>
        <div>
          <p className="font-medium">{request?.fullName}</p>
          <p className="text-sm text-muted-foreground">@{request?.username}</p>
        </div>
      </div>
      <div className="flex gap-2">
        <Button
          size="sm"
          onClick={() => onAccept(request?._id)}
          disabled={isProcessing}
        >
          Accept
        </Button>
        <Button
          size="sm"
          variant="outline"
          onClick={() => onReject(request?._id)}
          disabled={isProcessing}
        >
          Reject
        </Button>
      </div>
    </div>
  );
};
