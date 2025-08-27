import { LoginUserRequest, RegisterUserRequest } from "@/types/request.types";
import { ApiClient } from "../client.api";
import { API_ENDPOINTS } from "@/config/api.config";
import { LoginResponse, RefreshTokenResponse } from "@/types/response.types";
import { User } from "@/types/entities";

export class AuthService {
  constructor(private apiClient: ApiClient) {}

  async register(userData: RegisterUserRequest): Promise<User> {
    const response = await this.apiClient.post<User>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  }

  async login(credentials: LoginUserRequest): Promise<LoginResponse> {
    const response = await this.apiClient.post<LoginResponse>(
      API_ENDPOINTS.AUTH.LOGIN,
      credentials
    );
    return response.data;
  }

  async refreshToken(): Promise<RefreshTokenResponse> {
    const response = await this.apiClient.post<RefreshTokenResponse>(
      API_ENDPOINTS.AUTH.REFRESH_TOKEN
    );
    return response.data;
  }

  async logout(): Promise<{ message: string }> {
    const response = await this.apiClient.post<{ message: string }>(
      API_ENDPOINTS.AUTH.LOGOUT
    );
    return response.data;
  }
}
