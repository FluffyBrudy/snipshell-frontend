import { AxiosResponse } from "axios";

export interface RegisterUser {
  displayName: string;
  email: string;
  password: string;
}

export interface LoginUser {
  email: string;
  password: string;
}

export interface User {
  id: number;
  displayName: string;
  email: string;
  role: 'owner' | 'helper' | 'viewer';
}

export interface LoginResponse {
  accessToken: string;
}

export interface RefreshTokenResponse {
  accessToken: string;
}

export interface AuthError {
  statusCode: number;
  message: string | string[];
  error: string;
}

export interface GenericAxiosError {
  data: AxiosResponse["data"]
  statusText: AxiosResponse["statusText"],
  status: AxiosResponse["status"]
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface AuthActions {
  login: (credentials: LoginUser) => Promise<void>;
  register: (userData: RegisterUser) => Promise<void>;
  logout: () => void;
  refreshToken: () => Promise<void>;
  clearError: () => void;
  setUser: (user: User) => void;
}

export type UserForStore = Omit<User, 'password'>;
