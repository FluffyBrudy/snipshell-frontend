import { Tag } from "./tags";

export interface Command {
  id: number;
  command: string;
}

export interface CommandsResponse {
  commands: Command[];
}

export interface CreateUserCommand {
  command: string;
  arguments: string;
  note: Record<string, unknown>;
  tags: string[];
}



export interface UserCommand {
  id: number;
  commandId: number;
  userId: number;
  arguments: string;
  note: Record<string, unknown>;
  createdAt: string;
  tags: Tag[];
}

export interface UserCommandsResponse {
  commands: UserCommand[];
}

export interface CommandSearchParams {
  command: string;
}

export interface UserCommandListParams {
  page?: number;
  order?: 'ASC' | 'DESC';
}

export interface UserCommandSearchParams {
  args: string;
}

export interface CommandsState {
  systemCommands: Command[];
  userCommands: UserCommand[];
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
}

export interface CommandsActions {
  searchSystemCommands: (query: string) => Promise<void>;
  getUserCommands: (params?: UserCommandListParams) => Promise<void>;
  searchUserCommands: (args: string) => Promise<void>;
  createUserCommand: (command: CreateUserCommand) => Promise<void>;
  clearError: () => void;
  setCurrentPage: (page: number) => void;
}

export type PostResponse = UserCommand;
export type CommentReplyResponse = Command;
