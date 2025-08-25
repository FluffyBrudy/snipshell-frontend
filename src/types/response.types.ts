import { Command, Tag, UserCommand } from "./entities";

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

export interface UserCommandByUserIdResponse {
  commands: {
    data: {
      id: number;
      userId: number;
      arguments: string;
      note: Record<string, string>;
      createdAt: string;
      command: Command;
      tags: Tag[];
    }[];
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}
