import { useCallback, useRef } from 'react';
import { getSocket } from '@/lib/socket';
import useChatStore from '@/store/chatStore';
import useAuthStore from '@/store/authStore';

export const useTyping = () => {
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const activeConversation = useChatStore((state) => state.activeConversation);
  const user = useAuthStore((state) => state.user);

  const emitTyping = useCallback(() => {
    const socket = getSocket();
    if (!socket || !activeConversation || !user) return;

    socket.emit('typing', {
      conversationId: activeConversation,
      username: user.username,
    });

    clearTimeout(typingTimeoutRef.current);
    typingTimeoutRef.current = setTimeout(() => {
      socket.emit('stopTyping', activeConversation);
    }, 3000);
  }, [activeConversation, user]);

  return { emitTyping };
};