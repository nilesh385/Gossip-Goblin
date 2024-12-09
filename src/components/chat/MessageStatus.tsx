import { Check, CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageStatusProps {
  isRead: boolean;
  className?: string;
}

export const MessageStatus = ({ isRead, className }: MessageStatusProps) => {
  return isRead ? (
    <CheckCheck className={cn('h-4 w-4', className)} />
  ) : (
    <Check className={cn('h-4 w-4', className)} />
  );
};