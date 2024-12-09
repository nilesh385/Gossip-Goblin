import { ComponentType, Suspense, lazy } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { Loader2 } from "lucide-react";

const ChatWindow = lazy<ComponentType<any>>(() => import("./ChatWindow"));
const MessageList = lazy(() => import("./MessageList"));
const MessageInput = lazy(() => import("./MessageInput"));

const LoadingFallback = () => (
  <div className="h-full flex items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-primary" />
  </div>
);

const ErrorFallback = ({ error, resetErrorBoundary }: any) => (
  <div className="h-full flex flex-col items-center justify-center p-4">
    <h2 className="text-xl font-semibold text-destructive mb-2">
      Something went wrong
    </h2>
    <p className="text-muted-foreground mb-4">{error.message}</p>
    <button
      onClick={resetErrorBoundary}
      className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
    >
      Try again
    </button>
  </div>
);

export const ChatContainer = () => {
  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <div className="h-full flex flex-col">
        <Suspense fallback={<LoadingFallback />}>
          <ChatWindow />
          <div className="flex-1 overflow-hidden">
            <MessageList />
          </div>
          <MessageInput />
        </Suspense>
      </div>
    </ErrorBoundary>
  );
};

export default ChatContainer;
