export interface User {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  profilePic: string;
  bio: string;
}

export interface FriendRequest {
  _id: string;
  email: string;
  username: string;
  fullName: string;
  profilePic: string;
  bio: string;
  status: "pending" | "accepted" | "rejected";
  createdAt: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  content: string;
  type: "text" | "image" | "file";
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  lastMessage?: Message;
  isGroup: boolean;
  name?: string;
  createdAt: string;
  updatedAt: string;
}
