import { create } from "zustand";
import { persist } from "zustand/middleware";
import { disconnectSocket } from "@/lib/socket";
import { User } from "@/types";

interface AuthState {
  user: User | null;
  token: string | null;
  error: string | null;
  setAuth: (user: User, token: string) => void;
  logout: () => void;
  updateUser: (user: User) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      error: null,
      setAuth: (user, token) => {
        localStorage.setItem("auth-token", token);
        set({ user, token, error: null });
      },
      logout: () => {
        localStorage.removeItem("auth-token");
        disconnectSocket();
        set({ user: null, token: null, error: null });
      },
      updateUser: (user) => set({ user }),
    }),
    {
      name: "auth-store",
      partialize: (state) => ({ token: state.token, user: state.user }),
    }
  )
);

export default useAuthStore;
