import { Command, User, UserCommand } from "./entities";
import {
  CreateUsercommandRequest,
  LoginUserRequest,
  RegisterUserRequest,
  UserCommandListRequestQuery,
} from "./request.types";
import { CommandsResponse, UserCommandsResponse } from "./response.types";

export interface AuthStates {
  user: null | User;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginUserRequest) => Promise<void>;
  register: (userData: RegisterUserRequest) => Promise<void>;
  setUser: (user: User) => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  logout: () => void;
}

export interface CommandStates {
  systemCommands: Command[];
  userCommands: UserCommand[];
  searchResults: UserCommand[];
  isLoading: boolean;
  isSearching: boolean;
  error: null | string;
  currentPage: number;
  paginationMeta: UserCommandsResponse["meta"] | null;
}

export interface CommandsActions {
  searchSystemCommands: (
    query: string,
    store?: boolean
  ) => Promise<CommandsResponse | undefined>;
  getUserCommands: (params: UserCommandListRequestQuery) => Promise<void>;
  searchUserCommands: (
    args: string,
    store?: boolean
  ) => Promise<UserCommandsResponse | undefined>;
  createUserCommand: (command: CreateUsercommandRequest) => Promise<void>;
  clearError: () => void;
  setCurrentPage: (page: number) => void;
  clearSearchResults: () => void;
}
