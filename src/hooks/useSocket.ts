import { useEffect, useRef } from "react";
import { io, Socket } from "socket.io-client";
import useAuthStore from "@/store/authStore";
import useChatStore from "@/store/chatStore";

export const useSocket = () => {
  const socketRef = useRef<Socket | null>(null);
  const token = useAuthStore((state) => state.token);
  const setOnlineUsers = useChatStore((state) => state.setOnlineUsers);
  const addMessage = useChatStore((state) => state.addMessage);

  useEffect(() => {
    if (!token) return;

    socketRef.current = io("http://localhost:3000", {
      auth: { token },
    });

    socketRef.current.on("connect", () => {
      console.log("Connected to socket server");
    });

    socketRef.current.on("onlineUsers", (users) => {
      setOnlineUsers(users);
    });

    socketRef.current.on("newMessage", (message) => {
      addMessage(message);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [token, setOnlineUsers, addMessage]);

  return socketRef.current;
};
