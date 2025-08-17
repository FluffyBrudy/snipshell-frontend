import { create } from 'zustand';
import { 
  CommandsState, 
  CommandsActions, 
  CreateUserCommand,
  UserCommandListParams
} from '@/types/commands';
import { apiClient } from '@/lib/api';

interface ApiError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export const useCommandsStore = create<CommandsState & CommandsActions>((set, get) => ({
  systemCommands: [],
  userCommands: [],
  isLoading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,

  searchSystemCommands: async (query: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.commands.searchSystemCommands(query);
      set({ 
        systemCommands: response.commands, 
        isLoading: false 
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ 
        error: apiError.response?.data?.message || 'Failed to search commands', 
        isLoading: false 
      });
      throw error;
    }
  },

  getUserCommands: async (params?: UserCommandListParams) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.commands.getUserCommands(params);
      set({ 
        userCommands: response.commands, 
        isLoading: false,
        currentPage: params?.page || 1
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ 
        error: apiError.response?.data?.message || 'Failed to get user commands', 
        isLoading: false 
      });
      throw error;
    }
  },

  searchUserCommands: async (args: string) => {
    set({ isLoading: true, error: null });
    try {
      const response = await apiClient.commands.searchUserCommands(args);
      set({ 
        userCommands: response.commands, 
        isLoading: false 
      });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ 
        error: apiError.response?.data?.message || 'Failed to search user commands', 
        isLoading: false 
      });
      throw error;
    }
  },

  createUserCommand: async (command: CreateUserCommand) => {
    set({ isLoading: true, error: null });
    try {
      await apiClient.commands.createUserCommand(command);
      await get().getUserCommands({ page: get().currentPage });
      set({ isLoading: false });
    } catch (error: unknown) {
      const apiError = error as ApiError;
      set({ 
        error: apiError.response?.data?.message || 'Failed to create user command', 
        isLoading: false 
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
}));
