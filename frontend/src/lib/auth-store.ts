import { create } from "zustand";
import { persist } from "zustand/middleware";
import { userApi } from "./api";

interface User {
  id: string;
  email: string;
  name?: string;
  isVip: boolean;
  avatar?: string;
}

interface AuthState {
  access_token: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isUpdatingProfile: boolean;
  setAuth: (access_token: string, user: User) => void;
  logout: () => void;
  updateProfile: (name: string) => Promise<void>;
  updateAvatar: (file: File) => Promise<void>;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      access_token: null,
      user: null,
      isAuthenticated: false,
      isUpdatingProfile: false,
      setAuth: (access_token, user) => {
        set({ access_token, user, isAuthenticated: true });
        try {
          localStorage.setItem("token", access_token);
        } catch (e) {}
      },
      logout: () => {
        set({ access_token: null, user: null, isAuthenticated: false });
        try {
          localStorage.removeItem("token");
          localStorage.removeItem("nostella-auth");
        } catch (e) {}
      },
      updateProfile: async (name: string) => {
        set({ isUpdatingProfile: true });
        try {
          await userApi.updateProfile(name);
          const currentUser = get().user;
          if (currentUser) {
            set({ user: { ...currentUser, name: name } });
          }
        } finally {
          set({ isUpdatingProfile: false });
        }
      },
      updateAvatar: async (file: File) => {
        try {
          const updatedUser = (await userApi.updateAvatar(file)) as User;

          set((state) => ({
            user: state.user
              ? { ...state.user, avatar: updatedUser.avatar }
              : null,
          }));
        } catch (error) {
          throw error;
        }
      },
    }),
    {
      name: "nostella-auth",
      partialize: (state) => ({
        access_token: state.access_token,
        user: state.user,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
