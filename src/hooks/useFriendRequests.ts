import { useState, useEffect, useCallback } from "react";
import { toast } from "sonner";
import { users } from "@/lib/api";
import { FriendRequest } from "@/types";
import { socketService } from "@/lib/socket-service";
import { conversations_api } from "@/lib/api";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";

export const useFriendRequests = () => {
  const queryClient = useQueryClient();
  const [processingId, setProcessingId] = useState<string | null>(null);

  const { data: requests = [], isLoading } = useQuery({
    queryKey: ["friendRequests"],
    queryFn: async () => {
      try {
        const response = await users.getPendingFriendRequests();
        return response.pendingFriendRequests || [];
      } catch (error) {
        console.error("Failed to fetch friend requests:", error);
        throw new Error("Failed to fetch friend requests");
      }
    },
    retry: 2,
    staleTime: 30000, // Consider data fresh for 30 seconds
  });

  const { mutateAsync: handleRequest } = useMutation({
    mutationFn: async ({
      requestId,
      action,
    }: {
      requestId: string;
      action: "accept" | "reject";
    }) => {
      setProcessingId(requestId);
      try {
        await users[
          action === "accept" ? "acceptFriendRequest" : "rejectFriendRequest"
        ](requestId);

        socketService.emitFriendRequestResponse(requestId, action);

        if (action === "accept") {
          await conversations_api.create(requestId);
        }

        return { requestId, action };
      } finally {
        setProcessingId(null);
      }
    },
    onSuccess: ({ requestId, action }) => {
      queryClient.setQueryData<FriendRequest[]>(
        ["friendRequests"],
        (old = []) => old.filter((req) => req._id !== requestId)
      );
      toast.success(`Friend request ${action}ed`);
    },
    onError: (error, { action }) => {
      console.error(`Failed to ${action} friend request:`, error);
      toast.error(`Failed to ${action} friend request`);
    },
  });

  // Listen for real-time updates
  useEffect(() => {
    const socket = socketService.getSocket();

    if (!socket) return;

    const handleNewRequest = (request: FriendRequest) => {
      queryClient.setQueryData<FriendRequest[]>(
        ["friendRequests"],
        (old = []) => [...old, request]
      );
    };

    socket.on("friendRequest", handleNewRequest);

    return () => {
      socket.off("friendRequest", handleNewRequest);
    };
  }, [queryClient]);

  return {
    requests,
    isLoading,
    processingId,
    handleRequest: (requestId: string, action: "accept" | "reject") =>
      handleRequest({ requestId, action }),
  };
};
