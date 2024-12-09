import { Socket } from "socket.io-client";
import { toast } from "sonner";
import useChatStore from "@/store/chatStore";
import { Message, User, FriendRequest } from "@/types";

export class SocketService {
  private static instance: SocketService;
  private socket: Socket | null = null;

  private constructor() {}

  static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  initialize(socket: Socket) {
    this.socket = socket;
    this.setupEventListeners();
  }

  private setupEventListeners() {
    if (!this.socket) return;

    // Connection events
    this.socket.on("connect", () => {
      console.log("Connected to socket server");
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      toast.error("Connection error. Please try again.");
    });

    // Friend request events
    this.socket.on("friendRequest", (request: FriendRequest) => {
      toast.info(`New friend request from ${request.username}`, {
        action: {
          label: "View",
          onClick: () => {
            // Implement navigation to friend requests
          },
        },
      });
    });

    this.socket.on("friendRequestAccepted", (user: User) => {
      toast.success(`${user.username} accepted your friend request`);
    });

    this.socket.on("friendRequestRejected", (user: User) => {
      toast.info(`${user.username} declined your friend request`);
    });

    // Chat events
    this.socket.on("newMessage", (message: Message) => {
      useChatStore.getState().addMessage(message);
    });

    this.socket.on("messageRead", ({ messageId, conversationId }) => {
      useChatStore.getState().updateMessageStatus(messageId, true);
    });

    // Online status events
    this.socket.on("userOnline", (userId: string) => {
      const onlineUsers = useChatStore.getState().onlineUsers;
      if (!onlineUsers.includes(userId)) {
        useChatStore.getState().setOnlineUsers([...onlineUsers, userId]);
      }
    });

    this.socket.on("userOffline", (userId: string) => {
      const onlineUsers = useChatStore.getState().onlineUsers;
      useChatStore
        .getState()
        .setOnlineUsers(onlineUsers.filter((id) => id !== userId));
    });
  }

  // Emit events
  emitFriendRequestResponse(requestId: string, action: "accept" | "reject") {
    this.socket?.emit("friendRequestResponse", { requestId, action });
  }

  emitTyping(conversationId: string, username: string) {
    this.socket?.emit("typing", { conversationId, username });
  }

  emitStopTyping(conversationId: string) {
    this.socket?.emit("stopTyping", conversationId);
  }

  emitMessageRead(messageId: string, conversationId: string) {
    this.socket?.emit("messageRead", { messageId, conversationId });
  }

  getSocket = () => this.socket;
  disconnect() {
    this.socket?.disconnect();
    this.socket = null;
  }
}

export const socketService = SocketService.getInstance();
