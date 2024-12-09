import { useState, Suspense } from "react";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ErrorBoundary } from "react-error-boundary";
import { useFriendRequests } from "@/hooks/useFriendRequests";
import { FriendRequestItem } from "./FriendRequestItem";
import { FriendRequestSkeleton } from "./FriendRequestSkeleton";

const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="text-center p-4">
    <p className="text-destructive mb-4">Failed to load friend requests</p>
    <Button onClick={resetErrorBoundary}>Try again</Button>
  </div>
);

export const FriendRequestsDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const { requests, isLoading, handleRequest } = useFriendRequests();

  const handleAccept = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await handleRequest(requestId, "accept");
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId: string) => {
    setProcessingId(requestId);
    try {
      await handleRequest(requestId, "reject");
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="h-5 w-5" />
          {requests?.length > 0 && (
            <Badge
              variant="destructive"
              className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center"
            >
              {requests.length}
            </Badge>
          )}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Friend Requests</DialogTitle>
        </DialogHeader>
        <ErrorBoundary
          FallbackComponent={ErrorFallback}
          onReset={() => window.location.reload()}
        >
          <ScrollArea className="h-[400px] pr-4">
            <Suspense fallback={<FriendRequestSkeleton />}>
              {isLoading ? (
                <FriendRequestSkeleton />
              ) : requests?.length === 0 ? (
                <div className="text-center text-muted-foreground p-4">
                  No pending friend requests
                </div>
              ) : (
                <div className="space-y-4">
                  {requests?.map((request) => (
                    <FriendRequestItem
                      key={request._id}
                      request={request}
                      onAccept={handleAccept}
                      onReject={handleReject}
                      isProcessing={processingId === request._id}
                    />
                  ))}
                </div>
              )}
            </Suspense>
          </ScrollArea>
        </ErrorBoundary>
      </DialogContent>
    </Dialog>
  );
};