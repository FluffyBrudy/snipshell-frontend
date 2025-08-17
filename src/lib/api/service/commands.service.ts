import { ApiClient } from '../client.api';
import { 
  CommandsResponse, 
  UserCommandsResponse, 
  CreateUserCommand,
  CommandSearchParams,
  UserCommandListParams,
  UserCommandSearchParams,
  UserCommand
} from '@/types/commands';
import { API_ENDPOINTS } from '@/config/api.config';

export class CommandsService {
  constructor(private apiClient: ApiClient) {}

  async searchSystemCommands(query: string): Promise<CommandsResponse> {
    const params: CommandSearchParams = { command: query };
    const response = await this.apiClient.get<CommandsResponse>(
      API_ENDPOINTS.COMMAND.SEARCH,
      { params }
    );
    return response.data;
  }

  async getUserCommands(params?: UserCommandListParams): Promise<UserCommandsResponse> {
    const response = await this.apiClient.get<UserCommandsResponse>(
      API_ENDPOINTS.USER_COMMAND.LIST,
      { params }
    );
    return response.data;
  }

  async searchUserCommands(args: string): Promise<UserCommandsResponse> {
    const params: UserCommandSearchParams = { args };
    const response = await this.apiClient.get<UserCommandsResponse>(
      API_ENDPOINTS.USER_COMMAND.SEARCH,
      { params }
    );
    return response.data;
  }

  async createUserCommand(command: CreateUserCommand): Promise<UserCommand> {
    const response = await this.apiClient.post<UserCommand>(
      API_ENDPOINTS.USER_COMMAND.CREATE,
      command
    );
    return response.data;
  }
}
