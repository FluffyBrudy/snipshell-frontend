import { create } from "zustand";

import apiClient from "@/lib/api/client.api";
import type { GenericAxiosError } from "@/types/error.types";
import type { CommandsActions, CommandStates } from "@/types/store";
import { UserCommand } from "@/types/entities";

export const useCommandsStore = create<CommandStates & CommandsActions>(
  (set, get) => ({
    systemCommands: [],
    userCommands: [],
    searchResults: [],
    isLoading: false,
    isSearching: false,
    error: null,
    currentPage: 1,
    paginationMeta: null,

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
          paginationMeta: response.meta,
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
      set({ isSearching: true, error: null });
      try {
        const response = await apiClient.commands.searchUserCommands(args);
        if (store) {
          set({
            searchResults: response.commands,
            isSearching: false,
          });
        } else {
          return { commands: response.commands };
        }
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError?.data?.message || "Failed to search user commands",
          isSearching: false,
        });
        throw error;
      }
    },

    searchUserCommandsByTags: async (tags: string[], store = false) => {
      set({ isSearching: true, error: null });
      try {
        const response = await apiClient.commands.searchUserCommandsByTags(
          tags
        );
        if (store) {
          set({
            searchResults: response.commands,
            isSearching: false,
          });
        } else {
          return { commands: response.commands };
        }
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error:
            apiError?.data?.message || "Failed to search user commands by tags",
          isSearching: false,
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

    editUserCommand: async (userCommandId, updateableFields) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.commands.editUserCommand(
          userCommandId,
          updateableFields
        );
        await get().getUserCommands({ page: get().currentPage });
        set({ isLoading: false });
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError.data?.message || "Failed to update user command",
          isLoading: false,
        });
        throw error;
      }
    },

    deleteUserCommand: async (userCommandId) => {
      set({ isLoading: true, error: null });
      try {
        await apiClient.commands.deleteUserCommand(userCommandId);
        await get().getUserCommands({ page: get().currentPage });
        set({ isLoading: false });
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError.data?.message || "Failed to delete user command",
          isLoading: false,
        });
        throw error;
      }
    },

    toggleUserCommandFavourite: async (userCommandId) => {
      try {
        const response = await apiClient.commands.toggleUserCommandFavourite(
          userCommandId
        );

        const updateCommand = (command: UserCommand) =>
          command.id === userCommandId
            ? { ...command, isFavourite: response.action === "ADD" }
            : command;

        set((state) => ({
          userCommands: state.userCommands.map(updateCommand),
          searchResults: state.searchResults.map(updateCommand),
        }));
      } catch (error: unknown) {
        const apiError = error as GenericAxiosError;
        set({
          error: apiError.data?.message || "Failed to toggle favourite",
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

    clearSearchResults: () => {
      set({ searchResults: [] });
    },
  })
);
