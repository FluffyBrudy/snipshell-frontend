import axios, { AxiosInstance, AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { AuthService } from './service/auth.service';
import { CommandsService } from './service/commands.service';
import { AUTH_REFRESH_TOKEN_POST } from '@/config/api.config';

export class ApiClient {
  private client: AxiosInstance;
  
  public auth: AuthService;
  public commands: CommandsService;

  constructor() {
    this.client = axios.create({
      baseURL: "",
      withCredentials: true
    });

    this.client.interceptors.request.use(
      (config) => {
        const token = localStorage.getItem('accessToken');
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );
    

    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        
        const isRetryableRoute = this.isAutoTokenGeneratableRoute(originalRequest.url)
        if (isRetryableRoute && error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          try {
            const refreshResponse = await this.refreshToken();
            const newToken = refreshResponse.data.accessToken;
            localStorage.setItem('accessToken', newToken);
            
            originalRequest.headers.Authorization = `Bearer ${newToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            localStorage.removeItem('accessToken');
            const {response} = refreshError as AxiosError
            return Promise.reject({
              data: response?.data || {},
              statusText: response?.statusText || "internal server error",
              status: response?.status || 500
            });
          }
        }
        const {response} = error as AxiosError
        return Promise.reject({
          data: response?.data || {},
          statusText: response?.statusText || "internal server error",
          status: response?.status || 500
        });
      }
    );

    this.auth = new AuthService(this);
    this.commands = new CommandsService(this);
  }

  private isAutoTokenGeneratableRoute(route: unknown) {
    if (typeof route !== "string")
      return false
    const endPath = route.split("/").pop()
    return !!endPath && (!(["login", "register", "refresh-token"].includes(endPath)))
  }

  async get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  async post<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  async put<T>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  async delete<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  async refreshToken() {
    return this.client.post(AUTH_REFRESH_TOKEN_POST, {
      withCredentials: true
    });
  }

  setAuthToken(token: string) {
    localStorage.setItem('accessToken', token);
  }

  clearAuthToken() {
    localStorage.removeItem('accessToken');
  }
}


const apiClient = new ApiClient();

export default apiClient;
