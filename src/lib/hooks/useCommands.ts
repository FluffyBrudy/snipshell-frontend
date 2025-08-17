import { useCommandsStore } from '@/app/store';
import { useCallback } from 'react';
import { CreateUserCommand, UserCommandListParams } from '@/types/commands';

export const useCommands = () => {
  const {
    systemCommands,
    userCommands,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchSystemCommands,
    getUserCommands,
    searchUserCommands,
    createUserCommand,
    clearError,
    setCurrentPage,
  } = useCommandsStore();

  const handleSearchSystemCommands = useCallback(async (query: string) => {
    try {
      await searchSystemCommands(query);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [searchSystemCommands]);

  const handleGetUserCommands = useCallback(async (params?: UserCommandListParams) => {
    try {
      await getUserCommands(params);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [getUserCommands]);

  const handleSearchUserCommands = useCallback(async (args: string) => {
    try {
      await searchUserCommands(args);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [searchUserCommands]);

  const handleCreateUserCommand = useCallback(async (command: CreateUserCommand) => {
    try {
      await createUserCommand(command);
      return { success: true };
    } catch (error) {
      return { success: false, error };
    }
  }, [createUserCommand]);

  return {
    systemCommands,
    userCommands,
    isLoading,
    error,
    currentPage,
    totalPages,
    searchSystemCommands: handleSearchSystemCommands,
    getUserCommands: handleGetUserCommands,
    searchUserCommands: handleSearchUserCommands,
    createUserCommand: handleCreateUserCommand,
    clearError,
    setCurrentPage,
  };
};
