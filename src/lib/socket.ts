import { io, Socket } from 'socket.io-client';
import { toast } from 'sonner';

let socket: Socket | null = null;

export const initializeSocket = (token: string) => {
  if (socket?.connected) return socket;

  socket = io(import.meta.env.VITE_API_URL, {
    auth: { token },
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionAttempts: 5,
  });

  socket.on('connect', () => {
    console.log('Connected to socket server');
    socket?.emit('joinConversations');
  });

  socket.on('connect_error', (error) => {
    console.error('Socket connection error:', error);
    toast.error('Connection error. Please try again.');
  });

  socket.on('reconnect_attempt', (attemptNumber) => {
    console.log(`Reconnection attempt ${attemptNumber}`);
  });

  socket.on('reconnect_failed', () => {
    toast.error('Failed to reconnect. Please refresh the page.');
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket?.connected) {
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export default {
  initializeSocket,
  disconnectSocket,
  getSocket,
};