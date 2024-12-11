import { useEffect, useState } from "react";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useAuthStore from "@/store/authStore";
import { users } from "@/lib/api";
import { Button } from "../ui/button";
import { SearchDialog } from "../search/SearchDialog";
import { FriendRequestSkeleton } from "./FriendRequestSkeleton";
import { User } from "@/types";
import { toast } from "sonner";

interface Friend {
  _id: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export const FriendsList = () => {
  const [friends, setFriends] = useState<Friend[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const [friendProfile, setFriendProfile] = useState<User>({} as User);

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        const response = await users.getAllFriends();
        setFriends(response);
      } catch (error) {
        console.error("Failed to fetch friends:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFriends();
  }, [token, user?._id]);

  const getFriendProfile = async (friendId: string) => {
    try {
      const response = await users.getFriendProfile(friendId);
      setFriendProfile(response);
    } catch (error) {
      toast.error("Failed to fetch friend profile");
      console.error("Failed to start conversation:", error);
    }
  };

  if (isLoading) {
    return <FriendRequestSkeleton />;
  }

  return (
    <ScrollArea className="h-full p-4 w-1/2 md:w-[320px] border-r-2">
      <div className="space-y-4 flex flex-col h-full">
        <div className="flex items-center w-full justify-between">
          <h2 className="text-2xl font-bold flex items-center justify-between">
            Friends
          </h2>
          <SearchDialog />
        </div>
        <div className="grid gap-4">
          {friends &&
            friends.length > 0 &&
            friends.map(
              (friend) =>
                friend._id !== user?._id && (
                  <Button
                    key={friend._id}
                    variant="ghost"
                    className="w-full flex items-center gap-4 justify-start h-auto p-4"
                    onClick={() => getFriendProfile(friend._id)}
                  >
                    <Avatar>
                      <AvatarImage
                        src={friend.profilePic}
                        alt={friend.username}
                      />
                      <AvatarFallback>
                        {friend.fullName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <div className="text-left">
                      <p className="font-medium">{friend.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        @{friend.username}
                      </p>
                    </div>
                  </Button>
                )
            )}
          {friends && friends.length === 0 && (
            <div className="w-full flex items-center gap-4 justify-start h-auto p-4 text-muted-foreground text-md">
              Add some friends by searching using email or username.
            </div>
          )}
        </div>
      </div>
    </ScrollArea>
  );
};
