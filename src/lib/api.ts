import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Request interceptor for authentication
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("auth-token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    console.log(token);
  }
  return config;
});

export const auth = {
  login: async (data: { emailOrUsername: string; password: string }) => {
    const response = await api.post("/api/auth/login", data, {
      headers: { "Content-Type": "application/json" },
    });
    return response.data;
  },
  signup: async (data: FormData) => {
    const response = await api.post("/api/auth/signup", data, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};

export const messages = {
  getMessages: async (conversationId: string, params = {}) => {
    const response = await api.get(`/api/messages/${conversationId}`, {
      params,
    });
    return response.data;
  },
  sendMessage: async (data: {
    conversationId: string;
    content: string;
    type?: string;
  }) => {
    const response = await api.post("/api/messages", data);
    return response.data;
  },
  markAsRead: async (messageId: string) => {
    const response = await api.patch(`/api/messages/${messageId}/read`);
    return response.data;
  },
};

export const conversations_api = {
  getAll: async () => {
    const response = await api.get("/api/conversations");
    return response.data;
  },
  create: async (participantId: string) => {
    const response = await api.post("/api/conversations", { participantId });
    return response.data;
  },
  delete: async (conversationId: string) => {
    const response = await api.delete(`/api/conversations/${conversationId}`);
    return response.data;
  },
};

export const users = {
  updateProfile: async (data: FormData) => {
    const response = await api.patch("/api/users/profile", data);
    return response.data;
  },
  searchUsers: async (query: string) => {
    const response = await api.get(`/api/users/search?query=${query}`);
    return response.data;
  },
  sendFriendRequest: async (userId: string) => {
    const response = await api.post(`/api/users/friend-request/${userId}`);
    return response.data;
  },
  acceptFriendRequest: async (userId: string) => {
    const response = await api.post(
      `/api/users/friend-request/${userId}/accept`
    );
    return response.data;
  },
  rejectFriendRequest: async (userId: string) => {
    const response = await api.post(
      `/api/users/friend-request/${userId}/reject`
    );
    return response.data;
  },
  removeFriend: async (friendId: string) => {
    const response = await api.delete(`/api/users/friends/${friendId}`);
    return response.data;
  },
  blockUser: async (userId: string) => {
    const response = await api.post(`/api/users/block/${userId}`);
    return response.data;
  },
  getPendingFriendRequests: async () => {
    const response = await api.get(`/api/users/pending-friend-requests`);
    return response.data;
  },
  getAllFriends: async () => {
    const response = await api.get(`/api/users/all-friends`);
    return response.data;
  },
};

export default api;
