import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "../ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import useAuthStore from "@/store/authStore";

interface FriendRequest {
  _id: string;
  username: string;
  fullName: string;
  profilePic: string;
}

export const FriendRequests = () => {
  const [requests, setRequests] = useState<FriendRequest[]>([]);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/users/${user?._id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setRequests(response.data.pendingFriendRequests);
      } catch (error) {
        toast.error("Failed to fetch friend requests");
      }
    };

    if (user) {
      fetchRequests();
    }
  }, [token, user]);

  const handleRequest = async (userId: string, action: "accept" | "reject") => {
    try {
      await axios.post(
        `http://localhost:3000/api/users/friend-request/${userId}/${action}`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setRequests(requests.filter((request) => request._id !== userId));
      toast.success(`Friend request ${action}ed`);
    } catch (error) {
      toast.error(`Failed to ${action} friend request`);
    }
  };

  return (
    <div className="p-4 space-y-4">
      <h2 className="text-xl font-semibold">Friend Requests</h2>
      <ScrollArea className="h-[300px]">
        <div className="space-y-2">
          {requests?.map((request) => (
            <div
              key={request._id}
              className="flex items-center justify-between p-2 rounded-lg hover:bg-accent"
            >
              <div className="flex items-center gap-2">
                <Avatar>
                  <AvatarImage
                    src={request.profilePic}
                    alt={request.username}
                  />
                  <AvatarFallback>{request.username[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium">{request.fullName}</p>
                  <p className="text-sm text-muted-foreground">
                    @{request.username}
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRequest(request._id, "accept")}
                >
                  <Check className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => handleRequest(request._id, "reject")}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
