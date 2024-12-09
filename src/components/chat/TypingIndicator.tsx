import { Loader2 } from 'lucide-react';

interface TypingIndicatorProps {
  username: string;
}

export const TypingIndicator = ({ username }: TypingIndicatorProps) => {
  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <Loader2 className="h-4 w-4 animate-spin" />
      <span>{username} is typing...</span>
    </div>
  );
};