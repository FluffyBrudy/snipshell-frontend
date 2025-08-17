import { create } from "zustand";

import apiClient from "@/lib/api/client.api";
import { GenericAxiosError } from "@/types/error.types";
import { CommandsActions, CommandStates } from "@/types/store";

export const useCommandsStore = create<CommandStates & CommandsActions>(
  (set, get) => ({
    systemCommands: [],
    userCommands: [],
    isLoading: false,
    error: null,
    currentPage: 1,

    searchSystemCommands: async (query: string, store = false) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.commands.searchSystemCommands(query);
        if (store) {
          set({
            systemCommands: response.commands,
            isLoading: false,
          });
        } else {
          return { commands: response.commands };
        }
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError.data?.message || "Failed to search commands",
          isLoading: false,
        });
        throw error;
      }
    },

    getUserCommands: async (params) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.commands.getUserCommands(params);
        set({
          userCommands: response.commands,
          isLoading: false,
          currentPage: params?.page || 1,
        });
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError.data?.message || "Failed to get user commands",
          isLoading: false,
        });
        throw error;
      }
    },

    searchUserCommands: async (args: string, store = false) => {
      set({ isLoading: true, error: null });
      try {
        const response = await apiClient.commands.searchUserCommands(args);
        if (store) {
          set({
            userCommands: response.commands,
            isLoading: false,
          });
        } else {
          return { commands: response.commands };
        }
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError?.data?.message || "Failed to search user commands",
          isLoading: false,
        });
        throw error;
      }
    },

    createUserCommand: async (command) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.commands.createUserCommand(command);
        await get().getUserCommands({ page: get().currentPage });
        set({ isLoading: false });
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError.data?.message || "Failed to create user command",
          isLoading: false,
        });
        throw error;
      }
    },

    clearError: () => {
      set({ error: null });
    },

    setCurrentPage: (page: number) => {
      set({ currentPage: page });
    },
  })
);
