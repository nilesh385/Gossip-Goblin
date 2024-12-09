import { create } from "zustand";
import { Message, Conversation } from "@/types";

interface ChatState {
  activeConversation: Conversation | null;
  messages: Message[];
  onlineUsers: string[];
  typingUsers: Record<string, string>;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  updateMessageStatus: (messageId: string, read: boolean) => void;
  setOnlineUsers: (users: string[]) => void;
  setTypingUser: (conversationId: string, username: string) => void;
  removeTypingUser: (conversationId: string) => void;
  clearChat: () => void;
}

const useChatStore = create<ChatState>((set) => ({
  activeConversation: null,
  messages: [],
  onlineUsers: [],
  typingUsers: {},
  setActiveConversation: (conversation) =>
    set({ activeConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  updateMessageStatus: (messageId, read) =>
    set((state) => ({
      messages: state.messages.map((msg) =>
        msg._id === messageId ? { ...msg, read } : msg
      ),
    })),
  setOnlineUsers: (users) => set({ onlineUsers: users }),
  setTypingUser: (conversationId, username) =>
    set((state) => ({
      typingUsers: { ...state.typingUsers, [conversationId]: username },
    })),
  removeTypingUser: (conversationId) =>
    set((state) => {
      const { [conversationId]: _, ...rest } = state.typingUsers;
      return { typingUsers: rest };
    }),
  clearChat: () => set({ messages: [], activeConversation: null }),
}));

export default useChatStore;
