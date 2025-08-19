import { Command, UserCommand } from "./entities";

export interface LoginResponse {
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface CommandsResponse {
  commands: Command[];
}

export interface UserCommandsResponse {
  commands: UserCommand[];
  meta?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
