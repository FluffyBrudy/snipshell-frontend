import { ApiClient } from "../client.api";
import {
  CommandsResponse,
  UserCommandByUserIdResponse,
  UserCommandsResponse,
} from "@/types/response.types";
import { UserCommand, Command } from "@/types/entities";
import {
  CommandRequestQuery,
  EditUsercommandRequest,
  UserCommandListRequestQuery,
  UserCommandSearchRequestQuery,
} from "@/types/request.types";
import { CreateUsercommandRequest } from "@/types/request.types";
import { API_ENDPOINTS } from "@/config/api.config";

export class CommandsService {
  constructor(private apiClient: ApiClient) {}

  async searchSystemCommands(query: string): Promise<CommandsResponse> {
    const params: CommandRequestQuery = { command: query };
    const response = await this.apiClient.get<Command[]>(
      API_ENDPOINTS.COMMAND.SEARCH,
      { params }
    );
    return { commands: response.data };
  }

  async getUserCommands(
    params: UserCommandListRequestQuery
  ): Promise<UserCommandsResponse> {
    const response = await this.apiClient.get<UserCommandByUserIdResponse>(
      API_ENDPOINTS.USER_COMMAND.LIST,
      { params }
    );

    if (response.data?.commands?.data) {
      const c = response.data.commands;
      const transformed: UserCommand[] = c.data.map((item: UserCommand) => ({
        id: item.id,
        userId: item.userId,
        arguments: item.arguments,
        note:
          typeof item.note === "string"
            ? JSON.parse(item.note)
            : item.note || {},
        createdAt: item.createdAt,
        command: item.command,
        tags: Array.isArray(item.tags) ? item.tags : [],
      }));
      return {
        commands: transformed,
        meta: {
          page: c.page,
          pageSize: c.pageSize,
          total: c.total,
          totalPages: c.totalPages,
          hasNextPage: c.hasNextPage,
          hasPrevPage: c.hasPrevPage,
        },
      };
    }

    return { commands: [] };
  }

  async searchUserCommands(args: string): Promise<UserCommandsResponse> {
    const params: UserCommandSearchRequestQuery = { args };
    const response = await this.apiClient.get<UserCommand[]>(
      API_ENDPOINTS.USER_COMMAND.SEARCH,
      { params }
    );

    const transformed: UserCommand[] = (
      Array.isArray(response.data) ? response.data : []
    ).map((item: UserCommand) => ({
      id: item.id,
      userId: item.userId,
      arguments: item.arguments,
      note:
        typeof item.note === "string" ? JSON.parse(item.note) : item.note || {},
      createdAt: item.createdAt,
      command: item.command,
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));

    return { commands: transformed };
  }

  async searchUserCommandsByTags(
    tags: string[]
  ): Promise<UserCommandsResponse> {
    const response = await this.apiClient.get<UserCommand>(
      API_ENDPOINTS.USER_COMMAND.SEARCH_BY_TAGS,
      { params: { tags } }
    );

    const transformed: UserCommand[] = (
      Array.isArray(response.data) ? response.data : []
    ).map((item: UserCommand) => ({
      id: item.id,
      userId: item.userId,
      arguments: item.arguments,
      note:
        typeof item.note === "string" ? JSON.parse(item.note) : item.note || {},
      createdAt: item.createdAt,
      command: item.command,
      tags: Array.isArray(item.tags) ? item.tags : [],
    }));

    return { commands: transformed };
  }

  async createUserCommand(
    command: CreateUsercommandRequest
  ): Promise<UserCommand> {
    const response = await this.apiClient.post<UserCommand>(
      API_ENDPOINTS.USER_COMMAND.CREATE,
      command
    );

    const data = response.data;
    return {
      id: data.id,
      userId: data.userId,
      arguments: data.arguments,
      note:
        typeof data.note === "string" ? JSON.parse(data.note) : data.note || {},
      createdAt: data.createdAt,
      command: data.command,
      tags: Array.isArray(data.tags) ? data.tags : [],
    };
  }

  async editUserCommand(
    userCommandId: UserCommand["id"],
    updateableFields: Partial<EditUsercommandRequest>
  ): Promise<UserCommand> {
    const response = await this.apiClient.put<UserCommand>(
      API_ENDPOINTS.USER_COMMAND.EDIT,
      updateableFields,
      { params: { id: userCommandId } }
    );
    return response.data;
  }

  async deleteUserCommand(userCommandId: UserCommand["id"]): Promise<void> {
    await this.apiClient.delete<void>(API_ENDPOINTS.USER_COMMAND.EDIT, {
      params: { id: userCommandId },
    });
  }
}
