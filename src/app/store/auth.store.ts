import { create } from "zustand";
import apiClient from "@/lib/api/client.api";
import { GenericAxiosError } from "@/types/error.types";
import { AuthActions, AuthStates } from "@/types/store";

export const useAuthStore = create<AuthStates & AuthActions>((set, get) => ({
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  login: async (credentials) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.auth.login(credentials);
      apiClient.setAuthToken(response.accessToken);

      set({
        isAuthenticated: true,
        isLoading: false,
        user: null,
      });
    } catch (error: unknown) {
      const apiError = error as GenericAxiosError;
      set({
        error: apiError.data?.message || "Login failed",
        isLoading: false,
      });
      throw error;
    }
  },

  register: async (userData) => {
    set({ isLoading: true, error: null });
    try {
      const user = await apiClient.auth.register(userData);
      set({
        user,
        isAuthenticated: true,
        isLoading: false,
      });
    } catch (error: unknown) {
      const apiError = error as GenericAxiosError;
      set({
        error: apiError.data?.message || "Registration failed",
        isLoading: false,
      });
      throw error;
    }
  },

  logout: () => {
    apiClient.clearAuthToken();
    set({
      user: null,
      isAuthenticated: false,
      error: null,
    });
  },

  refreshToken: async () => {
    try {
      const response = await apiClient.auth.refreshToken();
      apiClient.setAuthToken(response.accessToken);
    } catch (error: unknown) {
      get().logout();
      throw error;
    }
  },

  clearError: () => {
    set({ error: null });
  },

  setUser: (user) => {
    set({ user, isAuthenticated: true });
  },

  onvisit: async () => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      await get()
        .refreshToken()
        .then(() => {
          set({ isAuthenticated: true });
        })
        .catch();
    }
  },
}));
