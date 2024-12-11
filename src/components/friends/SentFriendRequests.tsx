import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { FriendRequestSkeleton } from "./FriendRequestSkeleton";
import { toast } from "sonner";
import { users } from "@/lib/api";
import { FriendRequest } from "@/types";
import { Loader2, X } from "lucide-react";
import useAuthStore from "@/store/authStore";

export default function SentFriendRequests() {
  const [loading, setLoading] = useState(false);
  const [cancelLoading, setCancelLoading] = useState(false);
  const [sentFriendRequests, setSentFriendRequests] = useState<FriendRequest[]>(
    []
  );
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchSentRequests = async () => {
      try {
        setLoading(true);
        const response = await users.getSentFriendRequests();
        console.log(response);
        setSentFriendRequests(
          response.filter((friend: FriendRequest) => friend._id !== user?._id)
        );
      } catch (error: any) {
        console.log(error);
        toast.error(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchSentRequests();
  }, []);

  const handleCancelFriendRequest = async (friendId: string) => {
    try {
      setCancelLoading(true);
      const response = await users.cancelFriendRequest(friendId);
      console.log(response);
      setSentFriendRequests((prev) =>
        prev.filter((friendRequest) => friendRequest._id !== friendId)
      );
      toast.success(response.message);
    } catch (error) {
      toast.error("Failed to cancel friend request");
    } finally {
      setCancelLoading(false);
    }
  };

  if (loading) {
    return <FriendRequestSkeleton />;
  }
  return (
    <ScrollArea className="h-full p-4 w-full md:w-[320px] border-r-2">
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex items-center w-full justify-between">
          <h2 className="text-2xl font-bold flex items-center justify-between">
            Sent friend requests
          </h2>
        </div>
        <div className="grid gap-4">
          {sentFriendRequests &&
            sentFriendRequests.length > 0 &&
            sentFriendRequests.map((friend) => (
              <Button
                key={friend._id}
                variant="ghost"
                className="w-full flex items-center gap-4 justify-start h-auto p-4"
              >
                <Avatar>
                  <AvatarImage src={friend.profilePic} alt={friend.username} />
                  <AvatarFallback>
                    {friend?.fullName?.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="text-left">
                  <p className="font-medium">{friend?.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    @{friend?.username}
                  </p>
                </div>
                <Button
                  variant={"outline"}
                  size={"icon"}
                  className="ml-auto"
                  onClick={() => handleCancelFriendRequest(friend?._id)}
                >
                  {cancelLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <X />
                  )}
                </Button>
              </Button>
            ))}
          {sentFriendRequests && sentFriendRequests.length === 0 && (
            <div className="w-full flex items-center gap-4 justify-start h-auto p-4 text-muted-foreground text-md">
              No Friend requests sent.
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
}
