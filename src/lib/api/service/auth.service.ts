import { ApiClient } from '../client.api';
import { 
  RegisterUser, 
  LoginUser, 
  User, 
  LoginResponse, 
  RefreshTokenResponse 
} from '@/types/auth';
import { API_ENDPOINTS } from '@/config/api.config';

export class AuthService {
  constructor(private apiClient: ApiClient) {}

  async register(userData: RegisterUser): Promise<User> {
    const response = await this.apiClient.post<User>(
      API_ENDPOINTS.AUTH.REGISTER,
      userData
    );
    return response.data;
  }

  async login(credentials: LoginUser): Promise<LoginResponse> {
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
}
